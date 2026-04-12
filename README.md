# Gerstner

**Gerstner, powered by Stride.**

A type-first layout system for Tailwind v4.
One atomic unit, the **Stride**, drives every column, offset, breakout, and subgrid alignment across the layout field.

Gerstner is not a grid plugin, not a token dump, and not a JavaScript layout engine. It is a programmable system in Karl Gerstner's sense: a small set of rules that makes the right layout resolve itself. The browser does the math. CSS owns the layout. Your project owns the final contract files.

---

## Quick Start

### Install

```bash
npm install gerstner
```

### Vanilla CSS

```css
@import 'gerstner/css';
```

### Tailwind v4

```css
@import 'tailwindcss';
@import 'gerstner/tw4';
@source '../node_modules/gerstner';
```

### CLI Scaffolding

```bash
npx gerstner init
```

---

## Authoring Ladder

Gerstner is designed to be adopted incrementally. Each rung builds on the last:

1. **Shell** — Add `g-shell` to a section. Get a centered, responsive 12-column grid with frame margins.
2. **Columns** — Use `col-1` through `col-12` to place elements on the grid.
3. **Rhythm** — Use `g-prose`, `g-display`, `g-heading`, `g-ui` for type roles with correct leading.
4. **Subgrid** — Use `g-sub` for exact inherited alignment inside a parent grid.
5. **Breakout** — Use `g-content`, `g-breakout-r`, `g-breakout-l` for editorial compositions.
6. **Density** — Use `g-tight`, `g-standard`, `g-loose` for vertical spacing presets.
7. **Presets** — Use `.g-editorial`, `.g-marketing`, `.g-gallery` for character overrides.

You don't need all seven. Most projects need 1–4.

---

## Surfaces

| Surface     | Import            | Use When                    |
| ----------- | ----------------- | --------------------------- |
| Vanilla CSS | `gerstner/css`    | No Tailwind, any framework  |
| Tailwind v4 | `gerstner/tw4`    | Using Tailwind v4           |
| Debug       | `gerstner/debug`  | Dev-time overlay (optional) |
| Stride      | `gerstner/stride` | Raw token access only       |

---

## Architecture

### Stride Engine

**Stride** is the single source of truth for all layout geometry:

- **Canonical math**: `stride/core.ts` — pure functions, no DOM
- **Manifest**: `stride/contract.manifest.json` — generated artifact bridging TS and CSS
- **CSS runtime**: `stride/index.css` — `@property` registrations + `:root` derived tokens
- **Generated helpers**: `css/helpers.css` / `tw4/helpers.css` — emitted from manifest

### Token Flow

```
Authored tokens (--g-cols, --g-gutter, --g-baseline, ...)
    ↓
Stride derives (--g-rhythm, --g-stride, --g-scale-*, ...)
    ↓
Surfaces consume via var() — never recompute
```

### What Gerstner Is Not

- Not a JavaScript layout engine — the browser does the math
- Not a design token dump — every token has a derivation reason
- Not a grid plugin — it's a programmable system
- Not a component library — it provides layout, not UI components
- Not a Tailwind competitor — it's a Tailwind v4 extension

---

## Example

```html
<section class="g-shell">
  <div class="g-content">
    <h1 class="g-display">Designing programmes, not margins</h1>
    <p class="g-prose">
      The layout derives from type. The columns derive from stride. The browser resolves the rest.
    </p>
  </div>
</section>
```

---

## Development

```bash
vp install                  # Install dependencies
cd apps/playground && vp dev  # Run the playground
vp check                    # Format, lint, type-check
cd packages/gerstner && vp test  # Run tests
```

### Regeneration Commands

Generated artifacts must not be hand-edited. Regenerate via:

```bash
pnpm emit:manifest    # stride/contract.manifest.json
pnpm emit:helpers     # css/helpers.css
pnpm emit:tw4         # tw4/helpers.css
pnpm emit:debug       # debug/labels.json
pnpm emit:reference   # reference-fixtures/metadata.json
```

---

## License

MIT
