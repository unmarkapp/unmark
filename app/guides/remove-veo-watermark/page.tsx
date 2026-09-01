import type { Metadata } from "next";

import GuideArticle from "@/components/GuideArticle";

export const metadata: Metadata = {
  title: "Remove Veo Watermark from Video",
  description:
    "Remove the Veo sparkle watermark from AI video online, including Veo 3 exports. Drop an MP4 on this page — Unmark strips the visible logo from every frame.",
  alternates: { canonical: "/guides/remove-veo-watermark" },
  openGraph: {
    title: "Remove Veo Watermark · Unmark",
    description:
      "Strip the Veo sparkle logo from Veo 3 and Veo 2 video exports with Unmark Cloud.",
    url: "/guides/remove-veo-watermark",
    type: "article",
  },
};

const steps = [
  {
    title: "How do I get the Veo source file?",
    body: "Export or download the clip directly from Veo, Google Flow, or Gemini video — not a screen recording. MP4 is the most common format.",
  },
  {
    title: "Where do I drop the Veo clip?",
    body: "Use the box below. Unmark opens the cleaner with your file. Sign in only if Cloud asks so the result can sit in Library.",
  },
  {
    title: "How does Auto-detect find the sparkle?",
    body: "Unmark finds the four-point Veo / Gemini logo in the corner (or a tiled placement) and applies the same cleanup across the timeline.",
  },
  {
    title: "Where do I download the clean Veo clip?",
    body: "Collect the finished file from Library. Share to social without the visible AI sparkle in every frame.",
  },
] as const;

const faqs = [
  {
    question: "What does the Veo watermark look like?",
    answer:
      "A small four-point sparkle logo, usually in a corner of each video frame — the same visible mark Google uses on Gemini stills and Veo outputs. It is part of the picture, not a player overlay you can hide with a setting. Portrait 9:16 Reels-style clips and landscape 16:9 both show it. Unmark looks for that sparkle specifically. Text captions, lower-thirds, and stock bugs you added later are not Veo marks and will stay unless you remove them in an editor.",
  },
  {
    question: "Can Unmark remove Veo watermarks from long clips?",
    answer:
      "Yes, within the Cloud upload limits on the homepage — short clips, up to 1080p, within the listed file size. A two-hour timeline is not the job; a Veo take you actually exported from Flow or Gemini is. Long jobs stay in Library, so you do not need to keep the tab open. If a clip is over the limit, split it in your editor, clean each part, and join again. Always start from the original Veo export rather than a social re-download.",
  },
  {
    question: "Does Unmark remove every Google mark on a Veo file?",
    answer:
      "Unmark removes the visible sparkle logo you see in the corner of Veo and Gemini frames. That is the mark this page is for. Platform rules about disclosing AI-generated video are separate — follow them even after the sparkle is gone. Unmark is not a generic watermark eraser for channel logos or burned-in captions. If you only needed a poster frame, export a still and use Instant instead of spending video credits.",
  },
  {
    question: "Does this work on Veo 3 clips?",
    answer:
      "Yes. Veo 3 and Veo 2 exports carry the same visible four-point sparkle in the corner, so Unmark's Auto-detect handles both the same way. Drop the original Veo 3 MP4 here rather than a re-encoded copy from a social app — recompression can shift or blur the mark and make detection harder.",
  },
] as const;

export default function RemoveVeoWatermarkGuidePage() {
  return (
    <GuideArticle
      canonicalPath="/guides/remove-veo-watermark"
      title="Remove Veo watermark from video"
      intro={
        <>
          <p>
            <strong className="font-semibold text-foreground">Veo</strong> adds
            the same visible sparkle stamp you see on Gemini images, but on
            every frame of generated video. Unmark is a{" "}
            <strong className="font-semibold text-foreground">
              Veo watermark remover
            </strong>{" "}
            that processes the full clip, saves it to Library, and lets you
            download when it is ready. Start from the original Veo, Flow, or
            Gemini video export — a screen recording of the preview player adds
            chrome Unmark is not meant to erase. Homepage limits still apply
            (short clips, up to 1080p). Instant remains the free path for
            stills; this page spends Cloud credits because every frame needs
            the same cleanup.
          </p>
          <p>
            Drop the MP4 here. Sign in only if Cloud needs an account. Instant
            remains the free path for stills.
          </p>
        </>
      }
      steps={steps}
      sections={[
        {
          heading: "Are Veo, Gemini video, and Flow the same sparkle?",
          body: (
            <>
              <p>
                Veo is the video model. Gemini is often the chat you used to
                prompt it. Flow is the timeline you assembled. The sparkle on
                the export is the same family of four-point logo. This guide is
                written for people who searched “remove Veo watermark” and have
                an MP4 in hand.
              </p>
              <p>
                If your file came from a Flow project, the Flow guide has extra
                notes on scenes and stills. If you only have a Gemini PNG, use
                Instant. Do not screen-record the Veo preview window — you will
                capture player chrome Unmark is not meant to remove.
              </p>
            </>
          ),
        },
        {
          heading: "Do portrait and landscape Veo clips both work?",
          body: (
            <>
              <p>
                Veo exports for Shorts and Reels are usually 9:16; YouTube-first
                shots are 16:9. Unmark keeps the aspect ratio you uploaded and
                looks for the sparkle in the corner that Google used for that
                frame. Cropping 9:16 to 1:1 before cleanup can move or clip the
                mark and make detection worse — clean first, crop after.
              </p>
              <p>
                Homepage limits still apply (about 60 seconds, 1080p, 100MB).
                A 4K master should be exported at 1080p from Veo or Flow before
                you drop it here, unless you already have a 1080p file.
              </p>
            </>
          ),
        },
        {
          heading: "How do I publish a clean Veo clip?",
          body: (
            <>
              <p>
                Library holds the finished file. Download once and keep your
                own archive; you can also re-download from Library later. If
                you close the laptop mid-job, come back to Library instead of
                uploading a second time.
              </p>
              <p>
                Social apps may still ask you to label AI content. Removing the
                sparkle does not change those rules. For a still thumbnail,
                grab a frame from the clean clip or clean the matching Gemini
                image with Instant so the poster does not reintroduce the logo.
              </p>
            </>
          ),
        },
      ]}
      faqs={faqs}
      howToDescription="Remove the visible Veo sparkle logo from AI video with Unmark."
      ctaHeading="Remove the Veo sparkle from your clip"
      ctaBody="Drop MP4, MOV, or WebM from Veo or Google Flow — Cloud handles every frame."
      ctaHref="#try"
      embedVideo
    />
  );
}
