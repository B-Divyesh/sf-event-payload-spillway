# Handoff — adversarial review 4

## Status: FAIL

Reviewed candidate `ff5425d769b2a6367666be7e2494d79128fac275` and the live site at <https://event-payload-spillway.sociobot.in>. No product code was changed.

## What was done

- Opened the live site cold at 390×844 and 1440×900 and recorded the first-screen interpretation.
- Audited every landing and README sentence, heading, action, term, and claim-like statement.
- Exercised the one-click demo, reset, restore, real-storage sentinels, browser stores, request traffic, and offline reload.
- Ran all 27 exact claim commands and the 37-test aggregate suite from a real clean clone.
- Rechecked every finding from reviews 1–3 against the live site and current code.
- Checked route titles, metadata, shared shell, 404, deep links, Back focus/scroll, keyboard order, links, mobile layout, axe results, console output, and the distinct visual system.

## Findings left

- **F-4-1 (blocking):** `npm install event-payload-spillway` returns npm `E404`; the public install action is unusable and absent from the claim registry.
- **F-1-51 (blocking, reopened):** `Configure four required options` contradicts the six required properties in `SpillwayConfig`.

See `.factory/review-4.md` for exact quotes, evidence, rewrites, the full copy audit, claim matrix, and per-finding history recheck.

## Verification

```sh
cd /tmp/event-payload-spillway-review4.2upMDh
npm ci
npm run test:claims
npm test

cd /work/repo
npm run verify:live-review -- https://event-payload-spillway.sociobot.in
npm run verify:pwa -- https://event-payload-spillway.sociobot.in/demo
npm run verify:deployment -- https://event-payload-spillway.sociobot.in
```

Results: 27/27 registered claims passed; 37/37 aggregate tests passed; live route/a11y/privacy/offline/deployment checks passed. A fresh `npm install --prefix <temp-dir> event-payload-spillway` failed with `E404 Not Found`.

## Next steps

1. Publish `event-payload-spillway@0.1.0` or replace the public install instruction with an honest available source.
2. Add a registry-install claim and fresh-project test.
3. Remove the false four-option count and name the required encryption and signing keys.
4. Rerun review 4 from a cold live deployment.
