# @gerstner/cli

First-pass scaffolder for Gerstner.

This package does not own layout logic.
It writes the contract files that shape a project around `@gerstner/core`, and it can optionally wire the dev-only observer from `@gerstner/debug`.

## Current command surface

```bash
npx @gerstner/cli init
```

## What `init` does in this pass

- detects a CSS entry
- writes `src/styles/gerstner.contract.css`
- writes `src/styles/gerstner.project-presets.css`
- optionally writes `src/styles/gerstner.debug.css`
- optionally writes `src/scripts/gerstner.debug.js`
- optionally writes `dev/gerstner.reference.*`
- injects imports into the CSS entry
- optionally injects the debug bootstrap into a detected JS entry

## Intentional limits

- one honest command, not a fake full CLI suite
- variable-only presets, no runtime token compiler
- plain HTML reference page in every project type
- no React-only assumptions in the core generation path

## Suggested usage

```bash
pnpm gerstner init --css-entry apps/playground/src/index.css --install-debug --generate-reference
```

Or run it interactively:

```bash
pnpm gerstner init
```
