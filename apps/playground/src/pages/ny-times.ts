const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function render(): string {
  return `
  <div class="page-nyt" style="padding-bottom:4rem">
    <div class="nyt-utility">
      <div class="g-shell">
        <div class="g-content nyt-utility__content g-ui">
          <div class="nyt-utility__left">
            <a class="nyt-utility__link" href="#">U.S.</a>
            <a class="nyt-utility__link" href="#">International</a>
            <a class="nyt-utility__link" href="#">Canada</a>
            <a class="nyt-utility__link" href="#">Español</a>
            <a class="nyt-utility__link" href="#">中文</a>
          </div>
          <div class="nyt-utility__right">
            <a class="nyt-utility__link" href="#">Subscribe for $0.50/week</a>
            <a class="nyt-utility__link" href="#">Log In</a>
          </div>
        </div>
      </div>
    </div>

    <header class="nyt-masthead">
      <div class="g-shell">
        <div class="g-sub nyt-masthead__grid">
          <div class="nyt-masthead__left" style="grid-column: content-start / col 4;">
            <span class="nyt-date g-ui">${today}</span>
            <a href="#" class="nyt-masthead__paper">Today's Paper</a>
          </div>
          <div class="nyt-masthead__center" style="grid-column: col 4 / col 11;">
            <a href="#/ny-times" class="nyt-logo">The New York Times</a>
          </div>
          <div class="nyt-masthead__right" style="grid-column: col 11 / content-end;">
            <div class="nyt-ticker">
              <span class="nyt-ticker__item">DOW <strong class="nyt-ticker__up">▲0.3%</strong></span>
              <span class="nyt-ticker__item">S&amp;P <strong class="nyt-ticker__up">▲0.5%</strong></span>
              <span class="nyt-ticker__item">NASDAQ <strong class="nyt-ticker__down">▼0.1%</strong></span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <nav class="nyt-nav" aria-label="Sections">
      <div class="g-shell">
        <div class="g-content nyt-nav__content">
          <ul class="nyt-nav__list">
            <li><a class="nyt-nav__link" href="#">U.S.</a></li>
            <li><a class="nyt-nav__link" href="#">World</a></li>
            <li><a class="nyt-nav__link" href="#">Business</a></li>
            <li><a class="nyt-nav__link" href="#">Arts</a></li>
            <li><a class="nyt-nav__link" href="#">Lifestyle</a></li>
            <li><a class="nyt-nav__link" href="#">Opinion</a></li>
            <li><a class="nyt-nav__link" href="#">Politics</a></li>
            <li><a class="nyt-nav__link" href="#">Technology</a></li>
            <li><a class="nyt-nav__link" href="#">Science</a></li>
            <li><a class="nyt-nav__link" href="#">Health</a></li>
            <li><a class="nyt-nav__link" href="#">Sports</a></li>
            <li><a class="nyt-nav__link" href="#">Magazine</a></li>
          </ul>
        </div>
      </div>
      <hr class="nyt-nav__rule nyt-nav__rule--thick" />
      <hr class="nyt-nav__rule nyt-nav__rule--thin" />
    </nav>

    <main>
      <section class="g-shell nyt-main" style="--g-frame: clamp(1rem, 2vw, 1.25rem); --g-max-width: 80rem; --g-gutter: clamp(0.75rem, 1.5vw, 1rem);">
        <div class="g-content">
        <div class="g nyt-content">
          <div class="col-4 nyt-col nyt-col--left">
            <div class="nyt-live-block">
              <span class="nyt-live-dot"></span>
              <span class="nyt-live-label g-ui">Live</span>
            </div>
            <p class="nyt-kicker">U.S. Politics</p>
            <h2 class="g-heading">In a Stunning Reversal, Grid-Based Layouts Overtake Fixed-Width Design</h2>
            <p class="nyt-body">Stride-derived column systems, once confined to specialist typography shops, have reached critical mass in mainstream publishing platforms.</p>
            <ul class="nyt-bullets">
              <li class="nyt-bullet">Publishers report 40% faster design iteration with stride grids.</li>
              <li class="nyt-bullet">Container queries replace breakpoint tables at major outlets.</li>
              <li class="nyt-bullet">The 12-column standard holds, but its derivation has fundamentally changed.</li>
            </ul>
            <p class="g-ui">By Jane Mitchell</p>
            <hr class="nyt-divider" />
            <h3 class="g-heading">Swiss Modernism's Enduring Grip on Digital Layout</h3>
            <p class="nyt-body-sm">Karl Gerstner's 1964 <em>Designing Programmes</em> laid the philosophical groundwork for systems that are only now finding their natural habitat in CSS.</p>
            <hr class="nyt-divider" />
            <h3 class="g-heading">The Serif Refuses to Die</h3>
            <p class="nyt-body-sm">Screen resolution and hinting technology have finally caught up with what print designers always knew: serifs aid legibility at scale.</p>
          </div>

          <div class="col-5 nyt-col nyt-col--center">
            <div class="nyt-photo-header">
              <span class="nyt-photo-label g-ui">Photo: Reuters / Gerstner Archive</span>
            </div>
            <figure class="nyt-center-figure">
              <img class="nyt-center-img" src="https://picsum.photos/seed/nyt-lead/640/400" alt="Grid visualisation" />
              <figcaption class="nyt-figcaption">A modular grid system visualised as physical architecture at a Swiss type foundry, 2026.</figcaption>
            </figure>
            <div class="nyt-center-arrows">
              <button class="nyt-arrow">←</button>
              <button class="nyt-arrow">→</button>
            </div>
            <h2 class="g-heading">Inside the Invisible Structure That Shapes Every Page You Read</h2>
            <p class="nyt-body">The column grid is among the oldest tools in publishing. What changes now is not its presence but its derivation — from an authored measurement, typed once, to a computed system that adapts to every screen without human intervention.</p>
            <a class="nyt-read-more" href="#">Continue reading ›</a>
            <hr class="nyt-divider" />
            <h3 class="g-heading">Variable Fonts Deliver on the Promise of Optical Sizing</h3>
            <p class="nyt-body-sm">After a decade of theoretical advantage, variable font adoption has crossed 70% of major editorial publishers, driven by performance and design fidelity gains.</p>
          </div>

          <div class="col-3 nyt-col">
            <figure class="nyt-right-figure">
              <img class="nyt-right-img" src="https://picsum.photos/seed/nyt-right/400/260" alt="Typographers" />
              <figcaption class="nyt-figcaption">Typographers at the Zurich Institute of Design review baseline grid software, 2026.</figcaption>
            </figure>
            <p class="nyt-kicker">Design</p>
            <h3 class="g-heading">The Baseline Grid Returns as CSS Gains Subgrid Support</h3>
            <p class="nyt-body-sm">Subgrid alignment across independent components was once a dream. Now it is a single declaration — and teams at major newsrooms are rewriting layout systems to exploit it.</p>
            <hr class="nyt-divider" />
            <div class="nyt-promo g-stack-1">
              <div class="nyt-promo__label g-ui">Newsletter</div>
              <p class="nyt-body-sm">The Morning: What you need to know today.</p>
              <a class="nyt-promo__link" href="#">Sign up ›</a>
            </div>
            <hr class="nyt-divider" />
            <h3 class="g-heading">Container Queries Finally Live Up to the Hype</h3>
            <p class="nyt-body-sm">The CSS feature that lets components respond to their own width — not the viewport — has reshaped component-driven design at scale.</p>
          </div>
        </div>
        </div>
      </section>

      <section class="g-shell nyt-second-row" style="--g-frame: clamp(1rem, 2vw, 1.25rem); --g-max-width: 80rem; --g-gutter: clamp(0.75rem, 1.5vw, 1rem);">
        <div class="g-content">
        <div class="g nyt-second-content">
          <div class="col-8">
            <hr class="nyt-section-rule" />
            <span class="nyt-section-label g-ui">Opinion</span>
            <div class="g nyt-opinion__grid">
              <article class="col-3 nyt-op-card">
                <div class="nyt-op-avatar"></div>
                <p class="nyt-op-author">Reza Farahani</p>
                <h4 class="g-heading">The case for constraint in an age of infinite canvas</h4>
              </article>
              <article class="col-3 nyt-op-card">
                <div class="nyt-op-avatar"></div>
                <p class="nyt-op-author">Sarah Lindqvist</p>
                <h4 class="g-heading">Typography is not decoration — it is architecture</h4>
              </article>
              <article class="col-3 nyt-op-card">
                <div class="nyt-op-avatar"></div>
                <p class="nyt-op-author">Marcus Webb</p>
                <h4 class="g-heading">What the Bauhaus got right about systems thinking</h4>
              </article>
              <article class="col-3 nyt-op-card">
                <div class="nyt-op-avatar"></div>
                <p class="nyt-op-author">Elena Vasquez</p>
                <h4 class="g-heading">In defence of the serif in the age of screens</h4>
              </article>
            </div>
          </div>
          <div class="col-4">
            <hr class="nyt-section-rule" />
            <span class="nyt-section-label g-ui">Most Popular</span>
            <ol class="nyt-popular__list">
              <li class="nyt-popular__item"><span class="nyt-popular__num">1</span><a href="#">The Hidden Grammar of the Page: Column Grids From Gutenberg to CSS</a></li>
              <li class="nyt-popular__item"><span class="nyt-popular__num">2</span><a href="#">How Container Queries Changed Everything About Responsive Design</a></li>
              <li class="nyt-popular__item"><span class="nyt-popular__num">3</span><a href="#">Variable Fonts and the End of the Weight Dropdown</a></li>
              <li class="nyt-popular__item"><span class="nyt-popular__num">4</span><a href="#">Subgrid Support Finally Lands — Here Is Why It Matters</a></li>
              <li class="nyt-popular__item"><span class="nyt-popular__num">5</span><a href="#">Optical Sizing in Type: The Feature You Never Knew You Were Missing</a></li>
            </ol>
          </div>
        </div>
        </div>
      </section>
    </main>

    <footer class="nyt-footer">
      <div class="g-shell">
        <div class="g-content nyt-footer__inner g-stack-3">
          <div class="nyt-footer__logo">The New York Times</div>
          <div class="g nyt-footer__nav">
            <div class="col-2">
              <span class="nyt-footer__head">News</span>
              <ul class="nyt-footer__list">
                <li><a class="nyt-footer__link" href="#">Home Page</a></li>
                <li><a class="nyt-footer__link" href="#">World</a></li>
                <li><a class="nyt-footer__link" href="#">U.S.</a></li>
                <li><a class="nyt-footer__link" href="#">Politics</a></li>
              </ul>
            </div>
            <div class="col-2">
              <span class="nyt-footer__head">Opinion</span>
              <ul class="nyt-footer__list">
                <li><a class="nyt-footer__link" href="#">Columnists</a></li>
                <li><a class="nyt-footer__link" href="#">Editorials</a></li>
                <li><a class="nyt-footer__link" href="#">Letters</a></li>
              </ul>
            </div>
            <div class="col-2">
              <span class="nyt-footer__head">Arts</span>
              <ul class="nyt-footer__list">
                <li><a class="nyt-footer__link" href="#">Books</a></li>
                <li><a class="nyt-footer__link" href="#">Movies</a></li>
                <li><a class="nyt-footer__link" href="#">Music</a></li>
              </ul>
            </div>
            <div class="col-2">
              <span class="nyt-footer__head">Living</span>
              <ul class="nyt-footer__list">
                <li><a class="nyt-footer__link" href="#">Food</a></li>
                <li><a class="nyt-footer__link" href="#">Health</a></li>
                <li><a class="nyt-footer__link" href="#">Travel</a></li>
              </ul>
            </div>
            <div class="col-2">
              <span class="nyt-footer__head">More</span>
              <ul class="nyt-footer__list">
                <li><a class="nyt-footer__link" href="#">Wirecutter</a></li>
                <li><a class="nyt-footer__link" href="#">The Athletic</a></li>
                <li><a class="nyt-footer__link" href="#">Cooking</a></li>
              </ul>
            </div>
            <div class="col-2">
              <span class="nyt-footer__head">Subscribe</span>
              <ul class="nyt-footer__list">
                <li><a class="nyt-footer__link" href="#">Home Delivery</a></li>
                <li><a class="nyt-footer__link" href="#">Digital</a></li>
                <li><a class="nyt-footer__link" href="#">Games</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
`
}
