import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { CHROME_WEB_STORE_URL, PRODUCT_TOOLS } from "@/lib/seo";

export default function ToolsLanding() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-5 sm:px-6">
        <SiteHeader />

        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Unmark
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tools
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Image watermark removal, video cleanup, and background cutouts —
            one product for AI media that is ready to publish.
          </p>
        </section>

        <ul className="mx-auto mt-12 grid max-w-2xl gap-4">
          {PRODUCT_TOOLS.map((tool) => {
            const isExtension = tool.id === "extension";
            const href = isExtension ? CHROME_WEB_STORE_URL : tool.href;
            const className =
              "group flex flex-col gap-2 border border-border bg-surface/90 p-5 transition hover:border-brand hover:bg-cream/60 sm:flex-row sm:items-center sm:justify-between";
            const inner = (
              <>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      {tool.title}
                    </h2>
                    <span className="bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{tool.description}</p>
                </div>
                <span className="text-sm font-semibold text-brand group-hover:text-brand-hover">
                  {tool.cta} →
                </span>
              </>
            );

            return (
              <li key={tool.id}>
                {isExtension ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link href={href} className={className}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <SiteFooter />
      </div>
    </div>
  );
}
