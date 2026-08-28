# Adversarial first-read review 5 — Event Payload Spillway

**Verdict: FAIL**  
**Reviewed:** 2026-08-28 UTC  
**Live site:** <https://event-payload-spillway.sociobot.in>  
**Candidate:** `97dcfd26d9ddc6b83033d7f6fc05c6fd1294611b`

The product is clear, usable, isolated, and technically well verified. It does not reach the required zero-finding state. The desktop first screen omits the three mandatory proof facts, and one public npm-registry availability statement is missing from the claim registry.

## Findings

### High

#### F-5-1 — The desktop first screen puts all three required facts below the fold

- **Exact location:** `/` at 1440×900, before scrolling.
- **Observed:** `Try it with sample data` is fully visible at y=835–883. `Opens a seeded sample with the spill result already shown.` is clipped at y=897–915. The list containing `Demo data stays in this tab`, `Works offline after first visit`, and `Free and MIT licensed` starts at y=949 and is not visible.
- **Why this matters:** the plain-words contract requires privacy, offline behavior, and price on the first screen. A desktop visitor sees the action but none of those decision-making facts.
- **Concrete fix:** reduce the desktop headline size/hero vertical spacing or move the proof list above the actions. Add a 1440×900 assertion that the action note and `.proof-list` are fully within the viewport.

### Minor

#### F-5-2 — The npm-registry availability statement is an unlisted claim

- **Exact quote/location:** landing install section: `Not yet published to npm.` README: `Version 0.1.0 is not yet published to the npm registry.`
- **Observed:** `npm view event-payload-spillway@0.1.0 version --json` currently returns npm `E404`, so the sentence is true today. No entry in `.factory/claims.json` names or tests this status.
- **Why this matters:** visitors rely on this statement to choose the longer source-install path. Registry status can change independently of the repository, so an untested negative availability claim can become stale.
- **Concrete fix:** add a `registry-availability` entry whose test expects `E404` for version 0.1.0, or replace the statement as part of publishing and add a clean registry-install claim.

## Cold first screen

Fresh Chromium contexts opened `/` at 390×844 and 1440×900. Service workers were blocked and no scrolling occurred before recording the page.

| Question | 390×844 | 1440×900 | Result |
| --- | --- | --- | --- |
| What does this do? | An npm library moves oversized webhook fields out of database rows. | Same; the illustration shows the selected field moving to encrypted storage. | Clear. |
| For whom? | Self-hosting webhook and automation developers handling large base64, media, or JSON values. | Same. | Clear. |
| What should I click first? | `Try it with sample data`. | `Try it with sample data`. | Clear. |

The exact copy supplying those answers is `Move oversized webhook fields out of your database`, `For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values. This is an npm library.`, and `Try it with sample data`. The action is fully visible at both widths. The mobile action note and all three facts end at y=657. The desktop proof facts fail F-5-1.

There is no blocking first-read finding: all three required questions are answerable from the first screen at both tested widths.

## Copy audit

Counting uses whitespace-delimited words. Hyphenated terms, API names, version strings, and URLs count as one. Code blocks are excluded. Dynamic landing messages are included.

### Landing-page sentences

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
| L14 | 15 | Choose allowed fields, an inline limit, storage, encryption and signing keys, and a retention window. | — |
| L15 | 5 | Not yet published to npm. | F-5-2 |
| L16 | 8 | Build its npm tarball from the source repository. | — |
| L17 | 9 | Count encrypted and expired bytes for the configured prefix. | — |
| L18 | 7 | Dry runs show expired candidates without deleting. | — |
| L19 | 8 | Reclaim excludes objects marked with a legal hold. | — |
| L20 | 3 | Verify signatures first. | — |
| L21 | 14 | The proxy requires a callback for untouched request bytes before it parses an event. | — |
| L22 | 6 | The Demo uses temporary browser memory. | — |
| L23 | 6 | It sends no payload or telemetry. | — |
| L24 | 11 | Spillway is not a queue, CDN, malware scanner, or legal-retention service. | — |
| L25 | 7 | You configure production storage, keys, and retention. | — |
| L26 | 7 | Encrypted overflow control for selected webhook fields. | — |
| L27 | 5 | This is not valid JSON. | — |
| L28 | 7 | Fix the highlighted payload and try again. | — |
| L29 | 11 | Enter a JSON Pointer that starts with /, such as /result/attachment. | — |
| L30 | 8 | Choose a byte limit of at least 128. | — |
| L31 | 9 | 1 oversized allowed field moved to an encrypted object. | — |
| L32 | 7 | Database row uses [inline] of [raw] bytes. | — |
| L33 | 6 | No allowed field crossed the limit. | — |
| L34 | 4 | The event stays inline. | — |
| L35 | 4 | The spill decision failed. | — |
| L36 | 5 | Check the configuration and retry. | — |
| L37 | 8 | Restored 1 field locally; recovered value is [size]. | — |
| L38 | 3 | Restore failed: [error]. | — |
| L39 | 2 | Restore failed. | — |
| L40 | 4 | Run the sample again. | — |

