import type { Metadata } from "next";

import PdfWatermarkTool from "@/components/PdfWatermarkTool";
import {
  ARTICLE_IMAGE,
  EDITORIAL_AUTHOR,
  GUIDES_REVIEWED,
} from "@/lib/editorial";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "PDF Watermark Remover — Overlay Stamps & Marks",
  description:
    "Remove overlay stamps, repeating marks, and watermark annotations from PDFs you own. Download a cleaned PDF to Library.",
  alternates: { canonical: "/tools/pdf-watermark" },
  openGraph: {
    title: "PDF watermark remover · Unmark",
    description:
      "Remove overlay stamps and repeating marks from PDFs you own, then download a clean file.",
    url: "/tools/pdf-watermark",
    type: "website",
  },
};

const PDF_PUBLISHED = "2026-08-18";
const pageUrl = `${SITE_URL}/tools/pdf-watermark`;

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
        name: "PDF watermark remover",
        item: pageUrl,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Unmark PDF watermark remover",
    description:
      "Remove overlay stamps, repeating marks, and watermark annotations from PDFs you own.",
    url: pageUrl,
    image: ARTICLE_IMAGE,
    datePublished: PDF_PUBLISHED,
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

export default function PdfWatermarkPage() {
  return (
    <>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <PdfWatermarkTool />
    </>
  );
}
