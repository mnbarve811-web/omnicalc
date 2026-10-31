# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mix of three groups, none dominant:

- Search visitors with one quick question (a mortgage payment, a BMI, a percentage), often on mobile, who want the answer and leave.
- Planners making a real decision (home purchase, retirement, debt) who adjust inputs, compare scenarios, share links and export results.
- Learners who want the formula and method explained, not only the number.

## Product Purpose

OmniCalc is a free collection of calculators across four pillars: Financial, Fitness & Health, Math & Scientific, and Utility (19 calculators today). Success is a visitor getting a correct, understandable result quickly, and being able to reproduce or share it.

## Positioning

- Fast and uncluttered: results update as you type, pages stay light, and nothing (including ads) sits between inputs and results.
- Shareable and exportable: every input is stored in the URL, so a link reproduces a result exactly; PDF and CSV export work without an account.
- Built to grow: the catalogue is expected to expand well past 19 calculators, so discovery (navigation, search, related links) must scale.

## Capabilities and Constraints

- Calculation logic lives in `src/lib/engine` as pure, unit-tested functions. Visual work must not change formulas, rounding, or validation; defects are reported separately for approval.
- Established URLs, canonicals, and the sitemap are fixed; no new indexable pages without approval.
- Monetisation is planned through Google AdSense; no ads are live yet. Ad slots must never sit between inputs and results, and the site must work fully when ads are blocked.
- Currency is USD today, and the salary calculator applies US federal tax and FICA rules.
- Open decision: detect the visitor's locale to choose display currency, with a manual currency switcher. Not yet scoped; calculators with US-specific rules would need to stay labelled as such.

## Evidence on Hand

- Long-form guide text, FAQs, and JSON-LD for every calculator in each route's `content.ts`.
- No testimonials, user counts, press, or accuracy benchmarks exist; do not fabricate them.

## Product Principles

1. The result is the hero: the answer a visitor came for is the most prominent thing on the page.
2. Show the working: formulas, assumptions, and limitations sit beside results, not hidden.
3. A link is a saved result: anything visible should be reproducible from the URL.
4. Respect attention: ads, motion, and decoration never compete with inputs or results.
5. Consistency teaches: every calculator behaves the same way, so learning one teaches all.

## Accessibility & Inclusion

Target WCAG 2.2 AA: labelled inputs, announced result changes, visible keyboard focus, 44px touch targets, and reduced-motion support.
