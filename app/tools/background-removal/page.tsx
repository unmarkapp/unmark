import type { Metadata } from "next";

import BackgroundRemovalTool from "@/components/BackgroundRemovalTool";
import {
  ARTICLE_IMAGE,
  EDITORIAL_AUTHOR,
  GUIDES_REVIEWED,
} from "@/lib/editorial";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Background Removal — Transparent PNG Cutouts",
  description:
    "Remove image backgrounds automatically. Upload a photo and download a transparent PNG cutout — portraits, products, and AI stills.",
  alternates: { canonical: "/tools/background-removal" },
  openGraph: {
    title: "Background removal · Unmark",
    description:
      "Cut out a subject and download a transparent PNG — portraits, products, and Gemini stills.",
    url: "/tools/background-removal",
    type: "website",
  },
};

const BG_PUBLISHED = "2026-08-11";
const pageUrl = `${SITE_URL}/tools/background-removal`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
      {
        "@type": "ListItem",
        position: 3,
        name: "Background removal",
        item: pageUrl,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Unmark background removal — transparent PNG cutouts",
    description:
      "Cut out a subject and download a transparent PNG for portraits, products, and AI stills.",
    url: pageUrl,
    image: ARTICLE_IMAGE,
    datePublished: BG_PUBLISHED,
    dateModified: GUIDES_REVIEWED,
    author: {
      "@type": "Organization",
      name: EDITORIAL_AUTHOR.name,
      url: EDITORIAL_AUTHOR.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  },
];

export default function BackgroundRemovalPage() {
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <BackgroundRemovalTool />
    </>
  );
}
