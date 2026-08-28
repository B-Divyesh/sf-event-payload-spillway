# Polish 5 — cumulative finding closure

Repaired candidate `97dcfd26d9ddc6b83033d7f6fc05c6fd1294611b` from review commit `2d199e3e8a9954265573b4d0ba842c33558f35d2`.

Implementation commit: `9afe1ebe5d3166255d72cf85efa19b9d12c812f1`.

Deployed URL: <https://event-payload-spillway.sociobot.in>.

## Evidence key

- **C** — all 29 exact claim commands from the clean clone: `.factory/evidence/polish-5-clean/claims.txt`.
- **U** — clean-clone aggregate suite, 40/40: `.factory/evidence/polish-5-clean/suite.txt`.
- **L** — cold live two-viewport and five-route review: `.factory/evidence/polish-5-live/review.txt`.
- **D** — live deployment, offline, and worker URL checks: `.factory/evidence/polish-5-live/deployment-policy.txt`, `pwa.txt`, and `verify-url.txt`.
- **S** — public GitHub source-tarball installation: `.factory/evidence/polish-5-live/source-install.txt`.
- **Links** — live link crawl and exact build/live hashes: `.factory/evidence/polish-5-live/link-crawl-and-hashes.txt`.
- **H** — live Lighthouse report: `.factory/evidence/polish-5-live/lighthouse-summary.json`.
- **Screens** — `.factory/evidence/polish-5-live/live-home-1440x900.png`, `live-home-390.png`, `live-demo-390.png`, `demo-keyboard-390.png`, and `404-390.png`.

