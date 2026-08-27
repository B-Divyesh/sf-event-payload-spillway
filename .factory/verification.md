# Independent verification — FAIL

**Candidate:** `d220b4bbf9d0e00fcc6caceeb7eed90c04658b6e` (`d220b4b`)

**Live URL:** https://event-payload-spillway.sociobot.in

**Verified:** 2026-08-27 UTC from a clean checkout. This is an independent verifier report; it supersedes earlier unverified release claims.

## Verdict

**FAIL — deployment configuration blocks release.** The deployed product content is exactly the candidate build and the library/site functionality passes, but the deployment does not apply its declared browser security or caching policies. This is a deployment-only failure; no product-code change was made during verification.

## Blocking defects

### High — missing live response security policies

`site/public/_headers` declares a restrictive `Content-Security-Policy` and `Permissions-Policy`. Fresh `curl -I` responses for `/`, JS, CSS, service worker, privacy, and terms pages contain neither header. They do contain HSTS, `Referrer-Policy`, and `X-Content-Type-Options`, but that is not equivalent to the declared CSP and permissions restrictions.

**Impact:** the deployed documentation/demo is not protected by the promised allowlist against injected/external browser content, and browser permissions are not explicitly denied. Configure the static host/CDN to emit the `_headers` CSP and Permissions-Policy (or its platform equivalent), then re-verify live headers.

### Medium — live caching ignores declared immutable/service-worker rules

The same live requests return `Cache-Control: public, must-revalidate, max-age=30` for `/assets/index-Cksnao5Y.js`, `/assets/index---gIAHll.css`, and `/service-worker.js`. The candidate declares immutable one-year caching for `/assets/*` and `no-cache` for `/service-worker.js` in `_headers`.

**Impact:** misses the static-product caching/performance contract and does not give the service-worker script its intended update policy. Apply the candidate cache rules at the deploy layer and verify them after the change.

## Evidence that passed

| Area | Fresh result |
| --- | --- |
| Clean install | `npm ci` completed; audit reported 0 vulnerabilities. |
| Tests / type check / build | `npm test`: 9/9; `npm run check`: pass; exact `npm run build`: pass. |
| Built artifact | Vite output: 13.72 KB JS and 12.60 KB CSS before gzip; production `dist/site/` generated. |
| Consumer package | `npm pack` produced a 14.8 KB tarball. Fresh temporary consumer installed it; ESM and CommonJS public exports worked. |
| Library boundaries | Exact JSON pointer `/a~1b/0`; 128-byte threshold boundary (126-character value inline, 127-character value spilled); invalid pointer, malformed JSON, non-JSON content type, and request-size rejection all behaved correctly. |
| MinIO | Fresh local MinIO bucket exercised actual signed `put/list/head/get/restore/delete`; stored object did not contain the plaintext payload. |
| Desktop / mobile | Chromium desktop 1440px and mobile 390×844: no horizontal overflow. Mobile spill → signed stub → restore and malformed JSON recovery passed. |
| Keyboard / motion | Skip link receives a visible solid brass focus outline; tab arrow navigation selects the next tab; reduced-motion mode reports near-zero transition and `scroll-behavior: auto`. |
| Accessibility | Playwright axe-core on local production build and live 390×844: 0 serious/critical violations (0 total WCAG 2 A/AA findings); one `h1`, one `main`; zero console/page errors. |
| Offline/PWA | On live HTTPS, the service worker became controller; after offline reload, the page and its offline banner rendered without errors. |
| Privacy/network | Runtime requests during live spill stayed on `https://event-payload-spillway.sociobot.in`; no analytics, CDN fonts, or third-party runtime requests observed. |
| Candidate identity | SHA-256 values of live JS, CSS, both hero assets, service worker, privacy/terms pages, and manifest exactly matched `dist/site/` built from this candidate. |
| Lighthouse | Local static production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.4 s, TBT 0 ms, CLS 0, 84 KiB total transfer. |

## Reproduction

```sh
npm ci
npm test
npm run check
npm run build
node scripts/verify-browser.mjs http://127.0.0.1:4174
curl -sSI https://event-payload-spillway.sociobot.in/
curl -sSI https://event-payload-spillway.sociobot.in/assets/index-Cksnao5Y.js
curl -sSI https://event-payload-spillway.sociobot.in/service-worker.js
npm pack
```

Serve `dist/site/` on port 4174 for the local browser command. Do not publish from this checkout.
