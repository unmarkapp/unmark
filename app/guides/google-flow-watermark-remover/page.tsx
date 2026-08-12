import type { Metadata } from "next";

import GuideArticle from "@/components/GuideArticle";

export const metadata: Metadata = {
  title: "Google Flow Watermark Remover for Veo Video",
  description:
    "Remove the visible Gemini and Veo watermark from Google Flow video exports. Upload MP4, MOV, or WebM and download a clean clip with Unmark.",
  alternates: { canonical: "/guides/google-flow-watermark-remover" },
  openGraph: {
    title: "Google Flow Watermark Remover · Unmark",
    description:
      "Clean the visible watermark from Google Flow and Veo video exports.",
    url: "/guides/google-flow-watermark-remover",
    type: "article",
  },
};

const steps = [
  {
    title: "Export from Google Flow",
    body: "Download the original Veo clip from Google Flow — MP4, MOV, or WebM. Avoid cropping or re-encoding before cleanup.",
  },
  {
    title: "Open Unmark",
    body: "Go to www.unmark.ink and sign in. Google Flow watermark removal for video uses Unmark Cloud so jobs persist in Library.",
  },
  {
    title: "Upload the Flow export",
    body: "Drop the file on the homepage. Unmark locates the Gemini or Veo sparkle and removes it consistently across frames.",
  },
  {
    title: "Review and download",
    body: "Open Library when the job completes. Preview the cleaned video, then download the file for TikTok, Reels, Shorts, or client delivery.",
  },
] as const;

const faqs = [
  {
    question: "Does Unmark work on Google Flow and Veo?",
    answer:
      "Yes. Unmark removes the visible sparkle logo from Google Flow, Veo, Gemini, Imagen, and Nano Banana media. Video uses Cloud; stills can use free Instant mode in the browser.",
  },
  {
    question: "Can I batch-clean Flow images with Unmark?",
    answer:
      "Yes. Use Cloud bulk mode on the homepage or the Unmark Chrome extension to queue prompts on Gemini or Google Flow and download cleaned PNGs automatically.",
  },
  {
    question: "Do I need a separate tool for Flow vs Gemini?",
    answer:
      "No. Unmark handles the same visible sparkle mark across Google AI exports — one workflow for Flow video, Gemini images, and Veo clips.",
  },
] as const;

export default function GoogleFlowWatermarkRemoverGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/google-flow-watermark-remover"
      title="Google Flow watermark remover"
      intro={
        <>
          <strong className="font-semibold text-foreground">Google Flow</strong>{" "}
          is Google&apos;s filmmaking workspace for Veo, Imagen, and Gemini clips.
          Exported Flow videos can show a visible Gemini or Veo mark in the
          corner. This{" "}
          <strong className="font-semibold text-foreground">
            Google Flow watermark remover
          </strong>{" "}
          cleans that logo frame by frame without blurring the whole corner of
          your shot.
        </>
      }
      steps={steps}
      faqs={faqs}
      howToName="How to remove the Google Flow watermark from a video"
      howToDescription="Remove the visible Gemini or Veo mark from Google Flow video exports with Unmark."
      ctaHeading="Clean a Google Flow export"
      ctaBody="Upload your Flow or Veo clip — Cloud keeps the job in Library until you download."
    />
  );
}
