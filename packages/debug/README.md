# @gerstner/debug

Dev-only observer for Gerstner.

This package does not own layout. It reads the public contract already exposed by `gerstner` and visualizes the current scope as human labels, Stride metrics, overlay guides, and exportable contract CSS.

## What this pass aligns

- reads `--g-gutter`, `--g-frame`, `--g-content-inline`, `--g-col-unit-raw`, `--g-stride`, `--g-rhythm`, `--g-prose`
- shows exact vs approximate vs independent alignment honestly
- exports a valid `:root {}` contract block from the current scope
- keeps the baseline ruler real because Phase 1 now exposes `--g-baseline`

## Suggested usage

```ts
import '@gerstner/debug/debug.css'
import { initGerstnerDebug } from '@gerstner/debug'

if (import.meta.env.DEV) {
  initGerstnerDebug({
    defaultOpen: false,
    initial: {
      overlay: true,
      badge: true,
      ruler: false
    }
  })
}
```

Mark interesting scopes with:

```html
<section data-g-debug-scope data-g-debug-label="Scene E · breakout">
  ...
</section>
```

Hover a marked scope to inspect it. Hold Alt and click to pin it.
