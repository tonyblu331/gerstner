import './index.css'
import 'gerstner/debug/debug.css'
import { initGerstnerDebug } from 'gerstner/debug'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="g-shell site-shell" data-testid="reference-root">
    <header class="g-full hero-band scene surface">
      <div class="g-content g-stack-2 hero-copy">
        <p class="scene-kicker">Gerstner Layout System</p>
        <h1 class="g-display">Semantic Grid Architecture</h1>
        <p class="g-prose">
          A CSS-first field system that keeps alignment claims honest. 
          Native CSS owns the primitives. Gerstner owns the semantic contract.
        </p>
      </div>
      <aside class="g-breakout-r hero-art card" data-testid="hero-art">
        <p class="g-ui scene-kicker">Design System</p>
        <ul class="bullet-list g-ui">
          <li>Exact inheritance with <code>g-sub</code></li>
          <li>Approximate reinterpretation with <code>g-view-*</code></li>
          <li>Explicit independence with <code>g-align-independent</code></li>
        </ul>
      </aside>
    </header>

    <section class="g-full section-shell scene" data-testid="scene-shell-vs-raw">
      <div class="g-content scene-copy g-stack-1">
        <p class="scene-kicker">Shell vs Raw Grid</p>
        <h2 class="g-heading">The shell owns frame and content zones. The raw grid is just equal columns.</h2>
      </div>

      <div class="g-content card" data-testid="shell-card">
        <p class="scene-kicker">Inside <code>g-shell</code></p>
        <p class="g-prose">This card sits in the content zone. It should be narrower than the full band below it.</p>
      </div>

      <div class="g-full g raw-band" data-testid="raw-band">
        <div class="card col-3">1</div>
        <div class="card alt col-3">2</div>
        <div class="card col-3">3</div>
        <div class="card alt col-3">4</div>
      </div>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-rhythm">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Foundation & Typography</p>
        <h2 class="g-heading">Rhythm is a length. Prose is unitless. Display self-heals to the baseline.</h2>
      </div>

      <div class="card type-board g-stack-3">
        <div>
          <p class="g-ui meta-row">UI text uses a tight utility path for controls and labels.</p>
          <h3 class="g-display" data-testid="display-sample">Stride follows the field</h3>
          <h4 class="g-heading" data-testid="heading-sample">The shell and the raw grid are different promises</h4>
          <p class="g-prose" data-testid="prose-sample">
            Prose must stay readable and scale with user preferences. That is why the prose token is a unitless
            line-height derived from typed arithmetic instead of a fixed length. Rhythm spacing remains a length token
            because spacing and reading are not the same concern.
          </p>
        </div>
        <div class="token-readout g g-view-4" data-testid="token-readout">
          <div class="token-chip col-2"><span>rhythm</span><strong data-token="rhythm"></strong></div>
          <div class="token-chip col-2"><span>prose</span><strong data-token="prose"></strong></div>
          <div class="token-chip col-2"><span>baseline</span><strong data-token="baseline"></strong></div>
          <div class="token-chip col-2"><span>stride</span><strong data-token="stride"></strong></div>
        </div>
      </div>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-viewport">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Viewport Policy</p>
        <h2 class="g-heading">Safe hero sizing uses <code>svh</code>. No bare <code>vh</code>.</h2>
      </div>
      <div class="card viewport-safe" data-testid="viewport-safe">
        <p class="scene-kicker">safe surface</p>
        <p class="g-prose">This scene uses a safe viewport minimum so browser UI changes do not yank the layout around.</p>
      </div>
    </section>

    <section class="g-full section-shell scene" data-testid="scene-zones">
      <div class="g-content scene-copy g-stack-1">
        <p class="scene-kicker">Asymmetrical Placement</p>
        <h2 class="g-heading">Breakout and <code>col-from-*</code> are first-class APIs, not escape hatches.</h2>
      </div>
      <div class="g-breakout-l card tinted" data-testid="breakout-left">
        <p class="scene-kicker">breakout left</p>
      </div>
      <div class="card from-band col-from-4" data-testid="from-band">
        <p class="scene-kicker">col-from-4</p>
      </div>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-exact">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Exact Subgrid Inheritance</p>
        <h2 class="g-heading">Use <code>g-sub</code> when the child must inherit parent lines exactly.</h2>
      </div>
      <div class="g exact-parent" data-testid="exact-parent">
        <div class="marker col-start-3 col-1" data-testid="marker-3">3</div>
        <div class="marker col-start-7 col-1" data-testid="marker-7">7</div>
        <article class="g-sub exact-child col-start-3 col-8" data-testid="exact-child">
          <div class="card exact-a col-start-1 col-4" data-testid="exact-a">Exact A</div>
          <div class="card alt exact-b col-start-5 col-4" data-testid="exact-b">Exact B</div>
        </article>
      </div>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-approximate">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Aligned Reinterpretation</p>
        <h2 class="g-heading">Use <code>g-view-*</code> when the zone is reinterpreted locally. It is approximate on purpose.</h2>
      </div>
      <div class="g approx-parent" data-testid="approx-parent">
        <div class="marker col-start-3 col-1" data-testid="approx-marker-3">3</div>
        <div class="marker col-start-7 col-1" data-testid="approx-marker-7">7</div>
        <article class="g g-view-6 approx-child col-start-3 col-8" data-testid="approx-child">
          <div class="card approx-a col-start-1 col-2" data-testid="approx-a">Approx A</div>
          <div class="card alt approx-b col-start-3 col-2" data-testid="approx-b">Approx B</div>
          <div class="card approx-c col-start-5 col-2">Approx C</div>
        </article>
      </div>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-independent">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Independent Local View</p>
        <h2 class="g-heading">Some sections should resolve on their own terms. That is what independence means.</h2>
      </div>
      <article class="g g-view-4 g-align-independent independent-grid card" data-testid="independent-grid">
        <div class="mini-card col-2">One</div>
        <div class="mini-card col-2">Two</div>
        <div class="mini-card col-2">Three</div>
        <div class="mini-card col-2">Four</div>
      </article>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-adaptive">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Adaptive Collections</p>
        <h2 class="g-heading">Fit expands. Fill preserves slots.</h2>
      </div>
      <div class="g-stack-2 adaptive-board">
        <div class="g-fit collection" data-testid="fit-grid">
          <div class="card col-4">Load</div>
          <div class="card alt col-4">Latency</div>
          <div class="card col-4">Coverage</div>
          <div class="card alt col-4">Parity</div>
        </div>
        <div class="g-fill collection" data-testid="fill-grid">
          <div class="card">North</div>
          <div class="card alt">South</div>
          <div class="card">East</div>
          <div class="card alt">West</div>
        </div>
      </div>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-scope-overrides">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Scope Overrides</p>
        <h2 class="g-heading">Local sections can override the token contract without changing the global field.</h2>
      </div>
      <div class="scope-grid g override-scope" data-testid="override-scope">
        <div class="mini-card col-3">A</div>
        <div class="mini-card col-3">B</div>
      </div>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-honesty-comparison">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Alignment Honesty</p>
        <h2 class="g-heading">Exact inheritance, approximate reinterpretation, and explicit independence are three different promises.</h2>
      </div>
      
      <div class="g honesty-parent" data-testid="honesty-parent">
        <div class="marker col-start-3 col-1" data-testid="honesty-marker-3">3</div>
        <div class="marker col-start-7 col-1" data-testid="honesty-marker-7">7</div>
        
        <article class="g-sub exact-demo col-start-3 col-8" data-testid="exact-demo">
          <p class="g-ui scene-kicker">g-sub = exact</p>
          <div class="card col-start-1 col-4">A</div>
          <div class="card alt col-start-5 col-4">B</div>
        </article>
        
        <article class="g g-view-4 approx-demo col-start-3 col-8" data-testid="approx-demo">
          <p class="g-ui scene-kicker">g-view-* = approximate</p>
          <div class="card col-start-1 col-2">C</div>
          <div class="card alt col-start-3 col-2">D</div>
        </article>
        
        <article class="g g-view-4 g-align-independent independent-demo col-start-3 col-8" data-testid="independent-demo">
          <p class="g-ui scene-kicker">g-align-independent = explicit</p>
          <div class="mini-card col-2">E</div>
          <div class="mini-card col-2">F</div>
        </article>
      </div>
    </section>

    <section class="g-content scene g-stack-2" data-testid="scene-col-to-grammar">
      <div class="scene-copy g-stack-1">
        <p class="scene-kicker">Placement Grammar</p>
        <h2 class="g-heading">Readable placement: from, to, and named boundaries.</h2>
      </div>
      
      <div class="g placement-parent" data-testid="placement-parent">
        <div class="card placement-numeric col-from-2 col-to-6" data-testid="placement-numeric">
          <p class="g-ui">col-from-2 col-to-6</p>
        </div>
        
        <div class="card placement-gutter col-from-gutter-6 col-to-content-end" data-testid="placement-gutter">
          <p class="g-ui">col-from-gutter-6 col-to-content-end</p>
        </div>
        
        <div class="card placement-breakout col-from-content-start col-to-full-end" data-testid="placement-breakout">
          <p class="g-ui">col-from-content-start col-to-full-end</p>
        </div>
      </div>
    </section>
  </main>
`

// Populate token readout values
const rootStyle = getComputedStyle(document.documentElement)

const tokenMap: Record<string, string> = {
  rhythm: rootStyle.getPropertyValue('--g-rhythm').trim(),
  prose: rootStyle.getPropertyValue('--g-prose').trim(),
  baseline: rootStyle.getPropertyValue('--g-baseline').trim(),
  stride: rootStyle.getPropertyValue('--g-stride').trim(),
}

for (const node of Array.from(document.querySelectorAll<HTMLElement>('[data-token]'))) {
  const key = node.dataset.token as keyof typeof tokenMap
  node.textContent = tokenMap[key]
}

// Initialize debug overlay after DOM is populated so syncLayers finds grid elements
initGerstnerDebug({
  defaultOpen: false,
  initial: {
    preset: 'grid',
  },
})
