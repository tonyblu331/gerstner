# gerstner

**Phase 2 — Honest Alignment API Freeze**

Native CSS and Tailwind v4 own the primitives. Gerstner owns the semantic contract. Stride owns the math.

## What this package owns

- Token registrations with unambiguous meanings
- Root contract defaults
- Stride math
- Shell, raw grid, subgrid, and adaptive utilities
- Rhythm and type roles with explicit measures
- Placement grammar: zones, lines, and anchors
- Presets that tune, not redefine
- Debug-facing CSS hooks such as `--g-align-mode`

## What this package does not own

- Production layout JS
- Inspector UI
- Keyboard shortcuts
- Contract export UI
- Scaffolding or file generation
- Text engines (measured copy, editorial runtime)

## What Gerstner is not

- **Not a grid plugin** — Gerstner is a CSS-first field system, not a framework extension
- **Not a preset pack** — Presets tune the contract; they don't invent new semantics
- **Not just subgrid** — Subgrid is one alignment path among several honest options
- **Not fake exactness** — We don't claim hidden lattice precision that doesn't exist

## Field types

- `g-shell` — Editorial shell with frame, content, and breakout semantics
- `g` — Raw equal-column field with no shell semantics

## Alignment honesty

| Utility               | Mode          | Promise                                                              |
| --------------------- | ------------- | -------------------------------------------------------------------- |
| `g-sub`               | `exact`       | Child participates in parent tracks exactly                          |
| `g-view-*`            | `approximate` | Local reinterpretation of the same field, not exact line inheritance |
| `g-align-independent` | `independent` | Explicit independence from parent alignment                          |

If exact inheritance is required, use `g-sub`.
If reinterpretation is desired, use `g-view-*`.
If the local field is non-harmonic, use `g-align-independent`.

`g-view-*` is never exact. It only changes the local column count.

## Authoring order

1. **Structure** — semantic containers (`g-shell`, `g`, `g-sub`)
2. **Zone** — readable boundaries (`g-content`, `g-full`, `g-breakout-l/r`)
3. **Explicit placement** — when zones aren't enough (`col-from-*`, `col-to-*`, gutter anchors)
4. **Arbitrary escape hatch** — raw `grid-column` as last resort

## Zones and placement

- `g-content` — Content zone bounds
- `g-full` — Full bleed
- `g-breakout-l` / `g-breakout-r` — Asymmetrical breakout
- `col-{N}` — Span N columns
- `col-start-{N}` / `col-end-{N}` — Raw line placement
- `col-from-{N}` / `col-to-{N}` — Readable explicit placement
- `col-from-content-start` / `col-to-content-end` — Named zone boundaries
- `col-from-gutter-*` / `col-to-gutter-*` — Readable gutter anchors

### Truth clause

`g-sub` is the exact inheritance path.
`g-view-*` is a local reinterpretation of the same field.
`g-align-independent` is the honest opt-out for non-harmonic local fields.

Subgrid is the primitive behind `g-sub`.
It is not the whole alignment story.

## Typography contract

Two concepts stay separate:

- `--g-rhythm` — **Length** for spacing
- `--g-prose` — **Unitless** prose line-height

### Type roles with role-aware measures

| Role    | Class        | Measure             | Wrap      |
| ------- | ------------ | ------------------- | --------- |
| Prose   | `.g-prose`   | `--g-measure-body`  | `pretty`  |
| Display | `.g-display` | `--g-measure-tight` | `balance` |
| Heading | `.g-heading` | `--g-measure-tight` | `balance` |
| UI      | `.g-ui`      | `--g-measure-ui`    | `wrap`    |

### Wrap helpers

- `.g-wrap-balance`
- `.g-wrap-pretty`
- `.g-wrap-normal`
- `.g-wrap-nowrap`

### Density and stacks

- `g-tight` / `g-standard` / `g-loose` — Rhythm density
- `g-stack-1` through `g-stack-6` — Vertical rhythm stacks

## File surface

- `gerstner` → Full entry
- `gerstner/layout` → Layout-only
- `gerstner/rhythm` → Rhythm-only
- `gerstner/tokens` → Tokens-only
- `gerstner/presets` → Presets-only

## Example

CSS import:

```css
@import 'gerstner';
```

HTML structure:

```html
<section class="g-shell g-editorial">
  <div class="g-content g-stack-2">
    <h1 class="g-display">Designing beyond the screen</h1>
    <p class="g-prose">Gerstner keeps layout math in CSS and keeps alignment claims honest.</p>
  </div>
</section>
```

Placement examples:

```html
<!-- Zone helper: asymmetrical breakout -->
<div class="g-breakout-l">Bleeds left to frame edge</div>

<!-- Line placement: explicit from/to -->
<div class="col-from-4 col-to-10">Spans columns 4-9</div>

<!-- Gutter anchor: starts after column 4 -->
<div class="col-from-gutter-4 col-to-content-end">From gutter-4 to content edge</div>

<!-- Named boundaries: from content start to full end -->
<div class="col-from-content-start col-to-full-end">True full-bleed breakout</div>
```

## Phase 2 freeze

### Locked forever

- `g-sub` = exact inheritance
- `g-view-*` = approximate reinterpretation only
- `g-align-independent` = explicit independence
- `g-shell` = editorial shell (not "12 equal columns")
- `g` = raw equal-column field
- Zones first, lines second, arbitrary last
- `--g-rhythm` = length, `--g-prose` = unitless
- No hidden lattice exactness claims

### Grammar complete

- `col-from-*` … `col-to-*` — numeric line placement
- `col-from-content-start`, `col-to-content-end`, `col-to-full-end` — named boundaries
- `col-from-gutter-*`, `col-to-gutter-*` — between-column authoring

### Post-Phase 2 work (not yet)

- Public split into `@gerstner/css` + `@gerstner/tw4`
- CLI expansion
- Debug feature expansion
- `@gerstner/text` package
- Measured-text engines

---

**Phase 1 made the core true. Phase 2 made the language final.**
