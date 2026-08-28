# Adversarial first-read review 1 — Event Payload Spillway

**Verdict: FAIL**  
**Reviewed:** 2026-08-28 UTC  
**Live site:** https://event-payload-spillway.sociobot.in  
**Candidate:** `a1749da1e26b6524220fbc73e310498db2e31711`

The review has six release blockers: the first screen does not identify the user or clearly identify the product as a library; there is no one-click demo; there is no demo route or sandbox UI; the required claim registry and tagged claim tests do not exist; unknown routes return the host's generic 404; and fragment navigation breaks scroll/focus restoration. The ordinary test suite passes, but it cannot make an unregistered claim set auditable.

## Cold first screen, before scrolling

Fresh Chromium contexts were opened at 390×844 and 1440×1000 with no stored site data. No scrolling occurred before recording the visible copy.

| Question | 390 px answer | Desktop answer | Result |
| --- | --- | --- | --- |
| What does this do? | It appears to move selected large JSON fields to encrypted storage, but the screen does not say that this is an npm library or where it sits in a webhook system. | Same. The illustration explains diversion, but not the integration form. | **Blocking** |
| For whom? | Cannot answer. “your operators” is the only audience phrase. | Cannot answer. | **Blocking** |
| What should I click first? | “Test a payload” is visually primary and visible near the bottom of the first viewport. | “Test a payload” is visually primary. | Clear label, but the result is misleading: it only scrolls. |

Exact copy that failed: “Keep one oversized event from becoming a database incident.” and “Spill explicitly allowed fields into encrypted S3-compatible storage. Leave a signed, readable stub your operators can restore in two clicks.” Neither names self-hosting developers, webhook/automation systems, nor the npm-library delivery form.

## Findings

### Blocking

#### F-1-1 — The first screen does not say what the product is or who it is for

- **Location/quote:** landing hero; exact copy quoted above.
- **Why this fails:** a cold visitor can infer a mechanism, but cannot distinguish a library from a hosted proxy or operations service, and cannot identify the intended self-hosting developer audience.
- **Concrete fix:** use `Move oversized webhook fields out of your database` as the headline. Follow with `For self-hosting developers whose webhook or automation events sometimes carry large base64, media, or JSON values.`

#### F-1-2 — There is no one-click “Try it with sample data” path

- **Location/quote:** hero action “Test a payload.”
- **Observed:** clicking it changes the URL to `/#test-bench`, scrolls to a prefilled form, leaves the result at “Waiting,” and leaves “No decision yet” visible. A second click is required to see any product result.
- **Why this fails:** the first screen after the click does not show the product being used.
- **Concrete fix:** add a first-screen `Try it with sample data` action that opens `/demo`, immediately runs the realistic sample, and initially shows the diverted field, database stub, size reduction, and restore action.

#### F-1-3 — Demo mode and its safety controls do not exist

- **Locations:** `/demo`, landing test bench, README demo instructions, `.factory/demo.md`.
- **Observed:** `/demo` returns the generic Azure 404; there is no “Demo — sample data, nothing is saved” banner, `Reset demo`, `Start for real`, separate `demo:` namespace, or `.factory/demo.md`. “Reset ledger” clears only the result and retains edited payload, pointer, and threshold values.
- **Why this fails:** visitors cannot identify demo state, return it to a known seed, or distinguish it from real use. The current in-memory implementation happened not to touch the injected `real:sentinel` localStorage value, but isolation is not represented as a demo contract.
- **Concrete fix:** implement `/demo`, seed and run the sample on entry, show the persistent required banner/actions, reset all sample inputs and outputs, document the in-memory or `demo:` namespace in `.factory/demo.md`, and link the same URL from the hero and README.

#### F-1-4 — No claim is registered or backed by a tagged claim test

- **Location:** required `.factory/claims.json` and test files.
- **Observed:** `.factory/claims.json` is missing and `rg '@claim:'` returns no matches. Therefore there were zero declared tests to run. The clean checkout's untagged suite passed 12/12, but no page or README claim can be mapped to exactly one sandbox test.
- **Why this fails:** every claim listed in F-1-12 through F-1-40 is unlisted and formally untested.
- **Concrete fix:** add `.factory/claims.json`; give each retained claim one `@claim:<id>` test that starts from `/demo` or a clean package consumer; remove claims that cannot be observed.

#### F-1-5 — `/demo` and unknown routes use a generic host 404

- **Location:** `/demo` and `/definitely-missing-review-1`.
- **Observed:** both return HTTP 404 with title “Azure Static Web Apps - 404: Not found,” no product `h1`, no `main`, no navigation, and no way back.
- **Why this fails:** the required demo deep link is broken and the 404 has none of the product's identity or recovery path.
- **Concrete fix:** add the real `/demo` route and a designed product-specific 404 route that returns 404, uses the shared shell, and links home and to the demo.

#### F-1-6 — Fragment navigation does not restore scroll or move focus

- **Location:** hero “Test a payload” → `/#test-bench` → browser Back.
- **Observed:** after keyboard activation, focus became `BODY`; Back returned the URL to `/` but left `scrollY` at 1225 instead of the original 0. No route announcement occurred.
- **Why this fails:** keyboard and back-button users lose their place. The site-structure contract requires history restoration and focus on the destination heading.
- **Concrete fix:** use a real `/demo` route with History API state, preserve/restore scroll, focus its `h1`, and announce route changes through a polite live region.

