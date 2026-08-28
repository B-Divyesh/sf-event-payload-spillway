import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const base = new URL(process.argv[2] ?? "https://event-payload-spillway.sociobot.in");
const evidence = process.argv[3];
const axePath = createRequire(import.meta.url).resolve("axe-core/axe.min.js");
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || chromium.executablePath() });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, bypassCSP: true });
await context.addInitScript(() => { localStorage.setItem("real:live-sentinel", "keep"); sessionStorage.setItem("real:live-session", "keep"); });
const page = await context.newPage();
const errors = [];
const requests = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => { if (message.type() === "error" && !(page.url().includes("missing-live-review") && message.text().includes("404"))) errors.push(message.text()); });
page.on("request", (request) => requests.push({ method: request.method(), url: request.url(), data: request.postData() ?? "" }));

async function assertPage(path, title) {
  const response = await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
  assert.equal(response.status(), path.includes("missing-live-review") ? 404 : 200, path);
  assert.equal(await page.title(), title);
  assert.equal(await page.locator("h1").count(), 1); assert.equal(await page.locator("main").count(), 1);
  assert.deepEqual(await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]), [390, 390]);
  for (const selector of ["link[rel=canonical]", 'meta[property="og:url"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="twitter:image"]']) assert.equal(await page.locator(selector).count(), 1, `${path} ${selector}`);
  await page.addScriptTag({ path: axePath });
  const violations = await page.evaluate(async () => (await globalThis.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations);
  assert.deepEqual(violations, [], `${path}: ${violations.map((item) => item.id).join(", ")}`);
  assert.deepEqual(await page.locator("header nav a").allTextContents(), ["Demo", "Install", "Privacy", "GitHub (external)"], `${path} header shell`);
  assert.deepEqual(await page.locator("footer nav a").allTextContents(), ["Privacy", "Terms", "MIT license (external)"], `${path} footer shell`);
  const small = await page.locator("a:visible, button:visible").evaluateAll((nodes) => nodes.map((node) => { const box = node.getBoundingClientRect(); return { name: node.textContent?.trim(), width: box.width, height: box.height }; }).filter(({ width, height }) => width < 44 || height < 44));
  assert.deepEqual(small, [], `${path} has undersized controls`);
}

