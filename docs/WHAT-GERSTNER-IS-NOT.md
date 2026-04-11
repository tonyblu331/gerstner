# What Gerstner Is Not

Understanding what Gerstner is NOT is as important as understanding what it is. Each "not" exists for a reason.

---

## Not a JavaScript Layout Engine

Gerstner does not compute column widths, offsets, or rhythm values in JavaScript at runtime. The browser's CSS engine does the math. JavaScript is only used for:

- **Debug tooling** (optional, dev-only)
- **CLI scaffolding** (build-time, not runtime)
- **Observer** (reads resolved CSS values, never computes them)

If you find yourself writing JS to calculate layout values that CSS already handles, you're working against the system.

---

## Not a Design Token Dump

Every token in Gerstner has a derivation reason. There are no decorative tokens, no "just in case" variables, and no tokens that exist because someone thought they might be useful someday.

- **Authored tokens** are inputs the user controls (cols, gutter, baseline, scale-ratio, measure-*)
- **Derived tokens** are computed from authored inputs (rhythm, stride, scale-*, density-*)
- **No orphan tokens** — if a token can't be traced back to an authored input or a derivation formula, it doesn't belong

---

## Not a Grid Plugin

Gerstner is not `css-grid-helpers` or `bootstrap-grid`. It doesn't just give you `col-1` through `col-12` and call it a day.

The grid is a consequence of type. The Stride unit (column + gutter) derives from baseline, leading steps, and the user's contract. Column placement is one rung on the authoring ladder, not the whole system.

---

## Not a Component Library

Gerstner provides layout primitives, not UI components. There are no buttons, cards, modals, or navigation bars here.

What Gerstner provides:
- Grid containers (`g-shell`, `g`, `g-sub`, `g-fit`, `g-fill`)
- Column placement (`col-1` through `col-12`)
- Type roles (`g-prose`, `g-display`, `g-heading`, `g-ui`)
- Density presets (`g-tight`, `g-standard`, `g-loose`)
- Breakout helpers (`g-content`, `g-breakout-r`, `g-breakout-l`)

What Gerstner does NOT provide:
- Component styling
- Color systems
- Animation libraries
- State management
- Framework integrations beyond CSS imports

---

## Not a Tailwind Competitor

Gerstner is a Tailwind v4 extension, not a competitor. It uses Tailwind's `@theme` and `@utility` at-rules. It doesn't replace Tailwind — it adds a principled layout system on top of it.

If you're not using Tailwind, use the `gerstner/css` surface instead. Same tokens, same layout, no Tailwind required.

---

## Not a Responsive Framework

Gerstner grids are inherently responsive through CSS `clamp()` and viewport-relative values. But it doesn't provide breakpoint systems, responsive utilities, or mobile-first patterns.

The responsiveness comes from the tokens themselves (`--g-gutter: clamp(0.875rem, 2.2vw, 1.5rem)`), not from media query classes.

---

## Not a Replacement for Understanding Layout

Gerstner makes principled layout easier, not automatic. You still need to understand:

- How CSS Grid works
- What `subgrid` does and when to use it
- Why `line-height` as a length is wrong for prose
- How `@layer` affects cascade priority

If you use Gerstner without understanding these fundamentals, you'll fight the system instead of working with it.

---

## The Positive Definition

Gerstner IS:

- A **programmable layout system** in Karl Gerstner's sense
- A **type-first** approach where grid derives from typography
- A **CSS-native** engine where the browser does the math
- A **single-derivation** architecture where Stride owns all formulas
- A **progressive adoption** system via the authoring ladder

The constraints aren't limitations. They're the system.
