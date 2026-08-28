# Adversarial first-read review 3 — Event Payload Spillway

**Verdict: FAIL**

**Reviewed:** 2026-08-28 UTC

**Live site:** <https://event-payload-spillway.sociobot.in>

**Candidate:** `890cb398f97914edd2647bf36af6484af98934e3`

The cold first screen and one-click demo are clear, realistic, isolated, and honest. All 27 registered claim commands pass from a clean clone, and the live accessibility, offline, link, route, metadata, privacy, and deployment checks pass. The release still fails because the required aggregate `npm test` is nondeterministic on the earlier Back-navigation finding, the demo's keyboard order disagrees with its visual order, and one README phrase remains internal test jargon.

## Cold first screen, before scrolling

Fresh Chromium contexts opened `/` at 390×844 and 1440×1000 with no stored site data. No scrolling occurred before these answers were recorded.

| Question | 390 px | Desktop | Result |
| --- | --- | --- | --- |
| What does this do? | It is an npm library that moves oversized webhook fields out of database rows. | Same; the illustration also shows the selected field moving to encrypted object storage. | Clear. |
| For whom? | Self-hosting webhook and automation developers whose events contain large base64, media, or JSON values. | Same. | Clear. |
| What should I click first? | `Try it with sample data`. The adjacent sentence says the sample opens with its result already shown. | Same. | Clear. |

Exact copy supplying those answers: `Move oversized webhook fields out of your database`; `For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values. This is an npm library.`; `Try it with sample data`; and `Opens a seeded sample with the spill result already shown.`

At 390 px, the action note and all three facts end at y=657 in the 844 px viewport. At desktop, they end at y=989 in the 1000 px viewport. The first screen therefore includes the job, user, first action, expected result, privacy, offline, and price/license facts without scrolling.

## Findings

### Blocking

#### F-1-6 — Back navigation still has a scroll-restoration race

- **Earlier finding:** review 1 required route changes to restore both focus and scroll; review 2 reopened it when focus returned to `BODY`.
- **Location/quote:** `site/main.ts`: `history.scrollRestoration = "auto"` and `target.focus({ preventScroll: true })`. The code restores focus but neither records nor explicitly restores the prior scroll position.
- **Clean-clone evidence:** `npm test` failed 35/36. `route navigation restores focus and announces the returned page` expected `scrollY === 0` and observed `scrollY === 4`. Five requested targeted runs stopped on attempt 3: attempts 1–2 passed and attempt 3 failed with the same `4 !== 0` assertion.
- **Live evidence:** 12 fresh live repetitions restored `#try-demo`, the route announcement, and `scrollY = 0`. This does not close the finding because the production-equivalent build reproduces the race and the required quality gate fails nondeterministically.
- **Why this fails:** Back behavior depends on timing. A release verifier cannot rely on `npm test`, and a cached or fast navigation can restore a slightly different position even though focus is correct.
- **Concrete fix:** store both the triggering selector and `scrollX`/`scrollY` in the departing history entry. On `pageshow`/`popstate`, restore the saved scroll position after layout settles, then focus with `preventScroll`. Make the browser test wait for the restoration transaction rather than a focus-only condition, and run it repeatedly in the aggregate suite.

### High

#### F-3-1 — Demo keyboard order jumps down to the form, then backward to the result

- **Location/quote:** `/demo`; source CSS `body[data-page="demo"] .bench-grid .result { order: -1; }`, while the DOM keeps the form before the result.
- **Observed at 390 px after route focus reached the `h1`:** forward Tab order was `payload` (document y=1499), `pointer` (1864), `threshold` (1949), `Show spill result` (2005), then `Database reference` preformatted output (998) and `Restore original` (1286).
- **Why this fails:** the visual reading order shows the completed result first, but keyboard focus visits the lower form first and then jumps about 1,000 px backward. A keyboard user cannot follow the same product sequence shown on screen.
- **Concrete fix:** on the demo route, place the result before the form in DOM order as well as visual order. Keep the landing playground's form-first order if desired. Add a browser assertion that successive focus targets have a logical document order and that `Restore original` follows the result content without a backward jump.

### Minor

#### F-3-2 — “Packed-consumer tests” is internal test jargon

