/**
 * FreeConsultation.jsx
 * Unwritten Events · Book a Free Strategy Call
 *
 * Route: #/contact  (or update Header.jsx href to #/contact)
 *
 * ─────────────────────────────────────────────────────────────
 * GOOGLE CALENDAR INTEGRATION — READ THIS FIRST
 * ─────────────────────────────────────────────────────────────
 * This page uses a custom interactive calendar + time-slot
 * picker backed by the Google Calendar API. Two approaches are
 * supported; choose ONE before going live:
 *
 * OPTION A — Calendly Embed (quickest, zero backend needed):
 *   1. Create a free Calendly account at https://calendly.com
 *   2. Set up a "30-Min Free Consultation" event type
 *   3. In <head> add:
 *        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
 *        <script src="https://assets.calendly.com/assets/external/widget.js"></script>
 *   4. Replace the <CalendarBlock /> component below with:
 *        <div
 *          className="calendly-inline-widget"
 *          data-url="https://calendly.com/YOUR_USERNAME/30min"
 *          style={{ minWidth: '320px', height: '700px' }}
 *        />
 *   5. Remove the custom calendar / time-slot state entirely.
 *
 * OPTION B — Google Calendar API (full control, requires backend):
 *   STEP 1 — Google Cloud Console setup:
 *     a. Go to https://console.cloud.google.com
 *     b. Create a project → Enable "Google Calendar API"
 *     c. Create OAuth 2.0 credentials (Web application)
 *        Authorised redirect URI: https://yourdomain.com/oauth/callback
 *     d. Download client_secret.json — NEVER commit this to git
 *
 *   STEP 2 — Backend endpoints you must build (Node/Express example):
 *     GET  /api/availability?date=YYYY-MM-DD
 *          → Uses FreeBusy API to return unavailable slot arrays
 *          → Response: { busy: [ { start, end }, ... ] }
 *
 *     POST /api/consultations/book
 *          → Creates a Google Calendar event via:
 *               calendar.events.insert({ calendarId: 'primary', resource: event })
 *          → Sends confirmation email via Nodemailer / SendGrid
 *          → Body: { name, email, date, time, eventType, guestCount, budget }
 *          → Response: { success: true, eventId, meetLink }
 *
 *   STEP 3 — Environment variables (.env):
 *     GOOGLE_CLIENT_ID=...
 *     GOOGLE_CLIENT_SECRET=...
 *     GOOGLE_REFRESH_TOKEN=...   (one-time OAuth flow to get this)
 *     CALENDAR_ID=primary        (or a specific calendar ID)
 *
 *   STEP 4 — In this component, replace the mock fetchAvailableSlots()
 *            with a real fetch call:
 *              const res = await fetch(`/api/availability?date=${isoDate}`);
 *              const { busy } = await res.json();
 *              // Filter ALL_TIME_SLOTS against busy array
 *
 * ─────────────────────────────────────────────────────────────
 * STATE FLOW:
 *   Step 1: User picks date + time  → selectedDate + selectedTime
 *   Step 2: User fills in details   → formData
 *   Submit: POST /api/consultations/book → navigate to #/contact/done
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/FreeConsultation.css';
import '../styles/PageTransition.css';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

/** Days of week header for the calendar grid */
const DOW = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

/**
 * ALL_TIME_SLOTS — full list of available half-hour slots (Eastern Time).
 * BACKEND: Filter this array against Google Calendar FreeBusy response
 * before rendering. Booked slots should be disabled.
 */
const ALL_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
];

/**
 * EVENT_TYPES — dropdown options for the consultation form.
 * BACKEND: This list can be fetched from /api/event-types if dynamic.
 */
const EVENT_TYPES = [
  'Wedding',
  'Bridal Shower',
  'Engagement Party',
  'Corporate Gala',
  'Birthday Celebration',
  'Cultural / Heritage Event',
  'Private Dinner Party',
  'Other',
];

/**
 * BUDGET_RANGES — radio options matching Figma design.
 * BACKEND: Store the selected value in the booking record.
 */
