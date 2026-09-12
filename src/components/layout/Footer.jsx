import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Social icon data ── */
const SOCIALS = [
  {
    label: 'WhatsApp',
    href: '#',
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/spinfyot/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    label: 'Facebook',
    href: '#',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/spinfyot/posts/?feedView=all',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
];

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

const SERVICES_LINKS = [
  { label: 'Career Counselling', to: '/services/career-counselling' },
  { label: 'University Selection', to: '/services/university-selection' },
  { label: 'Visa Assistance', to: '/services/visa-assistance' },
  { label: 'Pre-Departure Support', to: '/services/pre-departure-support' },
  { label: 'Post-Arrival Support', to: '/services/post-arrival-support' },
  { label: 'Work Visa Assistance', to: '/services/work-visa-assistance' },
  { label: 'Spouse Services', to: '/services/spouse-services' },
  { label: 'Appeals & Legal Support', to: '/services/appeals-legal-support' },
  { label: 'Accommodation Assistance', to: '/services/accommodation-assistance' },
  { label: 'IELTS', to: '/services/ielts' },
];

export default function Footer() {
  const handleScrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer style={{ width: '100%', background: '#000000', color: '#ffffff', fontFamily: "'Poppins', sans-serif", overflow: 'hidden' }}>
      {/* Centered Main Container */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 40px 24px 40px' }}>
        
        {/* 4-Column Grid */}
        <div className="footer-grid">
          
          {/* Column 1: Brand */}
          <div className="footer-col brand-col">
            <Link to="/" onClick={handleScrollToTop} style={{ display: 'inline-block', marginBottom: '16px', background: '#F5F3EE', padding: '14px 20px', borderRadius: '14px', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <img src="/assets/logo/spinfyot-logo-transparent.png" alt="Spinfyot" style={{ height: '52px', width: 'auto', display: 'block', transform: 'scale(1.2)' }} />
            </Link>
            <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px', maxWidth: '280px', fontWeight: '300' }}>
              Expert guidance and seamless support for your global education journey.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target={s.href === '#' ? undefined : "_blank"} rel="noopener noreferrer" onClick={s.href === '#' ? (e) => e.preventDefault() : undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', color: '#9CA3AF', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.background = '#E57A44'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d={s.path}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col quick-links-col">
            <h3 style={{ color: '#E57A44', fontSize: '13px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {QUICK_LINKS.map(link => (
                <li key={link.label}>
                  <Link to={link.to} onClick={handleScrollToTop} style={{ color: '#D1D5DB', fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block', fontWeight: '300' }} onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateX(4px)' }} onMouseLeave={e => { e.currentTarget.style.color = '#D1D5DB'; e.currentTarget.style.transform = 'translateX(0)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="footer-col services-col">
            <h3 style={{ color: '#E57A44', fontSize: '13px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>Services</h3>
            <div className="services-inner-grid">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {SERVICES_LINKS.slice(0, 5).map(link => (
                  <li key={link.label}>
                    <Link to={link.to} onClick={handleScrollToTop} style={{ color: '#D1D5DB', fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block', fontWeight: '300', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateX(4px)' }} onMouseLeave={e => { e.currentTarget.style.color = '#D1D5DB'; e.currentTarget.style.transform = 'translateX(0)' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {SERVICES_LINKS.slice(5, 10).map(link => (
                  <li key={link.label}>
                    <Link to={link.to} onClick={handleScrollToTop} style={{ color: '#D1D5DB', fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s', display: 'inline-block', fontWeight: '300', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateX(4px)' }} onMouseLeave={e => { e.currentTarget.style.color = '#D1D5DB'; e.currentTarget.style.transform = 'translateX(0)' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="footer-col contact-col">
            <h3 style={{ color: '#E57A44', fontSize: '13px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px' }}>Contact</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg style={{ width: '18px', height: '18px', color: '#9CA3AF', flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919876543210" style={{ color: '#D1D5DB', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s', fontWeight: '300' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#D1D5DB'}>
                  +91 98765 43210
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg style={{ width: '18px', height: '18px', color: '#9CA3AF', flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:Ketan@spinfyot.in" style={{ color: '#D1D5DB', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s', fontWeight: '300' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#D1D5DB'}>
                  Ketan@spinfyot.in
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg style={{ width: '18px', height: '18px', color: '#9CA3AF', flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span style={{ color: '#D1D5DB', fontSize: '13px', lineHeight: '1.6', fontWeight: '300' }}>
                  123 Education Hub, Global City,<br/>State, 123456
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider & Bottom Bar */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="footer-bottom">
          <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0, fontWeight: '300' }}>
            &copy; 2026 SpinFyot. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link to="/privacy" onClick={handleScrollToTop} style={{ color: '#9CA3AF', fontSize: '12px', textDecoration: 'none', transition: 'color 0.2s', fontWeight: '300' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
              Privacy Policy
            </Link>
            <Link to="/terms" onClick={handleScrollToTop} style={{ color: '#9CA3AF', fontSize: '12px', textDecoration: 'none', transition: 'color 0.2s', fontWeight: '300' }} onMouseEnter={e => e.currentTarget.style.color = '#ffffff'} onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
              Terms of Service
            </Link>
          </div>
        </div>

      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 0.8fr 2.5fr 1.1fr;
          gap: 64px;
        }
        .services-inner-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .brand-col, .quick-links-col, .services-col {
          position: relative;
        }
        .brand-col::after, .quick-links-col::after, .services-col::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          right: -32px;
          width: 1px;
          background: rgba(255, 255, 255, 0.1);
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 56px;
          }
          .brand-col {
            grid-column: span 2;
          }
          .brand-col::after, .quick-links-col::after, .services-col::after {
            display: none;
          }
        }
        @media (max-width: 850px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .brand-col {
            grid-column: span 1;
          }
        }
        @media (max-width: 640px) {
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
        }
        @media (max-width: 480px) {
          .services-inner-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </footer>
  );
}

