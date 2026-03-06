/**
 * FreeConsultationDone.jsx
 * Unwritten Events · Booking Confirmation Page
 *
 * Route: #/contact/done
 *
 * ─────────────────────────────────────────────────────────────
 * BACKEND INTEGRATION NOTES
 * ─────────────────────────────────────────────────────────────
 * This page is reached after a successful POST /api/consultations/book.
 *
 * Booking data is read from sessionStorage key "ue_booking" (written
 * by FreeConsultation.jsx immediately before navigating here).
 *
 * ALTERNATIVE — URL param approach (more robust if user refreshes):
 *   Navigate to: #/contact/done?eventId=google_event_id
 *   Then fetch:  GET /api/consultations/{eventId}
 *   Response:    { name, email, displayDate, time, eventType, meetLink, calendarLink }
 *   This avoids data loss on hard refresh and is recommended for production.
 *
 * WHAT SHOULD HAVE ALREADY HAPPENED ON THE BACKEND before landing here:
 *   1. Google Calendar event created with conferencing (Google Meet)
 *   2. Attendee added to calendar event → triggers Google Calendar email invite
 *   3. Confirmation email sent via SendGrid using transactional template
 *   4. Booking row inserted into your database (bookings table)
 *   5. Optional: CRM lead created / updated (HubSpot, Salesforce, etc.)
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/FreeConsultation.css';   // reuses shared tokens
import '../styles/FreeConsultationDone.css';
import '../styles/PageTransition.css';

// ─────────────────────────────────────────────
// NEXT STEPS DATA — shown as action items on the done page
// BACKEND: These are static — no API needed
// ─────────────────────────────────────────────
const NEXT_STEPS = [
  {
    icon: '📧',
    title: 'Check your inbox',
    desc: 'A calendar invitation has been sent to your email address. Accept it to add the event to your calendar.',
    // BACKEND: Invite sent by Google Calendar API via attendees[] field on event creation
  },
  {
    icon: '💻',
    title: 'Join via Google Meet',
    desc: 'Your video conferencing link will appear in the calendar invite. No download required.',
    // BACKEND: meetLink comes from calendar.events.insert → conferenceData.entryPoints[0].uri
  },
  {
    icon: '📋',
    title: 'Prepare your vision',
    desc: 'Think about your event date, rough guest count, and any inspiration images to share during the call.',
    // BACKEND: Static tip — no API needed
  },
];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function FreeConsultationDone() {
  /**
   * booking — populated from sessionStorage (written by FreeConsultation.jsx).
   *
   * Shape:
   * {
   *   name:         string   — attendee full name
   *   email:        string   — attendee email
   *   date:         string   — "YYYY-MM-DD"
   *   time:         string   — "HH:MM"
   *   displayDate:  string   — "Thursday, August 23"
   *   eventType:    string   — e.g. "Wedding"
   *   meetLink:     string   — "https://meet.google.com/..."
   *   calendarLink: string   — "https://calendar.google.com/event?eid=..."
   *   eventId:      string   — Google Calendar event ID
   * }
   *
   * BACKEND ALTERNATIVE: Replace sessionStorage read with a fetch:
   *   const eventId = new URLSearchParams(window.location.hash.split('?')[1]).get('eventId');
   *   const res = await fetch(`/api/consultations/${eventId}`);
   *   const booking = await res.json();
   */
  const [booking, setBooking] = useState(null);

  // ── Staggered entry animation state ──
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Read booking data written by FreeConsultation.jsx on successful submission
    // BACKEND: If using URL param approach, fetch from API here instead
    const raw = sessionStorage.getItem('ue_booking');
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
        // BACKEND: Clear sessionStorage after reading to avoid stale data on next visit
        // Uncomment when going live: sessionStorage.removeItem('ue_booking');
      } catch {
        // BACKEND: Log malformed data to your error tracking (Sentry, Datadog, etc.)
        console.warn('[FreeConsultationDone] Could not parse booking from sessionStorage');
      }
    }

    // Trigger staggered entrance animation
    requestAnimationFrame(() => setVisible(true));

    // ── Analytics event ──
    // BACKEND: Fire conversion event to GA4 / Meta Pixel / your analytics platform
    // window.gtag?.('event', 'consultation_booked', { event_type: booking?.eventType });
    // window.fbq?.('track', 'Schedule', { content_name: 'Free Consultation' });
  }, []);

  /**
   * handleAddToCalendar
   * Opens the Google Calendar "add event" link in a new tab.
   *
   * BACKEND: calendarLink is returned from POST /api/consultations/book
   * as a pre-built Google Calendar URL. If null, build one on the fly:
   *   https://calendar.google.com/calendar/render?action=TEMPLATE
   *     &text=Unwritten+Events+Consultation
   *     &dates=20240823T140000Z/20240823T143000Z
   *     &details=Your+30+min+strategy+call
   */
  const handleAddToCalendar = () => {
    if (booking?.calendarLink) {
      window.open(booking.calendarLink, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: open Google Calendar homepage
      window.open('https://calendar.google.com', '_blank', 'noopener,noreferrer');
    }
  };

  /**
   * handleJoinMeeting
   * Opens the Google Meet link for the booked session.
   *
   * BACKEND: meetLink is returned from POST /api/consultations/book.
   * It comes from the Google Calendar API conferenceData.entryPoints[0].uri.
   * This is only available if the calendar event was created with:
   *   conferenceDataVersion: 1
   *   conferenceData: { createRequest: { requestId: uuid } }
   */
  const handleJoinMeeting = () => {
    if (booking?.meetLink) {
      window.open(booking.meetLink, '_blank', 'noopener,noreferrer');
    }
  };

  /** Navigate back to home */
  const handleGoHome = () => {
    window.location.hash = '/';
  };

  /** Navigate to book another consultation */
  const handleBookAnother = () => {
    // BACKEND: Clear any stale booking data before re-booking
    sessionStorage.removeItem('ue_booking');
    window.location.hash = '/contact';
  };

  return (
    <div className="page-container">
      {/* ── Shared Header ── */}
      <Header />

      <main className={`fcd-main${visible ? ' fcd-visible' : ''}`}>

        {/* ── Confirmation card ── */}
        <section className="fcd-section" aria-labelledby="fcd-title">
          <div className="fcd-card">

            {/* ── Success icon ── */}
            <div className="fcd-icon-wrap" aria-hidden="true">
              {/*
                BACKEND: If you have the consultant's avatar from the API,
                render it here: <img src={consultant.avatarUrl} alt={consultant.name} />
                The checkmark badge overlay is CSS-only.
              */}
              <div className="fcd-avatar-circle">
                <span style={{ fontSize: 28 }}>UE</span>
              </div>
              <div className="fcd-check-badge" aria-label="Confirmed">✓</div>
            </div>

            {/* ── Headline ── */}
            <h1 className="fcd-title" id="fcd-title">You are scheduled</h1>
            <p className="fcd-subtitle">
              {/*
                BACKEND: If email delivery fails (e.g. SendGrid bounce), handle
                gracefully — remove this line or replace with a warning.
              */}
              A calendar invitation has been sent to{' '}
              <strong>{booking?.email || 'your email address'}</strong>.
            </p>

            {/* ── Booking detail block ── */}
            {booking && (
              <div className="fcd-details-block" aria-label="Booking details">
                {/*
                  BACKEND: This heading can be dynamic — use booking.eventType:
                  "Your {booking.eventType} Consultation"
                */}
                <p className="fcd-details-heading">Strategy eConsulting</p>

                <div className="fcd-detail-row">
                  <span className="fcd-detail-icon" aria-hidden="true">👤</span>
                  {/* BACKEND: booking.name from POST /api/consultations/book payload */}
                  <span>{booking.name}</span>
                </div>

                <div className="fcd-detail-row">
                  <span className="fcd-detail-icon" aria-hidden="true">📅</span>
                  {/*
                    BACKEND: Display in user's local timezone. Compute end time:
                    endTime = selectedTime + 30 minutes
                    Format: "HH:MM – HH:MM, DayOfWeek, Month DD, YYYY"
                    Store UTC timestamp in DB; display in local time on frontend.
                  */}
                  <span>
                    {booking.time} – {
                      (() => {
                        const [h, m] = booking.time.split(':').map(Number);
                        const end = new Date(0, 0, 0, h, m + 30);
                        return `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`;
                      })()
                    }, {booking.displayDate}
                  </span>
                </div>

                <div className="fcd-detail-row">
                  <span className="fcd-detail-icon" aria-hidden="true">🌐</span>
                  {/*
                    BACKEND: Timezone detected from browser during booking.
                    Display in format "Region/City (UTC±HH:MM)"
                  */}
                  <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                </div>

                <div className="fcd-detail-row">
                  <span className="fcd-detail-icon" aria-hidden="true">💻</span>
                  {/*
                    BACKEND: meetLink from Google Calendar conferenceData.
                    If null → conferencing wasn't created; show fallback text.
                  */}
                  {booking.meetLink ? (
                    <a
                      href={booking.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fcd-meet-link"
                      aria-label="Join Google Meet session"
                    >
                      Web conferencing details — click to join
                    </a>
                  ) : (
                    <span>Web conferencing details to follow.</span>
                  )}
                </div>

                {booking.eventType && (
                  <div className="fcd-detail-row">
                    <span className="fcd-detail-icon" aria-hidden="true">🎉</span>
                    {/* BACKEND: event type from booking payload */}
                    <span>{booking.eventType}</span>
                  </div>
                )}
              </div>
            )}

            {/* Fallback when sessionStorage is empty (e.g. hard refresh) */}
            {!booking && (
              <div
                className="fcd-details-block"
                style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-light)' }}
              >
                <p style={{ fontStyle: 'italic', fontSize: 15 }}>
                  Your booking is confirmed! Check your email for the calendar invite.
                </p>
                {/*
                  BACKEND: If using URL param approach, fetch booking details here.
                  Show a loading spinner while fetching, then render the detail block above.
                */}
              </div>
            )}

            {/* ── Action buttons ── */}
            <div className="fcd-actions">
              {/* Add to Google Calendar */}
              <button
                className="fcd-btn fcd-btn--primary"
                onClick={handleAddToCalendar}
                type="button"
                aria-label="Add this event to your Google Calendar"
              >
                <span aria-hidden="true">📅</span>
                Add to Google Calendar
              </button>

              {/* Join meeting (only shown when meetLink available) */}
              {booking?.meetLink && (
                <button
                  className="fcd-btn fcd-btn--outline"
                  onClick={handleJoinMeeting}
                  type="button"
                  aria-label="Open Google Meet session"
                >
                  <span aria-hidden="true">💻</span>
                  Open Google Meet
                </button>
              )}
            </div>
          </div>

          {/* ── Next steps ── */}
          <div className="fcd-next-steps" aria-label="What happens next">
            <h2 className="fcd-next-title">What happens next?</h2>
            <div className="fcd-next-grid">
              {NEXT_STEPS.map((step, i) => (
                <div
                  className="fcd-next-item"
                  key={step.title}
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="fcd-next-icon" aria-hidden="true">{step.icon}</div>
                  <div className="fcd-next-content">
                    <div className="fcd-next-item-title">{step.title}</div>
                    <p className="fcd-next-item-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Secondary actions ── */}
          <div className="fcd-secondary-actions">
            <button
              className="fcd-btn fcd-btn--ghost"
              onClick={handleBookAnother}
              type="button"
            >
              Book another consultation
            </button>
            <button
              className="fcd-btn fcd-btn--ghost"
              onClick={handleGoHome}
              type="button"
            >
              ← Return to Home
            </button>
          </div>
        </section>

      </main>

      {/* ── Shared Footer ── */}
      <Footer />
    </div>
  );
}
