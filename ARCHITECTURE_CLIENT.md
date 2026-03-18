# CardNest Frontend Architecture (Client-Facing)

Last updated: March 18, 2026

## 1) Current Frontend Implementation

### 1.1 Platform and Scope

The current frontend is a web application platform built with Next.js and React. It serves:
- Business and enterprise users
- Super admin users
- KYC workflows
- Crypto risk and monitoring workflows

Subdomain routing is implemented to map product experiences:
- crypto.cardnest.io -> crypto dashboard routes
- kyc.cardnest.io -> kyc dashboard routes

### 1.2 Core Technologies in Use (Current)

Implemented now:
- Next.js 15 + React 19
- Tailwind CSS 4
- REST-based API integration (internal Next API routes + external backend APIs)
- Firebase phone OTP authentication with reCAPTCHA
- Client-side role-based navigation and access checks

Not currently implemented in this repository:
- GraphQL
- WebSockets real-time channel
- OAuth2 / OpenID Connect login flow
- Redux state management
- Mobile apps (Flutter/React Native) in this codebase

### 1.3 Frontend Modules Available Today

Business / Merchant-facing dashboard modules include:
- Home and profile management
- Card security scan related views
- KYC-related access points
- Subscriptions and billing logs
- Documents and developer resources

KYC module includes:
- KYC home/status
- Face verification results
- Document verification results

Crypto module includes:
- Crypto validation
- Address screening
- Transaction monitoring
- Risk-related indicators

Developer portal (frontend module) includes:
- Documentation and guides listing
- Document download capability
- Developer resources section

### 1.4 Security Posture (Frontend-Visible)

Implemented in frontend today:
- OTP verification using Firebase Auth
- Invisible reCAPTCHA challenge flow
- Role checks and guarded navigation flows

Partially or not frontend-verified in this repository:
- Content Security Policy (CSP): no explicit CSP policy found in visible frontend config
- Secure cookie session strategy: not primary flow; user session data is handled in localStorage in current implementation
- TLS 1.3: infrastructure-level control, not verifiable from frontend source alone
- Rate limiting: documented as requirement, not visibly enforced in this frontend repository
- Dedicated device fingerprinting module: not identified as an explicit frontend feature

## 2) Planned Frontend Enhancements

To align with the target enterprise architecture, the following are planned/recommended:

### 2.1 API and Data Layer
- Introduce GraphQL for typed aggregate queries where beneficial
- Keep REST for transactional and service-specific operations
- Add real-time updates using WebSockets for fraud and risk events

### 2.2 Authentication and Session Hardening
- Move toward OAuth2 / OpenID Connect for standards-based auth federation
- Replace localStorage-dependent session data with secure, httpOnly cookie-backed sessions

### 2.3 State Management and Frontend Scale
- Introduce Redux Toolkit (or equivalent) for cross-module shared state if complexity continues to increase
- Standardize API client, caching, and error boundaries

### 2.4 Security Controls
- Enforce strict CSP headers
- Add bot protection and request throttling/rate limits at edge and API layers
- Add formal device fingerprinting strategy where legally and regionally compliant

## 3) Frontend CDN Delivery Architecture

Current delivery pattern:

User Browser
  |
  v
Edge CDN Nodes
  |
  v
Cached Frontend Assets (static chunks, media)
  |
  v
Next.js Application Servers / API Routes
  |
  v
External Backend APIs

## 4) Technology Status Matrix

- React + Next.js web applications: Current
- Flutter or React Native mobile apps: Planned / out of this repository scope
- GraphQL + REST APIs: REST current, GraphQL planned
- WebSockets for real-time updates: Planned
- OAuth2 / OpenID authentication: Planned
- Redux for state management: Planned
- CSP: Planned/hardening gap
- Secure cookies: Planned/hardening gap
- TLS 1.3 encryption: Infrastructure responsibility (deployment dependent)
- Bot protection: Planned/hardening gap
- Rate limiting: Planned/hardening gap
- Device fingerprinting: Planned

## 5) Reference Files Reviewed

- package.json
- src/middleware.js
- src/app/dashboard/page.js
- src/app/kyc-dashboard/page.js
- src/app/crypto-dashboard/page.js
- src/app/components/Dashboard-Screens/Developer.js
- src/app/admin-login/page.js
- src/app/lib/firebase.js
- src/app/lib/api.js.js
- src/app/api/card-scans/route.js
- vercel.json
- KYC_API_REQUIREMENTS.md