const BUDGET_RANGES = [
  { value: '<5000',       label: '<$5,000' },
  { value: '5000-10000',  label: '$5,000 – $10,000' },
  { value: '10000-15000', label: '$10,000 – $15,000' },
  { value: '15000-20000', label: '$15,000 – $20,000' },
  { value: '>20000',      label: '>$20,000' },
];

/**
 * INFO_ITEMS — "What to expect" strip beneath the booking cards.
 * BACKEND: Static copy — no API needed.
 */
const INFO_ITEMS = [
  {
    icon: '🕐',
    title: '30-Minute Call',
    desc: 'A focused strategy session with one of our senior planners to understand your vision.',
  },
  {
    icon: '📋',
    title: 'Personalised Plan',
    desc: 'We send a customised proposal with package options within 48 hours of your call.',
  },
  {
    icon: '🔒',
    title: 'No Obligation',
    desc: 'Zero pressure. The consultation is completely free with no commitment required.',
  },
];

// ─────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────

/** Returns the number of days in a given month/year */
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

/** Returns the ISO weekday (0=Mon … 6=Sun) of the 1st of a month */
const getFirstDayOffset = (year, month) => {
  const day = new Date(year, month, 1).getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // convert to Mon-based offset
};

/**
 * formatDisplayDate — formats a Date object to a readable string.
 * e.g. "Thursday, August 23"
 * BACKEND: Use UTC-aware formatting when persisting to database.
 */
const formatDisplayDate = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

/**
 * formatISODate — produces YYYY-MM-DD for API calls.
 * BACKEND: Always send dates in ISO format to avoid timezone ambiguity.
 */
const formatISODate = (date) => date.toISOString().split('T')[0];

// ─────────────────────────────────────────────
// MOCK API — replace with real calls in production
// ─────────────────────────────────────────────

/**
 * fetchAvailableSlots
 * BACKEND INTEGRATION POINT:
 *   Replace this mock with:
 *     const res = await fetch(`/api/availability?date=${isoDate}`);
 *     const { busy } = await res.json();
 *     return ALL_TIME_SLOTS.filter(slot => !busy.some(b => b.start includes slot));
 *
 * The mock returns all slots except a hardcoded busy set to simulate real data.
 *
 * @param {string} isoDate  — "YYYY-MM-DD"
 * @returns {Promise<string[]>}  — array of available HH:MM strings
 */
const fetchAvailableSlots = async (isoDate) => {
  // TODO: Replace with real API call
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 380));

  // Mock: mark a few slots as unavailable on any given date
  // BACKEND: derive this from FreeBusy API response
  const mockBusy = ['09:30', '11:00', '14:00'];
  return ALL_TIME_SLOTS.filter((s) => !mockBusy.includes(s));
};

/**
 * submitBooking
 * BACKEND INTEGRATION POINT:
 *   Replace with:
 *     const res = await fetch('/api/consultations/book', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(payload),
 *     });
 *     if (!res.ok) throw new Error(await res.text());
 *     return res.json();  // { success, eventId, meetLink, calendarLink }
 *
 * @param {object} payload  — full booking payload (see below)
 * @returns {Promise<object>}
 */
const submitBooking = async (payload) => {
  // TODO: Replace with real POST
  await new Promise((r) => setTimeout(r, 900));
  // Simulate a successful response containing the Google Meet link
  // BACKEND: this comes from calendar.events.insert response
  return {
    success: true,
    eventId:      'mock_event_' + Date.now(),
    meetLink:     'https://meet.google.com/abc-defg-hij',
    calendarLink: 'https://calendar.google.com/event?eid=mock',
  };
};

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/**
 * StepIndicator
 * Visual "Step 1 / Step 2" progress indicator at the top of each card.
 *
 * @param {number} current  — 1 or 2
 */
