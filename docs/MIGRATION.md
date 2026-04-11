# Migration Guide

## From pre-Stride Gerstner to Stride Architecture

The Stride architecture introduces a single derivation engine. If you used Gerstner before Stride, here's what changed and how to migrate.

---

## Token Changes

### `--g-measure` → `--g-measure-body`, `--g-measure-tight`, `--g-measure-ui`

The singular `--g-measure` token has been demoted. It was always ambiguous (which measure?). Three explicit authored tokens replace it:

| Old | New | Default |
|-----|-----|---------|
| `--g-measure` | `--g-measure-body` | `70ch` |
| _(none)_ | `--g-measure-tight` | `45ch` |
| _(none)_ | `--g-measure-ui` | `35ch` |

**Action:** Search your CSS for `--g-measure` (without a suffix). Replace with the appropriate measure token.

### Derived tokens are now computed by Stride

These tokens used to be recomputed in multiple places. Now they are derived once in `stride/index.css :root`:

- `--g-rhythm`
- `--g-prose`
- `--g-stride`
- `--g-col-unit-raw`
- `--g-col-unit`
- `--g-scale-*` (--2 through 5)
- `--g-density-*` (tight, standard, loose)

**Action:** Remove any inline `calc()` that re-derives these values. Use `var(--g-rhythm)` etc. instead.

### `@property` registrations moved to Stride

All `@property` declarations now live in `stride/index.css`. They were previously in `css/tokens.css`.

**Action:** If you imported `gerstner/css` before, you still get `@property` registrations. No change needed. If you imported individual CSS files, ensure `stride/index.css` loads first.

---

## Import Changes

### Vanilla CSS — no change

```css
@import 'gerstner/css';
```

This still works. Internally it now imports `stride/index.css` first.

### Tailwind v4 — import order matters

```css
@import 'tailwindcss';
@import 'gerstner/tw4';
@source '../node_modules/gerstner';
```

The TW4 surface now imports `stride/index.css` before `theme.css`. This ensures `var()` references in `@theme` resolve correctly.

### Stride-only import — new

```css
@import 'gerstner/stride';
```

Use this if you only need the token runtime without layout utilities.

---

## Debug Changes

### `debug/drift.ts` → `debug/observer.ts`

The heuristic drift detection (parsing `gridTemplateColumns`) has been replaced by manifest-aware observation.

| Old | New |
|-----|-----|
| `debug/drift.ts` | `debug/observer.ts` |
| Heuristic track parsing | Reads stride tokens via `getComputedStyle` |
| `detectDrift()` parsed grid tracks | `detectDrift()` reads `--g-stride`, `--g-gutter` |

**Action:** If you imported from `debug/drift.ts`, change to `debug/observer.ts`. The API surface is compatible.

### Debug panel config

Old:
```js
initGerstnerDebug({
  initial: { overlay: true, badge: true, ruler: false }
})
```

New:
```js
initGerstnerDebug({
  initial: {
    layers: { cols: true, baseline: true, rhythm: false, zones: false, drift: false }
  }
})
```

---

## CLI Changes

### Contract template includes measure tokens

The `gerstner init` command now generates a contract with `--g-measure-body`, `--g-measure-tight`, `--g-measure-ui` instead of the singular `--g-measure`.

---

## Generated Artifacts

Never hand-edit these files. Regenerate via:

```bash
pnpm emit:manifest    # stride/contract.manifest.json
pnpm emit:helpers     # css/helpers.css
pnpm emit:tw4         # tw4/helpers.css
pnpm emit:debug       # debug/labels.json
pnpm emit:reference   # reference-fixtures/metadata.json
```

---

## Breaking Changes Summary

| Change | Impact | Migration |
|--------|--------|-----------|
| `--g-measure` demoted | CSS references break | Replace with `--g-measure-body/tight/ui` |
| Inline derived recalcs removed | TW4 theme, CSS tokens | Use `var()` from stride |
| `debug/drift.ts` deleted | JS imports break | Use `debug/observer.ts` |
| Debug panel config shape | `initGerstnerDebug()` calls | Use `layers` object |
