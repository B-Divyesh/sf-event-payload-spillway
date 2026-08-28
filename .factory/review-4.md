# Adversarial first-read review 4 — Event Payload Spillway

**Verdict: FAIL**

**Reviewed:** 2026-08-28 UTC  
**Live site:** <https://event-payload-spillway.sociobot.in>  
**Candidate:** `ff5425d769b2a6367666be7e2494d79128fac275`

The first screen, demo, registered claims, accessibility, routing, privacy behavior, and aggregate suite pass. Release is still blocked for two concrete reasons: the public install command returns npm `E404`, and the landing page says there are four required configuration options although the public type requires six. The latter reopens earlier finding F-1-51 under the history rule.

## Cold first screen, before scrolling

Fresh Chromium contexts opened `/` at 390×844 and 1440×900. No scrolling occurred before recording these answers.

| Question | 390 px | Desktop | Result |
| --- | --- | --- | --- |
| What does this do? | It is an npm library that moves oversized webhook fields out of database rows. | Same; the illustration also shows the large field moving to encrypted object storage. | Clear. |
| For whom? | Self-hosting webhook and automation developers whose events carry large base64, media, or JSON values. | Same. | Clear. |
| What should I click first? | `Try it with sample data`. | Same. | Clear. |

The exact first-screen copy was `Move oversized webhook fields out of your database`, `For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values. This is an npm library.`, `Try it with sample data`, and `Opens a seeded sample with the spill result already shown.` The mobile action note and the privacy, offline, and price facts ended at y=657 within the 844 px viewport. The desktop primary action was visible without scrolling.

## Findings

### Blocking

#### F-4-1 — The advertised npm install command cannot install the product

- **Exact quote/location:** live hero and install section: `Copy install command`; README Install: `npm install event-payload-spillway`.
- **Observed:** in a new temporary directory, `npm install event-payload-spillway` returned `npm error code E404` and `'event-payload-spillway@*' is not in this registry.` `npm view event-payload-spillway version --json` returned the same result.
- **Why this fails:** the site identifies the product as an npm library and presents this command as the real next step. A first-time developer can try the demo but cannot install the library. The `package-formats` claim only installs a locally built tarball, so the public availability implied by the CTA is unlisted and untested.
- **Concrete fix:** publish version `0.1.0` under the advertised npm name, then add an `npm-registry-install` claim that installs that exact released version in an empty temporary project and runs the README example. Until publication, replace every public install CTA with an honest source/tarball instruction and label the package unpublished.

#### F-1-51 — Reopened: the setup heading still gives a false required-option count

- **Earlier finding:** review 1 found that `Four decisions, one small surface.` did not explain the configuration section. Polish 1 replaced it with `Configure four required options` and later reports marked it fixed.
- **Exact quote/location:** landing install section: `Configure four required options`; next sentence: `Choose allowed fields, an inline limit, an object store, and a retention window.`
- **Code evidence:** `SpillwayConfig` requires six properties: `allowlist`, `maxInlineBytes`, `store`, `encryptionKey`, `signingKey`, and `expiresInMs`. The adjacent example contains all six.
- **Why this fails:** the rewrite names a precise but false count and omits the two required key-management inputs. A developer following the prose will receive a type or constructor failure after supplying the advertised four items. The statement is also absent from `.factory/claims.json`.
- **Concrete fix:** use the heading `Configure the required options` and the sentence `Choose allowed fields, an inline limit, storage, encryption and signing keys, and a retention window.` If a number is retained, register and test the required public configuration shape.

## Copy audit

Counting uses whitespace-delimited words. Hyphenated terms, API names, and version strings count as one. Code blocks are excluded. Dynamic landing success and error sentences are included.

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
| L14 | 13 | Choose allowed fields, an inline limit, an object store, and a retention window. | **F-1-51: omits two required key inputs.** |
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

Landing prose totals **295 words across 38 sentences: 7.8 words per sentence**. No sentence exceeds 22 words or uses a banned marketing adjective.

