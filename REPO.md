# REPO.md

Internal source of truth for the Gerstner monorepo.

This document is for contributors, maintainers, and tooling authors. The public product story lives in `README.md`. This file explains how the repo is organized, which package owns what, what is allowed to change, and what must never drift.

---

## Identity

**Product:** Gerstner  
**Engine:** Stride  
**Public package:** `gerstner` (single package with subpath exports)  
**Surfaces:** `gerstner/css`, `gerstner/tw4`, `gerstner/debug`, `gerstner/stride`

Naming rule:

- say **Gerstner** when referring to the product, repo, or install surface
- say **Stride** when referring to the layout engine and derivation math
- use **`packages/gerstner`** for the publishable library folder
- use **`packages/gerstner/src/stride/`** for the internal engine

Why:

- Gerstner is what users adopt
- Stride is the implementation engine underneath
- `core/debug/cli` is a clearer package responsibility split than product-name folders

---

## Repository structure

```text
gerstner/
│
├── apps/
│   └── playground/                   local playground / reference app
│
├── packages/
│   └── gerstner/                     published as "gerstner"
│       ├── src/
│       │   ├── css/                  CSS surface (tokens, layout, rhythm, helpers)
│       │   ├── tw4/                  Tailwind v4 surface (theme, utilities, helpers, aliases)
│       │   ├── cli/                  CLI scaffolding (npx gerstner init)
│       │   ├── debug/                Optional dev tooling (observer, panel, overlay)
│       │   ├── stride/               Layout engine (core.ts, manifest, CSS runtime)
│       │   └── reference-fixtures/    Dev reference page metadata
│       ├── package.json
│       ├── vite.config.ts            VP pack config
│       ├── tsconfig.json
│       └── README.md
│
├── tests/
│   ├── layout.spec.ts                Stride correctness
│   ├── zones.spec.ts                 named zone placement
│   ├── adaptive.spec.ts              adaptive grid behavior
│   ├── subgrid.spec.ts               alignment proofs
│   ├── rhythm.spec.ts                line-height and density proofs
│   └── fixtures/
│       └── pages/                    HTML fixtures per test
│
├── docs/
│   ├── FORMULAS.md
│   ├── TYPOGRAPHY.md
│   ├── VIEWPORT-UNITS.md
│   ├── gerstner-full-spec.html
│   ├── architecture-spec.html
│   ├── install-guide.html
│   └── spec-1.1.html
│
├── dev/
│   └── testbed.html                  manual live testbed
│
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── AGENT.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── REPO.md
├── package.json
├── tsconfig.base.json
└── vite.config.ts
```

---

## Package responsibility matrix

| Responsibility            | stride    | css/tw4               | debug     | cli       | Why                          |
| ------------------------- | --------- | --------------------- | --------- | --------- | ---------------------------- |
| Stride math               | owns      | no                    | no        | no        | Layout belongs to CSS        |
| `@property` registration  | owns      | no                    | no        | no        | Part of the runtime contract |
| Derived token formulas    | owns      | consumes via var()    | no        | no        | Single derivation source     |
| named zones and utilities | no        | owns                  | no        | no        | Public CSS API               |
| rhythm and type roles     | no        | owns                  | no        | no        | Runtime CSS behavior         |
| human-readable labels     | no        | no                    | owns      | no        | Dev ergonomics only          |
| manifest-aware observer   | no        | no                    | owns      | no        | Reads stride tokens only     |
| keyboard overlay          | no        | no                    | owns      | no        | Optional dev tool            |
| export current values     | no        | no                    | owns      | no        | Dev helper                   |
| framework detection       | no        | no                    | no        | owns      | Scaffolding concern          |
| contract CSS generation   | no        | no                    | no        | owns      | Setup concern                |
| helper generation         | no        | no                    | no        | owns      | Emitted from manifest        |
| dev reference page        | no        | no                    | optional  | owns      | Setup and teaching           |
| production layout JS      | forbidden | forbidden             | forbidden | forbidden | Breaks the system premise    |

Hard rule:

