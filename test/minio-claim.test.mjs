import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";
import { ensureMinio } from "../scripts/ensure-minio.mjs";
import { S3CompatibleStore, Spillway } from "../dist/package/esm/index.js";

const accessKeyId = "spillwaytest";
const secretAccessKey = "spillway-test-secret-key";
const region = "us-east-1";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const hmac = (key, value) => createHmac("sha256", key).update(value).digest();

async function freePort() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function createBucket(endpoint, bucket) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const url = new URL(`/${bucket}`, endpoint);
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/gu, "");
    const date = amzDate.slice(0, 8);
    const payloadHash = hash("");
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    const canonicalHeaders = `host:${url.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const canonicalRequest = `PUT\n/${bucket}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    const scope = `${date}/${region}/s3/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${scope}\n${hash(canonicalRequest)}`;
    const key = hmac(hmac(hmac(hmac(`AWS4${secretAccessKey}`, date), region), "s3"), "aws4_request");
    const signature = createHmac("sha256", key).update(stringToSign).digest("hex");
    const response = await fetch(url, { method: "PUT", headers: {
      authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    } });
    if (response.ok || response.status === 409) return;
    const detail = await response.text();
    if (response.status !== 503 || attempt === 29) assert.fail(`create bucket failed: ${response.status} ${detail}`);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}

test("@claim:s3-compatibility completes encrypted put, list, head, get, restore, and delete against MinIO", { timeout: 120_000 }, async () => {
  const binary = await ensureMinio();
  const dataDirectory = await mkdtemp(join(tmpdir(), "spillway-minio-"));
  const port = await freePort();
  const consolePort = await freePort();
  const endpoint = `http://127.0.0.1:${port}`;
  const child = spawn(binary, ["server", dataDirectory, "--address", `127.0.0.1:${port}`, "--console-address", `127.0.0.1:${consolePort}`], {
    env: { ...process.env, MINIO_ROOT_USER: accessKeyId, MINIO_ROOT_PASSWORD: secretAccessKey, MINIO_BROWSER: "off" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  child.stdout.on("data", (chunk) => { logs += chunk; }); child.stderr.on("data", (chunk) => { logs += chunk; });
  try {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      try { if ((await fetch(`${endpoint}/minio/health/live`)).ok) break; } catch { /* starting */ }
      if (attempt === 99) throw new Error(`MinIO did not start: ${logs}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    await createBucket(endpoint, "spillway");
    const store = new S3CompatibleStore({ endpoint, bucket: "spillway", region, accessKeyId, secretAccessKey, forcePathStyle: true });
    const encryptionKey = new Uint8Array(32).fill(23);
    const signingKey = new Uint8Array(32).fill(31);
    const spillway = new Spillway({ allowlist: ["/result/attachment"], maxInlineBytes: 1_000, store, encryptionKey, signingKey, expiresInMs: 86_400_000 });
    const original = { event: "render.complete", result: { attachment: "minio-payload-".repeat(4_000) } };
    const result = await spillway.spill(original);
    const reference = result.references[0].$spillway;
    const listed = await store.list("spillway/");
    assert.equal(listed.length, 1);
    assert.equal(listed[0].key, reference.objectKey);
    assert.equal(listed[0].metadata["spillway-field"], "/result/attachment");
    const object = await store.get(reference.objectKey);
    assert.equal(object.contentType, "application/vnd.spillway.encrypted+json");
    assert.equal(new TextDecoder().decode(object.body).includes(original.result.attachment), false);
    assert.deepEqual((await spillway.restore(result.payload)).payload, original);
    await store.delete(reference.objectKey);
    assert.equal(await store.get(reference.objectKey), null);
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolve) => child.once("exit", resolve));
    await rm(dataDirectory, { recursive: true, force: true });
  }
});
