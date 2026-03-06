/**
 * ContactUs.jsx — Unwritten Events · Contact Us (Final Page)
 *
 * Route: #/contact-us  (keep #/contact for FreeConsultation)
 *
 * ─────────────────────────────────────────────────────────────
 * BACKEND INTEGRATION OVERVIEW
 * ─────────────────────────────────────────────────────────────
 *
 * CONTACT FORM SUBMISSION
 * ────────────────────────
 * On submit → POST /api/contact
 *
 * Request body (JSON):
 * {
 *   firstName:     string  — required
 *   lastName:      string  — required
 *   email:         string  — required, validated email format
 *   phone:         string  — optional
 *   subject:       string  — one of SUBJECTS[].value
 *   eventDate:     string  — "YYYY-MM-DD" or '' (optional)
 *   message:       string  — required, max 1000 chars
 *   newsletter:    boolean — user opted in to marketing emails
 *   source:        'contact_page'
 *   consentAt:     string  — ISO timestamp of form submission
 *   ipAddress:     string  — captured server-side from req.ip
 * }
 *
 * Backend should:
 *   1. Validate fields (mirror client validation in Zod / Joi)
 *   2. Store submission in database:
 *        Table: contact_submissions
 *        Columns: id, first_name, last_name, email, phone, subject,
 *                 event_date, message, newsletter, source, consent_at,
 *                 ip_address, created_at, status (new | read | replied)
 *   3. Send admin notification email:
 *        To: admin@unwrittenevents.com
 *        Via: SendGrid / Nodemailer
 *        Template: "New Contact Form Submission — {subject}"
 *   4. Send auto-reply to user:
 *        To: formData.email
 *        Template: "Thank you for reaching out to Unwritten Events"
 *        Include: expected response time (24–48 business hours)
 *   5. Optional — add to CRM:
 *        HubSpot: hubspotClient.crm.contacts.basicApi.create({ properties })
 *        or your preferred CRM via webhook
 *   6. Optional — if newsletter=true, add to email list:
 *        Mailchimp: mailchimp.lists.addListMember(listId, { email_address, status:'subscribed' })
 *        or Klaviyo / ConvertKit
 *   7. Return: { success: true, ticketId: 'UE-2024-0042' }
 *
 * ADMIN PORTAL
 * ─────────────
 * All submissions stored in DB are accessible via:
 *   GET  /api/admin/contacts              → paginated list, filterable by status/subject
 *   GET  /api/admin/contacts/:id          → single submission detail
 *   PATCH /api/admin/contacts/:id/status  → update status (read | replied | archived)
 *
 * Authentication: Protect all /api/admin/* routes with JWT middleware.
 *
 * ─────────────────────────────────────────────────────────────
 * COMPONENT STRUCTURE
 * ─────────────────────────────────────────────────────────────
 *   <ContactUs>
 *     <Header />          — shared site header
 *     <HeroBanner />      — full-width hero with italic heading
 *     <InfoBand />        — 3 contact info cards (phone/email/hours)
 *     <MainSection>
 *       <ContactForm />   — controlled form with validation
 *       <Sidebar />       — address, social links, hours, map link
 *     </MainSection>
 *     <MapSection />      — Google Maps embed
 *     <FaqSection />      — animated accordion
 *     <CtaBand />         — "Book Free Consultation" (matches all pages)
 *     <Footer />          — shared site footer
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/ContactUs.css';
import '../styles/PageTransition.css';

// ─────────────────────────────────────────────
// CONSTANTS & DATA
// ─────────────────────────────────────────────

/**
 * SUBJECTS — selectable enquiry types shown as chip buttons.
 * BACKEND: Store the selected value in contact_submissions.subject
 * Use for admin portal filtering and routing to correct team member.
 */
const SUBJECTS = [
  { value: 'wedding',      label: '💒 Wedding' },
  { value: 'corporate',    label: '🏢 Corporate Event' },
  { value: 'private',      label: '🥂 Private Party' },
  { value: 'cultural',     label: '🎊 Cultural Event' },
  { value: 'consultation', label: '📞 Free Consultation' },
  { value: 'other',        label: '✉️ Other' },
];

