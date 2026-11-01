---
name: OmniCalc
description: Free calculators where the answer is the hero and the working sits beside it.
colors:
  background: "#eef1f5"
  foreground: "#141b2d"
  card: "#ffffff"
  primary: "#2747c9"
  primary-foreground: "#ffffff"
  muted: "#e3e8ef"
  muted-foreground: "#4a5568"
  accent: "#e6ebfa"
  accent-foreground: "#1e3aa8"
  destructive: "#c2271d"
  border: "#d5dbe3"
  input: "#8b95a7"
  chart-1: "#2747c9"
  chart-2: "#b86e0a"
  chart-4: "#6b7a99"
  chart-1-tint: "#93a3e4"
  chart-2-tint: "#dcb37f"
  chart-4-tint: "#b5bdcc"
  pillar-financial: "#0f8a6a"
  pillar-fitness: "#d23d5e"
  pillar-math: "#4f46e5"
  pillar-utility: "#b86e0a"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  result-figure:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  section:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.55
    letterSpacing: "-0.01em"
  panel-title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.01em"
  body-reading:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.67
rounded:
  swatch: "3px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "44px"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.muted}"
  button-ghost:
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.muted}"
  input-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
    height: "44px"
  search-large:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0 12px 0 48px"
    height: "56px"
  card-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "20px"
  result-hero:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.result-figure}"
    rounded: "{rounded.lg}"
    padding: "24px"
  proportion-bar:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.full}"
    height: "12px"
  chip-link:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
  nav-link:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-link-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.foreground}"
  tabs-list:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.lg}"
    height: "40px"
  tabs-trigger-active:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
---

# Design System: OmniCalc

## Overview

**Creative North Star: "The Calibrated Instrument"**

OmniCalc reads like a well-made measuring tool: a cool, blue-tinted ground under white work panels, blue-black ink, and a single cobalt that means "you can act here" or "this is the primary series". Nothing is decorative. Every surface exists to take numbers in, show the answer, or show what the answer is made of. The answer is the largest thing on a calculator page; the inputs sit beside it in a narrow sticky column, and the explanation follows in a plain reading column below.

Density is moderate and even. Panels are flat white with one quiet resting shadow; lists are divided by hairline rules rather than boxed; category is carried by small coloured dots, never by fills. Motion is almost absent: a 200ms flash when a result changes, and one bar-growth moment on the homepage example. Both disappear under reduced motion.

The world rejects the generic calculator kit: four equal stat tiles, an export toolbar above the result, oversized wordmarks, serif accent words, eyebrows, glows, numbered section headings and decorative marquees.

**Key Characteristics:**
- Blue-tinted ground, white panels, blue-black ink, one cobalt.
- Geist throughout, tabular figures for every number.
- Answer-first hierarchy: the result figure outranks the page title.
- A stacked proportion bar under the answer whenever the result genuinely decomposes.
- Category marked by pillar dots only.
- Hairline-divided lists instead of card grids.

## Colors

A cool, low-chroma neutral system with one saturated cobalt and one amber counter-voice for data.

### Primary
- **Calibration Cobalt** (`primary`, also `chart-1`): every interactive affordance (primary button, link hover, focus ring, caret, selection tint, active search option text) and the primary data series (principal, growth, the "good" part of the answer). Its tint `accent` / `accent-foreground` marks the highlighted option in the search listbox.

### Secondary
- **Ledger Amber** (`chart-2`): the counter-series. It means cost: interest, tax, property tax. When a secondary figure belongs to the amber series it carries an amber swatch so a cost reads as a cost.

### Tertiary
- **Slate Series** (`chart-4`): the neutral third series (insurance, contributions) and the default for anything that is neither the subject nor a cost.
- **Opaque chart tints** (`chart-1-tint`, `chart-2-tint`, `chart-4-tint`): area and bar fills. Strokes use the full-strength series colour; fills use the tint, at full opacity.

### Wayfinding (pillar hues)
- **Financial Emerald** (`pillar-financial`), **Fitness Rose** (`pillar-fitness`), **Math Indigo** (`pillar-math`), **Utility Amber** (`pillar-utility`): category markers in the header nav, mobile menu, footer, homepage directory, hub titles, other-category chips, related calculators and search results.

### Neutral
- **Instrument Ground** (`background`): the page ground. Alternating homepage bands switch to `card` white to separate sections without borders-in-boxes.
- **Panel White** (`card`): every work surface (input panel, result hero, stats, charts, tables), header, footer and popovers.
- **Blue-Black Ink** (`foreground`): headings, values, primary text. Long reading text drops to 85% of it.
- **Graphite** (`muted-foreground`): labels, captions, descriptions, axis ticks, breadcrumb trail.
- **Mist** (`muted`, same value as `secondary`): tab track, ghost/outline hover, proportion bar track, code sample background, skeletons.
- **Hairline** (`border`): panel borders, list dividers, chart gridlines, header/footer rules.
- **Field Edge** (`input`): input outlines only, chosen for 3:1 against white (WCAG 1.4.11).
- **Signal Red** (`destructive`): validation errors and invalid field outlines only.

