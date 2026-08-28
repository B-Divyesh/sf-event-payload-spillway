# Visual thesis — the overflow ledger

## Direction and fit

The site uses a **dithered/halftone print system** modeled on industrial safety manuals and dot-matrix incident ledgers. Event Payload Spillway is a protective pressure valve for infrastructure, so the visual language pairs terse operational typography with an illustrated flow from a dangerous hot database into a cool, contained object-store reservoir. Halftone texture makes “payload density” visible without ornamental gradients or generic cloud imagery.

This is intentionally a single, ink-on-stock light treatment. The warm paper background is explicitly painted; a dark theme would weaken the printed-operations metaphor. Information hierarchy, underlines, patterns, labels, and icons keep every state understandable without relying on color.

## Tokens

- `paper #F3EBD8` — warm recycled manual stock.
- `paper-raised #FFF9EA` — working surfaces and code strips.
- `ink #17201D` — near-black green, 13.6:1 on paper.
- `ink-muted #4E5C55` — ledger annotations, 6.0:1 on paper.
- `reservoir #095C5B` — safe stored state and primary controls; white text is 7.5:1.
- `signal #C54125` — hot/oversized payload warning; ink is used for small text on this color.
- `brass #D49B2A` — decision nodes and focus highlights.
- `danger #9C281C`, `success #176744`, `warning #7A4B00` — semantic accents, always paired with words or symbols.

## Type

- Display: **Arial Narrow**, with `Aptos Narrow` and system sans fallbacks, all-caps only for tiny ledger labels. Its condensed shapes feel like equipment labeling and keep the long product name forceful on mobile.
- Working text/code: **ui-monospace**, `SFMono-Regular`, Consolas, and system monospace. This is an npm developer tool; JSON and measurements should feel native rather than themed.
- No external font requests. Body is 16–18px with 1.55 leading; tables use tabular figures.

## Spacing and geometry

- 4px base rhythm; primary gaps are 8, 12, 16, 24, 32, 48, 72, and 96px.
- Content maxes at 1180px. Reading copy maxes at 68 characters.
- Corners are mostly square with occasional 2px mechanical rounding. Sections group through proximity first; rules and bordered panels appear only for actual independent instruments.
- Buttons and inputs are at least 44px high. A 4px offset shadow gives important actions the physical feel of a stamped control.

## Interaction grammar

- The main call to action is “Test a payload.” The demo follows a three-stage ledger: input → spill decision → signed stub/restore.
- Pressing controls moves them 2px into their offset shadow. Focus uses a 3px brass outline plus 3px paper gap.
- Status changes combine a symbol, plain-language label, and measurement. Spill results enter from the left as though advanced by a line printer; tabs expose appropriate ARIA state and arrow-key behavior.

## Motion policy

- One 240ms transform/opacity transition advances a result from its source. Button feedback is 120ms. Nothing loops, flashes, or parallax-scrolls.
- Under `prefers-reduced-motion: reduce`, transitions and scroll behavior become instant; state changes retain borders, labels, and live-region announcements.

## Asset plan and provenance

- `site/public/hero-spillway.webp`: original generated editorial illustration, used as explanatory hero art with explicit dimensions and meaningful alt. Prompt: “Wide editorial illustration for a developer tool landing page, an industrial data spillway shown as a cutaway: dense black JSON blocks and one oversized coral payload travel on a conveyor toward a teal encrypted object-storage reservoir while a small clean database remains protected above; 1960s technical safety manual, two-color risograph plus warm paper, coarse halftone and dither texture, precise geometric forms, screen-print ink misregistration, high contrast, generous negative space, no people, no logos, no readable text, no gradients, no photorealism, no watermark.” Generated with the factory `factory-image` deployment on 2026-08-27, then resized/optimized locally to WebP. Rights: original project asset under the repository MIT license.
- `site/public/social-card.jpg` and `site/public/apple-touch-icon.png`: deterministic crops of the original hero art, composed locally on 2026-08-28 for social previews and touch bookmarks. They introduce no third-party asset or new license.
- The demo uses `site/public/apple-touch-icon.png` as its realistic `render.complete` PNG attachment. This reuses the original project art and adds no third-party provenance.
- UI marks are hand-made CSS geometry or text symbols, not copied icon assets.
