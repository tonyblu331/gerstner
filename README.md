# Gerstner

**Gerstner, powered by Stride.**

A type-first layout system for Tailwind v4.
One atomic unit, the **Stride**, drives every column, offset, breakout, and subgrid alignment across the layout field.

Gerstner is not a grid plugin, not a token dump, and not a JavaScript layout engine. It is a programmable system in Karl Gerstner's sense: a small set of rules that makes the right layout resolve itself. The browser does the math. CSS owns the layout. Your project owns the final contract files.

---

## Development

### Daily Commands

Vite+'s normal flow is simple and canonical:

```bash
# Install dependencies
vp install

# Run the playground
cd apps/playground && vp dev

# Check whole repo
cd ../.. && vp check

# Package the TS packages
cd packages/debug && vp pack
cd ../cli && vp pack

# Build the playground app
cd ../../apps/playground && vp build
```

### VS Code / OXC Setup

Vite+ officially recommends the Vite Plus Extension Pack for VS Code, with OXC as the formatter and fix provider.

**`.vscode/extensions.json`**

```json
{
  "recommendations": ["VoidZero.vite-plus-extension-pack"]
}
```

**`.vscode/settings.json`**

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "oxc.fmt.configPath": "./vite.config.ts",
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit"
  }
}
```

---

## Quick Start

### Install Dependencies

```bash
vp install
```

### Run Development Server

```bash
cd apps/playground && vp dev
```

### Check Code Quality

```bash
vp check
```

### Build for Production

```bash
cd apps/playground && vp build
```

---

## Packages

```text
packages/
  gerstner/  → published as "gerstner" with subpath exports
    - gerstner/css   → vanilla CSS surface
    - gerstner/tw4   → Tailwind v4 integration
    - gerstner/debug → optional dev tools
    - gerstner/text  → text utilities (future)
```

### `gerstner`

Single package with multiple entry points:

- `gerstner/css` — Vanilla CSS surface (tokens, layout, rhythm)
- `gerstner/tw4` — Tailwind v4 integration (@theme, @utility)
- `gerstner/debug` — Optional developer tooling
- `gerstner/text` — Text utilities (future)

CLI: `npx gerstner init` scaffolds projects with css/tw4 target selection.

---

## Usage

### Import the CSS surface (vanilla only)

```css
@import 'gerstner/css';
```

### Import the TW4 surface (Tailwind v4)

```css
@import 'tailwindcss';
@import 'gerstner/tw4';
@source '../node_modules/gerstner';
```

### Import only what you need

```css
@import 'gerstner/css'; /* Full CSS surface */
```

### Example HTML

```html
<section class="g-shell">
  <div class="g-content">
    <h1 class="g-display g-rhythm-bottom">Designing programmes, not margins</h1>
    <p class="g-prose g-rhythm">
      The layout derives from type. The columns derive from stride. The browser resolves the rest.
    </p>
  </div>
  <figure class="g-breakout-r">Image that pushes out to the right</figure>
</section>
```

---

## Architecture

- **Stride** is the programmable layout engine
- **Gerstner** is the complete system using Stride
- **CSS-first** configuration with custom properties
- **Type-first** approach to layout design
- **Human-readable** utility classes

---

## License

MIT
