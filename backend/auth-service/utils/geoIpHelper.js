/**
 * Enterprise GeoIP & Client IP Extraction Utility
 * Designed for Hostinger VPS + Coolify (Dockerized with Traefik/Caddy Reverse Proxy)
 * - 0ms In-Memory Latency using `geoip-lite`
 * - Cloudflare Header Detection (Tier 0)
 * - Coolify Internal Docker Proxy Bypass
 * - 100% Offline & Free for Commercial Use (Zero Third-Party Network Requests)
 */

const geoip = require('geoip-lite');

// Map of common ISO 3166-1 alpha-2 country codes to full country names
const COUNTRY_NAMES = {
  ID: 'Indonesia',
  SA: 'Saudi Arabia',
  EG: 'Egypt',
  TR: 'Turkey',
  PK: 'Pakistan',
  IN: 'India',
  MY: 'Malaysia',
  AE: 'United Arab Emirates',
  US: 'United States',
  GB: 'United Kingdom',
  SG: 'Singapore',
  QA: 'Qatar',
  KW: 'Kuwait',
  OM: 'Oman',
  BH: 'Bahrain',
  JO: 'Jordan',
  LB: 'Lebanon',
  DZ: 'Algeria',
  MA: 'Morocco',
  TN: 'Tunisia',
  IQ: 'Iraq',
  SY: 'Syria',
  YE: 'Yemen',
  SD: 'Sudan',
  BD: 'Bangladesh',
  AU: 'Australia',
  DE: 'Germany',
  FR: 'France',
  NL: 'Netherlands',
  JP: 'Japan',
  KR: 'South Korea',
  CN: 'China',
  CA: 'Canada',
  TH: 'Thailand',
  PH: 'Philippines',
  VN: 'Vietnam',
  NZ: 'New Zealand',
};

/**
 * Clean, sanitize and extract the first non-private public IP from an IP string or comma chain.
 * Discards IPv6-mapped prefixes, port numbers, and Coolify/Docker proxy IPs (172.16.x.x, 10.x.x.x, 192.168.x.x).
 * @param {string} rawIp - Raw IP string or comma-separated IP chain
 * @returns {string} Clean single public client IP (e.g. "180.252.166.187")
 */
function sanitizeIp(rawIp) {
  if (!rawIp || typeof rawIp !== 'string') return '127.0.0.1';

  // Split multiple IPs if comma-separated
  const parts = rawIp
    .split(',')
    .map((p) => {
      let clean = p.trim();
      if (clean.startsWith('::ffff:')) clean = clean.replace('::ffff:', '');
      if (clean.includes('.') && clean.includes(':')) clean = clean.split(':')[0];
      return clean;
    })
    .filter(Boolean);

  if (parts.length === 0) return '127.0.0.1';

  // Find the first public IP (ignoring local/Docker private IPs)
  for (const p of parts) {
    if (!isPrivateOrLocalIp(p)) {
      return p;
    }
  }

  // If all are local/private, return the first one
  const first = parts[0];
  if (first === '::1' || first === 'localhost') return '127.0.0.1';
  return first || '127.0.0.1';
}

/**
 * Clean and extract the first client public IP from request headers or socket,
 * discarding internal Coolify/Docker proxy IPs (172.16.x.x, 10.x.x.x, 192.168.x.x).
 * @param {object} req - Express request object
 * @returns {string} Clean single client public IP address
 */
function extractClientIp(req) {
  if (!req) return '127.0.0.1';

  let rawIp = '';

  // 1. Check Cloudflare connecting IP
  if (req.headers && req.headers['cf-connecting-ip']) {
    rawIp = String(req.headers['cf-connecting-ip']);
  }
  // 2. True-Client-IP
  else if (req.headers && req.headers['true-client-ip']) {
    rawIp = String(req.headers['true-client-ip']);
  }
  // 3. Check X-Real-IP
  else if (req.headers && req.headers['x-real-ip']) {
    rawIp = String(req.headers['x-real-ip']);
  }
  // 4. Check X-Forwarded-For (Bypass Coolify/Traefik Docker proxies)
  else if (req.headers && req.headers['x-forwarded-for']) {
    rawIp = String(req.headers['x-forwarded-for']);
  }
  // 5. Fallback to Express req.ip or socket remote address
  else if (req.ip) {
    rawIp = String(req.ip);
  } else if (req.socket && req.socket.remoteAddress) {
    rawIp = String(req.socket.remoteAddress);
  } else if (req.connection && req.connection.remoteAddress) {
    rawIp = String(req.connection.remoteAddress);
  }

  return sanitizeIp(rawIp);
}

