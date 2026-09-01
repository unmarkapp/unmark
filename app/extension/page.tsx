import type { Metadata } from "next";

import ExtensionLanding from "@/components/ExtensionLanding";

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

export default function ExtensionPage() {
  return <ExtensionLanding />;
}
