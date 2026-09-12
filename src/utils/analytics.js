const API_BASE_URL = 'http://localhost:5000'; // Make sure this matches backend config

// Generate or retrieve anonymous session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('spinfyot_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('spinfyot_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Tracks an analytics event to the backend securely
 * @param {string} eventType - The type of event (e.g., 'page_view', 'cta_click', 'form_started')
 * @param {string} path - The path where the event occurred
 * @param {object} metadata - Additional context for the event (avoid sensitive PII)
 */
export const trackEvent = async (eventType, path = window.location.pathname, metadata = {}) => {
  try {
    const payload = {
      eventType,
      path,
      metadata: {
        ...metadata,
        sessionId: getSessionId()
      }
    };

    // Use sendBeacon if available for better non-blocking delivery, otherwise fallback to fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(`${API_BASE_URL}/api/public/analytics/track`, blob);
    } else {
      await fetch(`${API_BASE_URL}/api/public/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }
  } catch (error) {
    // Fail silently on public frontend
    console.error('Analytics tracking failed silently.');
  }
};