/**
 * Check if an IP is a local or private Docker/Coolify network address
 * @param {string} ip
 * @returns {boolean}
 */
function isPrivateOrLocalIp(ip) {
  if (!ip) return true;
  const clean = String(ip).trim().replace(/^::ffff:/, '');

  // Localhost
  if (clean === '127.0.0.1' || clean === '::1' || clean === 'localhost' || clean.startsWith('127.')) {
    return true;
  }

  // Docker / Coolify Private Subnets: 10.0.0.0/8, 192.168.0.0/16, 169.254.0.0/16
  if (clean.startsWith('10.') || clean.startsWith('192.168.') || clean.startsWith('169.254.')) {
    return true;
  }

  // Docker Bridge Default Subnet: 172.16.0.0 - 172.31.255.255
  const parts = clean.split('.').map(Number);
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true;
  }

  return false;
}

/**
 * Resolve client IP to City & Country using in-memory geoip-lite + Cloudflare headers
 * 0ms latency, zero third-party HTTP requests, completely offline.
 * @param {string|object} ip - Client IP address or raw string
 * @param {object} [req] - Optional Express request object to read Cloudflare headers
 * @returns {{ ip: string, city: string, country: string, location: string }}
 */
function getGeolocation(ip, req = null) {
  const cleanIp = sanitizeIp(typeof ip === 'string' ? ip : (req ? extractClientIp(req) : '127.0.0.1'));

  // Tier 0: Cloudflare Headers (if running behind Cloudflare)
  if (req && req.headers) {
    const cfCountryCode = req.headers['cf-ipcountry'];
    const cfCity = req.headers['cf-ipcity'];
    if (cfCountryCode && cfCountryCode !== 'XX' && cfCountryCode !== 'T1') {
      const fullCountry = COUNTRY_NAMES[cfCountryCode] || cfCountryCode;
      const city = cfCity ? decodeURIComponent(cfCity) : (cleanIp === '127.0.0.1' ? 'Local' : 'Unknown');
      const location = city !== 'Unknown' && city !== 'Local' ? `${city}, ${fullCountry}` : fullCountry;
      return {
        ip: cleanIp,
        city,
        country: fullCountry,
        location,
      };
    }
  }

  // Local / Docker Fallback
  if (isPrivateOrLocalIp(cleanIp)) {
    return {
      ip: cleanIp,
      city: 'Local',
      country: 'Unknown',
      location: 'Localhost',
    };
  }

  // Tier 1: Offline In-Memory GeoIP Lookup using geoip-lite (0ms)
  try {
    const geo = geoip.lookup(cleanIp);
    if (geo) {
      const city = geo.city ? geo.city.trim() : 'Unknown';
      const countryCode = geo.country || 'Unknown';
      const country = COUNTRY_NAMES[countryCode] || countryCode;
      const location = city !== 'Unknown' && country !== 'Unknown'
        ? `${city}, ${country}`
        : (city !== 'Unknown' ? city : country);

      return {
        ip: cleanIp,
        city,
        country,
        location,
      };
    }
  } catch (err) {
    console.warn(`[GeoIP] Error resolving IP ${cleanIp}:`, err.message);
  }

  // Graceful Fallback
  return {
    ip: cleanIp,
    city: 'Unknown',
    country: 'Unknown',
    location: 'Unknown',
  };
}

module.exports = {
  sanitizeIp,
  extractClientIp,
  isPrivateOrLocalIp,
  getGeolocation,
  COUNTRY_NAMES,
};
