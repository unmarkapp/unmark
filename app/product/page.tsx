import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  CHROME_WEB_STORE_URL,
  IOS_APP_URL,
  PRODUCT_TOOLS,
  SITE_ONE_LINER,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Product",
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
      <SiteHeader />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6">

        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Product
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Unmark
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {SITE_ONE_LINER}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#upload"
              className="inline-flex bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Try Instant free
            </Link>
            <a
              href={CHROME_WEB_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand"
            >
              Chrome extension
            </a>
          </div>
        </section>

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

        <p className="mx-auto mt-10 max-w-lg text-center text-sm text-muted">
          {IOS_APP_URL ? (
            <>
              <a
                href={IOS_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline-offset-2 hover:underline"
              >
                Get Unmark on iOS
              </a>
            </>
          ) : (
            <>iOS app coming soon.</>
          )}
        </p>

        <SiteFooter />
      </div>
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
        <span className="bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
          {tool.badge}
        </span>
      </div>
      <p className="mt-2 flex-1 text-sm text-muted">{tool.description}</p>
      <span className="mt-4 text-sm font-semibold text-brand">{tool.cta} →</span>
    </>
  );
}
