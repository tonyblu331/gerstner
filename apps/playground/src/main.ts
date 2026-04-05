import './index.css'

// Initialize debug overlay with actual CSS tokens
function initDebugOverlay() {
  const root = document.documentElement
  const computed = getComputedStyle(root)

  // Read actual token values from CSS
  const stride = computed.getPropertyValue('--g-stride').trim()
  const rhythm = computed.getPropertyValue('--g-rhythm').trim()
  const cols = parseInt(computed.getPropertyValue('--g-cols').trim()) || 12
  const gutter = computed.getPropertyValue('--g-gutter').trim()
  const baseline = computed.getPropertyValue('--g-baseline').trim()

  // Create debug root if not exists
  let debugRoot = document.querySelector('.g-debug-root') as HTMLElement
  if (!debugRoot) {
    debugRoot = document.createElement('div')
    debugRoot.className = 'g-debug-root'
    debugRoot.setAttribute('data-panel', 'false')
    debugRoot.setAttribute('data-overlay', 'false')
    debugRoot.setAttribute('data-ruler', 'false')
    debugRoot.setAttribute('data-badge', 'false')
    document.body.appendChild(debugRoot)
  }

  // Calculate column width based on shell grid
  const shell = document.querySelector('.g-shell')
  if (shell) {
    const rect = shell.getBoundingClientRect()
    const contentWidth = rect.width
    const colWidth = contentWidth / cols
    const gap = parseFloat(gutter) || 24

    debugRoot.style.setProperty('--g-debug-col-width', `${colWidth - gap}px`)
    debugRoot.style.setProperty('--g-debug-overlay-gap', `${gap}px`)
    debugRoot.style.setProperty('--g-debug-baseline', baseline || '24px')
    debugRoot.style.setProperty('--g-debug-overlay-left', `${rect.left}px`)
    debugRoot.style.setProperty('--g-debug-overlay-width', `${contentWidth}px`)
  }

  return debugRoot
}

// Grid toggle functionality using debug package
let gridVisible = false
let debugRoot: HTMLElement | null = null

function toggleGrids() {
  gridVisible = !gridVisible

  if (!debugRoot) {
    debugRoot = initDebugOverlay()
  }

  // Update debug panel visibility
  debugRoot.setAttribute('data-overlay', String(gridVisible))
  debugRoot.setAttribute('data-ruler', String(gridVisible))
  debugRoot.setAttribute('data-badge', String(gridVisible))

  // Update button state
  const toggleBtn = document.getElementById('gridToggle')
  const overlay = document.getElementById('gridOverlay')
  const statusDot = document.getElementById('gridStatusDot')
  const statusText = document.getElementById('gridStatusText')

  if (toggleBtn) {
    toggleBtn.classList.toggle('active', gridVisible)
    toggleBtn.setAttribute('aria-pressed', String(gridVisible))
  }

  if (overlay) {
    overlay.hidden = !gridVisible
  }

  if (statusDot) {
    statusDot.classList.toggle('active', gridVisible)
  }

  if (statusText) {
    statusText.textContent = gridVisible ? 'On' : 'Off'
  }
}

// Pexels API integration for random images
const PEXELS_API_KEY = 'YOUR_API_KEY' // User should replace with their own
const PEXELS_API_URL = 'https://api.pexels.com/v1'

interface PexelsPhoto {
  id: number
  url: string
  src: {
    medium: string
    large: string
  }
  alt: string
  photographer: string
}

async function fetchRandomImages(
  query: string = 'architecture',
  count: number = 5,
): Promise<PexelsPhoto[]> {
  try {
    const response = await fetch(`${PEXELS_API_URL}/search?query=${query}&per_page=${count}`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    })
    const data = await response.json()
    return data.photos || []
  } catch (error) {
    console.warn('Failed to fetch Pexels images, using fallbacks')
    return []
  }
}

