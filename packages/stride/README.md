# @gerstner/core

First-pass CSS engine for Gerstner.

What this package owns:

- layout tokens
- `@property` registrations
- shell and raw grid primitives
- breakout and zone utilities
- nested grid helpers
- type and rhythm roles

What this package does not own:

- overlays
- live inspectors
- keyboard toggles
- canvas sync
- scaffolding or file generation

## Public API in this pass

Canonical classes:

- `g-shell`
- `g`
- `g-content`
- `g-full`
- `g-breakout-l`
- `g-breakout-r`
- `g-sub`
- `g-view-{2|3|4|6|8|12}`
- `g-fit`
- `g-fill`
- `g-span-{1..12}`
- `g-start-{1..12}`
- `g-type-body`
- `g-type-prose`
- `g-type-display`
- `g-stack`, `g-dense`, `g-relaxed`

Legacy aliases are included for now with the `gc-` prefix.

## Current limits

This is a first implementation slice, not the final engine.

The big intentional limit is aligned local views: the API is stable now, but the fully generalized hidden 24-lattice mapping is not fully compiled yet. Nested reinterpretation is present and useful, but it is not pretending to be the final compiler-grade alignment model.
