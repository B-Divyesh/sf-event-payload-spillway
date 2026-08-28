# Handoff — perfection-loop polish 5

## Status: complete

Repaired candidate `97dcfd26d9ddc6b83033d7f6fc05c6fd1294611b` after review `2d199e3e8a9954265573b4d0ba842c33558f35d2`. The implementation is commit `9afe1ebe5d3166255d72cf85efa19b9d12c812f1` and is deployed at <https://event-payload-spillway.sociobot.in>.

## What changed

- Rebalanced the desktop first screen so the sample action, result note, and privacy/offline/license facts fit at 1440×900. The 390×844 fit remains intact.
- Added a two-viewport browser regression and the same cold assertion to the live-review script.
- Registered `registry-availability` in `.factory/claims.json`. Its tagged test queries npm for `event-payload-spillway@0.1.0`, requires `E404`, and checks both public notices.
- Updated the verb-first 108-character catalog description and complete copy audit.
- Preserved the one-click isolated `/demo` and `?demo=1` paths, reset, routes, focus restoration, legal shell, mobile layout, and halftone identity.
- Mapped every finding from reviews 1–5 to current proof in `.factory/polish-5.md`.

## Exact verification

Clean detached clone `/tmp/event-payload-spillway-polish5-clean.f67cOb` at `9afe1eb`:

```sh
npm ci
npm run test:claims
npm test
npm run check
npm audit --audit-level=moderate
npm pack --dry-run --json
```

Results: 29/29 claim commands passed; `npm test` passed 40/40; TypeScript passed; audit found zero vulnerabilities; the 26-file package is 14,655 bytes. Evidence is in `.factory/evidence/polish-5-clean/`.

Post-deploy checks:

```sh
npm run verify:live-review -- https://event-payload-spillway.sociobot.in .factory/evidence/polish-5-live
npm run verify:pwa -- https://event-payload-spillway.sociobot.in/demo
npm run verify:deployment -- https://event-payload-spillway.sociobot.in
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh https://event-payload-spillway.sociobot.in .factory/evidence/polish-5-live
```

Results: both required first screens pass; the desktop proof list ends near y=746. Five routes have zero axe violations, zero console errors, no mobile overflow, no undersized targets, and complete metadata. Demo reset/restore, `?demo=1`, isolation, keyboard order, six exact Back restorations, offline reload, security/cache headers, and HTTP 404 pass. Live route bodies match the build byte for byte. The public source-tarball workflow installs and restores a value.

Lighthouse mobile scores are 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP is 1.07s, TBT is 0ms, CLS is 0, and transfer is 119,119 bytes. Live evidence is in `.factory/evidence/polish-5-live/`.

## Known gaps and next steps

No review finding remains open. Version 0.1.0 is intentionally not published by this worker; the factory owns registry credentials. The availability test will fail after publication, prompting the public copy to switch to the released npm install path.
