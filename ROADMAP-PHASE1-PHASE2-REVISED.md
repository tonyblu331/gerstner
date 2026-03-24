# Revised roadmap — Phase 1 and Phase 2
## With shortened prose token

## Naming decision

Use:

- `--g-rhythm` for spacing length
- `--g-prose` for unitless prose line-height

Do not merge both into one token.

## Current status

### Bootstrap
Done enough to support the remaining work.

### Phase 1 — Correctness
In progress.

### Phase 2 — Honest alignment API
Mostly open.

### Phase 3 — CLI and debug
Already started, but should be revised after Phases 1 and 2 freeze.

### Phase 4 — Optional modern CSS follow-up
Not started, correctly deferred.

## Recommended next order

1. finish Phase 1
2. finish Phase 2
3. revise CLI and debug to match the frozen contract
4. then consider Phase 4

## Why this order

Because the public contract must be truthful before the scaffolder and inspector are treated as stable.

## Non-negotiables before calling v1.0 candidate

- no legacy `gc-*`
- no `minmax()` inside custom properties
- prose line-height stays unitless through `--g-prose`
- `g-sub` is the only exact alignment path
- `g-view-*` is documented as approximate
- reference page proves the alignment difference
- Playwright passes across target browsers