### High — unlisted claims

Every sentence below is claim-like copy with no `.factory/claims.json` entry. Each finding remains open even where an untagged unit test happens to exercise part of the behavior.

| ID | Exact quote/location | Why it is unverified; concrete fix |
| --- | --- | --- |
| F-1-12 | Title: “stop oversized events at the edge”; hero: “Keep one oversized event from becoming a database incident.”; figure: “Oversized fields leave the hot path; the event keeps its shape.” | “Incident” and “hot path” are undefined outcomes. Replace with factual copy such as “Move oversized webhook fields out of database rows,” then test the sample's raw and inline byte counts. |
| F-1-13 | Meta: “Encrypt oversized webhook fields to S3-compatible storage before they fill your primary database.” Landing: “Spill explicitly allowed fields into encrypted S3-compatible storage.” README: “It keeps explicitly allowed oversized JSON fields out of a primary database: values are encrypted, written to S3-compatible storage, and replaced by a signed, readable reference with a safe preview and expiry.” and “Objects are encrypted before upload; use TLS outside localhost.” | Add a tagged real-MinIO test that proves ciphertext is written and plaintext is absent; split the README sentence. |
| F-1-14 | Hero: “Leave a signed, readable stub your operators can restore in two clicks.” Empty state: “The allowed oversized field will become a signed stub.” README: “If `publicBaseUrl` is set, each stub includes a self-contained signed retrieval URL.” and “Route that URL to the provided handler; it verifies the bearer reference, checks expiry, decrypts, and returns the original JSON value with `Cache-Control: no-store`.” | Add a tagged browser/handler test that counts the two actions, validates the signature and expiry, restores the original, and asserts `no-store`; otherwise remove “two clicks.” |
| F-1-15 | Landing: “Zero runtime dependencies,” “Typed ESM + CommonJS,” and “No telemetry or runtime dependencies.” README: “Event Payload Spillway is a small, zero-runtime-dependency TypeScript library for self-hosted webhook and automation systems.” and “The package ships ESM, CommonJS, and TypeScript declarations.” | Add a clean packed-consumer test for ESM, CommonJS, declarations, and an empty runtime dependency set. |
| F-1-16 | Landing: “AES-256-GCM” and “AES-GCM protects the value before an S3 or MinIO write.” README: “Values use AES-256-GCM with a random 96-bit IV; references use HMAC-SHA-256.” | Add a tagged envelope test for algorithm, key size, 96-bit random IVs, HMAC verification, and tamper rejection. |
| F-1-17 | Landing: “MinIO + S3” and “AES-GCM protects the value before an S3 or MinIO write.” | Add a tagged integration test against a fresh local MinIO service and a documented S3-compatible contract. A mocked SigV4 request alone does not establish compatibility. |
| F-1-18 | Offline banner: “Offline: the local demo still works.” and “Documentation is cached on this device.” | Add a tagged browser test that warms `/demo`, goes offline, reloads, runs spill and restore, and inspects the cache. The ad hoc check passed, but it is not registered. |
| F-1-19 | Landing: “Local test bench / no uploads” and “Keys and encrypted objects live only in memory and disappear on refresh.” README: “The live demo uses the in-memory adapter and local Web Crypto only; it makes no uploads and keeps no payload after refresh.” Privacy: “the documentation site does not collect, transmit, or retain your demo payload,” “The demo runs in your browser memory and is erased on refresh,” “The project does not receive a copy of your demo input,” “It does not use localStorage, IndexedDB, or remote object storage,” and “A service worker may cache public site files for offline use; it does not cache form input.” | Add one tagged privacy flow that intercepts all requests, seeds real-storage sentinels, exercises/reset/reloads the demo, enumerates storage and caches, and proves no payload leaves or persists. The ad hoc flow observed only same-origin GETs and no form storage. |
| F-1-20 | Landing: “No telemetry or runtime dependencies.” Privacy: “We do not use accounts, analytics, advertising pixels, cookies, or third-party scripts.” and “The npm library has no telemetry.” | Add tagged browser and clean-consumer interception tests; assert no telemetry dependency or outbound request. |
| F-1-21 | Landing: “Exact JSON pointers are checked. Unlisted fields—even large ones—never leave the event.” README: “Only JSON pointers in `allowlist` can ever leave the incoming object,” “This is intentionally explicit so an unexpected secret field cannot be spilled,” and “No field is spilled unless its exact RFC 6901 JSON pointer is allowed.” | Register the existing allowlist behavior under one claim test and include escaped-pointer and non-allowlisted-secret cases. |
| F-1-22 | Landing: “A failed write rolls the event back.” and “Spillway handles encryption, signatures, atomic writes, and safe previews.” README: “A spill succeeds only after object storage confirms the encrypted write.” | “Atomic writes” overstates compensating cleanup unless every cleanup failure is handled. Rename it to the exact guarantee and tag storage-failure tests, including a failed rollback delete. |
| F-1-23 | Landing: “The signed stub records size, digest, field, safe preview, expiry, and retrieval URL.” README refers to a “safe preview.” | Replace “safe” with the observable “redacted,” then test every named field and the redaction rules in a tagged test. |
| F-1-24 | Landing: “Standards-based Request, fetch, and Web Crypto.” README: “It requires a runtime with Web Crypto and `fetch` (Node 20+ or a modern edge/browser runtime).” | Add a compatibility-matrix claim with clean Node 20 and one stated browser/edge runtime test; avoid the unbounded phrase “modern.” |
| F-1-25 | Landing: “Count encrypted and expired bytes before changing anything. Reports inspect the configured storage prefix.” README: “`retentionReport()` reports object count, encrypted bytes, and expired bytes.” | Register a tagged report test that seeds held, expired, and active objects under multiple prefixes and asserts all counts/bytes. |
| F-1-26 | Landing: “Reclaim defaults to expired-only. Preview candidate count and size before deleting objects.” README: “`reclaim()` defaults to expired objects only and supports dry runs.” | Register a tagged dry-run/default test that proves no deletion during preview and only expired eligible objects on reclaim. |
| F-1-27 | Landing: “Objects marked with a legal hold are excluded. Bucket lifecycle policy remains your final backstop.” README: “Set `legalHold: true` when calling `spill(payload, { legalHold: true })`; held objects are excluded from reclaim until your own policy explicitly removes the hold in storage.” and “Expiry is application policy, not a guarantee: configure a matching bucket lifecycle rule as a backstop and review regulatory retention requirements before enabling deletion.” | Tag the hold exclusion behavior. Recast the provider lifecycle sentence as operator guidance, because the library cannot verify a user's bucket policy. |
| F-1-28 | Landing: “Verify the provider signature against untouched request bytes before Spillway parses or transforms the event. The proxy API makes that callback mandatory.” README: “`createSpillwayProxy` verifies the untouched request bytes before parsing and transforming them.” and “That ordering matters: an upstream webhook signature no longer describes the transformed body.” | Register the raw-byte ordering and mandatory-callback construction tests under a claim ID. |
| F-1-29 | Result: “1 oversized field was encrypted and moved out of the database row.” | Add a tagged `/demo` assertion for the encrypted object and measured inline result, not only this status string. |
| F-1-30 | Landing: “Overflow control, not another data platform.” README: “It is for developers who occasionally receive base64, media, or large JSON values and want an overflow control—not a queue, CDN, or observability platform,” “Spillway is not a durable queue, general-purpose blob CDN, database proxy, malware scanner, or legal-retention system,” and “Your event system remains responsible for delivery and retries.” Terms repeats the non-queue/backup/scanner/compliance scope. | These are important limits, but not executable product claims. Put them in a plain “What it does not do” landing section and register only observable boundary behavior; retain responsibility text as guidance. |
| F-1-31 | README: “The documented example above is covered by the test suite.” | Add `@claim:readme-example` to the exact compiled/packed README example test. |
| F-1-32 | README: “The proxy rejects invalid signatures, non-JSON bodies, malformed JSON, and storage failures without forwarding a partial transformation.” “Successful upstream requests receive `x-spillway-count` and `x-spillway-original-sha256` headers for audit correlation.” “Signature values are never duplicated into Spillway's audit headers.” | Register tagged tests that assert forwarding call count, each status, both header values, and absence of provider signature values. |
| F-1-33 | README: “References are verified before storage reads and encrypted plaintext is hash-checked after decryption.” | Add a tagged test with a spy store proving tampered references cause zero reads and corrupted decrypted data fails its digest check. |
| F-1-34 | README: “Keys are supplied by the host and never written to storage or logs.” | Add instrumented store/logger tests that search emitted metadata, bodies, errors, and console output for key material. |
| F-1-35 | README: “Preview text redacts likely tokens, data URIs, and long base64 rather than echoing them.” | Add table-driven tagged tests for all three named classes plus ordinary safe text. |
| F-1-36 | README: “Rotate keys with an application-level migration; v0.1 references identify their key version but automated rotation is not yet included.” | Tag serialization of the key version; keep the rotation sentence as explicit scope rather than implying a tested migration path. |
| F-1-37 | README: “`npm run build:lib` writes ESM, CJS, and declarations to `dist/package`.” “`npm run build:site` writes the static documentation site to `dist/site` (with `index.html` at that root).” “`npm run build` produces both.” | Add one tagged clean-build artifact test or remove these from the public claim registry scope if claims are explicitly limited to product behavior. |
| F-1-38 | README: “The emitted `staticwebapp.config.json` applies the browser response policy: a self-only CSP, frame and permissions restrictions, immutable caching for Vite's hashed `/assets/*` files, and `no-cache` for `/service-worker.js`.” “Do not replace it with a Netlify-style `_headers` file; Static Web Apps does not apply that format.” | Register the existing deployment-policy test and live-header check as a claim. |
| F-1-39 | Privacy: “The test bench generates temporary encryption keys and encrypted objects using Web Crypto in the current browser tab.” “When you deploy it, you control its object store, keys, retention, logs, and legal basis.” | Tag the local key/object path. Rewrite the deployment sentence as responsibility guidance, not a universal guarantee. |
| F-1-40 | Terms: “Event Payload Spillway is free, open-source software provided under the MIT License.” “The hosted site is documentation and a local demonstration.” Footer: “No paid plan.” | Add a simple license/package/site-mode claim test and expose the free price fact on the first screen. |

