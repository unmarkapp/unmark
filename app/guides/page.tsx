import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { GUIDE_LINKS, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Gemini Watermark Removal Guides",
  description:
    "Guides for removing the Gemini sparkle from images and video — Veo, Google Flow, free Instant mode, and the Unmark Chrome extension.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Gemini Watermark Removal Guides · Unmark",
    description:
      "How-to guides for Gemini, Veo, and Google Flow watermark removal.",
    url: "/guides",
    type: "website",
  },
};

const collectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Gemini watermark removal guides",
  url: `${SITE_URL}/guides`,
  description:
    "Step-by-step guides for removing the Gemini sparkle from images and video.",
  hasPart: GUIDE_LINKS.map((guide) => ({
    "@type": "WebPage",
    name: guide.title,
    url: `${SITE_URL}${guide.href}`,
    description: guide.description,
  })),
};

export default function GuidesIndexPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />

      <SiteHeader />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">Guides</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Gemini watermark remover guides
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-strong sm:text-lg">
          How to remove the visible Gemini and Veo sparkle from images and
          video — including Google Flow exports, free browser cleanup, and the
          Unmark Chrome extension.
        </p>

        <ul className="mt-12 divide-y divide-border">
          {GUIDE_LINKS.map((guide) => (
            <li key={guide.href} className="py-6">
              <Link
                href={guide.href}
                className="group block"
              >
                <h2 className="text-lg font-semibold tracking-tight transition group-hover:text-brand">
                  {guide.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-strong">
                  {guide.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 rounded-2xl border border-border bg-cream/50 px-6 py-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Start removing watermarks now
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Open Gemini watermark remover
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