/**
 * CONTACT_INFO — rendered in the 3-card info band at the top.
 * BACKEND: These are static values — update here when business details change.
 * Consider moving to a /api/settings endpoint if they change frequently.
 */
const CONTACT_INFO = [
  {
    icon: '📞',
    label: 'Call Us',
    primary: '(516) 673-7943',
    secondary: 'Mon–Fri, 9:00 AM – 6:00 PM EST',
    // BACKEND: Link to tel: for mobile users
    href: 'tel:+15166737943',
  },
  {
    icon: '✉️',
    label: 'Email Us',
    primary: 'unwrittenevents@gmail.com',
    secondary: 'We reply within 24–48 business hours',
    // BACKEND: Link to mailto: — use your actual business email
    href: 'mailto:unwrittenevents@gmail.com',
  },
  {
    icon: '📍',
    label: 'Studio',
    primary: 'New York, NY',
    secondary: 'By appointment · Serving the tri-state area & beyond',
    href: null,
  },
];

/**
 * STUDIO_HOURS — displayed in the sidebar Hours card.
 * BACKEND: Static — update manually or fetch from /api/settings.hours
 */
const STUDIO_HOURS = [
  { day: 'Monday – Friday',  time: '9:00 AM – 6:00 PM' },
  { day: 'Saturday',         time: 'By appointment only' },
  { day: 'Sunday',           time: null }, // null = Closed
];

/**
 * SOCIAL_LINKS — displayed in the sidebar Social card.
 * BACKEND: Update hrefs when social handles change.
 * Consider fetching from /api/settings.social for admin editability.
 */
const SOCIAL_LINKS = [
  { label: 'Instagram', icon: '📸', href: 'https://www.instagram.com/unwrittenev?igsh=Zmw4bnhieWYyY243' },
  { label: 'TikTok',    icon: '🎵', href: 'https://tiktok.com/@unwrittenevents' },
  { label: 'Facebook',  icon: '👥', href: 'https://facebook.com/unwrittenevents' },
  { label: 'Pinterest', icon: '📌', href: 'https://pinterest.com/unwrittenevents' },
  { label: 'LinkedIn',  icon: '💼', href: 'https://linkedin.com/company/unwrittenevents' },
];

/**
 * FAQ_ITEMS — accordion questions on the Contact page.
 * BACKEND: Static copy — no API needed.
 * Add/remove items here as the business evolves.
 */
const FAQ_ITEMS = [
  {
    q: 'How far in advance should I book?',
    a: `We recommend reaching out at least 6–12 months before your event date for weddings and
        large galas. For corporate events and private parties, 3–6 months is typically sufficient.
        That said, we occasionally accommodate shorter timelines — reach out and we will let you
        know what is possible.`,
  },
  {
    q: 'Do you work with events outside New York?',
    a: `Absolutely. While our studio is based in New York, we regularly travel for destination
        weddings and corporate events across the United States and internationally. Travel fees
        are outlined transparently in your custom proposal.`,
  },
  {
    q: 'What does the free strategy call include?',
    a: `Our complimentary 30-minute strategy call is a no-obligation conversation with one of our
        senior planners. We will discuss your vision, event type, budget range, and timeline. By the
        end of the call, you will have a clear sense of which of our packages best fits your needs,
        and we will follow up with a personalised proposal within 48 hours.`,
  },
  {
    q: 'How is pricing structured?',
    a: `Every event is unique, so all of our pricing is bespoke. Packages are built around your
        specific requirements — venue size, service scope, floral budget, and staffing needs.
        During your strategy call we will establish a budget framework, and your written proposal
        will break down all costs clearly with no hidden fees.`,
  },
  {
    q: 'Can I make changes after signing a contract?',
    a: `Yes. We understand that plans evolve. Our contracts include reasonable amendment provisions,
        and our team is flexible about scope adjustments up to 60 days before your event. Changes
        requested within 60 days are reviewed case by case and may involve revised pricing.`,
  },
  {
    q: 'Do you provide day-of coordination only?',
    a: `We offer a range of packages from full-service planning to day-of coordination. Our
        coordination-only package is ideal for couples who have managed their own planning but want
        a professional team to execute flawlessly on the day itself. Ask about this on your call.`,
  },
];

