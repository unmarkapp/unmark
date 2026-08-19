import type { Metadata } from "next";
import Link from "next/link";

import InstantCleanEmbed from "@/components/InstantCleanEmbed";
import JsonLd from "@/components/JsonLd";
import PrivacyNote from "@/components/PrivacyNote";
import AppsSection from "@/components/AppsSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { personJsonLd } from "@/lib/editorial";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  CHROME_WEB_STORE_URL,
  PRODUCT_TOOLS,
  SITE_ONE_LINER,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Unmark — Gemini Watermark Remover",
  description: SITE_TAGLINE,
  alternates: { canonical: "/product" },
  openGraph: {
    title: "Unmark — AI media cleanup",
    description: SITE_TAGLINE,
    url: `${SITE_URL}/product`,
  },
};

export default function ProductPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <JsonLd data={breadcrumbJsonLd([{ name: "Product", path: "/product" }])} />
      <JsonLd data={personJsonLd()} />
      <SiteHeader />
      <main>
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6">
        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Product
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Unmark — Gemini watermark remover
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {SITE_ONE_LINER}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-strong sm:text-base">
            Instant cleans one Gemini, Imagen, or Nano Banana still in your
            browser with no account. Cloud saves Veo and Google Flow clips to
            Library, handles bulk stills, background cutouts, and the Chrome
            extension. Use the drop zone on this page — you do not need to bounce
            to the homepage to try a single image.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#try"
              className="inline-flex bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Try Instant free
            </a>
            <a
              href={CHROME_WEB_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand"
            >
              Chrome extension
            </a>
            <Link
              href="/about"
              className="inline-flex border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand"
            >
              About Unmark
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-3xl">
          <InstantCleanEmbed />
          <PrivacyNote />
        </div>

        <ul className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
          {PRODUCT_TOOLS.map((tool) => {
            const isExtension = tool.id === "extension";
            const href = isExtension ? CHROME_WEB_STORE_URL : tool.href;
            return (
              <li key={tool.id}>
                {isExtension ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col border border-border bg-surface/90 p-5 transition hover:border-brand"
                  >
                    <ProductCard tool={tool} />
                  </a>
                ) : (
                  <Link
                    href={href}
                    className="flex h-full flex-col border border-border bg-surface/90 p-5 transition hover:border-brand"
                  >
                    <ProductCard tool={tool} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <section className="mx-auto mt-16 max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-strong">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            What Unmark is for
          </h2>
          <p>
            Unmark removes the visible four-point Gemini sparkle from AI stills
            and video, and cuts subjects onto a transparent PNG. It is not a
            generic logo eraser for channel bugs, captions, or marks from Sora,
            Midjourney, Runway, or Adobe Firefly.
          </p>
          <p>
            Instant is the free front door: one PNG, JPG, or WebP, original
            resolution, no Unmark stamp. Cloud is for work that has to persist —
            a Veo clip, a folder of Flow stills, yesterday’s file in Library, or
            a cutout you will reuse in an ad.
          </p>
          <p>
            Guides cover the how-to for{" "}
            <Link href="/guides/remove-gemini-watermark" className="text-brand hover:underline">
              Gemini images
            </Link>
            , the{" "}
            <Link
              href="/guides/free-gemini-watermark-remover"
              className="text-brand hover:underline"
            >
              free Instant path
            </Link>
            ,{" "}
            <Link href="/guides/remove-veo-watermark" className="text-brand hover:underline">
              Veo
            </Link>
            ,{" "}
            <Link
              href="/guides/google-flow-watermark-remover"
              className="text-brand hover:underline"
            >
              Google Flow
            </Link>
            , and the{" "}
            <Link href="/guides/mcp-server" className="text-brand hover:underline">
              MCP server
            </Link>
            .
          </p>
        </section>
      </div>

      <AppsSection />
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductCard({
  tool,
}: {
  tool: (typeof PRODUCT_TOOLS)[number];
}) {
  return (
    <>
      <div className="flex items-center gap-2">
        <h2 className="font-display text-lg font-semibold">{tool.title}</h2>
        <span className="border-2 border-ink bg-peach px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
          {tool.badge}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm text-muted">{tool.description}</p>
      <span className="mt-4 text-sm font-semibold text-brand">{tool.cta} →</span>
    </>
  );
}
