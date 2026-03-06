/**
 * BlogPage2.jsx — "The Art of the Table Setting"
 *
 * Route: #/blogs/2
 * Category: Hosting
 */

import Header from '../components/Header';
import Footer from '../components/Footer';
import { BLOG_POSTS } from './Blogs';
import '../styles/BlogPage.css';
import '../styles/PageTransition.css';

const RELATED = BLOG_POSTS.filter((p) => p.id !== 2);

export default function BlogPage2() {
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
            {/* Replace with: <img src="src/assets/frontEnd-images/blog-table.jpg" alt="Elegant table setting" /> */}
            <div
              className="bp-hero-bg-placeholder"
              style={{ background: 'linear-gradient(160deg,#182028 0%,#283848 60%,#304050 100%)' }}
            />
          </div>
          <div className="bp-hero-overlay" aria-hidden="true" />
          <div className="bp-hero-content">
            <span className="bp-hero-badge" style={{ background: '#1a2838' }}>Hosting</span>
            <h1 className="bp-hero-title">The Art of the Table Setting</h1>
            <div className="bp-hero-meta">
              <span>April 28, 2024</span>
              <span>·</span>
              <span>4 min read</span>
              <span>·</span>
              <span>By Eleanor Vance</span>
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
            A beautifully set table does not happen by accident. It is the result of intention,
            patience, and an understanding that every layer — from the charger plate to the
            folded napkin — contributes to the story you are telling your guests.
          </p>

          <h2>The Foundation: Linens and Chargers</h2>
          <p>
            Begin with the foundation layer. Your tablecloth or runner sets the tonal register
            for everything that follows. A crisp white linen whispers classical elegance; an
            unbleached natural linen leans into organic warmth. A deep charcoal or forest-green
            cloth creates drama, allowing every object placed upon it to gleam.
          </p>
          <p>
            Charger plates — those larger decorative plates beneath the dinner plate — are
            frequently skipped, yet they are one of the quickest ways to elevate a setting.
            Choose a material that contrasts your tablecloth: brushed gold on white linen;
            matte black on a patterned runner; hammered silver on deep slate.
          </p>

          <blockquote className="bp-pull-quote">
            <p>
              "A table well set is a welcome letter to every guest. It says: we thought about you
              before you arrived."
            </p>
          </blockquote>

          <h2>Layering: The Rule of Three Heights</h2>
          <p>
            Professional table designers work in three vertical zones: low, mid, and tall.
            A low arrangement or scattered votive candles anchor the eye. A mid-height
            centrepiece — a cluster of bud vases or a shallow bowl — creates the focal layer.
            A single tall element: a taper candle, a branch of flowering cherry, a sculptural
            candlestick, draws the eye upward and creates the sense of occasion.
          </p>

          <div
            className="bp-article-img-placeholder"
            style={{ background: 'linear-gradient(160deg,#e0d8d0,#a09080)' }}
            aria-label="Three-height table centrepiece arrangement"
            role="img"
          />

          <h3>Cutlery Placement</h3>
          <p>
            The rules here are simple but important. Forks live to the left of the plate —
            salad fork outermost, dinner fork innermost. Knives sit to the right, blade facing
            the plate. Spoons rest to the right of the knives. The dessert spoon and fork lie
            horizontally above the plate, fork pointing right, spoon pointing left.
          </p>

          <div className="bp-tip-box">
            <div className="bp-tip-box-label">Pro Tip</div>
            <p>
              Place cutlery in order of use, working from the outside in. A guest's eye will
              thank you — it is intuitive, elegant, and removes any anxiety about the meal order.
            </p>
          </div>

          <h3>The Napkin: Sculpture or Story?</h3>
          <p>
            The folded napkin is the jewellery of the table. A bishop's hat fold speaks to
            ceremony. A simple rectangle folded in thirds and laid across the charger says
            something quieter and equally confident. At Unwritten Events, we often tuck a
            sprig of herb, a flower head, or a handwritten note inside the fold — these small
            gestures are invariably the details guests photograph and remember.
          </p>

          <h2>Finishing Touches</h2>
          <ul>
            <li>Place cards should be legible at arm's length — calligraphy in 14pt minimum</li>
            <li>Candles should be unscented at the table so as not to compete with food aromas</li>
            <li>Water glasses are placed above the knife; wine glasses cluster to the right</li>
            <li>Leave at least 24 inches of elbow room per guest for comfortable dining</li>
            <li>Step back and view the table from standing height before guests arrive</li>
          </ul>

          <div className="bp-byline">
            <div className="bp-byline-avatar">
              <div
                className="bp-byline-avatar-placeholder"
                style={{ background: 'linear-gradient(135deg,#d4b896,#a8886a)' }}
                aria-label="Eleanor Vance"
              />
            </div>
            <div>
              <div className="bp-byline-name">Eleanor Vance</div>
              <div className="bp-byline-role">Lead Designer, Unwritten Events</div>
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
          <h2>Create Your Perfect Table</h2>
          <p className="bp-cta-sub">Let our team design a dining experience your guests will never forget.</p>
          <button className="bp-cta-btn" onClick={() => { window.location.hash = '/contact'; }} type="button">
            Book a Consultation
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
