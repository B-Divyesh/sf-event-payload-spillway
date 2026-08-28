import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import test, { after, before } from "node:test";
import { chromium } from "playwright";
import { MemoryStore, Spillway, generateKey } from "../dist/package/esm/index.js";

const port = 4175;
const origin = `http://127.0.0.1:${port}`;
const axePath = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
let server;
let browser;
const contentTypes = new Map([[".js", "text/javascript"], [".css", "text/css"], [".png", "image/png"], [".jpg", "image/jpeg"], [".webp", "image/webp"], [".svg", "image/svg+xml"], [".json", "application/json"], [".xml", "application/xml"]]);

async function waitForSite() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch(origin)).ok) return; } catch { /* starting */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Static test server did not start");
}

before(async () => {
  const root = join(process.cwd(), "dist/site");
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url, origin).pathname;
    const requested = pathname === "/" ? "index.html" : pathname === "/demo" ? "demo/index.html" : pathname.endsWith("/") ? `${pathname.slice(1)}index.html` : pathname.replace(/^\//u, "");
    const safe = normalize(requested).replace(/^\.\.(?:\/|\\|$)/u, "");
    try {
      const body = await readFile(join(root, safe));
      response.writeHead(200, { "content-type": contentTypes.get(extname(safe)) ?? "text/html" }); response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/html" }); response.end(await readFile(join(root, "404.html")));
    }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  await waitForSite();
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || chromium.executablePath() });
});
after(async () => { if (browser) await browser.close(); if (server) await new Promise((resolve) => server.close(resolve)); });

async function demoPage(viewport = { width: 390, height: 844 }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(`${origin}/demo`, { waitUntil: "networkidle" });
  await page.locator("#decision-label").getByText("Diverted").waitFor();
  return { context, page };
}

test("@claim:inline-reduction the exact shipped demo keeps the database row below 10%", async () => {
  const { context, page } = await demoPage();
  const raw = Number(await page.locator("#raw-bytes").getAttribute("data-bytes"));
  const inline = Number(await page.locator("#inline-bytes").getAttribute("data-bytes"));
  assert.ok(raw > 10_000, `sample should be substantial: ${raw}`);
  assert.ok(inline / raw < 0.10, `${inline} must be below 10% of ${raw}`);
  await context.close();
});

test("@claim:demo-media the shipped attachment is a valid PNG with matching metadata", async () => {
  const { context, page } = await demoPage();
  const payload = JSON.parse(await page.locator("#payload").inputValue());
  assert.equal(payload.result.mime, "image/png");
  assert.match(payload.result.filename, /\.png$/u);
  assert.equal(payload.result.width, 180);
  assert.equal(payload.result.height, 180);
  const bytes = Buffer.from(payload.result.attachment.split(",")[1], "base64");
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.ok(bytes.length > 10_000, "the sample must be a real image, not a repeated token");
  await context.close();
});

test("@claim:demo-seed /demo opens with a completed sample and Reset demo restores it", async () => {
  const { context, page } = await demoPage();
  await page.getByText("Demo — sample data, nothing is saved").waitFor();
  assert.match(await page.locator("#stub-output").innerText(), /\$spillway/u);
  await page.locator("#payload").fill('{"changed":"unique-reset-marker-8362"}');
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.locator("#decision-label").getByText("Diverted").waitFor();
  assert.match(await page.locator("#payload").inputValue(), /render\.complete/u);
  assert.doesNotMatch(await page.locator("#payload").inputValue(), /unique-reset-marker-8362/u);
  await context.close();
});

