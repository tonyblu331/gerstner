# Phase 3 debug + CLI reconciliation

This pack updates the early debug and CLI slices to the frozen Phase 1 and Phase 2 contract.

## Locked changes

- `--g-leading-prose` is gone from generated contract output
- `--g-prose` stays derived in core, not authored in project contract
- debug reads `--g-gutter`, `--g-frame`, `--g-content-inline`, `--g-col-unit-raw`, `--g-stride`, `--g-rhythm`, `--g-prose`
- inspector labels alignment honestly as exact inheritance, approximate view, independent, adaptive collection, shell, or raw equal grid
- reference page now covers the required A–I scene set at first pass
- CLI now imports `gerstner`, not the older package path

## Main caveat

This pass reconciles the contract and template layer. It does not prove the final workspace import paths or the real repo scripts here, because the patched repo is not mounted in this session.
