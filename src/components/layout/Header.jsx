import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/#services' },
  { name: 'About', path: '/#about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact us', path: '/contact' },
];

// Scrolled state — compact floating pill (user-approved size)
const scrolledHeader = {
  position: 'fixed',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '95%',
  maxWidth: '1380px',
  top: '8px',
  zIndex: 40,
  borderRadius: '22px',
  background: '#F5F3EE',
  boxShadow: '0 2px 20px rgba(0,0,0,0.10)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Landing state — wide, premium, nearly edge-to-edge
const landingHeader = {
  position: 'fixed',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '98%',
  maxWidth: '1600px',
  top: '16px',
  zIndex: 40,
  borderRadius: '24px',
  background: '#F5F3EE',
  boxShadow: '0 6px 40px rgba(0,0,0,0.10)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
};

const styles = {
  innerScrolled: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 32px',
  },
  innerLanding: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 48px',
  },
  logoScrolled: {
    height: '40px',
    width: 'auto',
    objectFit: 'contain',
    mixBlendMode: 'multiply',
    display: 'block',
    transition: 'height 0.4s',
  },
  logoLanding: {
    height: '56px',
    width: 'auto',
    objectFit: 'contain',
    mixBlendMode: 'multiply',
    display: 'block',
    transition: 'height 0.4s',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    width: '200px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    position: 'relative',
    color: '#111827',
    fontWeight: 600,
    fontSize: '18px',
    fontFamily: 'Poppins, Inter, sans-serif',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s',
  },
  navLinkUnderline: {
    position: 'absolute',
    bottom: '-3px',
    left: 0,
    width: '100%',
    height: '2px',
    background: '#1F3A5C',
    borderRadius: '2px',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
    opacity: 0.7,
  },
  btnWrap: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '200px',
    flexShrink: 0,
  },
  inquireBtn: {
    background: '#1F3A5C',
    color: '#ffffff',
    fontFamily: 'Poppins, Inter, sans-serif',
    fontWeight: 700,
    fontSize: '18px',
    padding: '14px 40px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 16px rgba(31,58,92,0.28)',
    transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
    display: 'inline-block',
  },
};

export default function Header({ onInquireClick }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [btnHovered, setBtnHovered] = useState(false);
  const location = useLocation();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 80);
  });

  // Listen for hash changes to scroll to elements even after page navigation
  React.useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      // Slight delay to allow DOM to render if we just navigated from another page
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100; // Offset for header
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    
    // If clicking Home, ensure we scroll to top
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
    // If clicking a hash link and we are ALREADY on the home page, scroll manually immediately
    else if (path.startsWith('/#') && location.pathname === '/') {
      const id = path.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const currentHeaderStyle = isScrolled ? scrolledHeader : landingHeader;
  const currentInnerStyle = isScrolled ? styles.innerScrolled : styles.innerLanding;
  const currentLogoStyle = isScrolled ? styles.logoScrolled : styles.logoLanding;

  const btnStyle = {
    ...styles.inquireBtn,
    background: btnHovered ? '#2b4f7a' : '#1F3A5C',
    transform: btnHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: btnHovered
      ? '0 8px 24px rgba(31,58,92,0.36)'
      : '0 4px 16px rgba(31,58,92,0.28)',
  };

  return (
    <>
      {/* ─── Desktop / Tablet Navbar ─── */}
      <motion.header style={currentHeaderStyle}>
        <div style={currentInnerStyle}>
          {/* Logo */}
          <div style={styles.logoWrap}>
            <Link to="/" onClick={() => handleNavClick('/')}>
              <img
                src="/assets/logo/spinfyot-logo-transparent.png"
                alt="Spinfyot"
                style={currentLogoStyle}
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex" style={styles.nav}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                style={{
                  ...styles.navLink,
                  color: hoveredLink === link.name ? '#1F3A5C' : '#111827',
                }}
                onMouseEnter={(e) => {
                  setHoveredLink(link.name);
                  const underline = e.currentTarget.querySelector('.nav-underline');
                  if (underline) underline.style.transform = 'scaleX(1)';
                }}
                onMouseLeave={(e) => {
                  setHoveredLink(null);
                  const underline = e.currentTarget.querySelector('.nav-underline');
                  if (underline) underline.style.transform = 'scaleX(0)';
                }}
              >
                {link.name}
                <span className="nav-underline" style={styles.navLinkUnderline} />
              </Link>
            ))}
          </nav>

          {/* Inquire Button */}
          <div className="hidden md:flex" style={{ display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
            <button
              className="bubbles"
              onClick={onInquireClick}
            >
              <span className="text">Inquire</span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden"
            style={{ padding: '8px', color: '#1F3A5C', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </motion.header>

      {/* ─── Mobile Slide-In Menu ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end"
            style={{ background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                width: '80%',
                maxWidth: '360px',
                height: '100%',
                background: '#F5F3EE',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.2)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
                <button
                  style={{ padding: '8px', color: '#1F3A5C', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <X size={28} />
                </button>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => handleNavClick(link.path)}
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#1F3A5C',
                      textDecoration: 'none',
                      fontFamily: 'Poppins, Inter, sans-serif',
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div style={{ marginTop: 'auto', paddingBottom: '32px' }}>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onInquireClick) onInquireClick();
                  }}
                  style={{
                    width: '100%',
                    background: '#1F3A5C',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '18px',
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, Inter, sans-serif',
                  }}
                >
                  Inquire Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
