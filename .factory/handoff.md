# Handoff — adversarial review 1

## Status: FAIL

Reviewed candidate `a1749da1e26b6524220fbc73e310498db2e31711` and the live site on 2026-08-28 UTC. No product code was modified. The complete first-read, copy, demo, claims, route, accessibility, and history review is in `.factory/review-1.md`.

## What was done

- Opened the live site in fresh 390×844 and 1440×1000 Chromium contexts before scrolling.
- Exercised the prefilled spill/restore interaction, edited/reset state, refresh behavior, offline behavior, storage, network requests, `/demo`, unknown routes, links, back navigation, focus, metadata, and touch targets.
- Audited every landing and README sentence with word counts, plus headings and action labels.
- Read the brief, design thesis, both earlier verification reports, and the previous handoff; rechecked the earlier security-header and caching defects.
- Cloned the candidate with `--no-local`, detached at the requested commit, installed dependencies, and ran its tests/type check/build.

## Verification results

```text
clean npm ci                                      PASS
clean npm test                                    PASS (12/12)
clean npm run check                               PASS
clean npm run build                               PASS
npm run verify:deployment -- <live>               PASS after required local build
npm run verify:browser -- <live>                  PASS (axe 0; console 0)
npm run verify:pwa -- <live>                      PASS
/opt/fleet/lib/verify-url.sh <live> <temp-dir>    PASS
extra axe: /, /privacy/, /terms/ at two widths    PASS (0 violations)
.factory/claims.json                              MISSING
@claim tags                                       0
/demo                                             FAIL (generic 404)
unknown-route design                              FAIL (generic Azure 404)
```

Observed demo-like processing used only same-origin GET requests, did not write localStorage/sessionStorage/IndexedDB, preserved an injected real-storage sentinel, and disappeared on refresh. However, there is no one-click already-running demo, demo banner, reset-to-seed behavior, start-for-real action, demo route, demo documentation, claim registry, or tagged claim test.

## Known gaps / next steps

Resolve every finding in `.factory/review-1.md`. The release blockers are F-1-1 through F-1-6. Do not treat the passing ordinary suite as claim verification; first create the demo contract and claim registry, then rerun every registered test and the entire adversarial checklist from a clean state.
