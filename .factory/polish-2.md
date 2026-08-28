# Polish 2 — cumulative finding closure

Implementation commit: `792097b`

Review baseline: `642dd7d` / candidate `cc3540d`

Live site: <https://event-payload-spillway.sociobot.in>

Final deployment: Azure Static Web Apps `d5d8846f-6682-4dc2-ade0-d6fe67572f86`

The live cold-check measured the shipped demo at 74,502 raw bytes and 1,268 inline bytes: **1.70%**. The same check found zero axe violations, zero console errors, no horizontal overflow, no undersized targets, and restored Back focus to `#try-demo`.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the direct database job headline, named self-hosting webhook developers, and identified the npm library on the first screen. | `mobile first screen includes the action note and all three facts`; `.factory/evidence/live-home-390.png`; live `/` |
| F-1-2 | The primary action opens the already-completed sample in one click. | `@claim:demo-seed`; `@claim:demo-route`; live `/demo` |
| F-1-3 | Preserved isolated in-memory demo mode, persistent banner, complete reset, and leave action. | `@claim:demo-privacy`; `@claim:demo-seed`; `.factory/demo.md` |
| F-1-4 | Expanded the registry to 27 claims, each with one matching tagged test and exact sandbox. | `npm run test:claims`: 27/27 in `.factory/evidence/clean-claims.txt` |
| F-1-5 | Removed the catch-all home rewrite so the Static Web Apps 404 override executes. | `@claim:deployment-policy`; live `/definitely-missing-polish-2` → HTTP 404 with product title |
| F-1-6 | Stores the triggering link in session history and restores focus, scroll, and the polite route announcement on Back. | `route navigation restores focus and announces the returned page`; live review reports `backFocus: #try-demo` |
| F-1-12 | Uses measurable database-row language and tests the exact shipped sample. | `@claim:inline-reduction`: 1,268 / 74,502 bytes live |
| F-1-13 | Encryption and compatible-storage promises are split and independently exercised. | `@claim:crypto-format`; `@claim:s3-compatibility` against official MinIO |
| F-1-14 | Uses `signed reference` consistently and makes no click-count promise. | `@claim:retrieval`; `@claim:reference-shape`; `rg 'stub' site README.md` has no user copy |
| F-1-15 | Tests a packed fresh consumer for ESM, CommonJS, declarations, and empty runtime dependencies. | `@claim:package-formats` |
| F-1-16 | Independently verifies AES-256-GCM, distinct 96-bit IVs, and HMAC-SHA-256 output. | `@claim:crypto-format` |
| F-1-17 | Replaced the fetch-only compatibility proof with a real ephemeral MinIO server and bucket. | `@claim:s3-compatibility` |
| F-1-18 | Precaches the complete demo shell and restores the sample offline. | `@claim:offline-demo`; live `npm run verify:pwa` |
| F-1-19 | Exercises localStorage, sessionStorage, cookies, IndexedDB, OPFS, CacheStorage, reset, reload, and request bodies. | `@claim:demo-privacy` |
| F-1-20 | Instruments browser and library fetch, beacon, WebSocket, EventSource, and console paths. | `@claim:no-telemetry` |
| F-1-21 | Covers exact, escaped RFC 6901 pointers and an unlisted secret. | `@claim:allowlist` |
| F-1-22 | Retains accurate compensating-cleanup wording and asserts removal after a later write fails. | `@claim:write-confirmation` |
| F-1-23 | Uses `redacted preview` and asserts every named reference field. | `@claim:reference-shape`; `@claim:preview-redaction` |
| F-1-24 | Runs the packed documented example under actual Node 20. | `@claim:node20-runtime` |
| F-1-25 | Asserts encrypted and expired byte totals plus configured-prefix isolation. | `@claim:retention` |
| F-1-26 | Asserts dry run makes no deletion and normal reclaim selects expired objects only. | `@claim:retention` |
| F-1-27 | Asserts held objects are excluded while retention guidance stays explicit. | `@claim:retention` |
| F-1-28 | Verifies untouched bytes before parsing and rejects failed requests without forwarding. | `@claim:proxy-order` |
| F-1-29 | Opens with an encrypted object, signed reference, and exact size measurements already visible. | `@claim:demo-seed`; `.factory/evidence/live-demo-390.png` |
| F-1-30 | Keeps the explicit privacy and product-limit section before the final action. | `site/index.html`; axe/route browser test |
| F-1-31 | Runs the README example from an installed tarball in a fresh project. | `@claim:package-formats`; `@claim:node20-runtime` |
| F-1-32 | Tests all rejection classes, zero forwarding, both audit headers, and signature non-copying. | `@claim:proxy-order`; `@claim:audit-headers` |
| F-1-33 | Tests zero reads for a bad reference and digest rejection after successful decryption. | `@claim:reference-integrity`; `@claim:post-decryption-integrity` |
| F-1-34 | Searches captured bodies, metadata, and console output for raw-key hex and base64 encodings. | `@claim:key-handling` |
| F-1-35 | Uses table fixtures for token, data URI, long base64, and ordinary text. | `@claim:preview-redaction` |
| F-1-36 | Asserts configured key version through serialization, signature verification, and restore. | `@claim:key-version` |
| F-1-37 | Registers and asserts ESM, CJS, declaration, and static-site artifact paths. | `@claim:build-artifacts` |
| F-1-38 | Registers security/cache/404 deployment policy and verifies the live responses. | `@claim:deployment-policy`; live `npm run verify:deployment` reports unknown status 404 |
| F-1-39 | Describes operator responsibility separately from the tested temporary demo path. | `@claim:demo-privacy`; `/privacy/` |
| F-1-40 | Registers MIT/no-paid-gate behavior and checks package, license, home, and demo artifacts. | `@claim:license-price` |
| F-1-41 | Adds complete canonical, OG, and Twitter fields to demo, legal, and 404 routes. | `@claim:site-routes`; live route crawl |
| F-1-42 | All legal and recovery pages use the same skip link, four-link header, and three-link footer. | `@claim:site-routes`; live `/privacy/`, `/terms/`, and 404 |
| F-1-43 | Gives skip, footer, header, and legal-inline actions real 44px activation boxes. | `390px routes have no overflow, keep navigation, and expose 44px targets`; live review `smallTargets: 0` |
| F-1-44 | Retains visible `(external)` labels on repository and license links. | shared live header/footer crawl |
| F-1-45 | Keeps a dedicated privacy/limits section before the final install action. | `.factory/evidence/live-home-390.png` |
| F-1-46 | Uses `signed reference` and `Database reference`; removed user-facing `stub`. | `.factory/copy-audit.md`; rendered landing/demo |
| F-1-47 | Uses `Demo` for the route and `Payload playground` for the instrument. | `.factory/copy-audit.md` |
| F-1-48 | First-screen eyebrow names webhook and automation developers. | live `/`; `.factory/evidence/live-home-390.png` |
| F-1-49 | Playground heading names the database result. | live `/demo` h1 |
| F-1-50 | Flow heading says exactly which fields are replaced. | live `/` flow section |
| F-1-51 | Configuration heading names the four options. | live `/#install` |
| F-1-52 | Retention headings work independently: review storage, preview deletion, keep held objects. | live `/` retention section |
| F-1-53 | Final action names the database-row outcome. | live `/` final section |
| F-1-54 | JSON Pointer error gives a valid `/result/attachment` example. | `npm test` interactive error coverage |
| F-1-55 | Names all copy outcomes and result/reset actions. | live buttons: `Copy install command`, `Copy configuration`, `Copy proxy example`; mobile browser test |
| F-1-56 | Opening library and encryption ideas remain separate short sentences. | `.factory/copy-audit.md`; README |
| F-1-57 | Audience and exclusions remain separate short sentences. | `.factory/copy-audit.md`; README |
| F-1-58 | Retrieval steps remain separate short sentences. | README retrieval section |
| F-1-59 | Legal-hold action and exclusion remain separate sentences. | README retention section |
| F-1-60 | Expiry limit and lifecycle guidance remain separate sentences. | README retention section |
| F-1-61 | Development instructions are direct commands. | README development section |
| F-1-62 | Deployment policy and 404 statements are short, separate, and now true live. | README deploy section; live unknown path 404 |
| F-1-63 | Package preparation and factory ownership remain separate. | README deploy section |
| F-1-64 | Landing sentences average 7.8 words; none exceed 22 or contain a banned word. | `.factory/copy-audit.md` |
| F-1-65 | Compacts the mobile hero and keeps the action note plus all privacy/offline/price facts above 844px. | `mobile first screen includes the action note and all three facts`; `.factory/evidence/live-home-390.png` |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Uses the exact browser seed in the reduction claim. The live row is 1.70%, not the prior 14.64%. | `@claim:inline-reduction`; live review summary |
| F-2-2 | Replaces repeated GIF-signature filler with the valid 180×180 original PNG and matching name/MIME metadata. | `@claim:demo-media`; `@claim:s3-compatibility` |
| F-2-3 | Wraps the build ID/footer and repairs all routes at 390px. | responsive browser test on five routes; live review `overflow: false` |
| F-2-4 | Keeps all four primary navigation links visible on phones. | responsive browser test; `.factory/evidence/live-home-390.png` |
| F-2-5 | Uses the exact shared four-link header and three-link footer on the 404. | `@claim:site-routes`; `.factory/evidence/404-390.png`; live unknown route |
| F-2-6 | Renames `Start for real` to the truthful `Leave demo`. | live `/demo`; `.factory/copy-audit.md` |
| F-2-7 | Renames `Spill ledger` to `Spill result`. | live landing/demo; `.factory/copy-audit.md` |
| F-2-8 | Renames the empty heading to `No spill decision yet`. | live landing; `.factory/evidence/live-home-390.png` |
| F-2-9 | Uses `JSON Pointer` capitalization everywhere in product copy. | `.factory/copy-audit.md`; `rg` source audit |

## Verification record

- Clean detached clone at `792097b`: `npm ci` passed with zero vulnerabilities.
- Every exact registry command: 27/27 passed; `.factory/evidence/clean-claims.txt`.
- Clean-clone `npm test`: 36/36 passed; `.factory/evidence/clean-suite.txt`.
- Clean-clone type check, audit, build, and pack: passed; tarball 14,442 bytes.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; `.factory/evidence/lighthouse-summary.json`.
- Live Lighthouse: 100/100/100/100, LCP 1.5 s, TBT 40 ms, CLS 0, transfer 116 KiB; `.factory/evidence/lighthouse-live-summary.json`.
- Live browser review: five routes, zero axe violations, zero console errors, no overflow, zero small targets, Back focus restored.
- Live PWA: service-worker-controlled offline reload passed.
- Live deployment policy: all configured security headers, immutable hashed assets, no-cache worker, and unknown route HTTP 404 passed.
- Built/live SHA-256 matched for home, demo, privacy, terms, 404, service worker, touch image, and main JavaScript.

No finding from review 1 or review 2 remains open.
