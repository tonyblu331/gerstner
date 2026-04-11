import './index.css'
import 'dialkit/styles.css'
import 'gerstner/debug/debug.css'
import { initGerstnerDebug } from 'gerstner/debug'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="g-shell site-shell">
    <!-- Hero: 12-col full-width with breakout -->
    <header class="g-full hero">
      <div class="g-content hero-content">
        <p class="kicker">Luxury Living</p>
        <h1 class="display">Find Your Perfect Home</h1>
        <p class="prose">Discover premium properties in the city's most desirable neighborhoods. Every detail crafted for modern living.</p>
        <div class="hero-actions">
          <button class="btn btn-primary">Browse Properties</button>
          <button class="btn btn-secondary">Schedule a Tour</button>
        </div>
      </div>
      <aside class="g-breakout-r hero-image">
        <div class="image-placeholder">Hero Image</div>
      </aside>
    </header>

    <!-- Featured Properties: 4-col grid -->
    <section class="g-content section">
      <div class="section-header">
        <p class="kicker">Featured Listings</p>
        <h2 class="heading">Properties for Sale</h2>
      </div>
      <div class="g property-grid">
        <div class="property-card col-3">
          <div class="card-image">Property 1</div>
          <p class="price">$1,250,000</p>
          <h3 class="card-title">Modern Loft</h3>
          <p class="location">Downtown District</p>
        </div>
        <div class="property-card alt col-3">
          <div class="card-image">Property 2</div>
          <p class="price">$890,000</p>
          <h3 class="card-title">Garden Villa</h3>
          <p class="location">Suburban Heights</p>
        </div>
        <div class="property-card col-3">
          <div class="card-image">Property 3</div>
          <p class="price">$2,100,000</p>
          <h3 class="card-title">Penthouse Suite</h3>
          <p class="location">Waterfront View</p>
        </div>
        <div class="property-card alt col-3">
          <div class="card-image">Property 4</div>
          <p class="price">$650,000</p>
          <h3 class="card-title">Urban Studio</h3>
          <p class="location">Arts Quarter</p>
        </div>
      </div>
    </section>

    <!-- Features: 6-col grid with breakout -->
    <section class="g-full features-section">
      <div class="g-content section-header">
        <p class="kicker">Why Choose Us</p>
        <h2 class="heading">Exceptional Living Spaces</h2>
      </div>
      <div class="g-breakout-l feature-visual">
        <div class="feature-graphic">Visual</div>
      </div>
      <div class="g feature-grid col-from-5">
        <div class="feature-item col-2">
          <div class="feature-icon">✓</div>
          <h3 class="feature-title">Prime Locations</h3>
          <p class="feature-desc">Handpicked properties in the best neighborhoods</p>
        </div>
        <div class="feature-item col-2">
          <div class="feature-icon">★</div>
          <h3 class="feature-title">Quality Built</h3>
          <p class="feature-desc">Every home meets our strict quality standards</p>
        </div>
        <div class="feature-item col-2">
          <div class="feature-icon">♥</div>
          <h3 class="feature-title">Full Support</h3>
          <p class="feature-desc">Dedicated team from search to move-in</p>
        </div>
        <div class="feature-item alt col-2">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Smart Homes</h3>
          <p class="feature-desc">Modern technology integrated throughout</p>
        </div>
        <div class="feature-item alt col-2">
          <div class="feature-icon">🌿</div>
          <h3 class="feature-title">Green Living</h3>
          <p class="feature-desc">Sustainable features for eco-conscious buyers</p>
        </div>
        <div class="feature-item col-2">
          <div class="feature-icon">🔒</div>
          <h3 class="feature-title">Secure</h3>
          <p class="feature-desc">Advanced security systems for peace of mind</p>
        </div>
      </div>
    </section>

    <!-- Neighborhoods: 3-col grid with subgrid -->
    <section class="g-content section">
      <div class="section-header">
        <p class="kicker">Explore Areas</p>
        <h2 class="heading">Popular Neighborhoods</h2>
      </div>
      <div class="g neighborhoods-grid">
        <div class="neighborhood-card col-4">
          <div class="card-image">Downtown</div>
          <h3 class="card-title">City Center</h3>
          <p class="card-desc">Urban living at its finest</p>
          <article class="g-sub neighborhood-details col-start-1 col-3">
            <div class="detail-item">Avg Price: $850k</div>
            <div class="detail-item">Properties: 42</div>
          </article>
        </div>
        <div class="neighborhood-card alt col-4">
          <div class="card-image">Waterfront</div>
          <h3 class="card-title">Harbor District</h3>
          <p class="card-desc">Stunning water views</p>
          <article class="g-sub neighborhood-details col-start-1 col-3">
            <div class="detail-item">Avg Price: $1.2M</div>
            <div class="detail-item">Properties: 28</div>
          </article>
        </div>
        <div class="neighborhood-card col-4">
          <div class="card-image">Suburbs</div>
          <h3 class="card-title">Green Valley</h3>
          <p class="card-desc">Peaceful family living</p>
          <article class="g-sub neighborhood-details col-start-1 col-3">
            <div class="detail-item">Avg Price: $650k</div>
            <div class="detail-item">Properties: 56</div>
          </article>
        </div>
      </div>
    </section>

    <!-- Testimonials: 2-col grid with independent view -->
    <section class="g-content section">
      <div class="section-header">
        <p class="kicker">Client Stories</p>
        <h2 class="heading">What Our Clients Say</h2>
      </div>
      <article class="g g-view-2 g-align-independent testimonials-grid card">
        <div class="testimonial col-1">
          <p class="quote">"The team made finding our dream home effortless. Their attention to detail is unmatched."</p>
          <p class="author">— Sarah M.</p>
        </div>
        <div class="testimonial alt col-1">
          <p class="quote">"From search to move-in, everything was seamless. Highly recommend their services."</p>
          <p class="author">— James K.</p>
        </div>
      </article>
    </section>

    <!-- Contact: Full-width with content zone -->
    <section class="g-full contact-section">
      <div class="g-content">
        <div class="contact-grid">
          <div class="contact-info">
            <p class="kicker">Get in Touch</p>
            <h2 class="heading">Ready to Find Your Home?</h2>
            <p class="prose">Contact us today to schedule a private viewing or discuss your property needs.</p>
            <div class="contact-details">
              <p>📍 123 Real Estate Blvd, Suite 100</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ hello@realestate.com</p>
            </div>
          </div>
          <div class="contact-form card">
            <form>
              <div class="form-group">
                <label>Name</label>
                <input type="text" placeholder="Your name">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com">
              </div>
              <div class="form-group">
                <label>Message</label>
                <textarea placeholder="Tell us about your needs"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <footer class="g-full footer">
      <div class="g-content footer-content">
        <p>&copy; 2025 Real Estate Co. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  </main>
`

// Initialize debug overlay after DOM is populated so syncLayers finds grid elements
initGerstnerDebug({
  defaultOpen: false,
  initial: {
    layers: {
      cols: true,
      baseline: true,
      rhythm: false,
      zones: false,
      drift: false,
    },
  },
})