### Named Rules
**The One Cobalt Rule.** Cobalt is interaction, focus and the primary series. It is never a background wash, a heading colour or a decorative accent.

**The Counter-Series Rule.** Amber means cost. A value that is money going out (interest, tax) takes the amber series and swatch; nothing else does.

**The Wayfinding Dot Rule.** Pillar hues appear only as small round dots (6px in nav and lists, 8px in directory headings and search results, 12px beside a hub title). Never as fills, text colour, borders or data series.

**The Opaque Tint Rule.** Chart fills use the opaque `-tint` tokens. Translucent series drift to lavender and tan over white.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui)
**Body Font:** Geist
**Label/Mono Font:** ui-monospace stack, used only for literal URLs and code samples

**Character:** One neutral grotesque at every level, tightened by negative tracking as size grows. Hierarchy comes from size, weight 600 and tracking, never from a second family.

### Hierarchy
- **Display** (600, 3rem mobile to 4.5rem desktop, line-height 1, -0.04em): the homepage "OmniCalc" heading only.
- **Result figure** (600, 2.75rem mobile to 3.75rem desktop, line-height 1, -0.035em, tabular): the primary answer in the result hero, and the homepage worked-example figure (3rem). The largest type on any calculator page.
- **Headline** (600, 1.875rem mobile to 2.5rem desktop, line-height 1.1, -0.03em): page H1 on calculators, hubs and About. Homepage section H2s use 1.875rem at the same tracking.
- **Section** (600, 1.5rem, -0.02em): Read-mode section heads (About this calculator, FAQ, About page sections). Related-calculators heading uses 1.25rem.
- **Title** (600, 1.125rem, -0.01em): guide subheads, hub list items, homepage step titles. Secondary result figures use 1.125rem 600 tabular.
- **Panel title** (600, 1rem, -0.01em): input panel and chart card titles.
- **Body reading** (400, 1rem, line-height 1.75, capped at 38rem): guide and FAQ text at 85% ink. The cap is in rem, not ch, because Geist's zero is wider than its average letter.
- **Body** (400, 0.875rem): UI copy, list descriptions, legends.
- **Label** (500, 0.875rem): field labels, result labels, buttons, nav.
- **Caption** (500, 0.75rem): stat labels, field hints, error text, table headers, percentage column.

### Named Rules
**The Tabular Figures Rule.** Every number a visitor reads as a quantity (inputs, results, stats, tables, legend values) is set with tabular figures.

**The Answer-First Rule.** On a calculator page the result figure is larger than the H1. Nothing on the page competes with it in size or weight.

## Layout

A single centred container (max 72rem, 16px gutters, 24px from md). Calculator pages: breadcrumb, H1 and a one-line description (max 65ch) left-aligned, then a two-column grid at lg: a 22.5rem input column, sticky 80px below the top and capped to the viewport height so a long form stays reachable, and a fluid result column. Gaps are 24px, 32px at lg. Below lg the columns stack inputs-first and a fixed bottom bar carries the primary figure and a "See breakdown" jump until the results scroll into view.

The result column stacks in a fixed order: result hero (figure, caption, proportion bar), secondary figures as a definition list (2 columns, 3 from sm), actions row (Copy link and Reset left, PDF and CSV pushed right), then charts and tables. Read-mode sections follow at 64px intervals: guide, FAQ, related calculators. Ads may appear only after the results and inside the reading content, never between inputs and results, and reserve 280px so nothing shifts.

The homepage first viewport is two columns at lg (fluid left, 25rem right): heading, sentence, large search, popular chips and facts left; the worked-example panel right. Directory sections use hairline-ruled lists in a 4-column grid, not cards. Hubs list calculators in a 2-column ruled list.

Internal rhythm: panels pad 20px (24px from md); fields stack at 20px; label to input 6px.

## Elevation & Depth

Mostly flat. Depth comes from the white-on-tinted-ground contrast and hairline borders. One soft resting shadow sits under work panels; other shadows exist only for things that genuinely float.

### Shadow Vocabulary
- **Panel rest** (`box-shadow: 0 1px 2px rgba(20,27,45,0.04), 0 8px 24px -18px rgba(20,27,45,0.22)`): cards, the result hero, the large homepage search field.
- **Popover** (`box-shadow: 0 12px 32px -12px rgba(20,27,45,0.28)`): the search results listbox.
- **Bottom bar** (`box-shadow: 0 -8px 24px -16px rgba(20,27,45,0.3)`): the mobile result bar, casting upward.
- **Segment lift** (`box-shadow: 0 1px 2px rgba(20,27,45,0.12)`): the active segment of a mode toggle inside a muted track.

### Named Rules
**The One Resting Shadow Rule.** A surface at rest gets the panel shadow or nothing. Stronger shadows are reserved for elements that float above the page (popover, fixed bar). No glows, no coloured shadows.

## Shapes

