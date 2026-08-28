# Polish 3 — cumulative finding closure

Repaired candidate `22aaba426c9feafaee07e8ee5928c44bf242610d` from review commit `ac176eb48d8caf53644eb43bec61977531172491`.

Implementation commits: `f30ff56` and `2f92b89`.

Deployed URL: <https://event-payload-spillway.sociobot.in> (deployment `fa443a30-1df3-4371-aa6e-bf3e8561602d`; live JavaScript `main-DyWkfyt1.js`).

## Evidence key

- **C** — every declared `@claim:*` command passed from the exact final clean clone: `.factory/evidence/polish-3-retry2-final-clean-claims.txt` (27/27).
- **U** — exact final clean-clone aggregate suite: `.factory/evidence/polish-3-retry2-final-clean-suite.txt` (37/37).
- **L** — post-deploy cold five-route review: `.factory/evidence/polish-3-retry2-live/review.txt`; this records a 1.70% inline ratio, zero axe violations, zero console errors, no 390 px overflow, no undersized targets, and the direct `?demo=1` route.
- **K** — the aggregate regression performs eight exact Back restorations at positions `0` and `137`; the live review performs six more same-entry Back restorations and verifies result → restore → editor keyboard order.
- **V** — cold live baseline: `.factory/evidence/polish-3-retry2-live/verify-url.txt`; live PWA and header/404 policy: `.factory/evidence/polish-3-retry2-live/pwa.txt`, `.factory/evidence/polish-3-retry2-live/deployment.txt`.
- **Screens** — home `.factory/evidence/polish-3-retry2-live/live-home-390.png`; demo `.factory/evidence/polish-3-retry2-live/live-demo-390.png`; keyboard demo `.factory/evidence/polish-3-retry2-live/demo-keyboard-390.png`; 404 `.factory/evidence/polish-3-retry2-live/404-390.png`.