// Fallback images for editorial use
const editorialImages: PexelsPhoto[] = [
  {
    id: 1,
    url: '',
    src: {
      medium:
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&w=400',
      large: '',
    },
    alt: 'Modern interior',
    photographer: 'Pexels',
  },
  {
    id: 2,
    url: '',
    src: {
      medium:
        'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&w=400',
      large: '',
    },
    alt: 'Minimalist room',
    photographer: 'Pexels',
  },
  {
    id: 3,
    url: '',
    src: {
      medium:
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&w=400',
      large: '',
    },
    alt: 'Office space',
    photographer: 'Pexels',
  },
  {
    id: 4,
    url: '',
    src: {
      medium:
        'https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&w=400',
      large: '',
    },
    alt: 'Architecture',
    photographer: 'Pexels',
  },
  {
    id: 5,
    url: '',
    src: {
      medium:
        'https://images.pexels.com/photos/1648771/pexels-photo-1648771.jpeg?auto=compress&w=400',
      large: '',
    },
    alt: 'Living room',
    photographer: 'Pexels',
  },
  {
    id: 6,
    url: '',
    src: {
      medium:
        'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&w=400',
      large: '',
    },
    alt: 'Workspace',
    photographer: 'Pexels',
  },
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="grid-controls">
    <button class="grid-toggle" id="gridToggle" title="Toggle grids (Ctrl+G)" aria-expanded="false" aria-controls="gridOverlay">
      <span class="key-hint">⌘G</span>
      <span>Toggle Grids</span>
    </button>
    
    <div class="grid-overlay-panel" id="gridOverlay" hidden>
      <div class="grid-overlay-header">
        <h3 class="grid-overlay-title">Grid Overlay</h3>
        <div class="grid-status">
          <span class="grid-status-dot" id="gridStatusDot"></span>
          <span id="gridStatusText">Off</span>
        </div>
      </div>
      <div class="grid-overlay-body">
        <div class="token-grid-mini">
          <div class="token-item">
            <span class="token-label">Cols</span>
            <code class="token-value" id="debug-cols">--</code>
          </div>
          <div class="token-item">
            <span class="token-label">Stride</span>
            <code class="token-value" id="debug-stride">--</code>
          </div>
          <div class="token-item">
            <span class="token-label">Rhythm</span>
            <code class="token-value" id="debug-rhythm">--</code>
          </div>
          <div class="token-item">
            <span class="token-label">Gutter</span>
            <code class="token-value" id="debug-gutter">--</code>
          </div>
        </div>
        <p class="grid-overlay-hint">
          Press <code>Ctrl+G</code> to toggle. Uses actual CSS tokens from <code>:root</code>.
        </p>
      </div>
    </div>
  </div>

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
      <aside class="g-breakout-r hero-art card image-card" data-testid="hero-art">
        <img src="${editorialImages[0].src.medium}" alt="${editorialImages[0].alt}" loading="eager" />
        <div class="image-card-overlay">
          <p class="scene-kicker">Design System</p>
          <ul class="bullet-list g-ui">
            <li>Exact inheritance with <code>g-sub</code></li>
            <li>Approximate reinterpretation with <code>g-view-*</code></li>
            <li>Explicit independence with <code>g-align-independent</code></li>
          </ul>
          <p class="g-ui photo-credit">Photo by ${editorialImages[0].photographer}</p>
        </div>
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
          <div class="card image-card editorial-card" data-img-index="1">
            <img src="${editorialImages[1].src.medium}" alt="${editorialImages[1].alt}" loading="lazy" />
            <div class="image-card-overlay">
              <p class="g-ui">Load</p>
              <p class="photo-credit">${editorialImages[1].photographer}</p>
            </div>
          </div>
          <div class="card image-card editorial-card" data-img-index="2">
            <img src="${editorialImages[2].src.medium}" alt="${editorialImages[2].alt}" loading="lazy" />
            <div class="image-card-overlay">
              <p class="g-ui">Latency</p>
              <p class="photo-credit">${editorialImages[2].photographer}</p>
            </div>
          </div>
          <div class="card image-card editorial-card" data-img-index="3">
            <img src="${editorialImages[3].src.medium}" alt="${editorialImages[3].alt}" loading="lazy" />
            <div class="image-card-overlay">
              <p class="g-ui">Coverage</p>
              <p class="photo-credit">${editorialImages[3].photographer}</p>
            </div>
          </div>
          <div class="card image-card editorial-card" data-img-index="4">
            <img src="${editorialImages[4].src.medium}" alt="${editorialImages[4].alt}" loading="lazy" />
            <div class="image-card-overlay">
              <p class="g-ui">Parity</p>
              <p class="photo-credit">${editorialImages[4].photographer}</p>
            </div>
          </div>
        </div>
        <div class="g-fill collection" data-testid="fill-grid">
          <div class="card image-card editorial-card" data-img-index="5">
            <img src="${editorialImages[5].src.medium}" alt="${editorialImages[5].alt}" loading="lazy" />
            <div class="image-card-overlay">
              <p class="g-ui">North</p>
              <p class="photo-credit">${editorialImages[5].photographer}</p>
            </div>
          </div>
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
        
        <!-- Exact: g-sub -->
        <article class="g-sub exact-demo col-start-3 col-8" data-testid="exact-demo">
          <p class="g-ui scene-kicker">g-sub = exact</p>
          <div class="card col-start-1 col-4">A</div>
          <div class="card alt col-start-5 col-4">B</div>
        </article>
        
        <!-- Approximate: g-view-4 -->
        <article class="g g-view-4 approx-demo col-start-3 col-8" data-testid="approx-demo">
          <p class="g-ui scene-kicker">g-view-* = approximate</p>
          <div class="card col-start-1 col-2">C</div>
          <div class="card alt col-start-3 col-2">D</div>
        </article>
        
        <!-- Independent: g-align-independent -->
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
        <!-- col-from-X col-to-Y -->
        <div class="card placement-numeric col-from-2 col-to-6" data-testid="placement-numeric">
          <p class="g-ui">col-from-2 col-to-6</p>
        </div>
        
        <!-- gutter anchor -->
        <div class="card placement-gutter col-from-gutter-6 col-to-content-end" data-testid="placement-gutter">
          <p class="g-ui">col-from-gutter-6 col-to-content-end</p>
        </div>
        
        <!-- content start to full end -->
        <div class="card placement-breakout col-from-content-start col-to-full-end" data-testid="placement-breakout">
          <p class="g-ui">col-from-content-start col-to-full-end</p>
        </div>
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

for (const node of Array.from(document.querySelectorAll<HTMLElement>('[data-token]'))) {
  const key = node.dataset.token as keyof typeof tokenMap
  node.textContent = tokenMap[key]
}

// Setup grid toggle button
document.getElementById('gridToggle')?.addEventListener('click', toggleGrids)

// Attempt to fetch real Pexels images if API key is set
if (PEXELS_API_KEY !== 'YOUR_API_KEY') {
  fetchRandomImages('architecture interior', 8).then((photos) => {
    if (photos.length > 0) {
      // Update editorial cards with fetched images
      const cards = document.querySelectorAll('.editorial-card')
      photos.slice(0, cards.length).forEach((photo, index) => {
        const card = cards[index]
        if (card) {
          const img = card.querySelector('img')
          if (img) {
            img.src = photo.src.medium
            img.alt = photo.alt
          }
          const credit = card.querySelector('.photo-credit')
          if (credit) {
            credit.textContent = photo.photographer
          }
        }
      })

      // Update overlay with actual token values
      const computed = getComputedStyle(document.documentElement)
      const colsEl = document.getElementById('debug-cols')
      const strideEl = document.getElementById('debug-stride')
      const rhythmEl = document.getElementById('debug-rhythm')
      const gutterEl = document.getElementById('debug-gutter')

      if (colsEl) colsEl.textContent = computed.getPropertyValue('--g-cols').trim() || '12'
      if (strideEl) strideEl.textContent = computed.getPropertyValue('--g-stride').trim() || '--'
      if (rhythmEl) rhythmEl.textContent = computed.getPropertyValue('--g-rhythm').trim() || '--'
      if (gutterEl) gutterEl.textContent = computed.getPropertyValue('--g-gutter').trim() || '--'
    }
  })
}