- **Location/quote:** `README.md`: `The packed-consumer tests run this example through ESM and Node 20.`
- **Why this fails:** a package user should not have to infer what is packed or consumed. The phrase describes the harness instead of the verification result.
- **Concrete rewrite:** `Package tests install the tarball in a fresh project and run this example with ESM and Node 20.`

## Copy audit

Counting method: visible words separated by whitespace; hyphenated terms, version strings, and API names count as one. Code blocks are excluded. Landing dynamic success/error sentences are included. Technical names such as JSON Pointer, AES-256-GCM, HMAC-SHA-256, and S3-compatible are retained because they identify concrete interfaces or algorithms for the developer audience.

### Landing sentences

| ID | Words | Sentence | Flag |
| --- | ---: | --- | --- |
| L1 | 5 | Offline: the demo still works. | — |
| L2 | 7 | Site files are cached on this device. | — |
| L3 | 16 | For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values. | — |
| L4 | 5 | This is an npm library. | — |
| L5 | 10 | Opens a seeded sample with the spill result already shown. | — |
| L6 | 18 | Technical cutaway showing a large coral JSON block diverted from a conveyor into a locked teal storage reservoir. | — |
| L7 | 9 | A selected large field moves to encrypted object storage. | — |
| L8 | 9 | Use the dedicated Demo for a seeded, isolated sample. | — |
| L9 | 8 | Change the attachment, JSON Pointer, or byte limit. | — |
| L10 | 9 | Show the sample event to create a signed reference. | — |
| L11 | 6 | Only configured JSON Pointers are considered. | — |
| L12 | 9 | An AES-256-GCM envelope is written through an S3-compatible adapter. | — |
| L13 | 10 | The reference records size, digest, field, redacted preview, and expiry. | — |
| L14 | 13 | Choose allowed fields, an inline limit, an object store, and a retention window. | — |
| L15 | 9 | Count encrypted and expired bytes for the configured prefix. | — |
| L16 | 7 | Dry runs show expired candidates without deleting. | — |
| L17 | 8 | Reclaim excludes objects marked with a legal hold. | — |
| L18 | 3 | Verify signatures first. | — |
| L19 | 14 | The proxy requires a callback for untouched request bytes before it parses an event. | — |
| L20 | 6 | The Demo uses temporary browser memory. | — |
| L21 | 6 | It sends no payload or telemetry. | — |
| L22 | 11 | Spillway is not a queue, CDN, malware scanner, or legal-retention service. | — |
| L23 | 7 | You configure production storage, keys, and retention. | — |
| L24 | 7 | Encrypted overflow control for selected webhook fields. | — |
| L25 | 5 | This is not valid JSON. | — |
| L26 | 7 | Fix the highlighted payload and try again. | — |
| L27 | 11 | Enter a JSON Pointer that starts with /, such as /result/attachment. | — |
| L28 | 8 | Choose a byte limit of at least 128. | — |
| L29 | 9 | 1 oversized allowed field moved to an encrypted object. | — |
| L30 | 7 | Database row uses [inline] of [raw] bytes. | — |
| L31 | 6 | No allowed field crossed the limit. | — |
| L32 | 4 | The event stays inline. | — |
| L33 | 4 | The spill decision failed. | — |
| L34 | 5 | Check the configuration and retry. | — |
| L35 | 8 | Restored 1 field locally; recovered value is [size]. | — |
| L36 | 3 | Restore failed: [error]. | — |
| L37 | 2 | Restore failed. | — |
| L38 | 4 | Run the sample again. | — |

Landing prose totals **295 words across 38 sentences: 7.8 words per sentence**. No landing sentence exceeds 22 words or uses a banned marketing adjective.

### Landing headings, actions, and labels

