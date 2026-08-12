import type { Metadata } from "next";

import GuideArticle from "@/components/GuideArticle";

export const metadata: Metadata = {
  title: "Remove Veo Watermark from Video",
  description:
    "Remove the Veo sparkle watermark from AI video online. Unmark strips the visible logo from every frame of MP4, MOV, and WebM exports.",
  alternates: { canonical: "/guides/remove-veo-watermark" },
  openGraph: {
    title: "Remove Veo Watermark · Unmark",
    description:
      "Strip the Veo sparkle logo from video exports with Unmark Cloud.",
    url: "/guides/remove-veo-watermark",
    type: "article",
  },
};

const steps = [
  {
    title: "Get the Veo source file",
    body: "Export or download the clip directly from Veo, Google Flow, or Gemini video — not a screen recording. MP4 is the most common format.",
  },
  {
    title: "Upload to Unmark Cloud",
    body: "Sign in at www.unmark.ink and upload the video. Veo watermark removal runs as a Cloud job because each frame must be processed.",
  },
  {
    title: "Auto-detect the sparkle",
    body: "Unmark finds the four-point Veo / Gemini logo in the corner (or tiled placement) and applies the same cleanup across the timeline.",
  },
  {
    title: "Download the clean Veo clip",
    body: "Collect the finished file from Library. Share to social platforms without the visible AI sparkle in every frame.",
  },
] as const;

const faqs = [
  {
    question: "What does the Veo watermark look like?",
    answer:
      "A small four-point sparkle logo, usually in a corner of each video frame — the same visible mark Google uses on Gemini and Veo outputs.",
  },
  {
    question: "Can Unmark remove Veo watermarks from long clips?",
    answer:
      "Yes, within Cloud upload limits. Long jobs stay in Library; you do not need to keep the browser tab open until encoding finishes.",
  },
  {
    question: "Does this remove SynthID?",
    answer:
      "Unmark removes the visible Veo and Gemini sparkle logo. SynthID is a separate invisible fingerprint embedded in pixels; this tool focuses on the logo you see on screen.",
  },
] as const;

export default function RemoveVeoWatermarkGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/remove-veo-watermark"
      title="Remove Veo watermark from video"
      intro={
        <>
          <strong className="font-semibold text-foreground">Veo</strong> adds
          the same visible sparkle stamp you see on Gemini images, but on every
          frame of generated video. Unmark is a{" "}
          <strong className="font-semibold text-foreground">
            Veo watermark remover
          </strong>{" "}
          that processes the full clip in Cloud, saves progress to Library, and
          delivers a clean download when encoding completes.
        </>
      }
      steps={steps}
      faqs={faqs}
      howToName="How to remove the Veo watermark from a video"
      howToDescription="Remove the visible Veo sparkle logo from AI video with Unmark."
      ctaHeading="Remove the Veo sparkle from your clip"
      ctaBody="Upload MP4, MOV, or WebM from Veo or Google Flow — Cloud handles every frame."
    />
  );
}
