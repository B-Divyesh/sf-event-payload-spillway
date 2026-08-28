# Event Payload Spillway

Event Payload Spillway is an npm library for self-hosted webhook and automation systems.
It moves explicitly allowed oversized JSON fields out of database rows.
It encrypts each value before writing it to S3-compatible storage.
The event keeps a signed reference with a redacted preview and expiry.

It is for developers whose events sometimes contain base64, media, or large JSON values.
It is not a queue, CDN, monitoring service, scanner, or legal-retention system.

## Install

```sh
npm install event-payload-spillway
```

The package ships ESM, CommonJS, and TypeScript declarations.
It has no runtime dependencies or telemetry.
Use Node 20+ with Web Crypto and fetch.

## Usage

Only exact JSON Pointers in `allowlist` can spill.

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

const restored = await spillway.restore(output.payload);
console.log(restored.restoredCount); // 1
```

The packed-consumer test covers this example.

## S3-compatible storage

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

Create the bucket before use.
Allow GetObject, PutObject, DeleteObject, ListBucket, and HeadObject for the chosen prefix.
Objects are encrypted before upload.
Use TLS outside localhost.

## Reverse proxy and retrieval

`createSpillwayProxy` verifies untouched request bytes before parsing.
It requires a `verifyWebhook` callback.

```ts
import { createSpillwayProxy } from "event-payload-spillway";

const handle = createSpillwayProxy({
  spillway,
  upstream: "http://automation:3000/events",
  verifyWebhook: ({ rawBody, headers }) => verify(rawBody, headers),
});
```

The proxy does not forward rejected or partially transformed requests.
Successful requests include spill count and original digest headers.
Provider signature values are never copied into those headers.

If `publicBaseUrl` is set, each signed reference includes a retrieval URL.
Route it to `createRetrievalHandler`.
It verifies the reference and expiry before reading storage.
It decrypts the value and returns `Cache-Control: no-store`.
Treat retrieval URLs as secrets.
Add operator authentication before the handler in production.

## Retention and safety

`retentionReport()` counts objects, encrypted bytes, and expired bytes.
`reclaim()` uses expired-only candidates by default.
Use `dryRun: true` before deleting.
Pass `legalHold: true` when spilling a held value.
Reclaim excludes it until your storage policy removes the hold.

Values use AES-256-GCM with a random 96-bit IV.
References use HMAC-SHA-256 and are verified before storage reads.
Plaintext integrity is checked after decryption.
Keys come from the host and are never written to the spill store.
Previews redact likely tokens, data URIs, and long base64.
References include a key version.
Automated key rotation is not included in v0.1.
Expiry metadata does not guarantee deletion.
Add a matching bucket lifecycle rule and review retention requirements before enabling deletion.

## Demo

Open [the demo](https://event-payload-spillway.sociobot.in/demo) or `?demo=1` on the landing page.
It immediately runs a realistic render event in browser memory.
The banner identifies sample mode and offers Reset demo and Start for real.
Demo keys, encrypted objects, and edits disappear on refresh.
The demo makes no payload uploads and writes no browser storage.
See [.factory/demo.md](.factory/demo.md) for its isolation contract.

## Development

```sh
npm ci
npm test
npm run check
npm run build
npm pack --dry-run
```

`npm run build:lib` writes ESM, CJS, and declarations to `dist/package`.
`npm run build:site` writes the static site to `dist/site`.
`npm run build` produces both artifacts.
Run `npm run verify:browser -- http://127.0.0.1:4174` against a preview.
Run `npm run verify:pwa -- http://127.0.0.1:4174` for the offline shell.

## Deploy

Deploy `dist/site/` as Azure Static Web Apps static content.
`staticwebapp.config.json` sets browser security headers and cache rules.
It rewrites unknown routes to the product 404 page.
Run `npm run verify:deployment -- https://event-payload-spillway.sociobot.in` after deployment.
Use `npm pack` to prepare the library for publishing.
The factory owns publishing credentials and deployment.

## License

MIT © 2026 Param Factory contributors.
