/**
 * consultation-router-snippet.jsx
 * ─────────────────────────────────────────────────────────────
 * Add these to your App.jsx hash-router alongside existing routes.
 * ─────────────────────────────────────────────────────────────
 *
 * STEP 1 — Imports to add in App.jsx:
 */

import FreeConsultation     from './pages/FreeConsultation';
import FreeConsultationDone from './pages/FreeConsultationDone';

/**
 * STEP 2 — Add to your router (order matters — /done before /contact):
 *
 *   if (hash === '#/contact/done') return <FreeConsultationDone />;
 *   if (hash === '#/contact')      return <FreeConsultation />;
 *
 * STEP 3 — Update Header.jsx nav link:
 *   Change: { label: 'CONTACT US', href: '#contact' }
 *   To:     { label: 'CONTACT US', href: '#/contact' }
 *
 * STEP 4 — CSS files to place in src/styles/:
 *   FreeConsultation.css        ← shared tokens + booking page styles
 *   FreeConsultationDone.css    ← confirmation page styles
 *
 * STEP 5 — File locations:
 *   src/
 *   ├── pages/
 *   │   ├── FreeConsultation.jsx      (#/contact)
 *   │   └── FreeConsultationDone.jsx  (#/contact/done)
 *   └── styles/
 *       ├── FreeConsultation.css
 *       └── FreeConsultationDone.css
 *
 * ─────────────────────────────────────────────────────────────
 * GOOGLE CALENDAR — QUICK START CHECKLIST
 * ─────────────────────────────────────────────────────────────
 *
 * OPTION A  Calendly Embed (30 min to go live):
 * ─────────────────────────────────────────────
 *   [ ] Sign up at https://calendly.com
 *   [ ] Create "30 Min Free Consultation" event type
 *   [ ] In index.html <head>:
 *         <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
 *         <script src="https://assets.calendly.com/assets/external/widget.js"></script>
 *   [ ] In FreeConsultation.jsx, replace <CalendarBlock /> with:
 *         <div
 *           className="calendly-inline-widget"
 *           data-url="https://calendly.com/YOUR_SLUG/30min?hide_gdpr_banner=1"
 *           style={{ minWidth: '320px', height: '700px' }}
 *         />
 *   [ ] Calendly handles: scheduling, Google Meet links, confirmation emails, reminders
 *
 * OPTION B  Google Calendar API (full control):
 * ─────────────────────────────────────────────
 *   [ ] Google Cloud Console → Enable "Google Calendar API"
 *   [ ] Create OAuth 2.0 credentials → download client_secret.json
 *   [ ] Run one-time OAuth flow to get refresh_token (store securely)
 *   [ ] Set env vars:
 *         GOOGLE_CLIENT_ID=...
 *         GOOGLE_CLIENT_SECRET=...
 *         GOOGLE_REFRESH_TOKEN=...
 *         GOOGLE_CALENDAR_ID=primary
 *         SENDGRID_API_KEY=...
 *         SENDGRID_CONFIRMATION_TEMPLATE_ID=...
 *   [ ] Build backend endpoints:
 *         GET  /api/availability?date=YYYY-MM-DD
 *              → returns { available: ["09:00","09:30",...] }
 *              → uses FreeBusy API: calendar.freebusy.query()
 *         POST /api/consultations/book
 *              → creates event: calendar.events.insert({ conferenceDataVersion:1, ... })
 *              → sends email: sgMail.send({ templateId, to, dynamicTemplateData })
 *              → saves to DB: db.bookings.insert({ ...payload, eventId, meetLink })
 *              → returns: { success, eventId, meetLink, calendarLink }
 *   [ ] In FreeConsultation.jsx:
 *         Replace fetchAvailableSlots() with real fetch('/api/availability?date=...')
 *         Replace submitBooking()      with real fetch('/api/consultations/book', {...})
 */

export default {};
