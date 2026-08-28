# Handoff — Polish 3 complete

## Status: PASS

Repaired review candidate `890cb398f97914edd2647bf36af6484af98934e3` from review `ac176eb48d8caf53644eb43bec61977531172491`.

Implementation commit: `a236a9eb51a6f88bb254633ab418ec288b76b294` (`fix: stabilize demo navigation and focus order`).

Deployment: <https://event-payload-spillway.sociobot.in>.

## What changed

- Back navigation now saves exact scroll coordinates and the activating control, disables smooth scroll only during restoration, waits for browser focus adjustment, restores coordinates, then announces the returned page. The browser regression performs eight Back cycles.
- The demo result now appears before the form in both DOM and visual order. Keyboard users encounter the signed reference, Restore original, then the editor fields in downward screen order.
- Replaced the remaining README harness jargon with a plain description of the fresh-project tarball verification.
- Kept the existing one-click isolated `?demo=1`/`/demo` sample, banner/reset/leave controls, route metadata, legal pages, product 404, mobile layout, claim registry, and industrial-print visual identity. The catalog sentence is verb-first and 113 characters.
- Updated the visual thesis and copy audit to remove stale action/reference terminology.

## Verification

Fresh clone: `/tmp/event-payload-spillway-polish3.yGDUpx` at `a236a9e`.

- `npm ci` — passed; zero audit vulnerabilities.
- `npm run test:claims` — 27/27 declared claim commands passed; `.factory/evidence/polish-3-clean-claims.txt`.
- `npm test` — 37/37 passed; `.factory/evidence/polish-3-clean-suite.txt`.
- `npm run check`, `npm audit --audit-level=moderate`, `npm pack --dry-run` — passed. Package tarball: 14.5 kB (73.9 kB unpacked).
- Local browser/a11y/privacy/offline checks — zero axe violations, zero console errors, offline shell controlled; `.factory/evidence/polish-3-browser.txt`, `polish-3-pwa.txt`, `polish-3-verify-url.txt`.
- Live cold check — title, `lang`, one `h1`, `main`, image alternatives, labels, and zero console errors; `.factory/evidence/polish-3-live-verify-url.txt`.
- Live route/mobile/privacy/a11y check — five routes, 1.70% demo inline ratio, zero axe violations, no overflow, no undersized controls, same-origin GET-only demo traffic; `.factory/evidence/polish-3-live-review.txt`.
- Live repeated navigation/keyboard check — five exact Back restorations and result → restore → editor focus sequence; `.factory/evidence/polish-3-live-keyboard.txt`.
- Live PWA and Static Web Apps policy — service-worker offline reload, CSP/security headers, immutable asset cache, no-cache worker, and product HTTP 404 passed; `.factory/evidence/polish-3-live-pwa.txt`, `polish-3-live-deployment.txt`.
- Live Lighthouse mobile — 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.4 s, CLS 0; `.factory/evidence/polish-3-lighthouse-live.json`.

Screens: `.factory/evidence/live-home-390.png`, `live-demo-390.png`, `polish-3-live-demo-keyboard-390.png`, and `polish-3-live-404-390.png`.

## Run and publish

```sh
npm ci
npm test
npm run test:claims
npm run check
npm pack
```

`npm pack` creates the ready-to-publish library tarball. Registry publishing remains with the factory credentials.

## Known gaps / next steps

None. All findings in `.factory/review-1.md`, `.factory/review-2.md`, and `.factory/review-3.md` are closed in `.factory/polish-3.md`.
