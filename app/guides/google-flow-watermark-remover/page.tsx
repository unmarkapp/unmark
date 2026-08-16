import type { Metadata } from "next";

import GuideArticle from "@/components/GuideArticle";

export const metadata: Metadata = {
  title: "Google Flow Watermark Remover for Veo Video",
  description:
    "Remove the visible Gemini and Veo watermark from Google Flow exports. Drop an MP4 on this page and download a clean clip from Library.",
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
    body: "Download the original Veo or Gemini clip from Flow — MP4, MOV, or WebM. Skip cropping or a social re-encode before cleanup.",
  },
  {
    title: "Drop the Flow export here",
    body: "Use the box on this page. Unmark opens the cleaner with your file. Sign in only if Cloud asks so the clip can live in Library.",
  },
  {
    title: "Review the cleaned shot",
    body: "Unmark locates the Gemini or Veo sparkle and removes it across frames so the mark does not pop back on a cut.",
  },
  {
    title: "Download for delivery",
    body: "Open Library when the file is ready. Preview, then download for TikTok, Reels, Shorts, or a client cut.",
  },
] as const;

const faqs = [
  {
    question: "Does Unmark work on Google Flow and Veo?",
    answer:
      "Yes. Unmark removes the visible sparkle logo from Google Flow video exports, Veo clips, Gemini stills, Imagen, and Nano Banana. Flow is Google’s filmmaking workspace — the files you download from a Flow project are the ones to drop here. Video uses Cloud and Library. Stills from the same project can use free Instant on the image guide. You do not need a second product for “Flow vs Gemini”; the sparkle is the same family of mark. If Flow gave you a still and a clip, clean them on the matching Unmark surface.",
  },
  {
    question: "Can I batch-clean Flow images with Unmark?",
    answer:
      "Yes. For a stack of Flow or Gemini stills, use Cloud bulk on the homepage or the Unmark Chrome extension. The extension queues prompts on Gemini or Google Flow and downloads cleaned PNGs so you are not exporting one file at a time. Video remains one clip per drop on this page (within length and size limits). If your Flow board is mostly stills, Instant or the extension will be faster than treating every asset as video.",
  },
  {
    question: "Do I need a separate tool for Flow vs Gemini?",
    answer:
      "No. Flow, Gemini, Veo, Imagen, and Nano Banana share the visible four-point sparkle. Unmark is one workflow: Instant for a single still, Cloud for video and Library, the extension when you generate inside Gemini or Flow in Chrome. What changes is the file you export — a Flow timeline is usually an MP4; a Gemini chat image is a PNG. Bring the original export. Do not screen-record the Flow player; that adds UI chrome Unmark is not meant to erase.",
  },
] as const;

export default function GoogleFlowWatermarkRemoverGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/google-flow-watermark-remover"
      title="Google Flow watermark remover"
      intro={
        <>
          <p>
            <strong className="font-semibold text-foreground">Google Flow</strong>{" "}
            is Google’s filmmaking workspace for Veo, Imagen, and Gemini.
            Exported Flow videos often show a visible sparkle in the corner.
            This{" "}
            <strong className="font-semibold text-foreground">
              Google Flow watermark remover
            </strong>{" "}
            cleans that logo frame by frame without boxing out the whole
            corner of the shot.
          </p>
          <p>
            Drop the export on this page. You only sign in if Cloud needs an
            account to keep the clip in Library.
          </p>
        </>
      }
      steps={steps}
      sections={[
        {
          heading: "Flow exports vs Gemini chat stills",
          body: (
            <>
              <p>
                Flow is built for shots, cuts, and Veo generations in a
                timeline. The download is usually a video. Gemini chat is built
                for stills (and occasional clips). If you only needed the
                sparkle off a PNG from Gemini, use Instant — this page is for
                the Flow/Veo MP4.
              </p>
              <p>
                Mixing them up is the usual failure: people screenshot the Flow
                preview, run Instant, and wonder why the timeline is unchanged.
                Export the media from Flow, then drop that file here.
              </p>
            </>
          ),
        },
        {
          heading: "Keeping continuity across a Flow scene",
          body: (
            <>
              <p>
                A Flow scene can cut between several Veo takes. Clean each
                exported clip so the sparkle does not reappear on a new shot.
                Unmark aims for a consistent treatment of the same corner mark
                rather than a different blur on every take.
              </p>
              <p>
                If you also generate stills on the Flow board for thumbnails or
                key art, clean those with Instant or the Chrome extension, then
                drop them into the edit. Do not upscale a cleaned still and
                pretend it is the video.
              </p>
            </>
          ),
        },
        {
          heading: "From Flow to social",
          body: (
            <>
              <p>
                After Library has the clean MP4, you can cut for TikTok, Reels,
                or Shorts in CapCut or your NLE. Unmark does not replace an
                editor — it removes the Google sparkle so the corner of the
                frame is usable.
              </p>
              <p>
                For a batch of Flow stills heading to a pitch deck, skip video
                credits and use Instant or bulk Cloud. For agent workflows that
                pull public image URLs, see the MCP guide; Flow video still
                starts with a file drop here.
              </p>
            </>
          ),
        },
      ]}
      faqs={faqs}
      howToName="How to remove the Google Flow watermark from a video"
      howToDescription="Remove the visible Gemini or Veo mark from Google Flow video exports with Unmark."
      ctaHeading="Clean a Google Flow export"
      ctaBody="Drop your Flow or Veo clip on this page — Cloud keeps it in Library until you download."
      ctaHref="#try"
      embedVideo
    />
  );
}
