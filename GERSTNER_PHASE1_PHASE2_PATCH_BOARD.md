# Gerstner — Phase 1 + Phase 2 exact patch board

This patch board assumes the current repo already contains:

- `packages/core`
- `packages/debug`
- `packages/cli`
- `apps/playground`
- `tests/playwright`
- `playwright.config.ts`

## Phase 1 — Correctness

### MODIFY `packages/core/index.css`

Turn this into the package entry only.

Required shape:

- declare canonical layer order:
  - `@layer gerstner.tokens, gerstner.layout, gerstner.rhythm, gerstner.presets;`
- import the split files in order:
  - `@import './tokens.css';`
  - `@import './layout.css';`
  - `@import './rhythm.css';`
  - `@import './presets.css';`
- remove all legacy `gc-*` aliases
- remove `--g-leading-prose`
- remove silent 24-lattice framing from release-facing comments

### CREATE `packages/core/tokens.css`

Own typed registrations and formula chain.

Add:

- `@property` for:
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
- `:root` defaults for those tokens
- formula chain:
  - `--g-rhythm: calc(var(--g-baseline) * var(--g-leading-steps));`
  - `--g-prose: calc(var(--g-rhythm) / var(--g-type-base));`
  - authoritative column math via `--g-col-unit-raw`
- no `minmax()` inside any custom property
- no bare `vh`

### CREATE `packages/core/layout.css`

Own layout primitives and placement.

Add or rewrite:

- `.g-shell`
- `.g`
- `.g-sub`
- `.g-fit`
- `.g-fill`
- `.g-content`
- `.g-full`
- `.g-breakout-l`
- `.g-breakout-r`
- `col-{N}`
- `col-start-{N}`
- `col-end-{N}`
- `col-offset-{N}`
- `col-from-{N}`
- keep all track functions inline in `grid-template-columns`
- make `g-shell` and `g` semantically distinct

### CREATE `packages/core/rhythm.css`

Own type roles and spacing rhythm.

Add or rewrite:

- `.g-prose { line-height: var(--g-prose); }`
- `.g-display`
- `.g-heading`
- `.g-ui`
- `.g-tight`
- `.g-standard`
- `.g-loose`
- `.g-stack-1` through `.g-stack-6`
- display and heading line-height with `round(up, ..., var(--g-baseline))`
- prose stays unitless

### CREATE `packages/core/presets.css`

Keep preset classes variable-only.

Add:

- preset classes that only set tokens
- no structural layout logic in presets

### MODIFY `packages/core/package.json`

Make package exports match the split CSS surface.

Add or confirm:

- `exports["."]` points to `./index.css`
- any package metadata still describes CSS-only core

### MODIFY `packages/core/README.md`

Rewrite usage and contract language.

Must state:

- canonical prefix is `g-`
- no `gc-*`
- `g-shell` vs `g`
- `g-prose` token naming
- `g-sub` exactness is Phase 2 language and should be introduced carefully

### MODIFY `apps/playground/src/index.css`

Keep playground honest to the spec.

Change:

- import the updated core entry
- remove any bare `vh`
- use `svh` for safe hero/min-height scenes
- use container-based sizing where relevant
- add styles for explicit scene labels: exact / approximate / independent

### MODIFY `apps/playground/src/main.ts`

Replace the demo page with the required proof scenes.

Required scenes for Phase 1:

- shell vs raw grid
- typography correctness
- viewport correctness
- asymmetrical `col-from-*`

The typography scene should show:

- prose role
- display role
- heading role
- UI role

### DELETE `tests/playwright/core-layout.spec.ts`

Split this monolith into focused specs.

### CREATE `tests/playwright/layout.spec.ts`

Cover:

- `g-shell` vs `g`
- shell frame boundaries
- raw grid equal tracks

### CREATE `tests/playwright/zones.spec.ts`

Cover:

- `g-content`
- `g-full`
- `g-breakout-l`
- `g-breakout-r`
- `col-from-*`

### CREATE `tests/playwright/adaptive.spec.ts`

