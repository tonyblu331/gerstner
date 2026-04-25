export function render(): string {
  return `
  <div class="page-article g-shell" style="--g-max-width: 80rem; --g-frame: clamp(1rem, 4dvw, 4rem);">
    <div class="art-progress"></div>

    <header class="g-full g-sub art-topbar" role="banner">
      <div class="g-content art-topbar__content">
        <div class="art-topbar__actions">
          <button class="art-topbar__menu" aria-label="Menu">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>
          <button class="art-topbar__menu" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>
        </div>
        <a href="#/article" class="art-topbar__logo">The New York Times</a>
        <div class="art-topbar__actions">
          <a href="#" class="art-topbar__link">Log In</a>
          <a href="#" class="art-topbar__subscribe">Subscribe for $0.50/week</a>
        </div>
      </div>
    </header>

    <main>
      <section class="g-full g-sub art-header">
        <div class="g-content g-stack-2 art-header__content">
          <div class="art-kicker g-ui">Technology</div>
          <h1 class="g-display">An A.I.-Generated Picture Won an Art Prize. Artists Aren't Happy.</h1>
          <p class="g-prose">A synthetic image created with Midjourney took first place at the Colorado State Fair. The art world is divided.</p>
          <div class="art-byline">
            <div class="art-byline__avatar"></div>
            <div>
              <div><strong>By Kevin Roose</strong></div>
              <div class="g-ui">Published Sept. 2, 2022 Updated April 12, 2026</div>
            </div>
          </div>
          <div class="art-sharebar">
            <button class="art-share-btn">Facebook</button>
            <button class="art-share-btn">X</button>
            <button class="art-share-btn">Email</button>
            <button class="art-share-btn">Save</button>
          </div>
        </div>
      </section>

      <figure class="g-full g-sub art-hero-wrap">
        <img class="g-breakout-r art-hero__img" src="https://picsum.photos/seed/nyt-art/945/480" alt="Jason Allen's A.I.-generated work" />
        <figcaption class="g-content art-hero__caption">
          <span>Jason Allen's A.I.-generated work, &quot;Théâtre d'Opéra Spatial,&quot; won the digital art competition at the Colorado State Fair.</span>
          <span>via Jason Allen</span>
        </figcaption>
      </figure>

      <section class="g-full g-sub art-body-shell">
        <div class="g-full g-sub art-body-grid">
          <article class="art-body col-from-content-start col-end-9">
            <p class="g-prose art-drop-cap">Jason Allen didn't set out to cause an uproar. The Pueblo, Colo., game designer had been experimenting with Midjourney, a new A.I. image generator, for only a few months when he decided to enter the Colorado State Fair's fine arts competition.</p>
            <p class="g-prose">He printed his favorite creation on canvas, submitted it under the category &quot;Digital Arts/Digitally-Manipulated Photography,&quot; and won first place. The $300 prize came with something else: outrage.</p>
            <p class="g-prose">&quot;I knew this would be controversial,&quot; Mr. Allen said in an interview. &quot;I just didn't expect the level of vitriol.&quot;</p>
            <blockquote class="art-pullquote">
              <p class="g-heading">We're watching the death of artistry unfold right before our eyes.</p>
            </blockquote>
            <p class="g-prose">Mr. Allen, 39, defended his process. He said he had spent more than 80 hours refining his prompts in Midjourney — adjusting phrasing, curating hundreds of iterations, then upscaling and editing the final image in Photoshop before printing. &quot;It's not just typing words,&quot; he said. &quot;It's curation, it's taste, it's vision.&quot;</p>
            <p class="g-prose">But for many working artists, that distinction hardly matters. They argue that tools like Midjourney and DALL-E were trained on billions of images scraped from the internet — including their own copyrighted work — without consent or compensation. The U.S. Copyright Office has <a href="#">so far refused to grant copyright</a> to purely A.I.-generated works, creating new uncertainty for collectors and creators alike.</p>
            <p class="g-prose">The Colorado State Fair stood by its decision. The judges, who did not know Midjourney was used, said they evaluated the piece on its aesthetic merits and awarded it fairly under the digital art rules, which do not prohibit A.I. tools. Still, after the controversy, they said they would clarify rules for next year.</p>
            <p class="g-prose">Mr. Allen said he has no plans to apologize. He has since made thousands of dollars selling prints of &quot;Théâtre d'Opéra Spatial&quot; and is working on a graphic novel using A.I. imagery. &quot;Art has always evolved with technology,&quot; he said. &quot;The paint tube once scandalized artists, too.&quot;</p>
            <p class="g-prose">The debate is unlikely to be settled in a county fair in Pueblo. But as generative tools become faster, cheaper, and harder to detect, museums, galleries, and competitions around the world are being forced to answer a question that once felt theoretical: What, exactly, counts as art?</p>
          </article>

          <aside class="art-rail col-start-9 col-to-content-end" aria-label="Related content">
            <div class="art-rail__sticky">
              <div>
                <h3 class="art-rail__title">Most Popular</h3>
                <ol class="art-rail__list">
                  <li class="art-rail__item"><a class="art-rail__link" href="#">Inside the Secret A.I. Workshops Training Hollywood Writers</a></li>
                  <li class="art-rail__item"><a class="art-rail__link" href="#">The Copyright Office Rules A.I. Art Can't Be Copyrighted</a></li>
                  <li class="art-rail__item"><a class="art-rail__link" href="#">How Midjourney Went From Basement Project to $10 Billion</a></li>
                  <li class="art-rail__item"><a class="art-rail__link" href="#">Artists Are Suing A.I. Companies. Here's Why It's Complicated.</a></li>
                  <li class="art-rail__item"><a class="art-rail__link" href="#">I Spent a Week Making Art With DALL-E. I'm Still Confused.</a></li>
                </ol>
              </div>
              <div class="art-rail__ad-box"></div>
            </div>
          </aside>
        </div>
      </section>

      <section class="g-full g-sub art-endmatter" id="comments">
        <div class="g-content g-stack-3">
          <div class="art-comments-prompt">
            <button class="art-share-btn">READ 125 COMMENTS</button>
            <span>Share your thoughts.</span>
          </div>
          <div>
            <h3 class="art-related__title">More in Technology</h3>
            <div class="g g-view-3 art-related__grid">
              <article class="col-1 g-stack-1">
                <img class="art-related__img" src="https://picsum.photos/seed/art-rel1/420/220" alt="Analysis" />
                <div class="g-ui">Analysis</div>
                <h4 class="art-related__hed"><a href="#">What Happens When A.I. Can Make Art Better Than Humans?</a></h4>
              </article>
              <article class="col-1 g-stack-1">
                <img class="art-related__img" src="https://picsum.photos/seed/art-rel2/420/220" alt="The Law" />
                <div class="g-ui">The Law</div>
                <h4 class="art-related__hed"><a href="#">The Legal Gray Zone of A.I.-Generated Images</a></h4>
              </article>
              <article class="col-1 g-stack-1">
                <img class="art-related__img" src="https://picsum.photos/seed/art-rel3/420/220" alt="Profile" />
                <div class="g-ui">Profile</div>
                <h4 class="art-related__hed"><a href="#">Meet the Colorado Man Who Changed Art With a Prompt</a></h4>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="g-full g-sub art-footer">
      <div class="g-content g-stack-3 art-footer__inner">
        <div class="art-footer__logo">The New York Times</div>
        <div class="g g-view-6 art-footer__nav">
          <div class="col-1">
            <span class="art-footer__head">News</span>
            <ul class="art-footer__list">
              <li><a class="art-footer__link" href="#">Home Page</a></li>
              <li><a class="art-footer__link" href="#">World</a></li>
              <li><a class="art-footer__link" href="#">U.S.</a></li>
              <li><a class="art-footer__link" href="#">Politics</a></li>
            </ul>
          </div>
          <div class="col-1">
            <span class="art-footer__head">Opinion</span>
            <ul class="art-footer__list">
              <li><a class="art-footer__link" href="#">Today's Opinion</a></li>
              <li><a class="art-footer__link" href="#">Columnists</a></li>
              <li><a class="art-footer__link" href="#">Guest Essays</a></li>
            </ul>
          </div>
          <div class="col-1">
            <span class="art-footer__head">Arts</span>
            <ul class="art-footer__list">
              <li><a class="art-footer__link" href="#">Today's Arts</a></li>
              <li><a class="art-footer__link" href="#">Art &amp; Design</a></li>
              <li><a class="art-footer__link" href="#">Books</a></li>
            </ul>
          </div>
          <div class="col-1">
            <span class="art-footer__head">More</span>
            <ul class="art-footer__list">
              <li><a class="art-footer__link" href="#">Audio</a></li>
              <li><a class="art-footer__link" href="#">Games</a></li>
              <li><a class="art-footer__link" href="#">Cooking</a></li>
            </ul>
          </div>
          <div class="col-1">
            <span class="art-footer__head">Account</span>
            <ul class="art-footer__list">
              <li><a class="art-footer__link" href="#">Subscribe</a></li>
              <li><a class="art-footer__link" href="#">Manage Account</a></li>
              <li><a class="art-footer__link" href="#">Log In</a></li>
            </ul>
          </div>
          <div class="col-1">
            <span class="art-footer__head">Company</span>
            <ul class="art-footer__list">
              <li><a class="art-footer__link" href="#">About</a></li>
              <li><a class="art-footer__link" href="#">Contact</a></li>
              <li><a class="art-footer__link" href="#">Help</a></li>
            </ul>
          </div>
        </div>
        <div class="art-footer__bottom g-ui">© 2026 The New York Times Company</div>
      </div>
    </footer>
  </div>
`
}