### Other structure and accessibility findings

#### F-1-41 — Canonical, social metadata, and apple-touch icon are missing

- **Location:** `/`, `/privacy/`, and `/terms/` heads.
- **Observed:** no canonical link, Open Graph fields, Twitter card, or apple-touch icon exists on any route. The root has a valid 58-character title, description, SVG favicon, `lang`, one `h1`, and one `main`.
- **Concrete fix:** add a route-specific canonical, OG/Twitter title and description, a real 1200×630 image derived from the spillway art, and a 180px apple-touch icon.

#### F-1-42 — Legal routes do not use the shared site shell

- **Location:** `/privacy/` and `/terms/`.
- **Observed:** both omit the skip link and primary navigation; their footer omits Privacy/Terms links, the product one-liner, “Built by Param Factory,” and build/version. Their header/footer differ from `/`.
- **Concrete fix:** render the same accessible header/footer on every route and keep each route's existing specific title and single `h1`.

#### F-1-43 — Visible touch targets are smaller than 44×44 px

- **Location:** root footer “Terms” is 42×44 px; legal-page header links are 26 px high; legal inline links are 19 px high. The focused skip link is 42 px high.
- **Concrete fix:** add padding/minimum block and inline sizes so every interactive target is at least 44×44 px without relying on neighboring whitespace.

