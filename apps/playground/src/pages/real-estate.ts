export function render(): string {
  return `
  <div class="page-re">
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
            <div class="re-hero__ctas g-stack-2">
              <a href="#listings" class="btn btn-primary">View Listings</a>
              <a href="#process" class="btn btn-secondary re-btn-outline">Our Process</a>
            </div>
            <div class="g g-view-3 re-hero__stats">
              <div class="col-1 re-hero__stat">
                <strong class="g-heading">12</strong>
                <span class="re-hero__stat-label g-ui">Years</span>
              </div>
              <div class="col-1 re-hero__stat">
                <strong class="g-heading">340</strong>
                <span class="re-hero__stat-label g-ui">Homes</span>
              </div>
              <div class="col-1 re-hero__stat">
                <strong class="g-heading">4</strong>
                <span class="re-hero__stat-label g-ui">Cities</span>
              </div>
            </div>
          </div>
          <div class="re-hero__right col-start-7 col-to-full-end">
            <div class="re-hero__img-wrap">
              <img class="re-hero__img" src="https://picsum.photos/seed/re-hero/900/760" alt="Casa Luz exterior" />
              <div class="re-hero__price-card g-stack-1 g-tight">
                <strong class="g-heading">$4.2M — Casa Luz</strong>
                <div class="g-ui">Palm Springs &bull; 4BD / 4.5BA &bull; 340m&sup2;</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="g-shell re-listings" id="listings" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-content g-stack-2">
          <div class="re-section-head">
            <span class="re-section-head__num g-ui">02</span>
            <hr class="re-section-head__rule" />
            <span class="re-section-head__title g-ui">Featured Listings</span>
          </div>
        </div>
        <div class="g-content">
          <div class="g re-listings__grid">
            <article class="col-7 re-card-tall">
              <div class="re-card__img-wrap">
                <img class="re-card__img" src="https://picsum.photos/seed/re-listing1/800/720" alt="Penthouse Zurich" />
                <span class="re-card__badge g-ui">New</span>
                <button class="re-card__fav" aria-label="Save">&#9825;</button>
              </div>
              <div class="re-card__meta g-sub g-stack-1 g-tight">
                <div class="re-card__location g-ui">Zurich West</div>
                <strong class="g-heading">CHF 2.8M</strong>
                <div class="re-card__detail g-ui">Penthouse &bull; 3BD / 2BA &bull; 184m&sup2; &bull; 12/12 Floor</div>
              </div>
            </article>
            <div class="col-5 re-cards-right g-sub g-stack-1">
              <article class="re-card">
                <div class="re-card__img-wrap">
                  <img class="re-card__img" src="https://picsum.photos/seed/re-listing2/600/360" alt="Loft Basel" />
                  <span class="re-card__badge g-ui">New</span>
                </div>
                <div class="re-card__meta g-sub g-stack-1 g-tight">
                  <div class="re-card__location g-ui">Basel</div>
                  <strong class="g-heading">CHF 1.95M</strong>
                  <div class="re-card__detail g-ui">Atelier Loft &bull; 2BD / 2BA &bull; 142m&sup2;</div>
                </div>
              </article>
              <article class="re-card">
                <div class="re-card__img-wrap">
                  <img class="re-card__img" src="https://picsum.photos/seed/re-listing3/600/360" alt="Casa Luz" />
                </div>
                <div class="re-card__meta g-sub g-stack-1 g-tight">
                  <div class="re-card__location g-ui">Palm Springs</div>
                  <strong class="g-heading">$4.2M</strong>
                  <div class="re-card__detail g-ui">Casa Luz &bull; 4BD / 4.5BA &bull; 340m&sup2;</div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="g-shell re-editorial" id="journal" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-full g-sub re-editorial__grid">
          <div class="col-2 re-editorial__vert">
            <div class="re-editorial__vert-text g-ui">Location as System</div>
          </div>
          <div class="col-10 g-stack-3">
            <p class="g-heading re-editorial__lead g-wrap-balance">We don't sell square meters. We calibrate context — sun path, street noise, material aging. Every acquisition begins with a grid analysis: twelve parameters, one clear decision.</p>
          </div>
        </div>
        <div class="g-full re-editorial__img-wrap">
          <img class="re-editorial__img" src="https://picsum.photos/seed/re-editorial/1200/560" alt="Interior system" />
        </div>
        <div class="g-content">
          <blockquote class="g-display re-editorial__quote g-wrap-balance">"Design is not decoration. It is structure."</blockquote>
        </div>
      </section>

      <section class="g-shell re-gallery" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-content g-stack-2">
          <div class="re-section-head">
            <span class="re-section-head__num g-ui">03</span>
            <hr class="re-section-head__rule" />
            <span class="re-section-head__title g-ui">Neighborhoods</span>
          </div>
        </div>
        <div class="g-content">
          <div class="g-fill re-gallery__grid">
            <figure class="re-gallery__item">
              <img src="https://picsum.photos/seed/re-n1/400/300" alt="Zurich West" />
              <figcaption class="re-gallery__caption g-ui">Zurich West</figcaption>
            </figure>
            <figure class="re-gallery__item">
              <img src="https://picsum.photos/seed/re-n2/400/300" alt="Basel Old Town" />
              <figcaption class="re-gallery__caption g-ui">Basel Old Town</figcaption>
            </figure>
            <figure class="re-gallery__item">
              <img src="https://picsum.photos/seed/re-n3/400/300" alt="Palm Springs" />
              <figcaption class="re-gallery__caption g-ui">Palm Springs</figcaption>
            </figure>
            <figure class="re-gallery__item">
              <img src="https://picsum.photos/seed/re-n4/400/300" alt="Berlin Mitte" />
              <figcaption class="re-gallery__caption g-ui">Berlin Mitte</figcaption>
            </figure>
            <figure class="re-gallery__item">
              <img src="https://picsum.photos/seed/re-n5/400/300" alt="Milan Navigli" />
              <figcaption class="re-gallery__caption g-ui">Milan Navigli</figcaption>
            </figure>
            <figure class="re-gallery__item">
              <img src="https://picsum.photos/seed/re-n6/400/300" alt="Geneva" />
              <figcaption class="re-gallery__caption g-ui">Geneva</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section class="g-shell re-process" id="process" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-content g-stack-2">
          <div class="re-section-head">
            <span class="re-section-head__num g-ui">04</span>
            <hr class="re-section-head__rule" />
            <span class="re-section-head__title g-ui">Process</span>
          </div>
        </div>
        <div class="g-content">
          <div class="g g-view-4 re-process__grid">
            <div class="col-1 re-process__step g-stack-2 g-standard">
              <div class="re-process__num g-display">01</div>
              <h3 class="g-heading">Measure</h3>
              <p class="g-prose">Site survey, light study, zoning constraints. We document before we dream. Data first, then desire.</p>
            </div>
            <div class="col-1 re-process__step g-stack-2 g-standard">
              <div class="re-process__num g-display">02</div>
              <h3 class="g-heading">Reduce</h3>
              <p class="g-prose">Remove noise. Keep structure, proportion, and material honesty. A house is a system of decisions.</p>
            </div>
            <div class="col-1 re-process__step g-stack-2 g-standard">
              <div class="re-process__num g-display">03</div>
              <h3 class="g-heading">Build</h3>
              <p class="g-prose">Swiss-engineered procurement. Fixed timelines, fixed budgets. No surprises, only tolerances.</p>
            </div>
            <div class="col-1 re-process__step g-stack-2 g-standard">
              <div class="re-process__num g-display">04</div>
              <h3 class="g-heading">Live</h3>
              <p class="g-prose">Handover with manuals, not mysteries. Homes calibrated for daily use, not photography.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="g-shell re-contact" id="contact" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
        <div class="g-content">
          <div class="g g-sub re-contact__grid">
            <div class="col-from-content-start col-to-gutter-7 re-contact__left g-stack-3">
              <span class="re-section-head__num g-ui">05</span>
              <h2 class="g-display g-wrap-balance">Let's find the right proportion.</h2>
              <form class="g-stack-2">
                <div class="re-form__row g-stack-1">
                  <input class="re-form__input g-ui" type="text" placeholder="Name" autocomplete="name" />
                  <input class="re-form__input g-ui" type="email" placeholder="Email" autocomplete="email" />
                </div>
                <textarea class="re-form__textarea g-ui" rows="5" placeholder="Tell us about the house, district, or brief you have in mind."></textarea>
                <div class="g-stack-1">
                  <button type="submit" class="btn btn-primary">Request Portfolio</button>
                </div>
              </form>
            </div>
            <div class="col-from-gutter-7 col-to-content-end re-contact__right">
              <div class="re-contact__line" aria-hidden="true"></div>
              <div class="re-contact__info g-stack-2">
                <div class="g-ui">Zurich</div>
                <div class="g-ui">Basel</div>
                <div class="g-ui">Berlin</div>
                <div class="g-ui">Milan</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="re-footer g-shell" style="--g-frame: clamp(1rem, 4vw, 3rem); --g-max-width: 88rem;">
      <div class="g-content g-stack-2">
        <div class="g g-view-6 re-footer__nav">
          <div class="col-1 re-footer__col g-stack-1">
            <span class="re-footer__head g-ui">Listings</span>
            <ul class="re-footer__list g-stack-1">
              <li><a class="re-footer__link g-ui" href="#">Zurich</a></li>
              <li><a class="re-footer__link g-ui" href="#">Basel</a></li>
              <li><a class="re-footer__link g-ui" href="#">Palm Springs</a></li>
            </ul>
          </div>
          <div class="col-1 re-footer__col g-stack-1">
            <span class="re-footer__head g-ui">Company</span>
            <ul class="re-footer__list g-stack-1">
              <li><a class="re-footer__link g-ui" href="#">About</a></li>
              <li><a class="re-footer__link g-ui" href="#">Process</a></li>
              <li><a class="re-footer__link g-ui" href="#">Journal</a></li>
            </ul>
          </div>
          <div class="col-1 re-footer__col g-stack-1">
            <span class="re-footer__head g-ui">Legal</span>
            <ul class="re-footer__list g-stack-1">
              <li><a class="re-footer__link g-ui" href="#">Privacy</a></li>
              <li><a class="re-footer__link g-ui" href="#">Terms</a></li>
              <li><a class="re-footer__link g-ui" href="#">Imprint</a></li>
            </ul>
          </div>
          <div class="col-1 re-footer__col g-stack-1">
            <span class="re-footer__head g-ui">Social</span>
            <ul class="re-footer__list g-stack-1">
              <li><a class="re-footer__link g-ui" href="#">Instagram</a></li>
              <li><a class="re-footer__link g-ui" href="#">LinkedIn</a></li>
              <li><a class="re-footer__link g-ui" href="#">X</a></li>
            </ul>
          </div>
          <div class="col-1 re-footer__col g-stack-1">
            <span class="re-footer__head g-ui">Contact</span>
            <ul class="re-footer__list g-stack-1">
              <li><a class="re-footer__link g-ui" href="#">Email</a></li>
              <li><a class="re-footer__link g-ui" href="#">Phone</a></li>
              <li><a class="re-footer__link g-ui" href="#">Book a Call</a></li>
            </ul>
          </div>
          <div class="col-1 re-footer__col g-stack-1">
            <span class="re-footer__head g-ui">Offices</span>
            <ul class="re-footer__list g-stack-1">
              <li><span class="g-ui">Zurich</span></li>
              <li><span class="g-ui">Basel</span></li>
              <li><span class="g-ui">Berlin</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="g-content re-footer__bar g-ui">
        <div>&copy; 2025 GERSTNER ESTATE</div>
        <div>N 47&deg;22'18" E 8&deg;32'28" GRID 12&times;24</div>
      </div>
    </footer>
  </div>
`
}
