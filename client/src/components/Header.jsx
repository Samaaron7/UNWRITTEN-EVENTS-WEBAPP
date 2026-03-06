import { useEffect, useState } from 'react';
import '../styles/Header.css';

/**
 * Header Component
 * Shared navigation header used across all pages.
 * Uses hash routing to navigate between Home (#/) and Services (#/services).
 */
export default function Header() {
  const [activeLink, setActiveLink] = useState('#/');

  useEffect(() => {
    const updateActive = () => {
      const hash = window.location.hash || '#/';
      setActiveLink(hash);
    };
    updateActive();
    window.addEventListener('hashchange', updateActive);
    return () => window.removeEventListener('hashchange', updateActive);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#/' },
    { label: 'SERVICES', href: '#/services' },
    { label: 'TESTIMONIALS', href: '#/testimonials' },
    { label: 'OUR WORK', href: '#/our-work' },
    { label: 'BLOGS', href: '#/blogs' },
    { label: 'CONTACT US', href: '#/contact-us' },
  ];

  const socialLinks = [
    { label: 'Instagram', icon: 'black-instagram-icon.webp', href: 'https://www.instagram.com/unwrittenev?igsh=Zmw4bnhieWYyY243' },
    { label: 'Pinterest', icon: 'pinterest-icon.webp', href: 'https://pinterest.com/unwrittenevents' },
    { label: 'TikTok', icon: 'tiktok-icon.webp', href: 'https://tiktok.com/@unwrittenevents' },
    // { label: 'LinkedIn', icon: 'linkedin-icon.webp', href: 'https://linkedin.com/company/unwrittenevents' },
  ];

  return (
    <header className="header">
      <div className="header-logo"><img src="src/assets/frontEnd-images/Unwritten-Events-Logo-Header.png" alt="" />
      </div>
      {/*<div className="header-logo">
        <div className="header-logo-monogram">UE</div> 
        <div className="header-logo-name">UNWRITTEN EVENTS</div>
        <div className="header-logo-tagline">luxury event planning · new york</div> 
      </div>*/}

      <nav className="header-nav">
        <ul className="header-nav-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={activeLink === link.href || (link.href === '#/' && activeLink.startsWith('#/') && !activeLink.includes('/services') && !activeLink.includes('/testimonials') && !activeLink.includes('/our-work') && !activeLink.includes('/blogs') && !activeLink.includes('/contact-us') && !activeLink.includes('/free-consultation') && !activeLink.includes('/consultation-done')) ? 'active' : ''}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Social Media Icons */}
      <div className="header-social">
        {socialLinks.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="header-social-link"
            aria-label={social.label}
            title={social.label}
          >
            <img src={`src/assets/frontEnd-images/${social.icon}`} alt={social.label} />
          </a>
        ))}
      </div>
    </header>
  );
}