test("@claim:demo-privacy demo isolates every browser store and never persists or uploads edited payloads", async () => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    localStorage.setItem("real:sentinel", "keep-local");
    sessionStorage.setItem("real:session", "keep-session");
    document.cookie = "real_cookie=keep-cookie; SameSite=Strict";
  });
  const page = await context.newPage();
  const requests = [];
  page.on("request", (request) => requests.push({ url: request.url(), method: request.method(), data: request.postData() ?? "" }));
  await page.goto(`${origin}/demo`, { waitUntil: "networkidle" });
  await page.locator("#decision-label").getByText("Diverted").waitFor();
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => { const request = indexedDB.open("real-sentinel", 1); request.onupgradeneeded = () => request.result.createObjectStore("records").put("keep-idb", "value"); request.onsuccess = () => { request.result.close(); resolve(); }; request.onerror = () => reject(request.error); });
    if (navigator.storage?.getDirectory) { const root = await navigator.storage.getDirectory(); const file = await root.getFileHandle("real-sentinel.txt", { create: true }); const writer = await file.createWritable(); await writer.write("keep-opfs"); await writer.close(); }
  });
  const marker = "unique-private-payload-719423";
  await page.locator("#payload").fill(JSON.stringify({ result: { attachment: marker.repeat(300) } }));
  await page.getByRole("button", { name: "Show spill result" }).click();
  await page.locator("#decision-label").getByText("Diverted").waitFor();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#decision-label").getByText("Diverted").waitFor();
  assert.doesNotMatch(await page.locator("#payload").inputValue(), new RegExp(marker, "u"));
  const storage = await page.evaluate(async () => {
    const cacheBodies = [];
    for (const cacheName of await caches.keys()) for (const request of await (await caches.open(cacheName)).keys()) cacheBodies.push(await (await caches.match(request)).clone().text());
    let opfs = null;
    if (navigator.storage?.getDirectory) { const root = await navigator.storage.getDirectory(); opfs = await (await (await root.getFileHandle("real-sentinel.txt")).getFile()).text(); }
    return { local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie, databases: (await indexedDB.databases()).map((item) => item.name), opfs, cacheBodies };
  });
  assert.deepEqual(storage.local, { "real:sentinel": "keep-local" });
  assert.deepEqual(storage.session, { "real:session": "keep-session" });
  assert.match(storage.cookies, /real_cookie=keep-cookie/u);
  assert.deepEqual(storage.databases, ["real-sentinel"]);
  if (storage.opfs !== null) assert.equal(storage.opfs, "keep-opfs");
  assert.equal(storage.cacheBodies.some((body) => body.includes(marker)), false);
  assert.equal(requests.every(({ url }) => new URL(url).origin === origin), true);
  assert.equal(requests.every(({ method, data }) => method === "GET" && !data.includes(marker)), true);
  await context.close();
});

test("@claim:no-telemetry site and library execution emit no analytics, beacons, sockets, or logs", async () => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    globalThis.__telemetry = { fetches: [], beacons: [], sockets: [], events: [], logs: [] };
    const originalFetch = globalThis.fetch.bind(globalThis);
    globalThis.fetch = (...args) => { globalThis.__telemetry.fetches.push(String(args[0])); return originalFetch(...args); };
    if (navigator.sendBeacon) navigator.sendBeacon = (...args) => { globalThis.__telemetry.beacons.push(args.map(String)); return true; };
    const NativeWebSocket = globalThis.WebSocket; globalThis.WebSocket = class extends NativeWebSocket { constructor(url, protocols) { globalThis.__telemetry.sockets.push(String(url)); super(url, protocols); } };
    const NativeEventSource = globalThis.EventSource; globalThis.EventSource = class extends NativeEventSource { constructor(url, init) { globalThis.__telemetry.events.push(String(url)); super(url, init); } };
    for (const method of ["log", "warn", "error"]) { const original = console[method].bind(console); console[method] = (...args) => { globalThis.__telemetry.logs.push([method, ...args.map(String)]); original(...args); }; }
  });
  const page = await context.newPage();
  await page.goto(`${origin}/demo`, { waitUntil: "networkidle" });
  await page.locator("#decision-label").getByText("Diverted").waitFor();
  await page.getByRole("button", { name: "Restore original" }).click();
  await page.locator("#restore-status").getByText(/Restored 1 field/u).waitFor();
  const signals = await page.evaluate(() => globalThis.__telemetry);
  assert.deepEqual(signals.beacons, []); assert.deepEqual(signals.sockets, []); assert.deepEqual(signals.events, []); assert.deepEqual(signals.logs, []);
  assert.deepEqual(signals.fetches.map((url) => new URL(url, origin).pathname), ["/apple-touch-icon.png"]);
  const calls = [];
  const originalFetch = globalThis.fetch; const originalLog = console.log;
  globalThis.fetch = async (...args) => { calls.push(args); throw new Error("unexpected fetch"); }; console.log = (...args) => calls.push(args);
  try {
    const spillway = new Spillway({ allowlist: ["/value"], maxInlineBytes: 2, store: new MemoryStore(), encryptionKey: await generateKey(), signingKey: await generateKey(), expiresInMs: 1_000 });
    await spillway.spill({ value: "local-only" });
  } finally { globalThis.fetch = originalFetch; console.log = originalLog; }
  assert.deepEqual(calls, []);
  await context.close();
});

