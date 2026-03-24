# gerstner

Core CSS package for Gerstner.

## What this package owns

- token registrations
- root contract defaults
- Stride math
- shell, raw grid, subgrid, and adaptive utilities
- placement utilities
- rhythm and type roles
- presets
- debug-facing CSS hooks such as `--g-align-mode`

## What this package does not own

- production layout JS
- inspector UI
- keyboard shortcuts
- contract export UI
- scaffolding or file generation

## Canonical public contract

The public prefix is `g-`.

There are no `gc-*` aliases in the release-facing surface.

### Layout containers

- `g-shell` is the editorial shell with frame and content boundaries
- `g` is the raw equal-column grid with no shell semantics
- `g-sub` is the exact inheritance path
- `g-fit` and `g-fill` are adaptive collection grids

### Zones and placement

- `g-content`
- `g-full`
- `g-breakout-l`
- `g-breakout-r`
- `col-{N}`
- `col-full`
- `col-start-{N}`
- `col-end-{N}`
- `col-offset-{N}`
- `col-from-{N}`

### Alignment honesty

- `g-sub` = exact inheritance
- `g-view-*` = approximate reinterpretation
- `g-align-independent` = explicit independence

`g-view-*` utilities only change the local column count. They do not promise exact parent line alignment.

## Typography contract

Two different concepts stay separate:

- `--g-rhythm` is a **length** used for spacing
- `--g-prose` is a **unitless number** used for prose line-height

This keeps prose accessible and keeps spacing math honest.

### Type roles

- `g-prose`
- `g-display`
- `g-heading`
- `g-ui`

### Density and stacks

- `g-tight`
- `g-standard`
- `g-loose`
- `g-stack-1` through `g-stack-6`

## File surface

- `gerstner` → full entry
- `gerstner/layout` → layout-only surface
- `gerstner/rhythm` → rhythm-only surface

## Example

```css
@import 'gerstner';
```

```html
<section class="g-shell g-editorial">
  <div class="g-content g-stack-2">
    <h1 class="g-display">Designing beyond the screen</h1>
    <p class="g-prose">
      Gerstner keeps layout math in CSS and keeps alignment claims honest.
    </p>
  </div>
</section>
```

## Notes for Phase 1 and Phase 2

This split matches the revised production contract for correctness and honest alignment:

- no `minmax()` hidden in custom properties
- no prose line-height from a length token
- no bare `vh` in core
- no hidden lattice exactness in v1.0