All live references below were checked cold after the round-5 deployment.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the verb-first database-row job, self-hosting developer audience, and npm-library form on the first screen. | `mobile and desktop first screens include the action note and all three facts` (U); live `/`; both home Screens. |
| F-1-2 | Kept the primary one-click action to an already-completed sample. | `@claim:demo-seed` (C); live `/demo`; demo Screen. |
| F-1-3 | Kept the isolated memory-only demo, persistent banner, full reset, and leave action. | `@claim:demo-seed`, `@claim:demo-privacy` (C); live `/demo`; L. |
| F-1-4 | Expanded the registry to 29 uniquely tagged observable claim tests. | `npm run test:claims` reports 29/29 (C). |
| F-1-5 | Kept the real demo route and shared-shell product 404 with HTTP 404. | `@claim:site-routes`, `@claim:deployment-policy` (C); D; 404 Screen. |
| F-1-6 | Kept deterministic saved-scroll/focus restoration and polite announcements. | `route navigation restores the exact saved position, focus, and announcement repeatedly` (U); six live restorations at y=0/137 (L). |
| F-1-12 | Kept measurable database-row wording and exact sample byte evidence. | `@claim:inline-reduction` (C); L records 1,268/74,502 bytes. |
| F-1-13 | Kept separate encryption and S3-compatible storage proof. | `@claim:crypto-format`, `@claim:s3-compatibility` (C). |
| F-1-14 | Kept consistent signed-reference wording and real retrieval. | `@claim:retrieval`, `@claim:reference-shape` (C); live `/demo`. |
| F-1-15 | Kept packed ESM, CommonJS, declarations, and zero-dependency proof. | `@claim:package-formats` (C); S. |
| F-1-16 | Kept AES-256-GCM, unique 96-bit IV, and HMAC-SHA-256 assertions. | `@claim:crypto-format` (C). |
| F-1-17 | Kept the official-MinIO integration. | `@claim:s3-compatibility` (C). |
| F-1-18 | Kept warmed offline demo reload and restore. | `@claim:offline-demo` (C); D. |
| F-1-19 | Kept browser-store sentinels, reset/reload, cache, and request-body isolation. | `@claim:demo-privacy` (C); L. |
| F-1-20 | Kept browser and Node telemetry instrumentation. | `@claim:no-telemetry` (C). |
| F-1-21 | Kept exact and escaped JSON Pointer coverage with an unlisted secret. | `@claim:allowlist` (C). |
| F-1-22 | Kept precise compensating-cleanup wording and later-write failure behavior. | `@claim:write-confirmation` (C). |
| F-1-23 | Kept redacted-preview wording and every named reference field. | `@claim:reference-shape`, `@claim:preview-redaction` (C). |
| F-1-24 | Kept the documented example verified on Node 20. | `@claim:node20-runtime` (C). |
| F-1-25 | Kept prefix-scoped encrypted and expired byte totals. | `@claim:retention` (C). |
| F-1-26 | Kept expired-only reclaim and non-destructive dry runs. | `@claim:retention` (C). |
| F-1-27 | Kept legal-hold exclusion and operator lifecycle guidance. | `@claim:retention` (C); README. |
| F-1-28 | Kept mandatory untouched-byte verification and failure non-forwarding. | `@claim:proxy-order` (C). |
| F-1-29 | Kept the completed demo result, encrypted object, and measured row size. | `@claim:demo-seed`, `@claim:inline-reduction` (C); demo Screen. |
| F-1-30 | Kept explicit privacy and product limits before the final action. | `all routes pass axe, semantic, keyboard-focus, and console checks` (U); live `/`. |
| F-1-31 | Kept the README example in a fresh tarball consumer. | `@claim:package-formats`, `@claim:node20-runtime` (C); S. |
| F-1-32 | Kept proxy rejection paths and both audit headers. | `@claim:proxy-order`, `@claim:audit-headers` (C). |
| F-1-33 | Kept pre-read signature and post-decryption digest rejection. | `@claim:reference-integrity`, `@claim:post-decryption-integrity` (C). |
| F-1-34 | Kept raw-key exclusion from storage and logs. | `@claim:key-handling` (C). |
| F-1-35 | Kept token, data-URI, long-base64, and ordinary-text fixtures. | `@claim:preview-redaction` (C). |
| F-1-36 | Kept key-version serialization, verification, and restore. | `@claim:key-version` (C). |
| F-1-37 | Kept ESM, CJS, declarations, and static-site build outputs. | `@claim:build-artifacts` (C); U. |
| F-1-38 | Kept security/cache policy and deployed HTTP 404 checks. | `@claim:deployment-policy` (C); D. |
| F-1-39 | Kept temporary demo behavior separate from operator responsibility. | `@claim:demo-privacy` (C); live `/privacy/`. |
| F-1-40 | Kept MIT/no-paid-gate behavior. | `@claim:license-price` (C); live `/terms/`. |
| F-1-41 | Kept route-specific canonical, Open Graph, Twitter, favicon, and touch metadata. | `@claim:site-routes` (C); L; Links. |
| F-1-42 | Kept the shared header/footer shell on legal and recovery pages. | `@claim:site-routes` (C); L; 404 Screen. |
| F-1-43 | Kept every visible mobile link and control at least 44×44px. | `390px routes have no overflow, keep navigation, and expose 44px targets` (U); L. |
| F-1-44 | Kept visible external labels and valid repository/license links. | Links; live shared header/footer. |
| F-1-45 | Kept the privacy/limits section before the final action. | live `/`; home Screens. |
| F-1-46 | Kept `signed reference` and `Database reference` terminology. | `.factory/copy-audit.md`; `@claim:reference-shape` (C). |
| F-1-47 | Kept `Demo` for the route and `Payload playground` for the form. | `.factory/copy-audit.md`; live `/demo`. |
| F-1-48 | Kept the direct webhook/automation developer eyebrow. | both home Screens. |
| F-1-49 | Kept the playground heading focused on the database result. | live `/demo`; demo Screen. |
| F-1-50 | Kept direct oversized-field replacement wording. | live `/`; `.factory/copy-audit.md`. |
| F-1-51 | Kept all six required configuration inputs and declaration drift protection. | `@claim:required-config` (C); `source installation is disclosed and copies the complete tarball workflow` (U); live `/#install`. |
| F-1-52 | Kept standalone retention headings. | live `/`; mobile home Screen. |
| F-1-53 | Kept the final action focused on database rows. | live `/`; mobile home Screen. |
| F-1-54 | Kept a concrete `/result/attachment` validation example. | aggregate form/a11y path (U); live `/demo`. |
| F-1-55 | Kept result-naming actions, including complete source-install copy. | source-install browser test (U); S; `.factory/copy-audit.md`. |
| F-1-56 | Kept the README opening concepts split into short sentences. | `.factory/copy-audit.md`; README. |
| F-1-57 | Kept README audience and exclusions separate. | `.factory/copy-audit.md`; README. |
| F-1-58 | Kept retrieval instructions short and concrete. | `.factory/copy-audit.md`; README. |
| F-1-59 | Kept legal-hold guidance split by action and result. | `.factory/copy-audit.md`; README. |
| F-1-60 | Kept expiry limits and lifecycle guidance separate. | `.factory/copy-audit.md`; README. |
| F-1-61 | Kept direct development commands. | `.factory/copy-audit.md`; README. |
| F-1-62 | Kept deployment and 404 statements short and live-verified. | D; README. |
| F-1-63 | Kept packaging and factory ownership as separate sentences. | `.factory/copy-audit.md`; README. |
| F-1-64 | Re-audited all landing/README prose; no sentence exceeds 22 words or uses banned wording. | `.factory/copy-audit.md`. |
| F-1-65 | Rebalanced the desktop hero and retained the compact mobile hero so all three facts fit both required first screens. | `mobile and desktop first screens include the action note and all three facts` (U); L; both home Screens. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept the exact shipped seed at 1.70%, below 10%. | `@claim:inline-reduction` (C); L. |
| F-2-2 | Kept the valid original PNG and matching filename, MIME, and dimensions. | `@claim:demo-media` (C). |
| F-2-3 | Kept all five routes within the 390px viewport. | mobile route test (U); L. |
| F-2-4 | Kept all four primary navigation links visible on phones. | mobile route test (U); mobile home Screen. |
| F-2-5 | Kept the exact shared shell on the 404 page. | `@claim:site-routes` (C); 404 Screen. |
| F-2-6 | Kept the truthful `Leave demo` action. | `@claim:demo-seed` (C); demo Screen. |
| F-2-7 | Kept `Spill result` instead of ledger jargon. | `.factory/copy-audit.md`; live `/demo`. |
| F-2-8 | Kept `No spill decision yet` as the empty heading. | aggregate browser test (U); live `/`. |
| F-2-9 | Kept `JSON Pointer` capitalization consistent. | `.factory/copy-audit.md`; README and live site. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-6 | Preserved fresh restoration transactions, exact coordinates, focus, and announcements. | repeated history test (U); L records six exact live restorations. |
| F-3-1 | Preserved result → restore → editor DOM and keyboard order. | `demo keyboard order follows the visible result before the editor` (U); L; keyboard Screen. |
| F-3-2 | Kept the fresh-project tarball wording in plain user terms. | `.factory/copy-audit.md`; README; S. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Kept the honest source-tarball workflow and unpublished notice; added a live registry claim in round 5. | `@claim:package-formats`, `@claim:registry-availability` (C); source-install browser test (U); S; live `/#install`. |
| F-1-51 | Preserved the six-input copy and public-declaration assertion. | `@claim:required-config` (C); live `/#install`. |