| Copy | Words | Type | Flag |
| --- | ---: | --- | --- |
| Move oversized webhook fields out of your database | 8 | `h1` | — |
| Try it with sample data | 5 | primary action | — |
| Copy install command | 3 | action | — |
| Demo data stays in this tab | 6 | fact | — |
| Works offline after first visit | 5 | fact | — |
| Free and MIT licensed | 4 | fact | — |
| Payload playground | 2 | eyebrow | — |
| See what stays in your database | 6 | `h2` / demo `h1` | — |
| Show spill result | 3 | action | — |
| Spill result | 2 | result label | — |
| No spill decision yet | 4 | `h3` / demo `h2` | — |
| Database reference | 2 | heading | — |
| Restore original | 2 | action | — |
| Reset sample | 2 | action | — |
| Reset demo | 2 | action | — |
| Leave demo | 2 | action | — |
| Replace only oversized allowed fields | 5 | `h2` | — |
| Choose exact fields | 3 | `h3` | — |
| Encrypt, then store | 3 | `h3` | — |
| Leave a signed reference | 4 | `h3` | — |
| Configure four required options | 4 | `h2` | — |
| Install / Configure / Proxy | 1 / 1 / 1 | tabs | — |
| Copy configuration | 2 | action | — |
| Copy proxy example | 3 | action | — |
| Control retention and deletion | 4 | `h2` | — |
| Review storage use | 3 | `h3` | — |
| Preview deletion | 2 | `h3` | — |
| Keep held objects | 3 | `h3` | — |
| What stays local and what this does not do | 9 | `h2` | — |
| Keep large values out of database rows | 7 | `h2` | — |
| Read the source | 3 | action | — |

All landing buttons use verbs that name their result. Terminology is consistent: `Demo` is the route, `Payload playground` is the form, `Spill result` is the output, and `signed reference` is the object left in the event.

### README sentences

| ID | Words | Sentence | Flag |
| --- | ---: | --- | --- |
| R1 | 13 | Event Payload Spillway is an npm library for self-hosted webhook and automation systems. | — |
| R2 | 11 | It moves explicitly allowed oversized JSON fields out of database rows. | — |
| R3 | 10 | It encrypts each value before writing it to S3-compatible storage. | — |
| R4 | 12 | The event keeps a signed reference with a redacted preview and expiry. | — |
| R5 | 14 | It is for developers whose events sometimes contain base64, media, or large JSON values. | — |
| R6 | 12 | It is not a queue, CDN, monitoring service, scanner, or legal-retention system. | — |
| R7 | 8 | The package ships ESM, CommonJS, and TypeScript declarations. | — |
| R8 | 7 | It has no runtime dependencies or telemetry. | — |
| R9 | 8 | Use Node 20+ with Web Crypto and fetch. | — |
| R10 | 8 | Only exact JSON Pointers in `allowlist` can spill. | — |
| R11 | 11 | The packed-consumer tests run this example through ESM and Node 20. | **F-3-2: jargon.** |
| R12 | 11 | They also compile the public declarations and load the CommonJS entry. | — |
| R13 | 5 | Create the bucket before use. | — |
| R14 | 11 | Allow GetObject, PutObject, DeleteObject, ListBucket, and HeadObject for the chosen prefix. | — |
| R15 | 5 | Objects are encrypted before upload. | — |
| R16 | 4 | Use TLS outside localhost. | — |
| R17 | 7 | `createSpillwayProxy` verifies untouched request bytes before parsing. | — |
| R18 | 5 | It requires a `verifyWebhook` callback. | — |
| R19 | 10 | The proxy does not forward rejected or partially transformed requests. | — |
| R20 | 9 | Successful requests include spill count and original digest headers. | — |
| R21 | 9 | Provider signature values are never copied into those headers. | — |
| R22 | 11 | If `publicBaseUrl` is set, each signed reference includes a retrieval URL. | — |
| R23 | 4 | Route it to `createRetrievalHandler`. | — |
| R24 | 9 | It verifies the reference and expiry before reading storage. | — |
| R25 | 8 | It decrypts the value and returns `Cache-Control: no-store`. | — |
| R26 | 5 | Treat retrieval URLs as secrets. | — |
| R27 | 8 | Add operator authentication before the handler in production. | — |
| R28 | 8 | `retentionReport()` counts objects, encrypted bytes, and expired bytes. | — |
| R29 | 6 | `reclaim()` uses expired-only candidates by default. | — |
| R30 | 5 | Use `dryRun: true` before deleting. | — |
| R31 | 8 | Pass `legalHold: true` when spilling a held value. | — |
| R32 | 10 | Reclaim excludes it until your storage policy removes the hold. | — |
| R33 | 8 | Values use AES-256-GCM with a random 96-bit IV. | — |
| R34 | 9 | References use HMAC-SHA-256 and are verified before storage reads. | — |
| R35 | 6 | Plaintext integrity is checked after decryption. | — |
| R36 | 13 | Keys come from the host and are never written to the spill store. | — |
| R37 | 9 | Previews redact likely tokens, data URIs, and long base64. | — |
| R38 | 5 | References include a key version. | — |
| R39 | 8 | Automated key rotation is not included in v0.1. | — |
| R40 | 6 | Expiry metadata does not guarantee deletion. | — |
| R41 | 13 | Add a matching bucket lifecycle rule and review retention requirements before enabling deletion. | — |
| R42 | 9 | Open the demo or `?demo=1` on the landing page. | — |
| R43 | 12 | It immediately runs a render event with a valid, original PNG attachment. | — |
| R44 | 13 | The shipped sample keeps its database row below 10% of the event size. | — |
| R45 | 12 | The banner identifies sample mode and offers Reset demo and Leave demo. | — |
| R46 | 9 | Demo keys, encrypted objects, and edits disappear on refresh. | — |
| R47 | 6 | The demo makes no payload uploads. | — |
| R48 | 8 | It writes no payload data to browser storage. | — |
| R49 | 6 | See `.factory/demo.md` for its isolation contract. | — |
| R50 | 10 | `npm run build:lib` writes ESM, CJS, and declarations to `dist/package`. | — |
| R51 | 9 | `npm run build:site` writes the static site to `dist/site`. | — |
| R52 | 6 | `npm run build` produces both artifacts. | — |
| R53 | 9 | Run `npm run verify:browser -- http://127.0.0.1:4174` against a preview. | — |
| R54 | 10 | Run `npm run verify:pwa -- http://127.0.0.1:4174` for the offline shell. | — |
| R55 | 9 | Deploy `dist/site/` as Azure Static Web Apps static content. | — |
| R56 | 8 | `staticwebapp.config.json` sets browser security headers and cache rules. | — |
| R57 | 12 | It sends unknown routes to the product 404 page with HTTP 404. | — |
| R58 | 8 | Run `npm run verify:deployment -- https://event-payload-spillway.sociobot.in` after deployment. | — |
| R59 | 9 | Use `npm pack` to prepare the library for publishing. | — |
| R60 | 7 | The factory owns publishing credentials and deployment. | — |
| R61 | 6 | MIT © 2026 Param Factory contributors. | — |

