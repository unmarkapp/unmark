import type { NextConfig } from "next";

const useClusterRewrites = process.env.USE_CLUSTER_REWRITES === "1";

const nextConfig: NextConfig = {
  output: "standalone",
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
