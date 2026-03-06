/**
 * AboutPage.jsx — Unwritten Events · About / Our Story
 *
 * Industry-standard patterns used:
 *  - CSS imported separately (AboutPage.css)
 *  - Data arrays declared outside the component to avoid re-creation
 *  - useRef for video player control
 *  - Prop-driven sub-components (ValueCard, TeamMember) for reusability
 *  - Graceful fallback UI when media assets are missing
 *  - WCAG-friendly alt text and aria labels throughout
 */

import { useRef, useState } from "react";
import "../styles/OurWork.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ─────────────────────────────────────────────
// DATA  (swap copy / srcs here without touching JSX)
// ─────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'HOME', href: '#/' },
  { label: 'SERVICES', href: '#/services'},
  { label: 'TESTIMONIALS', href: '#/testimonials' },
  { label: 'OUR WORK', href: '#/our-work', active: true },
  { label: 'BLOGS', href: '#/blogs' },
  { label: 'CONTACT US', href: '#/contact' },
];

const STORY_PARAGRAPHS = [
  `We’re two best friends from childhood who share a love for connection, creativity, and meaningful experiences. From the very beginning, what excited us most wasn’t just planning or décor, it was working closely with clients, hearing their stories, and helping bring their vision to life in a way that felt personal and unforgettable.`,

  `Every day, we pour our hearts into what we do, alongside our amazing team, to ensure that every detail is thoughtful, intentional, and beautifully executed. Watching someone’s eyes fill with emotion as their ideas become reality reminds us why we do what we do: it’s about more than events, it’s about creating experiences that touch the heart.`,

  `Unwritten Events exists to bring that same care, passion, and attention to every celebration. Together, we listen, collaborate, and work tirelessly to make each event feel personal, elevated, and uniquely yours.`,
];

const CORE_VALUES = [
  {
    icon: "🎯",
    title: "Precision",
    desc: `Meticulous planning down to the last detail. We manage the intricacies so you can
           remain focused on the celebration.`,
  },
  {
    icon: "💡",
    title: "Creativity",
    desc: `Innovative designs that push the boundaries of tradition while respecting the
           timeless elements of high-end style.`,
  },
  {
    icon: "✦",
    title: "Stress-Free",
    desc: `A seamless experience from initial consultation to the final farewell, ensuring
           you enjoy every single moment.`,
  },
];

