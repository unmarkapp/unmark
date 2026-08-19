import type { MetadataRoute } from "next";

import { SITEMAP_LASTMOD } from "@/lib/editorial";
import { GUIDE_LINKS, SITE_URL } from "@/lib/seo";

function entry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  const lastModified = SITEMAP_LASTMOD[path] ?? SITEMAP_LASTMOD["/"];
  return {
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const guideEntries: MetadataRoute.Sitemap = GUIDE_LINKS.filter((guide) =>
    guide.href.startsWith("/guides"),
  ).map((guide) =>
    entry(
      guide.href,
      "monthly",
      guide.href === "/guides/mcp-server" ? 0.85 : 0.9,
    ),
  );

  return [
    entry("/", "weekly", 1),
    entry("/product", "weekly", 0.95),
    entry("/about", "monthly", 0.7),
    entry("/tools", "weekly", 0.9),
    entry("/tools/background-removal", "weekly", 0.9),
    entry("/tools/create", "weekly", 0.7),
    entry("/guides", "monthly", 0.92),
    ...guideEntries,
    entry("/android", "weekly", 0.8),
    entry("/extension", "weekly", 0.85),
    entry("/skills", "weekly", 0.88),
    entry("/privacy", "yearly", 0.4),
    entry("/delete-account", "yearly", 0.4),
    entry("/terms", "yearly", 0.4),
    entry("/support", "monthly", 0.5),
    entry("/brand", "monthly", 0.3),
  ];
}