function StepIndicator({ current }) {
  return (
    <div className="fc-steps" aria-label={`Step ${current} of 2`}>
      {[1, 2].map((n, i) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < 2 ? '1' : 'none' }}>
          <div
            className={`fc-step-item ${current === n ? 'active' : current > n ? 'done' : ''}`}
          >
            <div className="fc-step-num" aria-hidden="true">
              {/* Show checkmark for completed steps */}
              {current > n ? '✓' : n}
            </div>
            <span>{n === 1 ? 'Pick a Time' : 'Your Details'}</span>
          </div>
          {/* Connector line between steps */}
          {n < 2 && <div className="fc-step-connector" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

/**
 * CalendarBlock
 * Custom month-view calendar with time-slot picker.
 *
 * BACKEND INTEGRATION:
 *  - On date change, calls fetchAvailableSlots(isoDate) to get live availability
 *  - Disabled dates = past dates + dates with zero availability
 *    (in production, also block dates via Google Calendar FreeBusy API)
 *
 * @param {Date|null}   selectedDate     — currently selected date
 * @param {Function}    onDateChange     — (Date) => void
 * @param {string|null} selectedTime     — "HH:MM" or null
 * @param {Function}    onTimeChange     — (string) => void
 */
function CalendarBlock({ selectedDate, onDateChange, selectedTime, onTimeChange }) {
  const today = new Date();

  // Month state — initialise to current month
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Available slots for the selected date
  // BACKEND: populated by fetchAvailableSlots()
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading,   setSlotsLoading]   = useState(false);

  /** Fetch slots whenever selected date changes */
  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    onTimeChange(null); // reset time when date changes

    // BACKEND: Replace fetchAvailableSlots with real API call
    fetchAvailableSlots(formatISODate(selectedDate))
      .then(setAvailableSlots)
      .finally(() => setSlotsLoading(false));
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstOffset  = getFirstDayOffset(viewYear, viewMonth);

  /** Navigate calendar months */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  /**
   * isDayDisabled — returns true for past days.
   * BACKEND: Extend this to also disable dates with zero availability
   * by checking a pre-fetched array of fully-booked dates:
   *   const { fullyBooked } = await fetch('/api/availability/month?year=Y&month=M');
   */
  const isDayDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    return d < todayMidnight;
  };

  const isSelected = (day) =>
    selectedDate &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth()    === viewMonth &&
    selectedDate.getDate()     === day;

  const isToday = (day) =>
    today.getFullYear() === viewYear &&
    today.getMonth()    === viewMonth &&
    today.getDate()     === day;

  const handleDayClick = (day) => {
    if (isDayDisabled(day)) return;
    // BACKEND: Verify date is not fully booked before allowing selection
    onDateChange(new Date(viewYear, viewMonth, day));
  };

  // Build flat array of cells (empty prefix + day numbers)
  const calCells = [
    ...Array(firstOffset).fill(null), // empty prefix cells
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="fc-calendly-card">
      {/* ── Host info strip ── */}
      <div className="fc-host-strip">
        <div className="fc-host-avatar">
          {/*
            BACKEND: Replace placeholder with actual consultant image.
            Consultant data can come from GET /api/consultants/primary
            Response: { name, role, avatarUrl }
          */}
          <div className="fc-host-avatar-placeholder" aria-label="Unwritten Events consultant">
            UE
          </div>
        </div>
        <div>
          <div className="fc-host-info-company">Unwritten Events</div>
          {/* BACKEND: Replace static name with consultant.name from API */}
          <div className="fc-host-info-name">30 Min Free Consultation</div>
        </div>
      </div>

      {/* ── Duration / conferencing meta ── */}
      <div className="fc-host-meta">
        <div className="fc-host-meta-item">
          <span className="fc-host-meta-icon">🕐</span>
          {/* BACKEND: session duration from /api/event-types/{id}.duration */}
          <span>30 min</span>
        </div>
        <div className="fc-host-meta-item">
          <span className="fc-host-meta-icon">💬</span>
          {/*
            BACKEND: Video link is generated by Google Calendar event conferencing.
            The confirmed meet link is returned from POST /api/consultations/book
            as { meetLink: 'https://meet.google.com/...' }
            Display it on the confirmation page (FreeConsultationDone.jsx).
          */}
          <span>Web conferencing details provided upon confirmation.</span>
        </div>
      </div>

      <div className="fc-calendar-inner">
        {/* ── Month calendar ── */}
        <div className="fc-calendar-wrap">
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-mid)', letterSpacing: '0.06em' }}>
            Select a Date &amp; Time
          </p>

          {/* Month navigation */}
          <div className="fc-calendar-nav">
            <button
              className="fc-calendar-nav-btn"
              onClick={prevMonth}
              aria-label="Previous month"
              type="button"
            >
              ‹
            </button>
            <span className="fc-calendar-month">
              {/* BACKEND: Locale-aware month display */}
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              className="fc-calendar-nav-btn"
              onClick={nextMonth}
              aria-label="Next month"
              type="button"
            >
              ›
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="fc-cal-dow" aria-hidden="true">
            {DOW.map((d) => (
              <div key={d} className="fc-cal-dow-cell">{d}</div>
            ))}
          </div>

          {/* Date grid */}
          <div className="fc-cal-grid" role="grid" aria-label="Calendar">
            {calCells.map((day, i) => (
              <div
                key={i}
                className={[
                  'fc-cal-day',
                  !day                    ? 'empty'    : '',
                  day && isDayDisabled(day) ? 'disabled' : '',
                  day && isSelected(day)    ? 'selected' : '',
                  day && isToday(day)       ? 'today'    : '',
                ].join(' ').trim()}
                onClick={() => day && handleDayClick(day)}
                role={day ? 'gridcell' : 'presentation'}
                aria-label={day ? `${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}` : undefined}
                aria-selected={day && isSelected(day) ? true : undefined}
                aria-disabled={day && isDayDisabled(day) ? true : undefined}
                tabIndex={day && !isDayDisabled(day) ? 0 : -1}
                onKeyDown={(e) => e.key === 'Enter' && day && handleDayClick(day)}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Timezone label */}
          <div className="fc-timezone-label">
            <span>🌐</span>
            {/*
              BACKEND: Detect or allow user to change timezone.
              Store as IANA string (e.g. "America/New_York") in booking payload.
              Use Intl.DateTimeFormat().resolvedOptions().timeZone for auto-detection.
            */}
            <span>Eastern Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
          </div>
        </div>

        {/* ── Time slots ── */}
        {selectedDate && (
          <div className="fc-timeslot-col" aria-label="Available time slots">
            <p className="fc-timeslot-date-label">
              {/* Display friendly date label above slots */}
              {formatDisplayDate(selectedDate)}
            </p>

            {slotsLoading ? (
              // Loading state while fetching from Google Calendar API
              <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                <div className="fc-spinner" style={{ borderTopColor: 'var(--color-purple-accent)', width: 24, height: 24 }} />
              </div>
            ) : availableSlots.length === 0 ? (
              // No availability — BACKEND: show "fully booked" state
              <p style={{ fontSize: 13, color: 'var(--color-text-light)', padding: '16px 0', fontStyle: 'italic' }}>
                No availability on this date.
              </p>
            ) : (
              availableSlots.map((slot) => (
                <button
                  key={slot}
                  className={`fc-timeslot-btn${selectedTime === slot ? ' selected' : ''}`}
                  onClick={() => onTimeChange(slot)}
                  type="button"
                  aria-pressed={selectedTime === slot}
                  aria-label={`Select ${slot}`}
                >
                  {slot}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * DetailsForm
 * Step 2 — user fills in name, email, event type, guest count, budget.
 *
 * BACKEND INTEGRATION:
 *  - On submit, payload is sent to POST /api/consultations/book
 *  - Email field is used for:
 *      (a) Google Calendar invite
 *      (b) Confirmation email via SendGrid / Nodemailer
 *  - eventType + guestCount + budget are stored in your CRM / database
 *    alongside the Google Calendar eventId for reference
 *
 * @param {object}      formData        — controlled form state
 * @param {Function}    setFormData     — state setter
 * @param {Date|null}   selectedDate
 * @param {string|null} selectedTime
 * @param {Function}    onSubmit        — called with validated formData
 * @param {boolean}     isSubmitting    — shows spinner on button
 * @param {object}      fieldErrors     — { name?, email?, eventType? }
 */
function DetailsForm({
  formData, setFormData,
  selectedDate, selectedTime,
  onSubmit, isSubmitting, fieldErrors,
}) {
  /** Generic input change handler — updates formData by field key */
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fc-form-card">
      {/* ── Session summary strip ── */}
      <div className="fc-session-strip">
        <div className="fc-session-avatar">
          {/* BACKEND: Consultant avatar — same source as CalendarBlock */}
          <div className="fc-session-avatar-placeholder" aria-hidden="true" />
        </div>
        <div>
          {/* BACKEND: Event type label from /api/event-types/{id}.label */}
          <div className="fc-session-label">Strategy Session</div>
          <div className="fc-session-title">Schedule Details</div>
        </div>
      </div>

      {/* ── Session meta: duration, conferencing, date/time, location ── */}
      <div className="fc-session-meta">
        <div className="fc-session-meta-item">
          <span>🕐</span>
          {/* BACKEND: duration from booking type config */}
          <span>30 min</span>
        </div>
        <div className="fc-session-meta-item">
          <span>💬</span>
          {/* BACKEND: conferencing details generated after booking */}
          <span>Web conferencing details provided</span>
        </div>
        {selectedDate && selectedTime && (
          <div className="fc-session-meta-item">
            <span>📅</span>
            {/*
              BACKEND: Store as UTC ISO timestamp in database.
              Display uses local time for the user.
            */}
            <span className="fc-session-datetime">
              {selectedTime} – {
                (() => {
                  // Calculate end time (+30 mins) for display
                  const [h, m] = selectedTime.split(':').map(Number);
                  const end = new Date(0, 0, 0, h, m + 30);
                  return `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`;
                })()
              }, {formatDisplayDate(selectedDate)}
            </span>
          </div>
        )}
        <div className="fc-session-meta-item">
          <span>📍</span>
          {/* BACKEND: Consultant office location from /api/settings.location */}
          <span>New York, USA</span>
        </div>
      </div>

      {/* ── Form fields ── */}
      <div className="fc-form-body">
        <p className="fc-form-heading">Enter Details</p>

        {/* ── Name ── */}
        <div className="fc-field">
          <label htmlFor="fc-name">
            Name <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="fc-name"
            className={`fc-input${fieldErrors.name ? ' error' : ''}`}
            type="text"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            autoComplete="name"
            aria-required="true"
            aria-describedby={fieldErrors.name ? 'fc-name-err' : undefined}
          />
          {fieldErrors.name && (
            <span id="fc-name-err" className="fc-field-error" role="alert">
              {fieldErrors.name}
            </span>
          )}
        </div>

        {/* ── Email ── */}
        <div className="fc-field">
          <label htmlFor="fc-email">
            Email <span className="required" aria-hidden="true">*</span>
          </label>
          <input
            id="fc-email"
            className={`fc-input${fieldErrors.email ? ' error' : ''}`}
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            autoComplete="email"
            aria-required="true"
            aria-describedby={fieldErrors.email ? 'fc-email-err' : undefined}
          />
          {fieldErrors.email && (
            <span id="fc-email-err" className="fc-field-error" role="alert">
              {fieldErrors.email}
            </span>
          )}
          {/*
            BACKEND: This email is used for:
              1. Google Calendar invite — calendar.events.insert.attendees
              2. Confirmation email via SendGrid transactional template
                 Template ID stored in env: SENDGRID_CONFIRMATION_TEMPLATE_ID
          */}
        </div>

        {/* ── Phone (optional) ── */}
        <div className="fc-field">
          <label htmlFor="fc-phone">Phone (optional)</label>
          <input
            id="fc-phone"
            className="fc-input"
            type="tel"
            placeholder="+1 (212) 000-0000"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            autoComplete="tel"
            // BACKEND: Store for follow-up calls; not required for Google Calendar
          />
        </div>

        {/* ── Event Type ── */}
        <div className="fc-field">
          <label htmlFor="fc-event-type">
            Event Type <span className="required" aria-hidden="true">*</span>
          </label>
          <div className="fc-select-wrap">
            <select
              id="fc-event-type"
              className={`fc-select${fieldErrors.eventType ? ' error' : ''}`}
              value={formData.eventType}
              onChange={(e) => handleChange('eventType', e.target.value)}
              aria-required="true"
              aria-describedby={fieldErrors.eventType ? 'fc-et-err' : undefined}
            >
              <option value="">Select event type</option>
              {/*
                BACKEND: EVENT_TYPES can be fetched from:
                  GET /api/event-types  → [{ id, label }]
                Replace static array with API data if types change frequently.
              */}
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          {fieldErrors.eventType && (
            <span id="fc-et-err" className="fc-field-error" role="alert">
              {fieldErrors.eventType}
            </span>
          )}
        </div>

        {/* ── Expected Guest Count ── */}
        <div className="fc-field">
          <label htmlFor="fc-guests">Expected Guest Count</label>
          <input
            id="fc-guests"
            className="fc-input"
            type="number"
            placeholder="e.g. 150"
            min="1"
            max="2000"
            value={formData.guestCount}
            onChange={(e) => handleChange('guestCount', e.target.value)}
            // BACKEND: Stored in consultation record; influences package suggestions
          />
        </div>

        {/* ── Budget Range ── */}
        <div className="fc-field">
          <label>Budget Range (USD)</label>
          <div className="fc-radio-group" role="radiogroup" aria-label="Budget range">
            {BUDGET_RANGES.map((b) => (
              <label key={b.value} className="fc-radio-label">
                <input
                  type="radio"
                  name="budget"
                  value={b.value}
                  checked={formData.budget === b.value}
                  onChange={() => handleChange('budget', b.value)}
                  // BACKEND: Budget tier stored in CRM to qualify the lead
                />
                {b.label}
              </label>
            ))}
          </div>
        </div>

        {/* ── Legal disclaimer ── */}
        <p className="fc-legal">
          {/*
            BACKEND: Links should point to your live /terms and /privacy pages.
            Record consent timestamp with the booking:
              { consentTimestamp: new Date().toISOString(), ipAddress: req.ip }
          */}
          By proceeding, you confirm that you have read and agree to the{' '}
          <a href="#/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a>
          {' '}and{' '}
          <a href="#/privacy" target="_blank" rel="noopener noreferrer">Privacy Notice</a>.
        </p>

        {/* ── Submit ── */}
        <button
          className="fc-submit-btn"
          onClick={onSubmit}
          type="button"
          disabled={isSubmitting || !selectedDate || !selectedTime}
          aria-busy={isSubmitting}
          aria-label={isSubmitting ? 'Scheduling your event…' : 'Schedule Event'}
        >
          {isSubmitting && <span className="fc-spinner" aria-hidden="true" />}
          {isSubmitting ? 'Scheduling…' : 'Schedule Event'}
        </button>

        {/* Hint when date/time not yet selected */}
        {(!selectedDate || !selectedTime) && (
          <p style={{ fontSize: 12, color: 'var(--color-text-light)', textAlign: 'center', marginTop: 10, fontStyle: 'italic' }}>
            Please select a date and time on the left first.
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────

export default function FreeConsultation() {
  // ── Date / time selection state (Step 1) ──
  const [selectedDate, setSelectedDate] = useState(null); // Date | null
  const [selectedTime, setSelectedTime] = useState(null); // "HH:MM" | null

  // ── Form data state (Step 2) ──
  const [formData, setFormData] = useState({
    name:       '',
    email:      '',
    phone:      '',  // optional — for backend follow-up
    eventType:  '',
    guestCount: '',
    budget:     '',
    // BACKEND: Add additional fields as needed:
    // message: '',          // freetext notes
    // referralSource: '',   // how did they hear about us
  });

  // ── UI state ──
  const [fieldErrors,   setFieldErrors]   = useState({}); // validation errors per field
  const [isSubmitting,  setIsSubmitting]   = useState(false);
  const [submitError,   setSubmitError]    = useState(null); // global error from API

  /**
   * validateForm
   * Client-side validation before sending to API.
   * BACKEND: Mirror these rules in your Express/Zod schema for server-side validation.
   * Never trust client-only validation.
   */
  const validateForm = useCallback(() => {
    const errors = {};
    if (!formData.name.trim())   errors.name      = 'Your name is required.';
    if (!formData.email.trim())  errors.email     = 'Your email address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
                                 errors.email     = 'Please enter a valid email address.';
    if (!formData.eventType)     errors.eventType = 'Please select an event type.';
    return errors;
  }, [formData]);

  /**
   * handleBooking
   * Validates the form then calls the booking API.
   *
   * BACKEND: submitBooking() should POST to /api/consultations/book.
   *
   * Full payload structure — document this for your backend team:
   * {
   *   name:       string       — attendee full name
   *   email:      string       — attendee email (Google Calendar invite + SendGrid)
   *   phone:      string|''    — optional attendee phone
   *   date:       string       — "YYYY-MM-DD" ISO date
   *   time:       string       — "HH:MM" 24h, Eastern Time
   *   timezone:   string       — IANA timezone e.g. "America/New_York"
   *   eventType:  string       — selected from EVENT_TYPES
   *   guestCount: number|''    — expected attendance
   *   budget:     string       — one of BUDGET_RANGES[].value
   *   source:     'website'    — for CRM attribution
   *   consent:    true         — user agreed to T&C
   *   timestamp:  string       — ISO datetime of form submission
   * }
   *
   * On success, backend should:
   *   1. Create Google Calendar event with conferencing (Google Meet)
   *   2. Add attendee email to the event
   *   3. Send confirmation email via SendGrid
   *   4. Store booking in database (bookings table)
   *   5. Return { success, eventId, meetLink, calendarLink }
   *
   * On success: navigate to #/contact/done with booking info stored
   * in sessionStorage so FreeConsultationDone.jsx can display it.
   */
  const handleBooking = useCallback(async () => {
    setSubmitError(null);

    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error for accessibility
      setTimeout(() => {
        document.querySelector('.fc-input.error, .fc-select.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // Build the full booking payload
      const payload = {
        // ── Attendee info ──────────────────────────────────────────
        name:       formData.name.trim(),
        email:      formData.email.trim().toLowerCase(),
        phone:      formData.phone.trim() || null,

        // ── Date/time — BACKEND: combine these into UTC ISO timestamp ──
        date:       formatISODate(selectedDate),   // "YYYY-MM-DD"
        time:       selectedTime,                   // "HH:MM"
        timezone:   Intl.DateTimeFormat().resolvedOptions().timeZone, // IANA

        // ── Event details ──────────────────────────────────────────
        eventType:  formData.eventType,
        guestCount: formData.guestCount ? parseInt(formData.guestCount, 10) : null,
        budget:     formData.budget || null,

        // ── Metadata ──────────────────────────────────────────────
        source:     'website',                      // for CRM attribution
        consent:    true,                           // T&C accepted
        timestamp:  new Date().toISOString(),       // submission time (UTC)
      };

      // BACKEND: Replace with real API call inside submitBooking()
      const result = await submitBooking(payload);

      if (!result.success) throw new Error('Booking failed. Please try again.');

      /*
       * Store booking confirmation in sessionStorage so the Done page
       * can display it without an additional API call.
       * BACKEND: Alternatively, pass via URL param: #/contact/done?eventId=...
       *          and fetch event details on the Done page from:
       *          GET /api/consultations/{eventId}
       */
      sessionStorage.setItem('ue_booking', JSON.stringify({
        name:         formData.name.trim(),
        email:        formData.email.trim(),
        date:         formatISODate(selectedDate),
        time:         selectedTime,
        displayDate:  formatDisplayDate(selectedDate),
        eventType:    formData.eventType,
        meetLink:     result.meetLink,     // BACKEND: from calendar.events.insert
        calendarLink: result.calendarLink, // BACKEND: add-to-calendar URL
        eventId:      result.eventId,      // BACKEND: Google Calendar event ID
      }));

      // Navigate to confirmation page
      window.location.hash = '/contact/done';

    } catch (err) {
      // BACKEND: Distinguish between:
      //   409 Conflict  → "This slot was just taken. Please pick another time."
      //   422            → Validation error from server
      //   500            → Generic server error
      setSubmitError(
        err.message || 'Something went wrong. Please try again or call us directly.'
      );
      console.error('[FreeConsultation] Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedDate, selectedTime, validateForm]);

  return (
    <div className="page-container">
      {/* ── Shared Header (matches all other pages) ── */}
      <Header />

      <main>
        {/* ── Page hero band ── */}
        <section className="fc-hero" aria-labelledby="fc-page-title">
          <p className="fc-hero-label">Free · 30 Minutes · No Obligation</p>
          <h1 className="fc-hero-title" id="fc-page-title">
            BOOK A FREE STRATEGY CALL WITH US!
          </h1>
          <p className="fc-hero-sub">
            Tell us about your vision. We'll handle everything else — from first concept to final toast.
          </p>
        </section>

        {/* ── Two-column booking layout ── */}
        <div className="fc-layout">
          {/* LEFT — Calendar + time picker (Step 1) */}
          <div>
            <StepIndicator current={selectedDate && selectedTime ? 2 : 1} />
            <CalendarBlock
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              selectedTime={selectedTime}
              onTimeChange={setSelectedTime}
            />
          </div>

          {/* RIGHT — Details form (Step 2) */}
          <div>
            <StepIndicator current={selectedDate && selectedTime ? 2 : 1} />
            <DetailsForm
              formData={formData}
              setFormData={setFormData}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSubmit={handleBooking}
              isSubmitting={isSubmitting}
              fieldErrors={fieldErrors}
            />

            {/* Global submission error */}
            {submitError && (
              <div
                role="alert"
                style={{
                  marginTop: 14,
                  padding: '12px 16px',
                  background: '#fff0f3',
                  border: '1px solid rgba(224,64,122,0.25)',
                  borderRadius: 6,
                  fontSize: 13,
                  color: 'var(--color-pink-accent)',
                  lineHeight: 1.55,
                  animation: 'fc-fadeIn 0.25s ease both',
                }}
              >
                {submitError}
              </div>
            )}
          </div>
        </div>

        {/* ── What to expect strip ── */}
        <div className="fc-info-strip" aria-label="What to expect">
          {INFO_ITEMS.map((item) => (
            <div className="fc-info-item" key={item.title}>
              <div className="fc-info-icon" aria-hidden="true">{item.icon}</div>
              <div className="fc-info-title">{item.title}</div>
              <p className="fc-info-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Google Calendar integration info panel ──
            BACKEND: Remove this section before going live — it's developer guidance only.
        ── */}
        <div className="fc-gcal-banner" aria-label="Developer integration note">
          <div className="fc-gcal-inner">
            <div className="fc-gcal-icon">📅</div>
            <div className="fc-gcal-text">
              <h3>Google Calendar Integration Guide</h3>
              <p>
                <strong>Option A (Recommended — fastest):</strong> Drop in the Calendly embed.
                Set <code>data-url="https://calendly.com/YOUR_SLUG/30min"</code> and the widget
                handles scheduling, Google Meet links, and confirmation emails automatically.
                <br /><br />
                <strong>Option B (Full control):</strong> Build backend endpoints
                <code>GET /api/availability</code> and <code>POST /api/consultations/book</code>
                using the Google Calendar API. Requires OAuth 2.0 credentials, a refresh token,
                and SendGrid for confirmation emails. See inline comments in{' '}
                <code>FreeConsultation.jsx</code> for the full payload spec and API flow.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Shared Footer ── */}
      <Footer />
    </div>
  );
}
