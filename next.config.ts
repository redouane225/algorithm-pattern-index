import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP from docs/03-security.md. 'unsafe-inline' for scripts is a deliberate V1
// trade-off: Next.js static pages inject small inline bootstrap scripts, and
// nonces would force dynamic rendering. See DECISIONS.md.
// 'unsafe-eval' is only added in development (React dev tooling needs it).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Skipped in development: it would force http://localhost sub-requests to https.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the project root so a lockfile in a parent folder is never picked up.
  turbopack: { root: import.meta.dirname },
  experimental: {
    // The only root layout lives in app/[lang], so there is no layout to wrap a
    // 404 for URLs outside any language (e.g. /de). global-not-found covers that.
    globalNotFound: true,
  },
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
