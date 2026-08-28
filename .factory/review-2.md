# Adversarial first-read review 2 — Event Payload Spillway

**Verdict: FAIL**

**Reviewed:** 2026-08-28 UTC

**Live site:** https://event-payload-spillway.sociobot.in

**Candidate:** `cc3540dd2559202fe1507ee97c57041532ec5329`

The first-screen message is understandable and the one-click demo works, but the release is not clean. The live sample contradicts a registered reduction claim, unknown URLs return the home page with HTTP 200, mobile pages overflow horizontally, and several findings marked fixed after review 1 remain only partly fixed. All 15 declared claim commands returned zero from a clean clone; that does not cure tests which exercise a different scenario from the claim or public claims absent from the registry.

## Cold first screen, before scrolling

Fresh Chromium contexts opened `/` at 390×844 and 1440×1000 with no prior site data.

| Question | 390 px | Desktop | Result |
| --- | --- | --- | --- |
| What does this do? | An npm library moves oversized webhook fields out of database rows. | Same; the illustration also shows encrypted object storage. | Clear. |
| For whom? | Self-hosting webhook and automation developers receiving large base64, media, or JSON values. | Same. | Clear. |
| What should I click first? | `Try it with sample data`. | Same. | Clear. |

The exact copy that supplied those answers was `Move oversized webhook fields out of your database`, `For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values. This is an npm library.`, and `Try it with sample data`.

The three required facts are not visible before scrolling at 390×844. The viewport ends during `Opens a seeded sample with the spill result already shown.`; `Demo data stays in this tab`, `Works offline after first visit`, and `Free and MIT licensed` are below it. This reopens F-1-65 below.

## Findings

### Blocking

#### F-2-1 — The registered shipped-sample reduction claim is false on the shipped sample

- **Claim:** `.factory/claims.json`: `The shipped sample keeps the database row below 10% of the original event size.`
- **Live evidence:** the seeded `/demo` reports `Incoming 7.8 KB`, `Database 1.1 KB`, and `Database row uses 1176 of 8035 bytes.` The inline row is 14.64% of the original, not below 10%.
- **Why this fails:** `@claim:inline-reduction` passes because it uses a different 80,000-character fixture. It does not test the shipped browser sample named by the claim.
- **Concrete fix:** either make the actual `/demo` fixture satisfy the 10% threshold or change the claim to the measured bound. Make the tagged test load `/demo` and assert `inlineBytes / rawBytes < 0.10` against that exact seed.

#### F-2-2 — The “realistic” demo attachment is not a valid payload of its declared type

- **Location/quote:** README: `It immediately runs a realistic render event in browser memory.` Demo seed: `mime: "image/png"` with an attachment beginning `data:image/png;base64,R0lGOD...`.
- **Why this fails:** `R0lGOD` is a GIF signature, not PNG, and the short fragment is repeated hundreds of times. The seed is synthetic filler with a false MIME label. The demo contract requires realistic sample data.
- **Concrete fix:** ship one valid, rights-cleared PNG data URI with plausible render metadata. Add a demo test that decodes the data URI, verifies the PNG signature, and confirms that `mime` matches it.

#### F-1-5 — Unknown routes still do not show the designed 404

- **Live location:** `/definitely-missing-review-2`.
- **Observed:** HTTP 200, home title, home canonical, and the complete landing page. `/404.html` exists but is not used for an unknown URL.
- **Why this fails:** a bad link silently impersonates the home page. The passing `@claim:site-routes` test uses a custom local server that returns `404.html`; it does not test the deployed Static Web Apps fallback, so the registered claim is false live.
- **Concrete fix:** configure the host so unknown document routes return the designed page with HTTP 404. Add a deployment-level claim test against the production-equivalent host, not the custom test server.

#### F-1-6 — Back navigation still loses keyboard focus

- **Path:** focus `Try it with sample data` → press Enter → `/demo` → browser Back.
- **Observed:** `/demo` correctly focuses its `h1`; Back returns to `/` at `scrollY = 0` but leaves focus on `BODY` and announces nothing.
- **Why this fails:** the earlier finding required both scroll and focus restoration. Keyboard users lose their previous control.
- **Concrete fix:** preserve the triggering element in history state and restore focus on `pageshow`/`popstate`, or use client routing that restores the prior focus target and announces the returned page.

#### F-1-15 — Package-format and dependency claims remain incompletely registered

