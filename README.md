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
  stride/  → published as "gerstner"
  debug/   → published as "@gerstner/debug"
  cli/     → published as "@gerstner/cli"
  utils/   → published as "@gerstner/utils"
```

### `gerstner`

Core CSS powered by Stride engine.

### `@gerstner/debug`

Optional developer tooling for debugging layout systems.

### `@gerstner/cli`

Scaffolder for Gerstner projects and contract generation.

### `@gerstner/utils`

Utility functions for common operations.

---

## Usage

### Import the full system

```css
@import 'tailwindcss';
@import 'gerstner';
```

### Import only what you need

```css
@import 'gerstner/layout';
@import 'gerstner/rhythm';
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
