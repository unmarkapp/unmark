import type { MetadataRoute } from "next";

import { GUIDE_LINKS, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const guideEntries: MetadataRoute.Sitemap = GUIDE_LINKS.map((guide) => ({
    url: `${SITE_URL}${guide.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: guide.href === "/guides/mcp-server" ? 0.85 : 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.92,
    },
    ...guideEntries,
    {
      url: `${SITE_URL}/extension`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/brand`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
