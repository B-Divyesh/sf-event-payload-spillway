import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import {
  MemoryStore, S3CompatibleStore, Spillway, createRetrievalHandler, createSpillwayProxy, generateKey,
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

test("large documented spill restores without mutating its input", async () => {
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

test("@claim:crypto-format uses AES-256-GCM, unique 96-bit IVs, and HMAC-SHA-256 references", async () => {
  const store = new MemoryStore();
  const encryptionKey = new Uint8Array(32).fill(17);
  const signingKey = new Uint8Array(32).fill(29);
  const now = () => new Date("2026-01-01T00:00:00.000Z");
  const spillway = await makeSpillway({ store, encryptionKey, signingKey, now });
  const secret = `data:image/png;base64,${"A".repeat(4_000)}`;
  const result = await spillway.spill({ result: { attachment: secret } });
  const reference = result.references[0].$spillway;
  const object = await store.get(reference.objectKey);
  assert.ok(object);
  const envelope = JSON.parse(new TextDecoder().decode(object.body));
  assert.equal(envelope.algorithm, "AES-256-GCM");
  assert.equal(Buffer.from(envelope.iv.replaceAll("-", "+").replaceAll("_", "/"), "base64").byteLength, 12);
  assert.equal(new TextDecoder().decode(object.body).includes(secret), false);
  assert.match(reference.preview, /redacted encoded string/u);
  assert.equal(await spillway.verifyReference(reference), true);
  const canonicalKeys = ["version", "keyVersion", "id", "objectKey", "field", "bytes", "sha256", "storedAt", "expiresAt", "legalHold"];
  const canonical = canonicalKeys.map((key) => `${key}=${String(reference[key])}`).join("\n");
  const hmacKey = await crypto.subtle.importKey("raw", signingKey, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = Buffer.from(await crypto.subtle.sign("HMAC", hmacKey, new TextEncoder().encode(canonical))).toString("base64url");
  assert.equal(reference.signature, expected, "reference signature is an independent HMAC-SHA-256 fixture");
  const second = await spillway.spill({ result: { attachment: secret } });
  const secondObject = await store.get(second.references[0].$spillway.objectKey);
  const secondEnvelope = JSON.parse(new TextDecoder().decode(secondObject.body));
  assert.notEqual(envelope.iv, secondEnvelope.iv, "each encrypted value uses a fresh IV");
});

test("@claim:allowlist only exact allowlisted pointers can spill", async () => {
  const spillway = await makeSpillway();
  const secret = "sk_secret_" + "z".repeat(4_000);
  const result = await spillway.spill({ secret, result: { attachment: "small" } });
  assert.equal(result.spilledCount, 0);
  assert.equal(result.payload.secret, secret);
  const escaped = await makeSpillway({ allowlist: ["/a~1b/0"], maxInlineBytes: 2 });
  const escapedResult = await escaped.spill({ "a/b": ["large"] });
  assert.equal(escapedResult.spilledCount, 1);
  assert.equal(escapedResult.references[0].$spillway.field, "/a~1b/0");
});

test("@claim:reference-integrity tampered references are rejected before retrieval", async () => {
  let reads = 0;
  class ReadSpyStore extends MemoryStore { async get(key) { reads += 1; return super.get(key); } }
  const store = new ReadSpyStore();
  const spillway = await makeSpillway({ store });
  const result = await spillway.spill({ result: { attachment: "B".repeat(5_000) } });
  result.payload.result.attachment.$spillway.bytes = 12;
  await assert.rejects(spillway.restore(result.payload), /Invalid spill reference/u);
  assert.equal(reads, 0, "a tampered reference must not cause a storage read");
});

test("@claim:post-decryption-integrity rejects plaintext whose digest no longer matches", async () => {
  const encryptionKey = new Uint8Array(32).fill(41);
  const store = new MemoryStore();
  const spillway = await makeSpillway({ store, encryptionKey });
  const result = await spillway.spill({ result: { attachment: "integrity".repeat(800) } });
  const reference = result.references[0].$spillway;
  const object = await store.get(reference.objectKey);
  const envelope = JSON.parse(new TextDecoder().decode(object.body));
  const iv = Buffer.from(envelope.iv, "base64url");
  const key = await crypto.subtle.importKey("raw", encryptionKey, { name: "AES-GCM" }, false, ["decrypt", "encrypt"]);
  const plaintext = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv, additionalData: new TextEncoder().encode(envelope.aad) }, key, Buffer.from(envelope.ciphertext, "base64url")));
  plaintext[1] ^= 1;
  envelope.ciphertext = Buffer.from(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: new TextEncoder().encode(envelope.aad) }, key, plaintext)).toString("base64url");
  await store.put({ key: reference.objectKey, body: new TextEncoder().encode(JSON.stringify(envelope)), contentType: object.contentType, metadata: object.metadata });
  await assert.rejects(spillway.restore(result.payload), /failed integrity check/u);
});