### Landing headings, actions, labels, and terse claims

| Copy | Words | Type | Result |
| --- | ---: | --- | --- |
| Move oversized webhook fields out of your database | 8 | `h1` | Clear job statement. |
| Try it with sample data | 5 | Primary action | Names the result. |
| Copy install command | 3 | Action | **F-4-1: copied command cannot install.** |
| Demo data stays in this tab | 6 | Fact | Clear and tested. |
| Works offline after first visit | 5 | Fact | Clear and tested. |
| Free and MIT licensed | 4 | Fact | Clear and tested. |
| Payload playground | 2 | Label | Clear for the developer audience. |
| See what stays in your database | 6 | Heading | Clear. |
| Show spill result | 3 | Action | Names the result. |
| Spill result | 2 | Label | Clear. |
| No spill decision yet | 4 | Empty-state heading | Clear. |
| Database reference | 2 | Heading | Clear. |
| Restore original | 2 | Action | Names the result. |
| Reset sample | 2 | Action | Names the result. |
| Replace only oversized allowed fields | 5 | Heading | Clear. |
| Choose exact fields | 3 | Heading | Clear. |
| Encrypt, then store | 3 | Heading | Clear. |
| Leave a signed reference | 4 | Heading | Clear. |
| Configure four required options | 4 | Heading | **F-1-51: false count.** |
| Typed ESM, CommonJS, and declarations | 5 | Fact | Concrete and tested. |
| No telemetry or runtime dependencies | 5 | Fact | Concrete and tested. |
| Node 20+ with Web Crypto and fetch | 7 | Requirement | Concrete. |
| Copy configuration | 2 | Action | Names the result. |
| Copy proxy example | 3 | Action | Names the result. |
| Control retention and deletion | 4 | Heading | Clear. |
| Review storage use | 3 | Heading | Clear. |
| Preview deletion | 2 | Heading | Clear. |
| Keep held objects | 3 | Heading | Clear. |
| What stays local and what this does not do | 9 | Heading | Clear. |
| Keep large values out of database rows | 7 | Heading | Clear. |
| Read the source | 3 | Action | Names the result. |

Terminology is otherwise consistent: `Demo` is the route, `Payload playground` is the form, `Spill result` is the output, `signed reference` is left in the event, `encrypted object` is stored, and `JSON Pointer` selects a field.

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
| R11 | 18 | Package tests install the tarball in a fresh project and run this example with ESM and Node 20. | — |
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

README prose totals **534 words across 61 sentences: 8.8 words per sentence**. No sentence exceeds 22 words, contains a banned marketing adjective, or introduces inconsistent terminology. The headings are meaningful in context. The README has no buttons. Its install code block is flagged under F-4-1.

## Demo and sandbox result

| Check | Result |
| --- | --- |
| One-click entry | Pass: the first-screen action opens `/demo`. `/?demo=1` also enters it directly. |
| Product already in use | Pass: the first demo viewport shows `Diverted`, 73 KB incoming, 1.2 KB in the database, 98% avoided, and the result message. |
| Realistic sample | Pass: `render.complete` contains an original, valid 180×180 PNG with matching name and MIME metadata. |
| Banner | Pass: `Demo — sample data, nothing is saved`, `Reset demo`, and `Leave demo` remain visible. |
| Reset | Pass: an edited marker was removed, pointer and limit returned to the seed, and the completed result reran. |
| Restore | Pass: `Restore original` reported one restored field and 73 KB recovered. |
| Real-data isolation | Pass: injected `real:sentinel` localStorage and sessionStorage values were unchanged; no demo keys were added. |
| Persistence | Pass: no cookies, IndexedDB databases, or OPFS entries appeared. CacheStorage contained only the versioned public site shell. |
| Network privacy | Pass: the exercised live flow made same-origin GET requests only; no request body contained the edited payload marker. |
| Offline | Pass: a service-worker-controlled `/demo` reload worked offline and restored the sample. |

## Registered claims

