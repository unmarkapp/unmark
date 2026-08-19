import type { NextConfig } from "next";

const useClusterRewrites = process.env.USE_CLUSTER_REWRITES === "1";

const isProd = process.env.NODE_ENV === "production";

const ContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Next.js + analytics / Razorpay checkout need limited script hosts.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com https://script.supademo.com",
  "connect-src 'self' https://api.unmark.ink https://auth.unmark.ink https://billing.unmark.ink https://*.amazonaws.com https://checkout.razorpay.com https://api.razorpay.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com wss: https:",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://app.supademo.com https://script.supademo.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "Content-Security-Policy", value: ContentSecurityPolicy },
      ]
    : [{ key: "Content-Security-Policy-Report-Only", value: ContentSecurityPolicy }]),
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/developers",
        destination: "/guides/mcp-server",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    if (useClusterRewrites) {
      const api =
        process.env.API_UPSTREAM || "http://unmark-api.unmark.svc.cluster.local";
      const billing =
        process.env.BILLING_UPSTREAM ||
        "http://unmark-billing.unmark.svc.cluster.local";
      return [
        { source: "/backend/:path*", destination: `${api}/:path*` },
        { source: "/billing-api/:path*", destination: `${billing}/:path*` },
      ];
    }

    // Local dev defaults (/bg-remove proxied via app/bg-remove route handler)
    return [
      {
        source: "/backend/:path*",
        destination: "http://localhost:8000/:path*",
      },
      {
        source: "/billing-api/:path*",
        destination: "http://localhost:8090/:path*",
      },
    ];
  },
};

export default nextConfig;
