# Stride

The programmable layout engine powering Gerstner.

## Installation

```bash
npm install stride
```

## Usage

### Import the full system

```css
@import "tailwindcss";
@import "stride";
```

### Import only what you need

```css
@import "stride/layout";
@import "stride/rhythm";
```

## CSS Custom Properties

Gerstner uses CSS custom properties for configuration:

```css
:root {
  --g-cols: 12;
  --g-gutter: clamp(0.875rem, 2.2vw, 1.5rem);
  --g-frame: clamp(1rem, 5dvw, 5rem);
  --g-max-width: 90rem;
  --g-min: 16rem;
  --g-type-base: 1rem;
  --g-baseline: 0.5rem;
  --g-leading-steps: 3;
  --g-scale-ratio: 1.25;
  --g-measure: 70ch;
}
```

## Utilities

### Layout

- `.g-shell` - Main grid container
- `.g-content` - Content area
- `.g-breakout-l` - Left breakout
- `.g-breakout-r` - Right breakout
- `.g-breakout-full` - Full breakout
- `.g-sub` - Subgrid for exact inheritance

### Typography

- `.g-display` - Display text
- `.g-headline` - Headline text
- `.g-title` - Title text
- `.g-body` - Body text
- `.g-caption` - Caption text
- `.g-prose` - Prose styling with measure

### Rhythm

- `.g-rhythm` - Standard vertical rhythm
- `.g-rhythm-tight` - Tight vertical rhythm
- `.g-rhythm-loose` - Loose vertical rhythm
- `.g-stack` - Stack children with rhythm spacing
- `.g-space` - Space children horizontally

## Example

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