Landing prose totals 310 words across 40 sentences: 7.8 words per sentence. No sentence exceeds 22 words or contains a banned marketing adjective.

### README sentences

| ID | Words | Sentence | Flag |
| --- | ---: | --- | --- |
| R1 | 13 | Event Payload Spillway is an npm library for self-hosted webhook and automation systems. | — |
| R2 | 11 | It moves explicitly allowed oversized JSON fields out of database rows. | — |
| R3 | 10 | It encrypts each value before writing it to S3-compatible storage. | — |
| R4 | 12 | The event keeps a signed reference with a redacted preview and expiry. | — |
| R5 | 14 | It is for developers whose events sometimes contain base64, media, or large JSON values. | — |
| R6 | 12 | It is not a queue, CDN, monitoring service, scanner, or legal-retention system. | — |
| R7 | 10 | Version 0.1.0 is not yet published to the npm registry. | F-5-2 |
| R8 | 8 | Build its npm tarball from the source checkout. | — |
| R9 | 8 | The package ships ESM, CommonJS, and TypeScript declarations. | — |
| R10 | 7 | It has no runtime dependencies or telemetry. | — |
| R11 | 8 | Use Node 20+ with Web Crypto and fetch. | — |
| R12 | 8 | Only exact JSON Pointers in `allowlist` can spill. | — |
| R13 | 12 | Package tests build and install the source tarball in a fresh project. | — |
| R14 | 9 | They run this example with ESM and Node 20. | — |
| R15 | 11 | They also compile the public declarations and load the CommonJS entry. | — |
| R16 | 5 | Create the bucket before use. | — |
| R17 | 11 | Allow GetObject, PutObject, DeleteObject, ListBucket, and HeadObject for the chosen prefix. | — |
| R18 | 5 | Objects are encrypted before upload. | — |
| R19 | 4 | Use TLS outside localhost. | — |
| R20 | 7 | `createSpillwayProxy` verifies untouched request bytes before parsing. | — |
| R21 | 5 | It requires a `verifyWebhook` callback. | — |
| R22 | 10 | The proxy does not forward rejected or partially transformed requests. | — |
| R23 | 9 | Successful requests include spill count and original digest headers. | — |
| R24 | 9 | Provider signature values are never copied into those headers. | — |
| R25 | 11 | If `publicBaseUrl` is set, each signed reference includes a retrieval URL. | — |
| R26 | 4 | Route it to `createRetrievalHandler`. | — |
| R27 | 9 | It verifies the reference and expiry before reading storage. | — |
| R28 | 8 | It decrypts the value and returns `Cache-Control: no-store`. | — |
| R29 | 5 | Treat retrieval URLs as secrets. | — |
| R30 | 8 | Add operator authentication before the handler in production. | — |
| R31 | 8 | `retentionReport()` counts objects, encrypted bytes, and expired bytes. | — |
| R32 | 6 | `reclaim()` uses expired-only candidates by default. | — |
| R33 | 5 | Use `dryRun: true` before deleting. | — |
| R34 | 8 | Pass `legalHold: true` when spilling a held value. | — |
| R35 | 10 | Reclaim excludes it until your storage policy removes the hold. | — |
| R36 | 8 | Values use AES-256-GCM with a random 96-bit IV. | — |
| R37 | 9 | References use HMAC-SHA-256 and are verified before storage reads. | — |
| R38 | 6 | Plaintext integrity is checked after decryption. | — |
| R39 | 13 | Keys come from the host and are never written to the spill store. | — |
| R40 | 9 | Previews redact likely tokens, data URIs, and long base64. | — |
| R41 | 5 | References include a key version. | — |
| R42 | 8 | Automated key rotation is not included in v0.1. | — |
| R43 | 6 | Expiry metadata does not guarantee deletion. | — |
| R44 | 13 | Add a matching bucket lifecycle rule and review retention requirements before enabling deletion. | — |
| R45 | 9 | Open the demo or `?demo=1` on the landing page. | — |
| R46 | 12 | It immediately runs a render event with a valid, original PNG attachment. | — |
| R47 | 13 | The shipped sample keeps its database row below 10% of the event size. | — |
| R48 | 12 | The banner identifies sample mode and offers Reset demo and Leave demo. | — |
| R49 | 9 | Demo keys, encrypted objects, and edits disappear on refresh. | — |
| R50 | 6 | The demo makes no payload uploads. | — |
| R51 | 8 | It writes no payload data to browser storage. | — |
| R52 | 6 | See `.factory/demo.md` for its isolation contract. | — |
| R53 | 10 | `npm run build:lib` writes ESM, CJS, and declarations to `dist/package`. | — |
| R54 | 9 | `npm run build:site` writes the static site to `dist/site`. | — |
| R55 | 6 | `npm run build` produces both artifacts. | — |
| R56 | 9 | Run `npm run verify:browser -- http://127.0.0.1:4174` against a preview. | — |
| R57 | 10 | Run `npm run verify:pwa -- http://127.0.0.1:4174` for the offline shell. | — |
| R58 | 9 | Deploy `dist/site/` as Azure Static Web Apps static content. | — |
| R59 | 8 | `staticwebapp.config.json` sets browser security headers and cache rules. | — |
| R60 | 12 | It sends unknown routes to the product 404 page with HTTP 404. | — |
| R61 | 8 | Run `npm run verify:deployment -- https://event-payload-spillway.sociobot.in` after deployment. | — |
| R62 | 9 | Use `npm pack` to prepare the library for publishing. | — |
| R63 | 7 | The factory owns publishing credentials and deployment. | — |
| R64 | 6 | MIT © 2026 Param Factory contributors. | — |