#### F-1-44 — External links are not identified as external

- **Location:** header/footer GitHub links, “Read the source,” MIT License, and legal-page GitHub links.
- **Concrete fix:** append visible “(external)” text or an accessible external-link label/icon. Preserve the current successful 200 responses.

#### F-1-45 — The landing page omits the required privacy/limits section

- **Location:** landing section order.
- **Observed:** privacy and “what it does not do” appear only in the README/legal route. The landing jumps from operations to the final install CTA.
- **Concrete fix:** add a plain “What stays local and what Spillway does not do” section before the CTA, covering demo storage, telemetry, queue/CDN/scanner exclusions, and operator responsibilities.

### Copy findings

#### F-1-46 — “Stub” and “reference” name the same object

- **Locations:** landing uses “signed stub”; README first paragraph uses “signed, readable reference,” then later returns to “stub.”
- **Why this fails:** a new reader may infer two artifacts.
- **Concrete fix:** use `signed reference` everywhere; label the output `Database reference`.

#### F-1-47 — The try-out has three inconsistent names

- **Locations:** “Test bench,” “live demo,” and the library-class requirement “playground.”
- **Concrete fix:** use `Demo` for the route/banner/navigation and `Payload playground` for the interactive instrument only.

#### F-1-48 — “Overflow control for JSON events” is jargon and does not identify the audience

- **Concrete rewrite:** `For webhook and automation developers`.

#### F-1-49 — “Run a spill decision in your browser” describes implementation, not the result

- **Concrete rewrite:** `See what stays in your database`.

#### F-1-50 — “The event stays useful. The weight moves elsewhere.” is metaphorical out of context

- **Concrete rewrite:** `Replace only oversized allowed fields`.

#### F-1-51 — “Four decisions, one small surface.” does not explain the section

- **Concrete rewrite:** `Configure four required options`.

#### F-1-52 — Retention headings require surrounding copy to make sense

- **Locations:** “Operational contract,” “Expiry is visible. Deletion is deliberate,” “Report first,” “Dry-run reclaim,” and “Respect holds.”
- **Concrete rewrites:** `Control retention and deletion`; `Review expired objects before deleting them`; `Review storage use`; `Preview expired-object deletion`; `Keep held objects`.

#### F-1-53 — Final CTA copy returns to the “hot path” metaphor

- **Locations:** “Protect the hot path” and “Give oversized events somewhere safe to go.”
- **Concrete rewrite:** heading `Keep large values out of database rows`; supporting action `Copy install command`.

#### F-1-54 — The JSON Pointer error assumes unexplained RFC knowledge

- **Quote:** “The allowlist entry must be an RFC 6901 pointer beginning with /.”
- **Concrete rewrite:** `Enter a JSON Pointer that starts with /, such as /result/attachment.`

#### F-1-55 — Several buttons do not name the result

- **Locations:** “Test a payload” only scrolls; “Test this payload” does not name the output; three code-panel buttons say only “Copy”; “Reset ledger” does not restore the sample.
- **Concrete rewrites:** `Try it with sample data`; `Show spill result`; `Copy install command`, `Copy configuration`, `Copy proxy example`; `Reset demo`.

#### F-1-56 — README sentence R2 has 32 words

- **Quote:** “It keeps explicitly allowed oversized JSON fields out of a primary database: values are encrypted, written to S3-compatible storage, and replaced by a signed, readable reference with a safe preview and expiry.”
- **Rewrite:** `It moves explicitly allowed oversized JSON fields out of your primary database. It encrypts each value and leaves a signed reference with a redacted preview and expiry.`

