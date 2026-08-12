import type { Metadata } from "next";

import GuideArticle from "@/components/GuideArticle";

export const metadata: Metadata = {
  title: "Free Gemini Watermark Remover Online",
  description:
    "Remove the Gemini sparkle watermark for free in your browser. No sign-in for Instant mode — upload a Gemini image and download a clean PNG or JPG.",
  alternates: { canonical: "/guides/free-gemini-watermark-remover" },
  openGraph: {
    title: "Free Gemini Watermark Remover · Unmark",
    description:
      "Free Instant Gemini watermark removal in your browser — no account required for images.",
    url: "/guides/free-gemini-watermark-remover",
    type: "article",
  },
};

const steps = [
  {
    title: "Open Unmark",
    body: "Go to www.unmark.ink — no sign-in needed for Instant mode on a single Gemini image.",
  },
  {
    title: "Choose Instant",
    body: "Select Instant on the upload card. Processing runs locally in your browser; your file is not uploaded to our servers.",
  },
  {
    title: "Drop your Gemini export",
    body: "Upload PNG, JPG, or WebP from Gemini, Imagen, or Nano Banana. Auto mode finds the corner sparkle.",
  },
  {
    title: "Download free",
    body: "Download the cleaned image at original resolution. Sign up only if you want Library, video, bulk, or the Chrome extension.",
  },
] as const;

const faqs = [
  {
    question: "Is Unmark really free?",
    answer:
      "Instant image cleanup is free with no account. Cloud features — video, Library, bulk, extension — use credits; new accounts get free signup credits.",
  },
  {
    question: "Do I need to install anything for the free remover?",
    answer:
      "No. Instant mode runs in a modern desktop browser with WebAssembly. For batch workflows on Gemini or Google Flow, install the free Chrome extension.",
  },
  {
    question: "Why would I pay for Cloud if Instant is free?",
    answer:
      "Cloud unlocks Veo and Gemini video watermark removal, Library history, email notify, bulk jobs, and the extension — workflows Instant cannot do in-browser alone.",
  },
] as const;

export default function FreeGeminiWatermarkRemoverGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/free-gemini-watermark-remover"
      title="Free Gemini watermark remover"
      intro={
        <>
          Looking for a{" "}
          <strong className="font-semibold text-foreground">
            free Gemini watermark remover
          </strong>
          ? Unmark Instant cleans one image in your browser with no sign-in.
          Drop a Gemini export, remove the sparkle logo, and download — then
          upgrade to Cloud when you need video, Library, or bulk cleanup.
        </>
      }
      steps={steps}
      faqs={faqs}
      howToName="How to remove a Gemini watermark for free"
      howToDescription="Use Unmark Instant to remove the Gemini sparkle from an image without an account."
      ctaHeading="Try the free Gemini watermark remover"
      ctaBody="Open the homepage, pick Instant, and upload — no account required for a single image."
    />
  );
}
