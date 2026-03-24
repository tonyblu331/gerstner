# Phase 2 — Honest alignment API
## Revised execution spec

## Goal

Ship the alignment model without pretending reinterpretation is exact.

## Canonical alignment modes

### 1. Exact inheritance
Use:

- `g-sub`

Meaning:
- inherits parent tracks exactly
- zero drift
- the only exact cross-section alignment path in v1.0

### 2. Approximate reinterpretation
Use:

- `g-view-2`
- `g-view-3`
- `g-view-4`
- `g-view-6`
- `g-view-8`
- `g-view-12`

Meaning:
- reinterpret the current content zone as an N-column local field
- does **not** promise pixel-perfect alignment to the parent grid lines

### 3. Explicit independence
Use:

- `g-align-independent`

Meaning:
- this section is not trying to preserve harmonic alignment with the page field
- allowed for product grids, pricing blocks, dashboards, and dense utility layouts

## Public docs language to lock

Use this exact hierarchy:

- `g-sub` = exact
- `g-view-*` = approximate reinterpretation
- `g-align-independent` = explicit independence

Do not imply that reduced-column views are secretly exact.
Do not reintroduce the hidden 24-lattice as a silent default.

## Implementation surface

### Core utilities
```css
@utility g-view-2  { --g-cols: 2; }
@utility g-view-3  { --g-cols: 3; }
@utility g-view-4  { --g-cols: 4; }
@utility g-view-6  { --g-cols: 6; }
@utility g-view-8  { --g-cols: 8; }
@utility g-view-12 { --g-cols: 12; }

@utility g-align-independent {
  /* semantic marker class */
}
```

### Required docs note

Every `g-view-*` example must state that it re-reads the same zone with a different local count.
It is not sold as “still exactly aligned.”

## Reference page scenes required for Phase 2

1. exact subgrid inheritance
2. aligned reinterpretation views
3. independent local view
4. asymmetrical breakout with `col-from-*`

Each scene should include a short label that states which mode the user is seeing.

## Tests required

### `subgrid.spec.ts`
- prove `g-sub` drift is zero

### `alignment.spec.ts`
- prove `g-view-*` resolves as local reinterpretation
- prove docs labels say approximate, not exact
- prove `g-align-independent` remains independent

### `reference.spec.ts`
- prove required scenes render and labels are present

## Acceptance checklist

- all `g-view-*` utilities exist
- `g-align-independent` exists
- docs language clearly distinguishes exact vs approximate
- reference page has exact, approximate, and independent scenes
- tests enforce that no reinterpretation path is described as zero-drift
- hidden lattice mode remains out of v1.0 core

## Recommended commit grouping

1. `feat(core): add g-view-* local reinterpretation utilities`
2. `feat(core): add g-align-independent semantic path`
3. `docs(core): lock exact vs approximate alignment language`
4. `test(core): add alignment and reference scenes coverage`