- **Quotes:** landing `Typed ESM, CommonJS, and declarations` and `No telemetry or runtime dependencies`; README `The package ships ESM, CommonJS, and TypeScript declarations.` and `It has no runtime dependencies or telemetry.`
- **Why this fails:** `package-output` names only CommonJS alongside the API. Its test checks ESM functions, CommonJS functions, and an empty dependency object, but does not assert emitted declarations or telemetry behavior. The public sentences therefore have no matching complete claim entry.
- **Concrete fix:** register the exact formats/declarations/dependency claim and test the packed tarball from a fresh consumer, including a TypeScript compile. Keep telemetry in its own claim and test.

#### F-1-16 — The HMAC and IV algorithm sentence is not fully claimed or tested

- **Quote:** README: `Values use AES-256-GCM with a random 96-bit IV.` and `References use HMAC-SHA-256 and are verified before storage reads.`
- **Why this fails:** `encryption-envelope` covers AES ciphertext and checks one 96-bit IV, while `reference-integrity` checks tamper rejection. No registry claim names HMAC-SHA-256, and no black-box fixture proves that algorithm.
- **Concrete fix:** add one exact cryptographic-format claim with a tagged fixture test for AES-256-GCM, independently generated 96-bit IVs, and the HMAC-SHA-256 reference format.

#### F-1-17 — “S3-compatible” is still tested only through a fetch mock

- **Quotes:** landing `An AES-256-GCM envelope is written through an S3-compatible adapter.`; README heading `S3-compatible storage`.
- **Why this fails:** `@claim:s3-contract` supplies a mocked `fetch` and checks a URL, one authorization prefix, and metadata. It never completes put/list/head/get/delete against MinIO or another S3-compatible server. The original finding specifically required that integration proof.
- **Concrete fix:** run the tagged claim against a temporary local MinIO bucket and assert encrypted put, list/head metadata, restore, and delete.

#### F-1-19 — The automated demo-isolation claim does not cover the full storage contract

- **Quote:** README: `The demo makes no payload uploads and writes no browser storage.`
- **Why this fails:** `@claim:demo-privacy` checks same-origin requests, localStorage, and IndexedDB only. It does not check sessionStorage, cookies, OPFS, CacheStorage contents, reload disposal, or that edited payload text is absent after reset/reload. Manual review found no leak, but the claim remains incompletely automated.
- **Concrete fix:** extend the tagged test with real-data sentinels in every browser store, a unique edited payload, reset and reload, storage enumeration, and an assertion that only public shell files enter CacheStorage.

#### F-1-20 — “No telemetry” remains an unlisted claim

- **Quotes:** landing `No telemetry or runtime dependencies`; README `It has no runtime dependencies or telemetry.`
- **Why this fails:** no `claims.json` entry states that the library and site emit no telemetry. Same-origin-only request checks do not exclude same-origin analytics, and an empty runtime dependency list does not prove runtime behavior.
- **Concrete fix:** add a `no-telemetry` claim and tagged browser/library test that instruments fetch, beacon, WebSocket, console/logging hooks, and package execution.

#### F-1-23 — The named signed-reference fields are not registered as a claim

- **Quote:** landing: `The reference records size, digest, field, redacted preview, and expiry.`
- **Why this fails:** `encryption-envelope` mentions only ciphertext and a redacted encoded preview; its test does not assert every named reference field.
- **Concrete fix:** add a `reference-shape` entry and tagged test asserting size, digest, field, preview, expiry, retrieval URL behavior, and serialization.

#### F-1-24 — The Node 20 compatibility claim has no matching test

- **Quotes:** landing `Node 20+ with Web Crypto and fetch`; README `Use Node 20+ with Web Crypto and fetch.`
- **Why this fails:** the review ran under Node 22. The registry has no compatibility entry and no test runs the packed package on Node 20.
- **Concrete fix:** add a Node 20 clean-consumer claim test or narrow the copy to the tested runtime.

#### F-1-25 — Retention byte-count claims are not asserted

- **Quotes:** landing `Count encrypted and expired bytes for the configured prefix.`; README ``retentionReport()` counts objects, encrypted bytes, and expired bytes.`
- **Why this fails:** `@claim:retention` asserts object, expired-object, and held-object counts, but never asserts `encryptedBytes` or `expiredBytes`.
- **Concrete fix:** seed known body sizes and assert both byte totals and prefix isolation in the tagged test.

#### F-1-31 — The README example is not covered by the claimed packed-consumer test

- **Quote:** `The packed-consumer test covers this example.`
- **Why this fails:** `@claim:package-output` imports repository build files directly. It does not run `npm pack`, install the tarball into a fresh project, or execute the README example.
- **Concrete fix:** add the stated packed-consumer test using the exact example, or remove the sentence.

