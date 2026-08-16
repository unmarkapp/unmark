import Link from "next/link";
import type { ReactNode } from "react";

import InstantCleanEmbed from "@/components/InstantCleanEmbed";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE_URL } from "@/lib/seo";

export type GuideStep = {
  title: string;
  body: string;
};

export type GuideFaq = {
  question: string;
  answer: string;
};

type GuideArticleProps = {
  canonicalPath: string;
  title: string;
  intro: ReactNode;
  steps?: readonly GuideStep[];
  sections?: readonly { heading: string; body: ReactNode }[];
  faqs?: readonly GuideFaq[];
  howToName?: string;
  howToDescription?: string;
  ctaHeading?: string;
  ctaBody?: string;
  ctaHref?: string;
  embedInstant?: boolean;
};

export default function GuideArticle({
  canonicalPath,
  title,
  intro,
  steps,
  sections,
  faqs,
  howToName,
  howToDescription,
  ctaHeading = "Ready to remove a Gemini watermark?",
  ctaBody = "Instant is free in your browser. Cloud adds Library, video, bulk, and the extension.",
  ctaHref = "/#upload",
  embedInstant = false,
}: GuideArticleProps) {
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: `${SITE_URL}/guides`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: `${SITE_URL}${canonicalPath}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: title,
      description: howToDescription ?? title,
      url: `${SITE_URL}${canonicalPath}`,
      publisher: {
        "@type": "Organization",
        name: "Unmark",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
      },
    },
  ];

  if (steps?.length && howToName) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: howToName,
      description: howToDescription ?? howToName,
      totalTime: "PT5M",
      step: steps.map((step, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: step.title,
        text: step.body,
        url: `${SITE_URL}${canonicalPath}#step-${i + 1}`,
      })),
    });
  }

  if (faqs?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return (
    <div className="surface-grain min-h-screen text-foreground">
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <SiteHeader />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">Guide</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <div className="mt-4 text-base leading-relaxed text-muted-strong sm:text-lg">
          {intro}
        </div>

        {embedInstant ? <InstantCleanEmbed /> : null}

        {steps?.length ? (
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
        ) : null}

        {sections?.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {section.heading}
            </h2>
            <div className="mt-3 text-[15px] leading-relaxed text-muted-strong">
              {section.body}
            </div>
          </section>
        ))}

        <div className="mt-14 rounded-2xl border border-border bg-cream/50 px-6 py-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">
            {ctaHeading}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">{ctaBody}</p>
          <Link
            href={ctaHref}
            className="mt-5 inline-flex rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Open Unmark
          </Link>
        </div>

        {faqs?.length ? (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Common questions
            </h2>
            <div className="mt-8 space-y-8">
              {faqs.map((item) => (
                <div key={item.question}>
                  <h3 className="text-base font-semibold">{item.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-strong">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <nav
          aria-label="Related guides"
          className="mt-16 border-t border-border pt-10"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Related guides
          </h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm font-medium">
            <li>
              <Link href="/guides/remove-gemini-watermark" className="text-brand hover:underline">
                How to remove a Gemini watermark from an image
              </Link>
            </li>
            <li>
              <Link
                href="/guides/remove-gemini-video-watermark"
                className="text-brand hover:underline"
              >
                Gemini video watermark remover
              </Link>
            </li>
            <li>
              <Link
                href="/guides/google-flow-watermark-remover"
                className="text-brand hover:underline"
              >
                Google Flow watermark remover
              </Link>
            </li>
            <li>
              <Link href="/guides/remove-veo-watermark" className="text-brand hover:underline">
                Remove Veo watermark from video
              </Link>
            </li>
            <li>
              <Link
                href="/guides/free-gemini-watermark-remover"
                className="text-brand hover:underline"
              >
                Free Gemini watermark remover
              </Link>
            </li>
            <li>
              <Link href="/extension" className="text-brand hover:underline">
                Chrome extension for Gemini &amp; Google Flow
              </Link>
            </li>
          </ul>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}
