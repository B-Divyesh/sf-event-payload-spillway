# Handoff — Event Payload Spillway v0.1.0

## Status: PASS

Independent QA passed for candidate `723dc053c69504af37c55ae4b36e5d5e8bbea9b9` on 2026-08-27 UTC. The live deployment at https://event-payload-spillway.sociobot.in matches the candidate build exactly for its HTML, JS, CSS, service worker, images, manifest, privacy page, and terms page.

## What is verified

- Clean `npm ci`, `npm run check`, `npm test` (12/12), and standalone production `npm run build` pass. No lint script exists.
- `npm pack` creates a 15,116 B ready-to-publish tarball; a clean consumer successfully used ESM and CommonJS public APIs.
- Normal, boundary, invalid-input, recovery, signature, reference-tamper, retention/legal-hold, and proxy paths are covered by tests and independent public-API checks.
- A temporary real MinIO instance completed encrypted `S3CompatibleStore` put/list/head/restore/report flow. A 5,050 B event left a 474 B inline row (<10%); stored bytes were an AES-GCM envelope rather than plaintext.
- Live desktop and 390px mobile demo checks pass: inline and spill decisions, signed stub, restoration, invalid JSON/pointer/threshold recovery, keyboard-only navigation, visible focus, and reduced motion all work with no console/page errors.
- Local and live axe results have 0 total WCAG 2 A/AA violations (0 serious/critical). Live PWA service-worker update/offline reload test passes.
- Privacy/network behavior is local-first: observed demo requests stayed first-party; no analytics, third-party font/script, or upload requests were made.
- Live response policy includes self-only CSP, nosniff, DENY framing, strict referrer, denied camera/mic/geolocation, HSTS, immutable hashed assets, and no-cache service worker. This resolves the previous deployment-only failure.
- Mobile Lighthouse on live URL: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 0 ms, CLS 0, total transfer 60 KiB.

The detailed evidence and reproduction steps are in `.factory/verification-2.md`.

## Run / verify / deploy

```sh
npm ci
npm run check
npm test
npm run build
npm pack --json
npm run verify:deployment -- https://event-payload-spillway.sociobot.in
npm run verify:browser -- https://event-payload-spillway.sociobot.in
npm run verify:pwa -- https://event-payload-spillway.sociobot.in
```

Deploy only the generated `dist/site/` as Standard Azure Static Web Apps static content. Package publishing is factory-owned; prepare but do not publish with `npm pack`.

## Known gaps / next steps

- Retrieval URLs are bearer secrets. Hosts should add operator authentication before `createRetrievalHandler` and avoid logging retrieval query strings.
- Automated key rotation/re-encryption is intentionally not in v0.1; references carry a key version for future migration.
- Configure matching object-storage lifecycle policy as a deletion backstop; application expiry metadata and reclaim reports are not a storage-provider deletion guarantee.

No QA defects remain open for this candidate.
