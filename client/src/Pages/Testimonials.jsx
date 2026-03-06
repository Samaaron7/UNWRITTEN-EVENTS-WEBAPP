import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Testimonials.css';
import '../styles/PageTransition.css';

// ─── Data ───────────────────────────────────────────────────────────────────

const HERO_QUOTE = {
  text: '"An unforgettable night that exceeded every expectation."',
  names: 'Sophia & James',
  event: 'Wedding at The Plaza',
};

const FILTER_CATEGORIES = ['All Reviews', 'Weddings', 'Galas', 'Corporate', 'Private Parties'];

/** Map filter label → badge key used on each review */
const FILTER_KEY_MAP = {
  'All Reviews':     null,
  Weddings:          'wedding',
  Galas:             'gala',
  Corporate:         'corporate',
  'Private Parties': 'retreat',
};

const REVIEWS_DATA = [
  {
    id: 1,
    name: 'Eleanor Vance',
    date: 'October 2023',
    category: 'wedding',
    stars: 5,
    initials: 'EV',
    avatarGradient: 'linear-gradient(135deg,#d4b896,#a8886a)',
    text: '"Absolutely stunning execution. The floral arrangements were breathtaking and the flow of the evening was perfect. We didn\'t have to worry about a single thing."',
  },
  {
    id: 2,
    name: 'The Sterling Group',
    date: 'August 2023',
    category: 'corporate',
    stars: 5,
    initials: 'SG',
    avatarGradient: 'linear-gradient(135deg,#8aa8c8,#5070a0)',
    text: '"The team handled our corporate retreat with such grace. Every detail was meticulously planned, allowing our executives to focus entirely on the strategy sessions."',
  },
  {
    id: 3,
    name: 'Marcus & Emily',
    date: 'June 2023',
    category: 'retreat',
    stars: 5,
    initials: 'ME',
    avatarGradient: 'linear-gradient(135deg,#a8c8a0,#709870)',
    text: '"We couldn\'t have asked for a better planner. They anticipated our needs before we even knew them."',
  },
  {
    id: 4,
    name: 'Julian Blackwood',
    date: 'September 2023',
    category: 'gala',
    stars: 5,
    initials: 'JB',
    avatarGradient: 'linear-gradient(135deg,#b8a8d0,#8878a8)',
    text: '"Professional, discrete, and utterly sophisticated. Our charity gala raised record funds thanks to the ambiance created by the Unwritten Events team. Highly recommended."',
  },
  {
    id: 5,
    name: 'Isabella R.',
    date: 'July 2023',
    category: 'wedding',
    stars: 5,
    initials: 'IR',
    avatarGradient: 'linear-gradient(135deg,#e0c0b0,#c09080)',
    text: '"My dream wedding came to life. I felt like a princess. Thank you for making it magical! The lighting design specifically transformed the venue into something out of a fairytale."',
  },
  {
    id: 6,
    name: 'Global Tech Inc.',
    date: 'May 2023',
    category: 'corporate',
    stars: 5,
    initials: 'GT',
    avatarGradient: 'linear-gradient(135deg,#90a8c0,#607890)',
    text: '"A seamless experience from start to finish. Highly recommended for high-stakes corporate events where precision matters."',
  },
];

const EXTRA_REVIEWS = [
  {
    id: 7,
    name: 'Natasha & David',
    date: 'March 2023',
    category: 'wedding',
    stars: 5,
    initials: 'ND',
    avatarGradient: 'linear-gradient(135deg,#e8c8c0,#c09888)',
    text: '"From the first consultation to the final dance, every moment was curated with love and precision. We are still receiving compliments months later."',
  },
  {
    id: 8,
    name: 'The Ashworth Foundation',
    date: 'November 2023',
    category: 'gala',
    stars: 5,
    initials: 'AF',
    avatarGradient: 'linear-gradient(135deg,#c0b0d8,#9080b0)',
    text: '"Our annual gala reached new heights this year. The team\'s creative vision and flawless logistics made it our most successful event to date."',
  },
  {
    id: 9,
    name: 'Vivienne & Thomas',
    date: 'April 2023',
    category: 'retreat',
    stars: 5,
    initials: 'VT',
    avatarGradient: 'linear-gradient(135deg,#b8d0b8,#80a080)',
    text: '"The private retreat they designed for us was beyond anything we imagined. Pure magic from start to finish."',
  },
];