## Review 5 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Widened the copy column, reduced the display scale, and tightened desktop hero spacing without changing the halftone/manual identity. Added exact 390×844 and 1440×900 fold assertions locally and live. | `mobile and desktop first screens include the action note and all three facts` (U); L; `.factory/evidence/polish-5-live/live-home-1440x900.png`. The proof list ends near y=746 in the 900px viewport. |
| F-5-2 | Added `registry-availability` to `.factory/claims.json`; its tagged test queries the public registry for `event-payload-spillway@0.1.0`, requires npm `E404`, and checks both public notices. | `@claim:registry-availability version 0.1.0 is not published to the npm registry` (C); live `/#install`; S. |

## Final result

- Clean clone `9afe1eb`: 29/29 exact claim commands, 40/40 aggregate tests, TypeScript check, zero-vulnerability audit, and 14,655-byte package dry run passed.
- Cold live review: both required first screens, five routes, demo query entry, storage/network isolation, keyboard order, six Back restorations, axe, console, mobile width/targets, offline reload, and product 404 passed (L, D).
- The five public route bodies match the built files byte for byte (Links).
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.07s, TBT 0ms, CLS 0, 119,119 bytes (H).
- The distinct dithered safety-manual art, paper/ink/reservoir palette, narrow display type, and mechanical controls remain intact (Screens).

No finding from reviews 1–5 remains unresolved.
