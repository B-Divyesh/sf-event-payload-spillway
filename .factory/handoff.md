# Handoff — adversarial first-read review 3

## Status: FAIL

Review artifact: `.factory/review-3.md`

Reviewed candidate: `890cb398f97914edd2647bf36af6484af98934e3`

Live product: <https://event-payload-spillway.sociobot.in>

No product code was changed. This work order only added the round 3 review and replaced this handoff with current review evidence.

## Findings left

- **F-1-6, blocking:** Back focus and announcement work, but exact scroll restoration has a reproducible timing race. Clean-clone `npm test` failed 35/36 with `scrollY = 4` instead of `0`; a targeted repetition passed twice and failed on attempt 3.
- **F-3-1, high:** `/demo` visually moves the completed result above the form with CSS `order`, while keyboard focus follows form-first DOM order and then jumps backward to the result.
- **F-3-2, minor:** README phrase `packed-consumer tests` is internal jargon. The review supplies a concrete rewrite.

## What was verified

- Opened the live root cold at 390×844 and 1440×1000. Job, audience, first action, action result, and three required facts fit without scrolling.
- Entered the live one-click demo. Its valid PNG seed was already processed; reset, restore, banner, live storage sentinels, network isolation, and offline reload were exercised.
- Cloned the candidate without hardlinks to `/tmp/event-payload-spillway-review3.cnKLlO` and ran `npm ci`.
- Ran all 27 exact commands in `.factory/claims.json` through `npm run test:claims`; all passed.
- Ran `npm test`; 35/36 passed and F-1-6 failed.
- Ran the F-1-6 targeted browser test repeatedly; it passed twice and failed on the third run.
- Ran `npm run check`, `npm run build`, and `npm audit --audit-level=moderate`; all passed and audit found zero vulnerabilities.
- Ran the live cumulative browser verifier: five routes, 1.70% inline ratio, zero axe violations, zero console errors, no horizontal overflow, zero undersized targets, same-origin GET-only requests, and Back focus restored in that run.
- Ran live PWA and deployment-policy verification; offline reload, security headers, cache rules, and product HTTP 404 passed.
- Crawled every distinct live internal, fragment, GitHub, and license link; all expected links resolved and fragment targets existed.
- Rechecked every finding in `.factory/review-1.md` and `.factory/review-2.md` against live behavior and code. Only F-1-6 reopened; new issues are F-3-1 and F-3-2.
- Audited every landing and README sentence. No sentence exceeds 22 words; only R11 has a wording flag.

## How to reproduce

```sh
npm ci
npm run test:claims
npm test
node --test --test-name-pattern='route navigation restores focus' test/browser-claims.test.mjs
npm run verify:live-review -- https://event-payload-spillway.sociobot.in
```

For F-3-1, enter `/demo` from the hero with keyboard focus, then press Tab through the form. Focus traverses document y≈1499–2005 before jumping backward to the result at y≈998–1286.

## Next steps

1. Save and restore explicit scroll coordinates during route navigation, then repeat the navigation test enough times to catch timing races.
2. Make `/demo` DOM order match its result-first visual order and add a keyboard sequence assertion.
3. Apply the README rewrite from F-3-2.
4. Rerun all quality gates and a complete round 4 review.
