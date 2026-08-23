import type { Metadata } from "next";
import Link from "next/link";

import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { EDITORIAL_AUTHOR, personJsonLd } from "@/lib/editorial";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Unmark",
  description:
    "Unmark is a Gemini watermark remover and background cutout tool founded by Sumit Kumar. Instant is free in the browser; Cloud covers video, Library, and the Chrome extension.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Unmark",
    description:
      "Who builds Unmark and how the Gemini watermark remover is maintained.",
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <JsonLd data={breadcrumbJsonLd([{ name: "About", path: "/about" }])} />
      <JsonLd data={personJsonLd()} />
      <SiteHeader />
      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">About</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
          About Unmark
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-strong sm:text-lg">
          Unmark is a small product for a specific mark: the visible four-point
          sparkle Google burns into Gemini, Imagen, Nano Banana, Veo, and Google
          Flow exports. Instant cleans one still in your browser with no
          account. Cloud stores video and cutouts in Library.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">
            Who writes these guides
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            <Link href={EDITORIAL_AUTHOR.url} className="font-semibold text-foreground">
              {EDITORIAL_AUTHOR.name}
            </Link>{" "}
            is the founder of {SITE_NAME} and the named author on the how-to
            guides. The byline is a person, not an anonymous “editorial”
            organization, so you can tell who reviewed the steps for Instant,
            Veo, Flow, and background removal.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            {EDITORIAL_AUTHOR.description}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">
            What we will not claim
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            Unmark is not a generic watermark eraser. It is not built for Sora,
            Midjourney, Runway, or Firefly stamps, and it does not replace
            platform rules about disclosing AI media. Support is at{" "}
            <Link href="/support" className="text-brand hover:underline">
              /support
            </Link>
            .
          </p>
        </section>

        <div className="mt-14 rounded-2xl border border-border bg-cream/50 px-6 py-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-[-0.02em]">
            Try Instant on a Gemini still
          </p>
          <Link
            href="/#upload"
            className="mt-5 inline-flex rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Open Unmark
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
