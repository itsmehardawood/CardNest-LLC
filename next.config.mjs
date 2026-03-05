/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow crypto.cardnest.io subdomain to be served from the same app
  async rewrites() {
    return {
      // These rewrites are checked after pages/public files and before dynamic routes
      beforeFiles: [],
      afterFiles: [],
      // Fallback rewrites run after both pages and dynamic routes are checked
      fallback: [],
    };
  },
};

export default nextConfig;
