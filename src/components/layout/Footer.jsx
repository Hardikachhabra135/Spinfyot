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

/* ── Inline style tokens (scoped entirely to footer) ── */
const T = {
  bg: '#1F3A5C',            // Exact match of testimonials section bg — zero transition line
  bgDeep: '#182F4A',        // Very subtly deeper at the bottom bar — barely perceptible
  textPrimary: 'rgba(255,255,255,0.92)',
  textMuted: 'rgba(180,205,255,0.55)',
  textFaint: 'rgba(153,182,245,0.38)',
  accent: 'rgba(153,182,245,0.22)',
  divider: 'rgba(255,255,255,0.08)',
  font: "'Poppins', sans-serif",
};

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
        background: T.bg,          /* matches the section above — no hard edge */
        fontFamily: T.font,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Very subtle top fade to blend with the main page wrapper bg */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bgDeep} 100%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Faint radial atmospheric glow — premium depth without drama */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '200px',
          background: 'radial-gradient(ellipse at top, rgba(153,182,245,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Main content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '52px 32px 0',
        }}
      >
        {/* ── Top row: Logo + tagline | Nav + socials ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          {/* LEFT: Logo + tagline */}
          <motion.div variants={fadeUp} custom={0} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '10px',
                padding: '6px 14px',
                transition: 'background 0.25s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.92)'; }}
            >
              <img
                src="/assets/logo/spinfyot-logo-transparent.png"
                alt="Spinfyot"
                style={{
                  height: '36px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Link>
            <p
              style={{
                color: T.textMuted,
                fontSize: '13px',
                fontWeight: 300,
                letterSpacing: '0.02em',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '260px',
              }}
            >
              Guiding your global education journey with precision and care.
            </p>
          </motion.div>

          {/* RIGHT: Nav links + social icons */}
          <motion.div
            variants={fadeUp}
            custom={1}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}
          >
            {/* Nav links */}
            <nav aria-label="Footer navigation" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', justifyContent: 'flex-end' }}>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{
                    color: T.textMuted,
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    padding: '2px 0',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = T.textPrimary; }}
                  onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: T.accent,
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'background 0.2s ease, color 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(153,182,245,0.35)';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = T.accent;
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
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

        {/* ── Thin divider ── */}
        <div style={{ width: '100%', height: '1px', background: T.divider, marginBottom: '20px' }} />

        {/* ── Contact row ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={2}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '6px 24px',
            marginBottom: '20px',
          }}
        >
          <a
            href="mailto:Ketan@spinfyot.in"
            style={{ color: T.textMuted, fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s ease', fontWeight: 400 }}
            onMouseEnter={e => { e.currentTarget.style.color = T.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; }}
          >
            Ketan@spinfyot.in
          </a>
          <span style={{ color: T.divider, fontSize: '18px', userSelect: 'none' }} aria-hidden="true">&middot;</span>
          <a
            href="tel:+919876543210"
            style={{ color: T.textMuted, fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s ease', fontWeight: 400 }}
            onMouseEnter={e => { e.currentTarget.style.color = T.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; }}
          >
            +91 98765 43210
          </a>
          <span style={{ color: T.divider, fontSize: '18px', userSelect: 'none' }} aria-hidden="true">&middot;</span>
          <span style={{ color: T.textFaint, fontSize: '12px', fontWeight: 300 }}>
            123 Education Hub, Global City, State, 123456
          </span>
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          background: T.bgDeep,
          borderTop: `1px solid ${T.divider}`,
          padding: '14px 32px',
          marginTop: '0',
        }}
      >
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px 20px',
          }}
        >
          <span style={{ color: T.textFaint, fontSize: '11px', letterSpacing: '0.08em' }}>
            &copy; 2026 SPINFYOT
          </span>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link
              to="/privacy"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ color: T.textFaint, fontSize: '11px', textDecoration: 'none', transition: 'color 0.2s ease', letterSpacing: '0.04em' }}
              onMouseEnter={e => { e.currentTarget.style.color = T.textMuted; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textFaint; }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ color: T.textFaint, fontSize: '11px', textDecoration: 'none', transition: 'color 0.2s ease', letterSpacing: '0.04em' }}
              onMouseEnter={e => { e.currentTarget.style.color = T.textMuted; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textFaint; }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </motion.div>

    </footer>
  );
}