#### F-1-57 — README sentence R3 has 25 words

- **Quote:** “It is for developers who occasionally receive base64, media, or large JSON values and want an overflow control—not a queue, CDN, or observability platform.”
- **Rewrite:** `It is for developers whose webhooks sometimes contain large base64, media, or JSON values. It is not a queue, CDN, or monitoring service.`

#### F-1-58 — README sentence R17 has 24 words

- **Quote:** “Route that URL to the provided handler; it verifies the bearer reference, checks expiry, decrypts, and returns the original JSON value with Cache-Control: no-store.”
- **Rewrite:** `Route that URL to the provided handler. It verifies the reference and expiry, decrypts the value, and returns it with Cache-Control: no-store.`

#### F-1-59 — README sentence R22 has 25 words

- **Quote:** “Set `legalHold: true` when calling `spill(payload, { legalHold: true })`; held objects are excluded from reclaim until your own policy explicitly removes the hold in storage.”
- **Rewrite:** `Pass legalHold: true when spilling a held value. Reclaim excludes it until your storage policy removes the hold.`

#### F-1-60 — README sentence R23 has 24 words

- **Quote:** “Expiry is application policy, not a guarantee: configure a matching bucket lifecycle rule as a backstop and review regulatory retention requirements before enabling deletion.”
- **Rewrite:** `Expiry metadata does not guarantee deletion. Add a matching bucket lifecycle rule and review your retention requirements before enabling deletion.`

#### F-1-61 — README sentence R32 has 33 words

- **Quote/location:** Development paragraph beginning “For the real-browser accessibility and interaction check...”
- **Rewrite:** `Start the preview. Install Chromium once with npx playwright install chromium. Run npm run verify:browser, optionally followed by a preview URL.`

#### F-1-62 — README sentence R39 has 26 words

- **Quote/location:** Deploy sentence beginning “The emitted staticwebapp.config.json applies...”
- **Rewrite:** `staticwebapp.config.json sets the browser security headers. It also caches hashed assets permanently and revalidates the service worker.`

#### F-1-63 — README sentence R42 has 24 words

- **Quote:** “The npm package is prepared with npm pack; publishing credentials and deployment are owned by the factory, so this repository does not publish automatically.”
- **Rewrite:** `npm pack prepares the package. The factory owns publishing credentials and deployment, so this repository does not publish automatically.`

#### F-1-64 — README prose averages more than 14 words per sentence

- **Observed:** 680 words across 45 sentences, average 15.1 using the counting method below.
- **Concrete fix:** apply F-1-56 through F-1-63 and split other multi-clause sentences until the measured average is at most 14.

#### F-1-65 — The three hero facts do not cover privacy, offline use, and price

- **Location:** “Zero runtime dependencies,” “AES-256-GCM,” “MinIO + S3.”
- **Concrete rewrite:** `Demo data stays in this tab`; `Works offline after the first visit`; `Free and MIT licensed`. Keep dependency, encryption, and storage support lower on the page once each is claim-tested.

## Copy audit

Method: a word is a whitespace-delimited lexical token; hyphenated terms, API names, and URLs count as one. Fenced code is excluded. All rendered landing sentences, including conditional/error/result sentences, are included. Headings and actions are audited separately because fragments are not sentences. No banned plain-words adjective appears verbatim.

### Landing sentences