#### F-1-32 — Proxy audit-header claims are unlisted and partly unasserted

- **Quotes:** `Successful requests include spill count and original digest headers.` and `Provider signature values are never copied into those headers.`
- **Why this fails:** `proxy-order` names verification order and non-forwarding only. Its test checks `x-spillway-count`, but not `x-spillway-original-sha256` or absence of provider signature values.
- **Concrete fix:** register an `audit-headers` claim and assert both header values plus explicit non-copying of inbound signature headers.

#### F-1-33 — Post-decryption integrity checking remains unlisted and untested

- **Quote:** `Plaintext integrity is checked after decryption.`
- **Why this fails:** `reference-integrity` mutates a signed reference before retrieval. It does not corrupt decrypted object content and observe the digest failure described here.
- **Concrete fix:** add a tagged corrupted-ciphertext/plaintext-digest fixture that reaches the post-decryption integrity check.

#### F-1-34 — The key-storage claim remains unlisted and untested

- **Quote:** `Keys come from the host and are never written to the spill store.`
- **Why this fails:** no claim entry or instrumented test searches stored bodies, metadata, errors, or logs for key material.
- **Concrete fix:** add a key-handling claim with a spy store and captured output, then assert no raw key bytes or encodings appear.

#### F-1-35 — The three promised redaction classes are not tested

- **Quote:** `Previews redact likely tokens, data URIs, and long base64.`
- **Why this fails:** `encryption-envelope` exercises one data URI only. It does not cover likely tokens and standalone long base64.
- **Concrete fix:** register the exact redaction claim and use a table-driven tagged test for all three classes plus ordinary text.

#### F-1-36 — The key-version claim remains unlisted

- **Quote:** `References include a key version.`
- **Why this fails:** no registry entry or tagged assertion covers serialized `keyVersion`.
- **Concrete fix:** add a claim and assert the configured version survives spill, signature verification, and restore.

#### F-1-37 — Public build-output claims remain outside the registry

- **Quotes:** ``npm run build:lib` writes ESM, CJS, and declarations to `dist/package`.`; ``npm run build:site` writes the static site to `dist/site`.`; ``npm run build` produces both artifacts.`
- **Why this fails:** builds succeeded, but no claim entry and tagged artifact test state and assert these public promises.
- **Concrete fix:** add one build-artifacts claim and assert the documented files and entry points after a clean build.

#### F-1-38 — Deployment-policy claims remain unregistered, and one is false live

- **Quotes:** ``staticwebapp.config.json` sets browser security headers and cache rules.` and `It rewrites unknown routes to the product 404 page.`
- **Why this fails:** the policy tests are untagged and absent from `claims.json`. Security/cache headers are present live, but the unknown-route sentence is false live.
- **Concrete fix:** register deployment claims and test live/prod-equivalent responses for headers, caches, and an actual unknown path returning the designed 404 with status 404.

#### F-1-40 — “Free and MIT licensed” remains an unlisted claim

- **Quotes:** hero `Free and MIT licensed`; README `MIT © 2026 Param Factory contributors.`
- **Why this fails:** no claim entry checks package/license files and the absence of a paid runtime gate.
- **Concrete fix:** register a license/price claim and test the packed artifact contains the MIT license and that the demo has no paid gate; otherwise remove the hero fact.

#### F-1-41 — Secondary routes still have incomplete social metadata

- **Locations:** `/demo`, `/privacy/`, `/terms/`, and direct `/404.html`.
- **Observed:** demo/privacy/terms omit `og:url` and include only `twitter:card`, with no Twitter title, description, or image. The 404 omits Open Graph and Twitter metadata entirely.
- **Why this fails:** the earlier finding required route-specific canonical, Open Graph, and Twitter metadata on every route. It was marked fixed but remains partial.
- **Concrete fix:** emit the complete metadata set per route and test every required field, not merely that a canonical exists.

#### F-1-43 — Several interactive targets remain smaller than 44 px

- **Live measurements:** focused skip link 224×42; footer `Terms` 42×44; privacy `GitHub (external)` 136×18; terms `MIT License (external)` 184×18.
- **Why this fails:** these include the exact root-footer and legal-inline cases from review 1. Inline links still lack a 44 px activation area.
- **Concrete fix:** give each control a minimum 44×44 CSS box without relying on neighboring whitespace, then add a rendered-size assertion at 390 px and desktop.

#### F-1-55 — Three buttons still say only “Copy”

