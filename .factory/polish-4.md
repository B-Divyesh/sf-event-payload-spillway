# Polish 4 — cumulative finding closure

Repaired candidate `ff5425d769b2a6367666be7e2494d79128fac275` from review commit `bb2ab12ad8da365fc09a43f523052ea8ed7f9087`.

Implementation commit: `cbc223d`.

Deployed URL: <https://event-payload-spillway.sociobot.in>.

## Evidence key

- **C** — all 28 exact claim commands from the final clean clone: `.factory/evidence/polish-4-clean/claims.txt`.
- **U** — final clean-clone aggregate suite: `.factory/evidence/polish-4-clean/suite.txt`.
- **L** — cold five-route live review: `.factory/evidence/polish-4-live/review.txt`.
- **P** — live offline, deployment, and URL checks: `.factory/evidence/polish-4-live/pwa.txt`, `deployment.txt`, and `verify-url.txt`.
- **S** — exact public source-install workflow from a new temporary project: `.factory/evidence/polish-4-live/source-install.txt`.
- **F** — cold live checks for both review-4 rewrites, copied source commands, and the 390×844 first screen: `.factory/evidence/polish-4-live/finding-checks.txt`.
- **Links** — internal routes/fragments and both external links: `.factory/evidence/polish-4-live/link-crawl.txt`.
- **H** — Lighthouse mobile report and summary: `.factory/evidence/polish-4-live/lighthouse.json` and `lighthouse-summary.json`.
- **Screens** — `.factory/evidence/polish-4-live/live-home-390.png`, `live-demo-390.png`, `demo-keyboard-390.png`, and `404-390.png`.