README prose totals **527 words across 61 sentences: 8.6 words per sentence**. No sentence exceeds 22 words and no banned marketing adjective appears. The only copy flag is R11/F-3-2. README headings—Event Payload Spillway, Install, Usage, S3-compatible storage, Reverse proxy and retrieval, Retention and safety, Demo, Development, Deploy, and License—remain understandable in context. The README has no buttons.

## Demo and sandbox

| Check | Result |
| --- | --- |
| One-click entry | Pass: the first-screen action opens `/demo`. `/?demo=1` also enters it directly. |
| Product already in use | Pass: the first demo screen has `Diverted`, 74,502 incoming bytes, 1,268 database bytes, 98% avoided, a signed database reference, and `Restore original`. |
| Realistic sample | Pass: the seeded `render.complete` event includes a valid original 180×180 PNG with matching filename and MIME metadata. |
| Persistent banner | Pass: `Demo — sample data, nothing is saved`, `Reset demo`, and `Leave demo` remain visible. |
| Reset | Pass: a unique edited marker is removed, all seed inputs return, and the result reruns. |
| Restore | Pass: the sample reports one restored field and 73 KB recovered. |
| Real-data isolation | Pass: injected real localStorage/sessionStorage sentinels remained unchanged. The tagged test also covers cookies, IndexedDB, OPFS, CacheStorage contents, reset, and reload. |
| Network privacy | Pass: the live cumulative flow made 29 same-origin GET requests, no POST/body upload, and no request containing the edited marker. |
| Offline | Pass: the service-worker-controlled demo reloaded offline and restored the sample. |
| Keyboard order | **Fail: F-3-1.** |

## Claims

