# Handoff — polish 4

## Status: complete

Candidate `ff5425d769b2a6367666be7e2494d79128fac275` was repaired from review commit `bb2ab12ad8da365fc09a43f523052ea8ed7f9087`.
The implementation is commit `cbc223d` and is deployed at <https://event-payload-spillway.sociobot.in>.

## What changed

- Removed every `npm install event-payload-spillway` promise because the name is not yet published in the npm registry.
- Added an honest source checkout → build → pack → local npm install workflow to the landing page and README.
- Replaced the false four-option heading and named all six required `SpillwayConfig` inputs.
- Added `required-config` to `.factory/claims.json` and extended browser/package regressions for availability copy, configuration shape, copied commands, tarball installation, and execution.
- Updated the catalog description and copy audit. The industrial safety-manual visual system and original spillway art remain unchanged.
- Rechecked every finding from reviews 1–4; `.factory/polish-4.md` contains the complete mapping.

## Verification

Final clean clone:

```sh
npm ci
npm run test:claims
npm test
npm run check
npm audit --audit-level=moderate
npm pack --dry-run
```

Results: 28/28 exact claim commands passed; 39/39 aggregate tests passed; typecheck, audit, build, and pack passed. The package tarball is 14.6 kB.

The exact public source-install sequence was also run in a new temporary project. Its installed package completed spill and restore. Evidence: `.factory/evidence/polish-4-live/source-install.txt`.

Post-deploy checks:

```sh
npm run verify:live-review -- https://event-payload-spillway.sociobot.in .factory/evidence/polish-4-live
npm run verify:pwa -- https://event-payload-spillway.sociobot.in
npm run verify:deployment -- https://event-payload-spillway.sociobot.in
/opt/fleet/lib/verify-url.sh https://event-payload-spillway.sociobot.in .factory/evidence/polish-4-live
```

The cold review passed five routes with zero axe violations, zero console errors, no mobile overflow, no undersized controls, exact focus/scroll restoration, privacy isolation, and direct `?demo=1` entry. The internal route/fragment and external-link crawl passed. Offline reload/restore, security headers, cache policy, and the HTTP 404 passed.

Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.4 s, TBT 0 ms, CLS 0, transfer 116 KiB.

## Build and deployment

- `npm run build` produces `dist/package` and `dist/site`.
- `npm pack` prepares the npm artifact; registry publication remains owned by the factory and was not performed by this worker.
- `dist/site` was uploaded to the existing `sf-event-payload-spillway` Azure Static Web App production environment.
- The custom domain returned the repaired content immediately after deployment.

## Known gaps

None against the brief or reviews. Until the factory publishes the npm name, the product accurately presents and tests source-tarball installation only.
