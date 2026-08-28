# Adversarial first-read review 6 — Event Payload Spillway

**Verdict: PASS**  
**Reviewed:** 2026-08-28 UTC  
**Live site:** <https://event-payload-spillway.sociobot.in>  
**Repository base reviewed:** `5e749e60e1c7fa40844d9d9e1a1de6473264c849`

There are no findings (`F-6-k`) at any severity. This is a full re-review, not a diff-only check.

## Cold first screen

Fresh, empty Chromium contexts loaded `/` without scrolling at 390×844 and 1440×900.

| Question | Answer from the first screen | Evidence |
| --- | --- | --- |
| What does this do? | It is an npm library that moves oversized webhook fields out of database rows into encrypted storage. | H1: “Move oversized webhook fields out of your database”; “This is an npm library.” |
| For whom? | Self-hosting developers whose webhook or automation events sometimes contain large base64, media, or JSON values. | The 16-word lead names both audience and situation. |
| What should I click first? | “Try it with sample data.” It opens a seeded sample with a completed spill result. | Primary result-naming control plus: “Opens a seeded sample with the spill result already shown.” |

All three facts, the action note, and the privacy/offline/price facts are visible before scrolling at both sizes. The 390px page width is exactly 390px; there is no horizontal overflow. The safety-manual/halftone illustration, warm paper palette, narrow technical display type, mechanical outlines, and reservoir diagram are visibly specific to this product rather than a generic SaaS shell.

## Copy audit

Audited public prose only: navigation, labels, headings, buttons, and fenced code are separately checked below; code samples are excluded from sentence counts. Counts use whitespace-delimited words. No landing or README prose sentence exceeds 22 words. No banned marketing adjective appears. The terminology is consistent: **Demo**, **Payload playground**, **signed reference**, **encrypted object**, **JSON Pointer**, and **source tarball**.

### Landing sentences

| Words | Sentence |
| ---: | --- |
| 5 | Offline: the demo still works. |
| 7 | Site files are cached on this device. |
| 16 | For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values. |
| 5 | This is an npm library. |
| 10 | Opens a seeded sample with the spill result already shown. |
| 16 | Technical cutaway showing a large coral JSON block diverted from a conveyor into a locked teal storage reservoir. |
| 9 | A selected large field moves to encrypted object storage. |
| 9 | Use the dedicated Demo for a seeded, isolated sample. |
| 8 | Change the attachment, JSON Pointer, or byte limit. |
| 9 | Show the sample event to create a signed reference. |
| 8 | Only configured JSON Pointers are considered. |
| 9 | An AES-256-GCM envelope is written through an S3-compatible adapter. |
| 10 | The reference records size, digest, field, redacted preview, and expiry. |
| 15 | Choose allowed fields, an inline limit, storage, encryption and signing keys, and a retention window. |
| 5 | Not yet published to npm. |
| 8 | Build its npm tarball from the source repository. |
| 9 | Count encrypted and expired bytes for the configured prefix. |
| 7 | Dry runs show expired candidates without deleting. |
| 8 | Reclaim excludes objects marked with a legal hold. |
| 3 | Verify signatures first. |
| 14 | The proxy requires a callback for untouched request bytes before it parses an event. |
| 6 | The Demo uses temporary browser memory. |
| 6 | It sends no payload or telemetry. |
| 11 | Spillway is not a queue, CDN, malware scanner, or legal-retention service. |
| 7 | You configure production storage, keys, and retention. |
| 7 | Encrypted overflow control for selected webhook fields. |
| 5 | This is not valid JSON. |
| 7 | Fix the highlighted payload and try again. |
| 11 | Enter a JSON Pointer that starts with /, such as /result/attachment. |
| 8 | Choose a byte limit of at least 128. |
| 9 | 1 oversized allowed field moved to an encrypted object. |
| 7 | Database row uses [inline] of [raw] bytes. |
| 6 | No allowed field crossed the limit. |
| 4 | The event stays inline. |
| 4 | The spill decision failed. |
| 5 | Check the configuration and retry. |
| 8 | Restored 1 field locally; recovered value is [size]. |
| 3 | Restore failed: [error]. |
| 2 | Restore failed. |
| 4 | Run the sample again. |

Non-sentence copy is also clear and context-safe. The H1 has eight words and is verb-first. Section headings name their subject; controls are result-naming verbs: “Try it with sample data,” “Install from source,” “Show spill result,” “Copy source install steps,” “Copy configuration,” “Copy proxy example,” “Restore original,” “Reset sample,” “Reset demo,” and “Leave demo.” The three fact fragments (“Demo data stays in this tab,” “Works offline after first visit,” and “Free and MIT licensed”) are short factual proof points, not decorative copy.