The repository was cloned locally without hardlinks to `/tmp/event-payload-spillway-review3.cnKLlO`, installed there with `npm ci`, and verified from that clone. `npm run test:claims` executed every exact `test` string in `.factory/claims.json` and reported `Verified 27 declared claims.`

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `inline-reduction` | PASS | Exact seed: 1,268 / 74,502 bytes = 1.70%. |
| `demo-media` | PASS | PNG signature, MIME, name, dimensions, and substantial bytes match. |
| `crypto-format` | PASS | AES-256-GCM, distinct 96-bit IVs, and independently calculated HMAC-SHA-256. |
| `allowlist` | PASS | Exact and escaped pointers spill; unlisted secret remains inline. |
| `reference-integrity` | PASS | Tampered reference causes zero storage reads. |
| `post-decryption-integrity` | PASS | Modified plaintext with valid encryption metadata fails digest verification. |
| `write-confirmation` | PASS | A later failed write removes the prior object. |
| `retention` | PASS | Prefix-scoped encrypted/expired bytes, dry run, expiry, and legal holds. |
| `proxy-order` | PASS | Untouched bytes verified first; invalid signature/type/JSON/spill never forwards. |
| `audit-headers` | PASS | Count and original digest added without copying provider signature values. |
| `retrieval` | PASS | Signed URL restores and returns `Cache-Control: no-store`. |
| `reference-shape` | PASS | All named fields and optional retrieval URL serialize. |
| `preview-redaction` | PASS | Token, data URI, and long-base64 cases redact; ordinary text remains. |
| `key-handling` | PASS | Raw key material is absent from store data, metadata, and logs. |
| `key-version` | PASS | Configured version survives verification and restore. |
| `s3-compatibility` | PASS | Official ephemeral MinIO completes encrypted put/list/head/get/restore/delete. |
| `package-formats` | PASS | Packed ESM, CommonJS, declarations, and zero runtime dependencies work in a fresh consumer. |
| `node20-runtime` | PASS | Packed README example runs under Node 20. |
| `build-artifacts` | PASS | ESM, CJS, declarations, and static site files exist. |
| `license-price` | PASS | MIT license and no paid demo gate. |
| `demo-seed` | PASS | Completed seed opens; reset restores and reruns it. |
| `demo-privacy` | PASS | No payload upload/persistence across all named browser stores. |
| `no-telemetry` | PASS | Browser and Node flows emit no analytics, beacons, sockets, events, or logs. |
| `demo-route` | PASS | `?demo=1` opens the isolated seeded demo. |
| `offline-demo` | PASS | Warmed demo reloads and restores offline. |
| `site-routes` | PASS | Route metadata/shared shell and product 404 pass in the production-like server. |
| `deployment-policy` | PASS | Built security/cache policy and real 404 behavior pass. |

No live landing-page or README claim-like sentence lacks a corresponding registry entry. Scope limitations and operator instructions are not product promises. There is no untested registered claim. The aggregate suite failure is the separate F-1-6 quality-gate failure.

## Earlier-finding recheck

Every finding from reviews 1 and 2 was checked against the live site and current code. `Fixed` below means independently observed in this round, not copied from a polish report.

### Review 1