test("@claim:demo-route ?demo=1 enters the isolated seeded demo", async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  await page.goto(`${origin}/?demo=1`, { waitUntil: "networkidle" }); await page.waitForURL(`${origin}/demo`); await page.locator("#decision-label").getByText("Diverted").waitFor();
  assert.equal(await page.getByRole("banner").count(), 1); assert.equal(await page.getByText("Demo — sample data, nothing is saved").count(), 1);
  await context.close();
});

test("@claim:site-routes every route has complete metadata and unknown paths return the shared product 404", async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  for (const [path, title] of [["/", "Event Payload Spillway — move webhook fields"], ["/demo", "Demo — Event Payload Spillway"], ["/privacy/", "Privacy — Event Payload Spillway"], ["/terms/", "Terms — Event Payload Spillway"]]) {
    const response = await page.goto(`${origin}${path}`, { waitUntil: "networkidle" }); assert.equal(response.status(), 200); assert.equal(await page.title(), title);
    for (const selector of ["link[rel=canonical]", 'meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[property="og:url"]', 'meta[name="twitter:card"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]', 'link[rel="apple-touch-icon"]']) assert.equal(await page.locator(selector).count(), 1, `${path} ${selector}`);
    assert.equal(await page.locator("h1").count(), 1); assert.equal(await page.locator("main").count(), 1);
  }
  const missing = await page.goto(`${origin}/definitely-missing-review-2`, { waitUntil: "networkidle" }); assert.equal(missing.status(), 404); assert.equal(await page.title(), "Page not found — Event Payload Spillway"); assert.equal(await page.locator("header nav a").count(), 4); assert.equal(await page.locator("footer nav a").count(), 3);
  for (const selector of ['meta[property="og:url"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]']) assert.equal(await page.locator(selector).count(), 1);
  await context.close();
});

test("route navigation restores the exact saved position, focus, and announcement repeatedly", async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  await page.goto(origin, { waitUntil: "networkidle" });
  let priorTransaction = null;
  let attempt = 0;
  for (const savedY of [0, 137]) {
    await page.locator("#try-demo").focus();
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), savedY);
    assert.equal(await page.evaluate(() => scrollY), savedY, `the departure position must be exact`);
    await page.keyboard.press("Enter"); await page.waitForURL(`${origin}/demo`); await page.locator("h1").waitFor();
    await page.waitForFunction(() => document.activeElement?.tagName === "H1");
    for (let revisit = 0; revisit < 4; revisit += 1) {
      attempt += 1;
      await page.goBack({ waitUntil: "networkidle" });
      try {
        await page.waitForFunction((previous) => {
          const id = history.state?.restoreId;
          const transaction = document.documentElement.dataset.routeRestore;
          return typeof id === "string" && document.activeElement?.id === "try-demo" && transaction?.startsWith(`done:${id}:`) && transaction !== previous;
        }, priorTransaction, { timeout: 5_000 });
      } catch (error) {
        const diagnostic = await page.evaluate(() => ({ url: location.href, state: history.state, focus: document.activeElement?.id || document.activeElement?.tagName, transaction: document.documentElement.dataset.routeRestore, scrollY }));
        throw new Error(`attempt ${attempt} did not complete restoration: ${JSON.stringify(diagnostic)}`, { cause: error });
      }
      const state = await page.evaluate(() => ({ restoreId: history.state?.restoreId, savedY: history.state?.scroll?.y, actualY: scrollY, transaction: document.documentElement.dataset.routeRestore }));
      assert.equal(state.savedY, savedY, `attempt ${attempt} must retain the activation position`);
      assert.equal(state.actualY, savedY, `attempt ${attempt} must restore the exact position`);
      assert.notEqual(state.transaction, priorTransaction, `attempt ${attempt} must complete a fresh restoration transaction`);
      priorTransaction = state.transaction;
      assert.match(await page.locator(".route-announcement").innerText(), /Move oversized webhook fields/u);
      if (revisit < 3) {
        await page.goForward({ waitUntil: "networkidle" });
        await page.waitForFunction(() => document.activeElement?.tagName === "H1" && document.querySelector(".route-announcement")?.textContent?.includes("See what stays"));
      }
    }
  }
  await context.close();
});

