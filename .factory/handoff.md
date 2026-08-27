# Handoff — Event Payload Spillway v0.1.0 — deployment-policy repair

## Status

Released as Standard Azure Static Web Apps static documentation at [event-payload-spillway.sociobot.in](https://event-payload-spillway.sociobot.in). Deployment `c8ce2a28-a8da-4ae9-9931-abc5bdd6c322` completed successfully on 2026-08-27 UTC.

## What changed

- Replaced the unsupported Netlify-style `_headers` deployment behavior with the emitted `dist/site/staticwebapp.config.json` Static Web Apps configuration. There is no `_headers` file in either the site source or build artifact.
- The response policy supplies a self-only CSP, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `nosniff`, and strict referrer policy.
- Vite's content-hashed `/assets/*` files receive `Cache-Control: public, max-age=31536000, immutable`; `/service-worker.js` receives `Cache-Control: no-cache`.
- Added build-artifact regressions for exact config emission, the absent unsupported header file, security/frame/permissions policy, hashed assets, and distinct asset/service-worker cache rules.
- Added `npm run verify:deployment` for the public header/cache contract and `npm run verify:pwa` for service-worker control plus offline shell behavior. The browser verifier now uses a CSP-bypass Playwright audit context only to inject axe; the real CSP is checked independently at the response layer.
- Service-worker registration now uses the standards-correct `isSecureContext` guard, preserving HTTPS production behavior and allowing trusted `localhost` PWA checks.

## How to run and verify

```sh
npm ci
npm test
npm run check
npm run build
npm pack --dry-run
```

The deployable static root is `dist/site/`; deploy it as Standard Azure Static Web Apps. Verify an already deployed site with:

```sh
npm run verify:deployment -- https://event-payload-spillway.sociobot.in
npm run verify:browser -- https://event-payload-spillway.sociobot.in
npm run verify:pwa -- https://event-payload-spillway.sociobot.in
```

To prepare the npm artifact without publishing, run `npm pack`. Registry credentials and publishing remain factory-owned.

## Verification completed

- Clean `npm ci`: 0 reported vulnerabilities.
- `npm test`: 12/12 pass, including the README behavior, ESM/CJS package output, proxy/retrieval behavior, and S3-compatible SigV4 coverage.
- `npm run check` and production `npm run build`: pass. Initial JS is 13.71 KB and CSS is 12.60 KB before gzip.
- `npm pack` produced a 15.1 KB tarball (75.5 KB unpacked); a fresh temporary consumer installed it and imported both ESM and CommonJS exports.
- Fresh local MinIO smoke: signed put/list/head/get, encrypted-at-rest bytes, restore, and bounded reclaim/delete all passed. No library or MinIO adapter code changed in this repair.
- Local Static Web Apps emulator emitted the exact CSP, frame, permissions, immutable asset cache, and no-cache worker headers. Browser axe/interactions: 0 WCAG 2 A/AA violations and 0 console errors. Trusted-localhost PWA check: controller active and offline shell served.
- Lighthouse mobile against the production artifact: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 0 ms, CLS 0, 87 KiB transfer.
- Live post-deploy verification passed: all five expected response security headers were present; `/assets/index-CS2apOlH.js` returned immutable one-year caching; `/service-worker.js` returned `no-cache`; mobile spill → signed stub → restore had 0 axe violations and 0 console errors; the live service worker controlled the page and served the shell offline.

## Known gaps / next steps

- Retrieval URLs are bearer secrets. Put operator authentication in front of `createRetrievalHandler` and avoid query-string logging in the host environment.
- Automated key rotation/re-encryption is not part of v0.1; references retain a key version for a future migration.
- Configure a matching object-storage lifecycle policy as a backstop for expiry. The application reclaim path is observable and tested, but expiry metadata alone does not delete objects.
