/**
 * Blogs.jsx — Unwritten Events · Blog listing page
 *
 * Layout:
 *  1. Shared Header
 *  2. Hero banner with italic title
 *  3. Category filter bar
 *  4. 4-card blog grid (2 × 2) — each card navigates to its BlogPage via hash routing
 *  5. Dark CTA banner
 *  6. Shared Footer
 *
 * Routing: hash-based, consistent with the rest of the site
 *   #/blogs/1  →  BlogPage1
 *   #/blogs/2  →  BlogPage2
 *   #/blogs/3  →  BlogPage3
 *   #/blogs/4  →  BlogPage4
 *
 * Patterns: mirrors Testimonials.jsx (filter state, animation delay, data arrays outside component)
 */

import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Blogs.css';
import '../styles/PageTransition.css';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const FILTER_CATEGORIES = ['All', 'Trends', 'Hosting', 'Design', 'Lifestyle'];

/**
 * Master blog posts array.
 * To add a real image replace `thumbGradient` with:
 *   thumbSrc: 'src/assets/frontEnd-images/blog-1.jpg'
 * and render <img src={post.thumbSrc} /> inside .bl-card-thumb.
 */
export const BLOG_POSTS = [
  {
    id: 1,
    slug: '#/blogs/1',
    category: 'Trends',
    badgeVariant: 'trends',
    date: 'May 12, 2024',
    title: 'Embracing Minimalism in Floral Design',
    excerpt:
      'Discover how less can truly be more when it comes to creating impact with your centerpiece arrangements.',
    thumbGradient: 'linear-gradient(160deg, #f0e8dc 0%, #c8b89870 60%, #a89878 100%)',
    // thumbSrc: 'src/assets/frontEnd-images/blog-floral.jpg',
    readTime: '5 min read',
  },
  {
    id: 2,
    slug: '#/blogs/2',
    category: 'Hosting',
    badgeVariant: 'hosting',
    date: 'April 28, 2024',
    title: 'The Art of the Table Setting',
    excerpt:
      'A guide to layering textures, colors, and heights to create an unforgettable dining experience for your guests.',
    thumbGradient: 'linear-gradient(160deg, #182028 0%, #283848 60%, #304050 100%)',
    // thumbSrc: 'src/assets/frontEnd-images/blog-table.jpg',
    readTime: '4 min read',
  },
  {
    id: 3,
    slug: '#/blogs/3',
    category: 'Design',
    badgeVariant: 'design',
    date: 'March 15, 2024',
    title: 'How Lighting Transforms a Venue',
    excerpt:
      'From warm candlelight to dramatic uplighting — learn how the right illumination elevates every celebration.',
    thumbGradient: 'linear-gradient(160deg, #300848 0%, #601080 50%, #380858 100%)',
    // thumbSrc: 'src/assets/frontEnd-images/blog-lighting.jpg',
    readTime: '6 min read',
  },
  {
    id: 4,
    slug: '#/blogs/4',
    category: 'Lifestyle',
    badgeVariant: 'lifestyle',
    date: 'February 3, 2024',
    title: 'Planning a Stress-Free Wedding Day',
    excerpt:
      'Our senior planners share their top ten strategies for arriving at your own wedding calm, present, and radiant.',
    thumbGradient: 'linear-gradient(160deg, #e8dcd0 0%, #c8a888 50%, #b09070 100%)',
    // thumbSrc: 'src/assets/frontEnd-images/blog-wedding.jpg',
    readTime: '7 min read',
  },
];

// ─────────────────────────────────────────────
// SUB-COMPONENT: BlogCard
// ─────────────────────────────────────────────

/**
 * BlogCard
 * Fully clickable card — navigates to the individual BlogPage via hash routing.
 * Uses <button> with role="article" semantics for accessibility.
 *
 * @param {object} post          — blog post data object
 * @param {number} animationDelay — stagger delay in seconds
 */
function BlogCard({ post, animationDelay }) {
  const handleNavigate = () => {
    window.location.hash = post.slug.replace('#', '');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNavigate();
    }
  };

  return (
    <article
      className="bl-card"
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${post.title}`}
    >
      {/* ── Thumbnail ── */}
      <div className="bl-card-thumb">
        {post.thumbSrc ? (
          <img
            src={post.thumbSrc}
            alt={post.title}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'block';
            }}
          />
        ) : null}
        <div
          className="bl-card-thumb-placeholder"
          style={{
            background: post.thumbGradient,
            display: post.thumbSrc ? 'none' : 'block',
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Body ── */}
      <div className="bl-card-body">
        <div className="bl-card-meta">
          <span className={`bl-card-badge bl-card-badge--${post.badgeVariant}`}>
            {post.category}
          </span>
          <span className="bl-card-date">{post.date}</span>
          <span className="bl-card-date" style={{ marginLeft: 'auto' }}>{post.readTime}</span>
        </div>

        <h2 className="bl-card-title">{post.title}</h2>
        <p className="bl-card-excerpt">{post.excerpt}</p>

        <span className="bl-card-read-more" aria-hidden="true">
          Read Article
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7H12M12 7L8 3M12 7L8 11"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────

export default function Blogs() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="page-container">
      {/* ── Shared Header ── */}
      <Header />

      <main>
        {/* ── 1. Hero Banner ── */}
        <section className="bl-hero" aria-label="Blogs hero">
          <div className="bl-hero-bg" aria-hidden="true" />
          <div className="bl-hero-overlay" aria-hidden="true" />
          <div className="bl-hero-content">
            <p className="bl-hero-eyebrow">The Journal</p>
            <h1 className="bl-hero-title">Latest from the Journal</h1>
            <div className="bl-hero-divider" aria-hidden="true" />
          </div>
        </section>

        {/* ── 2. Filter Bar ── */}
        <nav className="bl-filters" aria-label="Filter blog posts by category">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`bl-filter-btn${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* ── 3. Section Header ── */}
        <div className="bl-section-header">
          <h2 className="bl-section-label">Latest from the Journal</h2>
        </div>

        {/* ── 4. Blog Grid ── */}
        <section className="bl-grid-section" aria-label="Blog posts">
          <div className="bl-grid">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, i) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  animationDelay={i * 0.08}
                />
              ))
            ) : (
              <p className="bl-empty">No articles in this category yet.</p>
            )}
          </div>
        </section>

        {/* ── 5. CTA Banner ── */}
        <section className="bl-cta" aria-label="Call to action">
          <h2>Ready to Write Your Story?</h2>
          <p className="bl-cta-sub">
            Let's bring your vision to life — from intimate celebrations to grand galas.
          </p>
          <button
            className="bl-cta-btn"
            onClick={() => { window.location.hash = '#/free-consultation'; }}
            type="button"
          >
            Book a Consultation
          </button>
        </section>
      </main>

      {/* ── Shared Footer ── */}
      <Footer />
    </div>
  );
}