All exact `test` commands in `.factory/claims.json` ran from clean clone `/tmp/event-payload-spillway-review4.2upMDh`. `npm ci` passed and `npm run test:claims` reported `Verified 27 declared claims.`

| Claim | Result | Evidence |
| --- | --- | --- |
| `inline-reduction` | PASS | Exact seed measured 1,268 / 74,502 bytes = 1.70%. |
| `demo-media` | PASS | PNG signature, dimensions, filename, MIME, and size matched. |
| `crypto-format` | PASS | AES-256-GCM, unique 96-bit IVs, and independent HMAC-SHA-256 verified. |
| `allowlist` | PASS | Exact and escaped pointers spilled; an unlisted secret stayed inline. |
| `reference-integrity` | PASS | Tampered reference caused zero storage reads. |
| `post-decryption-integrity` | PASS | Modified plaintext failed digest verification after decryption. |
| `write-confirmation` | PASS | A later failed write removed the earlier written object. |
| `retention` | PASS | Prefix-scoped byte totals, dry run, expiry, and legal hold behavior matched. |
| `proxy-order` | PASS | Untouched bytes were verified first; rejected requests were not forwarded. |
| `audit-headers` | PASS | Count and digest were added without provider signature values. |
| `retrieval` | PASS | Signed URL restored the value and returned `Cache-Control: no-store`. |
| `reference-shape` | PASS | Every named reference field and optional retrieval URL serialized. |
| `preview-redaction` | PASS | Token, data URI, and long-base64 fixtures redacted; ordinary text remained. |
| `key-handling` | PASS | Raw key material was absent from storage records and captured logs. |
| `key-version` | PASS | Configured key version survived verification and restore. |
| `s3-compatibility` | PASS | Official ephemeral MinIO completed encrypted put/list/head/get/restore/delete. |
| `package-formats` | PASS | Local tarball worked through ESM, CommonJS, declarations, and zero dependencies. |
| `node20-runtime` | PASS | Packed README example ran under pinned Node 20. |
| `build-artifacts` | PASS | ESM, CJS, declarations, and static site artifacts existed. |
| `license-price` | PASS | Package/license/site showed MIT use with no demo paywall. |
| `demo-seed` | PASS | Completed seed opened and Reset demo restored it. |
| `demo-privacy` | PASS | Payload did not upload or persist in named browser stores. |
| `no-telemetry` | PASS | Browser and Node flows emitted no telemetry channels or logs. |
| `demo-route` | PASS | `?demo=1` entered the isolated completed demo. |
| `offline-demo` | PASS | Warmed demo reloaded and restored offline. |
| `site-routes` | PASS | Metadata, shared shell, and product 404 passed locally. |
| `deployment-policy` | PASS | Security/cache policy and real 404 behavior passed. |

The public-registry availability implied by `npm install event-payload-spillway` is an unlisted claim under F-4-1. The false four-option setup count is unlisted under reopened F-1-51. No other live landing or README claim is unlisted.

## Earlier-finding recheck

Every earlier review and polish report was read. The table records current live and code/test confirmation, not the prior report's assertion.

