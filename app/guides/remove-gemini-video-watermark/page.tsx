import type { Metadata } from "next";

import GuideArticle from "@/components/GuideArticle";

export const metadata: Metadata = {
  title: "Gemini Video Watermark Remover",
  description:
    "Remove the Gemini sparkle from Veo and Gemini video online. Drop an MP4 on this page — Unmark cleans every frame and saves the clip to Library.",
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
    title: "How do I export the original clip?",
    body: "Download the MP4, MOV, or WebM from Gemini, Veo, or Google Flow. Start from the highest-quality export — a re-compressed copy from a chat app is harder to clean.",
  },
  {
    title: "Where do I drop the Gemini video?",
    body: "Use the box below. Unmark opens the cleaner with your file. Sign in only if Cloud asks — new accounts include credits to try a short video.",
  },
  {
    title: "How does Unmark clean every frame?",
    body: "The sparkle is on each frame, not one overlay. Unmark tracks that mark through the clip so the logo does not flicker back mid-shot.",
  },
  {
    title: "Where do I download the clean file?",
    body: "When the clip is ready, open Library for the clean file. You can leave the tab — Unmark keeps the result until you download.",
  },
] as const;

const faqs = [
  {
    question: "Is there a free Gemini video watermark remover?",
    answer:
      "Instant is free for a single still in your browser. Video uses Cloud credits because every frame needs the same cleanup. New accounts include free credits so you can try a short Gemini or Veo clip before you buy a pack. There is no separate “free video” mode that silently caps resolution or stamps Unmark on the MP4. If you only needed one image, stay on Instant. If you have an MP4, drop it here, use the starter credits, and download from Library when the clip is ready.",
  },
  {
    question: "Which video formats are supported?",
    answer:
      "Upload the file Google gave you: MP4 is the usual Gemini and Veo export, MOV and WebM are also accepted, and M4V works when that is what Flow saved. Keep audio on the source file — Unmark aims to preserve it. Screen recordings of a player, TikTok re-downloads, and files already run through a heavy compressor often smear the sparkle into neighbouring pixels. Re-export from Gemini, Veo, or Flow when you can. Limits on the homepage apply: short clips, up to 1080p, within the listed file size.",
  },
  {
    question: "Will video quality drop after removing the watermark?",
    answer:
      "Unmark targets the sparkle region on each frame and aims to keep the resolution, frame rate, and audio of the source export. You should not see a soft full-frame filter or a black box over the corner. A very small or fast-moving sparkle on a busy background can leave a faint patch; if that happens, re-run from the original export rather than from the first cleaned copy. Always start from the highest-quality file Google produced, not a social re-download.",
  },
  {
    question: "What if I close the tab during a long clip?",
    answer:
      "Cloud keeps the job in Library. You do not need to babysit the browser. Turn on email notify in account settings if you want a ping when the file is ready. Refreshing the page does not restart the clip. When you come back, open Library, preview, and download. That is the difference from in-browser-only video tools that lose the file if you navigate away.",
  },
] as const;

export default function RemoveGeminiVideoWatermarkGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/remove-gemini-video-watermark"
      title="Gemini video watermark remover"
      intro={
        <>
          <p>
            Google stamps a visible sparkle on{" "}
            <strong className="font-semibold text-foreground">Veo</strong> and{" "}
            <strong className="font-semibold text-foreground">Gemini</strong>{" "}
            video frames. Unmark Cloud is a{" "}
            <strong className="font-semibold text-foreground">
              Gemini video watermark remover
            </strong>{" "}
            that tracks that mark through the clip and saves the clean file to
            Library. Instant cannot do this job: a stills engine in the browser
            does not walk sixty frames a second. Drop an original MP4, MOV, or
            WebM on this page — not a screen recording of the player, not a
            WhatsApp recompress. Sign in only when Cloud asks so the job can
            live in Library until you download. New accounts include credits to
            try a short clip before you buy a pack.
          </p>
          <p>
            Drop an MP4 on this page to start. Sign in only when Cloud asks.
            Stills still belong on Instant — this page is for motion.
          </p>
        </>
      }
      steps={steps}
      sections={[
        {
          heading: "Why is video not Instant?",
          body: (
            <>
              <p>
                Instant is a stills tool in your browser. A Veo or Gemini clip
                has the sparkle on every frame. Cloud is the mode that can walk
                the timeline, keep the job if you close the laptop, and hand
                you an MP4 from Library.
              </p>
              <p>
                That is also why this page asks for a file up front instead of
                sending you to a blank homepage. You start the cleanup here;
                Unmark only asks you to sign in if Cloud needs an account to
                save the result.
              </p>
            </>
          ),
        },
        {
          heading: "What is the difference between Gemini video and a still export?",
          body: (
            <>
              <p>
                A “Gemini video” is usually a Veo clip you started in Gemini
                chat or in Flow. The sparkle matches the stills mark — a
                four-point logo in a corner — but it is burned into each frame.
                Cleaning one screenshot does not clean the MP4.
              </p>
              <p>
                Portrait 9:16 and landscape 16:9 both work within the homepage
                limits (short clips, up to 1080p). If you need a still from the
                same prompt, export that image separately and use Instant.
              </p>
            </>
          ),
        },
        {
          heading: "What happens after the clip is clean?",
          body: (
            <>
              <p>
                Download from Library and publish to Reels, Shorts, or TikTok.
                If a platform still asks you to disclose AI media, that rule is
                separate from the visible sparkle — follow it even on a clean
                file.
              </p>
              <p>
                Need the same treatment on a Flow project or a Veo-branded
                export? The Google Flow and Veo guides cover those surfaces.
                Need a poster frame without the sparkle? Export a still from
                the clean clip, or clean the original Gemini image with Instant.
              </p>
            </>
          ),
        },
      ]}
      faqs={faqs}
      howToDescription="Remove the visible Gemini and Veo sparkle from video using Unmark Cloud."
      ctaHeading="Ready to clean a Gemini or Veo video?"
      ctaBody="Drop a clip on this page. Cloud keeps the file in Library until you download."
      ctaHref="#try"
      embedVideo
    />
  );
}