All URL checks below are cold checks against the deployed URL unless a route is shown.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the direct database-row headline, named self-hosting webhook developers, and identified the npm library on the first screen. | `mobile first screen includes the action note and all three facts` (U); `/`; home screen. |
| F-1-2 | The first action opens a completed seeded demo in one click. | `@claim:demo-seed` (C); `/demo`; demo screen. |
| F-1-3 | Kept the isolated memory-only demo, persistent banner, Reset demo, and Leave demo controls. | `@claim:demo-seed`, `@claim:demo-privacy` (C); `/demo`; demo screen. |
| F-1-4 | Retained the 27-entry registry with exactly one tagged observable test per claim. | registry audit plus 27/27 clean commands (C). |
| F-1-5 | Kept the real demo route and product-styled Static Web Apps 404. | `@claim:site-routes`, `@claim:deployment-policy` (C); `/demo`, `/definitely-missing-polish-3`; 404 screen. |
| F-1-6 | Removed global smooth-scroll timing and the reused-entry state leak. Every traversal now creates a fresh restoration transaction, cancels only an in-flight duplicate, refocuses the saved control, restores exact coordinates over stable frames, and announces the route. | `route navigation restores the exact saved position, focus, and announcement repeatedly` (U): eight same-entry cycles at `0` and `137`; 80/80 stress restorations; K; `/` ↔ `/demo`. |
| F-1-12 | Uses measurable database-row wording instead of incident/hot-path language. | `@claim:inline-reduction` (C); `/demo`; demo screen. |
| F-1-13 | Keeps encryption and S3-compatible wording within independently tested library behavior. | `@claim:crypto-format`, `@claim:s3-compatibility` (C); `/`, README. |
| F-1-14 | Uses signed-reference wording and tests retrieval without a click-count promise. | `@claim:retrieval`, `@claim:reference-shape` (C); `/demo`. |
| F-1-15 | Tests packed ESM, CommonJS, declarations, and zero runtime dependencies in a fresh consumer. | `@claim:package-formats` (C); `/`. |
| F-1-16 | Asserts AES-256-GCM, random 96-bit IVs, and HMAC-SHA-256 references. | `@claim:crypto-format` (C); `/`, README. |
| F-1-17 | Uses a real ephemeral MinIO server for adapter compatibility. | `@claim:s3-compatibility` (C); `/`. |
| F-1-18 | Precaches and reloads the seeded demo offline. | `@claim:offline-demo` (C); V. |
| F-1-19 | Exercises every named browser store, reset, reload, sentinels, and request payloads. | `@claim:demo-privacy` (C); `/demo`; demo screen. |
| F-1-20 | Verifies zero site/library telemetry paths. | `@claim:no-telemetry` (C); `/demo`. |
| F-1-21 | Covers exact and escaped JSON Pointers plus an unlisted secret. | `@claim:allowlist` (C); `/`. |
| F-1-22 | Uses precise compensating-cleanup language and tests a later write failure. | `@claim:write-confirmation` (C); README. |
| F-1-23 | Uses redacted preview and asserts every documented reference field. | `@claim:reference-shape`, `@claim:preview-redaction` (C); `/demo`. |
| F-1-24 | Tests the documented example on Node 20. | `@claim:node20-runtime` (C); README. |
| F-1-25 | Tests prefix-scoped object and byte reporting. | `@claim:retention` (C); `/`. |
| F-1-26 | Tests expired-only reclaim and non-destructive dry runs. | `@claim:retention` (C); `/`. |
| F-1-27 | Tests legal-hold exclusion and retains operator lifecycle guidance. | `@claim:retention` (C); README. |
| F-1-28 | Tests mandatory untouched-byte verification and failure non-forwarding. | `@claim:proxy-order` (C); `/`. |
| F-1-29 | Opens with a visible encrypted object, signed reference, and measured row size. | `@claim:demo-seed`, `@claim:inline-reduction` (C); `/demo`; demo screen. |
| F-1-30 | Keeps the privacy and explicit scope section before the final action. | `all routes pass axe, semantic, keyboard-focus, and console checks` (U); `/`. |
| F-1-31 | Tests the README example from an installed tarball in a fresh project. | `@claim:package-formats`, `@claim:node20-runtime` (C); README. |
| F-1-32 | Tests audit headers and all proxy rejection classes. | `@claim:proxy-order`, `@claim:audit-headers` (C); README. |
| F-1-33 | Tests pre-read signature rejection and post-decryption digest rejection. | `@claim:reference-integrity`, `@claim:post-decryption-integrity` (C); README. |
| F-1-34 | Tests that host keys are absent from store records and logs. | `@claim:key-handling` (C); README. |
| F-1-35 | Tests token, data URI, long base64, and ordinary-text preview fixtures. | `@claim:preview-redaction` (C); README. |
| F-1-36 | Tests configured key-version serialization, verification, and restore. | `@claim:key-version` (C); README. |
| F-1-37 | Tests ESM, CJS, declaration, and static-site build paths. | `@claim:build-artifacts` (C); README. |
| F-1-38 | Tests built deployment policy and checks live headers, immutable assets, worker cache, and 404. | `@claim:deployment-policy` (C); V; `/definitely-missing-polish-3`. |
| F-1-39 | Separates the in-memory demo contract from operator storage responsibility. | `@claim:demo-privacy` (C); `/privacy/`. |
| F-1-40 | Tests MIT/free, no-gate behavior. | `@claim:license-price` (C); `/`, `/terms/`. |
| F-1-41 | Provides complete per-route title, description, canonical, OG, Twitter, icon metadata. | `@claim:site-routes` (C); L; `/`, `/demo`, `/privacy/`, `/terms/`. |
| F-1-42 | Keeps the same skip link, four-link header, and three-link footer on legal and recovery pages. | `@claim:site-routes` (C); L; `/privacy/`, `/terms/`, 404 screen. |
| F-1-43 | Keeps visible links and controls at least 44px at 390px. | `390px routes have no overflow, keep navigation, and expose 44px targets` (U); L. |
| F-1-44 | Labels external GitHub and license links visibly. | `@claim:site-routes` (C); `/`, `/privacy/`. |
| F-1-45 | Keeps the required privacy/limits section before the final action. | `all routes pass axe, semantic, keyboard-focus, and console checks` (U); `/`. |
| F-1-46 | Standardizes user-facing wording on signed reference and Database reference. | copy audit; `@claim:reference-shape` (C); `/demo`. |
| F-1-47 | Separates the route name Demo from the Payload playground instrument. | copy audit; `@claim:demo-seed` (C); `/demo`. |
| F-1-48 | Uses a direct developer-audience eyebrow. | first-screen test (U); `/`; home screen. |
| F-1-49 | Names the database result in the playground heading. | `@claim:demo-seed` (C); `/demo`. |
| F-1-50 | Names the replacement action directly in the flow heading. | L; `/`. |
| F-1-51 | Names the four configuration options directly. | L; `/#install`. |
| F-1-52 | Uses standalone retention headings. | L; `/`. |
| F-1-53 | Names the final database-row outcome. | L; `/`. |
| F-1-54 | Gives a concrete valid JSON Pointer in the input error. | aggregate form/a11y test (U); `/demo`. |
| F-1-55 | Makes each action name its actual result. | copy audit; U; `/`, `/demo`. |
| F-1-56 | Keeps README opening sentences short and separate. | `.factory/copy-audit.md`; README. |
| F-1-57 | Keeps README audience and exclusions as separate short sentences. | `.factory/copy-audit.md`; README. |
| F-1-58 | Keeps README retrieval instructions as separate short sentences. | `.factory/copy-audit.md`; README. |
| F-1-59 | Keeps legal-hold guidance as separate short sentences. | `.factory/copy-audit.md`; README. |
| F-1-60 | Keeps expiry/lifecycle guidance as separate short sentences. | `.factory/copy-audit.md`; README. |
| F-1-61 | Uses direct development commands. | `.factory/copy-audit.md`; README. |
| F-1-62 | Keeps deployment/404 instructions precise and verifies them live. | V; README; `/definitely-missing-polish-3`. |
| F-1-63 | Keeps package preparation and factory ownership as separate sentences. | `.factory/copy-audit.md`; README. |
| F-1-64 | Maintains short landing copy with no banned wording. | `.factory/copy-audit.md`; home screen. |
| F-1-65 | Keeps privacy, offline, and license facts in the 390px first viewport. | first-screen test (U); `/`; home screen. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Uses the exact shipped browser seed for the below-10% reduction claim. | `@claim:inline-reduction` (C); L reports 1.70%. |
| F-2-2 | Seeds a valid original PNG with matching filename, MIME, and dimensions. | `@claim:demo-media` (C); `/demo`. |
| F-2-3 | Keeps every checked route within a 390px viewport. | 390px route test (U); L. |
| F-2-4 | Keeps all four primary links visible at 390px. | 390px route test (U); home screen. |
| F-2-5 | Uses the shared header/footer on the product 404. | `@claim:site-routes` (C); `/definitely-missing-polish-3`; 404 screen. |
| F-2-6 | Uses the truthful Leave demo action. | `@claim:demo-seed` (C); `/demo`. |
| F-2-7 | Uses Spill result, not unexplained ledger jargon. | copy audit; `/demo`. |
| F-2-8 | Uses No spill decision yet as the standalone empty heading. | aggregate browser test (U); `/`. |
| F-2-9 | Uses JSON Pointer capitalization consistently in product copy. | copy audit; `/`, `/demo`, README. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-6 | Fully closed the remaining history timing race and repeated-entry leak with exact coordinates, a fresh per-traversal transaction, four stable frames, and Back/Forward focus plus announcement checks. | U; K records six live restorations at `0` and `137`; `/` ↔ `/demo`. |
| F-3-1 | Moved the completed result before the editor in demo DOM order and removed CSS reordering. The regression compares document coordinates, so viewport scroll cannot hide an order mismatch or cause a false failure. | `demo keyboard order follows the visible result before the editor` (U); K; `/demo`; keyboard demo screen. |
| F-3-2 | Rewrote the README sentence as “Package tests install the tarball in a fresh project and run this example with ESM and Node 20.” | `.factory/copy-audit.md`; `@claim:package-formats`, `@claim:node20-runtime` (C); README. |

## Final verification

- Exact final clean clone at `2f92b89`: `npm ci`, all 27 claim commands, `npm test` (37/37), `npm run check`, `npm audit --audit-level=moderate`, and `npm pack --dry-run` passed. See `.factory/evidence/polish-3-retry2-final-clean-*`.
- Ten additional fresh regression runs passed all 80 exact Back restorations.
- Live checks passed after deployment: cold URL baseline, all routes/metadata/a11y/privacy/mobile checks, six repeated Back restorations, direct `?demo=1`, PWA offline reload, security/cache policy, product 404, and link status.
- Live Lighthouse mobile scores: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.4 s, TBT 0 ms, CLS 0, and 116 KiB transfer. See `.factory/evidence/polish-3-retry2-live/lighthouse.json`.

No finding from reviews 1, 2, or 3 remains open.