### README sentences

| Words | Sentence |
| ---: | --- |
| 13 | Event Payload Spillway is an npm library for self-hosted webhook and automation systems. |
| 11 | It moves explicitly allowed oversized JSON fields out of database rows. |
| 10 | It encrypts each value before writing it to S3-compatible storage. |
| 12 | The event keeps a signed reference with a redacted preview and expiry. |
| 14 | It is for developers whose events sometimes contain base64, media, or large JSON values. |
| 12 | It is not a queue, CDN, monitoring service, scanner, or legal-retention system. |
| 10 | Version 0.1.0 is not yet published to the npm registry. |
| 8 | Build its npm tarball from the source checkout. |
| 8 | The package ships ESM, CommonJS, and TypeScript declarations. |
| 7 | It has no runtime dependencies or telemetry. |
| 8 | Use Node 20+ with Web Crypto and fetch. |
| 8 | Only exact JSON Pointers in `allowlist` can spill. |
| 12 | Package tests build and install the source tarball in a fresh project. |
| 9 | They run this example with ESM and Node 20. |
| 11 | They also compile the public declarations and load the CommonJS entry. |
| 5 | Create the bucket before use. |
| 11 | Allow GetObject, PutObject, DeleteObject, ListBucket, and HeadObject for the chosen prefix. |
| 5 | Objects are encrypted before upload. |
| 4 | Use TLS outside localhost. |
| 7 | `createSpillwayProxy` verifies untouched request bytes before parsing. |
| 5 | It requires a `verifyWebhook` callback. |
| 10 | The proxy does not forward rejected or partially transformed requests. |
| 9 | Successful requests include spill count and original digest headers. |
| 9 | Provider signature values are never copied into those headers. |
| 11 | If `publicBaseUrl` is set, each signed reference includes a retrieval URL. |
| 4 | Route it to `createRetrievalHandler`. |
| 9 | It verifies the reference and expiry before reading storage. |
| 8 | It decrypts the value and returns `Cache-Control: no-store`. |
| 5 | Treat retrieval URLs as secrets. |
| 8 | Add operator authentication before the handler in production. |
| 8 | `retentionReport()` counts objects, encrypted bytes, and expired bytes. |
| 6 | `reclaim()` uses expired-only candidates by default. |
| 5 | Use `dryRun: true` before deleting. |
| 8 | Pass `legalHold: true` when spilling a held value. |
| 10 | Reclaim excludes it until your storage policy removes the hold. |
| 8 | Values use AES-256-GCM with a random 96-bit IV. |
| 9 | References use HMAC-SHA-256 and are verified before storage reads. |
| 6 | Plaintext integrity is checked after decryption. |
| 13 | Keys come from the host and are never written to the spill store. |
| 9 | Previews redact likely tokens, data URIs, and long base64. |
| 5 | References include a key version. |
| 8 | Automated key rotation is not included in v0.1. |
| 6 | Expiry metadata does not guarantee deletion. |
| 13 | Add a matching bucket lifecycle rule and review retention requirements before enabling deletion. |
| 9 | Open the demo or `?demo=1` on the landing page. |
| 12 | It immediately runs a render event with a valid, original PNG attachment. |
| 13 | The shipped sample keeps its database row below 10% of the event size. |
| 12 | The banner identifies sample mode and offers Reset demo and Leave demo. |
| 9 | Demo keys, encrypted objects, and edits disappear on refresh. |
| 6 | The demo makes no payload uploads. |
| 8 | It writes no payload data to browser storage. |
| 7 | See `.factory/demo.md` for its isolation contract. |
| 10 | `npm run build:lib` writes ESM, CJS, and declarations to `dist/package`. |
| 9 | `npm run build:site` writes the static site to `dist/site`. |
| 6 | `npm run build` produces both artifacts. |
| 9 | Run `npm run verify:browser -- http://127.0.0.1:4174` against a preview. |
| 10 | Run `npm run verify:pwa -- http://127.0.0.1:4174` for the offline shell. |
| 10 | Deploy `dist/site/` as Azure Static Web Apps static content. |
| 8 | `staticwebapp.config.json` sets browser security headers and cache rules. |
| 12 | It sends unknown routes to the product 404 page with HTTP 404. |
| 8 | Run `npm run verify:deployment -- https://event-payload-spillway.sociobot.in` after deployment. |
| 9 | Use `npm pack` to prepare the library for publishing. |
| 7 | The factory owns publishing credentials and deployment. |
| 5 | MIT © 2026 Param Factory contributors. |

The README headings are meaningful without their surrounding paragraphs. Its code samples and commands are intentionally terse developer instructions, not user-facing promises. No copy rewrite is needed.

