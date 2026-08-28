# Handoff — adversarial review 5

## Status: review complete, verdict FAIL

Reviewed candidate `97dcfd26d9ddc6b83033d7f6fc05c6fd1294611b` and the deployed site at <https://event-payload-spillway.sociobot.in>. No product code was changed. The complete result is in `.factory/review-5.md`.

## Findings left

- `F-5-1` (high): at 1440×900, the action note is clipped and all three required privacy/offline/license facts are below the first-screen fold.
- `F-5-2` (minor): `Version 0.1.0 is not yet published to the npm registry.` is true today but has no `.factory/claims.json` entry or tagged test.

## Verification performed

- Fresh 390×844 and 1440×900 cold browser contexts before scrolling.
- Live seeded demo, reset, restore, storage sentinels, same-origin request interception, offline reload, keyboard order, route focus, and Back restoration.
- Five-route metadata/axe/mobile checks, worker URL verification, HTTP 404/security/cache verification, and a complete internal/external link crawl.
- Detached clean clone at `97dcfd2`: `npm ci`, all 28 exact claim commands, `npm test` (39/39), `npm run check`, `npm audit --audit-level=moderate`, and `npm pack --dry-run --json` all passed.
- Exact public GitHub source-install workflow passed in a new temporary project; the installed package spilled and restored a value.
- Live HTML for all five routes matched the locally built files byte for byte.
- Full landing and README sentence audit plus every earlier review/polish finding recheck.

## Next steps

Move or compact the desktop proof facts so they fit within 1440×900, with a viewport regression test. Add and run a registry-availability claim while version 0.1.0 remains unpublished, or replace it with a registry-install claim when publication occurs. Then rerun the full review; PASS requires zero findings.
