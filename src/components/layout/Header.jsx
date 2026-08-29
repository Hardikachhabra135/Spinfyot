import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/#about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact us', path: '/contact' },
];

// Determine the "active" nav item based on current location
function getActiveLink(pathname, hash) {
  if (pathname === '/' && hash === '#about') return 'About';
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/services')) return 'Services';
  if (pathname.startsWith('/blog')) return 'Blog';
  if (pathname.startsWith('/contact')) return 'Contact us';
  return null;
}

// Scrolled state — compact floating pill
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
};

export default function Header({ onInquireClick }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const activeLink = getActiveLink(location.pathname, location.hash);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 80);
  });

  // Listen for hash changes to scroll to elements after navigation
  React.useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path.startsWith('/#') && location.pathname === '/') {
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
            {navLinks.map((link) => {
              const isActive = activeLink === link.name;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  style={{
                    position: 'relative',
                    color: isActive ? '#1F3A5C' : '#111827',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '18px',
                    fontFamily: 'Poppins, Inter, sans-serif',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                    paddingBottom: '4px',
                  }}
                  className="nav-link-item"
                >
                  {link.name}

                  {/* Permanent active underline */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        right: 0,
                        height: '2.5px',
                        background: 'linear-gradient(90deg, #1F3A5C, #3a6fa8)',
                        borderRadius: '2px',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover underline (only for non-active) */}
                  {!isActive && (
                    <span
                      className="nav-hover-underline"
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: '#1F3A5C',
                        borderRadius: '2px',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.25s ease',
                        opacity: 0.5,
                      }}
                    />
                  )}
                </Link>
              );
            })}
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
                {navLinks.map((link) => {
                  const isActive = activeLink === link.name;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => handleNavClick(link.path)}
                      style={{
                        fontSize: '22px',
                        fontWeight: 700,
                        color: isActive ? '#1F3A5C' : '#4a5568',
                        textDecoration: 'none',
                        fontFamily: 'Poppins, Inter, sans-serif',
                        borderLeft: isActive ? '4px solid #1F3A5C' : '4px solid transparent',
                        paddingLeft: '12px',
                        transition: 'all 0.2s',
                      }}
                    >
                      {link.name}
                    </Link>
                  );
                })}
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

      {/* Hover underline CSS */}
      <style>{`
        .nav-link-item:hover .nav-hover-underline {
          transform: scaleX(1) !important;
        }
      `}</style>
    </>
  );
}
