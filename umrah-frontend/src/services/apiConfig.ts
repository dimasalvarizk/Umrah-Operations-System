/**
 * Global API Configuration for Umrah Operations System Frontend
 * Automatically defaults to 'http://localhost:5000/api' on localhost during dev
 * and relative path '/api' in production (proxied by Nginx to API Gateway).
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : '/api');

/**
 * Helper to construct a URL object with query parameters safely,
 * supporting both relative '/api' paths and absolute URLs.
 */
export function createApiUrl(path: string): URL {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')
    ? API_BASE_URL
    : (typeof window !== 'undefined' ? `${window.location.origin}${API_BASE_URL}` : `http://localhost:5000${API_BASE_URL}`);

  return new URL(`${base}${cleanPath}`);
}
