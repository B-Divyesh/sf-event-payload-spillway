import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const baseUrl = process.argv[2];
if (!baseUrl) {
  throw new Error("Usage: node scripts/verify-deployment-policy.mjs https://event-payload-spillway.sociobot.in");
}

const origin = new URL(baseUrl);
const config = JSON.parse(readFileSync(new URL("../dist/site/staticwebapp.config.json", import.meta.url), "utf8"));
const expectedHeaders = config.globalHeaders;
const index = readFileSync(new URL("../dist/site/index.html", import.meta.url), "utf8");
const asset = index.match(/(?:src|href)="(\/assets\/[^\"]+)"/)?.[1];
assert.ok(asset, "the built index must reference a hashed asset");

const responseFor = async (path) => {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.ok, true, `${path} must return a successful response`);
  return response;
};

const page = await responseFor("/");
for (const [name, value] of Object.entries(expectedHeaders)) {
  assert.equal(page.headers.get(name), value, `the deployed page must emit ${name}`);
}

const assetResponse = await responseFor(asset);
assert.equal(assetResponse.headers.get("cache-control"), "public, max-age=31536000, immutable", "hashed Vite assets must be immutable");

const worker = await responseFor("/service-worker.js");
assert.equal(worker.headers.get("cache-control"), "no-cache", "the service worker must be revalidated for updates");

console.log(JSON.stringify({
  url: origin.origin,
  securityHeaders: Object.keys(expectedHeaders),
  asset,
  assetCacheControl: assetResponse.headers.get("cache-control"),
  serviceWorkerCacheControl: worker.headers.get("cache-control"),
}));
