# Independent verification — PASS

**Candidate:** `723dc053c69504af37c55ae4b36e5d5e8bbea9b9` (`723dc05`)

**Live URL:** https://event-payload-spillway.sociobot.in

**Verified:** 2026-08-27 UTC from a fresh detached clean checkout and clean npm consumer.

## Verdict

**PASS — release contract satisfied.** The clean candidate builds and tests successfully, the packed public library works in a separate consumer, a real temporary MinIO store completes the encrypted spill/restore path, and the deployed site is byte-for-byte the candidate static artifact. The previous deployment-only concern is resolved: the live response policy now supplies the expected security and cache headers.

No release-blocking, high, medium, or low severity defects were found.

## Evidence

| Area | Fresh independent result |
| --- | --- |
| Clean checkout | Cloned `/work/repo` with `--no-local`, detached at exactly `723dc053c69504af37c55ae4b36e5d5e8bbea9b9`; checkout was clean before install. |
| Install / static analysis | `npm ci` succeeded with 0 audit vulnerabilities. `npm run check` (`tsc --noEmit`) passed. No separate lint script is declared in `package.json`. |
| Exact production build | `npm test` passed all 12 tests (and builds first); a second standalone `npm run build` passed and produced `dist/package` plus `dist/site`. Built site assets: 13,709 B JS (5.48 KB gzip), 12,602 B CSS (3.65 KB gzip). |
| Package readiness | `npm pack --json` created `event-payload-spillway-0.1.0.tgz`, 15,116 B compressed / 75,512 B unpacked, containing ESM, CommonJS, declarations, README, LICENSE, and CHANGELOG only. A newly initialized consumer installed that tarball; documented ESM spill/restore and CommonJS spill both passed. |
| Library normal / boundary / recovery paths | Clean-consumer public API checks passed: exact serialized-byte boundary stays inline; one byte over spills; only exact allowlisted fields spill; RFC 6901 escaped pointer `/a~1b` restores; invalid pointer and zero limit reject. Proxy: GET 405, non-JSON 415, malformed JSON 400, over-limit 413, and invalid signature 401 all did not forward. Retrieval: POST 405 and absent reference 400. Repository tests also cover tamper rejection, multi-field rollback, expiry/legal hold reclaim, raw-body signature ordering, signed retrieval, and SigV4 request construction. |
| Real S3-compatible path | Temporary local MinIO bucket exercised the packed `S3CompatibleStore` with SigV4: encrypted put → list/head → restore → retention report → dry-run reclaim. 5,050 B event became a 474 B inline row (<10%); MinIO stored `application/vnd.spillway.encrypted+json` AES-256-GCM envelope and metadata, not plaintext. |
| Desktop and 390px mobile | Live Chromium at 1440×1000 and 390×844 passed. At mobile width, `scrollWidth === clientWidth === 390`. Normal spill → signed stub → restore worked; normal inline decision, invalid JSON, invalid pointer, and too-small threshold gave recoverable messages and focused the relevant control. |
| Keyboard / focus / motion | Skip link is first Tab target and moves to `#main`; visible focus is a solid 3px brass outline; arrow keys change the ARIA code tabs. With reduced motion, `scroll-behavior` is `auto` and animation/transition duration is reduced to .01 ms. |
| Accessibility / errors | Repository browser verification on local production build and live HTTPS: axe 0 total WCAG 2 A/AA violations, 0 serious/critical; exactly one `h1` and `main`; 0 console/page errors. Semantics include `lang`, title, skip link, labelled controls, status/error announcements, and legal pages. |
| PWA / offline | Local and live `npm run verify:pwa` passed: service worker became controller, then offline reload rendered the cached shell and offline status without console errors. Worker cache uses `spillway-shell-v1`, claims clients, and deletes stale named caches on activation. |
| Privacy / outbound requests | Live interactive test observed requests only to `https://event-payload-spillway.sociobot.in`; no analytics, CDN fonts, external scripts, or demo uploads. The demo uses in-memory keys/store and the privacy page accurately describes no form persistence. CSP is self-only (`connect-src 'self'`). |
| Response policy / cache | Live `/`, JS, service worker, privacy, and terms responses include the exact candidate CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and permissions denial. Hashed JS returns `public, max-age=31536000, immutable`; service worker returns `no-cache`; HSTS is also present. `npm run verify:deployment -- https://event-payload-spillway.sociobot.in` passed. |
| Deployment identity | SHA-256 equality between live and freshly built candidate held for root HTML, hashed JS and CSS, both hero images, service worker, manifest, privacy page, and terms page. Root document and asset names match `index-CS2apOlH.js` and `index---gIAHll.css`. |
| Performance | Mobile Lighthouse against live HTTPS: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 0 ms, CLS 0, Speed Index 1.0 s, 60 KiB transfer. Initial JS/CSS and 46,316 B mobile hero are within the stated budgets; no font files are shipped. |

## Commands / reproduction

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

For the local browser check, serve the already-built `dist/site` directory (for example `npx vite preview --outDir dist/site --host 127.0.0.1 --port 4174`) before invoking the browser/PWA scripts against that origin. Do not publish from the checkout; registry credentials remain factory-owned.

## Defects by severity

None found. The prior report's missing deployment security/cache rules are no longer reproducible: the deployed candidate emits the Static Web Apps policy in `staticwebapp.config.json`.
