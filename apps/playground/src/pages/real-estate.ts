export function render(): string {
  return `
  <div class="page-re" style="padding-bottom:4rem">
    <nav class="re-nav">
      <div class="g-shell">
        <div class="g-content re-nav__content">
          <a href="#/real-estate" class="re-nav__logo">GERSTNER <span>ESTATE</span></a>
          <div class="re-nav__links">
            <a class="re-nav__link" href="#listings">Listings</a>
            <a class="re-nav__link" href="#journal">Journal</a>
            <a class="re-nav__link" href="#process">Process</a>
            <a class="re-nav__link" href="#contact">Contact</a>
          </div>
          <button class="re-nav__grid-btn">Grid</button>
        </div>
      </div>
    </nav>

    <main>
      <section class="g-shell re-hero" id="hero" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-full g-sub re-hero__grid">
          <div class="re-hero__left g-stack-3 col-from-content-start col-end-7">
            <div class="re-hero__eyebrow g-ui">Swiss Precision for Modern Living</div>
            <h1 class="g-display re-hero__h1">Homes Built on Clarity.</h1>
            <p class="g-prose re-hero__sub">We design systems, not just spaces — twelve years editing the city grid into homes of proportion, light, and enduring value.</p>
            <div class="re-hero__ctas">
              <a href="#listings" class="btn btn-primary">View Listings</a>
              <a href="#process" class="btn btn-secondary re-btn-outline">Our Process</a>
            </div>
            <div class="re-hero__stats">
              <div class="re-hero__stat"><strong>12</strong><span class="re-hero__stat-label g-ui">Years</span></div>
              <div class="re-hero__stat"><strong>340</strong><span class="re-hero__stat-label g-ui">Homes</span></div>
              <div class="re-hero__stat"><strong>4</strong><span class="re-hero__stat-label g-ui">Cities</span></div>
            </div>
          </div>
          <div class="re-hero__right col-start-7 col-to-full-end">
            <div class="re-hero__img-wrap">
              <img class="re-hero__img" src="https://picsum.photos/seed/re-hero/900/760" alt="Casa Luz exterior" />
              <div class="re-hero__price-card g-stack-1">
                <strong>$4.2M — Casa Luz</strong>
                <div class="g-ui">Palm Springs • 4BD / 4.5BA • 340m²</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="g-shell re-listings" id="listings" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-content">
          <div class="re-section-head">
            <span class="re-section-head__num g-ui">02</span>
            <hr class="re-section-head__rule" />
            <span class="re-section-head__title g-ui">Featured Listings</span>
          </div>
        </div>
        <div class="g-content">
          <div class="g re-listings__grid">
            <article class="col-7 re-card-tall">
              <img class="re-card__img" src="https://picsum.photos/seed/re-listing1/800/720" alt="Penthouse Zurich" />
              <div class="re-card__meta g-stack-1">
                <div class="re-card__location g-ui">Zurich West</div>
                <strong>CHF 2.8M</strong>
                <div class="re-card__detail g-ui">Penthouse • 3BD / 2BA • 184m² • 12/12 Floor</div>
              </div>
            </article>
            <div class="col-5 re-cards-right">
              <article class="re-card">
                <img class="re-card__img" src="https://picsum.photos/seed/re-listing2/600/360" alt="Loft Basel" />
                <div class="re-card__meta g-stack-1">
                  <div class="re-card__location g-ui">Basel</div>
                  <strong>CHF 1.95M</strong>
                  <div class="re-card__detail g-ui">Atelier Loft • 2BD / 2BA • 142m²</div>
                </div>
              </article>
              <article class="re-card">
                <img class="re-card__img" src="https://picsum.photos/seed/re-listing3/600/360" alt="Casa Luz" />
                <div class="re-card__meta g-stack-1">
                  <div class="re-card__location g-ui">Palm Springs</div>
                  <strong>$4.2M</strong>
                  <div class="re-card__detail g-ui">Casa Luz • 4BD / 4.5BA • 340m²</div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="g-shell re-editorial" id="journal" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-content">
        <div class="g re-editorial__grid">
          <div class="col-2 re-editorial__vert">
            <div class="re-editorial__vert-text g-ui">Location as System</div>
          </div>
          <div class="col-10 re-editorial__right g-stack-3">
            <p class="g-heading re-editorial__lead">We don’t sell square meters. We calibrate context — sun path, street noise, material aging. Every acquisition begins with a grid analysis: twelve parameters, one clear decision.</p>
            <img class="re-editorial__img" src="https://picsum.photos/seed/re-editorial/1200/560" alt="Interior system" />
            <blockquote class="g-display re-editorial__quote">“Design is not decoration. It is structure.”</blockquote>
          </div>
        </div>
        </div>
      </section>

      <section class="g-shell re-process" id="process" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-content">
          <div class="re-section-head">
            <span class="re-section-head__num g-ui">04</span>
            <hr class="re-section-head__rule" />
            <span class="re-section-head__title g-ui">Process</span>
          </div>
        </div>
        <div class="g-content">
        <div class="g re-process__grid">
          <div class="col-3 re-process__step g-stack-2">
            <div class="re-process__num g-display">01</div>
            <h3 class="g-heading">Measure</h3>
            <p class="g-prose">Site survey, light study, zoning constraints. We document before we dream. Data first, then desire.</p>
          </div>
          <div class="col-3 re-process__step g-stack-2">
            <div class="re-process__num g-display">02</div>
            <h3 class="g-heading">Reduce</h3>
            <p class="g-prose">Remove noise. Keep structure, proportion, and material honesty. A house is a system of decisions.</p>
          </div>
          <div class="col-3 re-process__step g-stack-2">
            <div class="re-process__num g-display">03</div>
            <h3 class="g-heading">Build</h3>
            <p class="g-prose">Swiss-engineered procurement. Fixed timelines, fixed budgets. No surprises, only tolerances.</p>
          </div>
          <div class="col-3 re-process__step g-stack-2">
            <div class="re-process__num g-display">04</div>
            <h3 class="g-heading">Live</h3>
            <p class="g-prose">Handover with manuals, not mysteries. Homes calibrated for daily use, not photography.</p>
          </div>
        </div>
        </div>
      </section>

      <section class="g-shell re-contact" id="contact" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-content">
        <div class="g re-contact__grid">
          <div class="col-7 re-contact__left g-stack-3">
            <span class="re-section-head__num g-ui">05</span>
            <h2 class="g-display">Let’s find the right proportion.</h2>
            <form class="g-stack-2">
              <div class="re-form__row">
                <input class="re-form__input" type="text" placeholder="Name" autocomplete="name" />
                <input class="re-form__input" type="email" placeholder="Email" autocomplete="email" />
              </div>
              <textarea class="re-form__textarea" rows="5" placeholder="Tell us about the house, district, or brief you have in mind."></textarea>
              <div>
                <button type="submit" class="btn btn-primary">Request Portfolio</button>
              </div>
            </form>
          </div>
          <div class="col-5 re-contact__right">
            <div class="re-contact__line" aria-hidden="true"></div>
          </div>
        </div>
        </div>
      </section>
    </main>

    <footer class="re-footer">
      <div class="g-shell">
        <div class="g-content re-footer__inner g-ui">
          <div>© 2025 GERSTNER ESTATE — ZURICH / BASEL / BERLIN / MILAN</div>
          <div>N 47°22’18” E 8°32’28” GRID 12×24</div>
        </div>
      </div>
    </footer>
  </div>
`
}
