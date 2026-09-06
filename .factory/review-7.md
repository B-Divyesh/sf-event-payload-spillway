# Event Payload Spillway review 7 — move oversized webhook fields out of database rows

**Verdict: PASS**  
**Reviewed:** 2026-09-06 UTC  
**Live URL:** <https://event-payload-spillway.sociobot.in>  
**Implementation candidate:** `9afe1ebe5d3166255d72cf85efa19b9d12c812f1`  
**Documentation commit:** `3297dba5acdb19e2d8a6060c399210b9c4aea24e`

There are **zero findings** at every severity and **zero untested public claims**.

## Job, audience, and first action

Fresh empty Chromium contexts opened the live landing page before any scroll at 390×844 and 1440×900.

| Question | Observed answer |
| --- | --- |
| Job | Move oversized webhook fields out of database rows into encrypted object storage. |
| Audience | Self-hosting developers with webhook or automation events containing large base64, media, or JSON values. |
| First action | **Try it with sample data**; the adjacent note says it opens a seeded sample with the spill result already shown. |

Both viewports show the job, audience, action note, and the three facts (temporary demo tab data, offline after first visit, free MIT license) without scroll. The product is plainly identified as an npm library. The copy is direct and the dithered safety-manual visual system is product-specific.

## Live demo and user paths

The live browser review passed at 390×844 and 1440×900.

- One click entered `/demo` and immediately showed a completed `render.complete` PNG spill: 74,502 raw bytes, 1,268 inline bytes (1.70%), encrypted signed reference, and Restore original.
- The persistent label was `Demo — sample data, nothing is saved`. Reset demo restored and reran the seed. Leave demo returned to the landing page. `?demo=1` reached the same isolated seeded demo.
- A changed payload was removed by reset. Browser storage sentinels for real data remained unchanged; requests were same-origin GETs and carried no edited payload.
- Normal spill/restore, invalid JSON, invalid JSON Pointer, too-small byte limit, no-spill boundary, storage failure, tampered reference, failed decryption integrity, dry-run reclaim, legal hold, proxy rejection, and recovery/retry paths are covered by the passing aggregate suite and relevant claim tests.
- Keyboard order is result, restore, then editor. Focus, skip link, route announcements, six Back restorations, 44px targets, no mobile overflow, and reduced-motion behavior passed. Axe found zero violations; live console errors were zero.
- The warm service-worker-controlled demo reloaded offline and restored the sample. The privacy and terms routes have route titles and a shared shell. The deliberate unknown-route HTTP 404 is a designed product recovery page, not a defect.

## Claims and package verification

A new clean clone was created at `/tmp/event-payload-spillway-review7-clean.rNHuCd`, followed by `npm ci` and `npm run test:claims`. The registry contains 29 claims; its verifier ran every exact command declared in `.factory/claims.json` and exited 0. This includes the official MinIO adapter integration, browser isolation/offline tests, public npm E404 status, and a packed fresh-consumer test for ESM, CommonJS, declarations, and the documented Node 20 example.

In the review checkout these commands also exited 0:

```sh
npm run build
npm run verify:live-review -- https://event-payload-spillway.sociobot.in /tmp/event-payload-spillway-review7-live
npm run verify:deployment -- https://event-payload-spillway.sociobot.in
npm run verify:pwa -- https://event-payload-spillway.sociobot.in/demo
npm run verify:browser -- https://event-payload-spillway.sociobot.in
npm test
npm run check
npm pack --dry-run
```

`npm test` passed 40/40. The generated site is 6.48 kB gzip JavaScript and 4.19 kB gzip CSS. `npm pack --dry-run` produced the expected 14.7 kB package dry run. `verify:deployment` confirmed the intended CSP and security headers, immutable hashed asset cache, no-cache service worker, and product HTTP 404. It needs generated `dist/site/`, so it was correctly run after `npm run build`.

## Earlier finding disposition

All prior review, verification, and polish records were read. Their findings are closed and were independently rechecked:

| Earlier set | Current disposition |
| --- | --- |
| Review 1: F-1-1–F-1-65 | Closed: cold first screen, one-click isolated demo, 29-claim registry, plain copy, metadata, shared shell, target size, designed 404, demo safety, retrieval, retention, crypto, proxy, privacy, and package behavior all passed live and in tests. |
| Review 2: F-2-1–F-2-9 | Closed: the exact valid PNG sample is below 10%, phone navigation and width work, 404 is product-specific, Leave demo is accurate, and product terms remain consistent. |
| Review 3: F-3-1, F-3-2, repeated F-1-6 | Closed: result-before-editor keyboard order, clean-project installation wording, focus, announcement, and exact history restoration passed. |
| Review 4: F-4-1 and repeated F-1-51 | Closed: the not-yet-published package uses an honest source-tarball flow; the six required configuration inputs match the public declaration. |
| Review 5: F-5-1, F-5-2 | Closed: both first-screen folds fit, and unpublished npm status is a registered live claim. |
| Review 6 | No findings to carry. Its cited checks were repeated in this review. |

The brief's extra expected value is present: signed retrieval is demonstrable, and retention reporting/reclaim/legal holds are documented and tested. AI, tenant isolation, backend health/rate limits, and restart persistence do not apply to this static documentation/demo and npm library; the library's actual S3-compatible boundary is exercised against MinIO.

## Result

**PASS — 0 findings; 0 untested claims.**