**If a feature affects actual runtime layout, it belongs in core or not at all.**

---

## Package exports map

### `gerstner`

```json
{
  "exports": {
    ".": "./dist/css/index.css",
    "./css": "./dist/css/index.css",
    "./tw4": "./dist/tw4/index.css",
    "./stride": "./dist/stride/index.css",
    "./debug": { "default": "./dist/debug/index.mjs", "types": "./dist/debug/index.d.mts" },
    "./debug/observer": { "default": "./dist/debug/observer.mjs", "types": "./dist/debug/observer.d.mts" },
    "./debug/debug.css": "./dist/debug/debug.css",
    "./debug/labels.json": "./dist/debug/labels.json"
  },
  "bin": { "gerstner": "./dist/cli/cli.mjs" }
}
```

---

## Architectural boundaries

### 1. Core is CSS-native

The Stride engine runs in the browser’s layout engine.
Core must not depend on JavaScript to resolve columns, offsets, breakouts, shell tracks, or type rhythm.

Allowed in core:

- custom properties
- `@property`
- `calc()`
- `repeat()`
- `round()`
- `min()` / `max()` / inline `minmax()`
- `subgrid`
- `@layer`
- progressive enhancement via `@supports`

Not allowed in core:

- resize observer loops for layout
- JS token recomputation for production
- canvas-specific layout logic
- framework runtime dependencies

### 2. Debug observes stride tokens only

`gerstner/debug` reads resolved stride CSS custom properties via `getComputedStyle`.
It must not introduce a second hidden layout model or parse `gridTemplateColumns`.

The observer (`debug/observer.ts`) is the only JS that reads layout metrics.
It uses stride tokens as manifest truth, never heuristic track parsing.

If the debug panel can do something the CSS package cannot express, that is a design bug.

### 3. CLI writes files, not runtime behavior

The CLI scaffolds files and injects imports.
It should not create a permanent abstraction layer between teams and their CSS.

Generated files are **owned by the team**.
The package is a scaffolder, not a prison.

---

## Core principles

### Type first, grid second

The grid derives from type.
Do not start API design from “how many columns.” Start from reading size, measure, rhythm, and layout character.

### Zones before lines

Default authoring should prefer named zones and composition utilities.
Line placement exists as an escape hatch, not the primary surface.

### Exact alignment must be honest

Use `g-sub` or the final subgrid utility for exact inherited tracks.
Do not describe re-derived local grids as exact if they drift.

### Consumer CSS must always win

Core utilities must be layered so unlayered project CSS can override them without `!important`.

---

## Hard rules

These are release-gating rules.

### No `minmax()` inside a CSS variable

Reason: silent grid-track failure.

Allowed:

```css
grid-template-columns: repeat(var(--g-cols), minmax(0, var(--g-col-unit-raw)));
```

Not allowed:

```css
--g-track: minmax(0, var(--g-col-unit-raw));
grid-template-columns: repeat(var(--g-cols), var(--g-track));
```

### No `line-height: var(--g-rhythm)` on prose

Reason: prose line-height must be a number, not a fixed length.

Allowed:

```css
line-height: var(--g-leading-prose);
```

Not allowed:

```css
line-height: var(--g-rhythm);
```

### No layout math in production JavaScript

Reason: it duplicates browser work, adds drift risk, and weakens the system boundary.

### No bare `vh`

Reason: mobile viewport bugs.
Use `svh`, `dvh`, or logical viewport units as appropriate.

### `@layer` on all shipped utilities

Reason: consumer CSS must override without `!important`.

---

## Layer stack

CSS surface must declare the full layer order.

```css
@layer stride, gerstner.tokens, gerstner.layout, gerstner.rhythm, gerstner.helpers;
```

Priority from low to high:

1. `stride` (derived tokens)
2. `gerstner.tokens` (authored defaults)
3. `gerstner.layout` (grid containers)
4. `gerstner.rhythm` (type roles)
5. `gerstner.helpers` (generated helpers)
6. unlayered consumer CSS

