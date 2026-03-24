# Phase 1 — Correctness
## Revised execution spec

## Goal

Close the correctness gap in the core package so the public contract is truthful, accessible, and release-safe.

## Canonical token and utility surface

### Utilities
- `g-shell`
- `g`
- `g-sub`
- `g-fit`
- `g-fill`
- `g-content`
- `g-full`
- `g-breakout-l`
- `g-breakout-r`
- `g-prose`
- `g-display`
- `g-heading`
- `g-ui`
- `g-tight`
- `g-standard`
- `g-loose`
- `g-stack-{1..6}`
- `col-{N}`
- `col-start-{N}`
- `col-end-{N}`
- `col-offset-{N}`
- `col-from-{N}`

### Tokens
- `--g-cols`
- `--g-gutter`
- `--g-frame`
- `--g-max-width`
- `--g-min`
- `--g-type-base`
- `--g-baseline`
- `--g-leading-steps`
- `--g-scale-ratio`
- `--g-measure`
- `--g-rhythm`
- `--g-prose`

## Locked rules

### 1. No legacy `gc-*`
Release-facing core must contain zero `gc-*` or `--gc-*`.

### 2. No `minmax()` in custom properties
Grid track functions stay inline in track declarations.

### 3. Prose line-height must be unitless
Use:

```css
--g-rhythm: calc(var(--g-baseline) * var(--g-leading-steps));
--g-prose:  calc(var(--g-rhythm) / var(--g-type-base));
```

Never:

```css
.g-prose { line-height: var(--g-rhythm); }
```

### 4. Display and heading line-height must self-heal
Use:

```css
line-height: round(up, var(--g-scale-5), var(--g-baseline));
line-height: round(up, var(--g-scale-3), var(--g-baseline));
```

### 5. Core must use the layer contract
```css
@layer gerstner.tokens, gerstner.layout, gerstner.rhythm, gerstner.presets;
```

### 6. No bare `vh`
- `svh` for safe hero heights
- `dvh` for overlays only
- `lvh` for immersive post-scroll surfaces
- `cqi` inside containers where applicable

### 7. `g-shell` and `g` must stay distinct
- `g-shell` = editorial shell with frame and content boundaries
- `g` = raw equal-column grid

## Files to revise

### `packages/stride/index.css`
- canonical token registrations
- formula chain
- shell and raw grid utilities
- placement utilities
- layer structure
- typography roles

### `packages/stride/layout.css`
- shell, raw grid, subgrid, adaptive tracks
- zones and column utilities

### `packages/stride/rhythm.css`
- `--g-rhythm`
- `--g-prose`
- density tokens
- prose/display/heading/UI roles

### `apps/playground`
- shell vs raw grid scene
- typography correctness scene
- viewport correctness scene
- asymmetric `col-from-*` scene

### `tests`
- `layout.spec.ts`
- `zones.spec.ts`
- `adaptive.spec.ts`
- `rhythm.spec.ts`

## Acceptance checklist

- zero `gc-*` in shipped core
- zero `minmax(` inside custom property values
- `g-prose` uses `line-height: var(--g-prose)`
- display and heading line-height use `round()`
- all core CSS lives in the right `@layer`
- no bare `vh`
- `col-from-*` works
- `g-shell` vs `g` is documented and tested
- Chrome, Firefox, and Safari Playwright lanes pass

## Recommended commit grouping

1. `refactor(core): canonize g-* and token surface`
2. `fix(core): inline minmax and prose/display line-height`
3. `feat(core): add col-from-* and layer contract`
4. `test(core): shell raw-grid rhythm and viewport correctness`