- **Location:** Install, Configure, and Proxy code panels on `/`.
- **Why this fails:** `Copy` does not name the result. Review 1 explicitly flagged these buttons; the polish report said copy actions were named, but the live buttons remain generic.
- **Concrete fix:** use `Copy install command`, `Copy configuration`, and `Copy proxy example`.

#### F-1-65 — The required privacy/offline/price facts are below the mobile first screen

- **Location:** `/` at 390×844 before scrolling.
- **Observed:** all three facts are below the viewport; even the action-note sentence is clipped at the bottom.
- **Why this fails:** the words are correct, but the mandatory first-screen shape is not delivered on the phone viewport under review.
- **Concrete fix:** reduce mobile hero type/spacing or place the three short facts above the secondary action so all three appear before the first scroll.

#### F-2-3 — Every page is 147 px wider than a 390 px viewport

- **Live evidence:** `documentElement.scrollWidth = 537`, `clientWidth = 390` on `/`, `/demo`, `/privacy/`, and `/terms/`.
- **Cause/location:** footer `.build-id` spans x=322.6 to x=536.8 because its non-wrapping text overflows the mobile flex layout.
- **Why this fails:** the whole product pans horizontally on a phone and fails the mobile baseline previously reported as passing.
- **Concrete fix:** stack or wrap the footer build ID below 560 px and add a `scrollWidth === clientWidth` assertion on every route.

### High

#### F-2-4 — The primary navigation is empty on phones

- **Location:** `.site-header nav` at 390 px.
- **Observed:** the 900 px rule hides links 2 and 3; the 560 px rule hides links 1 and 4. The nav landmark remains, but all four links are `display: none`.
- **Why this fails:** phone users cannot use the header to reach Demo, Install, Privacy, or GitHub.
- **Concrete fix:** keep the essential links visible in a wrapping compact row or provide an accessible menu button with focus management.

#### F-2-5 — The built 404 does not use the same header/footer contents

- **Location:** direct `/404.html`.
- **Observed:** its header omits Install and GitHub; its footer omits the external MIT license link.
- **Why this fails:** even once routing is fixed, the recovery page will not meet the consistent-shell requirement.
- **Concrete fix:** render the same shared header and footer used by the product routes, then add page-specific 404 content inside `main`.

### Minor copy findings

#### F-2-6 — “Start for real” does not name its actual result

- **Location:** `/demo` banner.
- **Observed:** `Start for real` only returns to the landing page; it does not initialize production storage or install the library.
- **Concrete rewrite:** `Leave demo` if it returns home, or `Open install guide` if it links to `/#install`.

#### F-2-7 — “Spill ledger” is unexplained product jargon

- **Location:** landing and demo result panel label.
- **Why this fails:** a first-time visitor has to translate the metaphor before understanding the panel.
- **Concrete rewrite:** `Spill result`.

#### F-2-8 — “No decision yet” is an out-of-context heading

- **Location:** landing result empty-state `h3`.
- **Why this fails:** in a screen-reader heading list, it does not say which decision is missing.
- **Concrete rewrite:** `No spill decision yet`.

#### F-2-9 — “JSON pointer” is capitalized inconsistently

- **Locations:** form label `Allowed JSON pointer`; nearby help, flow copy, and README use `JSON Pointer(s)`.
- **Concrete fix:** use `JSON Pointer` everywhere.

## Demo and sandbox result

| Check | Result |
| --- | --- |
| One-click entry | Pass: hero action opens `/demo`. |
| Product already in use | Pass: before any second click, `Diverted`, incoming/database bytes, 85% avoided, an encrypted reference, and Restore are rendered. |
| Banner | Pass: `Demo — sample data, nothing is saved`, Reset demo, Start for real. |
| Reset | Pass: a unique edited payload is replaced by the `render.complete` seed and the result reruns. |
| Real-data isolation | Pass in manual exercise: injected `real:sentinel` localStorage and `real:session` sessionStorage values remained unchanged; IndexedDB was empty; no cookies appeared. |
| Network privacy | Pass in manual exercise: all captured traffic was same-origin GET; no payload upload occurred. |
| Offline | Pass: after warming and enabling browser offline mode, `/demo` reloaded and restored one field. |
| Sample realism | **Blocking fail: F-2-2.** |
| Registered reduction | **Blocking fail: F-2-1.** |

## Declared claim execution

The repository was cloned with `git clone --no-local` to `/tmp/spillway-review2-clean-VK77eI`, detached at `cc3540d`, and installed with `npm ci`. Every command was run separately exactly as listed.

