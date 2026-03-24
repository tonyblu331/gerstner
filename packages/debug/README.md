# @gerstner/debug

Dev-only observer for Gerstner.

This package does not own layout.
It reads the public foundation tokens already exposed by `@gerstner/core` and visualizes them in the browser.

## What it does in this first pass

- content-column overlay
- full-width boundary hint
- token inspector panel
- floating badge
- scope hover and Alt+click pinning
- keyboard toggles
- ResizeObserver refresh

## What it deliberately does not fake

The current phase-1 core does not expose a baseline token yet, so the debug UI shows the ruler as unavailable instead of inventing a value.

## Suggested usage

```ts
import '@gerstner/debug/debug.css'
import { initGerstnerDebug } from '@gerstner/debug'

if (import.meta.env.DEV) {
  initGerstnerDebug({
    defaultOpen: true
  })
}
```

Mark interesting scopes with:

```html
<section data-g-debug-scope data-g-debug-label="Breakout scene">
  ...
</section>
```

Then hover those scopes to inspect them. Hold `Alt` and click to pin one.
