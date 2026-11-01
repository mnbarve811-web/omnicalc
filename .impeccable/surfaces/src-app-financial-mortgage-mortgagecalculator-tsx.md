---
version: 1
slug: "src-app-financial-mortgage-mortgagecalculator-tsx"
primary_target: "src/app/financial/mortgage/MortgageCalculator.tsx"
related_targets: []
---

## Scope

Calculator page template (all 19 calculators, 4 pillar hubs inherit it). Visitor mode: Operate, with the guide/FAQ block in Read mode. Code-led build (no image generation available).

## Audience and task

Search visitors, scenario planners and learners (see PRODUCT.md). Task: enter numbers, read the answer, understand it, share or export it. Constraints: engine logic, URL params, labels/button names used by e2e tests, canonicals and JSON-LD stay unchanged. Ads never between inputs and results.

## Direction contract

THESIS: The answer is the hero, and the working sits beside it. Refuses the category default of four equal stat tiles and an export toolbar above the result.

OWN-WORLD: Calibrated instrument. Blue-tinted ground (#EEF1F5) under white work panels; blue-black ink (#141B2D); graphite secondary (#4A5568); one cobalt (#2747C9) for interaction, focus and the primary data series; amber (#B86E0A) as the counter-series (cost, interest, tax); pillar hues (emerald, rose, indigo, amber) mark category in nav, breadcrumbs and hubs only. Geist throughout, tabular figures for every number. Radii 6/10/full by hierarchy. One soft offset shadow on panels; no glows, no eyebrows, no section numbers.

STORY: The visitor sees their result before they finish scrolling, understands what it is made of, and can copy a link that reproduces it.

FIRST VIEWPORT: Breadcrumb, H1 and one-line description left-aligned. Two columns at lg: inputs panel (360px, sticky) left; result panel right led by the primary figure at 44-60px with its label, the proportion bar under it, then secondary figures as a definition list, then actions (Copy link, Reset, PDF, CSV). Mobile: inputs first, a sticky bottom bar carries the primary figure and jumps to results.

FORM: Pinned by the user (approved design system, 2026-10-31); the concept roll was skipped because the direction is user-pinned. seed: none

SIGNATURE MOVE: The proportion bar: one horizontal stacked bar under the primary figure that shows what the answer is made of (principal vs interest, contributions vs growth, take-home vs tax, macro split, BMI band), with a 200ms value flash when inputs change. Used only where the result genuinely decomposes.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Locale-based currency display and switcher (PRODUCT.md open decision), out of scope for this redesign.
- AdSense publisher ID not yet provided; slots ship dormant.
