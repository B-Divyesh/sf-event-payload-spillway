# Handoff — adversarial review 6

## Status: PASS

This reviewer made no product-code changes. The review is recorded in `.factory/review-6.md` and was committed with this handoff.

## What was verified

- Cold live loads at 390×844 and 1440×900 identify the job, audience, npm-library form, first action, and result before scrolling.
- The one-click `/demo` and `?demo=1` routes immediately show a completed realistic spill. The banner, reset, leave action, restore action, storage isolation, and request privacy checks passed.
- All 29 registered claims passed from a fresh `git clone --no-local` after `npm ci` and `npm run test:claims`.
- `npm test` and `npm run check` passed in the review checkout.
- Live browser, offline/PWA, response-policy, metadata, 404, keyboard/history, link-crawl, mobile-width, and axe checks passed.
- Every finding from reviews 1–5 and polish records was rechecked against the live site and relevant tests/source. None regressed.

## Reproduce

```sh
npm ci
npm run test:claims
npm test
npm run check
npm run verify:live-review -- https://event-payload-spillway.sociobot.in /tmp/event-payload-spillway-review6-live
npm run verify:deployment -- https://event-payload-spillway.sociobot.in
npm run verify:pwa -- https://event-payload-spillway.sociobot.in/demo
```

## Known gaps / next step

No review finding is open. Version 0.1.0 is intentionally unpublished on npm. Before publication, replace the source-tarball/unpublished copy and change the registry-availability claim, whose current expected result is npm E404.
