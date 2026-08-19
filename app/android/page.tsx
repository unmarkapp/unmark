import type { Metadata } from "next";

import AndroidEarlyAccess from "@/components/AndroidEarlyAccess";
import { ANDROID_EARLY_ACCESS_URL, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Android Early Access — Join Closed Testing",
  description:
    "Join Unmark closed testing on Google Play. Opt in as a tester so we can ship the Android app to production.",
  alternates: { canonical: "/android" },
  openGraph: {
    title: "Unmark Android early access",
    description:
      "Become a Play tester for Unmark. Twelve opted-in testers for 14 days unlocks production.",
    url: "/android",
    type: "website",
  },
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Unmark",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Android",
  description:
    "Unmark Android closed testing: clean Gemini watermarks, cut out backgrounds, and use Library on your phone.",
  url: `${SITE_URL}/android`,
  installUrl: ANDROID_EARLY_ACCESS_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function AndroidPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <AndroidEarlyAccess />
    </>
  );
}
