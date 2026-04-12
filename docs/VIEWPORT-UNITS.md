# Viewport Units

Mobile viewport units beyond `vh`. Baseline 2023 across all Gerstner target browsers.

## The problem with `vh`

`100vh` on iOS Safari includes the space occupied by the address bar at rest — taller than the actual visible area on page load. Never use `vh` for hero `min-height` or full-screen layouts. Use `svh`.

## Unit reference

| Unit            | Meaning                                             | Stable?                      | Use for                                           |
| --------------- | --------------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| `vw` / `vh`     | Viewport width / height (layout viewport)           | `vw` yes · `vh` buggy iOS    | Width-based fluid values only                     |
| `svw` / `svh`   | Small — UI maximally expanded (address bar visible) | ✓                            | Hero `min-block-size`, safe above-fold content    |
| `lvw` / `lvh`   | Large — UI fully retracted (scroll away chrome)     | ✓                            | Scroll-driven immersive scenes                    |
| `dvw` / `dvh`   | Dynamic — updates as chrome shows/hides             | `dvw` safe · `dvh` can shift | `dvw` for fluid margins · `dvh` for overlays only |
| `vmin` / `vmax` | Smaller / larger of `vw` and `vh`                   | ✓                            | Fluid type on square-ish viewports                |
| `cqi` / `cqb`   | Container query inline / block size                 | ✓                            | Preferred inside any container                    |
| `%`             | Relative to parent                                  | ✓                            | Widths inside known-width parents                 |
