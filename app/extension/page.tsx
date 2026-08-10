import type { Metadata } from "next";

import ExtensionLanding from "@/components/ExtensionLanding";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chrome Extension for Gemini Watermark Removal",
  description:
    "Unmark for Gemini — Chrome extension to queue prompts on Gemini or Google Flow, remove the sparkle watermark, and download clean images.",
  alternates: { canonical: "/extension" },
  openGraph: {
    title: "Unmark Chrome Extension · Gemini watermark remover",
    description:
      "Queue prompts on Gemini or Google Flow, remove the sparkle with Unmark, and download clean images.",
    url: "/extension",
    type: "website",
  },
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Unmark for Gemini",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Chrome",
  description:
    "Chrome extension that queues prompts for Gemini or Google Flow, removes the Gemini sparkle watermark with Unmark, and downloads cleaned images.",
  url: `${SITE_URL}/extension`,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function ExtensionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <ExtensionLanding />
    </>
  );
}
