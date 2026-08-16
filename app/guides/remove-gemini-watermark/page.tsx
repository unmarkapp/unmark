import type { Metadata } from "next";

import GuideArticle from "@/components/GuideArticle";

export const metadata: Metadata = {
  title: "How to Remove a Gemini Watermark from an Image",
  description:
    "Remove the Gemini sparkle from an image in your browser. Instant is free — no account. Drop a Gemini export and download a clean PNG or JPG.",
  alternates: { canonical: "/guides/remove-gemini-watermark" },
  openGraph: {
    title: "How to Remove a Gemini Watermark · Unmark",
    description:
      "Free Instant cleanup for Gemini sparkle stills — no sign-in for a single image.",
    url: "/guides/remove-gemini-watermark",
    type: "article",
  },
};

const steps = [
  {
    title: "Export from Gemini",
    body: "Download the image Gemini generated. PNG or high-quality JPG works best.",
  },
  {
    title: "Drop it on Instant",
    body: "Use the box on this page, or open unmark.ink and stay on Instant. No Google sign-in for a single still.",
  },
  {
    title: "Let Auto find the sparkle",
    body: "Unmark looks for the corner Gemini sparkle. Switch to Cloud later if you want the file saved in Library.",
  },
  {
    title: "Download the clean file",
    body: "Download at original resolution. Sign in only if you need video, bulk, or the Chrome extension.",
  },
] as const;

const faqs = [
  {
    question: "Do I need an account to remove a Gemini watermark from an image?",
    answer:
      "No. Instant cleans one still in your browser with no sign-in. Create an account when you want Library, video, bulk, or the extension.",
  },
  {
    question: "What files does Instant accept?",
    answer:
      "PNG, JPG, and WebP exports from Gemini, Imagen, and Nano Banana. Video clips need Cloud on the homepage.",
  },
  {
    question: "Will this remove every watermark?",
    answer:
      "Unmark is built for the visible Gemini sparkle in the corner — not logos, captions, or marks from other tools.",
  },
] as const;

export default function RemoveGeminiWatermarkGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/remove-gemini-watermark"
      title="How to remove a Gemini watermark"
      intro={
        <>
          Gemini adds a small sparkle stamp to many AI images. Unmark is a{" "}
          <strong className="font-semibold text-foreground">
            Gemini watermark remover
          </strong>{" "}
          for that corner mark. Instant is free in the browser — try it below.
        </>
      }
      steps={steps}
      faqs={faqs}
      howToName="How to remove a Gemini watermark from an image"
      howToDescription="Remove the Google Gemini sparkle from a still using Unmark Instant — no account."
      ctaHeading="Ready to clean a Gemini image?"
      ctaBody="Use Instant on this page, or open the homepage drop zone. No account for a single still."
      embedInstant
    />
  );
}
