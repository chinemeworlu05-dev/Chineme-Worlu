import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chinemeLogo from '../assets/chineme-logo.png';

export default function Header({ bars = 2 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If already on the homepage, smooth-scroll to the section.
  // If on any other page (e.g. /projects/homefind), navigate to / then let
  // the browser jump to the hash — React Router handles the hash on arrival.
  const handleNavClick = (sectionId) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleWorkClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate('/works');
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" onClick={handleHomeClick} className="header-logo-link" aria-label="Chineme Home">
          <img src={chinemeLogo} alt="Chineme" className="header-logo" loading="eager" decoding="async" />
        </a>

        {/* Desktop Navigation */}
        <nav className="header-nav" aria-label="Main Navigation">
          <a href="/"        onClick={handleHomeClick}              className="nav-link">Home</a>
          <a href="/#about"  onClick={handleNavClick('about')}      className="nav-link">About</a>
          <a href="/works" onClick={handleWorkClick} className="nav-link">Works</a>
          <a href="/#contact" onClick={handleNavClick('contact')}   className="nav-link">Contact</a>
        </nav>

        {/* Mobile Hamburger Toggle — 2 bars by default, 3 with bars={3} */}
        <button
          className={`header-mobile-toggle ${bars === 3 ? 'is-triple' : ''} ${mobileMenuOpen ? 'is-open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {bars === 3 && <span className="hamburger-bar" />}
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <nav className="mobile-nav-menu" onClick={(e) => e.stopPropagation()} aria-label="Mobile Navigation">
            <a href="/" onClick={handleHomeClick} className="mobile-nav-link">Home</a>
            <a href="/#about" onClick={handleNavClick('about')} className="mobile-nav-link">About</a>
            <a href="/works" onClick={handleWorkClick} className="mobile-nav-link">Works</a>
            <a href="/#contact" onClick={handleNavClick('contact')} className="mobile-nav-link">Contact</a>
          </nav>
        </div>
      )}
    </header>
  );
}
