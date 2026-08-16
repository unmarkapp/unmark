import type { Metadata } from "next";

import GuideArticle from "@/components/GuideArticle";

export const metadata: Metadata = {
  title: "Gemini Video Watermark Remover",
  description:
    "Remove the Gemini and Veo sparkle watermark from video online. Unmark Cloud cleans every frame, saves to Library, and keeps jobs running if you refresh.",
  alternates: { canonical: "/guides/remove-gemini-video-watermark" },
  openGraph: {
    title: "Gemini Video Watermark Remover · Unmark",
    description:
      "Remove the Gemini sparkle from Veo and Gemini video exports frame by frame.",
    url: "/guides/remove-gemini-video-watermark",
    type: "article",
  },
};

const steps = [
  {
    title: "Export the original video",
    body: "Download the MP4, MOV, or WebM from Gemini, Veo, or Google Flow. Start from the highest-quality export — re-compressed copies are harder to clean.",
  },
  {
    title: "Sign in to Unmark Cloud",
    body: "Open www.unmark.ink and sign in. Video cleanup uses Cloud credits; new accounts include free credits to try it.",
  },
  {
    title: "Upload and start the job",
    body: "Drop your clip on the homepage. Unmark finds the corner sparkle and cleans every frame — not just a screenshot.",
  },
  {
    title: "Download from Library",
    body: "When processing finishes, open Library for the clean MP4. You can close the tab while the job runs and get notified when the video is ready.",
  },
] as const;

const faqs = [
  {
    question: "Is there a free Gemini video watermark remover?",
    answer:
      "Instant is free for a single image in your browser. Video uses Cloud credits. New accounts include free credits to try a clip.",
  },
  {
    question: "Which video formats are supported?",
    answer:
      "Common Gemini and Veo exports: MP4, MOV, WebM, and M4V. Upload the file Google gave you without re-encoding when possible.",
  },
  {
    question: "Will video quality drop after removing the watermark?",
    answer:
      "Unmark targets the sparkle region on each frame and aims to preserve resolution, frame rate, and audio from the source export.",
  },
  {
    question: "What if I refresh the page during a long video job?",
    answer:
      "Cloud jobs stay in your Library. Unlike browser-only tools, Unmark does not lose progress when you refresh or close the tab.",
  },
] as const;

export default function RemoveGeminiVideoWatermarkGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/remove-gemini-video-watermark"
      title="Gemini video watermark remover"
      intro={
        <>
          Google stamps a visible sparkle logo on{" "}
          <strong className="font-semibold text-foreground">Veo</strong> and{" "}
          <strong className="font-semibold text-foreground">Gemini</strong>{" "}
          video frames. Unmark Cloud is a{" "}
          <strong className="font-semibold text-foreground">
            Gemini video watermark remover
          </strong>{" "}
          that tracks and removes that mark across the full clip, then saves the
          result to your Library.
        </>
      }
      steps={steps}
      faqs={faqs}
      howToName="How to remove the Gemini watermark from a video"
      howToDescription="Remove the visible Gemini and Veo sparkle from video using Unmark Cloud."
      ctaHeading="Ready to clean a Gemini or Veo video?"
      ctaBody="Upload a clip on the homepage with Cloud mode — jobs stay in Library even if you navigate away."
    />
  );
}
