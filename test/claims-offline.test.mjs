import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import test, { after, before } from "node:test";
import { chromium } from "playwright";

const port = 4176;
const origin = `http://127.0.0.1:${port}`;
let server;
let browser;
before(async () => {
  const root = join(process.cwd(), "dist/site");
  server = createServer(async (request, response) => {
    const pathname = new URL(request.url, origin).pathname;
    const requested = pathname === "/" ? "index.html" : pathname === "/demo" ? "demo/index.html" : pathname.endsWith("/") ? `${pathname.slice(1)}index.html` : pathname.replace(/^\//u, "");
    let file = join(root, normalize(requested).replace(/^\.\.(?:\/|\\|$)/u, ""));
    try { const body = await readFile(file); response.writeHead(200, { "content-type": extname(file) === ".js" ? "text/javascript" : extname(file) === ".css" ? "text/css" : "text/html" }); response.end(body); }
    catch { file = join(root, "404.html"); response.writeHead(404, { "content-type": "text/html" }); response.end(await readFile(file)); }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || chromium.executablePath() });
});
after(async () => { if (browser) await browser.close(); if (server) await new Promise((resolve) => server.close(resolve)); });
test("@claim:offline-demo warmed demo reloads offline and restores the sample", async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); const page = await context.newPage();
  await page.goto(`${origin}/demo`, { waitUntil: "networkidle" }); await page.evaluate(() => navigator.serviceWorker.ready); await page.reload({ waitUntil: "networkidle" }); await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true); await page.reload({ waitUntil: "domcontentloaded" }); await page.locator("#offline").waitFor({ state: "visible" }); await page.locator("#decision-label").getByText("Diverted").waitFor(); await page.locator("#restore-button").click(); await page.locator("#restore-status").getByText(/Restored 1 field/u).waitFor(); assert.ok(await page.evaluate(() => caches.keys()).then((keys) => keys.includes("spillway-shell-v1"))); await context.close();
});
