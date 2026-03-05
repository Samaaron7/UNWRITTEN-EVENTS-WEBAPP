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
    { label: 'OUR WORK', href: '#our-work' },
    { label: 'TESTIMONIALS', href: '#testimonials' },
    { label: 'BLOGS', href: '#blogs' },
    { label: 'CONTACT US', href: '#contact' },
  ];

  return (
    <header className="header">
      <div className="header-logo">
        <div className="header-logo-monogram">UE</div>
        <div className="header-logo-name">UNWRITTEN EVENTS</div>
        <div className="header-logo-tagline">luxury event planning · new york</div>
      </div>
      <nav className="header-nav">
        <ul className="header-nav-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={activeLink === link.href || (link.href === '#/' && activeLink.startsWith('#/') && !activeLink.includes('/services')) ? 'active' : ''}
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
