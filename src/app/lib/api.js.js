const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CRYPTO_BASE_URL = process.env.NEXT_PUBLIC_CRYPTO_API_BASE_URL || 'https://cryptolaravel.cardnest.io/api';
const KYC_BASE_URL = process.env.NEXT_PUBLIC_KYC_API_BASE_URL || BASE_URL;

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

export async function kycApiFetch(endpoint, options = {}) {
  return fetch(buildUrl(KYC_BASE_URL, endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
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