README prose totals 555 words across 64 sentences: 8.7 words per sentence. No sentence exceeds 22 words or contains a banned marketing adjective.

### Headings, actions, and terminology

All headings make sense in context. All controls name their result: `Try it with sample data`, `Install from source`, `Show spill result`, `Copy source install steps`, `Copy configuration`, `Copy proxy example`, `Restore original`, `Reset sample`, `Reset demo`, and `Leave demo`. Navigation labels are conventional destinations. User-facing terminology is consistent: `Demo` is the route; `Payload playground` is the interactive form; `Spill result` is its output; `signed reference` remains in the event; `encrypted object` is stored; and `JSON Pointer` selects a field.

## Demo and sandbox

| Check | Result |
| --- | --- |
| One-click path | Pass: the first-screen action opens `/demo`; `/?demo=1` also enters it directly. |
| First demo screen | Pass: before a second action, it shows `Diverted`, 73 KB incoming, 1.2 KB database, 98% avoided, the signed reference, and `Restore original`. |
| Sample | Pass: `render.complete` includes the original 180×180 PNG with matching filename and MIME. |
| Banner | Pass: `Demo — sample data, nothing is saved`, `Reset demo`, and `Leave demo` remain visible. |
| Reset | Pass: a unique edited marker was removed; payload, pointer, threshold, and completed result returned to the seed. |
| Restore | Pass: the UI reported one locally restored field and 73 KB recovered. |
| Real-data isolation | Pass: injected localStorage/sessionStorage sentinels remained unchanged. The clean claim test also checked cookies, IndexedDB, OPFS, and CacheStorage. |
| Network privacy | Pass: the live exercised flow made only same-origin GET requests; no request body contained the edited marker. |
| Offline | Pass: the service-worker-controlled demo reloaded and restored the sample while the browser context was offline. |