| Finding | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: the live first viewport names the database-row job, developer audience, and npm-library form. |
| F-1-2 | Fixed: one click opens a completed `/demo`. |
| F-1-3 | Fixed: live banner/reset/leave controls work; code creates fresh memory keys/store. |
| F-1-4 | Fixed for registered behavior: 27 registry commands pass. F-4-1 records the newly found unlisted availability claim. |
| F-1-5 | Fixed: `/demo` is 200 and a missing URL returns the designed HTTP 404. |
| F-1-6 | Fixed: clean tests and six live repetitions restore focus, announcements, and saved y=0/137 positions. |
| F-1-12 | Fixed: live copy uses measurable database-row wording and the seed ratio test passes. |
| F-1-13 | Fixed: encryption and MinIO-backed storage tests pass; live copy is factual. |
| F-1-14 | Fixed: signed-reference wording is consistent and retrieval passes. |
| F-1-15 | Fixed: packed ESM, CommonJS, declarations, and dependency assertions pass. |
| F-1-16 | Fixed: AES-256-GCM, IV, and HMAC assertions pass. |
| F-1-17 | Fixed: the adapter passes against official ephemeral MinIO. |
| F-1-18 | Fixed: the warmed live demo reloads and restores offline. |
| F-1-19 | Fixed: live interception and the exhaustive browser-store test pass. |
| F-1-20 | Fixed: browser and library telemetry instrumentation passes. |
| F-1-21 | Fixed: exact and escaped JSON Pointer tests pass. |
| F-1-22 | Fixed: copy describes compensating cleanup and the failed-write test passes. |
| F-1-23 | Fixed: live copy says redacted preview and every named field is asserted. |
| F-1-24 | Fixed: the packed example runs under pinned Node 20. |
| F-1-25 | Fixed: scoped encrypted and expired byte totals are asserted. |
| F-1-26 | Fixed: dry run and expired-only reclaim behavior are asserted. |
| F-1-27 | Fixed: held objects remain excluded and lifecycle text is guidance. |
| F-1-28 | Fixed: mandatory untouched-byte verification and non-forwarding pass. |
| F-1-29 | Fixed: the live demo opens on a completed, measured result. |
| F-1-30 | Fixed: the live landing page includes a privacy and limits section. |
| F-1-31 | Fixed: package tests install the tarball and run the README example. |
| F-1-32 | Fixed: proxy rejection paths and audit headers are asserted. |
| F-1-33 | Fixed: pre-read signature and post-decryption digest failures are asserted. |
| F-1-34 | Fixed: store/log inspection finds no host key material. |
| F-1-35 | Fixed: all three documented redaction classes are asserted. |
| F-1-36 | Fixed: key-version serialization, verification, and restore pass. |
| F-1-37 | Fixed: build artifact paths are registered and pass. |
| F-1-38 | Fixed: built and live security/cache/404 policy checks pass. |
| F-1-39 | Fixed: live privacy copy separates temporary demo behavior from operator responsibility. |
| F-1-40 | Fixed: MIT and no-paid-gate behavior is registered and visible. |
| F-1-41 | Fixed: every route has canonical, OG/Twitter, favicon, and touch metadata. |
| F-1-42 | Fixed: legal and recovery routes use the same live header/footer. |
| F-1-43 | Fixed: no visible live control is below 44×44 px at 390 px. |
| F-1-44 | Fixed: external repository and license links are visibly labeled and resolve. |
| F-1-45 | Fixed: privacy/limits appears before the final action. |
| F-1-46 | Fixed: user copy consistently says signed reference and Database reference. |
| F-1-47 | Fixed: Demo names the route and Payload playground names the form. |
| F-1-48 | Fixed: the live eyebrow names webhook and automation developers. |
| F-1-49 | Fixed: the playground heading names the database outcome. |
| F-1-50 | Fixed: the flow heading directly names replacement behavior. |
| F-1-51 | **BLOCKING: reopened. The replacement heading falsely says four required options while code requires six.** |
| F-1-52 | Fixed: all three retention headings make sense alone. |
| F-1-53 | Fixed: the final heading names the database-row outcome. |
| F-1-54 | Fixed: the JSON Pointer error provides `/result/attachment`. |
| F-1-55 | Fixed: all live buttons use verbs and name their result. |
| F-1-56 | Fixed: README opening concepts remain separate and short. |
| F-1-57 | Fixed: README audience and exclusions remain separate and short. |
| F-1-58 | Fixed: retrieval instructions remain separate and short. |
| F-1-59 | Fixed: legal-hold guidance remains separate and short. |
| F-1-60 | Fixed: expiry and lifecycle guidance remain separate and short. |
| F-1-61 | Fixed: development instructions are direct commands. |
| F-1-62 | Fixed: deployment/404 statements are short and true live. |
| F-1-63 | Fixed: package preparation and factory ownership are separate. |
| F-1-64 | Fixed: landing average is 7.8 words; README average is 8.8; no sentence exceeds 22 words. |
| F-1-65 | Fixed: mobile first screen includes the action note and all three required facts. |
| F-2-1 | Fixed: live and clean tests measure the exact seed at 1.70%, below 10%. |
| F-2-2 | Fixed: the shipped attachment has a valid PNG signature and matching metadata. |
| F-2-3 | Fixed: all five checked routes have no 390 px horizontal overflow. |
| F-2-4 | Fixed: all four header links remain visible on mobile. |
| F-2-5 | Fixed: the live 404 has the same four-link header and three-link footer. |
| F-2-6 | Fixed: the demo action says `Leave demo`. |
| F-2-7 | Fixed: the result label says `Spill result`. |
| F-2-8 | Fixed: the empty heading says `No spill decision yet`. |
| F-2-9 | Fixed: user-facing `JSON Pointer` capitalization is consistent. |
| F-3-1 | Fixed: demo DOM and keyboard order put result/restore before the editor. |
| F-3-2 | Fixed: README explains the fresh-project tarball test in plain words. |

