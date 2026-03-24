# Gerstner phase 1 integration notes

This bundle assumes the repo starter pack already exists and package-level `tsdown.config.ts` files are present.

## Files in this bundle

- `packages/stride/package.json` (published as "gerstner")
- `packages/stride/index.css`
- `packages/stride/layout.css`
- `packages/stride/rhythm.css`
- `packages/stride/README.md`
- `apps/playground/src/style.css`
- `apps/playground/src/main.ts`
- `apps/playground/vite.config.ts` (uses @tailwindcss/vite plugin)

## Expected follow-up in your repo

1. Add or confirm a preview task for the playground, for example `preview:playground`.
2. Make sure `@playwright/test` is installed in the root dev dependencies.
3. If your existing root scripts use a different filter syntax for Vite+, update the `webServer.command` in `playwright.config.ts` to match your repo.
4. If the repo already has a `playwright.config.ts`, merge the new bits instead of replacing it.
5. Add Playwright tests for core layout functionality in `tests/playwright/`.

## Intentional calls

- `g-*` is canonical.
- `gc-*` remains as a compatibility alias for the earlier spec language.
- The engine is CSS-only (Stride).
- The hidden lattice is represented at the token and API level, but the full generalized compiler mapping is still a follow-up.
- TypeScript packages use `tsdown` for building instead of `vp pack`.
- Tailwind v4 uses Vite plugin, not PostCSS route.
- Node 22 is baseline CI, Node 24 is weekly compatibility check.

## Current structure

```
packages/
  stride/     → published as "gerstner" (CSS engine)
  debug/      → published as "@gerstner/debug" (dev tools)
  cli/        → published as "@gerstner/cli" (scaffolder)
  utils/      → published as "@gerstner/utils" (utilities)

apps/
  playground/ → development demo with Tailwind v4 + Vite plugin
```