| Earlier ID | Round 3 result |
| --- | --- |
| F-1-1 | Fixed: first viewport names job, audience, and npm-library form. |
| F-1-2 | Fixed: one click opens a completed sample. |
| F-1-3 | Fixed: isolated demo route, banner, reset, leave action, and contract exist. |
| F-1-4 | Fixed: 27 unique registered claims each map to one tagged test file and all exact commands pass. |
| F-1-5 | Fixed live: unknown URL returns the product 404 with HTTP 404. |
| F-1-6 | **BLOCKING: reopened; focus/announcement pass, but scroll restoration races and `npm test` fails.** |
| F-1-12 | Fixed: measurable database-row wording replaces incident/hot-path copy. |
| F-1-13 | Fixed: encryption and compatible-storage statements have separate observable tests. |
| F-1-14 | Fixed: no two-click promise or user-facing `stub`; retrieval is tested. |
| F-1-15 | Fixed: packed ESM, CommonJS, declarations, and dependency count are tested. |
| F-1-16 | Fixed: AES-256-GCM, unique 96-bit IVs, and HMAC-SHA-256 are independently asserted. |
| F-1-17 | Fixed: compatibility uses official MinIO, not a fetch mock alone. |
| F-1-18 | Fixed: live and clean-clone offline reload/restore pass. |
| F-1-19 | Fixed: every named browser store, reload, reset, requests, and edited marker are checked. |
| F-1-20 | Fixed: telemetry claim is registered and instruments site/library channels. |
| F-1-21 | Fixed: exact allowlist and escaped-pointer cases pass. |
| F-1-22 | Fixed: copy describes compensating cleanup and the failed second-write case passes. |
| F-1-23 | Fixed: `redacted preview` and every reference field are tested. |
| F-1-24 | Fixed: packed example runs under actual Node 20. |
| F-1-25 | Fixed: encrypted/expired byte totals and prefix scope are asserted. |
| F-1-26 | Fixed: dry run and expired-only behavior are asserted. |
| F-1-27 | Fixed: held objects stay excluded; lifecycle wording is guidance. |
| F-1-28 | Fixed: mandatory untouched-byte verification and non-forwarding pass. |
| F-1-29 | Fixed: demo opens on a completed encrypted result with measurements. |
| F-1-30 | Fixed: privacy/limits section and exclusions are present. |
| F-1-31 | Fixed functionally: tarball example runs in fresh ESM/Node 20 consumers; new wording flag is F-3-2. |
| F-1-32 | Fixed: both audit headers and signature non-copying are asserted. |
| F-1-33 | Fixed: post-decryption digest failure is exercised. |
| F-1-34 | Fixed: key encodings are searched across storage and logs. |
| F-1-35 | Fixed: all three redaction classes plus ordinary text are tested. |
| F-1-36 | Fixed: key version survives serialization, verification, and restore. |
| F-1-37 | Fixed: public artifact paths are registered and asserted. |
| F-1-38 | Fixed: deployment claim is registered; live security/cache/404 checks pass. |
| F-1-39 | Fixed: privacy copy separates demo behavior from operator responsibility. |
| F-1-40 | Fixed: MIT/no-paid-gate claim is registered and passes. |
| F-1-41 | Fixed: every route has complete canonical, OG, Twitter, icon, and description fields. |
| F-1-42 | Fixed: legal and recovery routes share the four-link header and three-link footer. |
| F-1-43 | Fixed: live 390 px check found zero controls below 44×44 px. |
| F-1-44 | Fixed: all external links display `(external)`. |
| F-1-45 | Fixed: privacy/limits section precedes the final action. |
| F-1-46 | Fixed: user copy consistently uses `signed reference`. |
| F-1-47 | Fixed: `Demo` and `Payload playground` have distinct consistent meanings. |
| F-1-48 | Fixed: audience eyebrow is direct. |
| F-1-49 | Fixed: playground heading names what remains in the database. |
| F-1-50 | Fixed: flow heading directly describes replacement. |
| F-1-51 | Fixed: configuration heading names four required options. |
| F-1-52 | Fixed: retention headings work out of context. |
| F-1-53 | Fixed: final action names the database-row outcome. |
| F-1-54 | Fixed: pointer error gives `/result/attachment` as a concrete example. |
| F-1-55 | Fixed: all copy buttons name the copied result. |
| F-1-56 | Fixed: README opening is split into short sentences. |
| F-1-57 | Fixed: audience and exclusions are separate short sentences. |
| F-1-58 | Fixed: retrieval instructions are separate short sentences. |
| F-1-59 | Fixed: legal-hold instructions are separate short sentences. |
| F-1-60 | Fixed: expiry and lifecycle guidance are separate short sentences. |
| F-1-61 | Fixed: development instructions are direct imperatives. |
| F-1-62 | Fixed: deployment policy and 404 behavior are separate and true live. |
| F-1-63 | Fixed: package preparation and factory ownership are separate. |
| F-1-64 | Fixed: README averages 8.6 words; no sentence exceeds 22. |
| F-1-65 | Fixed: privacy, offline, and price facts fit above 844 px. |

### Review 2

