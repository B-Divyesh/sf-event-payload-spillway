import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  MemoryStore, S3CompatibleStore, Spillway, createSpillwayProxy, generateKey,
} from "../dist/package/esm/index.js";

const makeSpillway = async (overrides = {}) => new Spillway({
  allowlist: ["/result/attachment"],
  maxInlineBytes: 1_000,
  store: new MemoryStore(),
  encryptionKey: await generateKey(),
  signingKey: await generateKey(),
  expiresInMs: 86_400_000,
  ...overrides,
});

test("documented spill and restore keeps the database row below 10%", async () => {
  const spillway = await makeSpillway();
  const original = { event: "render.complete", result: { attachment: "A".repeat(80_000) } };
  const result = await spillway.spill(original);
  assert.equal(result.spilledCount, 1);
  assert.ok(result.inlineBytes < result.rawBytes * 0.1, `${result.inlineBytes} should be below 10% of ${result.rawBytes}`);
  assert.match(result.payload.result.attachment.$spillway.preview, /redacted encoded string/u);
  assert.equal(original.result.attachment.length, 80_000, "input remains immutable");
  const restored = await spillway.restore(result.payload);
  assert.equal(restored.restoredCount, 1);
  assert.deepEqual(restored.payload, original);
});

test("only exact allowlisted pointers can spill", async () => {
  const spillway = await makeSpillway();
  const secret = "sk_secret_" + "z".repeat(4_000);
  const result = await spillway.spill({ secret, result: { attachment: "small" } });
  assert.equal(result.spilledCount, 0);
  assert.equal(result.payload.secret, secret);
});

test("tampered references are rejected before retrieval", async () => {
  const store = new MemoryStore();
  const spillway = await makeSpillway({ store });
  const result = await spillway.spill({ result: { attachment: "B".repeat(5_000) } });
  result.payload.result.attachment.$spillway.bytes = 12;
  await assert.rejects(spillway.restore(result.payload), /Invalid spill reference/u);
});

test("a failed multi-field spill rolls back objects already written", async () => {
  class FailSecondStore extends MemoryStore {
    calls = 0;
    async put(input) {
      this.calls += 1;
      if (this.calls === 2) throw new Error("storage unavailable");
      await super.put(input);
    }
  }
  const store = new FailSecondStore();
  const spillway = await makeSpillway({ store, allowlist: ["/a", "/b"] });
  await assert.rejects(spillway.spill({ a: "A".repeat(2_000), b: "B".repeat(2_000) }), /storage unavailable/u);
  assert.deepEqual(await store.list(), []);
});

test("retention reports expiry and reclaim excludes legal holds", async () => {
  let now = new Date("2026-01-01T00:00:00.000Z");
  const store = new MemoryStore();
  const spillway = await makeSpillway({ store, expiresInMs: 1_000, now: () => now });
  await spillway.spill({ result: { attachment: "A".repeat(2_000) } });
  await spillway.spill({ result: { attachment: "B".repeat(2_000) } }, { legalHold: true });
  now = new Date("2026-01-01T00:00:02.000Z");
  const report = await spillway.retentionReport();
  assert.equal(report.objects, 2);
  assert.equal(report.expiredObjects, 2);
  assert.equal(report.heldObjects, 1);
  const preview = await spillway.reclaim({ dryRun: true });
  assert.equal(preview.candidates, 1);
  assert.equal(preview.reclaimedObjects, 0);
  const reclaimed = await spillway.reclaim();
  assert.equal(reclaimed.reclaimedObjects, 1);
  assert.equal((await store.list()).length, 1);
});

test("proxy verifies untouched bytes before transforming and does not forward failures", async () => {
  const raw = JSON.stringify({ result: { attachment: "C".repeat(3_000) } });
  let verifiedBody = "";
  let forwardedBody = "";
  let forwardCalls = 0;
  const spillway = await makeSpillway();
  const handler = createSpillwayProxy({
    spillway,
    upstream: "https://automation.invalid/events",
    verifyWebhook: ({ rawBody }) => { verifiedBody = new TextDecoder().decode(rawBody); return true; },
    fetch: async (_url, init) => {
      forwardCalls += 1;
      forwardedBody = String(init?.body);
      assert.equal(new Headers(init?.headers).get("x-spillway-count"), "1");
      return new Response("accepted", { status: 202 });
    },
  });
  const response = await handler(new Request("https://proxy.invalid", { method: "POST", headers: { "content-type": "application/json" }, body: raw }));
  assert.equal(response.status, 202);
  assert.equal(verifiedBody, raw);
  assert.notEqual(forwardedBody, raw);
  assert.match(forwardedBody, /\$spillway/u);

  const rejectHandler = createSpillwayProxy({ spillway, upstream: "https://automation.invalid", verifyWebhook: () => false, fetch: async () => { forwardCalls += 1; return new Response(); } });
  const rejected = await rejectHandler(new Request("https://proxy.invalid", { method: "POST", headers: { "content-type": "application/json" }, body: raw }));
  assert.equal(rejected.status, 401);
  assert.equal(forwardCalls, 1);
});

test("S3-compatible adapter emits SigV4 requests and reads metadata", async () => {
  const calls = [];
  const store = new S3CompatibleStore({
    endpoint: "http://minio.local:9000",
    bucket: "spillway",
    region: "us-east-1",
    accessKeyId: "ACCESS",
    secretAccessKey: "secret-secret-secret-secret-secret",
    fetch: async (url, init) => {
      calls.push({ url: String(url), init });
      if (init?.method === "PUT") return new Response(null, { status: 200 });
      if (init?.method === "HEAD") return new Response(null, { status: 200, headers: { "content-length": "44", "last-modified": "Wed, 01 Jan 2026 00:00:00 GMT", "x-amz-meta-spillway-expires-at": "2026-01-02T00:00:00.000Z" } });
      return new Response("<ListBucketResult><IsTruncated>false</IsTruncated><Contents><Key>spillway/a.enc</Key><LastModified>2026-01-01T00:00:00.000Z</LastModified><Size>44</Size></Contents></ListBucketResult>", { status: 200 });
    },
  });
  await store.put({ key: "spillway/a.enc", body: new Uint8Array([1, 2, 3]), contentType: "application/octet-stream", metadata: { "spillway-expires-at": "2026-01-02T00:00:00.000Z" } });
  const list = await store.list("spillway/");
  assert.equal(list[0].metadata["spillway-expires-at"], "2026-01-02T00:00:00.000Z");
  assert.match(calls[0].url, /minio\.local:9000\/spillway\/spillway\/a\.enc/u);
  assert.match(calls[0].init.headers.authorization, /^AWS4-HMAC-SHA256/u);
});

test("CommonJS entry point can be required", () => {
  const require = createRequire(import.meta.url);
  const commonjs = require("../dist/package/cjs/index.js");
  assert.equal(typeof commonjs.Spillway, "function");
  assert.equal(typeof commonjs.createSpillwayProxy, "function");
});
