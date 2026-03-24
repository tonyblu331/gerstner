import './index.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="g-shell site-shell" data-testid="reference-root">
    <header class="g-full hero-band scene surface">
      <div class="g-content g-stack-2 hero-copy">
        <p class="scene-kicker">Gerstner v1.0</p>
        <h1 class="g-display">Phase 1 and 2 proof board</h1>
        <p class="g-prose">
          This playground proves the frozen contract in the browser. The shell is not the raw grid.
          Exact alignment is not reinterpretation. Independence is explicit.
        </p>
      </div>
      <aside class="g-breakout-r hero-art card">
        <p class="scene-kicker">Contract</p>
        <ul class="bullet-list g-ui">
          <li><code>--g-rhythm</code> stays length based</li>
          <li><code>--g-prose</code> stays unitless</li>
          <li><code>g-sub</code> is exact</li>
          <li><code>g-view-*</code> is approximate</li>
          <li><code>g-align-independent</code> is explicit</li>
        </ul>
      </aside>
    </header>

    <section class="g-full section-shell scene" data-testid="scene-shell-vs-raw">
      <div class="g-content scene-copy g-stack-1">
        <p class="scene-kicker">1 · shell vs raw grid</p>
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
        <p class="scene-kicker">2 · foundation and typography</p>
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
        <p class="scene-kicker">3 · viewport policy</p>
        <h2 class="g-heading">Safe hero sizing uses <code>svh</code>. No bare <code>vh</code>.</h2>
      </div>
      <div class="card viewport-safe" data-testid="viewport-safe">
        <p class="scene-kicker">safe surface</p>
        <p class="g-prose">This scene uses a safe viewport minimum so browser UI changes do not yank the layout around.</p>
      </div>
    </section>

    <section class="g-full section-shell scene" data-testid="scene-zones">
      <div class="g-content scene-copy g-stack-1">
        <p class="scene-kicker">4 · asymmetrical placement</p>
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
        <p class="scene-kicker">5 · exact subgrid inheritance</p>
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
        <p class="scene-kicker">6 · aligned reinterpretation</p>
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
        <p class="scene-kicker">7 · independent local view</p>
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
        <p class="scene-kicker">8 · adaptive collections</p>
        <h2 class="g-heading">Fit expands. Fill preserves slots.</h2>
      </div>
      <div class="g-stack-2 adaptive-board">
        <div class="g-fit collection" data-testid="fit-grid">
          <div class="card">Load</div>
          <div class="card alt">Latency</div>
          <div class="card">Coverage</div>
          <div class="card alt">Parity</div>
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
        <p class="scene-kicker">9 · scope overrides</p>
        <h2 class="g-heading">Local sections can override the token contract without changing the global field.</h2>
      </div>
      <div class="scope-grid g override-scope" data-testid="override-scope">
        <div class="mini-card col-3">A</div>
        <div class="mini-card col-3">B</div>
      </div>
    </section>
  </main>
`

const rootStyle = getComputedStyle(document.documentElement)

const tokenMap: Record<string, string> = {
  rhythm: rootStyle.getPropertyValue('--g-rhythm').trim(),
  prose: rootStyle.getPropertyValue('--g-prose').trim(),
  baseline: rootStyle.getPropertyValue('--g-baseline').trim(),
  stride: rootStyle.getPropertyValue('--g-stride').trim(),
}

for (const node of document.querySelectorAll<HTMLElement>('[data-token]')) {
  const key = node.dataset.token as keyof typeof tokenMap
  node.textContent = tokenMap[key]
}
