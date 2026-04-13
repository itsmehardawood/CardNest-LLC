const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CRYPTO_BASE_URL = process.env.NEXT_PUBLIC_CRYPTO_API_BASE_URL || 'https://cryptolaravel.cardnest.io/api';

const withLeadingSlash = (endpoint = '') =>
  endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

const buildUrl = (baseUrl, endpoint) => `${baseUrl}${withLeadingSlash(endpoint)}`;

export async function apiFetch(endpoint, options = {}) {
  return fetch(buildUrl(BASE_URL, endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
}

export async function cryptoApiFetch(endpoint, options = {}) {
  return fetch(buildUrl(CRYPTO_BASE_URL, endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
}
