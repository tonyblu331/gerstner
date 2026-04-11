# Section Starters

Common layout patterns as starting points. Copy, paste, adapt.

---

## Basic Content Section

```html
<section class="g-shell">
  <div class="g-content">
    <h2 class="g-heading">Section Title</h2>
    <p class="g-prose">Body text with correct measure and leading.</p>
  </div>
</section>
```

---

## Two-Column Layout

```html
<section class="g-shell">
  <div class="col-8">
    <h2 class="g-heading">Main Content</h2>
    <p class="g-prose">Longer body text.</p>
  </div>
  <div class="col-4">
    <h3 class="g-ui">Sidebar</h3>
    <p class="g-prose">Secondary content.</p>
  </div>
</section>
```

---

## Editorial with Breakout

```html
<section class="g-shell g-editorial">
  <div class="g-content">
    <h1 class="g-display">Headline</h1>
    <p class="g-prose">Introduction paragraph with generous measure.</p>
  </div>
  <figure class="g-breakout-r">
    <img src="hero.jpg" alt="" />
  </figure>
</section>
```

---

## Nested Subgrid

```html
<section class="g-shell">
  <div class="col-8">
    <div class="g-sub">
      <div class="col-4">Nested A</div>
      <div class="col-4">Nested B</div>
    </div>
  </div>
  <div class="col-4">Sidebar</div>
</section>
```

---

## Card Grid

```html
<section class="g-shell">
  <div class="col-4">
    <div class="g-tight">
      <h3 class="g-ui">Card Title</h3>
      <p class="g-prose">Card description.</p>
    </div>
  </div>
  <div class="col-4">
    <div class="g-tight">
      <h3 class="g-ui">Card Title</h3>
      <p class="g-prose">Card description.</p>
    </div>
  </div>
  <div class="col-4">
    <div class="g-tight">
      <h3 class="g-ui">Card Title</h3>
      <p class="g-prose">Card description.</p>
    </div>
  </div>
</section>
```

---

## Marketing Landing

```html
<section class="g-shell g-marketing">
  <div class="g-content">
    <h1 class="g-display">Marketing Headline</h1>
    <p class="g-prose">Tighter measure for marketing copy.</p>
  </div>
</section>
```

---

## Gallery Grid

```html
<section class="g-shell g-gallery">
  <div class="col-6"><img src="1.jpg" alt="" /></div>
  <div class="col-6"><img src="2.jpg" alt="" /></div>
  <div class="col-4"><img src="3.jpg" alt="" /></div>
  <div class="col-4"><img src="4.jpg" alt="" /></div>
  <div class="col-4"><img src="5.jpg" alt="" /></div>
</section>
```

---

## With Debug Overlay

```html
<!-- Add to your dev environment only -->
<div class="g-debug-root" data-g-debug-cols="true" data-g-debug-baseline="true">
  <section class="g-shell">
    <div class="g-content">
      <h1 class="g-display">Debug Mode</h1>
      <p class="g-prose">Column stripes and baseline visible.</p>
    </div>
  </section>
</div>

<script type="module">
  import { initGerstnerDebug } from 'gerstner/debug'
  if (import.meta.env.DEV) {
    window.__GERSTNER_DEBUG__ = initGerstnerDebug({
      defaultOpen: true,
      initial: { layers: { cols: true, baseline: true, rhythm: false, zones: false, drift: false } }
    })
  }
</script>
```
