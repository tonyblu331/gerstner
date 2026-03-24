# Gerstner phase 3 integration notes

This bundle assumes:

- the starter pack is already in place
- `packages/core` and `packages/debug` are already patched
- package-level `vite.config.ts` files are already handled in the repo

## Files in this bundle

- `packages/cli/package.json`
- `packages/cli/README.md`
- `packages/cli/src/index.ts`
- `packages/cli/src/cli.ts`
- `packages/cli/src/commands/init.ts`
- `packages/cli/src/lib/args.ts`
- `packages/cli/src/lib/fs.ts`
- `packages/cli/src/lib/prompt.ts`
- `packages/cli/src/lib/project.ts`
- `packages/cli/src/templates/contract.ts`
- `packages/cli/src/templates/presets.ts`
- `packages/cli/src/templates/debug.ts`
- `packages/cli/src/templates/reference.ts`
- `tests/node/cli-init.spec.ts`

## What this pass actually does

- ships one honest command: `init`
- writes the contract CSS file
- writes the preset CSS file
- optionally writes debug bridge files
- optionally writes a dev-only reference page
- injects CSS imports into the detected CSS entry
- injects the debug bootstrap into a detected JS entry when available

## Important calls

- the generated reference page is plain HTML on purpose
- presets are variable-only helpers, not runtime layout compilers
- the contract now writes `--g-baseline`, which also unlocks the debug ruler if your phase-2 debug package is already patched
- debug bootstrap injection is best-effort. If the repo has no detectable JS entry, the CLI leaves a note instead of guessing wrong

## Expected follow-up in your repo

1. Wire the package-level build so `packages/cli/src/cli.ts` becomes the published bin target.
2. Add the CLI package to the workspace filters and CI checks.
3. Decide whether you want `--install-debug` and `--generate-reference` to become your local team defaults.
4. Add one snapshot or fixture-based test around the generated reference HTML if you want stricter contract locking.
