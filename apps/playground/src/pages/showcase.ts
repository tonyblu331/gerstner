export function render(): string {
  return `
  <main class="g-shell site-shell">
    <!-- ═══════════════════════════════════════════════════════════════
         HERO — g-full breakout with g-content + g-breakout-r
         ═══════════════════════════════════════════════════════════════ -->
    <header class="g-full g-sub hero">
      <div class="g-stack-3 hero-text" style="grid-column: content-start / col 8">
        <p class="g-ui">Layout System</p>
        <h1 class="g-display">Gerstner</h1>
        <p class="g-prose">A stride-derived grid system for the web. One contract, multiple surfaces. Column grids, rhythm, and typography — all from a single source of truth.</p>
        <div class="hero-actions">
          <a href="#fields" class="btn btn-primary">Explore Fields</a>
          <a href="#typography" class="btn btn-secondary">Typography Scale</a>
        </div>
      </div>
      <aside class="hero-visual" style="grid-column: col-8 / full-end">
        <div class="visual-grid">
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
        </div>
      </aside>
    </header>

    <!-- ═══════════════════════════════════════════════════════════════
         GRID FIELDS — g-shell, g, g-fit, g-fill, g-sub
         ═══════════════════════════════════════════════════════════════ -->
    <section id="fields" class="g-content g-stack-4">
      <div class="g-stack-2">
        <p class="g-ui">Grid Fields</p>
        <h2 class="g-heading">Five field types, one contract</h2>
        <p class="g-prose">Every field derives its geometry from the same stride tokens. Shell frames content, raw fills space, subgrid aligns exactly, and adaptive fields auto-fit or auto-fill.</p>
      </div>

      <!-- Shell field -->
      <div class="g-stack-1">
        <h3 class="g-ui">g-shell — Frame + max-width + named lines</h3>
        <div class="g-shell demo-field" style="--g-frame: 2rem; --g-max-width: 60rem;">
          <div class="g-content demo-zone">g-content</div>
        </div>
      </div>

      <!-- Raw field -->
      <div class="g-stack-1">
        <h3 class="g-ui">g — Raw field (100cqi, repeat fr)</h3>
        <div class="g demo-field">
          <div class="col-3 demo-col">3</div>
          <div class="col-3 demo-col">3</div>
          <div class="col-3 demo-col">3</div>
          <div class="col-3 demo-col">3</div>
        </div>
      </div>

      <!-- Subgrid -->
      <div class="g-stack-1">
        <h3 class="g-ui">g-sub — Subgrid (exact alignment)</h3>
        <div class="g demo-field">
          <div class="col-6 demo-col">
            <div class="g-sub demo-sub">
              <div class="col-3 demo-col-inner">sub 3</div>
              <div class="col-3 demo-col-inner">sub 3</div>
            </div>
          </div>
          <div class="col-6 demo-col">
            <div class="g-sub demo-sub">
              <div class="col-2 demo-col-inner">sub 2</div>
              <div class="col-2 demo-col-inner">sub 2</div>
              <div class="col-2 demo-col-inner">sub 2</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Adaptive: g-fit -->
      <div class="g-stack-1">
        <h3 class="g-ui">g-fit — Auto-fit adaptive</h3>
        <div class="g-fit demo-field">
          <div class="demo-col-adaptive">Card</div>
          <div class="demo-col-adaptive">Card</div>
          <div class="demo-col-adaptive">Card</div>
          <div class="demo-col-adaptive">Card</div>
          <div class="demo-col-adaptive">Card</div>
          <div class="demo-col-adaptive">Card</div>
        </div>
      </div>

      <!-- Adaptive: g-fill -->
      <div class="g-stack-1">
        <h3 class="g-ui">g-fill — Auto-fill adaptive</h3>
        <div class="g-fill demo-field">
          <div class="demo-col-adaptive">Item</div>
          <div class="demo-col-adaptive">Item</div>
          <div class="demo-col-adaptive">Item</div>
          <div class="demo-col-adaptive">Item</div>
          <div class="demo-col-adaptive">Item</div>
          <div class="demo-col-adaptive">Item</div>
          <div class="demo-col-adaptive">Item</div>
          <div class="demo-col-adaptive">Item</div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         ZONE PLACEMENT — g-content, g-full, g-breakout-l, g-breakout-r
         ═══════════════════════════════════════════════════════════════ -->
    <section class="g-full g-sub zone-section">
      <div class="g-content g-stack-2">
        <p class="g-ui">Zone Placement</p>
        <h2 class="g-heading">Named lines for content, full, and breakout</h2>
      </div>
      <div class="g-shell demo-field" style="--g-frame: 3rem; --g-max-width: 64rem;">
        <div class="g-content demo-zone zone-content">g-content</div>
        <div class="g-full demo-zone zone-full">g-full</div>
        <div class="g-breakout-l demo-zone zone-breakout-l">g-breakout-l</div>
        <div class="g-breakout-r demo-zone zone-breakout-r">g-breakout-r</div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         COLUMN SPANNING — col-1 through col-12
         ═══════════════════════════════════════════════════════════════ -->
    <section class="g-content g-stack-4">
      <div class="g-stack-2">
        <p class="g-ui">Column Helpers</p>
        <h2 class="g-heading">Span and place with col-N</h2>
      </div>
      <div class="g demo-field">
        <div class="col-12 demo-col">col-12</div>
      </div>
      <div class="g demo-field g-stack-1">
        <div class="col-6 demo-col">col-6</div>
        <div class="col-6 demo-col">col-6</div>
      </div>
      <div class="g demo-field g-stack-1">
        <div class="col-4 demo-col">col-4</div>
        <div class="col-4 demo-col">col-4</div>
        <div class="col-4 demo-col">col-4</div>
      </div>
      <div class="g demo-field g-stack-1">
        <div class="col-3 demo-col">col-3</div>
        <div class="col-3 demo-col">col-3</div>
        <div class="col-3 demo-col">col-3</div>
        <div class="col-3 demo-col">col-3</div>
      </div>
      <div class="g demo-field g-stack-1">
        <div class="col-2 demo-col">2</div>
        <div class="col-2 demo-col">2</div>
        <div class="col-2 demo-col">2</div>
        <div class="col-2 demo-col">2</div>
        <div class="col-2 demo-col">2</div>
        <div class="col-2 demo-col">2</div>
      </div>
      <div class="g demo-field g-stack-1">
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
        <div class="col-1 demo-col">1</div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         VIEW REINTERPRETATIONS — g-view-2, g-view-3, g-view-4, g-view-6
         ═══════════════════════════════════════════════════════════════ -->
    <section class="g-content g-stack-4">
      <div class="g-stack-2">
        <p class="g-ui">View Reinterpretations</p>
        <h2 class="g-heading">Divisor-grouped columns from the same stride</h2>
        <p class="g-prose">Views reinterpret the base grid into fewer columns that still align to the parent stride. Each view divides the 12-col base evenly.</p>
      </div>

      <div class="g-stack-1">
        <h3 class="g-ui">g-view-2 — 6 base cols per view col</h3>
        <div class="g g-view-2 demo-field">
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
        </div>
      </div>

      <div class="g-stack-1">
        <h3 class="g-ui">g-view-3 — 4 base cols per view col</h3>
        <div class="g g-view-3 demo-field">
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
        </div>
      </div>

      <div class="g-stack-1">
        <h3 class="g-ui">g-view-4 — 3 base cols per view col</h3>
        <div class="g g-view-4 demo-field">
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
        </div>
      </div>

      <div class="g-stack-1">
        <h3 class="g-ui">g-view-6 — 2 base cols per view col</h3>
        <div class="g g-view-6 demo-field">
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
          <div class="col-1 demo-col-view">1</div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         TYPOGRAPHY — g-display, g-heading, g-prose, g-ui + scale
         ═══════════════════════════════════════════════════════════════ -->
    <section id="typography" class="g-full g-sub type-section">
      <div class="g-content g-stack-4">
        <div class="g-stack-2">
          <p class="g-ui">Typography</p>
          <h2 class="g-heading">Scale and rhythm from stride</h2>
          <p class="g-prose">Every size is derived from <code>--g-type-base</code> multiplied by <code>--g-scale-ratio</code>. Line heights snap to the baseline grid. Measures constrain reading width.</p>
        </div>

        <div class="g g-view-2 type-scale-grid">
          <div class="col-1 type-scale-item">
            <span class="g-ui label">g-display</span>
            <p class="g-display">Display</p>
          </div>
          <div class="col-1 type-scale-item">
            <span class="g-ui label">Scale tokens</span>
            <div class="g-stack-1">
              <p style="font-size:var(--g-scale-5);line-height:1.1">Scale 5</p>
              <p style="font-size:var(--g-scale-4);line-height:1.1">Scale 4</p>
              <p style="font-size:var(--g-scale-3);line-height:1.1">Scale 3</p>
              <p style="font-size:var(--g-scale-2);line-height:1.1">Scale 2</p>
              <p style="font-size:var(--g-scale-1);line-height:1.1">Scale 1</p>
              <p style="font-size:var(--g-scale-0);line-height:1.4">Scale 0 (base)</p>
              <p style="font-size:var(--g-scale--1);line-height:1.4">Scale -1</p>
              <p style="font-size:var(--g-scale--2);line-height:1.4">Scale -2</p>
            </div>
          </div>
        </div>

        <div class="g g-view-3">
          <div class="col-1 type-preset">
            <span class="g-ui label">g-heading</span>
            <h3 class="g-heading">Heading Preset</h3>
          </div>
          <div class="col-1 type-preset">
            <span class="g-ui label">g-prose</span>
            <p class="g-prose">Prose text with measure constraint and pretty wrapping. Designed for comfortable reading at body size.</p>
          </div>
          <div class="col-1 type-preset">
            <span class="g-ui label">g-ui</span>
            <p class="g-ui">UI text — compact, single-line height, tight measure. For labels, captions, and interface chrome.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         DENSITY — g-tight, g-standard, g-loose
         ═══════════════════════════════════════════════════════════════ -->
    <section class="g-content g-stack-4">
      <div class="g-stack-2">
        <p class="g-ui">Density</p>
        <h2 class="g-heading">Rhythm multiples for spacing</h2>
        <p class="g-prose">Density tokens are rhythm multiples: tight (3x), standard (6x), loose (10x). Use them for section spacing, card padding, or component density.</p>
      </div>

      <div class="g g-view-3">
        <div class="col-1 density-card">
          <span class="g-ui label">g-tight</span>
          <div class="g-tight demo-density">
            <div class="density-bar"></div>
            <div class="density-bar"></div>
            <div class="density-bar"></div>
          </div>
          <p class="g-ui">3 × rhythm</p>
        </div>
        <div class="col-1 density-card">
          <span class="g-ui label">g-standard</span>
          <div class="g-standard demo-density">
            <div class="density-bar"></div>
            <div class="density-bar"></div>
            <div class="density-bar"></div>
          </div>
          <p class="g-ui">6 × rhythm</p>
        </div>
        <div class="col-1 density-card">
          <span class="g-ui label">g-loose</span>
          <div class="g-loose demo-density">
            <div class="density-bar"></div>
            <div class="density-bar"></div>
            <div class="density-bar"></div>
          </div>
          <p class="g-ui">10 × rhythm</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         LAYOUT PRESETS — g-editorial, g-case-study, g-marketing, g-gallery
         ═══════════════════════════════════════════════════════════════ -->
    <section class="g-content g-stack-4">
      <div class="g-stack-2">
        <p class="g-ui">Presets</p>
        <h2 class="g-heading">Opinionated token overrides</h2>
        <p class="g-prose">Presets override authored tokens for common publication types. Each one adjusts gutter, frame, scale ratio, and measure to match its content archetype.</p>
      </div>

      <div class="g g-view-4">
        <div class="col-1 preset-card">
          <div class="g-editorial g-shell demo-field" style="--g-max-width:40rem;">
            <div class="g-content demo-zone">Editorial</div>
          </div>
          <p class="g-ui">g-editorial</p>
        </div>
        <div class="col-1 preset-card">
          <div class="g-case-study g-shell demo-field" style="--g-max-width:40rem;">
            <div class="g-content demo-zone">Case Study</div>
          </div>
          <p class="g-ui">g-case-study</p>
        </div>
        <div class="col-1 preset-card">
          <div class="g-marketing g-shell demo-field" style="--g-max-width:40rem;">
            <div class="g-content demo-zone">Marketing</div>
          </div>
          <p class="g-ui">g-marketing</p>
        </div>
        <div class="col-1 preset-card">
          <div class="g-gallery g-shell demo-field" style="--g-max-width:40rem;">
            <div class="g-content demo-zone">Gallery</div>
          </div>
          <p class="g-ui">g-gallery</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         TEXT WRAP — g-wrap-balance, g-wrap-pretty, g-wrap-normal
         ═══════════════════════════════════════════════════════════════ -->
    <section class="g-content g-stack-4">
      <div class="g-stack-2">
        <p class="g-ui">Text Wrapping</p>
        <h2 class="g-heading">Wrap helpers for headings and body</h2>
      </div>
      <div class="g g-view-3">
        <div class="col-1 wrap-card">
          <span class="g-ui label">g-wrap-balance</span>
          <h3 class="g-heading g-wrap-balance">Gerstner Layout System for Modern Web Typography</h3>
        </div>
        <div class="col-1 wrap-card">
          <span class="g-ui label">g-wrap-pretty</span>
          <h3 class="g-heading g-wrap-pretty">Gerstner Layout System for Modern Web Typography</h3>
        </div>
        <div class="col-1 wrap-card">
          <span class="g-ui label">g-wrap-normal</span>
          <h3 class="g-heading g-wrap-normal">Gerstner Layout System for Modern Web Typography</h3>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         STACK SPACING — g-stack-1 through g-stack-6
         ═══════════════════════════════════════════════════════════════ -->
    <section class="g-content g-stack-4">
      <div class="g-stack-2">
        <p class="g-ui">Stack Spacing</p>
        <h2 class="g-heading">Rhythm-based vertical flow</h2>
        <p class="g-prose">Stack helpers apply <code>margin-block-start</code> to sibling elements using rhythm multiples. The <code>g-stack-N</code> class on a parent spaces its children.</p>
      </div>
      <div class="g g-view-3">
        <div class="col-1">
          <span class="g-ui label">g-stack-1</span>
          <div class="g-stack-1">
            <div class="density-bar"></div>
            <div class="density-bar"></div>
            <div class="density-bar"></div>
          </div>
        </div>
        <div class="col-1">
          <span class="g-ui label">g-stack-3</span>
          <div class="g-stack-3">
            <div class="density-bar"></div>
            <div class="density-bar"></div>
            <div class="density-bar"></div>
          </div>
        </div>
        <div class="col-1">
          <span class="g-ui label">g-stack-6</span>
          <div class="g-stack-6">
            <div class="density-bar"></div>
            <div class="density-bar"></div>
            <div class="density-bar"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════
         FOOTER
         ═══════════════════════════════════════════════════════════════ -->
    <footer class="g-full g-sub site-footer">
      <div class="g-content footer-inner">
        <p class="g-ui">Gerstner v0.2 — Stride-derived layout</p>
        <div class="footer-links">
          <a href="#" class="g-ui">Keyboard Shortcuts</a>
          <a href="#" class="g-ui">GitHub</a>
        </div>
      </div>
    </footer>
  </main>
`
}
