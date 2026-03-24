# Gerstner phase 2 integration notes

This drop adds the first-pass `@gerstner/debug` package and wires it into the playground as a proof harness.

## Files in this bundle

- `packages/debug/package.json`
- `packages/debug/src/debug.css`
- `packages/debug/src/index.ts`
- `packages/debug/README.md`
- `apps/playground/src/index.css`
- `apps/playground/src/main.ts`
- `tests/playwright/debug.spec.ts`

## Intentional calls

- The debug package reads the public CSS tokens already exposed by `@gerstner/core`
- the overlay is optional and dev-only
- scope inspection is driven by `data-g-debug-scope`
- the current core does **not** expose `--g-baseline`, so the ruler stays honest and reports that the baseline is unavailable

## Small merge points

1. If your playground already imports workspace packages cleanly, change the relative TS import to:
   - `import { initGerstnerDebug } from '@gerstner/debug'`
2. If your playground should never ship debug styles in production, keep the import only in the dedicated dev reference app instead of the public playground.
3. If you already have a Playwright path convention, merge `debug.spec.ts` into your existing suite instead of adding a second standalone file.
