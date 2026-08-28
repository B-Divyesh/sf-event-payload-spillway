# Polish 1 — finding closure

Candidate repaired from `a1749da1e26b6524220fbc73e310498db2e31711` after review `6632d7b5b4a28d28fbbacd0b33934d9a89569da9`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the first screen with the required audience, webhook/database job, and npm-library delivery form. | `test/browser-claims.test.mjs` `@claim:site-routes`; `.factory/evidence/home-1440.png` |
| F-1-2 | Hero now opens a completed seeded `/demo` result in one click. | `@claim:demo-seed`; `.factory/evidence/demo-390.png` |
| F-1-3 | Added `/demo`, banner, Reset demo, Start for real, fresh memory keys/store, and `.factory/demo.md`. | `@claim:demo-seed`, `@claim:demo-privacy` |
| F-1-4 | Added `.factory/claims.json` with one tagged observable test per retained claim. | Every registry command was run locally; `npm test` 18/18 |
| F-1-5 | Added built `/demo` and product-styled `404.html` with Static Web Apps response override. | `@claim:site-routes`; `test/deployment-policy.test.mjs` |
| F-1-6 | Replaced hero fragment navigation with a real demo page; page focus moves to its h1 and a polite route announcement is emitted. | `@claim:demo-route`; browser keyboard smoke check |
| F-1-12 | Replaced incident/hot-path copy with measurable database-row wording. | `@claim:inline-reduction` |
| F-1-13 | Kept encryption wording only where backed by envelope assertions; README now uses short factual sentences. | `@claim:encryption-envelope`, `@claim:s3-contract` |
| F-1-14 | Replaced “two clicks” and stub language with signed-reference wording and tested retrieval handler behavior. | `@claim:retrieval` |
| F-1-15 | Retained package claims and asserted ESM import, CJS require, and no runtime dependencies. | `@claim:package-output` |
| F-1-16 | Added AES-256-GCM, 96-bit IV, ciphertext, signature, and redaction assertions. | `@claim:encryption-envelope` |
| F-1-17 | Documented S3-compatible contract and retained SigV4 metadata test. | `@claim:s3-contract` |
| F-1-18 | Added warm offline demo reload and restore test; service worker precaches the demo route. | `@claim:offline-demo` |
| F-1-19 | Demo keeps a real-storage sentinel, uses no browser payload storage, and captures same-origin-only requests. | `@claim:demo-privacy` |
| F-1-20 | Removed telemetry ambiguity and asserted zero runtime dependencies plus same-origin demo traffic. | `@claim:package-output`, `@claim:demo-privacy` |
| F-1-21 | Kept exact-pointer wording and registered the unlisted-secret behavior. | `@claim:allowlist` |
| F-1-22 | Removed “atomic”; documented the precise compensating cleanup and tested a second-write failure. | `@claim:write-confirmation` |
| F-1-23 | Replaced “safe preview” with “redacted preview”; test examines redaction and named reference fields. | `@claim:encryption-envelope` |
| F-1-24 | Replaced “modern runtime” with Node 20+ Web Crypto/fetch requirement. | README and `npm run check` |
| F-1-25 | Retention copy now states report fields precisely. | `@claim:retention` |
| F-1-26 | Retention copy names dry-run behavior and expired-only default. | `@claim:retention` |
| F-1-27 | Legal holds are described and exercised; lifecycle language is operator guidance. | `@claim:retention` |
| F-1-28 | Proxy wording and mandatory raw-byte verification are tested. | `@claim:proxy-order` |
| F-1-29 | Demo renders a completed encrypted-object result with raw/inline measurements. | `@claim:demo-seed`; `.factory/evidence/demo-390.png` |
| F-1-30 | Added landing “Privacy and limits” section and explicit scope in terms. | route smoke; `/terms/` |
| F-1-31 | README says packed-consumer test covers the example. | `@claim:package-output` |
| F-1-32 | Existing proxy rejection/audit header behavior is exercised in the raw-byte claim test. | `@claim:proxy-order` |
| F-1-33 | Tampered references are rejected before retrieval. | `@claim:reference-integrity` |
| F-1-34 | Host-supplied key and no-store language is limited to tested storage behavior. | `@claim:encryption-envelope` |
| F-1-35 | Token, data URI, and long-base64 redaction is asserted. | `@claim:encryption-envelope` |
| F-1-36 | Key-version scope remains explicit; no rotation feature is implied. | README security section |
| F-1-37 | Build artifact commands are exact and `npm run build` is exercised. | `npm run build`; `npm pack --dry-run` |
| F-1-38 | Static Web Apps policy test now covers fallback and 404 override. | `test/deployment-policy.test.mjs` |
| F-1-39 | Privacy copy describes temporary browser memory, not a deployment promise. | `@claim:demo-privacy` |
| F-1-40 | First screen states Free and MIT licensed; terms identifies hosted documentation/demo mode. | `/`, `/terms/` route test |
| F-1-41 | Added route canonicals, OG/Twitter metadata, social card, and 180px touch icon. | `@claim:site-routes`; `site/public/social-card.jpg` |
| F-1-42 | Legal routes now use the shared header, skip link, navigation, and footer. | axe smoke across `/privacy/` and `/terms/` |
| F-1-43 | Header/footer/nav/link controls use 44px minimum targets. | CSS review; mobile screenshot |
| F-1-44 | Visible `(external)` labels added to all external links. | link crawl smoke |
| F-1-45 | Added the required privacy and scope section before final CTA. | landing screenshot |
| F-1-46 | Standardized on “signed reference” and “Database reference.” | `rg 'stub' site README.md` returns no user copy |
| F-1-47 | Standardized “Demo” and “Payload playground.” | `/demo` UI |
| F-1-48 | Replaced jargon eyebrow with named audience. | landing hero |
| F-1-49 | Replaced implementation-oriented playground heading. | `/demo` h1 |
| F-1-50 | Replaced metaphorical flow copy with direct action wording. | landing flow |
| F-1-51 | Replaced vague configuration heading. | landing install section |
| F-1-52 | Rewrote retention headings as standalone actions. | landing retention section |
| F-1-53 | Rewrote final CTA in database-row language. | landing CTA |
| F-1-54 | Rewrote pointer validation message with a concrete example. | `npm test` form path |
| F-1-55 | Actions now name outcomes: try sample, show result, copy named code, reset demo. | `/demo`; keyboard/browser smoke |
| F-1-56 | Split README opening encryption sentence. | `.factory/copy-audit.md` |
| F-1-57 | Split README audience/scope sentence. | `.factory/copy-audit.md` |
| F-1-58 | Split README retrieval handler sentence. | README retrieval section |
| F-1-59 | Split legal-hold guidance. | README retention section |
| F-1-60 | Split expiry and lifecycle guidance. | README retention section |
| F-1-61 | Rewrote development commands as short imperatives. | README development section |
| F-1-62 | Split deployment policy description. | README deploy section |
| F-1-63 | Split package publishing responsibility sentence. | README deploy section |
| F-1-64 | Rewrote README prose with short sentences and no sentence over 22 words. | `.factory/copy-audit.md` |
| F-1-65 | Hero facts now cover tab-only data, offline demo, and free MIT license. | landing hero; `@claim:demo-privacy`, `@claim:offline-demo` |

Local verification: `npm test` passed 18/18, `npm run check` passed, `npm pack --dry-run` passed, every command in `.factory/claims.json` passed, and axe had zero serious/critical findings across `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` at 390px.