Radii by hierarchy, all derived from a 10px base: 6px for controls (buttons, inputs, tab triggers, code samples, skeleton lines), 8px for navigation chrome (header nav items, menu button, large search field, listbox and its options, chart tooltip), 10px for panels and the tab track, full rounding for chips, the proportion bar and pillar dots. Legend and stat swatches are tiny squares at 2-3px. Homepage example bars round only their top corners (3px). Borders are 1px hairlines everywhere except the homepage step list, which uses a 2px ink rule above each step.

## Components

### Buttons
Quiet and compact; the primary is rare.
- **Shape:** gently rounded (6px).
- **Primary:** cobalt with white label, 44px tall below md, 40px from md, 14px side padding. Hover drops to 80% cobalt. Used for the mobile bar's "See breakdown" and few other places.
- **Outline:** white with hairline border; hover fills Mist. Copy link, PDF, CSV.
- **Ghost:** no fill; hover fills Mist. Reset (disabled until inputs differ from defaults).
- **Focus:** cobalt border plus a 3px cobalt ring at 50%. Active presses down 1px.
- Icons are inline SVG at 16px, leading the label.

### Chips
- **Style:** white, hairline border, full rounding, 14px side padding, a pillar dot before the label.
- **State:** hover shifts the border to 40% cobalt and the text to cobalt. Used for popular calculators and other-category links.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** Panel White on Instrument Ground.
- **Shadow Strategy:** panel rest (see Elevation).
- **Border:** 1px hairline.
- **Internal Padding:** 20px (12px for the small size).

### Inputs / Fields
- **Style:** white, 1px Field Edge outline, 6px radius, 44px tall below md and 40px from md, tabular figures. Label above (14px, 500, ink). Prefix (`$`) and suffix (`years`, `%`) sit inside the field in graphite.
- **Focus:** cobalt border plus 3px cobalt ring at 50%; caret is cobalt.
- **Error / Disabled:** red outline with a faint red ring and a red 12px message announced as an alert; disabled fields drop to 50% opacity.

### Navigation
- **Header:** sticky white bar, 56px, hairline bottom. Wordmark in 18px 600 ink, pillar links as 14px 500 graphite items with dots, 8px radius, Mist hover, ink when current. Search field at the right from md.
- **Mobile:** a 44px menu button opens a full listing: search first, then each pillar with its calculators in two columns.
- **Breadcrumbs:** 14px graphite trail with chevrons; current page in ink.
- **Footer:** white, four pillar columns with dots, then a hairline and site links.

### Search
A combobox with a magnifier icon. Header size is compact; the homepage size is 56px with 18px text and the panel shadow. Results float in a popover listbox, each row a pillar dot, title and pillar name; the active row takes the cobalt tint.

### Result Hero (signature)
The answer panel: graphite label, the result figure, a graphite caption, then the proportion bar. It is a polite live region. When the value changes after first render it flashes a 14% cobalt wash that fades over 200ms (`cubic-bezier(0.16, 1, 0.3, 1)`); the first render never flashes.

### Proportion Bar (signature)
A 12px fully rounded stacked bar on a Mist track, 2px gaps between segments, followed by a legend grid: swatch, label, value, percentage. Segment widths ease over 300ms. Used only where the answer genuinely decomposes (principal vs interest, take-home vs tax, macro split).

### Secondary Figures
One white bordered panel holding a definition list, not separate tiles: 12px graphite label (optionally led by a series swatch) over an 18px 600 tabular value.

### Tabs and Tables
Tabs sit in a Mist track (10px) with a white active trigger. Tables are hairline-ruled, 12px graphite headers, tabular right-aligned figures, Mist row hover.

### Charts
Recharts on white cards: horizontal hairline grid only, no axis lines, 12px graphite ticks, series strokes in full colour with opaque tint fills, a dot-swatch legend below.

## Do's and Don'ts

### Do:
- **Do** make the result figure the largest element on a calculator page (2.75rem to 3.75rem, 600, tabular).
- **Do** set every quantity in tabular figures.
- **Do** reserve cobalt for interaction, focus and the primary series; use amber only for costs.
- **Do** use opaque `-tint` tokens for chart fills, with full-strength strokes.
- **Do** mark category with pillar dots only.
- **Do** keep touch targets at 44px below md, give every input a visible label, and keep focus rings visible (3px cobalt at 50%).
- **Do** wrap every authored motion in a reduced-motion guard so values and bars render final without it.
- **Do** divide lists with hairlines rather than putting each item in a card.

### Don't:
- **Don't** use four equal stat tiles or put an export toolbar above the result.
- **Don't** place ads between inputs and results.
- **Don't** add eyebrows or kickers above headings, glows, or coloured shadows.
- **Don't** number sections or category groups; numbering is for genuine ordered steps only.
- **Don't** use raw Tailwind palette hues (blue-400, green-100 and so on); every colour comes from a token.
- **Don't** use pillar hues as fills, text or data series.
- **Don't** add a second typeface or a serif accent.
- **Don't** add load or scroll animation beyond the homepage example bars and the result flash.
