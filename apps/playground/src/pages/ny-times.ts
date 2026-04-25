const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function editorialCard(
  kicker: string,
  headline: string,
  body: string,
  byline: string,
  imgSeed?: string,
  imgAlt?: string,
): string {
  return `
    <article class="nyt-editorial__card col-2">
      ${
        imgSeed
          ? `
      <figure class="nyt-editorial__fig">
        <img class="nyt-editorial__img" src="https://picsum.photos/seed/${imgSeed}/400/240" alt="${imgAlt ?? ''}" loading="lazy" />
      </figure>`
          : ''
      }
      <p class="nyt-kicker">${kicker}</p>
      <h2 class="g-heading">${headline}</h2>
      <p class="nyt-body">${body}</p>
      <p class="g-ui nyt-byline">${byline}</p>
    </article>
  `
}

function opinionCard(author: string, headline: string): string {
  return `
    <article class="nyt-op-card">
      <div class="nyt-op-avatar"></div>
      <p class="nyt-op-author g-ui">${author}</p>
      <h4 class="g-heading">${headline}</h4>
    </article>
  `
}

function popularItem(num: number, text: string): string {
  return `
    <li class="nyt-popular__item">
      <span class="nyt-popular__num">${num}</span>
      <a href="#">${text}</a>
    </li>
  `
}

function footerCol(head: string, links: string[]): string {
  return `
    <div class="col-2 nyt-footer__col">
      <span class="nyt-footer__head">${head}</span>
      <ul class="nyt-footer__list">
        ${links.map((l) => `<li><a class="nyt-footer__link" href="#">${l}</a></li>`).join('')}
      </ul>
    </div>
  `
}

