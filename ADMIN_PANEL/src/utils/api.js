import axios from 'axios';

/**
 * Spinfyot Admin Panel Production API Configuration
 * Supports VITE_API_URL for Vercel deployment with fallback for local dev proxy.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL || '',
});

export const getImageUrl = (path, fallback = '') => {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export default api;