| Claim ID | Declared command result | Contract result |
| --- | --- | --- |
| `inline-reduction` | PASS | **False for live shipped sample; F-2-1.** |
| `encryption-envelope` | PASS | Registered assertion passed. |
| `allowlist` | PASS | Registered assertion passed. |
| `reference-integrity` | PASS | Registered assertion passed; narrower than F-1-33. |
| `write-confirmation` | PASS | Registered assertion passed. |
| `retention` | PASS | Object/expiry/hold checks pass; byte totals remain untested, F-1-25. |
| `proxy-order` | PASS | Ordering/non-forwarding pass; header claims remain incomplete, F-1-32. |
| `retrieval` | PASS | Registered assertion passed. |
| `s3-contract` | PASS | Mocked contract only; no real compatible store, F-1-17. |
| `package-output` | PASS | CJS/ESM/dependency assertions pass; declarations/telemetry/packed example remain uncovered. |
| `demo-seed` | PASS | Seed/reset behavior passed. |
| `demo-privacy` | PASS | Current assertions passed; full storage contract remains incomplete, F-1-19. |
| `demo-route` | PASS | `?demo=1` redirected to `/demo`. |
| `offline-demo` | PASS | Warmed local demo reloaded and restored offline. |
| `site-routes` | PASS | **False live for unknown routes; F-1-5.** |

The same clean clone also passed `npm test` (18/18), `npm run check`, and `npm run build`. The build emitted 14.44 kB raw JavaScript and 14.23 kB raw CSS. Live `verify:browser` reported zero axe violations and console errors; live `verify:pwa` passed; live deployment-header verification passed. These checks do not cover the findings above.

## Site structure and accessibility

| Check | Result |
| --- | --- |
| Route titles | Pass on `/`, `/demo`, `/privacy/`, `/terms/`; root is `Event Payload Spillway — move webhook fields`. |
| `lang`, one `h1`, `main`, alt text | Pass on product routes and direct `/404.html`. |
| Meta description/canonical/favicon/apple touch | Pass on normal routes; social fields are incomplete under F-1-41. |
| Designed 404 | File exists and is styled; **unknown-route delivery fails under F-1-5**. |
| Deep links | `/demo`, `/privacy/`, and `/terms/` return 200 and render the intended page. |
| Back/focus | **Fail: F-1-6.** |
| Link crawl | Pass: every distinct internal and external href returned 200; fragment targets exist. |
| Header/footer | Normal routes share markup; phone nav and 404 shell fail under F-2-4/F-2-5. |
| Touch targets | **Fail: F-1-43.** |
| Horizontal layout | **Fail: F-2-3.** |
| Contrast/semantics/console | Pass: Playwright axe reports zero WCAG 2 A/AA violations and no console errors. |
| Reduced motion | Pass in CSS: motion durations collapse and smooth scrolling is disabled. |
| Visual identity | Pass: the paper, halftone, industrial-ledger palette and mechanical geometry are product-specific, not a generic SaaS template. |
| `robots.txt` / sitemap | Pass; sitemap lists `/`, `/demo`, `/privacy/`, `/terms/`. |

## Missed leverage

No AI feature is justified for this deterministic encryption/storage library. Adding model calls would weaken its local-first and offline story. The brief's obvious operator features—S3-compatible storage, retrieval, retention reports, dry-run reclaim, and legal holds—exist. No import/export or sync finding is added.

## Copy audit

Counting method: visible words separated by whitespace; hyphenated terms and API names count as one. Code blocks are excluded. Landing dynamic success/error sentences are included. No banned marketing adjective appears. No sentence exceeds 22 words.

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
| L12 | 9 | An AES-256-GCM envelope is written through an S3-compatible adapter. | F-1-17 |
| L13 | 10 | The reference records size, digest, field, redacted preview, and expiry. | F-1-23 |
| L14 | 13 | Choose allowed fields, an inline limit, an object store, and a retention window. | — |
| L15 | 9 | Count encrypted and expired bytes for the configured prefix. | F-1-25 |
| L16 | 7 | Dry runs show expired candidates without deleting. | — |
| L17 | 8 | Reclaim excludes objects marked with a legal hold. | — |
| L18 | 3 | Verify signatures first. | — |
| L19 | 14 | The proxy requires a callback for untouched request bytes before it parses an event. | — |
| L20 | 6 | The Demo uses temporary browser memory. | — |
| L21 | 6 | It sends no payload or telemetry. | F-1-20 |
| L22 | 11 | Spillway is not a queue, CDN, malware scanner, or legal-retention service. | —; scope statement |
| L23 | 7 | You configure production storage, keys, and retention. | —; operator guidance |
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