## Registered claims

All 28 exact `test` commands from `.factory/claims.json` passed in detached clean clone `/tmp/eps-review5-clean.7wfeDf` at `97dcfd2`.

| Claim ID | Result | Verified outcome |
| --- | --- | --- |
| `inline-reduction` | PASS | Exact sample measured 1,268 / 74,502 bytes, or 1.70%. |
| `demo-media` | PASS | PNG signature, dimensions, filename, MIME, and size matched. |
| `crypto-format` | PASS | AES-256-GCM, unique 96-bit IVs, and independent HMAC-SHA-256 matched. |
| `allowlist` | PASS | Exact and escaped pointers spilled; an unlisted secret stayed inline. |
| `reference-integrity` | PASS | A tampered reference caused zero storage reads. |
| `post-decryption-integrity` | PASS | Modified plaintext failed its digest after decryption. |
| `write-confirmation` | PASS | Failure on a later write removed the earlier object. |
| `retention` | PASS | Scoped byte totals, dry runs, expiry, and legal holds matched. |
| `proxy-order` | PASS | Untouched bytes were verified first; rejected inputs were not forwarded. |
| `audit-headers` | PASS | Count and digest headers excluded provider signature values. |
| `retrieval` | PASS | A signed URL restored the value with `Cache-Control: no-store`. |
| `reference-shape` | PASS | Every named field and the optional retrieval URL serialized. |
| `preview-redaction` | PASS | Token, data URI, and long-base64 cases redacted; ordinary text remained. |
| `key-handling` | PASS | Raw host key material was absent from store records and logs. |
| `key-version` | PASS | The configured key version survived verification and restore. |
| `s3-compatibility` | PASS | Official MinIO completed encrypted put/list/head/get/restore/delete. |
| `package-formats` | PASS | The source tarball worked through ESM, CommonJS, declarations, and zero dependencies. |
| `required-config` | PASS | Landing copy matched all six required `SpillwayConfig` fields. |
| `node20-runtime` | PASS | The packed README example ran under Node 20. |
| `build-artifacts` | PASS | ESM, CJS, declarations, and static site were emitted. |
| `license-price` | PASS | MIT licensing and no browser-demo paid gate matched. |
| `demo-seed` | PASS | The completed seed opened and Reset demo restored it. |
| `demo-privacy` | PASS | No payload upload or persistence occurred in named browser stores. |
| `no-telemetry` | PASS | Browser and Node flows emitted no telemetry channels or logs. |
| `demo-route` | PASS | `?demo=1` entered the isolated completed demo. |
| `offline-demo` | PASS | The warmed demo reloaded and restored offline. |
| `site-routes` | PASS | Metadata, shared shell, and product 404 passed locally. |
| `deployment-policy` | PASS | Built security/cache rules and actual 404 behavior passed. |

No registered claim is untested or failing. F-5-2 is the only public landing/README claim without a registry entry.

## Earlier-finding recheck

Every earlier review, polish report, and handoff was read. Each `Fixed` result below was confirmed against both current source/tests and the deployed page where applicable.

### Review 1