TW4 import order: `stride/index.css → theme → utilities → helpers → aliases`

Unlayered project CSS should always beat shipped package layers.

---

## Token and utility conventions

### Prefixes

- token prefix: `--g-`
- utility prefix: `g-`

Legacy `gc-` names are not allowed in new work.

### Human-readable labels

Every authored token must have a matching human-readable label in `debug/labels.json` (generated via `pnpm emit:debug`).

If a token exists but the debug inspector cannot explain it in plain language, the DX is incomplete.

---

## Setup paths

The CLI supports three conceptual setup paths:

### Direct

The user enters raw values.
Good for teams who already know their numbers.

### Fluid

The CLI derives sensible `clamp()` values.
Good for responsive projects that want fast setup.

### Derive

The CLI starts from typography and layout character.
Good for teams using the full Gerstner mental model.

All three paths should output project-owned CSS, not hidden JSON config.

---

## Generated consumer files

The CLI may generate files like these inside consumer projects:

```text
src/styles/gerstner.contract.css
src/styles/gerstner.debug.css
src/scripts/gerstner.debug.js
dev/gerstner.reference.html
dev/gerstner.reference.css
dev/gerstner.reference.js
```

Rules:

- production files are owned by the team
- debug files are optional
- reference files are dev-only
- the generator must not overwrite silently

---

## Browser and runtime support

Target support follows the current spec baseline:

- Tailwind v4
- Safari 16.4+
- Chrome 111+
- Firefox 128+

Progressive enhancements like `text-box` must always sit behind `@supports`.
The base contract has to work without them.

---

## Tooling

### Monorepo

Use npm workspaces.
The repo root owns task orchestration and common config.

### Vite+

Use Vite+ for workspace tasks, checks, formatting, linting, and packaging.
Do not mix in extra hook systems unless there is a real gap.

### Playground

`apps/playground` exists to test the system as a real consumer app.
It should stay lightweight and close to how external teams will actually use Gerstner.

### Browser proofs

Playwright fixtures are not decorative. They are release evidence.
If a behavior matters, it needs a fixture and an assertion.

---

## CI philosophy

CI should prove correctness without burning minutes stupidly.

### Fast lane on PRs

Run:

- install
- formatting/lint/type-check
- package build
- lightweight app build

### Browser lane on relevant changes

Run Playwright only when core, debug, cli, tests, or playground files changed.

### Compatibility lane on schedule or release branches

Use broader compatibility checks weekly or before release, not on every PR.

### Release lane on tags only

Publishing should happen on tags, not on branch pushes.

---

## Versioning

Semver is strict.

### Patch

- bug fixes
- annotation improvements
- docs clarifications
- no public API change

### Minor

- new utilities
- new setup-path options
- additive exports
- no breakage

### Major

- token renames
- utility renames
- removed exports
- changed behavior that forces contract updates
- anything that requires migration work in consumer projects

If a team must edit `gerstner.contract.css` because of a package change, assume **major** unless proven otherwise.

---

## Contribution rules

Before opening a PR:

1. read the ADR-relevant sections of `docs/gerstner-full-spec.html`
2. run the local checks
3. run Playwright when behavior changes
4. explain the why, not only the diff
5. update docs if the public contract changes

Every PR should state:

- what changed
- why it changed
- which package owns it
- which files were touched
- how it was tested
- whether it affects the public contract

---

## Definition of done

A change is not done when the code compiles.
It is done when:

- ownership is correct
- tests prove the behavior
- docs match the shipped contract
- debug labels are updated if needed
- consumer override behavior still works
- no hard rules were violated

---

## Decision defaults

When in doubt:

- prefer CSS over JS
- prefer a named utility over an arbitrary value
- prefer subgrid when exact inherited alignment matters
- prefer honest documentation over clever marketing
- prefer generated files the team owns over hidden abstractions

---

## The standard one-line answer

If someone asks what this repo is:

> Gerstner is the product. Stride is the engine. `gerstner` ships the CSS, `gerstner/debug` helps in dev, and `gerstner/cli` scaffolds the files your team keeps.