// ─────────────────────────────────────────────
// MOCK API — replace with real calls in production
// ─────────────────────────────────────────────

/**
 * submitContactForm
 * BACKEND INTEGRATION POINT — replace with real fetch:
 *
 *   const res = await fetch('/api/contact', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(payload),
 *   });
 *   if (!res.ok) {
 *     const err = await res.json();
 *     throw new Error(err.message || 'Submission failed');
 *   }
 *   return res.json(); // { success: true, ticketId: 'UE-2024-0042' }
 *
 * @param {object} payload — validated form data
 * @returns {Promise<{ success: boolean, ticketId: string }>}
 */
const submitContactForm = async (payload) => {
  // TODO: Replace with real API call
  await new Promise((r) => setTimeout(r, 850)); // simulate network
  console.info('[ContactUs] Payload ready for backend:', payload);
  // Mock ticket ID — backend should generate this from DB auto-increment or UUID
  return { success: true, ticketId: `UE-${Date.now().toString().slice(-6)}` };
};

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

/** HeroBanner — full-width hero image with italic title overlay */
function HeroBanner() {
  return (
    <section className="cu-hero" aria-label="Contact page hero">
      <div className="cu-hero-bg" aria-hidden="true">
        {/* BACKEND: Replace gradient with real hero image:
            <img src="src/assets/frontEnd-images/contact_hero.jpg" alt="" className="cu-hero-img" /> */}
      </div>
      <div className="cu-hero-overlay" aria-hidden="true" />
      <div className="cu-hero-content">
        <p className="cu-hero-eyebrow">We'd love to hear from you</p>
        <h1 className="cu-hero-title">Get in Touch</h1>
        <div className="cu-hero-divider" aria-hidden="true" />
        <p className="cu-hero-sub">
          Tell us about your vision. We'll reply within 24–48 business hours.
        </p>
      </div>
    </section>
  );
}

/**
 * InfoBand — 3-card contact info strip (phone / email / studio).
 * BACKEND: Data from CONTACT_INFO constant above — update as needed.
 */
