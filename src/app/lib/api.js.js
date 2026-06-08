const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CRYPTO_BASE_URL = process.env.NEXT_PUBLIC_CRYPTO_API_BASE_URL || 'https://cryptolaravel.cardnest.io/api';
const KYC_BASE_URL = process.env.NEXT_PUBLIC_KYC_API_BASE_URL || BASE_URL;

const withLeadingSlash = (endpoint = '') =>
  endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

const buildUrl = (baseUrl, endpoint) => `${baseUrl}${withLeadingSlash(endpoint)}`;

/**
 * Reads the JWT token from localStorage.
 * Returns the token string or null if not found / not in a browser.
 */
function getAuthToken() {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('token') || null;
  } catch {
    return null;
  }
}

/**
 * Merges caller-supplied headers with a Content-Type default and,
 * when a JWT token is present in localStorage, an Authorization header.
 */
function buildHeaders(callerHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...callerHeaders,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function apiFetch(endpoint, options = {}) {
  return fetch(buildUrl(BASE_URL, endpoint), {
    ...options,
    headers: buildHeaders(options.headers),
  });
}

export async function cryptoApiFetch(endpoint, options = {}) {
  return fetch(buildUrl(CRYPTO_BASE_URL, endpoint), {
    ...options,
    headers: buildHeaders(options.headers),
  });
}

export async function kycApiFetch(endpoint, options = {}) {
  return fetch(buildUrl(KYC_BASE_URL, endpoint), {
    ...options,
    headers: buildHeaders(options.headers),
  });
}

export function resolveApiFetchContext() {
  if (typeof window === 'undefined') return apiFetch;

  const host = window.location.hostname || '';
  const path = window.location.pathname || '';

  if (host.includes('cryptoadmin') || path.includes('/crypto-dashboard') || path.includes('crypto-dashboard')) {
    return cryptoApiFetch;
  }

  if (host.includes('kycadmin') || path.includes('/kyc-dashboard') || path.includes('kyc-dashboard')) {
    return kycApiFetch;
  }

  return apiFetch;
}
