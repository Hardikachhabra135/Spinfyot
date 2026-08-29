/**
 * Spinfyot Production API Configuration
 * Supports VITE_API_URL for Vercel deployment with fallback for local dev proxy.
 */

// If VITE_API_URL is set (e.g. 'https://spinfyot-api.onrender.com'), use it without trailing slash.
// Otherwise fallback to empty string (which uses relative paths like '/api' through Vite's dev proxy).
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

/**
 * Returns full API URL for any endpoint path
 * @param {string} endpoint - e.g. '/api/public/appointments'
 * @returns {string}
 */
export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Resolves an image URL (handles relative '/uploads/...' from backend, external URLs, and fallback placeholder)
 * @param {string} path - image path or full URL
 * @param {string} fallback - fallback URL
 * @returns {string}
 */
export const getImageUrl = (path, fallback = '') => {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
