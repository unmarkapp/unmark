"use client";

import ProductToolCard from "@/components/ProductToolCard";
import { PRODUCT_TOOLS } from "@/lib/seo";

export default function GetStartedTools() {
  return (
    <section
      id="get-started"
      data-walkthrough="tools"
      className="mx-auto w-full max-w-7xl border-t border-border"
    >
      {/* Section title */}
      <div className="px-4 py-16 sm:px-6 sm:py-24 xl:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className="animate-section-reveal mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Tools
            </p>
            <h2 className="animate-section-reveal font-display font-medium text-foreground text-4xl sm:text-5xl">
              Ready to use
            </h2>
          </div>
          <p className="animate-section-reveal max-w-md text-sm leading-relaxed text-muted">
            Pick the tool you need. Instant images are free, Cloud handles
            video and cutouts, and the Chrome extension works directly
            inside Gemini.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {PRODUCT_TOOLS.map((tool) => (
            <li key={tool.id} className="animate-section-reveal">
              <ProductToolCard tool={tool} layout="grid" />
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted">
          Prefer mobile?{" "}
          <a href="/android" className="font-medium text-foreground transition hover:text-muted">
            Android early access
          </a>
          <span className="mx-2 text-border">·</span>
          <a href="/#apps" className="font-medium text-foreground transition hover:text-muted">
            iOS soon
          </a>
        </p>
      </div>
    </section>
  );
}