try {
  await assertPage("/", "Event Payload Spillway — move webhook fields");
  for (const text of ["Try it with sample data", "Opens a seeded sample", "Demo data stays in this tab", "Works offline after first visit", "Free and MIT licensed"]) {
    const box = await page.getByText(text, { exact: false }).first().boundingBox(); assert.ok(box && box.y + box.height <= 844, `${text} is below first viewport`);
  }
  assert.equal(await page.locator("header nav a:visible").count(), 4);
  if (evidence) await page.screenshot({ path: `${evidence}/live-home-390.png`, fullPage: true });
  await page.locator("#try-demo").focus(); await page.keyboard.press("Enter"); await page.waitForURL(new URL("/demo", base).href); await page.locator("#decision-label").getByText("Diverted").waitFor();
  assert.equal(await page.evaluate(() => document.activeElement?.tagName), "H1");
  assert.equal(await page.getByText("Demo — sample data, nothing is saved").count(), 1); assert.equal(await page.getByRole("link", { name: "Leave demo" }).count(), 1);
  const raw = Number(await page.locator("#raw-bytes").getAttribute("data-bytes")); const inline = Number(await page.locator("#inline-bytes").getAttribute("data-bytes")); assert.ok(inline / raw < 0.1);
  const payload = JSON.parse(await page.locator("#payload").inputValue()); assert.equal(payload.result.mime, "image/png"); assert.deepEqual([...Buffer.from(payload.result.attachment.split(",")[1], "base64").subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const keyboardOrder = []; const keyboardPositions = [];
  for (const expectedId of ["stub-output", "restore-button", "payload", "pointer", "threshold", "spill-button"]) {
    await page.keyboard.press("Tab"); const focused = page.locator(":focus"); assert.equal(await focused.getAttribute("id"), expectedId); keyboardOrder.push(expectedId); keyboardPositions.push(await focused.evaluate((element) => element.getBoundingClientRect().top + scrollY));
  }
  assert.deepEqual(keyboardPositions, [...keyboardPositions].sort((a, b) => a - b));
  if (evidence) await page.screenshot({ path: `${evidence}/demo-keyboard-390.png`, fullPage: true });
  await page.locator("#payload").fill('{"changed":"live-private-marker-4821"}'); await page.getByRole("button", { name: "Reset demo" }).click(); await page.locator("#decision-label").getByText("Diverted").waitFor(); assert.doesNotMatch(await page.locator("#payload").inputValue(), /live-private-marker-4821/u);
  await page.getByRole("button", { name: "Restore original" }).click(); await page.locator("#restore-status").getByText(/Restored 1 field/u).waitFor();
  assert.equal(await page.evaluate(() => localStorage.getItem("real:live-sentinel")), "keep"); assert.equal(await page.evaluate(() => sessionStorage.getItem("real:live-session")), "keep");
  if (evidence) await page.screenshot({ path: `${evidence}/live-demo-390.png`, fullPage: true });
  let priorTransaction = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForFunction((previous) => { const id = history.state?.restoreId; const transaction = document.documentElement.dataset.routeRestore; return typeof id === "string" && document.activeElement?.id === "try-demo" && transaction?.startsWith(`done:${id}:`) && transaction !== previous; }, priorTransaction);
    const restored = await page.evaluate(() => ({ savedY: history.state.scroll.y, actualY: scrollY, transaction: document.documentElement.dataset.routeRestore }));
    assert.deepEqual([restored.savedY, restored.actualY], [0, 0]); priorTransaction = restored.transaction;
    assert.match(await page.locator(".route-announcement").innerText(), /Move oversized webhook fields/u);
    if (attempt < 4) { await page.goForward({ waitUntil: "networkidle" }); await page.waitForFunction(() => document.activeElement?.tagName === "H1"); }
  }
  await page.locator("#try-demo").focus(); await page.evaluate(() => window.scrollTo({ top: 137, behavior: "instant" })); await page.keyboard.press("Enter"); await page.waitForURL(new URL("/demo", base).href); await page.waitForFunction(() => document.activeElement?.tagName === "H1");
  await page.goBack({ waitUntil: "networkidle" }); await page.waitForFunction(() => { const id = history.state?.restoreId; return document.activeElement?.id === "try-demo" && document.documentElement.dataset.routeRestore?.startsWith(`done:${id}:`); }); assert.deepEqual(await page.evaluate(() => [history.state.scroll.y, scrollY]), [137, 137]);
  await assertPage("/privacy/", "Privacy — Event Payload Spillway"); await assertPage("/terms/", "Terms — Event Payload Spillway"); await assertPage("/missing-live-review", "Page not found — Event Payload Spillway");
  if (evidence) await page.screenshot({ path: `${evidence}/404-390.png`, fullPage: true });
  const directDemo = await context.newPage(); await directDemo.goto(new URL("/?demo=1", base).href, { waitUntil: "networkidle" }); await directDemo.waitForURL(new URL("/demo", base).href); await directDemo.locator("#decision-label").getByText("Diverted").waitFor(); assert.equal(await directDemo.getByText("Demo — sample data, nothing is saved").count(), 1); await directDemo.close();
  assert.equal(requests.every(({ url }) => new URL(url).origin === base.origin), true); assert.equal(requests.every(({ method, data }) => method === "GET" && !data.includes("live-private-marker-4821")), true); assert.deepEqual(errors, []);
  console.log(JSON.stringify({ url: base.origin, demoBytes: { raw, inline, ratio: inline / raw }, routes: 5, axeViolations: 0, consoleErrors: 0, overflow: false, smallTargets: 0, backRestorations: 6, backFocus: "#try-demo", savedPositions: [0, 137], keyboardOrder, demoQueryRoute: true, requests: requests.length }));
} finally { await context.close(); await browser.close(); }
