const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

    // Use fetch with keepalive which is the modern standard for non-blocking analytics delivery
    await fetch(`${API_BASE_URL}/api/public/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    // Fail silently on public frontend
    console.error('Analytics tracking failed silently.');
  }
};