| ID | Round 5 confirmation |
| --- | --- |
| F-1-1 | Fixed: live first screen names the job, audience, and npm-library form. |
| F-1-2 | Fixed: one click opens an already-completed demo. |
| F-1-3 | Fixed: demo route, persistent banner, complete reset, leave action, and memory-only store exist. |
| F-1-4 | Fixed for registered claims: 28 unique entries each have one tag and all exact commands pass; F-5-2 records a newly identified unlisted status claim. |
| F-1-5 | Fixed: `/demo` returns 200 and an unknown live URL returns the styled product page with HTTP 404. |
| F-1-6 | Fixed: six live cycles and the clean aggregate test restore exact scroll, `#try-demo` focus, and announcement. |
| F-1-12 | Fixed: measurable database-row wording and sample byte evidence replace incident/hot-path copy. |
| F-1-13 | Fixed: encryption and S3-compatible storage claims pass separate tests. |
| F-1-14 | Fixed: signed-reference wording is consistent and retrieval is tested. |
| F-1-15 | Fixed: packed ESM, CommonJS, declarations, and zero dependencies pass. |
| F-1-16 | Fixed: AES-256-GCM, unique IV, and HMAC-SHA-256 assertions pass. |
| F-1-17 | Fixed: the adapter passes against official MinIO. |
| F-1-18 | Fixed: the live warmed demo reloads and restores offline. |
| F-1-19 | Fixed: live sentinels/network and exhaustive browser-store tests pass. |
| F-1-20 | Fixed: browser and Node telemetry instrumentation passes. |
| F-1-21 | Fixed: exact and escaped JSON Pointer tests pass. |
| F-1-22 | Fixed: compensating cleanup wording and later-write failure behavior match. |
| F-1-23 | Fixed: redacted-preview wording and every named reference field are tested. |
| F-1-24 | Fixed: the packed example runs on Node 20. |
| F-1-25 | Fixed: scoped encrypted and expired byte totals are asserted. |
| F-1-26 | Fixed: dry run and expired-only behavior are asserted. |
| F-1-27 | Fixed: held objects remain excluded and lifecycle text is guidance. |
| F-1-28 | Fixed: mandatory untouched-byte verification and failure non-forwarding pass. |
| F-1-29 | Fixed: the live demo opens on a completed measured encrypted result. |
| F-1-30 | Fixed: the landing page includes privacy and product limits. |
| F-1-31 | Fixed: package tests install the tarball and run the README example. |
| F-1-32 | Fixed: rejection paths and both audit headers are asserted. |
| F-1-33 | Fixed: pre-read signature and post-decryption digest rejection are asserted. |
| F-1-34 | Fixed: store/log inspection finds no raw host key material. |
| F-1-35 | Fixed: all three redaction classes plus ordinary text are asserted. |
| F-1-36 | Fixed: key version survives serialization, verification, and restore. |
| F-1-37 | Fixed: documented build artifacts are registered and emitted. |
| F-1-38 | Fixed: built and live security/cache/404 policy checks pass. |
| F-1-39 | Fixed: privacy copy separates demo behavior from operator responsibility. |
| F-1-40 | Fixed: MIT/no-paid-gate behavior is registered and passes. |
| F-1-41 | Fixed: all routes have full canonical, OG/Twitter, favicon, and touch metadata. |
| F-1-42 | Fixed: legal and recovery routes use the shared header/footer. |
| F-1-43 | Fixed: no visible control is below 44×44 px at 390 px. |
| F-1-44 | Fixed: external links are visibly labelled and resolve. |
| F-1-45 | Fixed: privacy/limits precedes the final action. |
| F-1-46 | Fixed: user copy consistently uses signed reference. |
| F-1-47 | Fixed: Demo and Payload playground retain distinct meanings. |
| F-1-48 | Fixed: the eyebrow names webhook and automation developers. |
| F-1-49 | Fixed: the playground heading names the database outcome. |
| F-1-50 | Fixed: flow copy directly describes replacement. |
| F-1-51 | Fixed: copy names all six required options and the declaration-drift test passes. |
| F-1-52 | Fixed: retention headings make sense independently. |
| F-1-53 | Fixed: the final heading names the database-row outcome. |
| F-1-54 | Fixed: the pointer error gives `/result/attachment`. |
| F-1-55 | Fixed: all controls use result-naming labels. |
| F-1-56 | Fixed: README opening concepts are split. |
| F-1-57 | Fixed: README audience and exclusions are split. |
| F-1-58 | Fixed: retrieval instructions are split. |
| F-1-59 | Fixed: legal-hold guidance is split. |
| F-1-60 | Fixed: expiry and lifecycle guidance are split. |
| F-1-61 | Fixed: development instructions are direct commands. |
| F-1-62 | Fixed: deployment statements are short and true live. |
| F-1-63 | Fixed: packaging and factory ownership are separate. |
| F-1-64 | Fixed: landing averages 7.8 words and README 8.7; no sentence exceeds 22 words. |
| F-1-65 | Partly regressed as F-5-1: all three facts fit at 390×844, but none fits at 1440×900. |

### Reviews 2–4

