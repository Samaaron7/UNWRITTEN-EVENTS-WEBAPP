/**
 * BlogPage3.jsx — "How Lighting Transforms a Venue"
 *
 * Route: #/blogs/3
 * Category: Design
 */

import Header from '../components/Header';
import Footer from '../components/Footer';
import { BLOG_POSTS } from './Blogs';
import '../styles/BlogPage.css';
import '../styles/PageTransition.css';

const RELATED = BLOG_POSTS.filter((p) => p.id !== 3);

export default function BlogPage3() {
  const navigateTo = (slug) => {
    window.location.hash = slug.replace('#', '');
  };

  return (
    <div className="page-container">
      <Header />

      <main>
        {/* ── Hero ── */}
        <section className="bp-hero" aria-label="Article hero">
          <div className="bp-hero-bg" aria-hidden="true">
            {/* Replace with: <img src="src/assets/frontEnd-images/blog-lighting.jpg" alt="Dramatic venue lighting" /> */}
            <div
              className="bp-hero-bg-placeholder"
              style={{ background: 'linear-gradient(160deg,#300848 0%,#601080 50%,#380858 100%)' }}
            />
          </div>
          <div className="bp-hero-overlay" aria-hidden="true" />
          <div className="bp-hero-content">
            <span className="bp-hero-badge" style={{ background: '#380848' }}>Design</span>
            <h1 className="bp-hero-title">How Lighting Transforms a Venue</h1>
            <div className="bp-hero-meta">
              <span>March 15, 2024</span>
              <span>·</span>
              <span>6 min read</span>
              <span>·</span>
              <span>By Marcus Thorne</span>
            </div>
          </div>
        </section>

        {/* ── Back ── */}
        <button className="bp-back" onClick={() => navigateTo('#/blogs')} type="button" aria-label="Back to Journal">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7H2M2 7L6 3M2 7L6 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Journal
        </button>

        {/* ── Article ── */}
        <article className="bp-article" aria-label="Article content">

          <p className="bp-lead">
            Of all the tools available to an event designer, lighting is the most powerful and
            the most overlooked. It can make a modest hall feel like a cathedral, a garden feel
            enchanted, a ballroom feel intimate — or destroy all of those things if handled
            carelessly.
          </p>

          <h2>The Language of Colour Temperature</h2>
          <p>
            Colour temperature is measured in Kelvin and describes the warmth or coolness of a
            light source. Understanding this single concept will transform the way you approach
            every event environment.
          </p>
          <p>
            Warm light (2700–3000K) flatters skin tones and creates an immediate sense of
            intimacy and romance. It is the temperature of candlelight, and it is why every
            celebrated restaurant in the world uses it. For weddings, galas, and private dinners,
            this is almost always the correct choice.
          </p>
          <p>
            Cool light (4000–6500K) is crisp, clinical, and energising. It is the temperature
            of daylight and corporate spaces. Used deliberately, it can create striking
            contemporary effects — but at a wedding reception, it reads as a hospital corridor.
          </p>

          <blockquote className="bp-pull-quote">
            <p>
              "Lighting is the one element that affects every other element. It changes the
              flowers, the food, the faces, the feeling. Get it right first."
            </p>
          </blockquote>

          <h2>Five Lighting Techniques We Use at Every Event</h2>

          <h3>1. Uplighting</h3>
          <p>
            Placing LED fixtures at the base of walls, columns, or architectural features and
            washing them with colour is one of the most cost-effective transformations available.
            A white venue washed in deep rose becomes an entirely different room. We typically
            program uplighting to shift subtly across the evening — warmer during dinner,
            slightly richer and more saturated during dancing.
          </p>

          <div
            className="bp-article-img-placeholder"
            style={{ background: 'linear-gradient(160deg,#280840,#500870)' }}
            aria-label="Venue with purple uplighting"
            role="img"
          />

          <h3>2. Pin Spotting</h3>
          <p>
            A narrow beam of warm light directed precisely at each centrepiece makes flowers
            glow. This is the single most impactful lighting upgrade for a dinner event.
            Without pin spots, your floral investment is literally in the dark.
          </p>

          <h3>3. Candles as Primary Light</h3>
          <p>
            When budget allows, supplementing or even replacing table lamps with hundreds of
            candles creates an atmosphere that no electrical system can fully replicate. The
            movement of flame, the slight variation between candles, the warmth of the glow
            on faces — it is irreducible.
          </p>

          <h3>4. Gobo Projection</h3>
          <p>
            A gobo is a metal template placed inside a spotlight to project a pattern or
            monogram onto a surface. Projecting a couple's initials onto a dance floor, or
            casting a lattice of leaves across a ceiling, adds a personalised layer that
            photographs beautifully.
          </p>

          <h3>5. The Blackout Moment</h3>
          <p>
            For grand reveals — the couple's first entrance, the cake cutting — consider a
            brief programmed blackout followed by a lighting change. Five seconds of darkness
            before a scene shift creates one of the most dramatic transitions in live event
            design. Use it sparingly: once per evening, maximum.
          </p>

          <div className="bp-tip-box">
            <div className="bp-tip-box-label">Technical Note</div>
            <p>
              Always request a lighting walkthrough with your designer at the venue 48 hours
              before the event. Colours appear differently in every space, and what looks
              perfect in a showroom can read entirely differently against your specific walls
              and textiles.
            </p>
          </div>

          <h2>Common Lighting Mistakes to Avoid</h2>
          <ul>
            <li>Leaving existing venue fluorescent overheads switched on — always turn them off</li>
            <li>Using RGB LEDs on cool (white) setting — always warm-white or amber at minimum</li>
            <li>Forgetting to light the bar, buffet, and photo areas — guests spend time there</li>
            <li>Over-saturating with colour — one or two accent colours are always more elegant than five</li>
            <li>Neglecting the entrance and arrival experience — first impressions are formed in seconds</li>
          </ul>

          <div className="bp-byline">
            <div className="bp-byline-avatar">
              <div
                className="bp-byline-avatar-placeholder"
                style={{ background: 'linear-gradient(135deg,#b0b8d0,#7880a8)' }}
                aria-label="Marcus Thorne"
              />
            </div>
            <div>
              <div className="bp-byline-name">Marcus Thorne</div>
              <div className="bp-byline-role">Senior Planner, Unwritten Events</div>
            </div>
          </div>
        </article>

        {/* ── Related ── */}
        <section className="bp-related" aria-label="Related articles">
          <h2 className="bp-related-heading">More from the Journal</h2>
          <div className="bp-related-grid">
            {RELATED.map((post) => (
              <div
                key={post.id}
                className="bp-related-card"
                onClick={() => navigateTo(post.slug)}
                onKeyDown={(e) => { if (e.key === 'Enter') navigateTo(post.slug); }}
                tabIndex={0}
                role="button"
                aria-label={`Read: ${post.title}`}
              >
                <div className="bp-related-thumb">
                  <div className="bp-related-thumb-placeholder" style={{ background: post.thumbGradient }} />
                </div>
                <div className="bp-related-body">
                  <div className="bp-related-badge">{post.category}</div>
                  <div className="bp-related-title">{post.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bp-cta" aria-label="Call to action">
          <h2>Illuminate Your Event</h2>
          <p className="bp-cta-sub">Let our lighting designers transform your venue into something truly extraordinary.</p>
          <button className="bp-cta-btn" onClick={() => { window.location.hash = '/contact'; }} type="button">
            Book a Consultation
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