const TEAM_MEMBERS = [
  {
    name: "Jonathan Dara",
    role: "Head of Operations",
    // src: "assets/images/team_julian.jpg",
    gradient: "linear-gradient(160deg,#1a1a2a,#303050)",
  },
  {
    name: "Johanna Pen",
    role: "Lead Designer",
    // src: "assets/images/team_eleanor.jpg",
    gradient: "linear-gradient(160deg,#d8e0e8,#a0b0c0)",
  },
  {
    name: "Sofia",
    role: "Creative Director",
    // src: "assets/images/team_sofia.jpg",
    gradient: "linear-gradient(160deg,#1a2030,#2a3050)",
  },
  {
    name: "Melo",
    role: "Senior Planner",
    // src: "assets/images/team_marcus.jpg",
    gradient: "linear-gradient(160deg,#e0dcd8,#b0a898)",
  },
];

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** Shared site navigation — identical across all pages */
function SiteNav() {
  return (
    <header className="ap-nav" role="banner">
      <div className="ap-nav-logo">
        <div className="ap-logo-monogram" aria-label="Unwritten Events">UE</div>
        <div className="ap-logo-name">UNWRITTEN EVENTS</div>
        <div className="ap-logo-tagline">crafting memories one chapter at a time</div>
      </div>
      <nav aria-label="Primary navigation">
        <ul className="ap-nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={link.active ? "active" : undefined}
                aria-current={link.active ? "page" : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

/** Full-width hero banner with italic quote overlay */
function HeroBanner() {
  return (
    <section className="ap-hero" aria-label="Our Work hero">
      <div className="ap-hero-bg" aria-hidden="true" />
      <div className="ap-hero-overlay" aria-hidden="true" />
      <div className="ap-hero-content">
        <p className="ap-hero-eyebrow">Our Vision</p>
        <h1 className="ap-hero-title">We Believe Every Detail Tells a Story</h1>
        <div className="ap-hero-divider" aria-hidden="true" />
      </div>
    </section>
  );
}

/**
 * Co-founder video block with native HTML5 <video> player.
 *
 * Props:
 *   videoSrc  {string}  — path to the co-founder video file (~2 min)
 *                          e.g. "assets/videos/cofounders_intro.mp4"
 *   posterSrc {string}  — optional thumbnail image shown before play
 */
function FounderVideo({ videoSrc, posterSrc }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handlePlayToggle = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
    }
  };

  const hasVideo = Boolean(videoSrc);

  return (
    <div className="ap-story-media">
      {/* Decorative left-border accent from Figma */}
      <div className="ap-story-media-border" aria-hidden="true" />

      <div className="ap-video-wrapper">
        {hasVideo ? (
          /*
           * Native video player — controls shown by default so users can
           * scrub, mute, and go fullscreen. Remove `controls` if you want
           * a fully custom play button UI.
           */
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            controls
            preload="metadata"
            aria-label="Co-founders introduction video"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        ) : (
          /* ── Placeholder shown until the video file is dropped in ── */
          <div
            className="ap-video-placeholder"
            role="img"
            aria-label="Co-founder video coming soon"
          >
            <div className="ap-video-placeholder-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="ap-video-placeholder-label">Meet the Co-Founders</span>
            <span className="ap-video-placeholder-sub">
              Drop your video file at<br />
              <code>assets/videos/cofounders_intro.mp4</code>
            </span>
          </div>
        )}
      </div>

      <p className="ap-video-caption">
        {hasVideo
          ? "A message from our co-founders · ~2 min"
          : "Co-founder introduction video · ~2 min · MP4 / WebM supported"}
      </p>
    </div>
  );
}

/** Single value card — used inside the 3-col grid */
function ValueCard({ icon, title, desc }) {
  return (
    <article className="ap-value-card">
      <div className="ap-value-icon" aria-hidden="true">{icon}</div>
      <h3 className="ap-value-title">{title}</h3>
      <p className="ap-value-desc">{desc}</p>
    </article>
  );
}

/** Single team member avatar + name + role */
function TeamMember({ name, role, src, gradient }) {
  return (
    <div className="ap-team-member">
      <div className="ap-team-avatar">
        {src ? (
          <img src={src} alt={`Portrait of ${name}`} />
        ) : (
          <div
            className="ap-team-avatar-placeholder"
            style={{ background: gradient }}
            aria-label={name}
          />
        )}
      </div>
      <span className="ap-team-name">{name}</span>
      <span className="ap-team-role">{role}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────

/**
 * AboutPage
 *
 * To wire up the co-founder video, pass the file path as a prop or
 * hardcode it in the videoSrc variable below once the asset is available.
 *
 * Example (once video is ready):
 *   <FounderVideo videoSrc="assets/videos/cofounders_intro.mp4"
 *                 posterSrc="assets/images/cofounders_poster.jpg" />
 */
export default function OurWork() {
  // ── swap these paths when your assets are ready ──────────────────
  const COFOUNDER_VIDEO_SRC  = "";   // e.g. "assets/videos/cofounders_intro.mp4"
  const COFOUNDER_POSTER_SRC = "";   // e.g. "assets/images/cofounders_poster.jpg"
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="ap-root">

      {/* ── Shared Header ── */}
      <Header />

      {/* ── Hero banner ── */}
      <HeroBanner />

      {/* ── Our Story ── */}
      <section className="ap-story" aria-labelledby="story-heading">
        {/* Left — co-founder video */}
        <FounderVideo
          videoSrc={COFOUNDER_VIDEO_SRC}
          posterSrc={COFOUNDER_POSTER_SRC}
        />

        {/* Right — copy block */}
        <div className="ap-story-copy">
          <p className="ap-story-eyebrow">Our story</p>
          <h2 className="ap-story-heading" id="story-heading">
            A Legacy of Refined Celebrations
          </h2>
          <div className="ap-story-body">
            {STORY_PARAGRAPHS.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="ap-values" aria-labelledby="values-heading">
        <h2 className="ap-values-heading" id="values-heading">Our Core Values</h2>
        <div className="ap-values-grid">
          {CORE_VALUES.map((val) => (
            <ValueCard key={val.title} {...val} />
          ))}
        </div>
      </section>

      {/* ── Meet the Team ── */}
      <section className="ap-team" aria-labelledby="team-heading">
        <p className="ap-team-eyebrow">THE ARTISANS</p>
        <h2 className="ap-team-heading" id="team-heading">Meet the Team</h2>
        <div className="ap-team-grid">
          {TEAM_MEMBERS.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="ap-cta" aria-label="Call to action">
        <h2>Ready to write your next chapter?</h2>
        <p className="ap-cta-sub">
          Let's collaborate on an event that is uniquely yours. From grand galas to intimate celebrations.
        </p>
        <button className="ap-cta-btn" type="button" onClick={() => window.location.hash = '#/free-consultation'}>
          Book a Consultation
        </button>
      </section>

      {/* ── Footer ── */}
      <Footer />

    </div>
  );
}
