# Gerstner

<<<<<<< HEAD
**Gerstner, powered by Stride.**

A type-first layout system for Tailwind v4.
One atomic unit, the **Stride**, drives every column, offset, breakout, and subgrid alignment across the layout field.

Gerstner is not a grid plugin, not a token dump, and not a JavaScript layout engine. It is a programmable system in Karl Gerstner’s sense: a small set of rules that makes the right layout resolve itself. The browser does the math. CSS owns the layout. Your project owns the final contract files. 

---

## What it is

Gerstner gives you a layout system that is:

- **Type-first** — the grid derives from type, not the other way around
- **CSS-native** — no production JS layout math
- **Human-readable** — names like `g-shell`, `g-content`, `g-breakout-r`, not token soup
- **Composable** — full system, layout-only, and rhythm-only entry points
- **Project-owned** — the CLI scaffolds files your team keeps and edits

The product is **Gerstner**.
The engine under it is **Stride**.
You work with Gerstner. Stride does the math underneath.

---

## What it owns

Gerstner owns:

- the type-first token contract
- the Stride layout engine
- named editorial zones
- adaptive collection grids
- vertical rhythm utilities
- exact subgrid alignment
- optional debug tooling
- a CLI that scaffolds project-owned CSS

Gerstner does **not** own:

- runtime layout logic in JavaScript
- resize observers for production layout
- canvas sync inside core
- your project-specific presets and visual language
- a config DSL that replaces CSS

---

## Packages

```text
packages/
  core/   → published as "gerstner"
  debug/  → published as "@gerstner/debug"
  cli/    → published as "@gerstner/cli"
```

### `gerstner`
Core CSS.

Exports:

```json
{
  ".": "./index.css",
  "./layout": "./layout.css",
  "./rhythm": "./rhythm.css"
}
```

Use this in production.

### `@gerstner/debug`
Optional developer tooling.

- inspector panel
- human-readable token labels
- keyboard shortcuts
- export current contract values
- `onResize` bridge for canvas and debug views

Never required for production.

### `@gerstner/cli`
Scaffolder.

- generates `gerstner.contract.css`
- generates preset CSS
- can generate a dev-only reference page
- detects likely framework and CSS entry

The generated files belong to your team.

---

## Install

```bash
npm install gerstner
npm install -D @gerstner/cli @gerstner/debug
```

Import the full system:

```css
@import "tailwindcss";
@import "gerstner";
```

Or import only what you need:

```css
@import "gerstner/layout";
@import "gerstner/rhythm";
```

Scaffold a project contract:

```bash
npx @gerstner/cli init
```

---

## Quick start

### 1. Import Gerstner

```css
@import "tailwindcss";
@import "gerstner";
@import "./styles/gerstner.contract.css";
@import "./styles/gerstner.presets.css";
```

### 2. Set your project contract

```css
:root {
  --g-cols: 12;
  --g-gutter: clamp(0.875rem, 2.2vw, 1.5rem);
  --g-frame: clamp(1rem, 5dvw, 5rem);
  --g-max-width: 90rem;
  --g-min: 16rem;
  --g-type-base: 1rem;
  --g-baseline: 0.5rem;
  --g-leading-steps: 3;
  --g-scale-ratio: 1.25;
  --g-measure: 70ch;
}
```

### 3. Use the shell

```html
<section class="g-shell">
  <div class="g-content">
    <h1 class="g-display">Designing programmes, not margins</h1>
    <p class="g-prose">
      The layout derives from type. The columns derive from stride. The browser
      resolves the rest.
    </p>
  </div>
</section>
```

### 4. Break with intention

```html
<section class="g-shell">
  <div class="g-content">Main copy</div>
  <figure class="g-breakout-r">Image that pushes out to the right</figure>
</section>
```

### 5. Use exact inheritance when alignment matters

```html
<div class="g-shell">
  <div class="g-content g-sub">
    <!-- child content inherits parent tracks exactly -->
  </div>
</div>
```

Use subgrid when edges must align exactly.
Use reinterpretation utilities when visual grouping matters more than exact shared lines.