## Site structure, accessibility, and crawl

| Check | Result |
| --- | --- |
| Titles | Pass: `/`, `/demo`, `/privacy/`, `/terms/`, and 404 use distinct plain titles of 29–44 characters. |
| Semantics | Pass: `lang=en`, one `h1`, one `main`, landmarks, ordered headings, labels, and image alternatives. |
| Metadata | Pass: every route has description, canonical, OG/Twitter data, SVG favicon, touch icon, and the product social image. |
| 404 | Pass: an unknown URL returns HTTP 404 with the product shell and recovery links. |
| Deep links/history | Pass: route and fragment deep links load; six live Back cycles restore focus, announcement, and exact saved scroll positions. |
| Keyboard | Pass: the demo sequence follows result → restore → editor and tabs operate with arrow keys. |
| Links | Pass: internal routes/fragments, repository, license, `robots.txt`, and `sitemap.xml` resolve. |
| Mobile | Pass: no horizontal overflow and no visible target below 44×44 px at 390 px. |
| Accessibility | Pass: zero axe WCAG A/AA/2.1 AA violations across five routes; no console errors. The worker URL verifier also passed. |
| Motion | Pass: reduced-motion CSS removes meaningful transition duration. |
| Payload | Pass: built first-load JavaScript is 6.48 kB gzip. |
| Identity | Pass: the dithered industrial safety-manual system, overflow cutaway, squared controls, and print palette are specific to this product and match `.factory/design.md`. |

## Quality-gate evidence

- Actual clean clone: `/tmp/event-payload-spillway-review4.2upMDh` at `ff5425d`.
- `npm ci`: pass, zero vulnerabilities.
- `npm run test:claims`: pass, 27/27 exact registry commands.
- `npm test`: pass, 37/37 tests; `dist/package` and `dist/site` produced.
- Live review: five routes, zero axe violations, zero console errors, no overflow, no small targets, six exact Back restorations.
- Live PWA: service-worker-controlled offline reload passed.
- Live deployment policy: configured security headers, immutable hashed assets, no-cache worker, and HTTP 404 passed.
- Public install: **fail**, npm `E404` in a fresh temporary directory.

## Missed leverage

No separate leverage finding. The brief calls for deterministic field selection, encryption, storage, retrieval, and retention; the library, proxy, S3/MinIO adapter, and playground cover that workflow. An AI step would add nondeterminism and payload exposure without helping the core job. Import/export and sync are not natural operations for middleware whose state belongs in the operator's object store.

## What would make this perfect

Publish the package under the advertised npm name and prove a registry install from an empty project. Correct the configuration section so it names all required inputs without a false count. Then rerun all 27 claim commands, the aggregate suite, the live demo/privacy/offline checks, the route crawl, and the copy audit; the review can pass only if those two findings are gone and no replacement claim is left unregistered.
