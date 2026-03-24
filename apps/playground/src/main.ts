import './index.css'
import { initGerstnerDebug } from '@gerstner/debug'

// Initialize debug tools
const debugController = initGerstnerDebug({
  defaultOpen: false,
  initial: {
    overlay: true,
    badge: true,
    ruler: false
  }
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="g-shell playground-shell g-type-body">
    <header class="g-full scene g-stack g-relaxed">
      <div class="scene-label">Gerstner / playground</div>
      <div class="g g-view-12" data-testid="scene-header-grid">
        <div class="block neutral g-span-7 g-stack" data-g-demo-surface>
          <p class="scene-label">Engine</p>
          <h1 class="g-type-display">A layout programme, not a box placer</h1>
          <p class="g-type-prose">This page exists to prove the first-pass engine in the browser before the CLI and debug layer expand.</p>
        </div>
        <div class="block alt g-span-5 g-stack" data-g-demo-surface>
          <p class="scene-label">API freeze</p>
          <p><code>g-shell</code>, <code>g</code>, zones, spans, starts, subgrid, local views, fit/fill, type roles.</p>
        </div>
      </div>
    </header>

    <section class="g-full g-shell scene" data-testid="scene-shell-vs-raw">
      <div class="g-content scene g-stack">
        <p class="scene-label">Shell vs raw grid</p>
        <h2>The shell has frame tracks. The raw grid does not.</h2>
      </div>
      <div class="g-content block neutral g-stack" data-testid="shell-content-box" data-g-demo-surface>
        <p class="scene-label">Inside g-shell</p>
        <p>Use shell zones for editorial placement, then nest raw grids for inner composition.</p>
      </div>
      <div class="g-full g g-view-12 specimen-grid" data-testid="raw-grid-box">
        <div class="block g-span-3">1</div>
        <div class="block g-span-3 alt">2</div>
        <div class="block g-span-3">3</div>
        <div class="block g-span-3 alt">4</div>
      </div>
    </section>

    <section class="g-full g-shell scene" data-testid="scene-breakout">
      <div class="g-breakout-l block neutral hero-copy" data-testid="breakout-left" data-g-demo-surface>
        <p class="scene-label">Breakout left</p>
        <h2 class="g-type-display">Copy holds the field.</h2>
        <p class="g-type-prose">The left breakout keeps the text anchored while the composition bleeds wider than the content zone.</p>
      </div>
      <div class="g-breakout-r block hero-media" data-testid="breakout-right" data-g-demo-hero data-g-demo-surface>
        <p class="scene-label">Breakout right</p>
      </div>
    </section>

    <section class="g-content scene g-stack" data-testid="scene-subgrid">
      <p class="scene-label">Subgrid inheritance</p>
      <div class="g specimen-grid" data-testid="subgrid-parent">
        <article class="block g-start-3 g-span-8 g-sub" data-testid="subgrid-child">
          <div class="block neutral g-span-4">Inherited 1</div>
          <div class="block alt g-span-4">Inherited 2</div>
        </article>
      </div>
    </section>

    <section class="g-content scene g-stack" data-testid="scene-local-views">
      <p class="scene-label">Local view reinterpretation</p>
      <div class="g-view-6" data-testid="view-6">
        <div class="block">A</div>
        <div class="block alt">B</div>
        <div class="block">C</div>
        <div class="block alt">D</div>
        <div class="block">E</div>
        <div class="block alt">F</div>
      </div>
      <div class="g-view-4" data-testid="view-4">
        <div class="block neutral">1</div>
        <div class="block">2</div>
        <div class="block neutral">3</div>
        <div class="block">4</div>
      </div>
    </section>

    <section class="g-content scene g-stack" data-testid="scene-fit-fill">
      <p class="scene-label">Adaptive fit / fill</p>
      <div class="metrics g-fit" data-testid="fit-grid">
        <div class="block">Load</div>
        <div class="block alt">Latency</div>
        <div class="block">Coverage</div>
        <div class="block alt">Parity</div>
      </div>
    </section>
  </main>
`

// Export debug controller for external access
if (typeof window !== 'undefined') {
  (window as any).gerstnerDebug = debugController
}