| ID | Round 5 confirmation |
| --- | --- |
| F-2-1 | Fixed: exact shipped seed is 1.70%, below 10%. |
| F-2-2 | Fixed: sample is a valid original PNG with matching metadata. |
| F-2-3 | Fixed: all five live routes match the 390 px viewport width. |
| F-2-4 | Fixed: all four primary links are visible at 390 px. |
| F-2-5 | Fixed: live 404 uses the shared shell. |
| F-2-6 | Fixed: banner action says `Leave demo`. |
| F-2-7 | Fixed: result label says `Spill result`. |
| F-2-8 | Fixed: empty heading says `No spill decision yet`. |
| F-2-9 | Fixed: `JSON Pointer` capitalization is consistent. |
| F-3-1 | Fixed: live and clean tests confirm result → restore → editor keyboard order. |
| F-3-2 | Fixed: README describes the fresh-project tarball test in plain words. |
| F-4-1 | Fixed: no unavailable registry install command remains; the exact source workflow succeeds from a new temporary project. |

Review 3's reopened F-1-6 and review 4's reopened F-1-51 are explicitly covered in the review-1 table.

## Site structure, accessibility, and crawl

| Check | Result |
| --- | --- |
| Titles | Pass: `/`, `/demo`, `/privacy/`, `/terms/`, and 404 use distinct plain titles under 60 characters. |
| Semantics | Pass: each route has `lang=en`, one `h1`, one `main`, landmarks, ordered headings, labels, and alternatives. |
| Metadata | Pass: each route has a description, canonical, complete OG/Twitter fields, SVG favicon, and 180×180 touch icon. The social image is 1200×630. |
| 404 | Pass: an unknown URL returns HTTP 404 with the product shell and recovery actions. |
| Deep links/history | Pass: route and fragment deep links load; Back restores saved y=0 and y=137 positions, focus, and a polite announcement. |
| Keyboard | Pass: the demo order follows result → restore → editor; tabs support arrow keys. |
| Links | Pass: every discovered internal route/fragment and both external GitHub links resolve. |
| Mobile | Pass: no 390 px overflow and no visible target below 44×44 px across five routes. |
| Accessibility | Pass: integrated axe reports zero WCAG A/AA/2.1 AA violations on five routes; the worker URL verifier reports no structural or console failures. |
| Motion | Pass: the reduced-motion rule collapses transition durations and scripted scrolling selects instant behavior. |
| Security/privacy | Pass: self-only CSP and configured headers are live; no third-party scripts/fonts or demo payload requests were observed. |
| Payload | Pass: first-load application JavaScript is 6.48 kB gzip. |
| Identity | Pass: the halftone industrial-manual art, paper/ink/reservoir palette, narrow display type, ledger typography, and mechanical controls match `.factory/design.md` and are not a generic SaaS template. |

## Quality gates and installation

- Clean clone `npm ci`: pass; zero vulnerabilities.
- All 28 exact claim commands: pass.
- Clean clone `npm test`: pass, 39/39; build produced `dist/package` and `dist/site`.
- `npm run check`: pass.
- `npm audit --audit-level=moderate`: pass, zero vulnerabilities.
- `npm pack --dry-run --json`: pass; 14,655-byte tarball.
- Exact public GitHub source-install workflow: pass in a new temporary project; spill and restore both returned 1. The cloned GitHub HEAD matched `97dcfd2`.
- Live `/`, `/demo`, `/privacy/`, `/terms/`, and `/404.html` bodies match the locally built files byte for byte by SHA-256.
- Live browser review, offline check, deployment-policy check, worker URL verification, and link crawl: pass except F-5-1.

## Missed leverage

No additional feature is justified. The brief's expected library, proxy, S3/MinIO, signed retrieval, retention report, dry-run reclaim, and legal-hold paths are present. AI would add nondeterminism, cost, and payload exposure to a deterministic security/storage job. Import, export, or sync would duplicate the host application's object-store responsibilities.

## What would make this perfect

Keep the three proof facts fully visible at 1440×900 and register the npm-registry availability statement. Then rerun the desktop fold assertion, all 28 existing claim commands plus the new registry claim, and the complete live/clean verification suite. The acceptance state is zero findings and no unlisted claim.