| # | Words | Exact sentence | Flag |
| --- | ---: | --- | --- |
| L1 | 6 | Offline: the local demo still works. | F-1-18 |
| L2 | 6 | Documentation is cached on this device. | F-1-18 |
| L3 | 9 | Keep one oversized event from becoming a database incident. | F-1-1, F-1-12 |
| L4 | 8 | Spill explicitly allowed fields into encrypted S3-compatible storage. | F-1-13 |
| L5 | 12 | Leave a signed, readable stub your operators can restore in two clicks. | F-1-14, F-1-46 |
| L6 | 11 | Oversized fields leave the hot path; the event keeps its shape. | F-1-12 |
| L7 | 7 | Run a spill decision in your browser. | F-1-49 |
| L8 | 12 | Keys and encrypted objects live only in memory and disappear on refresh. | F-1-19 |
| L9 | 8 | Try changing the attachment, pointer, or byte limit. | — |
| L10 | 5 | This is not valid JSON. | — |
| L11 | 7 | Fix the highlighted payload and try again. | — |
| L12 | 11 | The allowlist entry must be an RFC 6901 pointer beginning with /. | F-1-54 |
| L13 | 8 | Choose a byte limit of at least 128. | — |
| L14 | 4 | The spill decision failed. | — |
| L15 | 5 | Check the configuration and retry. | — |
| L16 | 3 | No decision yet. | — |
| L17 | 4 | Run the sample event. | F-1-2, F-1-55 |
| L18 | 9 | The allowed oversized field will become a signed stub. | F-1-14, F-1-46 |
| L19 | 12 | 1 oversized field was encrypted and moved out of the database row. | F-1-29 |
| L20 | 6 | No allowed field crossed the limit. | — |
| L21 | 4 | The event stays inline. | — |
| L22 | 8 | Restored 1 field locally; recovered value is [size]. | F-1-14 |
| L23 | 3 | Restore failed: [error]. | — |
| L24 | 2 | Restore failed. | — |
| L25 | 3 | Retry the spill. | — |
| L26 | 4 | The event stays useful. | F-1-50 |
| L27 | 4 | The weight moves elsewhere. | F-1-50 |
| L28 | 5 | Exact JSON pointers are checked. | F-1-21 |
| L29 | 9 | Unlisted fields—even large ones—never leave the event. | F-1-21 |
| L30 | 10 | AES-GCM protects the value before an S3 or MinIO write. | F-1-16, F-1-17 |
| L31 | 7 | A failed write rolls the event back. | F-1-22 |
| L32 | 13 | The signed stub records size, digest, field, safe preview, expiry, and retrieval URL. | F-1-23, F-1-46 |
| L33 | 5 | Four decisions, one small surface. | F-1-51 |
| L34 | 10 | Choose the fields, inline limit, object store, and retention window. | — |
| L35 | 9 | Spillway handles encryption, signatures, atomic writes, and safe previews. | F-1-22, F-1-23 |
| L36 | 3 | Expiry is visible. | F-1-52 |
| L37 | 3 | Deletion is deliberate. | F-1-52 |
| L38 | 8 | Count encrypted and expired bytes before changing anything. | F-1-25 |
| L39 | 6 | Reports inspect the configured storage prefix. | F-1-25 |
| L40 | 4 | Reclaim defaults to expired-only. | F-1-26 |
| L41 | 8 | Preview candidate count and size before deleting objects. | F-1-26 |
| L42 | 8 | Objects marked with a legal hold are excluded. | F-1-27 |
| L43 | 7 | Bucket lifecycle policy remains your final backstop. | F-1-27 |
| L44 | 3 | Signature order matters. | — |
| L45 | 15 | Verify the provider signature against untouched request bytes before Spillway parses or transforms the event. | F-1-28 |
| L46 | 7 | The proxy API makes that callback mandatory. | F-1-28 |
| L47 | 7 | Give oversized events somewhere safe to go. | F-1-53 |
| L48 | 6 | Overflow control, not another data platform. | F-1-30 |

Landing total: 334 words / 48 sentences = **7.0 average**; no sentence exceeds 22 words.

### Landing headings, actions, and terse claims

| Copy | Words | Type | Flag |
| --- | ---: | --- | --- |
| Overflow control for JSON events | 5 | eyebrow | F-1-48 |
| Test a payload | 3 | primary link | F-1-2, F-1-55 |
| Copy npm install | 3 | button | F-1-55 |
| Zero runtime dependencies | 3 | fact | F-1-15, F-1-65 |
| AES-256-GCM | 1 | fact | F-1-16, F-1-65 |
| MinIO + S3 | 2 | fact | F-1-17, F-1-65 |
| Local test bench / no uploads | 5 | eyebrow | F-1-19, F-1-47 |
| Test this payload | 3 | button | F-1-55 |
| Database stub | 2 | heading | F-1-46 |
| Restore original | 2 | button | — |
| Reset ledger | 2 | button | F-1-3, F-1-55 |
| One narrow job | 3 | eyebrow | F-1-50 |
| Measure allowed fields | 3 | heading | — |
| Encrypt, then store | 3 | heading | — |
| Leave an audit trail | 4 | heading | — |
| Typed ESM + CommonJS | 3 | fact | F-1-15 |
| No telemetry or runtime dependencies | 5 | fact | F-1-15, F-1-20 |
| Standards-based Request, fetch, and Web Crypto | 6 | fact | F-1-24 |
| Copy | 1 | three code buttons | F-1-55 |
| Operational contract | 2 | eyebrow | F-1-52 |
| Report first | 2 | heading | F-1-52 |
| Dry-run reclaim | 2 | heading | F-1-52 |
| Respect holds | 2 | heading | F-1-52 |
| Protect the hot path | 4 | eyebrow | F-1-53 |
| Read the source | 3 | link | — |

### README sentences

