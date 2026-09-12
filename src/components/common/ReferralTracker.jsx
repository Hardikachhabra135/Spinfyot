import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiUrl } from '../../utils/api';

export default function ReferralTracker() {
  const location = useLocation();

  useEffect(() => {
    let referralSlug = null;

    // Check path for /ref/:slug
    if (location.pathname.startsWith('/ref/')) {
      referralSlug = location.pathname.replace('/ref/', '').split('/')[0];
    } else {
      // Check query string for ?ref=...
      const searchParams = new URLSearchParams(location.search);
      referralSlug = searchParams.get('ref');
    }

    if (referralSlug) {
      // Generate or retrieve anonymous visitor ID
      let visitorId = localStorage.getItem('visitorId');
      if (!visitorId) {
        visitorId = 'vid_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('visitorId', visitorId);
      }

      // Track the click on the backend
      fetch(apiUrl('/api/public/referrals/track'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: referralSlug,
          visitorId,
          landingPage: location.pathname,
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          referrer: document.referrer
        })
      }).catch(err => console.error('Failed to track referral:', err));

      // Store referral in local storage (expires optionally, we just keep it until overridden)
      localStorage.setItem('referral_slug', referralSlug);

      // If it was a /ref/:slug route, we might want to rewrite the URL to / so the user just sees the normal site.
      // Or we can just let React Router render the Home component (done in App.jsx).
    }
  }, [location]);

  return null;
}