const VIDEO_DATA = [
  {
    id: 1,
    title: 'The Henderson Wedding',
    location: 'Napa Valley, CA',
    duration: '2:14',
    gradient: 'linear-gradient(160deg,#2a2010,#504030)',
  },
  {
    id: 2,
    title: 'Apex Annual Summit',
    location: 'Downtown Convention Center',
    duration: '1:40',
    gradient: 'linear-gradient(160deg,#180828,#380848)',
  },
  {
    id: 3,
    title: 'Private Garden Soirée',
    location: 'The Botanical Gardens',
    duration: '3:20',
    gradient: 'linear-gradient(160deg,#283818,#486030)',
  },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

/**
 * Renders five star icons for a given rating.
 */
function StarRating({ count }) {
  return (
    <div className="tm-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`tm-star${i >= count ? ' tm-star--empty' : ''}`}>
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * Single review card.
 */
function ReviewCard({ review, animationDelay = 0 }) {
  return (
    <article
      className="tm-review-card"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="tm-review-card-header">
        <div className="tm-review-card-author">
          <div
            className="tm-review-avatar-placeholder"
            style={{ background: review.avatarGradient }}
            aria-hidden="true"
          >
            {review.initials}
          </div>
          <div className="tm-review-author-info">
            <div className="tm-review-author-name">{review.name}</div>
            <div className="tm-review-date">{review.date}</div>
          </div>
        </div>
        <span className={`tm-badge tm-badge--${review.category}`}>
          {review.category.charAt(0).toUpperCase() + review.category.slice(1)}
        </span>
      </div>

      <StarRating count={review.stars} />

      <p className="tm-review-text">{review.text}</p>
    </article>
  );
}

/**
 * Single video card.
 */
function VideoCard({ video }) {
  return (
    <div className="tm-video-card" role="button" tabIndex={0} aria-label={`Play video: ${video.title}`}>
      <div className="tm-video-thumb">
        <div
          className="tm-video-thumb-placeholder"
          style={{ background: video.gradient }}
        />
        <div className="tm-video-play-btn" aria-hidden="true">
          {/* Play triangle */}
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M1 1.5L15 9L1 16.5V1.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="tm-video-duration">{video.duration}</span>
      </div>
      <div className="tm-video-title">{video.title}</div>
      <div className="tm-video-location">{video.location}</div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

/**
 * TestimonialsPage
 *
 * Sections:
 *  1. Header (shared)
 *  2. Hero quote banner
 *  3. Category filter bar
 *  4. Masonry-style review grid (filterable + load more)
 *  5. Video testimonials grid
 *  6. CTA banner
 *  7. Footer (shared)
 */
export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState('All Reviews');
  const [showAll, setShowAll] = useState(false);

  /** All reviews combined; extra set is revealed by "Load More" */
  const allReviews = useMemo(
    () => (showAll ? [...REVIEWS_DATA, ...EXTRA_REVIEWS] : REVIEWS_DATA),
    [showAll],
  );

  /** Apply category filter */
  const filteredReviews = useMemo(() => {
    const key = FILTER_KEY_MAP[activeFilter];
    if (!key) return allReviews;
    return allReviews.filter((r) => r.category === key);
  }, [activeFilter, allReviews]);

  return (
    <div className="page-container">
      {/* ── Shared Header ── */}
      <Header />

      <main>
        {/* ── 1. Hero Quote Banner ── */}
        <section className="tm-hero" aria-label="Featured testimonial">
          <div className="tm-hero-bg" aria-hidden="true" />
          <div className="tm-hero-content">
            <div className="tm-hero-quote-icon" aria-hidden="true">❝</div>
            <blockquote className="tm-hero-quote">{HERO_QUOTE.text}</blockquote>
            <div className="tm-hero-divider" aria-hidden="true" />
            <p className="tm-hero-attribution">
              {HERO_QUOTE.names}
              <span>•</span>
              {HERO_QUOTE.event}
            </p>
          </div>
        </section>

        {/* ── 2. Filter Bar ── */}
        <nav className="tm-filters" aria-label="Filter reviews by category">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tm-filter-btn${activeFilter === cat ? ' active' : ''}`}
              onClick={() => {
                setActiveFilter(cat);
                setShowAll(false);
              }}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* ── 3. Review Grid ── */}
        <section className="tm-reviews" aria-label="Client reviews">
          {filteredReviews.length > 0 ? (
            <div className="tm-reviews-grid">
              {filteredReviews.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  animationDelay={i * 0.07}
                />
              ))}
            </div>
          ) : (
            <p
              style={{
                textAlign: 'center',
                padding: '60px 0',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                color: '#999',
                fontStyle: 'italic',
              }}
            >
              No reviews in this category yet.
            </p>
          )}

          {/* Load More */}
          {!showAll && (
            <div className="tm-load-more-wrap">
              <button
                className="tm-load-more-btn"
                onClick={() => setShowAll(true)}
                aria-label="Load more reviews"
              >
                Load More Reviews
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 2V12M7 12L3 8M7 12L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </section>

        {/* ── 4. Video Testimonials ── */}
        <section className="tm-video-section" aria-label="Video testimonials">
          <p className="tm-video-eyebrow">Watch the Magic</p>
          <h2 className="tm-video-heading">Video Testimonials</h2>
          <div className="tm-video-grid">
            {VIDEO_DATA.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* ── 5. CTA Banner ── */}
        <section className="tm-cta" aria-label="Call to action">
          <h2>Ready to Create Your Own Story?</h2>
          <p>
            Let us transform your vision into an unforgettable experience.
            Contact us today to begin planning your next luxury event.
          </p>
          <button className="tm-cta-btn" onClick={() => window.location.hash = '#/free-consultation'}>Book a Consultation</button>
        </section>
      </main>

      {/* ── Shared Footer ── */}
      <Footer />
    </div>
  );
}