| # | Words | Exact sentence | Flag |
| --- | ---: | --- | --- |
| R1 | 15 | Event Payload Spillway is a small, zero-runtime-dependency TypeScript library for self-hosted webhook and automation systems. | F-1-15 |
| R2 | 32 | It keeps explicitly allowed oversized JSON fields out of a primary database: values are encrypted, written to S3-compatible storage, and replaced by a signed, readable reference with a safe preview and expiry. | F-1-13, F-1-23, F-1-56 |
| R3 | 25 | It is for developers who occasionally receive base64, media, or large JSON values and want an overflow control—not a queue, CDN, or observability platform. | F-1-30, F-1-57 |
| R4 | 8 | The package ships ESM, CommonJS, and TypeScript declarations. | F-1-15 |
| R5 | 16 | It requires a runtime with Web Crypto and fetch (Node 20+ or a modern edge/browser runtime). | F-1-24 |
| R6 | 11 | Only JSON pointers in allowlist can ever leave the incoming object. | F-1-21 |
| R7 | 12 | This is intentionally explicit so an unexpected secret field cannot be spilled. | F-1-21 |
| R8 | 10 | The documented example above is covered by the test suite. | F-1-31 |
| R9 | 19 | Create the bucket first and give this identity GetObject, PutObject, DeleteObject, ListBucket, and HeadObject permission for the configured prefix. | — |
| R10 | 9 | Objects are encrypted before upload; use TLS outside localhost. | F-1-13 |
| R11 | 11 | createSpillwayProxy verifies the untouched request bytes before parsing and transforming them. | F-1-28 |
| R12 | 13 | That ordering matters: an upstream webhook signature no longer describes the transformed body. | F-1-28 |
| R13 | 17 | The proxy rejects invalid signatures, non-JSON bodies, malformed JSON, and storage failures without forwarding a partial transformation. | F-1-32 |
| R14 | 11 | Successful upstream requests receive x-spillway-count and x-spillway-original-sha256 headers for audit correlation. | F-1-32 |
| R15 | 9 | Signature values are never duplicated into Spillway's audit headers. | F-1-32 |
| R16 | 12 | If publicBaseUrl is set, each stub includes a self-contained signed retrieval URL. | F-1-14, F-1-46 |
| R17 | 24 | Route that URL to the provided handler; it verifies the bearer reference, checks expiry, decrypts, and returns the original JSON value with Cache-Control: no-store. | F-1-14, F-1-58 |
| R18 | 5 | Treat retrieval URLs as secrets. | — |
| R19 | 20 | Do not log their query strings, and add your own operator authentication in front of the handler for production use. | — |
| R20 | 9 | retentionReport() reports object count, encrypted bytes, and expired bytes. | F-1-25 |
| R21 | 10 | reclaim() defaults to expired objects only and supports dry runs. | F-1-26 |
| R22 | 25 | Set legalHold: true when calling spill(payload, { legalHold: true }); held objects are excluded from reclaim until your own policy explicitly removes the hold in storage. | F-1-27, F-1-59 |
| R23 | 24 | Expiry is application policy, not a guarantee: configure a matching bucket lifecycle rule as a backstop and review regulatory retention requirements before enabling deletion. | F-1-27, F-1-60 |
| R24 | 13 | No field is spilled unless its exact RFC 6901 JSON pointer is allowed. | F-1-21 |
| R25 | 11 | Values use AES-256-GCM with a random 96-bit IV; references use HMAC-SHA-256. | F-1-16 |
| R26 | 13 | References are verified before storage reads and encrypted plaintext is hash-checked after decryption. | F-1-33 |
| R27 | 13 | Keys are supplied by the host and never written to storage or logs. | F-1-34 |
| R28 | 14 | Preview text redacts likely tokens, data URIs, and long base64 rather than echoing them. | F-1-35 |
| R29 | 19 | Rotate keys with an application-level migration; v0.1 references identify their key version but automated rotation is not yet included. | F-1-36 |
| R30 | 8 | Do not put access keys in frontend code. | — |
| R31 | 22 | The live demo uses the in-memory adapter and local Web Crypto only; it makes no uploads and keeps no payload after refresh. | F-1-19, F-1-47 |
| R32 | 33 | For the real-browser accessibility and interaction check, start the preview, install Playwright Chromium once with npx playwright install chromium, then run npm run verify:browser (or pass another origin with npm run verify:browser -- http://127.0.0.1:4174). | F-1-61 |
| R33 | 21 | For the service-worker/offline shell smoke test, serve the production artifact over HTTPS (or trusted localhost) and run npm run verify:pwa -- http://localhost:4174. | — |
| R34 | 10 | npm run build:lib writes ESM, CJS, and declarations to dist/package. | F-1-37 |
| R35 | 15 | npm run build:site writes the static documentation site to dist/site (with index.html at that root). | F-1-37 |
| R36 | 5 | npm run build produces both. | F-1-37 |
| R37 | 11 | For the demo locally, run npm run dev and open http://localhost:4173. | F-1-47 |
| R38 | 10 | Deploy dist/site/ as Standard Azure Static Web Apps static content. | — |
| R39 | 26 | The emitted staticwebapp.config.json applies the browser response policy: a self-only CSP, frame and permissions restrictions, immutable caching for Vite's hashed /assets/* files, and no-cache for /service-worker.js. | F-1-38, F-1-62 |
| R40 | 17 | Do not replace it with a Netlify-style _headers file; Static Web Apps does not apply that format. | F-1-38 |
| R41 | 12 | After deployment, verify the live response policy with npm run verify:deployment -- https://event-payload-spillway.sociobot.in. | — |
| R42 | 24 | The npm package is prepared with npm pack; publishing credentials and deployment are owned by the factory, so this repository does not publish automatically. | F-1-63 |
| R43 | 16 | Spillway is not a durable queue, general-purpose blob CDN, database proxy, malware scanner, or legal-retention system. | F-1-30 |
| R44 | 11 | A spill succeeds only after object storage confirms the encrypted write. | F-1-22 |
| R45 | 9 | Your event system remains responsible for delivery and retries. | F-1-30 |

README total: 680 words / 45 sentences = **15.1 average**. Sentences R2, R3, R17, R22, R23, R32, R39, and R42 exceed the 22-word hard cap.

README headings are: “Event Payload Spillway” (3), “Install” (1), “Usage” (1), “S3 or MinIO” (3), “Reverse proxy” (2), “Retention and legal holds” (4), “Security model” (2), “Development” (1), “Deploy” (1), “Scope” (1), and “License” (1). All make sense in a README outline. The fenced commands and code samples are excluded from sentence scoring.

## Demo, sandbox, and privacy evidence

- Fresh 390px context before the run: no demo banner or demo link; localStorage contained only the injected `real:sentinel`; sessionStorage and IndexedDB were empty.
- Hero click: URL became `/#test-bench`; state remained `Waiting`; no result was shown.
- Manual `Test this payload`: state became `Diverted`; the UI reported one encrypted field and showed a reference. The run issued no POST/PUT request. All observed requests were same-origin GETs.
- `Reset ledger`: result returned to `Waiting` and focus moved to the payload, but edited payload text remained unchanged.
- Refresh: result disappeared; localStorage sentinel remained; sessionStorage and IndexedDB stayed empty.
- Warm offline reload: the offline banner appeared and spill → restore completed with no console errors.
- These checks support the underlying local behavior, but they do not cure F-1-2/F-1-3/F-1-4.

## Claim-test and build evidence

The repository was cloned with `--no-local` into a new temporary directory and detached at the candidate commit.

| Check | Result |
| --- | --- |
| `.factory/claims.json` | **Missing** |
| `rg '@claim:'` | **0 matches** |
| Declared claim commands | **0; no registry exists** |
| `npm ci` | Pass; 0 vulnerabilities |
| `npm test` | Pass; 12/12 |
| `npm run check` | Pass |
| `npm run build` | Pass; `dist/package` and `dist/site` produced |
| Built JS | 13.71 KB raw / 5.48 KB gzip |
| `npm run verify:deployment -- <live>` after build | Pass |
| `npm run verify:browser -- <live>` | Pass; axe 0 violations, 0 console errors, spill/restore passes at 390px |
| `npm run verify:pwa -- <live>` | Pass; controlled offline shell reload |
| `/opt/fleet/lib/verify-url.sh <live> <temp evidence>` | Pass; title/lang/main/alt/console checks |
| Additional axe run on `/`, `/privacy/`, `/terms/` at 390px and desktop | 0 WCAG 2 A/AA violations |

No declared claim test failed because no declared claim test exists. That absence is itself blocking.

## Site structure checks

| Check | Result |
| --- | --- |
| Root title pattern and length | Pass: “Event Payload Spillway — stop oversized events at the edge,” 58 characters; wording is flagged under F-1-12 |
| Privacy/terms titles | Pass: route-specific titles |
| `lang`, one `h1`, `main`, alt, console | Pass on product routes |
| Meta description | Present per product route |
| Canonical / OG / Twitter / apple-touch | **Fail: F-1-41** |
| Favicon | Pass: SVG |
| Designed 404 | **Blocking fail: F-1-5** |
| `/demo` deep link | **Blocking fail: F-1-3/F-1-5** |
| Back button / route focus | **Blocking fail: F-1-6** |
| Link crawl | Pass: every linked internal and GitHub URL returned 200 |
| External-link indication | Fail: F-1-44 |
| Shared header/footer | Fail on legal routes: F-1-42 |
| Privacy/Terms links | Present on root; missing from legal-route footer |
| `robots.txt` / `sitemap.xml` | Present; the required demo route is absent from both the product and sitemap |
| Visual identity | Pass: industrial safety-manual typography, warm paper, teal/coral halftone spillway art, and square mechanical controls are distinct from a generic SaaS template |
| 390px overflow | Pass: `scrollWidth === clientWidth === 390` |
| Reduced motion | Pass in code and prior/current browser checks |
| Touch targets | Fail: F-1-43 |

## Earlier-review and handoff history

No earlier `.factory/review-*.md` or `.factory/polish-*.md` file exists. I read both verification reports and the prior handoff.

| Earlier item | Live and code confirmation |
| --- | --- |
| `.factory/verification.md`: missing CSP and Permissions-Policy | Fixed. Live deployment policy check passed and emitted the configured self-only CSP and permissions denial. |
| `.factory/verification.md`: wrong cache rules | Fixed. Hashed assets return immutable one-year caching; the service worker returns `no-cache`. |
| `.factory/verification-2.md`: functional/mobile/a11y/offline/privacy passes | Reconfirmed within its narrower checks. Those checks did not enforce the attached one-click demo or claims-registry contracts. |
| Prior handoff known gap: bearer retrieval URLs need operator authentication | Still accurately documented in README; not represented as fixed. |
| Prior handoff known gap: no automated key rotation | Still accurately documented in README; not represented as fixed. |
| Prior handoff known gap: lifecycle policy remains operator responsibility | Still accurately documented in README; not represented as fixed. |

## What would make this perfect

Resolve every finding above, then rerun this review from a fresh browser and clean clone. The acceptance state is: a cold visitor can name the library, audience, and first action from the first screen; one click opens a visibly isolated, already-running `/demo`; every retained claim is mapped to one tagged sandbox test; navigation and 404 behavior use the product shell; all required metadata and touch targets pass; and the copy audit contains no flags, no sentence over 22 words, and an average at or below 14 words.