Landing total: **295 words / 38 sentences = 7.8 words per sentence**.

### Landing headings, actions, labels, and terse claims

| Copy | Words | Type | Flag |
| --- | ---: | --- | --- |
| Move oversized webhook fields out of your database | 8 | `h1` | — |
| Try it with sample data | 5 | primary action | — |
| Copy install command | 3 | action | — |
| Demo data stays in this tab | 6 | fact | F-1-65 placement |
| Works offline after first visit | 5 | fact | F-1-65 placement |
| Free and MIT licensed | 4 | fact | F-1-40, F-1-65 |
| Payload playground | 2 | eyebrow | — |
| See what stays in your database | 6 | `h2` | — |
| Show spill result | 3 | action | — |
| Spill ledger | 2 | result label | F-2-7 |
| No decision yet | 3 | `h3` | F-2-8 |
| Database reference | 2 | `h3` | — |
| Restore original | 2 | action | — |
| Reset sample | 2 | action | — |
| Replace only oversized allowed fields | 5 | `h2` | — |
| Choose exact fields | 3 | `h3` | — |
| Encrypt, then store | 3 | `h3` | — |
| Leave a signed reference | 4 | `h3` | — |
| Configure four required options | 4 | `h2` | — |
| Install / Configure / Proxy | 1 / 1 / 1 | tabs | — |
| Copy | 1 | three code actions | F-1-55 |
| Control retention and deletion | 4 | `h2` | — |
| Review storage use | 3 | `h3` | — |
| Preview deletion | 2 | `h3` | — |
| Keep held objects | 3 | `h3` | — |
| What stays local and what this does not do | 9 | `h2` | — |
| Keep large values out of database rows | 7 | `h2` | — |
| Read the source | 3 | action | — |

The form label `Allowed JSON pointer` is flagged under F-2-9. Demo action `Start for real` is flagged under F-2-6.

### README sentences