test("@claim:write-confirmation a failed multi-field spill rolls back objects already written", async () => {
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

test("@claim:retention retention reports expiry and reclaim excludes legal holds", async () => {
  let now = new Date("2026-01-01T00:00:00.000Z");
  const store = new MemoryStore();
  const spillway = await makeSpillway({ store, expiresInMs: 1_000, now: () => now });
  await spillway.spill({ result: { attachment: "A".repeat(2_000) } });
  await spillway.spill({ result: { attachment: "B".repeat(2_000) } }, { legalHold: true });
  const other = await makeSpillway({ store, objectPrefix: "other/", expiresInMs: 1_000, now: () => now });
  await other.spill({ result: { attachment: "C".repeat(2_000) } });
  now = new Date("2026-01-01T00:00:02.000Z");
  const report = await spillway.retentionReport();
  assert.equal(report.objects, 2);
  assert.equal(report.expiredObjects, 2);
  assert.equal(report.heldObjects, 1);
  const scoped = await store.list("spillway/");
  assert.equal(report.encryptedBytes, scoped.reduce((total, item) => total + item.size, 0));
  assert.equal(report.expiredBytes, report.encryptedBytes);
  const preview = await spillway.reclaim({ dryRun: true });
  assert.equal(preview.candidates, 1);
  assert.equal(preview.reclaimedObjects, 0);
  const reclaimed = await spillway.reclaim();
  assert.equal(reclaimed.reclaimedObjects, 1);
  assert.equal((await store.list("spillway/")).length, 1);
  assert.equal((await store.list("other/")).length, 1, "another configured prefix stays isolated");
});

test("@claim:proxy-order proxy verifies untouched bytes before transforming and does not forward failures", async () => {
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

  for (const [request, expected] of [
    [new Request("https://proxy.invalid", { method: "POST", headers: { "content-type": "text/plain" }, body: raw }), 415],
    [new Request("https://proxy.invalid", { method: "POST", headers: { "content-type": "application/json" }, body: "{" }), 400],
  ]) {
    const blocked = createSpillwayProxy({ spillway, upstream: "https://automation.invalid", verifyWebhook: () => true, fetch: async () => { forwardCalls += 1; return new Response(); } });
    assert.equal((await blocked(request)).status, expected);
  }
  class FailedStore extends MemoryStore { async put() { throw new Error("storage unavailable"); } }
  const failed = createSpillwayProxy({ spillway: await makeSpillway({ store: new FailedStore() }), upstream: "https://automation.invalid", verifyWebhook: () => true, fetch: async () => { forwardCalls += 1; return new Response(); } });
  assert.equal((await failed(new Request("https://proxy.invalid", { method: "POST", headers: { "content-type": "application/json" }, body: raw }))).status, 502);
  assert.equal(forwardCalls, 1, "no rejected or failed request is forwarded");
});

test("@claim:audit-headers adds count and original digest without copying provider signatures", async () => {
  const raw = JSON.stringify({ result: { attachment: "audit".repeat(800) } });
  let forwarded;
  const handler = createSpillwayProxy({
    spillway: await makeSpillway(), upstream: "https://automation.invalid/events", verifyWebhook: () => true,
    fetch: async (_url, init) => { forwarded = new Headers(init.headers); return new Response("ok"); },
  });
  await handler(new Request("https://proxy.invalid", { method: "POST", headers: { "content-type": "application/json", "x-provider-signature": "provider-secret" }, body: raw }));
  assert.equal(forwarded.get("x-spillway-count"), "1");
  assert.equal(forwarded.get("x-spillway-original-sha256"), Buffer.from(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw))).toString("base64url"));
  assert.equal(forwarded.get("x-spillway-count").includes("provider-secret"), false);
  assert.equal(forwarded.get("x-spillway-original-sha256").includes("provider-secret"), false);
});

