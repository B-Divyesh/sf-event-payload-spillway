import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const siteRoot = new URL("../dist/site/", import.meta.url);
const sourceRoot = new URL("../site/public/", import.meta.url);
const policy = {
  "Content-Security-Policy": "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

test("Static Web Apps policy is emitted unchanged with security and cache routes", () => {
  assert.equal(existsSync(new URL("_headers", sourceRoot)), false, "unsupported _headers source must not remain");
  assert.equal(existsSync(new URL("_headers", siteRoot)), false, "unsupported _headers artifact must not be deployed");

  const source = readFileSync(new URL("staticwebapp.config.json", sourceRoot), "utf8");
  const artifact = readFileSync(new URL("staticwebapp.config.json", siteRoot), "utf8");
  assert.equal(artifact, source, "Vite must copy the SWA response policy to the deploy root without rewriting it");

  const config = JSON.parse(artifact);
  assert.deepEqual(config.globalHeaders, policy);
  assert.deepEqual(config.routes, [
    { route: "/assets/*", headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
    { route: "/service-worker.js", headers: { "Cache-Control": "no-cache" } },
  ]);
});

test("site artifact contains hashed Vite assets covered by the immutable cache rule", () => {
  const assets = readdirSync(join(siteRoot.pathname, "assets"));
  assert.ok(assets.length > 0, "Vite must emit at least one asset");
  assert.ok(assets.every((asset) => /-[A-Za-z0-9_-]{8,}\.(?:css|js)$/u.test(asset)), `assets must be content hashed: ${assets.join(", ")}`);
  assert.equal(existsSync(new URL("service-worker.js", siteRoot)), true);
});

test("header routes separate immutable build assets from the update-checked service worker", () => {
  const config = JSON.parse(readFileSync(new URL("staticwebapp.config.json", siteRoot), "utf8"));
  const cacheByRoute = new Map(config.routes.map((route) => [route.route, route.headers["Cache-Control"]]));
  assert.equal(cacheByRoute.get("/assets/*"), "public, max-age=31536000, immutable");
  assert.equal(cacheByRoute.get("/service-worker.js"), "no-cache");
  assert.equal(config.globalHeaders["Content-Security-Policy"].includes("frame-ancestors 'none'"), true);
  assert.equal(config.globalHeaders["X-Frame-Options"], "DENY");
  assert.equal(config.globalHeaders["Permissions-Policy"], "camera=(), microphone=(), geolocation=()");
});