| ID | Words | Sentence | Flag |
| --- | ---: | --- | --- |
| R1 | 13 | Event Payload Spillway is an npm library for self-hosted webhook and automation systems. | — |
| R2 | 11 | It moves explicitly allowed oversized JSON fields out of database rows. | — |
| R3 | 10 | It encrypts each value before writing it to S3-compatible storage. | — |
| R4 | 12 | The event keeps a signed reference with a redacted preview and expiry. | F-1-23 |
| R5 | 14 | It is for developers whose events sometimes contain base64, media, or large JSON values. | — |
| R6 | 12 | It is not a queue, CDN, monitoring service, scanner, or legal-retention system. | —; scope statement |
| R7 | 8 | The package ships ESM, CommonJS, and TypeScript declarations. | F-1-15 |
| R8 | 7 | It has no runtime dependencies or telemetry. | F-1-15, F-1-20 |
| R9 | 8 | Use Node 20+ with Web Crypto and fetch. | F-1-24 |
| R10 | 8 | Only exact JSON Pointers in `allowlist` can spill. | — |
| R11 | 6 | The packed-consumer test covers this example. | F-1-31; `packed-consumer` jargon |
| R12 | 5 | Create the bucket before use. | — |
| R13 | 11 | Allow GetObject, PutObject, DeleteObject, ListBucket, and HeadObject for the chosen prefix. | —; operator instruction |
| R14 | 5 | Objects are encrypted before upload. | — |
| R15 | 4 | Use TLS outside localhost. | —; operator instruction |
| R16 | 7 | `createSpillwayProxy` verifies untouched request bytes before parsing. | — |
| R17 | 5 | It requires a `verifyWebhook` callback. | — |
| R18 | 10 | The proxy does not forward rejected or partially transformed requests. | — |
| R19 | 9 | Successful requests include spill count and original digest headers. | F-1-32 |
| R20 | 9 | Provider signature values are never copied into those headers. | F-1-32 |
| R21 | 11 | If `publicBaseUrl` is set, each signed reference includes a retrieval URL. | — |
| R22 | 4 | Route it to `createRetrievalHandler`. | — |
| R23 | 9 | It verifies the reference and expiry before reading storage. | — |
| R24 | 8 | It decrypts the value and returns `Cache-Control: no-store`. | — |
| R25 | 5 | Treat retrieval URLs as secrets. | —; operator instruction |
| R26 | 8 | Add operator authentication before the handler in production. | —; operator instruction |
| R27 | 8 | `retentionReport()` counts objects, encrypted bytes, and expired bytes. | F-1-25 |
| R28 | 6 | `reclaim()` uses expired-only candidates by default. | — |
| R29 | 5 | Use `dryRun: true` before deleting. | — |
| R30 | 8 | Pass `legalHold: true` when spilling a held value. | — |
| R31 | 10 | Reclaim excludes it until your storage policy removes the hold. | — |
| R32 | 8 | Values use AES-256-GCM with a random 96-bit IV. | F-1-16 |
| R33 | 9 | References use HMAC-SHA-256 and are verified before storage reads. | F-1-16 |
| R34 | 6 | Plaintext integrity is checked after decryption. | F-1-33 |
| R35 | 13 | Keys come from the host and are never written to the spill store. | F-1-34 |
| R36 | 9 | Previews redact likely tokens, data URIs, and long base64. | F-1-35 |
| R37 | 5 | References include a key version. | F-1-36 |
| R38 | 8 | Automated key rotation is not included in v0.1. | —; explicit limitation |
| R39 | 6 | Expiry metadata does not guarantee deletion. | —; explicit limitation |
| R40 | 13 | Add a matching bucket lifecycle rule and review retention requirements before enabling deletion. | —; operator instruction |
| R41 | 9 | Open the demo or `?demo=1` on the landing page. | — |
| R42 | 10 | It immediately runs a realistic render event in browser memory. | F-2-2 |
| R43 | 13 | The banner identifies sample mode and offers Reset demo and Start for real. | F-2-6 |
| R44 | 9 | Demo keys, encrypted objects, and edits disappear on refresh. | F-1-19 |
| R45 | 11 | The demo makes no payload uploads and writes no browser storage. | F-1-19 |
| R46 | 6 | See `.factory/demo.md` for its isolation contract. | — |
| R47 | 10 | `npm run build:lib` writes ESM, CJS, and declarations to `dist/package`. | F-1-37 |
| R48 | 9 | `npm run build:site` writes the static site to `dist/site`. | F-1-37 |
| R49 | 6 | `npm run build` produces both artifacts. | F-1-37 |
| R50 | 9 | Run `npm run verify:browser -- http://127.0.0.1:4174` against a preview. | — |
| R51 | 10 | Run `npm run verify:pwa -- http://127.0.0.1:4174` for the offline shell. | — |
| R52 | 9 | Deploy `dist/site/` as Azure Static Web Apps static content. | — |
| R53 | 8 | `staticwebapp.config.json` sets browser security headers and cache rules. | F-1-38 |
| R54 | 9 | It rewrites unknown routes to the product 404 page. | F-1-5, F-1-38 |
| R55 | 8 | Run `npm run verify:deployment -- https://event-payload-spillway.sociobot.in` after deployment. | — |
| R56 | 9 | Use `npm pack` to prepare the library for publishing. | — |
| R57 | 7 | The factory owns publishing credentials and deployment. | —; responsibility statement |
| R58 | 6 | MIT © 2026 Param Factory contributors. | F-1-40 |

README total: **491 words / 58 sentences = 8.5 words per sentence**. Its headings—Event Payload Spillway, Install, Usage, S3-compatible storage, Reverse proxy and retrieval, Retention and safety, Demo, Development, Deploy, and License—make sense in context. There are no buttons in the README.

## Earlier-finding recheck

Every finding from `.factory/review-1.md` was checked against the live site and current code. “Fixed” below means independently observed, not copied from `.factory/polish-1.md`.