All route references below are cold checks against the deployed URL.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the verb-first database-row headline, self-hosting developer audience, and npm-library form on the first screen. | `mobile first screen includes the action note and all three facts` (U); `/`; home screen. |
| F-1-2 | Kept the primary one-click action to an already-completed sample. | `@claim:demo-seed` (C); `/demo`; demo screen. |
| F-1-3 | Kept isolated memory-only keys/store, persistent banner, complete reset, and Leave demo. | `@claim:demo-seed`, `@claim:demo-privacy` (C); `/demo`. |
| F-1-4 | Expanded the registry to 28 claims with exactly one tagged test per claim. | `npm run test:claims` reports 28/28 (C). |
| F-1-5 | Kept the real demo route and shared-shell product 404 with HTTP 404. | `@claim:site-routes`, `@claim:deployment-policy` (C); L; 404 screen. |
| F-1-6 | Kept deterministic saved-scroll/focus restoration and polite route announcements. | `route navigation restores the exact saved position, focus, and announcement repeatedly` (U); L records six live restorations at y=0/137. |
| F-1-12 | Kept measurable database-row wording and the exact shipped sample ratio. | `@claim:inline-reduction` (C); L reports 1.70%. |
| F-1-13 | Kept separate encryption and S3-compatible storage proof. | `@claim:crypto-format`, `@claim:s3-compatibility` (C). |
| F-1-14 | Kept signed-reference wording and observable signed retrieval. | `@claim:retrieval`, `@claim:reference-shape` (C); `/demo`. |
| F-1-15 | Kept packed ESM, CommonJS, declarations, and zero-dependency proof. | `@claim:package-formats` (C); S. |
| F-1-16 | Kept AES-256-GCM, unique 96-bit IV, and HMAC-SHA-256 assertions. | `@claim:crypto-format` (C). |
| F-1-17 | Kept the real official-MinIO adapter integration. | `@claim:s3-compatibility` (C). |
| F-1-18 | Kept the warmed demo offline reload and restore path. | `@claim:offline-demo` (C); P. |
| F-1-19 | Kept full browser-store, sentinel, reset, reload, and request-body isolation checks. | `@claim:demo-privacy` (C); L. |
| F-1-20 | Kept browser and Node telemetry instrumentation. | `@claim:no-telemetry` (C). |
| F-1-21 | Kept exact and escaped JSON Pointer coverage with an unlisted secret. | `@claim:allowlist` (C). |
| F-1-22 | Kept precise compensating-cleanup wording and failure behavior. | `@claim:write-confirmation` (C). |
| F-1-23 | Kept redacted-preview wording and every named reference field. | `@claim:reference-shape`, `@claim:preview-redaction` (C). |
| F-1-24 | Kept the documented example verified under Node 20. | `@claim:node20-runtime` (C). |
| F-1-25 | Kept prefix-scoped encrypted and expired byte totals. | `@claim:retention` (C). |
| F-1-26 | Kept expired-only reclaim and non-destructive dry runs. | `@claim:retention` (C). |
| F-1-27 | Kept legal-hold exclusion and operator lifecycle guidance. | `@claim:retention` (C); README. |
| F-1-28 | Kept mandatory untouched-byte verification and failure non-forwarding. | `@claim:proxy-order` (C). |
| F-1-29 | Kept the completed demo result, encrypted object, and measured row size. | `@claim:demo-seed`, `@claim:inline-reduction` (C); demo screen. |
| F-1-30 | Kept explicit privacy and product limits before the final action. | U accessibility/structure test; `/`. |
| F-1-31 | Kept the README example in a fresh tarball consumer. | `@claim:package-formats`, `@claim:node20-runtime` (C); S. |
| F-1-32 | Kept proxy rejection and both audit-header assertions. | `@claim:proxy-order`, `@claim:audit-headers` (C). |
| F-1-33 | Kept pre-read signature and post-decryption digest rejection. | `@claim:reference-integrity`, `@claim:post-decryption-integrity` (C). |
| F-1-34 | Kept raw-key exclusion across store records and logs. | `@claim:key-handling` (C). |
| F-1-35 | Kept token, data-URI, long-base64, and ordinary-text redaction fixtures. | `@claim:preview-redaction` (C). |
| F-1-36 | Kept key-version serialization, verification, and restore. | `@claim:key-version` (C). |
| F-1-37 | Kept ESM, CJS, declarations, and static-site build outputs. | `@claim:build-artifacts` (C); U. |
| F-1-38 | Kept security/cache policy and deployed product 404 checks. | `@claim:deployment-policy` (C); P. |
| F-1-39 | Kept demo privacy separate from operator storage responsibility. | `@claim:demo-privacy` (C); `/privacy/`. |
| F-1-40 | Kept MIT/no-paid-gate behavior. | `@claim:license-price` (C); `/terms/`. |
| F-1-41 | Kept full route-specific canonical, Open Graph, Twitter, favicon, and touch metadata. | `@claim:site-routes` (C); L. |
| F-1-42 | Kept the same header/footer shell on legal and recovery routes. | `@claim:site-routes` (C); L. |
| F-1-43 | Kept every visible mobile control at least 44×44 px. | mobile target test (U); L reports zero small targets. |
| F-1-44 | Kept visible external labels and valid repository/license links. | `@claim:site-routes` (C); Links. |
| F-1-45 | Kept privacy and limits before the final action. | U structure test; home screen. |
| F-1-46 | Kept signed reference and Database reference terminology. | `.factory/copy-audit.md`; `@claim:reference-shape` (C). |
| F-1-47 | Kept Demo for the route and Payload playground for the form. | `.factory/copy-audit.md`; `/demo`. |
| F-1-48 | Kept the direct webhook and automation developer eyebrow. | home screen. |
| F-1-49 | Kept the playground heading focused on the database result. | `/demo`; demo screen. |
| F-1-50 | Kept the flow heading focused on replacing oversized allowed fields. | `/`. |
| F-1-51 | Replaced the false four-option count and named allowlist, limit, storage, encryption key, signing key, and retention window. Added drift protection against the public declaration. | `@claim:required-config` (C); source-install browser test (U); F; `/#install`; home screen. |
| F-1-52 | Kept standalone retention headings. | `/`; home screen. |
| F-1-53 | Kept the final action focused on database rows. | `/`; home screen. |
| F-1-54 | Kept a concrete `/result/attachment` validation example. | U form/a11y path; `/demo`. |
| F-1-55 | Replaced the unusable install copy button; every action now names an actual result. | source-install browser test (U); `.factory/copy-audit.md`; `/`. |
| F-1-56 | Kept README opening concepts in short sentences. | `.factory/copy-audit.md`; README. |
| F-1-57 | Kept audience and exclusions separate. | `.factory/copy-audit.md`; README. |
| F-1-58 | Kept retrieval instructions short and concrete. | `.factory/copy-audit.md`; README. |
| F-1-59 | Kept legal-hold guidance split by action and outcome. | `.factory/copy-audit.md`; README. |
| F-1-60 | Kept expiry limits and lifecycle guidance separate. | `.factory/copy-audit.md`; README. |
| F-1-61 | Kept direct development commands. | `.factory/copy-audit.md`; README. |
| F-1-62 | Kept deployment and 404 statements short and live-verified. | P; README. |
| F-1-63 | Kept package preparation and factory ownership separate. | `.factory/copy-audit.md`; README. |
| F-1-64 | Re-audited all landing prose: 7.8 words per sentence, none above 22, no banned wording. | `.factory/copy-audit.md`. |
| F-1-65 | Kept the action note and privacy/offline/license facts within the 390×844 first viewport. | mobile first-screen test (U); L; home screen. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept the exact browser seed under the 10% bound. | `@claim:inline-reduction` (C); L: 1,268/74,502 bytes. |
| F-2-2 | Kept the valid original PNG and matching metadata. | `@claim:demo-media` (C). |
| F-2-3 | Kept every route within a 390 px viewport. | mobile route test (U); L. |
| F-2-4 | Kept all four header links visible on phones. | mobile route test (U); home screen. |
| F-2-5 | Kept the exact shared shell on the 404. | `@claim:site-routes` (C); 404 screen. |
| F-2-6 | Kept the truthful Leave demo action. | `@claim:demo-seed` (C); demo screen. |
| F-2-7 | Kept Spill result instead of ledger jargon. | `.factory/copy-audit.md`; `/demo`. |
| F-2-8 | Kept No spill decision yet as the empty heading. | U; `/`. |
| F-2-9 | Kept JSON Pointer capitalization consistent. | `.factory/copy-audit.md`; README. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-6 | Preserved the fresh restoration transaction, exact coordinates, focus, and announcement behavior. | repeated history test (U); L: six exact live restorations. |
| F-3-1 | Preserved result-before-editor DOM and keyboard order. | `demo keyboard order follows the visible result before the editor` (U); L; keyboard screen. |
| F-3-2 | Kept the README wording in user-facing fresh-project terms. | `.factory/copy-audit.md`; README. |

## Review 4 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 | Removed every unavailable registry install command and copy action. The page and README now say the package is not yet on npm and provide a complete source → build → pack → install workflow. | `@claim:package-formats` (C); source-install browser test (U); S runs the displayed workflow from a new project and restores a spilled value; F; live `/#install`; home screen. |
| F-1-51 | Removed the false count, named all six required properties, and registered the public configuration shape. | `@claim:required-config` (C); F; live `/#install`; home screen. |

## Final live result

- Cold route review: five routes, zero axe violations, zero console errors, no 390 px overflow, no small targets, six exact Back restorations, and direct `?demo=1` entry (L).
- Offline: service-worker-controlled reload and restore pass (P).
- Deployment: all configured security headers and cache rules pass; unknown routes return the product 404 with HTTP 404 (P).
- Performance: Lighthouse mobile scores 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 1.4 s, TBT 0 ms, CLS 0, total transfer 116 KiB (H).
- Distribution: the exact source-install commands work from a new temporary project; no public page or README advertises the unavailable registry command (S, C, U).

No finding from reviews 1–4 remains unresolved.
