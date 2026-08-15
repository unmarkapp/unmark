"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";

/** Drop your real Gemini sample pairs here (same size / framing). */
const EXAMPLES = [
  {
    id: "gallery-1",
    beforeUrl: "/demo/sample-1-before.jpeg",
    afterUrl: "/demo/sample-1-after.png",
    caption: "Portrait · sparkle removed",
  },
  {
    id: "gallery-2",
    beforeUrl: "/demo/sample-2-before.jpeg",
    afterUrl: "/demo/sample-2-after.png",
    caption: "Portrait · sparkle removed",
  },
] as const;

export default function LandingBeforeAfter() {
  return (
    <section
      id="compare"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-cream" aria-hidden />
          Before / after
        </p>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
          See the watermark removal effect
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Compare real Gemini image examples before and after cleanup. Drag the
          handle to inspect the corner sparkle.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-5">
        {EXAMPLES.map((example) => (
          <figure
            key={example.id}
            className="flex h-full flex-col overflow-hidden border border-border bg-surface shadow-[0_18px_50px_-28px_rgba(26,26,23,0.45)]"
          >
            <BeforeAfterSlider
              beforeUrl={example.beforeUrl}
              afterUrl={example.afterUrl}
              aspectRatio="3 / 4"
              objectFit="contain"
              objectPosition="center"
            />
            <figcaption className="mt-auto border-t border-border px-3 py-2 text-center text-xs text-muted sm:text-sm">
              {example.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
