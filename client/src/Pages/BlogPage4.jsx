/**
 * BlogPage4.jsx — "Planning a Stress-Free Wedding Day"
 *
 * Route: #/blogs/4
 * Category: Lifestyle
 */

import Header from '../components/Header';
import Footer from '../components/Footer';
import { BLOG_POSTS } from './Blogs';
import '../styles/BlogPage.css';
import '../styles/PageTransition.css';

const RELATED = BLOG_POSTS.filter((p) => p.id !== 4);

export default function BlogPage4() {
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
            {/* Replace with: <img src="src/assets/frontEnd-images/blog-wedding.jpg" alt="Calm bride preparation" /> */}
            <div
              className="bp-hero-bg-placeholder"
              style={{ background: 'linear-gradient(160deg,#e8dcd0 0%,#c8a888 50%,#b09070 100%)' }}
            />
          </div>
          <div className="bp-hero-overlay" aria-hidden="true" />
          <div className="bp-hero-content">
            <span className="bp-hero-badge" style={{ background: '#1a2a20' }}>Lifestyle</span>
            <h1 className="bp-hero-title">Planning a Stress-Free Wedding Day</h1>
            <div className="bp-hero-meta">
              <span>February 3, 2024</span>
              <span>·</span>
              <span>7 min read</span>
              <span>·</span>
              <span>By Julian Hayes</span>
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
            After planning over two hundred weddings, our team has observed one consistent truth:
            the most beautiful weddings are not the biggest ones. They are the ones where the
            couple was present — genuinely, emotionally, sensorially present — for every moment.
            Stress is the enemy of presence. Here is how we eliminate it.
          </p>

          <h2>The Root Cause of Wedding Day Stress</h2>
          <p>
            Most wedding day anxiety does not originate on the wedding day itself. It accumulates
            in the months and weeks before: decisions left unmade, communications gone unanswered,
            logistics assumed but not confirmed. By the time the day arrives, the couple is
            already carrying a weight that has nothing to do with the joy they feel.
          </p>
          <p>
            Our philosophy is simple: decisions made early are decisions that disappear. A vendor
            confirmed in January cannot become a source of anxiety in June. A timeline locked
            twelve weeks out cannot unravel forty-eight hours before the ceremony.
          </p>

          <blockquote className="bp-pull-quote">
            <p>
              "We want our couples to arrive at their wedding as guests. Everything else is
              our job."
            </p>
          </blockquote>

          <h2>Ten Strategies That Actually Work</h2>

          <h3>1. Lock Your Timeline Early</h3>
          <p>
            Build your wedding day timeline fourteen weeks before the event. Share it with every
            vendor. Revise it at eight weeks, again at four weeks, and freeze it at two weeks.
            No changes in the final fortnight except for genuine emergencies. This single rule
            eliminates the majority of coordination stress.
          </p>

          <h3>2. Assign a Single Point of Contact</h3>
          <p>
            All vendor communications should flow through one person: your planner, your venue
            coordinator, or a trusted and organised family member. Brides and grooms who are
            fielding calls from the florist, the caterer, and the DJ at 7am on their wedding
            morning are not experiencing their wedding — they are project managing it.
          </p>

          <div
            className="bp-article-img-placeholder"
            style={{ background: 'linear-gradient(160deg,#f0e8dc,#c8b898)' }}
            aria-label="Calm bridal preparation scene"
            role="img"
          />

          <h3>3. Build Buffers, Not Miracles</h3>
          <p>
            Every timeline block should include buffer time. If hair and makeup is scheduled to
            finish at 2:00pm, your timeline should show 2:30pm. If the ceremony is at 4:00pm,
            the bridal party should be assembled and ready at 3:30pm. Buffers are not wasted
            time — they are protected peace.
          </p>

          <h3>4. Eat Breakfast</h3>
          <p>
            This sounds too simple to be professional advice. It is included because it is
            ignored with remarkable frequency. A couple who has not eaten properly by 11am on
            their wedding day will feel its effects by 3pm. Arrange for a proper breakfast
            to be delivered to the preparation rooms. Non-negotiable.
          </p>

          <div className="bp-tip-box">
            <div className="bp-tip-box-label">From Our Planners</div>
            <p>
              We include a "wedding day emergency kit" for every client: safety pins, stain
              remover pen, breath mints, pain relief tablets, a phone charger, blotting paper,
              and a printed copy of the full timeline. It has saved every single wedding at least
              once.
            </p>
          </div>

          <h3>5. Conduct a Venue Walkthrough the Week Before</h3>
          <p>
            Walk the venue seven days before your wedding with your planner and at minimum
            your photographer. Walk the ceremony entrance. Walk the aisle. Identify the exact
            location of every key moment. Familiarity dissolves the anxiety of the unknown.
          </p>

          <h3>6. Delegate Completely</h3>
          <p>
            If you have hired a planner, trust them entirely on the day. If you have family
            members in helper roles, give them specific, bounded responsibilities with zero
            ambiguity. "You are responsible for the welcome bags at the hotel — nothing else"
            is a more useful instruction than "help wherever needed."
          </p>

          <h3>7. Protect the First Hour of Your Morning</h3>
          <p>
            The first hour after waking on your wedding day should be quiet. Tea or coffee,
            a proper breakfast, time with your closest companion. No phone calls, no vendor
            queries, no social media. This hour is yours. Guard it.
          </p>

          <h3>8. Write Private Vows or Letters</h3>
          <p>
            Whatever your ceremony format, writing something private to your partner — a letter
            to be read before the ceremony, or private vows exchanged just between you — creates
            an emotional anchor for the day. When the logistics blur together, this private
            moment remains absolutely clear.
          </p>

          <h3>9. Plan for the Unexpected</h3>
          <p>
            Something unexpected will happen. In twenty years of events, this has never not
            been true. A vendor is late. A dress zip requires assistance. Rain arrives early.
            The question is not whether the unexpected will occur, but whether you will have
            a planner standing beside you with a calm solution when it does.
          </p>

          <h3>10. Be Present for Thirty Seconds at a Time</h3>
          <p>
            Presence is not a permanent state — it is a practice. Pause thirty times across
            your wedding day and take in exactly where you are, who is around you, and what
            you are feeling. Thirty seconds of full presence, thirty times. You will remember
            your wedding in extraordinary detail.
          </p>

          <div className="bp-byline">
            <div className="bp-byline-avatar">
              <div
                className="bp-byline-avatar-placeholder"
                style={{ background: 'linear-gradient(135deg,#8aa8c8,#5070a0)' }}
                aria-label="Julian Hayes"
              />
            </div>
            <div>
              <div className="bp-byline-name">Julian Hayes</div>
              <div className="bp-byline-role">Head of Operations, Unwritten Events</div>
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
          <h2>Let Us Handle Every Detail</h2>
          <p className="bp-cta-sub">So you can arrive at your wedding as a guest — present, radiant, and at peace.</p>
          <button className="bp-cta-btn" onClick={() => { window.location.hash = '/contact'; }} type="button">
            Book a Consultation
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