test("@claim:retrieval signed retrieval URL restores a value through the retrieval handler", async () => {
  const spillway = await makeSpillway({ publicBaseUrl: "https://hooks.example/__spillway" });
  const result = await spillway.spill({ result: { attachment: "D".repeat(3_000) } });
  const url = result.references[0].$spillway.retrieveUrl;
  assert.ok(url);
  const response = await createRetrievalHandler({ spillway })(new Request(url));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.json()).length, 3_000);
  const tampered = new URL(url);
  tampered.searchParams.set("ref", tampered.searchParams.get("ref").slice(0, -2) + "zz");
  assert.equal((await createRetrievalHandler({ spillway })(new Request(tampered))).status, 404);
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
  const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.deepEqual(manifest.dependencies ?? {}, {});
  assert.equal(typeof Spillway, "function", "the ESM import above is the package public API");
});

test("@claim:reference-shape serializes every documented signed-reference field", async () => {
  const spillway = await makeSpillway({ publicBaseUrl: "https://hooks.example/__spillway", keyVersion: "customer-2026-08" });
  const result = await spillway.spill({ result: { attachment: "shape".repeat(800) } });
  const reference = result.references[0].$spillway;
  for (const field of ["version", "keyVersion", "id", "objectKey", "field", "bytes", "sha256", "preview", "storedAt", "expiresAt", "legalHold", "signature", "retrieveUrl"]) assert.notEqual(reference[field], undefined, `${field} must be serialized`);
  const encoded = new URL(reference.retrieveUrl).searchParams.get("ref");
  const { retrieveUrl: _retrieveUrl, ...signedReference } = reference;
  assert.deepEqual(JSON.parse(Buffer.from(encoded, "base64url").toString()), signedReference);
});

test("@claim:preview-redaction redacts tokens, data URIs, and long base64 without hiding ordinary text", async () => {
  for (const [value, redacted] of [
    ["sk_secret_" + "a".repeat(120), true],
    ["data:image/png;base64," + "A".repeat(120), true],
    ["QUJD".repeat(40), true],
    ["ordinary incident note", false],
  ]) {
    const spillway = await makeSpillway({ maxInlineBytes: 2 });
    const result = await spillway.spill({ result: { attachment: value } });
    assert.equal(result.references[0].$spillway.preview.includes("redacted encoded string"), redacted, value.slice(0, 24));
  }
});

test("@claim:key-handling never writes or logs host key material", async () => {
  const encryptionKey = new Uint8Array(32).fill(83);
  const signingKey = new Uint8Array(32).fill(97);
  const captured = [];
  class InspectStore extends MemoryStore { async put(input) { captured.push(JSON.stringify({ body: Buffer.from(input.body).toString("base64"), metadata: input.metadata })); return super.put(input); } }
  const messages = [];
  const methods = ["log", "warn", "error"];
  const originals = Object.fromEntries(methods.map((method) => [method, console[method]]));
  methods.forEach((method) => { console[method] = (...args) => messages.push(args.join(" ")); });
  try { await (await makeSpillway({ store: new InspectStore(), encryptionKey, signingKey })).spill({ result: { attachment: "secret".repeat(800) } }); }
  finally { methods.forEach((method) => { console[method] = originals[method]; }); }
  const output = [...captured, ...messages].join("\n");
  for (const key of [encryptionKey, signingKey]) {
    assert.equal(output.includes(Buffer.from(key).toString("base64")), false);
    assert.equal(output.includes(Buffer.from(key).toString("hex")), false);
  }
  assert.deepEqual(messages, []);
});

test("@claim:key-version preserves the configured version through verification and restore", async () => {
  const spillway = await makeSpillway({ keyVersion: "tenant-key-42" });
  const result = await spillway.spill({ result: { attachment: "versioned".repeat(800) } });
  assert.equal(result.references[0].$spillway.keyVersion, "tenant-key-42");
  assert.equal(await spillway.verifyReference(result.references[0].$spillway), true);
  assert.equal((await spillway.restore(result.payload)).restoredCount, 1);
});
