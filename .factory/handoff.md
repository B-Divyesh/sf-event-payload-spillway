# Handoff — perfection loop round 2

## Status: PASS

Every finding in `.factory/review-1.md` and `.factory/review-2.md` is closed. The finding-by-finding repair and evidence map is in `.factory/polish-2.md`. No known product, accessibility, privacy, offline, packaging, or deployment gap remains within this work order.

Live product: <https://event-payload-spillway.sociobot.in>

Implementation commit: `792097b`

Final deployment: Azure Static Web Apps `d5d8846f-6682-4dc2-ade0-d6fe67572f86`

## What changed

- Rebuilt the one-click `/demo` seed around the exact 74,502-byte browser sample. It now produces 1,268 inline bytes (1.70%).
- Replaced the mislabeled repeated GIF fragment with a valid original 180×180 PNG and matching filename/MIME metadata.
- Kept demo data in isolated memory, added the persistent demo banner, and made Reset demo and Leave demo truthful and complete.
- Expanded `.factory/claims.json` to 27 claims. Each claim has exactly one tagged observable test.
- Added real MinIO interoperability, packed ESM/CommonJS/types, Node 20, encryption, key-handling, retention, proxy-order, privacy, offline, and deployment-policy coverage.
- Delivered real route metadata, history focus restoration, product-styled HTTP 404 handling, complete legal navigation, and 44px controls.
- Reworked the 390px layout without replacing the industrial print/halftone identity. All four header links and all first-screen facts remain visible.
- Rewrote the flagged copy, labels, buttons, README passages, copy audit, demo notes, catalog line, and provenance record.
- Added `npm run verify:live-review` for the cumulative live mobile review.

## Verification

A clean detached clone of `792097b` was installed with `npm ci` before verification.

- `npm run test:claims`: 27/27 registered claim commands passed. Evidence: `.factory/evidence/clean-claims.txt`.
- `npm test`: 36/36 unit, integration, browser, privacy, offline, package, Node 20, and MinIO tests passed. Evidence: `.factory/evidence/clean-suite.txt`.
- `npm run check`: passed.
- `npm audit --audit-level=moderate`: zero vulnerabilities.
- `npm pack --json --dry-run`: passed; package size 14,454 bytes, 26 entries.
- `npm run verify:browser -- https://event-payload-spillway.sociobot.in`: passed, including axe and the spill/restore flow.
- `npm run verify:live-review -- https://event-payload-spillway.sociobot.in .factory/evidence`: five routes, zero axe violations, zero console errors, zero undersized controls, no overflow, same-origin GET-only requests, and Back focus restored to `#try-demo`.
- `npm run verify:pwa -- https://event-payload-spillway.sociobot.in`: service-worker-controlled offline reload passed.
- `npm run verify:deployment -- https://event-payload-spillway.sociobot.in`: security headers, immutable asset caching, no-cache worker, and HTTP 404 behavior passed.
- `/opt/fleet/lib/verify-url.sh https://event-payload-spillway.sociobot.in`: title, language, main landmark, image alternatives, controls, and console checks passed. Evidence: `.factory/evidence/verify-url-live.json`.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.5s, TBT 40ms, CLS 0, 116KiB transfer. Evidence: `.factory/evidence/lighthouse-live-summary.json`.
- Built and live SHA-256 values matched for home, demo, privacy, terms, 404, service worker, sample image, and main JavaScript.

Screenshots: `.factory/evidence/live-home-390.png`, `.factory/evidence/live-demo-390.png`, `.factory/evidence/404-390.png`, and `.factory/evidence/home-1440.png`.

## Run and verify

```sh
npm ci
npm test
npm run test:claims
npm run check
npm audit --audit-level=moderate
npm pack --json --dry-run
npm run verify:live-review -- https://event-payload-spillway.sociobot.in .factory/evidence
```

Build the publishable npm package and static site with `npm run build`. The factory owns registry publishing; do not publish from this repository. Deploy only `dist/site` through the work order configuration.

## Known gaps and next steps

None. Object-store lifecycle rules, operator authentication, authorization, and key rotation remain intentionally outside this small library's scope and are described as operator responsibilities rather than product claims.
