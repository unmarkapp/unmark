import { SITE_NAME, SITE_URL } from "@/lib/seo";

/** Named human author for guide bylines and Article schema. */
export const EDITORIAL_AUTHOR = {
  "@type": "Person" as const,
  name: "Sumit Kumar",
  jobTitle: "Founder",
  url: `${SITE_URL}/about`,
  description:
    "Founder of Unmark. Writes the product guides for Gemini watermark removal, Veo and Google Flow video cleanup, and background cutouts.",
} as const;

/** First public ship of the `/guides` cluster. */
export const GUIDES_PUBLISHED = "2026-08-12";

/** Last editorial review of the expanded guide copy. */
export const GUIDES_REVIEWED = "2026-08-19";

export const ARTICLE_IMAGE = `${SITE_URL}/opengraph-image`;

/** Real lastmod dates for sitemap.xml (ISO dates, not request-time). */
export const SITEMAP_LASTMOD: Record<string, string> = {
  "/": "2026-08-19",
  "/product": "2026-08-19",
  "/about": "2026-08-19",
  "/tools": "2026-08-19",
  "/tools/create": "2026-08-11",
  "/guides": "2026-08-19",
  "/guides/remove-gemini-watermark": "2026-08-19",
  "/guides/remove-gemini-video-watermark": "2026-08-19",
  "/guides/google-flow-watermark-remover": "2026-08-19",
  "/guides/remove-veo-watermark": "2026-08-19",
  "/guides/free-gemini-watermark-remover": "2026-08-19",
  "/guides/mcp-server": "2026-08-16",
  "/android": "2026-08-16",
  "/extension": "2026-08-16",
  "/skills": "2026-08-16",
  "/privacy": "2026-08-16",
  "/delete-account": "2026-08-13",
  "/terms": "2026-08-13",
  "/support": "2026-08-14",
  "/brand": "2026-08-12",
};

export function formatReviewDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${EDITORIAL_AUTHOR.url}#person`,
    name: EDITORIAL_AUTHOR.name,
    jobTitle: EDITORIAL_AUTHOR.jobTitle,
    url: EDITORIAL_AUTHOR.url,
    description: EDITORIAL_AUTHOR.description,
    worksFor: {
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
  };
}
