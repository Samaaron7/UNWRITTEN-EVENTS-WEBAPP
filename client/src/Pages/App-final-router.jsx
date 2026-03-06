/**
 * App.jsx — Complete Hash Router (All Pages)
 * ─────────────────────────────────────────────────────────────
 * Drop this into your existing App.jsx to wire up the final page
 * and confirm all routes are connected.
 *
 * This is the COMPLETE route map for the entire Unwritten Events site.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';

// ── Page imports ──────────────────────────────────────────────
import UnwrittenEvents      from './pages/UnwrittenEvents';       // #/
import ServicesPage         from './pages/ServicesPage';          // #/services
import AboutPage            from './pages/AboutPage';             // #/our-work
import TestimonialsPage     from './pages/TestimonialsPage';      // #/testimonials
import Blogs                from './pages/Blogs';                 // #/blogs
import BlogPage1            from './pages/BlogPage1';             // #/blogs/1
import BlogPage2            from './pages/BlogPage2';             // #/blogs/2
import BlogPage3            from './pages/BlogPage3';             // #/blogs/3
import BlogPage4            from './pages/BlogPage4';             // #/blogs/4
import FreeConsultation     from './pages/FreeConsultation';      // #/contact
import FreeConsultationDone from './pages/FreeConsultationDone';  // #/contact/done
import ContactUs            from './pages/ContactUs';             // #/contact-us

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ── Route matching (longest/most specific first) ──────────
  if (hash === '#/contact/done')   return <FreeConsultationDone />;
  if (hash === '#/contact')        return <FreeConsultation />;
  if (hash === '#/contact-us')     return <ContactUs />;
  if (hash === '#/blogs/1')        return <BlogPage1 />;
  if (hash === '#/blogs/2')        return <BlogPage2 />;
  if (hash === '#/blogs/3')        return <BlogPage3 />;
  if (hash === '#/blogs/4')        return <BlogPage4 />;
  if (hash === '#/blogs')          return <Blogs />;
  if (hash === '#/services')       return <ServicesPage />;
  if (hash === '#/testimonials')   return <TestimonialsPage />;
  if (hash === '#/our-work')       return <AboutPage />;

  // Default: Home
  return <UnwrittenEvents />;
}

/**
 * ─────────────────────────────────────────────────────────────
 * HEADER.JSX — Update nav links to final correct hrefs:
 * ─────────────────────────────────────────────────────────────
 *
 * const navLinks = [
 *   { label: 'HOME',         href: '#/' },
 *   { label: 'SERVICES',     href: '#/services' },
 *   { label: 'OUR WORK',     href: '#/our-work' },
 *   { label: 'TESTIMONIALS', href: '#/testimonials' },
 *   { label: 'BLOGS',        href: '#/blogs' },          ← was '#blogs'
 *   { label: 'CONTACT US',   href: '#/contact-us' },     ← was '#contact'
 * ];
 *
 * ─────────────────────────────────────────────────────────────
 * COMPLETE FILE MANIFEST — all pages and styles
 * ─────────────────────────────────────────────────────────────
 *
 * src/
 * ├── components/
 * │   ├── Header.jsx
 * │   └── Footer.jsx
 * │
 * ├── pages/
 * │   ├── UnwrittenEvents.jsx       Home              #/
 * │   ├── ServicesPage.jsx          Services          #/services
 * │   ├── AboutPage.jsx             Our Work/About    #/our-work
 * │   ├── Testimonials.jsx          Testimonials      #/testimonials
 * │   ├── Blogs.jsx                 Blog listing      #/blogs
 * │   ├── BlogPage1.jsx             Blog article 1    #/blogs/1
 * │   ├── BlogPage2.jsx             Blog article 2    #/blogs/2
 * │   ├── BlogPage3.jsx             Blog article 3    #/blogs/3
 * │   ├── BlogPage4.jsx             Blog article 4    #/blogs/4
 * │   ├── FreeConsultation.jsx      Booking calendar  #/contact
 * │   ├── FreeConsultationDone.jsx  Confirmation      #/contact/done
 * │   └── ContactUs.jsx             Contact form      #/contact-us  ← NEW
 * │
 * └── styles/
 *     ├── Header.css
 *     ├── PageTransition.css
 *     ├── UnwrittenEvents.css
 *     ├── ServicesPage.css
 *     ├── AboutPage.css
 *     ├── Testimonials.css
 *     ├── Blogs.css
 *     ├── BlogPage.css               (shared by BlogPage1–4)
 *     ├── FreeConsultation.css
 *     ├── FreeConsultationDone.css
 *     └── ContactUs.css              ← NEW
 *
 * ─────────────────────────────────────────────────────────────
 * BACKEND ENDPOINTS — complete summary for your API team
 * ─────────────────────────────────────────────────────────────
 *
 * CONTACT FORM
 *   POST   /api/contact
 *   GET    /api/admin/contacts            (admin portal list)
 *   GET    /api/admin/contacts/:id        (admin portal detail)
 *   PATCH  /api/admin/contacts/:id/status (mark read/replied/archived)
 *
 * BOOKING (Free Consultation)
 *   GET    /api/availability?date=YYYY-MM-DD   (Google Calendar FreeBusy)
 *   POST   /api/consultations/book             (create Calendar event + Send email)
 *   GET    /api/admin/bookings                 (admin portal)
 *
 * SETTINGS (optional, for admin-editable content)
 *   GET    /api/settings                  (contact info, hours, social links)
 *   PATCH  /api/admin/settings            (admin update)
 *
 * AUTHENTICATION (protect all /api/admin/* routes)
 *   POST   /api/auth/login
 *   POST   /api/auth/logout
 *   GET    /api/auth/me
 *
 * ENVIRONMENT VARIABLES (.env)
 *   GOOGLE_CLIENT_ID=
 *   GOOGLE_CLIENT_SECRET=
 *   GOOGLE_REFRESH_TOKEN=
 *   GOOGLE_CALENDAR_ID=primary
 *   VITE_GOOGLE_MAPS_EMBED_KEY=          (ContactUs map embed)
 *   SENDGRID_API_KEY=
 *   SENDGRID_FROM_EMAIL=hello@unwrittenevents.com
 *   SENDGRID_CONFIRMATION_TEMPLATE_ID=   (booking confirmation)
 *   SENDGRID_CONTACT_TEMPLATE_ID=        (contact form notification)
 *   SENDGRID_AUTOREPLY_TEMPLATE_ID=      (auto-reply to user)
 *   MAILCHIMP_API_KEY=                   (newsletter opt-in)
 *   MAILCHIMP_LIST_ID=
 *   ADMIN_JWT_SECRET=
 *   DATABASE_URL=                        (Postgres / MySQL / Mongo)
 * ─────────────────────────────────────────────────────────────
 */
