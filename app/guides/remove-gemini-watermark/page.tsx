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
    title: "How do I export the original still?",
    body: "Download the image Gemini, Imagen, or Nano Banana generated. Use the file Google gave you — PNG or a high-quality JPG — rather than a screenshot or a copy that already went through a social app.",
  },
  {
    title: "Where do I drop the Gemini image?",
    body: "Use the box on this page. Instant runs in your browser for a single still. You do not need an account to try one image.",
  },
  {
    title: "How does Auto find the sparkle?",
    body: "Unmark looks for the four-point Gemini mark, usually in a corner. If Auto misses an unusual placement, open the homepage and switch to Cloud so you can save the result in Library.",
  },
  {
    title: "How do I download the clean file?",
    body: "Download at the original resolution. Sign in only if you want Library history, video, bulk, or the Chrome extension.",
  },
] as const;

const faqs = [
  {
    question: "Do I need an account to remove a Gemini watermark from an image?",
    answer:
      "No. Instant cleans one Gemini, Imagen, or Nano Banana still in your browser with no sign-in. Drop a PNG, JPG, or WebP on this page, wait for the sparkle to disappear, and download. Create an account when you want more than a one-off still: Library keeps every Cloud result so you can come back later, video cleanup covers Veo and Google Flow clips, bulk handles a folder of exports, and the Chrome extension queues prompts on Gemini or Flow. New accounts include credits so you can try those Cloud extras without buying a pack first.",
  },
  {
    question: "What files does Instant accept?",
    answer:
      "Instant accepts PNG, JPG, and WebP stills from Gemini, Imagen, and Nano Banana. Square, 16:9, and 9:16 exports all work; Unmark keeps the pixel size you uploaded. Video files — MP4, MOV, WebM — are not Instant. Drop those on a video guide or the homepage so Cloud can clean every frame and save the clip to Library. If a still is a screenshot of a video player, treat it as an image here, but the sparkle will only leave that one frame, not the underlying clip.",
  },
  {
    question: "Will this remove every watermark?",
    answer:
      "Unmark is built for the visible Gemini sparkle in the corner of Google AI stills — not logos, captions, timestamps, stock-photo bugs, or marks from other generators. If the sparkle is tiled, tiny, or sitting on a busy pattern, Instant may leave a faint edge; try Cloud from the homepage so you can inspect the result in Library and run the file again. For a subject cutout after the sparkle is gone, use background removal under Tools. Do not expect Unmark to erase text overlays you added in Canva or CapCut.",
  },
  {
    question: "Google added a watermark-off toggle — do I still need this guide?",
    answer:
      "Yes if the still already has the sparkle, or if the Gemini/Flow setting is not on your account. Around mid-August 2026 Google started rolling out a toggle that can hide the visible mark on some new generations (region and plan restricted). It does not clean files you already exported. Instant on this page is still the path for a sparkle that is burned into a PNG, JPG, or WebP.",
  },
] as const;

export default function RemoveGeminiWatermarkGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/remove-gemini-watermark"
      title="How to remove a Gemini watermark"
      intro={
        <>
          <p>
            Gemini, Imagen, and Nano Banana burn a small four-point sparkle into
            many stills you download from Google. There is no layer to toggle
            off inside the export, and cropping the corner usually wrecks the
            composition. Unmark Instant is a{" "}
            <strong className="font-semibold text-foreground">
              Gemini watermark remover
            </strong>{" "}
            for that visible mark: drop one PNG, JPG, or WebP on this page, let
            Auto find the sparkle, and download a clean file at the original
            resolution. You do not need an account for a single still. The file
            stays in your browser — Instant never uploads it to Unmark Cloud.
          </p>
          <p>
            This guide is the how-to for stills. If you only wanted to know
            whether Instant is actually free, read the{" "}
            <a href="/guides/free-gemini-watermark-remover" className="text-brand hover:underline">
              free Gemini watermark remover
            </a>{" "}
            comparison instead of repeating these steps. For Veo or Google Flow
            clips, use the video guides. For a transparent cutout after the
            sparkle is gone, open background removal.
          </p>
        </>
      }
      steps={steps}
      sections={[
        {
          heading: "What does the Gemini sparkle look like?",
          body: (
            <>
              <p>
                On most Gemini, Imagen, and Nano Banana stills the mark is a
                small four-point sparkle, usually bottom-right, sometimes
                bottom-left or top-right. It sits in the pixels of the export —
                it is not a separate layer you can toggle off in Gemini.
              </p>
              <p>
                Unmark is trained on that mark. Cropping the corner off is a
                poor substitute: you lose composition, and a tiled or inset
                sparkle can remain. Instant targets the sparkle and leaves the
                rest of the frame.
              </p>
            </>
          ),
        },
        {
          heading: "When should I use Instant vs Cloud for a still?",
          body: (
            <>
              <p>
                Instant is the right default for one image you want right now.
                The file stays in the browser, there is no wait in Library, and
                you can download immediately. Use Instant on this page when you
                are cleaning a single portrait, product shot, or 9:16 story
                frame.
              </p>
              <p>
                Switch to Cloud when you need the file saved, you are cleaning
                more than one still, or Instant cannot lock onto an odd
                placement. Cloud results live in Library so you can download
                again later. The Chrome extension also uses Cloud: it queues
                prompts on Gemini or Google Flow and drops cleaned PNGs without
                a manual upload each time.
              </p>
            </>
          ),
        },
        {
          heading: "What if the sparkle is still visible?",
          body: (
            <>
              <p>
                Re-export from Gemini at the original size. Compressed copies
                from WhatsApp, Instagram, or email can smear the sparkle into
                the nearby pixels and make a clean removal harder. Avoid
                screenshots of the Gemini UI — chrome, cursors, and extra UI
                marks are not the sparkle Unmark looks for.
              </p>
              <p>
                If Auto still misses, open the homepage, sign in, and run the
                same file in Cloud so you can inspect the Library preview. For a
                subject on a new backdrop, clean the sparkle first, then use
                background removal on the cleaned PNG.
              </p>
            </>
          ),
        },
      ]}
      faqs={faqs}
      howToDescription="Remove the Google Gemini sparkle from a still using Unmark Instant — no account."
      ctaHeading="Ready to clean a Gemini image?"
      ctaBody="Use Instant on this page, or open the homepage drop zone. No account for a single still."
      ctaHref="#try"
      embedInstant
    />
  );
}