## Demo and sandbox

From a fresh 390px browser context, clicking “Try it with sample data” opened `/demo` in one action. The first rendered product state already showed a realistic `render.complete` sample, a valid PNG attachment, `73 KB` incoming data, a `1.2 KB` database row, `98%` avoided, an encrypted signed reference, and a working “Restore original” action.

The persistent banner read exactly “Demo — sample data, nothing is saved,” with `Reset demo` and `Leave demo`. Reset recreated the seed and completed result. `?demo=1` redirected to the same isolated `/demo` state. A `real:sentinel` was pre-seeded in localStorage and sessionStorage; it remained unchanged before and after restore/reset. No demo payload appeared in localStorage, sessionStorage, cookies, IndexedDB, OPFS, or CacheStorage. The only cache was the versioned public shell cache. Request capture recorded only same-origin GET requests; no request carried payload data. No console or page errors occurred.

## Claims and clean-clone verification

`.factory/claims.json` declares 29 claims. Each has exactly one `@claim:<id>` test source, and the landing/README claim-like copy maps to an entry. No unlisted claim was found. Instructions and scope statements (for example, “Use TLS outside localhost” and “Automated key rotation is not included”) are not presented as untestable performance promises.

A fresh `git clone --no-local` was created at `/tmp/event-payload-spillway-review6.ATJDfJ`, then `npm ci` and every command registered in `.factory/claims.json` were run through `npm run test:claims`. This clean-clone run completed successfully: all 29 declared claim commands passed, including the real MinIO integration, packed-consumer ESM/CommonJS/declaration checks, Node 20 example, browser storage/request capture, offline reload, and live registry availability check.

Additional independent live checks passed:

```text
npm run verify:live-review -- https://event-payload-spillway.sociobot.in /tmp/event-payload-spillway-review6-live
# 390×844 + 1440×900, 5 routes, axe 0, console 0, overflow false,
# small targets 0, six Back restorations, correct keyboard order

npm run verify:deployment -- https://event-payload-spillway.sociobot.in
# CSP, nosniff, frame/referrer/permissions headers; immutable asset cache;
# no-cache service worker; unknown route HTTP 404

npm run verify:pwa -- https://event-payload-spillway.sociobot.in/demo
# controlling service worker, offline shell, zero console errors
```

## History recheck

Read every prior `review-*`, `polish-*`, verification report, and handoff. Every earlier finding was rechecked on the live deployment and relevant source/tests, rather than accepted from its “fixed” label:

- Review 1 (`F-1-1` through `F-1-65`): first-read clarity, one-click isolated demo, claim registry, signed-reference terminology, privacy/limits, all metadata, shared shell, target sizes, copy, configuration and route behavior all remain fixed.
- Review 2 (`F-2-1` through `F-2-9`): exact 1.70% seed result, valid PNG, mobile width/navigation, designed 404, truthful leave action, and vocabulary remain fixed.
- Review 3 (`F-3-1`, `F-3-2`, plus repeated `F-1-6`): result-before-editor keyboard order and fresh-project README wording remain fixed; six Back cycles restored position, focus, and route announcement.
- Review 4 (`F-4-1` and repeated `F-1-51`): installation honestly uses a source tarball while unpublished, and all six required configuration inputs are named and declaration-tested.
- Review 5 (`F-5-1`, `F-5-2`): both first-screen folds fit; the currently unavailability claim is registered and passed against the public registry.

## Structure, links, and accessibility

`/`, `/demo`, `/privacy/`, `/terms/`, and an unknown route were fetched live. Each expected route has one `h1`, one `main`, `lang="en"`, a route-specific title/description/canonical/OG/Twitter metadata, favicon and Apple touch icon, plus identical header/footer. The unknown route returns HTTP 404 with a designed product-specific recovery screen. Every discovered site link returned HTTP 200 or was an in-page fragment; both GitHub links returned HTTP 200. The skip link, visible focus treatment, 44px controls, deep links, browser Back restoration, route-focus movement, and polite announcements passed the browser review. Axe reported zero violations.

## Missed leverage and AI check

The brief implies two high-value capabilities beyond the basic spill: retrieval and retention. Both are present and demonstrated: the demo restores its reference, and the library documents/tests signed retrieval, retention reporting, dry-run reclaim, and legal holds. Import, sync, and an AI-assisted step are not implied by this self-hosted overflow-control library. There is no decorative AI feature or embedded provider key.

## What would make this perfect

No remaining product change is required. Continue to rerun the claim registry after any dependency, deployment, or npm-publication change. In particular, update the source-tarball copy and its `registry-availability` claim before publishing version 0.1.0, because its current E404 expectation should deliberately cease to be true at that point.