| Earlier ID | Round 3 result |
| --- | --- |
| F-2-1 | Fixed: exact live seed is 1.70%, below the registered 10% bound. |
| F-2-2 | Fixed: seed is a valid original PNG with matching metadata. |
| F-2-3 | Fixed: all five checked routes have 390 px scroll width and client width. |
| F-2-4 | Fixed: all four primary links remain visible at 390 px. |
| F-2-5 | Fixed: live 404 uses the shared header and footer. |
| F-2-6 | Fixed: banner truthfully says `Leave demo`. |
| F-2-7 | Fixed: result label says `Spill result`. |
| F-2-8 | Fixed: empty heading says `No spill decision yet`. |
| F-2-9 | Fixed: `JSON Pointer` capitalization is consistent. |

Review 2's reopened F-1 findings are covered individually in the review 1 table. The polish reports correctly closed them except F-1-6, whose race was not exposed by their single successful run.

## Site structure, accessibility, and live crawl

| Check | Result |
| --- | --- |
| Titles | Pass: route-specific, plain, and 29–44 characters. Root is `Event Payload Spillway — move webhook fields`. |
| Semantics | Pass: `lang=en`, one `h1`, `main`, landmarks, ordered headings, labels, and alt text. |
| Metadata | Pass: descriptions, canonicals, OG/Twitter sets, SVG favicon, 180 px touch icon, and 1200×630 social image. |
| Designed 404 | Pass: unknown route returns HTTP 404 with product title, shared shell, and recovery actions. |
| Deep links | Pass: `/demo`, `/privacy/`, `/terms/`, and fragment targets load directly. |
| Back/focus | **Fail under F-1-6:** focus and announcement pass, exact scroll restore races. |
| Keyboard sequence | **Fail under F-3-1:** demo DOM order conflicts with visual order. |
| Link crawl | Pass: all distinct internal, fragment, GitHub, and license links resolve; fragment targets exist. |
| Mobile layout | Pass: no horizontal overflow; four header links remain visible; controls are at least 44 px. |
| Axe/console | Pass live: five routes, zero WCAG A/AA/2.1AA violations and zero console errors. |
| Focus styling | Pass: 3 px brass outline with offset. |
| Reduced motion | Pass: smooth scrolling and transitions collapse under the media query. |
| Security/cache | Pass live: CSP, content type, frame, referrer, and permissions headers; immutable hashed assets; no-cache worker. |
| `robots.txt` / sitemap | Pass: public files exist and sitemap lists all four routes. |
| Visual identity | Pass: industrial manual typography, warm paper, halftone art, mechanical borders, and spillway diagram are distinct from a generic SaaS template and match `.factory/design.md`. |

`/opt/fleet/lib/verify-url.sh` reported title, language, one h1, main, zero missing image alternatives, zero unlabeled buttons, and zero browser errors. The first-load application JavaScript is 15.61 KB raw / 6.16 KB gzip.

## Missed leverage

No AI feature is justified. The product's core work is deterministic encryption, storage, signing, and retention; a model call would add cost and data exposure without improving that job. The brief's expected additional operator capabilities—MinIO/S3-compatible storage, signed retrieval, retention reports, dry-run reclaim, legal holds, and a reverse proxy—are present. No import, export, sync, or AI finding is added.

## Verification summary

- Clean clone: `npm ci` passed with zero vulnerabilities.
- Exact claim registry: 27/27 commands passed.
- Aggregate suite: **failed**, 35/36; F-1-6 observed `scrollY = 4` instead of `0`.
- Targeted F-1-6 repetition: passed twice, then failed on attempt 3 with the same value.
- `npm run check`: passed.
- `npm run build`: passed and produced `dist/package` plus `dist/site`.
- `npm audit --audit-level=moderate`: zero vulnerabilities.
- Live cumulative review: five routes, 1.70% inline ratio, zero axe violations, zero console errors, no overflow, zero small targets, same-origin GET-only traffic, and focus returned to `#try-demo`.
- Live PWA: service-worker-controlled offline reload passed.
- Live deployment policy: security/cache headers and product HTTP 404 passed.
- Repeated live Back flow: 12/12 restored `#try-demo`, announcement, and y=0; the clean-build race remains reproducible.

## What would make this perfect

Make Back restoration deterministic so repeated clean-build runs and `npm test` always restore the saved scroll position. Align the demo's DOM and visual order so keyboard focus follows result then form without jumping backward. Replace `packed-consumer tests` with the concrete fresh-project sentence. Then rerun the full review from clean mobile/desktop contexts and a clean clone; perfection means no finding, no unstable gate, and no copy flag remains.
