"use client";

import ProductToolCard from "@/components/ProductToolCard";
import { PRODUCT_TOOLS } from "@/lib/seo";

export default function GetStartedTools() {
  return (
    <section
      id="get-started"
      data-walkthrough="tools"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h2 className="animate-section-reveal font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl lg:max-w-sm">
          Tools ready to use
        </h2>
        <p className="animate-section-reveal max-w-md text-base leading-relaxed text-muted">
          Pick the tool you need. Instant images are free, Cloud handles video and
          cutouts, and the Chrome extension works directly inside Gemini.
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
        <a href="/android" className="font-medium text-brand underline-offset-2 hover:underline">
          Android early access
        </a>
        {" · "}
        <a href="/#apps" className="font-medium text-brand underline-offset-2 hover:underline">
          iOS soon
        </a>
        .
      </p>
    </section>
  );
}
