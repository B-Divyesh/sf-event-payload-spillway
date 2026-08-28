# Handoff — polish 1

## Status: repaired and pushed

Repair commit: `ba1e77598fca710128af31f0432890601d671f1d`.
It closes every finding in `.factory/review-1.md`; the detailed ID-to-change map is in `.factory/polish-1.md`.

## Delivered

- Rewrote the landing first screen for self-hosting webhook developers and made the npm-library form explicit.
- Added one-click `/demo` and `?demo=1` entry. It seeds and runs a realistic event before ready, shows a persistent isolation banner, supports Reset demo, and never reads or writes real browser data.
- Added claim registry and 15 independently runnable tagged claim commands. They cover library behavior, route/metadata/404, demo isolation, and warmed offline restore.
- Added MPA demo/privacy/terms/404 routes, route titles and metadata, 1200×630 social card, apple-touch icon, shared legal shell, external-link labels, touch-target spacing, and Static Web Apps fallback/404 policy.
- Rewrote reviewed copy, terminology, README, catalog line, and legal/limits text. The dithered industrial spillway identity is retained.
- Added browser screenshots: `.factory/evidence/demo-390.png` and `.factory/evidence/home-1440.png`.

## Exact verification evidence

Clean detached clone: `/tmp/spillway-clean-nJd7W5` at `ba1e775`.

```text
npm ci                                             PASS (0 vulnerabilities)
npm test                                           PASS (18/18)
npm run check                                      PASS
npm pack --dry-run                                 PASS (14.4 kB package)
every .factory/claims.json command (clean clone)   PASS (15/15)
node scripts/verify-browser.mjs .../demo/          PASS (axe 0; console 0; spill/restore)
node scripts/verify-pwa.mjs .../                   PASS (offline shell; console 0)
verify-url.sh local root                            PASS (title/lang/h1/main/alt/console)
axe smoke /, /demo/, /privacy/, /terms/, /404.html PASS (0 serious/critical)
```

Built site: JS 14.44 kB raw / 5.76 kB gzip; CSS 14.23 kB raw / 4.04 kB gzip.

## Deployment

Pushed `main` to `origin` at `ba1e775`. Static deployment configuration is emitted in `dist/site/staticwebapp.config.json` and includes response headers, cache rules, navigation fallback, and the product 404 override.

At the time of this handoff write, the public endpoint still served the pre-repair `6632d7b` artifact (`/demo` returned the old Azure 404). The deployment worker must finish publishing the pushed commit before live cold checks can truthfully pass. No code or test gap remains in the committed artifact.

## Known product gaps

None. The library intentionally does not automate key rotation, configure a provider lifecycle rule, or add operator authentication; these are explicit operator responsibilities, not omitted promised features.
