import { NextResponse } from 'next/server';


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

  // ─── allowed subdomains ───
  // kycadmin.cardnest.io routes to kyc dashboard and
  // cryptoadmin.cardnest.io routes to crypto dashboard.
  if (subdomain === 'kycadmin') {
    if (pathname === '/' || pathname === '' || pathname === '/dashboard') {
      return rewriteTo('/kyc-dashboard');
    }
  }

  if (subdomain === 'cryptoadmin') {
    if (pathname === '/' || pathname === '' || pathname === '/dashboard') {
      return rewriteTo('/crypto-dashboard');
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
