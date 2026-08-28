import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import test, { after, before } from "node:test";
import { chromium } from "playwright";

const port = 4175;
const origin = `http://127.0.0.1:${port}`;
let server;
let browser;
async function waitForSite() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if ((await fetch(origin)).ok) return; } catch { /* starting */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Vite preview did not start");
}
before(async () => {
  const root = join(process.cwd(), "dist/site");
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url, origin).pathname;
    const requested = pathname === "/" ? "index.html" : pathname === "/demo" ? "demo/index.html" : pathname.endsWith("/") ? `${pathname.slice(1)}index.html` : pathname.replace(/^\//u, "");
    const safe = normalize(requested).replace(/^\.\.(?:\/|\\|$)/u, "");
    let file = join(root, safe);
    try { const body = await readFile(file); response.writeHead(200, { "content-type": extname(file) === ".js" ? "text/javascript" : extname(file) === ".css" ? "text/css" : "text/html" }); response.end(body); }
    catch { file = join(root, "404.html"); response.writeHead(404, { "content-type": "text/html" }); response.end(await readFile(file)); }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  await waitForSite(); browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || chromium.executablePath() });
});
after(async () => { if (browser) await browser.close(); if (server) await new Promise((resolve) => server.close(resolve)); });

test("@claim:demo-seed /demo opens with a completed sample and reset restores it", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage();
  await page.goto(`${origin}/demo`, { waitUntil: "networkidle" }); await page.getByText("Demo — sample data, nothing is saved").waitFor(); await page.locator("#decision-label").getByText("Diverted").waitFor();
  assert.match(await page.locator("#stub-output").innerText(), /\$spillway/u); await page.locator("#payload").fill('{"changed":true}'); await page.getByRole("button", { name: "Reset demo" }).click(); await page.locator("#decision-label").getByText("Diverted").waitFor(); assert.match(await page.locator("#payload").inputValue(), /render\.complete/u); await context.close();
});
test("@claim:demo-privacy demo sends no payload and does not write browser storage", async () => {
  const context = await browser.newContext(); await context.addInitScript(() => localStorage.setItem("real:sentinel", "keep")); const page = await context.newPage(); const requests = []; page.on("request", (request) => requests.push(request.url()));
  await page.goto(`${origin}/demo`, { waitUntil: "networkidle" }); await page.locator("#decision-label").getByText("Diverted").waitFor(); assert.equal(await page.evaluate(() => localStorage.getItem("real:sentinel")), "keep"); assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), ["real:sentinel"]); assert.equal(await page.evaluate(async () => (await indexedDB.databases()).length), 0); assert.equal(requests.every((request) => new URL(request).origin === origin), true); await context.close();
});
test("@claim:demo-route ?demo=1 enters the same isolated demo route", async () => {
  const context = await browser.newContext(); const page = await context.newPage(); await page.goto(`${origin}/?demo=1`, { waitUntil: "networkidle" }); await page.waitForURL(`${origin}/demo`); await page.locator("#decision-label").getByText("Diverted").waitFor(); await context.close();
});
test("@claim:site-routes each product route has metadata and a product 404", async () => {
  const context = await browser.newContext(); const page = await context.newPage();
  for (const [path, title] of [["/", "Event Payload Spillway — move webhook fields"], ["/demo", "Demo — Event Payload Spillway"], ["/privacy/", "Privacy — Event Payload Spillway"], ["/terms/", "Terms — Event Payload Spillway"]]) { await page.goto(`${origin}${path}`, { waitUntil: "networkidle" }); assert.equal(await page.title(), title); assert.equal(await page.locator("link[rel=canonical]").count(), 1); assert.equal(await page.locator("main").count(), 1); }
  const missing = await page.goto(`${origin}/definitely-missing-review-1`, { waitUntil: "networkidle" }); assert.equal(missing.status(), 404); assert.match(await page.title(), /Page not found/u); assert.equal(await page.locator("h1").count(), 1); await context.close();
});
