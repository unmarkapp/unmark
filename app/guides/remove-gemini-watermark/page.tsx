import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { FAQ_ITEMS, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How to Remove a Gemini Watermark from an Image",
  description:
    "Step-by-step guide to remove the Gemini sparkle watermark from images with Unmark. Free Instant mode or Cloud for Library, bulk, and 16:9 / 9:16 exports.",
  alternates: { canonical: "/guides/remove-gemini-watermark" },
  openGraph: {
    title: "How to Remove a Gemini Watermark · Unmark",
    description:
      "Step-by-step guide to remove the Gemini sparkle watermark from images.",
    url: "/guides/remove-gemini-watermark",
    type: "article",
  },
};

const steps = [
  {
    title: "Export from Gemini",
    body: "Download the image Gemini generated. Prefer PNG or high-quality JPG at 16:9 or 9:16 — the layouts Unmark is tuned for.",
  },
  {
    title: "Open Unmark",
    body: "Go to www.unmark.ink and sign in with Google. New accounts get free credits so you can try Gemini watermark removal right away.",
  },
  {
    title: "Upload and detect",
    body: "Drop the file. Use Auto to find the corner sparkle, or Manual if you need to draw the box yourself.",
  },
  {
    title: "Download the clean file",
    body: "Process the job and download. Unmark keeps original resolution — no forced downscale.",
  },
] as const;

const howToLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to remove a Gemini watermark from an image",
  description:
    "Remove the Google Gemini sparkle watermark using Unmark in four steps.",
  totalTime: "PT2M",
  step: steps.map((step, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: step.title,
    text: step.body,
    url: `${SITE_URL}/guides/remove-gemini-watermark#step-${i + 1}`,
  })),
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function RemoveGeminiWatermarkGuidePage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <SiteHeader />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">Guide</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          How to remove a Gemini watermark
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-strong sm:text-lg">
          Gemini adds a small sparkle stamp to many AI images. Unmark is a{" "}
          <strong className="font-semibold text-foreground">
            Gemini watermark remover
          </strong>{" "}
          built for that corner mark — upload, detect, download.
        </p>

        <ol className="mt-12 space-y-10">
          {steps.map((step, i) => (
            <li
              key={step.title}
              id={`step-${i + 1}`}
              className="scroll-mt-24"
            >
              <p className="font-display text-3xl font-semibold text-brand/80">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">
                {step.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-strong">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-2xl border border-border bg-cream/50 px-6 py-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Ready to clean a Gemini image?
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Start on the homepage — free credits included when you sign up.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Open Unmark
          </Link>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Common questions
          </h2>
          <div className="mt-8 space-y-8">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-strong">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