test("demo keyboard order follows the visible result before the editor", async () => {
  const { context, page } = await demoPage();
  await page.locator("h1").focus();
  const focused = [];
  for (const expectedId of ["stub-output", "restore-button", "payload", "pointer", "threshold", "spill-button"]) {
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").getAttribute("id"), expectedId);
    const position = await page.locator(":focus").evaluate((element) => ({ visible: Boolean(element.getClientRects().length), documentY: element.getBoundingClientRect().top + scrollY }));
    assert.equal(position.visible, true, `${expectedId} should be visible`);
    focused.push(position.documentY);
  }
  assert.deepEqual(focused, [...focused].sort((a, b) => a - b), "successive keyboard targets should not jump backward");
  await context.close();
});

test("390px routes have no overflow, keep navigation, and expose 44px targets", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage();
  for (const path of ["/", "/demo", "/privacy/", "/terms/", "/missing-mobile"]) {
    await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
    assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390], path);
    assert.equal(await page.locator("header nav a:visible").count(), 4, `${path} keeps all primary links`);
    const small = await page.locator("a:visible, button:visible").evaluateAll((nodes) => nodes.map((node) => ({ text: node.textContent?.trim(), width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })).filter((item) => item.width < 44 || item.height < 44));
    assert.deepEqual(small, [], `${path} has undersized targets`);
  }
  await context.close();
});

test("mobile and desktop first screens include the action note and all three facts", async () => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport }); const page = await context.newPage(); await page.goto(origin, { waitUntil: "networkidle" });
    for (const selector of [".hero-actions", ".action-note", ".proof-list"]) {
      const box = await page.locator(selector).boundingBox();
      assert.ok(box && box.y >= 0 && box.y + box.height <= viewport.height, `${selector} must fit within ${viewport.width}x${viewport.height}: ${JSON.stringify(box)}`);
    }
    for (const text of ["Try it with sample data", "Opens a seeded sample", "Demo data stays in this tab", "Works offline after first visit", "Free and MIT licensed"]) {
      const box = await page.getByText(text, { exact: false }).first().boundingBox();
      assert.ok(box && box.y + box.height <= viewport.height, `${text} must fit within ${viewport.width}x${viewport.height}: ${JSON.stringify(box)}`);
    }
    assert.equal(await page.getByRole("button", { name: /^Copy$/u }).count(), 0);
    await context.close();
  }
});

test("source installation is disclosed and copies the complete tarball workflow", async () => {
  const context = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
  const page = await context.newPage();
  await page.goto(origin, { waitUntil: "networkidle" });
  assert.match(await page.locator(".code-copy").innerText(), /Not yet published to npm\./u);
  assert.equal(await page.getByText("Configure the required options", { exact: true }).count(), 1);
  assert.equal(await page.getByText("Configure four required options", { exact: true }).count(), 0);
  assert.equal(await page.getByText("npm install event-payload-spillway", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "Copy source install steps" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(copied, /^git clone --depth 1 https:\/\/github\.com\/B-Divyesh\/sf-event-payload-spillway\.git spillway-src$/mu);
  assert.match(copied, /^npm --prefix spillway-src run build:lib$/mu);
  assert.match(copied, /^npm pack \.\/spillway-src$/mu);
  assert.match(copied, /^npm install \.\/event-payload-spillway-0\.1\.0\.tgz$/mu);
  await context.close();
});

test("all routes pass axe, semantic, keyboard-focus, and console checks", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, bypassCSP: true }); const page = await context.newPage(); const errors = [];
  page.on("pageerror", (error) => errors.push(String(error))); page.on("console", (message) => { if (message.type() === "error" && !(page.url().includes("missing-accessibility") && message.text().includes("404"))) errors.push(message.text()); });
  for (const path of ["/", "/demo", "/privacy/", "/terms/", "/missing-accessibility"]) {
    await page.goto(`${origin}${path}`, { waitUntil: "networkidle" }); await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => (await globalThis.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations);
    assert.deepEqual(violations, [], `${path}: ${violations.map((item) => item.id).join(", ")}`);
    assert.equal(await page.locator("h1").count(), 1); assert.equal(await page.locator("main").count(), 1);
  }
  await page.goto(origin); await page.keyboard.press("Tab"); assert.equal(await page.locator(":focus").getAttribute("class"), "skip-link");
  const focusStyle = await page.locator(":focus").evaluate((node) => { const style = getComputedStyle(node); return [style.outlineStyle, style.outlineWidth, style.outlineColor]; });
  assert.deepEqual(focusStyle.slice(0, 2), ["solid", "3px"]); assert.deepEqual(errors, []);
  await context.close();
});
