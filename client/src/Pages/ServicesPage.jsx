/**
 * ServicesPage Component
 * 
 * Services listing page with service grid, process, and add-ons.
 * Uses: Shared Header/Footer, external CSS, hash-based routing
 */

import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ServicesPage.css';

// Navigation links (for reference - Header component handles this)
const NAV_LINKS = [
  { label: 'HOME', href: '#/' },
  { label: 'SERVICES', href: '#/services', active: true },
  { label: 'TESTIMONIALS', href: '#/testimonials' },
  { label: 'OUR WORK', href: '#/our-work' },
  { label: 'BLOGS', href: '#/blogs' },
  { label: 'CONTACT US', href: '#/contact' },
];

// Service items data
const SERVICES = [
  { title: 'Full Room Transformation', desc: 'Complete immersive environment creation that alters the perception of space.' },
  { title: 'Backdrop & Draping', desc: 'Elegant fabric styling and custom backdrops to frame your most important moments.' },
  { title: 'Stage Design', desc: 'Platform artistry that elevates the focal point of your event with structural beauty.' },
  { title: 'Custom Prop Creation', desc: 'Bespoke fabrications and thematic installations built specifically for your narrative.' },
  { title: 'Ceremony Decor', desc: 'Thoughtful styling for the vow exchange area, creating a sacred atmosphere.' },
  { title: 'Centerpieces', desc: 'Striking floral and structural focal points that anchor your guest tables.' },
  { title: 'Fresh Florals', desc: 'Premium botanical arrangements sourced from top growers for lush visuals.' },
  { title: 'Rentals', desc: 'Exclusive access to high-end furniture, lounge sets, and décor pieces.' },
  { title: 'Stationery Design', desc: 'Custom paper goods including invitations, menus, and place cards.' },
  { title: 'Vinyl & Carpeting', desc: 'Personalised flooring solutions to define spaces and add texture.' },
  { title: 'Lighting', desc: 'Atmospheric illumination to set the mood and highlight key design elements.' },
  { title: 'Head Table Design', desc: 'Signature bridal seating arrangements designed to stand out.' },
  { title: 'DJ & Entertainment', desc: 'World-class sound and curated performances to energise your celebration.' },
  { title: 'Photography & Videography', desc: 'Cinematic sourcing and editorial imagery to preserve every precious moment.' },
  { title: 'Limo & Car Rentals', desc: 'Sophisticated transportation solutions for a grand arrival and seamless journey.' },
  { title: 'Cultural Events', desc: 'Authentic celebrations honouring traditions with vibrant colors and rich heritage details.' },
  { title: 'Dhol Players', desc: 'High-energy rhythmic performances that command attention and ignite the dance floor.' },
  { title: 'Hair & Makeup', desc: 'Exquisite beauty styling designed to enhance your natural radiance for your finest moments.' },
  { title: 'Mehndi Artist', desc: 'Masterfully applied henna patterns that blend contemporary style with timeless cultural artistry.' },
];

// Process steps data
const PROCESS_STEPS = [
  { icon: '◻', title: 'Consultation', desc: 'Initial meeting to understand your vision and needs.' },
  { icon: '◈', title: 'Design', desc: 'Creating bespoke mood boards and detailed concepts.' },
  { icon: '◻', title: 'Coordination', desc: 'Managing logistics, vendors, and detailed timelines.' },
  { icon: '◈', title: 'Execution', desc: 'Flawless event day management so you can relax.' },
];

// Gradient palette for service card placeholders
const PALETTES = [
  'linear-gradient(160deg,#c8b89880,#8a7860)',
  'linear-gradient(160deg,#d0e0d0,#7a9870)',
  'linear-gradient(160deg,#181818,#303030)',
  'linear-gradient(160deg,#e0d8cc,#b8a890)',
  'linear-gradient(160deg,#b0c8a0,#708060)',
  'linear-gradient(160deg,#f0d8d8,#d09898)',
  'linear-gradient(160deg,#c8a888,#a07850)',
  'linear-gradient(160deg,#d8e0e8,#a0b0c0)',
  'linear-gradient(160deg,#e8e4dc,#c0b8a8)',
  'linear-gradient(160deg,#c09060,#806040)',
  'linear-gradient(160deg,#300840,#600878)',
  'linear-gradient(160deg,#2a1808,#604828)',
  'linear-gradient(160deg,#b8a878,#887848)',
  'linear-gradient(160deg,#181820,#303048)',
  'linear-gradient(160deg,#202020,#383838)',
  'linear-gradient(160deg,#d8d0c8,#b8a890)',
  'linear-gradient(160deg,#c8a858,#988038)',
  'linear-gradient(160deg,#e07828,#c05818)',
  'linear-gradient(160deg,#c8a0b0,#906878)',
  'linear-gradient(160deg,#c89060,#a06840)',
];

export default function ServicesPage() {
  return (
    <div className="sp-root page-container">
      <Header />

      {/* PAGE HEADER */}
      <div className="sp-page-header">
        <h1>Our Services</h1>
      </div>

      {/* INTRO */}
      <div className="sp-section-intro">
        <h2>Full Service Event Design</h2>
        <p>
          We believe each event is unique to you. During the consultation, we'll work together to
          determine the budget for your event based on your needs, scope of the project &amp; vision
          to create a customised solution that fits your requirements.
        </p>
      </div>

      {/* SERVICE CARDS */}
      <section id="services" className="sp-service-grid">
        <div className="sp-grid">
          {SERVICES.map((svc, i) => (
            <div className="sp-card" key={`${svc.title}-${i}`}>
              <div
                className="sp-card-placeholder"
                style={{ background: PALETTES[i % PALETTES.length] }}
                aria-label={svc.title}
              >
                {/* SERVICE IMAGE PLACEMENT: Replace div with <img className="sp-card-img" src="assets/images/service-{i}.jpg" alt="{svc.title}" /> */}
              </div>
              <div className="sp-card-title">{svc.title}</div>
              <div className="sp-card-desc">{svc.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="sp-process">
        <h2>Our Process</h2>
        <p className="sp-process-tagline">A seamless journey from inspiration to celebration.</p>
        <div className="sp-process-steps">
          {PROCESS_STEPS.map((step) => (
            <div className="sp-step" key={step.title}>
              <div className="sp-step-icon">{step.icon}</div>
              <div className="sp-step-title">{step.title}</div>
              <div className="sp-step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ADD-ONS */}
      <div className="sp-addons">
        <div className="sp-addon">
          <span className="sp-addon-icon">📍</span>
          <div>
            <h4>Venue Sourcing</h4>
            <p>
              Access to exclusive, hidden-gem locations and premier estates worldwide.
              We handle negotiations and contracts.
            </p>
          </div>
        </div>
        <div className="sp-addon">
          <span className="sp-addon-icon">✦</span>
          <div>
            <h4>Catering &amp; Mixology</h4>
            <p>
              Curating culinary experiences with top-tier chefs and mixologists to
              create custom menus that delight.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
