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
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Get started</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
          Ready to use Unmark
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Pick the tool you need — Instant images free, Cloud for video
          and cutouts, or the Chrome extension on Gemini.
        </p>
      </div>

      <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {PRODUCT_TOOLS.map((tool) => (
          <li key={tool.id}>
            <ProductToolCard tool={tool} layout="grid" />
          </li>
        ))}
      </ul>

      <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted">
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
