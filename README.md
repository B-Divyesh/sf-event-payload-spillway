# Event Payload Spillway

Event Payload Spillway is a small, zero-runtime-dependency TypeScript library for self-hosted webhook and automation systems. It keeps explicitly allowed oversized JSON fields out of a primary database: values are encrypted, written to S3-compatible storage, and replaced by a signed, readable reference with a safe preview and expiry.

It is for developers who occasionally receive base64, media, or large JSON values and want an overflow control—not a queue, CDN, or observability platform.

## Install

```sh
npm install event-payload-spillway
```

The package ships ESM, CommonJS, and TypeScript declarations. It requires a runtime with Web Crypto and `fetch` (Node 20+ or a modern edge/browser runtime).

## Usage

Only JSON pointers in `allowlist` can ever leave the incoming object. This is intentionally explicit so an unexpected secret field cannot be spilled.

```ts
import { Spillway, MemoryStore, generateKey } from "event-payload-spillway";

const spillway = new Spillway({
  allowlist: ["/result/attachment"],
  maxInlineBytes: 32_000,
  store: new MemoryStore(), // use S3CompatibleStore in production
  encryptionKey: await generateKey(),
  signingKey: await generateKey(),
  expiresInMs: 7 * 24 * 60 * 60 * 1_000,
  publicBaseUrl: "https://hooks.example.com/__spillway",
});

const output = await spillway.spill({
  event: "render.complete",
  result: { attachment: "A".repeat(80_000) },
});

console.log(output.spilledCount); // 1
console.log(output.payload.result.attachment.$spillway.preview);

const restored = await spillway.restore(output.payload);
console.log(restored.restoredCount); // 1
```

The documented example above is covered by the test suite.

### S3 or MinIO

```ts
import { S3CompatibleStore } from "event-payload-spillway";

const store = new S3CompatibleStore({
  endpoint: "http://127.0.0.1:9000",
  bucket: "spillway",
  region: "us-east-1",
  accessKeyId: process.env.MINIO_ACCESS_KEY!,
  secretAccessKey: process.env.MINIO_SECRET_KEY!,
  forcePathStyle: true,
});
```

Create the bucket first and give this identity `GetObject`, `PutObject`, `DeleteObject`, `ListBucket`, and `HeadObject` permission for the configured prefix. Objects are encrypted before upload; use TLS outside localhost.

### Reverse proxy

`createSpillwayProxy` verifies the untouched request bytes before parsing and transforming them. That ordering matters: an upstream webhook signature no longer describes the transformed body.

```ts
import { createSpillwayProxy } from "event-payload-spillway";

const handle = createSpillwayProxy({
  spillway,
  upstream: "http://automation:3000/events",
  verifyWebhook: async ({ rawBody, headers }) => {
    return verifyProviderSignature(rawBody, headers.get("x-hook-signature"));
  },
});

const response = await handle(request);
```

The proxy rejects invalid signatures, non-JSON bodies, malformed JSON, and storage failures without forwarding a partial transformation. Successful upstream requests receive `x-spillway-count` and `x-spillway-original-sha256` headers for audit correlation. Signature values are never duplicated into Spillway's audit headers.

If `publicBaseUrl` is set, each stub includes a self-contained signed retrieval URL. Route that URL to the provided handler; it verifies the bearer reference, checks expiry, decrypts, and returns the original JSON value with `Cache-Control: no-store`:

```ts
import { createRetrievalHandler } from "event-payload-spillway";

const retrieve = createRetrievalHandler({ spillway });
const response = await retrieve(request);
```

Treat retrieval URLs as secrets. Do not log their query strings, and add your own operator authentication in front of the handler for production use.

### Retention and legal holds

```ts
const report = await spillway.retentionReport();
const preview = await spillway.reclaim({ expiredOnly: true, dryRun: true });
const reclaimed = await spillway.reclaim({ expiredOnly: true });
```

`retentionReport()` reports object count, encrypted bytes, and expired bytes. `reclaim()` defaults to expired objects only and supports dry runs. Set `legalHold: true` when calling `spill(payload, { legalHold: true })`; held objects are excluded from reclaim until your own policy explicitly removes the hold in storage. Expiry is application policy, not a guarantee: configure a matching bucket lifecycle rule as a backstop and review regulatory retention requirements before enabling deletion.

## Security model

- No field is spilled unless its exact RFC 6901 JSON pointer is allowed.
- Values use AES-256-GCM with a random 96-bit IV; references use HMAC-SHA-256.
- References are verified before storage reads and encrypted plaintext is hash-checked after decryption.
- Keys are supplied by the host and never written to storage or logs.
- Preview text redacts likely tokens, data URIs, and long base64 rather than echoing them.
- Rotate keys with an application-level migration; v0.1 references identify their key version but automated rotation is not yet included.

Do not put access keys in frontend code. The live demo uses the in-memory adapter and local Web Crypto only; it makes no uploads and keeps no payload after refresh.

## Development

```sh
npm install
npm test
npm run build
npm pack --dry-run
```

For the real-browser accessibility and interaction check, start the preview, install Playwright Chromium once with `npx playwright install chromium`, then run `npm run verify:browser`.

- `npm run build:lib` writes ESM, CJS, and declarations to `dist/package`.
- `npm run build:site` writes the static documentation site to `dist/site` (with `index.html` at that root).
- `npm run build` produces both.

For the demo locally, run `npm run dev` and open `http://localhost:4173`.

## Deploy

Deploy `dist/site/` as a static directory. The npm package is prepared with `npm pack`; publishing credentials and deployment are owned by the factory, so this repository does not publish automatically.

## Scope

Spillway is not a durable queue, general-purpose blob CDN, database proxy, malware scanner, or legal-retention system. A spill succeeds only after object storage confirms the encrypted write. Your event system remains responsible for delivery and retries.

## License

MIT © 2026 Param Factory contributors.
