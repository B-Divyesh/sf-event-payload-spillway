import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const url = process.argv[2] ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || chromium.executablePath() });
// axe injects an auditing script. Keep the product CSP strict and bypass it only
// inside this dedicated Playwright audit context; deployment-policy checks assert
// the real response headers separately.
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, bypassCSP: true });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

try {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.addScriptTag({ path: axePath });
  const axe = await page.evaluate(async () => globalThis.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } }));
  const serious = axe.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  assert.deepEqual(serious, [], `axe serious/critical violations: ${serious.map((item) => item.id).join(", ")}`);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("main").count(), 1);

  await page.locator("#spill-button").click();
  await page.locator("#decision-label").getByText("Diverted").waitFor();
  assert.match(await page.locator("#stub-output").innerText(), /\$spillway/u);
  await page.locator("#restore-button").click();
  await page.locator("#restore-status").getByText(/Restored 1 field/u).waitFor();

  await page.locator("#payload").fill("not json");
  await page.locator("#spill-button").click();
  await page.locator("#payload-error").getByText(/not valid JSON/u).waitFor();
  assert.equal(await page.locator("#payload").getAttribute("aria-invalid"), "true");
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ axeViolations: axe.violations.length, seriousCritical: serious.length, consoleErrors: errors.length, interactivePath: "spill → signed stub → restore", viewport: "390x844" }));
} finally {
  await context.close();
  await browser.close();
}