export function render(): string {
  return `
  <div class="page-nyt g-editorial" style="padding-bottom:4rem">
    <!-- ════════════════════════════════════════════════════════════
         1. UTILITY BAR — g-shell + g-content zone placement
         ════════════════════════════════════════════════════════════ -->
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

    <!-- ════════════════════════════════════════════════════════════
         2. MASTHEAD — g-sub exact alignment to parent shell tracks
         ════════════════════════════════════════════════════════════ -->
    <header class="nyt-masthead">
      <div class="g-shell">
        <div class="g-sub nyt-masthead__grid">
          <div class="nyt-masthead__left col-from-content-start col-end-4">
            <span class="nyt-date g-ui">${today}</span>
            <a href="#" class="nyt-masthead__paper">Today's Paper</a>
          </div>
          <div class="nyt-masthead__center col-start-4 col-end-11">
            <a href="#/ny-times" class="nyt-logo">The New York Times</a>
          </div>
          <div class="nyt-masthead__right col-start-11 col-to-content-end">
            <div class="nyt-ticker">
              <span class="nyt-ticker__item">DOW <strong class="nyt-ticker__up">▲0.3%</strong></span>
              <span class="nyt-ticker__item">S&amp;P <strong class="nyt-ticker__up">▲0.5%</strong></span>
              <span class="nyt-ticker__item">NASDAQ <strong class="nyt-ticker__down">▼0.1%</strong></span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ════════════════════════════════════════════════════════════
         3. SECTION NAV — g-content zone + g-breakout-l promo demo
         ════════════════════════════════════════════════════════════ -->
    <nav class="nyt-nav" aria-label="Sections">
      <div class="g-shell">
        <div class="g-breakout-l nyt-nav__promo g-ui">
          <span class="nyt-nav__promo-label">Special Report</span>
          <span class="nyt-nav__promo-text">The State of Layout Systems, 2026</span>
        </div>
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

    <main class="g-stack-3">
      <!-- ════════════════════════════════════════════════════════════
           4. LEAD EDITORIAL ROW — g-view-6 + g-sub
              3 cards reinterpreted as 6 view cols (2 view cols each)
              Responsive collapse built into stride defaults
           ════════════════════════════════════════════════════════════ -->
      <section class="g-shell nyt-main" style="--g-frame: clamp(1rem, 2vw, 1.25rem); --g-max-width: 80rem; --g-gutter: clamp(0.75rem, 1.5vw, 1rem);">
        <div class="g g-view-6 nyt-editorial__grid">
          ${editorialCard(
            'U.S. Politics',
            'In a Stunning Reversal, Grid-Based Layouts Overtake Fixed-Width Design',
            'Stride-derived column systems, once confined to specialist typography shops, have reached critical mass in mainstream publishing platforms. Publishers report 40% faster design iteration with computed grids.',
            'By <strong>Jane Mitchell</strong>',
            'nyt-lead',
            'Grid visualisation',
          )}
          ${editorialCard(
            'Design Systems',
            'Inside the Invisible Structure That Shapes Every Page You Read',
            'The column grid is among the oldest tools in publishing. What changes now is not its presence but its derivation — from an authored measurement, typed once, to a computed system that adapts to every screen.',
            'By <strong>Marcus Webb</strong> and <strong>Sarah Lindqvist</strong>',
            'nyt-center',
            'Swiss typography workshop',
          )}
          ${editorialCard(
            'Technology',
            'Container Queries Finally Live Up to the Hype',
            'The CSS feature that lets components respond to their own width — not the viewport — has reshaped component-driven design at scale. Major platforms report elimination of breakpoint tables.',
            'By <strong>Reza Farahani</strong>',
            'nyt-right',
            'Responsive design schematic',
          )}
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           5. HERO IMAGE — g-full breakout spanning shell frames
           ════════════════════════════════════════════════════════════ -->
      <section class="g-shell nyt-hero-shell">
        <figure class="g-full nyt-hero__figure">
          <img class="nyt-hero__img" src="https://picsum.photos/seed/nyt-hero/1200/500" alt="Aerial view of a modernist typography institute" loading="lazy" />
          <figcaption class="nyt-hero__caption g-ui">The Zurich Institute of Design, where Karl Gerstner's grid philosophy is taught to a new generation of digital designers. <span class="nyt-hero__credit">Photo: Gerstner Archive</span></figcaption>
        </figure>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           6. OPINION ROW — g-fit adaptive auto-fit cards
           7. MOST POPULAR — g-view-4 sidebar inside raw 12-col grid
           ════════════════════════════════════════════════════════════ -->
      <section class="g-shell nyt-second-row" style="--g-frame: clamp(1rem, 2vw, 1.25rem); --g-max-width: 80rem; --g-gutter: clamp(0.75rem, 1.5vw, 1rem);">
        <div class="g nyt-second-content">
          <div class="col-8 nyt-opinion">
            <hr class="nyt-section-rule" />
            <span class="nyt-section-label g-ui">Opinion</span>
            <div class="g-fit nyt-opinion__grid">
              ${opinionCard('Reza Farahani', 'The case for constraint in an age of infinite canvas')}
              ${opinionCard('Sarah Lindqvist', 'Typography is not decoration — it is architecture')}
              ${opinionCard('Marcus Webb', 'What the Bauhaus got right about systems thinking')}
              ${opinionCard('Elena Vasquez', 'In defence of the serif in the age of screens')}
            </div>
          </div>
          <div class="col-4 nyt-popular">
            <hr class="nyt-section-rule" />
            <span class="nyt-section-label g-ui">Most Popular</span>
            <ol class="nyt-popular__list">
              ${popularItem(1, 'The Hidden Grammar of the Page: Column Grids From Gutenberg to CSS')}
              ${popularItem(2, 'How Container Queries Changed Everything About Responsive Design')}
              ${popularItem(3, 'Variable Fonts and the End of the Weight Dropdown')}
              ${popularItem(4, 'Subgrid Support Finally Lands — Here Is Why It Matters')}
              ${popularItem(5, 'Optical Sizing in Type: The Feature You Never Knew You Were Missing')}
            </ol>
          </div>
        </div>
      </section>

      <!-- ════════════════════════════════════════════════════════════
           8. FOOTER NAV — g-sub exact 6-column alignment to shell
           ════════════════════════════════════════════════════════════ -->
      <footer class="nyt-footer">
        <div class="g-shell">
          <div class="g-sub nyt-footer__grid g-stack-2">
            <div class="nyt-footer__logo col-from-content-start col-to-content-end g-display">The New York Times</div>
            ${footerCol('News', ['Home Page', 'World', 'U.S.', 'Politics'])}
            ${footerCol('Opinion', ['Columnists', 'Editorials', 'Letters'])}
            ${footerCol('Arts', ['Books', 'Movies', 'Music'])}
            ${footerCol('Living', ['Food', 'Health', 'Travel'])}
            ${footerCol('More', ['Wirecutter', 'The Athletic', 'Cooking'])}
            ${footerCol('Subscribe', ['Home Delivery', 'Digital', 'Games'])}
          </div>
        </div>
      </footer>
    </main>
  </div>
`
}
