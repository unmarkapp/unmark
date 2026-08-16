import { SITE_NAME, SITE_URL } from "@/lib/seo";

/** Named reviewer for guide bylines and Article schema. */
export const EDITORIAL_AUTHOR = {
  name: `${SITE_NAME} editorial`,
  url: `${SITE_URL}/product`,
} as const;

/** First public ship of the `/guides` cluster. */
export const GUIDES_PUBLISHED = "2026-08-12";

/** Last editorial review of the expanded guide copy. */
export const GUIDES_REVIEWED = "2026-08-16";

export const ARTICLE_IMAGE = `${SITE_URL}/opengraph-image`;

export function formatReviewDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
