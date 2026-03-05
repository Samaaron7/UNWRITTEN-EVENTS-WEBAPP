import '../styles/Header.css';

/**
 * Footer Component
 * Shared footer used across all pages.
 * Contains logo, contact info, social links, and navigation.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-logo-section">
          <div className="footer-logo-monogram">UE</div>
          <div className="footer-logo-name">UNWRITTEN EVENTS</div>
          <div className="footer-social">
            {['X', 'IG', 'FB'].map((social) => (
              <a key={social} href="#" className="footer-social-link">
                {social}
              </a>
            ))}
          </div>
          <div className="footer-contact">
            <p>events@unwrittenevents.com</p>
            <p>(212) 555-7843</p>
          </div>
        </div>

        <div className="footer-section footer-nav-section">
          <h4>Navigate</h4>
          <ul className="footer-nav-links">
            <li><a href="#/">Home</a></li>
            <li><a href="#/services">Services</a></li>
            <li><a href="#our-work">Our Work</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#blogs">Blogs</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section footer-hours-section">
          <h4>Studio Hours</h4>
          <p>Monday – Friday<br />9:00 AM – 6:00 PM EST</p>
          <p style={{ marginTop: '12px' }}>
            Saturday by appointment.<br />Sunday: closed.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; Copyright 1999–{currentYear} by Ingenious Data. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
