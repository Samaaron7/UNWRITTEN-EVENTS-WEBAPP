/**
 * UnwrittenEvents Page Component
 * 
 * Main landing page showcasing event gallery, values, journal, and CTAs.
 * Uses: Shared Header/Footer, external CSS, hash-based routing
 */

import { useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/UnwrittenEvents.css';

// Gallery items
const GALLERY_ITEMS = [
  { label: 'Bridal Shower' },
  { label: 'Housewarming' },
  { label: 'Wedding Plan' },
  { label: 'Summer Solstice Gala' },
  { label: 'Vineyard Wedding' },
  { label: 'Nordic Winter Retreat' },
];

// Journal articles
const JOURNAL_ARTICLES = [
  {
    tag: 'Floral Design',
    title: 'Embracing Minimalism in Floral Design',
    excerpt:
      'Discover how less truly becomes more when styling tablescape arrangements with intention and grace.',
  },
  {
    tag: 'Table Setting',
    title: 'The Art of the Table Setting',
    excerpt:
      'A guide to layering textures, colors, and the right details to create an unforgettable dining experience for guests.',
  },
];

// Gradient palette for scrolling strip
const stripColors = [
  'linear-gradient(135deg,#e8dfd8,#c9a8a0)',
  'linear-gradient(135deg,#d8e0d0,#a8b8a0)',
  'linear-gradient(135deg,#e0d8e8,#b0a8c8)',
  'linear-gradient(135deg,#e8e0d0,#c8b898)',
  'linear-gradient(135deg,#dce8e4,#a0b8b0)',
  'linear-gradient(135deg,#e8d8d8,#c8a0a0)',
  'linear-gradient(135deg,#d8dce8,#a0a8c0)',
  'linear-gradient(135deg,#e4e8d8,#b0b890)',
];

export default function UnwrittenEvents() {
  const stripRef = useRef(null);

  return (
    <div className="ue-root page-container">
      <Header />

      {/* HERO */}
      <section id="home" className="ue-hero">
        <div className="ue-hero-img-wrap">
          {/* HERO IMAGE: Replace src with your image path, e.g., "assets/images/hero-home.jpg" */}
          <img
            src="assets/images/hero-home.jpg"
            alt="Elegant wedding setup"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div
            style={{
              display: 'none',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(160deg, #e0ebe8 0%, #c8bdb6 40%, #d4c8c0 70%, #e0d4cc 100%)',
            }}
          />
          <div className="ue-hero-gradient-overlay" />
          <div className="ue-hero-copy">
            <h1 className="ue-hero-title">Unwritten Events</h1>
            <p className="ue-hero-sub">
              Transform your vision into an extraordinary, stress-free celebration
              with exquisite floral, bespoke décor, and expert planning—luxury event
              production at its finest in New York.
            </p>
            <button className="ue-hero-cta">Schedule FREE Strategy Call</button>
          </div>
        </div>
      </section>

      {/* SCROLLING IMAGE STRIP */}
      <div className="ue-strip">
        <div className="ue-strip-fade-left" />
        <div className="ue-strip-inner" ref={stripRef}>
          {[...stripColors, ...stripColors].map((bg, i) => (
            <div
              key={i}
              style={{
                width: 280,
                height: 200,
                flexShrink: 0,
                borderRadius: 4,
                background: bg,
              }}
            >
              {/* STRIP IMAGES: Replace div with <img src="assets/images/strip-{index}.jpg" /> */}
            </div>
          ))}
        </div>
        <div className="ue-strip-fade-right" />
      </div>

      {/* WHO WE ARE */}
      <section className="ue-who">
        <h2>WHO WE ARE</h2>
        <p>
          Our warm and welcoming approach makes you feel like family. With a
          friendly demeanor at the heart of our service, every interaction is a
          delightful experience. We pride ourselves on building genuine
          connections, ensuring you always feel heard and valued.
        </p>
        <div className="ue-who-cta-row">
          <button className="ue-who-btn">SEE OUR WORK!</button>
          <p className="ue-who-tagline">A COHESIVE EXPERIENCE, FROM START TO FINISH</p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="ue-gallery">
        <div className="ue-gallery-row">
          {GALLERY_ITEMS.slice(0, 3).map((item) => (
            <figure className="ue-gallery-card" key={item.label}>
              <div
                className="ue-gallery-placeholder"
                style={{
                  height: 240,
                  borderRadius: 20,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  background: 'linear-gradient(135deg, #c8c0b8, #a8a0a890)',
                }}
              >
                {/* GALLERY IMAGE: Replace div with <img className="ue-gallery-card img" src="assets/images/gallery-1.jpg" alt="{item.label}" /> */}
              </div>
              <figcaption className="ue-gallery-caption">{item.label}</figcaption>
            </figure>
          ))}
        </div>
        <div className="ue-gallery-row">
          {GALLERY_ITEMS.slice(3).map((item) => (
            <figure className="ue-gallery-card" key={item.label}>
              <div
                className="ue-gallery-placeholder"
                style={{
                  height: 240,
                  borderRadius: 20,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  background: 'linear-gradient(135deg, #383838, #181818)',
                }}
              >
                {/* GALLERY IMAGE: Replace div with <img className="ue-gallery-card img" src="assets/images/gallery-2.jpg" alt="{item.label}" /> */}
              </div>
              <figcaption className="ue-gallery-caption">{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CRAFTING MOMENTS */}
      <section className="ue-crafting">
        <h2>CRAFTING UNFORGETTABLE MOMENTS.</h2>
        <h3>TURNING THE ORDINARY INTO EXTRAORDINARY STORIES.</h3>
        <div className="ue-crafting-grid">
          {[
            {
              title: 'Trust',
              body: 'Count on us to deliver not just events, but trust in the flawless execution of your dreams.',
            },
            {
              title: 'Experience',
              body: 'With 10+ years of expertise, we provide an unparalleled experience tailored just for you.',
            },
            {
              title: 'Luxury',
              body: 'Elevate your celebration with our signature touch of opulence and refined elegance.',
            },
            {
              title: 'Reliable',
              body: 'In a world of uncertainties, we are the reassuring presence that guides you through every step.',
            },
          ].map((item) => (
            <div className="ue-crafting-item" key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        <button className="ue-crafting-btn">LET'S CHAT!</button>
      </section>

      {/* JOURNAL / BLOG */}
      <section className="ue-journal">
        <h2>Latest from the Journal</h2>
        <div className="ue-journal-grid">
          {JOURNAL_ARTICLES.map((article) => (
            <div className="ue-journal-card" key={article.title}>
              <div
                className="ue-journal-placeholder"
                style={{
                  background:
                    article.tag === 'Floral Design'
                      ? 'linear-gradient(135deg,#e0d4c0,#c8b8a0)'
                      : 'linear-gradient(135deg,#282828,#181818)',
                  color: article.tag === 'Floral Design' ? '#999' : '#555',
                }}
              >
                {/* JOURNAL IMAGE: Replace div with <img className="ue-journal-card-img" src="assets/images/journal-1.jpg" alt="{article.title}" /> */}
                IMAGE
              </div>
              <div className="ue-journal-body">
                <span className="ue-journal-tag">{article.tag}</span>
                <div className="ue-journal-title">{article.title}</div>
                <p className="ue-journal-excerpt">{article.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
