"use client";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";

/** Drop your real Gemini sample pairs here (same size / framing). */
const EXAMPLES = [
  {
    id: "gallery-1",
    beforeUrl: "/demo/sample-1-before.webp",
    afterUrl: "/demo/sample-1-after.webp",
    caption: "Portrait · sparkle removed",
  },
  {
    id: "gallery-2",
    beforeUrl: "/demo/sample-2-before.webp",
    afterUrl: "/demo/sample-2-after.webp",
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
        <h2 className="animate-section-reveal font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
          See the difference
        </h2>
        <p className="animate-section-reveal mt-4 text-base leading-relaxed text-muted sm:text-lg">
          Drag the handle to inspect real Gemini image cleanup. The sparkle is
          gone, the rest is untouched.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-5">
        {EXAMPLES.map((example) => (
          <figure
            key={example.id}
            className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[0_18px_50px_-28px_rgb(var(--shadow-color)/0.35)]"
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
