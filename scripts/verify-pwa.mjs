import assert from "node:assert/strict";
import { chromium } from "playwright";

const url = process.argv[2] ?? "https://127.0.0.1:4174";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || chromium.executablePath() });
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

try {
  await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => "serviceWorker" in navigator), true, "the browser must support service workers");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#offline").waitFor({ state: "visible" });
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ serviceWorkerController: true, offlineShell: true, consoleErrors: 0, url }));
} finally {
  await context.close();
  await browser.close();
}