function InfoBand() {
  return (
    <div className="cu-info-band" role="complementary" aria-label="Contact information">
      <div className="cu-info-grid">
        {CONTACT_INFO.map((item) => (
          <div className="cu-info-card" key={item.label}>
            <div className="cu-info-icon-wrap" aria-hidden="true">{item.icon}</div>
            <div className="cu-info-card-body">
              <div className="cu-info-card-label">{item.label}</div>
              {item.href ? (
                <a className="cu-info-card-primary cu-info-card-link" href={item.href}>
                  {item.primary}
                </a>
              ) : (
                <div className="cu-info-card-primary">{item.primary}</div>
              )}
              <div className="cu-info-card-secondary">{item.secondary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ContactForm — controlled form with validation + submission.
 *
 * BACKEND: On successful submit, POST /api/contact.
 * See submitContactForm() for full payload spec and backend requirements.
 */
function ContactForm() {
  // ── Form state ──
  const [formData, setFormData] = useState({
    firstName:  '',
    lastName:   '',
    email:      '',
    phone:      '',        // optional — for follow-up calls
    subject:    '',        // one of SUBJECTS[].value — BACKEND: used for admin routing
    eventDate:  '',        // optional ISO date — BACKEND: stored in contact_submissions.event_date
    message:    '',        // required — BACKEND: max 1000 chars enforced server-side too
    newsletter: false,     // BACKEND: if true, add to Mailchimp / Klaviyo list
  });

  // ── UI state ──
  const [fieldErrors,  setFieldErrors]  = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError,  setSubmitError]  = useState(null);
  const [successData,  setSuccessData]  = useState(null); // { ticketId } on success

  const MAX_MESSAGE = 1000; // BACKEND: match this cap server-side (Zod .max(1000))

  /** Generic change handler */
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear field error on change so user sees immediate feedback
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /**
   * validateForm — client-side validation.
   * BACKEND: Mirror ALL rules in your Express/Zod schema — never trust client only.
   */
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.firstName.trim())
      errors.firstName = 'First name is required.';

    if (!formData.lastName.trim())
      errors.lastName = 'Last name is required.';

    if (!formData.email.trim())
      errors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Please enter a valid email address.';

    if (!formData.subject)
      errors.subject = 'Please select an enquiry type.';

    if (!formData.message.trim())
      errors.message = 'Please include a message.';
    else if (formData.message.length > MAX_MESSAGE)
      errors.message = `Message must be under ${MAX_MESSAGE} characters.`;

    return errors;
  }, [formData]);

  /**
   * handleSubmit — validates then POSTs to backend.
   *
   * Full payload documented at top of file.
   * BACKEND: POST /api/contact
   */
  const handleSubmit = useCallback(async () => {
    setSubmitError(null);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Scroll to first error field for accessibility
      setTimeout(() => {
        document.querySelector('.cu-input.error, .cu-textarea.error, .cu-select.error')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        // ── Attendee details ─────────────────────────────────────
        firstName:  formData.firstName.trim(),
        lastName:   formData.lastName.trim(),
        email:      formData.email.trim().toLowerCase(),
        phone:      formData.phone.trim() || null,

        // ── Enquiry context ──────────────────────────────────────
        subject:    formData.subject,   // BACKEND: used to route to correct team member
        eventDate:  formData.eventDate || null, // BACKEND: stored as DATE type in DB

        // ── Message ──────────────────────────────────────────────
        message:    formData.message.trim(),

        // ── Marketing consent ────────────────────────────────────
        // BACKEND: If true → add to Mailchimp list:
        //   mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
        //     email_address: payload.email,
        //     status: 'subscribed',
        //     merge_fields: { FNAME: payload.firstName, LNAME: payload.lastName }
        //   });
        newsletter: formData.newsletter,

        // ── Metadata ─────────────────────────────────────────────
        source:    'contact_page',         // for CRM attribution
        consentAt: new Date().toISOString(), // BACKEND: store as TIMESTAMPTZ in DB
        // ipAddress: captured server-side via req.ip — do NOT send from client
      };

      // BACKEND: Replace submitContactForm() with real fetch('/api/contact', {...})
      const result = await submitContactForm(payload);

      if (!result.success) throw new Error('Submission failed. Please try again.');

      // Show success state with ticket ID
      // BACKEND: ticketId returned from DB insert (e.g. "UE-042847")
      setSuccessData({ ticketId: result.ticketId });

      // Reset form
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        subject: '', eventDate: '', message: '', newsletter: false,
      });

    } catch (err) {
      // BACKEND: Distinguish error types:
      //   422 Validation    → "Please check your details and try again."
      //   429 Rate Limit    → "Too many submissions. Please wait a few minutes."
      //   500 Server Error  → "Our server is having issues. Call us directly."
      setSubmitError(
        err.message || 'Something went wrong. Please try again or call us directly.'
      );
      console.error('[ContactUs] Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return (
    <div className="cu-form-card" role="region" aria-labelledby="cu-form-heading">
      {/* Card header */}
      <div className="cu-form-card-header">
        <h2 id="cu-form-heading">Send Us a Message</h2>
        <p>We'd love to hear about your event. Fill in the form and we'll be in touch shortly.</p>
      </div>

      <div className="cu-form-body">
        {/* ── Success banner ── */}
        {successData && (
          <div className="cu-success-banner" role="status" aria-live="polite">
            <span className="cu-success-icon" aria-hidden="true">✅</span>
            <div className="cu-success-text">
              <h4>Message received!</h4>
              {/* BACKEND: Display ticketId for admin cross-reference */}
              <p>
                Thank you for reaching out. Your reference number is{' '}
                <strong>{successData.ticketId}</strong>. We'll reply within 24–48 business hours.
              </p>
            </div>
          </div>
        )}

        {/* ── Global error ── */}
        {submitError && (
          <div className="cu-error-alert" role="alert">{submitError}</div>
        )}

        {/* ── Name row ── */}
        <div className="cu-form-row">
          <div className="cu-field">
            <label htmlFor="cu-first-name">
              First Name <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="cu-first-name"
              className={`cu-input${fieldErrors.firstName ? ' error' : ''}`}
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              autoComplete="given-name"
              aria-required="true"
              aria-describedby={fieldErrors.firstName ? 'cu-fn-err' : undefined}
            />
            {fieldErrors.firstName && (
              <span id="cu-fn-err" className="cu-field-error" role="alert">
                {fieldErrors.firstName}
              </span>
            )}
          </div>
          <div className="cu-field">
            <label htmlFor="cu-last-name">
              Last Name <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="cu-last-name"
              className={`cu-input${fieldErrors.lastName ? ' error' : ''}`}
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              autoComplete="family-name"
              aria-required="true"
            />
            {fieldErrors.lastName && (
              <span className="cu-field-error" role="alert">{fieldErrors.lastName}</span>
            )}
          </div>
        </div>

        {/* ── Email + Phone row ── */}
        <div className="cu-form-row">
          <div className="cu-field">
            <label htmlFor="cu-email">
              Email <span className="required" aria-hidden="true">*</span>
            </label>
            <input
              id="cu-email"
              className={`cu-input${fieldErrors.email ? ' error' : ''}`}
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              autoComplete="email"
              aria-required="true"
              // BACKEND: Used for admin notification reply-to AND user auto-reply
            />
            {fieldErrors.email && (
              <span className="cu-field-error" role="alert">{fieldErrors.email}</span>
            )}
          </div>
          <div className="cu-field">
            <label htmlFor="cu-phone">Phone (optional)</label>
            <input
              id="cu-phone"
              className="cu-input"
              type="tel"
              placeholder="+1 (212) 000-0000"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              autoComplete="tel"
              // BACKEND: Optional — stored for follow-up calls
            />
          </div>
        </div>

        {/* ── Subject chips ── */}
        <div className="cu-field">
          <label>
            Enquiry Type <span className="required" aria-hidden="true">*</span>
          </label>
          <div
            className="cu-subject-chips"
            role="radiogroup"
            aria-label="Enquiry type"
            aria-required="true"
          >
            {SUBJECTS.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`cu-chip${formData.subject === s.value ? ' active' : ''}`}
                onClick={() => handleChange('subject', s.value)}
                aria-pressed={formData.subject === s.value}
                // BACKEND: subject stored as enum in DB; route admin notifications by value
              >
                {s.label}
              </button>
            ))}
          </div>
          {fieldErrors.subject && (
            <span className="cu-field-error" role="alert">{fieldErrors.subject}</span>
          )}
        </div>

        {/* ── Event date (optional) ── */}
        <div className="cu-field">
          <label htmlFor="cu-event-date">
            Approximate Event Date <span style={{ color: 'var(--color-text-light)', fontSize: 11 }}>(optional)</span>
          </label>
          <input
            id="cu-event-date"
            className="cu-input"
            type="date"
            value={formData.eventDate}
            onChange={(e) => handleChange('eventDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]} // prevent past dates
            // BACKEND: Stored as DATE in contact_submissions.event_date
            //          Used by admin to prioritise urgent bookings
          />
        </div>

        {/* ── Message ── */}
        <div className="cu-field">
          <label htmlFor="cu-message">
            Message <span className="required" aria-hidden="true">*</span>
          </label>
          <textarea
            id="cu-message"
            className={`cu-textarea${fieldErrors.message ? ' error' : ''}`}
            rows={5}
            placeholder="Tell us about your event vision, date, guest count, and any special requirements…"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            maxLength={MAX_MESSAGE + 50} // soft over-limit; hard limit enforced on submit
            aria-required="true"
            aria-describedby="cu-msg-count"
            // BACKEND: Sanitise on server side (strip HTML, trim whitespace)
          />
          {/* Character counter */}
          <div
            id="cu-msg-count"
            className={`cu-char-count${formData.message.length > MAX_MESSAGE - 100 ? ' warn' : ''}`}
            aria-live="polite"
          >
            {formData.message.length} / {MAX_MESSAGE}
          </div>
          {fieldErrors.message && (
            <span className="cu-field-error" role="alert">{fieldErrors.message}</span>
          )}
        </div>

        {/* ── Newsletter opt-in ── */}
        <div className="cu-field">
          <label className="cu-checkbox-label">
            <input
              type="checkbox"
              checked={formData.newsletter}
              onChange={(e) => handleChange('newsletter', e.target.checked)}
              // BACKEND: If true → subscribe to Mailchimp / Klaviyo marketing list
              //          List ID stored in env: MAILCHIMP_LIST_ID
              //          Always use double opt-in for GDPR compliance
            />
            <span>
              Keep me updated with inspiration, seasonal offers, and event planning tips
              from Unwritten Events.{' '}
              <em style={{ fontSize: 12, color: 'var(--color-text-light)' }}>
                You can unsubscribe at any time.
              </em>
            </span>
          </label>
        </div>

        {/* ── Submit ── */}
        <button
          className="cu-submit-btn"
          onClick={handleSubmit}
          type="button"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting && <span className="cu-spinner" aria-hidden="true" />}
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>

        {/* Legal note */}
        <p style={{ marginTop: 12, fontSize: 11, color: 'var(--color-text-light)', lineHeight: 1.6, textAlign: 'center' }}>
          {/* BACKEND: Links should point to live /terms and /privacy pages.
              Log consent timestamp + IP server-side with every submission. */}
          By submitting this form you agree to our{' '}
          <a href="#/terms" style={{ color: 'var(--color-pink-accent)' }}>Terms of Use</a>
          {' '}and{' '}
          <a href="#/privacy" style={{ color: 'var(--color-pink-accent)' }}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

/**
 * Sidebar — address, social links, hours.
 * BACKEND: All data is static; update CONTACT_INFO / STUDIO_HOURS / SOCIAL_LINKS constants.
 */
function Sidebar() {
  return (
    <aside className="cu-sidebar" aria-label="Studio information">

      {/* ── Address & contact quick-links ── */}
      <div className="cu-sidebar-card">
        <div className="cu-sidebar-heading">Our Studio</div>

        <div className="cu-sidebar-row">
          <span className="cu-sidebar-icon" aria-hidden="true">📍</span>
          <span>
            {/* BACKEND: Address from /api/settings.address — update when studio moves */}
            New York, NY 10001<br />
            <span style={{ fontSize: 12, color: 'var(--color-text-light)' }}>
              Studio visits by appointment only
            </span>
          </span>
        </div>

        <div className="cu-sidebar-row">
          <span className="cu-sidebar-icon" aria-hidden="true">📞</span>
          {/* BACKEND: Phone from /api/settings.phone */}
          <a href="tel:+15166737943" className="cu-sidebar-row" style={{ textDecoration: 'none', color: 'inherit', padding: 0, border: 'none' }}>
            (516) 673-7943
          </a>
        </div>

        <div className="cu-sidebar-row">
          <span className="cu-sidebar-icon" aria-hidden="true">✉️</span>
          {/* BACKEND: Email from /api/settings.email */}
          <a href="mailto:unwrittenevents@gmail.com" className="">
            unwrittenevents@gmail.com
          </a>
        </div>

        <div className="cu-sidebar-row">
          <span className="cu-sidebar-icon" aria-hidden="true">🌐</span>
          <span>Serving NYC, Long Island,<br />New Jersey &amp; destination events worldwide</span>
        </div>
      </div>

      {/* ── Studio hours ── */}
      <div className="cu-sidebar-card">
        <div className="cu-sidebar-heading">Studio Hours</div>
        {STUDIO_HOURS.map((row) => (
          <div className="cu-hours-row" key={row.day}>
            <span className="cu-hours-day">{row.day}</span>
            {row.time ? (
              <span className="cu-hours-time">{row.time}</span>
            ) : (
              <span className="cu-hours-closed">Closed</span>
            )}
          </div>
        ))}
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-light)', lineHeight: 1.6 }}>
          {/* BACKEND: Response time from /api/settings.responseTime */}
          Response time: within 24–48 business hours
        </p>
      </div>

      {/* ── Social links ── */}
      <div className="cu-sidebar-card">
        <div className="cu-sidebar-heading">Follow Along</div>
        <p style={{ fontSize: 14, color: 'var(--color-text-light)', marginBottom: 14, fontWeight: 300, lineHeight: 1.6 }}>
          Get daily inspiration, behind-the-scenes moments, and real event highlights.
        </p>
        <div className="cu-social-row">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cu-social-btn"
              aria-label={`Follow us on ${s.label}`}
              // BACKEND: Update hrefs in SOCIAL_LINKS constant when handles change
            >
              <span aria-hidden="true">{s.icon}</span>
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Quick-book pill ── */}
      <button
        className="cu-submit-btn"
        style={{ background: 'var(--color-charcoal)', borderRadius: 10, padding: '16px 24px' }}
        onClick={() => { window.location.hash = '/contact'; }}
        type="button"
        aria-label="Book a free strategy call"
      >
        <span aria-hidden="true">📅</span>
        Book Free Strategy Call
      </button>
    </aside>
  );
}

/**
 * MapSection — Google Maps embed.
 *
 * BACKEND INTEGRATION:
 *   1. Go to https://console.cloud.google.com
 *   2. Enable "Maps Embed API"
 *   3. Create an API Key restricted to your domain
 *   4. Store in env: VITE_GOOGLE_MAPS_EMBED_KEY=...
 *   5. Replace iframe src with:
 *      `https://www.google.com/maps/embed/v1/place
 *        ?key=${import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY}
 *        &q=New+York,NY
 *        &zoom=13`
 *
 * Billing note: Maps Embed API is FREE for up to 28,000 monthly loads.
 */
function MapSection() {
  // BACKEND: Set to true once VITE_GOOGLE_MAPS_EMBED_KEY is configured
  const MAPS_ENABLED = false;
  const MAPS_API_KEY = ''; // import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY

  return (
    <div className="cu-map-section" aria-label="Studio location">
      <p className="cu-map-label">Find Us</p>
      <div className="cu-map-wrap">
        {MAPS_ENABLED && MAPS_API_KEY ? (
          <iframe
            title="Unwritten Events studio location"
            src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=New+York,NY&zoom=13`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            // BACKEND: Update q= parameter to exact studio address once finalised
          />
        ) : (
          /* Placeholder shown until Maps API key is configured */
          <div className="cu-map-placeholder" role="img" aria-label="Map placeholder — configure Google Maps API key">
            <div className="cu-map-placeholder-icon" aria-hidden="true">🗺</div>
            <div className="cu-map-placeholder-text">New York, NY</div>
            <div className="cu-map-placeholder-sub">
              {/* BACKEND: Set MAPS_ENABLED = true and add VITE_GOOGLE_MAPS_EMBED_KEY */}
              Map will display once Google Maps API key is configured.
              <br />
              <a
                href="https://maps.google.com?q=New+York,NY"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-pink-accent)', fontSize: 12, marginTop: 6, display: 'inline-block' }}
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * FaqSection — animated accordion.
 * BACKEND: FAQ_ITEMS is static copy — no API needed.
 * If FAQs need to be admin-editable, create:
 *   GET /api/faq  → [{ id, question, answer, order }]
 * and replace FAQ_ITEMS with fetched data.
 */
function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="cu-faq" aria-labelledby="cu-faq-heading">
      <div className="cu-faq-inner">
        <p className="cu-faq-eyebrow">Common Questions</p>
        <h2 className="cu-faq-heading" id="cu-faq-heading">
          Frequently Asked
        </h2>

        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`cu-faq-item${openIndex === i ? ' open' : ''}`}
          >
            <button
              className="cu-faq-question"
              onClick={() => toggleFaq(i)}
              type="button"
              aria-expanded={openIndex === i}
              aria-controls={`cu-faq-answer-${i}`}
              id={`cu-faq-btn-${i}`}
            >
              <span className="cu-faq-q-text">{item.q}</span>
              <span className="cu-faq-chevron" aria-hidden="true">▾</span>
            </button>
            {/* Animated answer — max-height transition handles open/close */}
            <div
              id={`cu-faq-answer-${i}`}
              className="cu-faq-answer"
              role="region"
              aria-labelledby={`cu-faq-btn-${i}`}
            >
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * CtaBand — "Book a Free Strategy Call" section before the footer.
 * Matches the CTA pattern used in Testimonials, About, Blogs, Services pages.
 * BACKEND: Static — no API needed. onClick navigates to #/contact (FreeConsultation page).
 */
function CtaBand() {
  return (
    <section className="cu-cta" aria-label="Book a free strategy call">
      <p className="cu-cta-eyebrow">Free · 30 Minutes · No Obligation</p>
      <h2>Ready to write your next chapter?</h2>
      <p className="cu-cta-sub">
        Let's collaborate on an event that is uniquely yours — from intimate dinners
        to grand celebrations. Book your free strategy call today.
      </p>
      {/* BACKEND: href navigates to FreeConsultation page (#/contact) */}
      <button
        className="cu-cta-btn"
        onClick={() => { window.location.hash = '/contact'; }}
        type="button"
        aria-label="Book a free 30-minute strategy call"
      >
        <span aria-hidden="true">📅</span>
        Schedule FREE Strategy Call
      </button>
      <p className="cu-cta-note">No credit card required · Replies within 48 hours</p>
    </section>
  );
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────

/**
 * ContactUs — main page component.
 *
 * Route: Add to App.jsx hash router:
 *   if (hash === '#/contact-us') return <ContactUs />;
 *
 * Also update Header.jsx CONTACT US link:
 *   { label: 'CONTACT US', href: '#/contact-us' }
 *
 * Note: Keep #/contact reserved for FreeConsultation (booking calendar).
 */
export default function ContactUs() {
  // Scroll to top on mount — important for hash-router pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="page-container cu-root">
      {/* ── Shared site header ── */}
      <Header />

      <main>
        {/* 1. Hero banner */}
        <HeroBanner />

        {/* 2. Contact info cards strip */}
        <InfoBand />

        {/* 3. Two-column: form + sidebar */}
        <div className="cu-main">
          {/* LEFT: Contact form
              BACKEND: Form submits to POST /api/contact
              See ContactForm component and submitContactForm() for full spec */}
          <ContactForm />

          {/* RIGHT: Studio info sidebar */}
          <Sidebar />
        </div>

        {/* 4. Google Maps embed
            BACKEND: Configure VITE_GOOGLE_MAPS_EMBED_KEY in .env to activate */}
        <MapSection />

        {/* 5. FAQ accordion — static copy, no API needed */}
        <FaqSection />

        {/* 6. Free Consultation CTA — matches pattern across all pages
            Navigates to #/contact (FreeConsultation.jsx booking page) */}
        <CtaBand />
      </main>

      {/* ── Shared site footer ── */}
      <Footer />
    </div>
  );
}
