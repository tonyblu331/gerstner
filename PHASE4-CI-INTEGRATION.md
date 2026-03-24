# Phase 4 — Fixture tests and CI wiring

This drop hardens `@gerstner/cli` in three ways:

1. It fills the missing internal source files from phase 3 so the package can actually build.
2. It adds fixture-driven tests that prove `gerstner init` against both a React-style app root and a vanilla Vite app.
3. It wires a narrow CI lane around the CLI instead of pretending the whole repo is stable already.

## Files in this drop

- `packages/cli/src/index.ts`
- `packages/cli/src/lib/*`
- `packages/cli/tsconfig.json`
- `tests/node/helpers/fixture.ts`
- `tests/node/cli-init.spec.ts`
- `tests/node/cli-init-fixtures.spec.ts`
- `tests/fixtures/react-vite/*`
- `tests/fixtures/vanilla-vite/*`
- `workspace.package.scripts.json`
- `.github/workflows/ci.yml`
- `.github/workflows/cli-nightly.yml`

## What to merge manually

### Root package.json

Merge the contents of `workspace.package.scripts.json` into the root `package.json` `scripts` block.

### Dev dependencies

The root workspace needs `vitest` and `typescript` available to run the CLI lane.

### TS base config

`packages/cli/tsconfig.json` assumes the repo already has `tsconfig.base.json` at the root.

## Why this shape

- The CLI is still the scaffolder, not the runtime.
- Fixture tests are cheaper and more honest than pretending end-to-end app installs are stable already.
- The workflow stays narrow: install, build CLI, typecheck CLI, run fixture tests, upload artifacts.

## Next clean move after this

- add a `gerstner doctor` command to explain missing CSS or JS entry detection
- add snapshot coverage for generated contract and reference files
- add a release workflow only once the package is no longer private
