import Link from "next/link";
import type { ReactNode } from "react";

import InstantCleanEmbed from "@/components/InstantCleanEmbed";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VideoCleanEmbed from "@/components/VideoCleanEmbed";
import {
  ARTICLE_IMAGE,
  EDITORIAL_AUTHOR,
  GUIDES_PUBLISHED,
  GUIDES_REVIEWED,
  formatReviewDate,
} from "@/lib/editorial";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export type GuideStep = {
  title: string;
  body: string;
};

export type GuideFaq = {
  question: string;
  answer: string;
};

const RELATED_GUIDES = [
  {
    href: "/guides/remove-gemini-watermark",
    label: "How to remove a Gemini watermark from an image",
  },
  {
    href: "/guides/remove-gemini-video-watermark",
    label: "Gemini video watermark remover",
  },
  {
    href: "/guides/google-flow-watermark-remover",
    label: "Google Flow watermark remover",
  },
  {
    href: "/guides/remove-veo-watermark",
    label: "Remove Veo watermark from video",
  },
  {
    href: "/guides/free-gemini-watermark-remover",
    label: "Free Gemini watermark remover",
  },
  {
    href: "/guides/mcp-server",
    label: "MCP server for Claude",
  },
  {
    href: "/extension",
    label: "Chrome extension for Gemini & Google Flow",
  },
] as const;

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
  embedVideo?: boolean;
  datePublished?: string;
  dateModified?: string;
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
  ctaBody = "Instant is free in your browser. Cloud adds Library, video, bulk, and the Chrome extension.",
  ctaHref = "/#upload",
  embedInstant = false,
  embedVideo = false,
  datePublished = GUIDES_PUBLISHED,
  dateModified = GUIDES_REVIEWED,
}: GuideArticleProps) {
  const pageUrl = `${SITE_URL}${canonicalPath}`;
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
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: title,
      description: howToDescription ?? title,
      url: pageUrl,
      image: ARTICLE_IMAGE,
      datePublished,
      dateModified,
      author: {
        "@type": "Organization",
        name: EDITORIAL_AUTHOR.name,
        url: EDITORIAL_AUTHOR.url,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
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
        url: `${pageUrl}#step-${i + 1}`,
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

  const related = RELATED_GUIDES.filter((item) => item.href !== canonicalPath);

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
        <p className="mt-3 text-sm text-muted">
          By{" "}
          <Link
            href="/product"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            {EDITORIAL_AUTHOR.name}
          </Link>
          {" · "}
          Updated {formatReviewDate(dateModified)}
        </p>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-strong sm:text-lg">
          {intro}
        </div>

        {embedInstant ? <InstantCleanEmbed /> : null}
        {embedVideo ? <VideoCleanEmbed /> : null}

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
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-strong">
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
            {related.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-brand hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <SiteFooter />
    </div>
  );
}
