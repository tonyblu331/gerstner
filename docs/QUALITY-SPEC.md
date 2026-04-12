# Gerstner quality spec

North star: one Stride contract, CSS-owned layout, optional debug that observes resolved tokens—not a second layout engine. Surfaces `gerstner/css` and `gerstner/tw4` share the same shell track model and line naming.

## Jobs to be done

| Job                       | Outcome                                                                       |
| ------------------------- | ----------------------------------------------------------------------------- |
| **Adopt layout**          | Shell + columns + rhythm without fighting the grid.                           |
| **Trust the contract**    | `--g-cols`, frame, gutter updates fields, demos, and overlays consistently.   |
| **Debug alignment**       | Column stripes, baseline, rhythm match visible geometry and the scoped shell. |
| **Learn from playground** | Routes demonstrate the authoring ladder without squished or broken layouts.   |
| **Ship TW4 or vanilla**   | No hidden differences in line names, gap model, or column math.               |

## User stories (acceptance)

1. On Tailwind v4, `.g-shell` + `.col-6` matches `--g-stride` and the column overlay.
2. `.col-start-*` / `.col-end-*` work on **both** `gerstner/css` and `gerstner/tw4`.
3. Changing `--g-cols` via DialKit stays coherent with a `repeat(var(--g-cols), …)` shell (no fixed 12-track template).
4. Playground routes respect frame, max-width, and breakout; no double gutters.
5. Baseline/rhythm overlays use the hovered/pinned shell’s tokens; each `.g-shell` gets its own column overlay geometry.
6. Hash navigation without full reload re-syncs debug overlays and style observers.

## Definition of done (release gate)

- TW4 and vanilla `.g-shell` use the same **gap-only** content columns: `repeat(var(--g-cols), [col] minmax(0, var(--g-col-unit-raw)))`.
- `col-start-*` / `col-end-*` resolve via nth `col` lines on both surfaces.
- Debug `readMetrics` matches that geometry; `.g-debug-root` carries resolved `--g-baseline` / `--g-rhythm` when scoped.
- Parity tests assert the shell repeat pattern; Playwright smoke covers debug root attributes, column overlay injection, and hash navigation.

## Verification

- Unit: `cd packages/gerstner && vp test` (includes `parity`, `generator`, `fixture`).
- E2E: `npx playwright test tests/playwright/debug-panel.spec.ts tests/playwright/playground-grid.spec.ts` (see [playwright.config.ts](../playwright.config.ts); preview uses `--host localhost`).
