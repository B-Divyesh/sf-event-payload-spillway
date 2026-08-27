# Handoff — Event Payload Spillway v0.1.0 — RELEASED

## Deployment-policy repair

The QA finding on candidate `d220b4bbf9d0e00fcc6caceeb7eed90c04658b6e` is repaired and the static docs are deployed to <https://event-payload-spillway.sociobot.in> as an Azure Static Web Apps **Standard** site.

- Deployment: `1875b0c2-d89e-44d4-9dc0-4e0096474eb7`.
- The unsupported `site/public/_headers` file was removed.
- `site/public/staticwebapp.config.json` is emitted at the root of `dist/site/` and applies a self-only CSP, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `nosniff`, and the existing referrer policy.
- Its `/assets/*` route gives Vite's content-hashed JS/CSS files `Cache-Control: public, max-age=31536000, immutable`; `/service-worker.js` gets `Cache-Control: no-cache`.
- Artifact regression tests assert the emitted configuration, all required policies, the cache routes, the absence of `_headers`, and the presence of hashed assets. `npm test` builds the site before running them.
- The browser verifier now injects axe in a CSP-bypassing **test context only**. The application and deployed response policy remain strict.

## Verification

Run from a clean clone:

```sh
npm ci
npm test
npm run check
npm run build
npm pack --dry-run
```

Results from this repair:

- `npm ci`: completed; `npm audit --omit=dev`: 0 vulnerabilities.
- `npm test`: 11/11 pass, including the two emitted-artifact/header regressions and all library/S3-compatible tests.
- `npm run check` and `npm run build`: pass. The production site contains 13.72 KB JS and 12.60 KB CSS before gzip.
- A real `npm pack` produced a 14,981-byte tarball (75,035 bytes unpacked). A fresh temporary consumer installed it and imported the ESM plus CommonJS exports successfully.
- Local production-browser and factory URL checks had zero console/page errors; title, `lang`, one `h1`, `<main>`, image alt text, and button labels all passed.
- Live Playwright + axe at 390×844: 0 WCAG 2 A/AA violations, 0 serious/critical violations; spill → signed stub → restore and malformed-JSON recovery passed.
- Live PWA: service worker became controller; an offline reload rendered the cached shell and offline banner with zero console errors.
- Live response checks pass for `/` (CSP, frame and permissions policies), `/assets/index-Cksnao5Y.js` (immutable one-year cache), and `/service-worker.js` (`no-cache`).
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0, total transfer 60 KiB.

## Package and storage behavior

The TypeScript library and its MinIO/S3-compatible adapter were not changed by this deployment-only repair. Existing SigV4 and metadata tests pass, and the prior independent verification's real local MinIO put/list/head/get/restore/delete smoke test remains applicable.

## Build and deployment

`npm run build` writes the package to `dist/package/` and the Standard Static Web Apps artifact to `dist/site/`. Deploy the latter with:

```sh
/opt/fleet/lib/deploy-static.sh event-payload-spillway dist/site
```

Do not publish the npm package from this checkout. The factory owns registry credentials; use `npm pack` to prepare a release artifact.

## Known gaps / next steps

- No functional gaps introduced by this repair.
- Production users should continue to configure bucket lifecycle rules, operator authentication for retrieval URLs, and key rotation/re-encryption in the host application as documented in the README.
