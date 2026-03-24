# Gerstner playground + Playwright reconciliation

This pack updates the playground and browser tests to the revised Phase 1 and Phase 2 contract.

## Included

- `apps/playground/src/main.ts`
- `apps/playground/src/index.css`
- `tests/playwright/layout.spec.ts`
- `tests/playwright/zones.spec.ts`
- `tests/playwright/adaptive.spec.ts`
- `tests/playwright/rhythm.spec.ts`
- `tests/playwright/subgrid.spec.ts`
- `tests/playwright/alignment.spec.ts`
- `tests/playwright/reference.spec.ts`
- `playwright.config.ts`

## Important calls

- The page uses `g-*` only. No `gc-*` aliases.
- `--g-rhythm` and `--g-prose` are treated as different kinds of token.
- Exact and approximate alignment are shown side by side on purpose.
- Safe viewport sizing uses `svh`.
- The tests prove intent with layout geometry and computed custom properties instead of screenshot-only assertions.

## Honest caveats

- Whether your actual repo runs with `vp run preview:playground` still depends on your local script names.
- Subgrid support on target browsers should be verified in the real repo lane, especially if you change the parent scene structure.
- The exact and approximate geometry tests assume the current Phase 1 and 2 core split semantics.
