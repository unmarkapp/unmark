import type { Metadata } from "next";

import HomePage from "@/components/HomePage";
import JsonLd from "@/components/JsonLd";
import { faqPageJsonLd } from "@/lib/jsonld";
import { FAQ_ITEMS, SITE_TAGLINE, SITE_TITLE_DEFAULT, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: SITE_TITLE_DEFAULT,
  },
  description: SITE_TAGLINE,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE_DEFAULT,
    description: SITE_TAGLINE,
    url: SITE_URL,
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(FAQ_ITEMS)} />
      <HomePage />
    </>
  );
}
