# Handoff — adversarial review 2

## Status: FAIL review completed

Reviewed candidate `cc3540dd2559202fe1507ee97c57041532ec5329` and the live site on 2026-08-28 UTC. No product code was changed. The complete evidence, copy audit, historical recheck, and fixes are in `.factory/review-2.md`.

## Verification performed

- Fresh Chromium at 390×844 and 1440×1000, before-scroll first read.
- One-click demo, completed seed, Reset demo, real-storage sentinels, request capture, reload, and warmed offline restore.
- Every `.factory/claims.json` command in a clean detached clone: 15/15 commands returned zero.
- Clean-clone `npm test`: 18/18; `npm run check`: pass; `npm run build`: pass.
- Live browser/axe verification: zero reported WCAG 2 A/AA violations and zero console errors.
- Live PWA/offline and deployment-header checks: pass.
- All internal/external links crawled successfully.
- Route metadata, unknown path, Back/focus, 44 px targets, and horizontal overflow checked independently.

## Blocking handoff items

- The shipped demo leaves 14.64% inline while its registered claim says below 10%.
- The sample declares PNG but its base64 begins with a GIF signature and repeats a short fragment.
- Unknown live routes return the home page with HTTP 200; the designed 404 is not delivered.
- Back navigation loses focus, secondary-route social metadata is incomplete, small targets remain, and every 390 px route is 537 px wide.
- Multiple review-1 claim findings remain incomplete or absent from `.factory/claims.json`; see the original IDs in the report.
- Three code-panel buttons still say `Copy`, and the required hero facts sit below the first mobile viewport.

## Reproduction

```sh
npm ci
npm test
npm run check
npm run build
npm run verify:browser -- https://event-payload-spillway.sociobot.in
npm run verify:pwa -- https://event-payload-spillway.sociobot.in
npm run verify:deployment -- https://event-payload-spillway.sociobot.in
curl -i https://event-payload-spillway.sociobot.in/definitely-missing-review-2
```

The tree remains buildable. Review documentation is the only tracked change.