Cover:

- `g-fit`
- `g-fill`
- no editorial placement mixed into adaptive collections

### CREATE `tests/playwright/rhythm.spec.ts`

Cover:

- `g-prose` line-height is unitless
- display and heading use rounded baseline snapping
- UI role does not inherit prose behavior

### MODIFY `playwright.config.ts`

Raise the lane to the spec target.

Change:

- keep `testDir: './tests/playwright'`
- add projects for:
  - Chromium
  - Firefox
  - WebKit
- keep the playground preview webServer

## Phase 2 — Honest alignment API

### MODIFY `packages/core/layout.css`

Add the explicit alignment model.

Add:

- `.g-view-2`
- `.g-view-3`
- `.g-view-4`
- `.g-view-6`
- `.g-view-8`
- `.g-view-12`
- `.g-align-independent`

Rules:

- `g-sub` is the only exact inheritance path
- `g-view-*` is local reinterpretation only
- do not reintroduce hidden lattice exactness

### MODIFY `packages/core/README.md`

Lock the public docs language.

Required wording:

- `g-sub` = exact
- `g-view-*` = approximate reinterpretation
- `g-align-independent` = explicit independence

### MODIFY `apps/playground/src/main.ts`

Add the required Phase 2 scenes.

Required scenes:

- exact subgrid inheritance
- aligned reinterpretation views
- independent local view
- asymmetrical breakout with `col-from-*`

Each scene must visibly label the mode.

### MODIFY `apps/playground/src/index.css`

Add scene-level styling for the Phase 2 proof page.

Add:

- exact badge styles
- approximate badge styles
- independent badge styles
- any rulers/labels needed to make the proof obvious

### CREATE `tests/playwright/subgrid.spec.ts`

Cover:

- `g-sub` drift is zero

### CREATE `tests/playwright/alignment.spec.ts`

Cover:

- `g-view-*` renders as local reinterpretation
- labels say approximate, not exact
- `g-align-independent` remains independent

### CREATE `tests/playwright/reference.spec.ts`

Cover:

- required scenes render
- labels are present
- exact / approximate / independent are all visible on the reference page

## Phase 1 + 2 follow-up touch points

### MODIFY `packages/debug/src/index.ts`

Do not change behavior yet, only rename inspector labels if needed.

Change later once Phase 1 and 2 are frozen:

- show “Rhythm” for `--g-rhythm`
- show “Prose line height” for `--g-prose`
- show alignment mode labels that match the frozen contract

### MODIFY `packages/debug/src/debug.css`

Only if the reference page styling or badge wording needs to match the new labels.

### MODIFY `packages/cli/src/templates/contract.ts`

After Phase 1 freeze:

- emit `--g-prose`
- stop emitting `--g-leading-prose`
- keep `--g-rhythm` as length

### MODIFY `packages/cli/src/templates/reference.ts`

After Phase 2 freeze:

- generate the exact / approximate / independent proof scenes
- use the canonical wording

## Suggested commit order

1. `refactor(core): split entry into tokens layout rhythm presets`
2. `fix(core): canonize g-* and rename prose token to --g-prose`
3. `feat(core): add col-from-* and tighten shell/raw-grid correctness`
4. `test(core): split layout zones adaptive rhythm playwright coverage`
5. `feat(core): add honest alignment API with g-view-* and g-align-independent`
6. `docs(core): lock exact approximate independent wording`
7. `test(core): add subgrid alignment and reference coverage`
8. `chore(debug-cli): reconcile inspector and generator token names`

## Done when

Phase 1 is done when:

- zero `gc-*` remains in shipped core
- zero `minmax(` appears inside custom property values
- `g-prose` uses `line-height: var(--g-prose)`
- display and heading line-height snap with `round()`
- `col-from-*` is present and tested
- Chrome, Firefox, and WebKit pass

Phase 2 is done when:

- all `g-view-*` utilities exist
- `g-align-independent` exists
- docs explicitly distinguish exact vs approximate vs independent
- the playground proves the difference
- tests enforce the wording and behavior