---

## Mental model

### Type first, grid second
The body leading defines the vertical rhythm.
The rhythm defines the baseline.
The baseline helps determine the gutter.
The gutter and frame define the horizontal field.
The grid is a consequence of typography, not the starting point.

### The Stride is the atom
The **Stride** is one column unit plus one gutter.
It is the horizontal movement unit that keeps offsets, breakouts, and alignment coherent.

### Zones first
Start with named zones.
Only use explicit line placement when the composition genuinely needs it.
Only reach for arbitrary values last.

---

## The math, in plain terms

The browser derives the grid from a small set of custom properties.

```text
gap-total      = gutter × (cols − 1)
content-inline = min(max-width, available inline size − frame × 2)
col-unit-raw   = (content-inline − gap-total) ÷ cols
stride         = col-unit-raw + gutter
```

Key rule:

- **never round `col-unit-raw` for layout**

Rounded values are only for debug readouts, rulers, or canvas syncing. The layout itself should use the raw value so sub-pixel drift does not compound.

---

## Hard rules

These are not style preferences. They exist because the alternatives break.

- No `minmax()` inside a CSS variable
- No `line-height: var(--g-rhythm)` on prose
- No layout math in production JavaScript
- No bare `vh`
- `@layer` on all shipped utilities

Why:

- storing `minmax()` in a custom property causes silent grid-track failure
- prose line-height must be unitless so it scales with browser font-size changes
- browser layout engines are faster and more correct than JS loops for this job
- `vh` still causes mobile viewport bugs where `svh` or `dvh` should be used
- layered utilities keep consumer CSS in control without `!important`

---

## Browser target

Gerstner targets modern browsers with CSS Grid, subgrid, typed custom properties, and modern viewport units available. The current target in the spec is Tailwind v4 with Safari 16.4+, Chrome 111+, and Firefox 128+. 

---

## Monorepo

```text
gerstner/
  apps/
    playground/
  packages/
    core/
    debug/
    cli/
  tests/
  docs/
  dev/
```

The monorepo keeps responsibilities separate on purpose:

- **core** owns layout and rhythm in CSS
- **debug** observes and controls public tokens in dev
- **cli** scaffolds files and reference pages
- **tests** prove the contract in real browsers
- **docs** explain the reasoning and the edge cases

---

## Development

Run the playground:

```bash
vp install
cd apps/playground
vp dev
```

Check the repo:

```bash
vp check
```

Run browser tests:

```bash
npx playwright test
```

Package the TypeScript packages:

```bash
cd packages/debug && vp pack
cd ../cli && vp pack
```

---

## Release philosophy

Semver is strict.

- **patch** — bug fixes, annotation improvements, no API change
- **minor** — new utilities, presets, or setup-path options with no breakage
- **major** — token renames, utility renames, removed exports, or contract changes that require migration work

If core changes in a way that forces teams to edit `gerstner.contract.css`, that is a major version.

---

## Who this is for

Gerstner is for teams who want layout to feel like a system, not a pile of overrides.

- design engineers
- frontend engineers
- independent studios
- brand sites
- editorial systems
- product teams that care about structure
- anyone tired of “12 columns” meaning 12 different things on one page

---

## Read next

- `REPO.md` — repository structure, boundaries, ownership, and release rules
- `docs/FORMULAS.md` — full Stride derivation chain
- `docs/TYPOGRAPHY.md` — prose, display, and UI type paths
- `docs/VIEWPORT-UNITS.md` — `svh` / `dvh` / `cqi` decisions
- `docs/gerstner-full-spec.html` — full spec, ADRs, roadmap, and SOP

---

## License

MIT with attribution clause.

Use it, modify it, ship it. Attribution in published project READMEs is appreciated. Public talks, tutorials, and articles about the system should credit Gerstner.
=======
A Vite+ monorepo project.

## Getting Started

```bash
# Install dependencies
vp install

# Start development server
vp dev

# Build for production
vp build

# Run tests
vp test

# Check code quality
vp check
```
>>>>>>> f0ab5456477e2d646ebbbf2fd79be1ce26788625
