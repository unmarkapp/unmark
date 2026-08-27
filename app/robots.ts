import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/watch-ad-frame"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/" as const,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