| Earlier ID | Current result |
| --- | --- |
| F-1-1 | Fixed: first viewport names the job, audience, and npm-library form. |
| F-1-2 | Fixed: one click opens a completed `/demo`. |
| F-1-3 | Fixed: banner, Reset demo, Start for real, and in-memory demo exist. |
| F-1-4 | Fixed narrowly: registry and tagged tests exist; incomplete claims are reopened under their original claim IDs. |
| F-1-5 | **BLOCKING: live unknown routes still return home/200.** |
| F-1-6 | **BLOCKING: Back still returns focus to `BODY`.** |
| F-1-12 | Fixed: database-row outcome is measurable and jargon was removed. |
| F-1-13 | Fixed: encryption/storage copy is split and covered at the registered level. |
| F-1-14 | Fixed: two-click/stub wording is gone; retrieval behavior is tested. |
| F-1-15 | **BLOCKING: package/dependency claims remain incomplete.** |
| F-1-16 | **BLOCKING: HMAC/IV sentence is not fully registered/tested.** |
| F-1-17 | **BLOCKING: compatibility test still uses a mock, not MinIO.** |
| F-1-18 | Fixed: warmed demo reload and restore pass offline. |
| F-1-19 | **BLOCKING: storage-isolation automation remains partial.** |
| F-1-20 | **BLOCKING: no-telemetry claim remains unlisted.** |
| F-1-21 | Fixed: exact allowlist behavior is registered and passes. |
| F-1-22 | Fixed: compensating cleanup is accurately worded and tested. |
| F-1-23 | **BLOCKING: named reference fields remain unregistered.** |
| F-1-24 | **BLOCKING: Node 20 compatibility remains untested.** |
| F-1-25 | **BLOCKING: byte totals are still not asserted.** |
| F-1-26 | Fixed: dry run and expired-only default are asserted. |
| F-1-27 | Fixed: held objects are excluded and policy wording is guidance. |
| F-1-28 | Fixed: untouched-byte verification order is tested. |
| F-1-29 | Fixed: completed demo result is visible after one click. |
| F-1-30 | Fixed: privacy/limits section and explicit scope exist. |
| F-1-31 | **BLOCKING: no packed-consumer README-example test exists.** |
| F-1-32 | **BLOCKING: audit-header claims remain incomplete.** |
| F-1-33 | **BLOCKING: post-decryption integrity path remains untested.** |
| F-1-34 | **BLOCKING: key non-storage claim remains untested.** |
| F-1-35 | **BLOCKING: only one of three redaction classes is tested.** |
| F-1-36 | **BLOCKING: serialized key version remains untested.** |
| F-1-37 | **BLOCKING: public artifact-output claims remain unregistered.** |
| F-1-38 | **BLOCKING: deployment claims are unregistered and 404 rewrite is false live.** |
| F-1-39 | Fixed in copy: deployment responsibility is not presented as a universal guarantee. |
| F-1-40 | **BLOCKING: free/MIT fact remains unregistered.** |
| F-1-41 | **BLOCKING: secondary-route social metadata is incomplete.** |
| F-1-42 | Fixed on normal desktop routes: legal pages use the shared shell. Mobile nav is a new F-2-4. |
| F-1-43 | **BLOCKING: exact small-target cases remain live.** |
| F-1-44 | Fixed: external links are visibly labelled. |
| F-1-45 | Fixed: privacy/limits section is present before the final CTA. |
| F-1-46 | Fixed: user copy consistently uses `signed reference`. |
| F-1-47 | Fixed: Demo and Payload playground are used for their documented concepts. |
| F-1-48 | Fixed: hero eyebrow names the audience. |
| F-1-49 | Fixed: playground heading names the result. |
| F-1-50 | Fixed: flow copy states direct actions. |
| F-1-51 | Fixed: configuration heading is specific. |
| F-1-52 | Fixed: retention headings are standalone actions. |
| F-1-53 | Fixed: final CTA names the database-row outcome. |
| F-1-54 | Fixed: invalid-pointer error gives a valid example. |
| F-1-55 | **BLOCKING: three code-panel buttons still say only `Copy`.** |
| F-1-56 | Fixed: opening encryption copy is split. |
| F-1-57 | Fixed: audience/scope copy is split. |
| F-1-58 | Fixed: retrieval-handler copy is split. |
| F-1-59 | Fixed: legal-hold guidance is split. |
| F-1-60 | Fixed: expiry/lifecycle guidance is split. |
| F-1-61 | Fixed: development instructions are short imperatives. |
| F-1-62 | Fixed: deployment-policy description is split. |
| F-1-63 | Fixed: publishing responsibility is a separate sentence. |
| F-1-64 | Fixed: README averages 8.5 words and no sentence exceeds 22 words. |
| F-1-65 | **BLOCKING: the three facts remain below the 390 px first viewport.** |

The older `.factory/verification.md` header/cache failures remain fixed live. `.factory/verification-2.md` and the prior handoff's claims of no remaining gaps are superseded by the reproducible failures above.

## What would make this perfect

Fix every blocking and minor finding, then rerun this review from a fresh phone and desktop context and a fresh clone. The acceptance state is: the exact shipped sample satisfies its registered bound and uses a valid matching media payload; unknown URLs deliver the designed 404 with status 404; route metadata is complete; Back restores focus; all targets and widths pass at 390 px; all header links remain available; every action names its result; and every public claim maps to a tagged test that exercises the exact promised scenario. At that point there should be no findings left.
