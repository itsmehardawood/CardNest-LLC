import { NextResponse } from 'next/server';

/**
 * Middleware for subdomain-based routing.
 * 
 * - crypto.cardnest.io  →  internally rewrites to /crypto-dashboard/*
 * - kyc.cardnest.io     →  internally rewrites to /kyc-dashboard/*
 * - cardnest.io (main)  →  unchanged, serves existing routes
 * 
 * For local development add to your hosts file
 * (C:\Windows\System32\drivers\etc\hosts):
 *     127.0.0.1  cardnest.local
 *     127.0.0.1  crypto.cardnest.local
 *     127.0.0.1  kyc.cardnest.local
 *   Then access:
 *     http://crypto.cardnest.local:3000
 *     http://kyc.cardnest.local:3000
 */

// Root domains to strip when extracting subdomains
const ROOT_DOMAINS = ['cardnest.io', 'cardnest.local', 'localhost'];

function getSubdomain(hostname) {
  // Remove port if present
  const host = hostname.split(':')[0];

  for (const root of ROOT_DOMAINS) {
    if (host.endsWith(root) && host !== root) {
      // e.g. "crypto.cardnest.io" → "crypto"
      const sub = host.slice(0, -(root.length + 1)); // +1 for the dot
      return sub || null;
    }
  }

  return null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const subdomain = getSubdomain(hostname);

  const rewriteTo = (targetPath) => {
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    return NextResponse.rewrite(url);
  };

  // ─── crypto.cardnest.io subdomain ───
  if (subdomain === 'crypto') {
    // If user hits the root of the subdomain, send to crypto dashboard
    if (pathname === '/' || pathname === '') {
      return rewriteTo('/crypto-dashboard');
    }

    // If user hits /dashboard on crypto subdomain, rewrite to crypto-dashboard
    if (pathname === '/dashboard') {
      return rewriteTo('/crypto-dashboard');
    }

    // Allow /login, /signup, /api, /_next, /images, /videos, etc. to pass through as-is
    // so auth pages and static assets work on the subdomain too
  }

  // ─── kyc.cardnest.io subdomain ───
  if (subdomain === 'kyc') {
    if (pathname === '/' || pathname === '') {
      return rewriteTo('/kyc-dashboard');
    }

    if (pathname === '/dashboard') {
      return rewriteTo('/kyc-dashboard');
    }
  }

  // ─── admin subdomains ───
  // kycadmin.cardnest.io and cryptoadmin.cardnest.io both route to /admin.
  if (subdomain === 'kycadmin' || subdomain === 'cryptoadmin') {
    if (pathname === '/' || pathname === '' || pathname === '/dashboard') {
      return rewriteTo('/admin');
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static files and Next internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|videos).*)',
  ],
};
