import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Social icon data ── */
const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/spinfyot/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/spinfyot/posts/?feedView=all',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
];

/* ── Nav links ── */
const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 },
    }),
  };

  return (
    <footer
      style={{
        width: '100%',
        background: '#000000', /* Pure black base */
        fontFamily: "'Poppins', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        borderTopLeftRadius: 'clamp(24px, 5vw, 48px)',
        borderTopRightRadius: 'clamp(24px, 5vw, 48px)',
        marginTop: '-24px', /* Pull it up slightly if needed to overlap cleanly, or remove if not needed */
      }}
    >
      {/* ── Main content wrapper ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(20px, 4vw, 32px) clamp(16px, 4vw, 32px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(12px, 2vw, 16px)',
        }}
      >
        {/* ══════════ TOP ROW: Logo Box + Content Box ══════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'clamp(12px, 2vw, 16px)',
            alignItems: 'stretch',
          }}
          className="footer-top-row"
        >
          {/* ── LEFT: Logo White Box ── */}
          <motion.div
            variants={fadeUp}
            custom={0}
            style={{
              background: '#F5F3EE',
              borderRadius: '16px',
              padding: 'clamp(20px, 3vw, 32px) clamp(24px, 4vw, 40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '14px',
              minWidth: '200px',
            }}
            className="footer-logo-box"
          >
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              <img
                src="/assets/logo/spinfyot-logo-transparent.png"
                alt="Spinfyot"
                className="footer-logo-img"
                style={{
                  height: '58px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Link>
            <p
              className="footer-logo-desc"
              style={{
                color: '#6B7280',
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '240px',
                letterSpacing: '0.01em',
              }}
            >
              Guiding your global education journey with precision and care.
            </p>
          </motion.div>

          {/* ── RIGHT: Nav + Social White Box ── */}
          <motion.div
            variants={fadeUp}
            custom={1}
            style={{
              background: '#F5F3EE',
              borderRadius: '16px',
              padding: 'clamp(20px, 3vw, 32px) clamp(24px, 4vw, 40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
            }}
            className="footer-content-box"
          >
            {/* Nav links row */}
            <nav
              className="footer-nav-links"
              aria-label="Footer navigation"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px 28px',
                alignItems: 'center',
              }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    padding: '2px 0',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#E57A44'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#374151'; }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social icons */}
            <div className="footer-social-icons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#E8E5DE',
                    color: '#374151',
                    textDecoration: 'none',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#173B63';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#E8E5DE';
                    e.currentTarget.style.color = '#374151';
                  }}
                >
                  <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ══════════ BOTTOM ROW: Full-width Contact Box ══════════ */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={2}
          style={{
            background: '#F5F3EE',
            borderRadius: '16px',
            padding: 'clamp(16px, 3vw, 24px) clamp(24px, 4vw, 40px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px 32px',
          }}
          className="footer-bottom-box"
        >
          {/* Contact info */}
          <div className="footer-contact-info" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 24px' }}>
            <a
              href="mailto:Ketan@spinfyot.in"
              style={{
                color: '#374151',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: 500,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E57A44'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#374151'; }}
            >
              Ketan@spinfyot.in
            </a>
            <span className="footer-separator" style={{ color: '#D1D5DB', fontSize: '18px', userSelect: 'none' }} aria-hidden="true">&middot;</span>
            <a
              href="tel:+919876543210"
              style={{
                color: '#374151',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                fontWeight: 500,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E57A44'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#374151'; }}
            >
              +91 98765 43210
            </a>
            <span className="footer-separator" style={{ color: '#D1D5DB', fontSize: '18px', userSelect: 'none' }} aria-hidden="true">&middot;</span>
            <span style={{ color: '#6B7280', fontSize: '12px', fontWeight: 400 }}>
              123 Education Hub, Global City, State, 123456
            </span>
          </div>

          {/* Copyright + legal links */}
          <div className="footer-legal" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', alignItems: 'center' }}>
            <span style={{ color: '#9CA3AF', fontSize: '11px', letterSpacing: '0.08em' }}>
              &copy; 2026 SPINFYOT
            </span>
            <Link
              to="/privacy"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ color: '#9CA3AF', fontSize: '11px', textDecoration: 'none', transition: 'color 0.2s ease', letterSpacing: '0.04em' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#374151'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ color: '#9CA3AF', fontSize: '11px', textDecoration: 'none', transition: 'color 0.2s ease', letterSpacing: '0.04em' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#374151'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; }}
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        /* Desktop: side-by-side top row */
        .footer-top-row {
          grid-template-columns: auto 1fr !important;
        }

        /* Tablet (below 992px) */
        @media (max-width: 992px) {
          .footer-top-row {
            grid-template-columns: 1fr 1.5fr !important;
          }
          .footer-logo-box {
            min-width: 0 !important;
          }
          .footer-bottom-box {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 20px !important;
          }
        }
        
        /* Mobile (below 768px) */
        @media (max-width: 768px) {
          .footer-top-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          .footer-logo-box, .footer-content-box {
            padding: 16px 12px !important;
            gap: 12px !important;
          }
        }

        /* Small Mobile (below 576px) */
        @media (max-width: 576px) {
          .footer-top-row {
            gap: 8px !important;
          }
          .footer-logo-box, .footer-content-box {
            padding: 12px 8px !important;
            border-radius: 12px !important;
          }
          .footer-logo-img {
            max-width: 100% !important;
            height: auto !important;
            max-height: 48px !important;
          }
          .footer-logo-desc {
            font-size: 11px !important;
            line-height: 1.4 !important;
          }
          .footer-nav-links {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .footer-nav-links a {
            font-size: 12px !important;
          }
          .footer-social-icons {
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          .footer-social-icons a {
            width: 28px !important;
            height: 28px !important;
            border-radius: 6px !important;
          }
          .footer-social-icons svg {
            width: 14px !important;
            height: 14px !important;
          }
          .footer-contact-info {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .footer-contact-info a, .footer-contact-info span:not(.footer-separator) {
            font-size: 12px !important;
          }
          .footer-separator {
            display: none !important;
          }
          .footer-legal {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
        
        /* Extra small devices (below 380px) */
        @media (max-width: 380px) {
           .footer-logo-img {
             max-height: 40px !important;
           }
           .footer-logo-desc {
             font-size: 10px !important;
           }
           .footer-nav-links a {
             font-size: 11px !important;
           }
           .footer-contact-info a, .footer-contact-info span:not(.footer-separator) {
             font-size: 11px !important;
           }
        }
      `}</style>
    </footer>
  );
}
