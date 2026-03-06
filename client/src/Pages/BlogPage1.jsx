/**
 * BlogPage1.jsx — "Embracing Minimalism in Floral Design"
 *
 * Route: #/blogs/1
 * Category: Trends
 *
 * Structure:
 *  1. Shared Header
 *  2. Article hero image + title overlay
 *  3. ← Back to Journal button
 *  4. Full article body (lead, sections, pull quote, tip box, byline)
 *  5. Related articles (3 cards → other blog pages)
 *  6. CTA banner
 *  7. Shared Footer
 */

import Header from '../components/Header';
import Footer from '../components/Footer';
import { BLOG_POSTS } from './Blogs';
import '../styles/BlogPage.css';
import '../styles/PageTransition.css';

// Related posts = the other 3 posts
const RELATED = BLOG_POSTS.filter((p) => p.id !== 1);

export default function BlogPage1() {
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
            {/* Replace with: <img src="src/assets/frontEnd-images/blog-floral.jpg" alt="Floral arrangement" /> */}
            <div
              className="bp-hero-bg-placeholder"
              style={{ background: 'linear-gradient(160deg,#f0e8dc 0%,#c8b898 60%,#a89878 100%)' }}
            />
          </div>
          <div className="bp-hero-overlay" aria-hidden="true" />
          <div className="bp-hero-content">
            <span className="bp-hero-badge">Trends</span>
            <h1 className="bp-hero-title">Embracing Minimalism in Floral Design</h1>
            <div className="bp-hero-meta">
              <span>May 12, 2024</span>
              <span>·</span>
              <span>5 min read</span>
              <span>·</span>
              <span>By Sofia Martinez</span>
            </div>
          </div>
        </section>

        {/* ── Back button ── */}
        <button
          className="bp-back"
          onClick={() => navigateTo('#/blogs')}
          type="button"
          aria-label="Back to Journal"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7H2M2 7L6 3M2 7L6 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Journal
        </button>

        {/* ── Article body ── */}
        <article className="bp-article" aria-label="Article content">

          <p className="bp-lead">
            In a world saturated with maximalist tablescapes and elaborate floral towers, a quiet
            revolution is blooming — one that finds profound beauty in restraint, negative space,
            and the singular perfect stem.
          </p>

          <h2>Why Less Has Become More</h2>
          <p>
            Luxury event design has entered a new chapter. Where once a bride's eye was drawn to
            towering garden-style arrangements bursting with hydrangea and pampas grass, today's
            discerning couples are requesting something altogether more considered: a single
            branch of cherry blossom arching across a low vessel; a cluster of garden roses so
            tightly composed they seem to breathe.
          </p>
          <p>
            This shift mirrors a broader cultural desire for calm. Guests arrive at an event
            carrying the noise of their everyday lives. A minimal floral palette — cool white
            tulips, a smudge of sage foliage, the honest texture of dried seed heads — creates
            an immediate exhale. The room feels curated rather than decorated.
          </p>

          {/* Pull quote */}
          <blockquote className="bp-pull-quote">
            <p>
              "The most memorable centerpieces I've ever created were the simplest ones.
              A single stem says everything a hundred cannot."
            </p>
          </blockquote>

          <h2>The Three Pillars of Minimal Floristry</h2>
          <h3>1. Material Selection</h3>
          <p>
            Minimalism demands that every element earn its place. Choose two or three varieties
            at most — a structural bloom, a textural accent, and a length of foliage. Avoid the
            temptation to add "just one more thing." The power is in the edit.
          </p>
          <p>
            Favoured materials right now include white ranunculus, dried honesty seed pods,
            single-stem eucalyptus, and the quietly spectacular allium — whose spherical geometry
            is architecture in itself.
          </p>

          {/* Inline image placeholder */}
          <div
            className="bp-article-img-placeholder"
            style={{ background: 'linear-gradient(160deg,#e8e0d4,#c0b098)' }}
            aria-label="Minimal floral arrangement on a table"
            role="img"
          />

          <h3>2. Vessel as Co-Author</h3>
          <p>
            In minimal design, the vessel is not a container — it is a collaborator. A thin-necked
            bud vase in handblown amber glass transforms three stems into a sculpture. A wide,
            low bowl in raw clay grounds an arrangement in something earthy and honest.
          </p>

          <h3>3. Negative Space as Ingredient</h3>
          <p>
            Florists trained in the traditional European style are often uncomfortable leaving air
            in an arrangement. Minimalism inverts this entirely. The space around a stem is as
            intentional as the stem itself — it gives the eye somewhere to rest and the flower
            somewhere to be seen.
          </p>

          {/* Tip box */}
          <div className="bp-tip-box">
            <div className="bp-tip-box-label">Designer Tip</div>
            <p>
              When working with a minimal palette, increase your investment in vase quality rather
              than bloom quantity. A single extraordinary vessel will elevate three simple stems
              into a conversation piece.
            </p>
          </div>

          <h2>Applying This to Your Event</h2>
          <p>
            You do not need to strip every table bare. Minimal floristry can coexist with rich
            textiles, candlelight, and layered place settings. In fact, the contrast enhances
            both: the flowers appear more precious against the warmth of linen and flame.
          </p>
          <p>
            Begin by choosing a single hero bloom for your palette. Build everything else
            around its colour, form, and mood. Resist diversification. Repetition across a
            long table creates rhythm — one of the most overlooked tools in event design.
          </p>

          <ul>
            <li>Repeat one bloom type across all centrepiece vessels for visual cohesion</li>
            <li>Choose a vessel that contrasts the bloom in material and weight</li>
            <li>Leave at least 40% of each arrangement as intentional negative space</li>
            <li>Edit ruthlessly — if you are unsure whether a stem belongs, remove it</li>
          </ul>

          {/* Author byline */}
          <div className="bp-byline">
            <div className="bp-byline-avatar">
              <div
                className="bp-byline-avatar-placeholder"
                style={{ background: 'linear-gradient(135deg,#e0c8b8,#b89878)' }}
                aria-label="Sofia Martinez"
              />
            </div>
            <div>
              <div className="bp-byline-name">Sofia Martinez</div>
              <div className="bp-byline-role">Creative Director, Unwritten Events</div>
            </div>
          </div>
        </article>

        {/* ── Related Articles ── */}
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

        {/* ── CTA ── */}
        <section className="bp-cta" aria-label="Call to action">
          <h2>Ready to Design Your Event?</h2>
          <p className="bp-cta-sub">From intimate dinners to grand celebrations — let's create something beautiful.</p>
          <button className="bp-cta-btn" onClick={() => { window.location.hash = '/contact'; }} type="button">
            Book a Consultation
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
