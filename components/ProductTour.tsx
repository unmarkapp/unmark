"use client";

import BrandVideoPlayer from "@/components/BrandVideoPlayer";
import { resetWalkthrough } from "@/lib/walkthrough";

export default function ProductTour() {
  return (
    <section
      id="tour"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
          Product tour
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
          See Unmark in action
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Watch a short demo — upload a Gemini still, remove the sparkle, and
          download a clean file.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl overflow-hidden border border-border-strong bg-ink shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_24px_48px_-20px_rgb(var(--shadow-color)/0.5)]">
        <BrandVideoPlayer src="/demo/demo_unmark.mp4" poster="/demo/demo-poster.jpg" />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            resetWalkthrough();
            window.location.assign("/?guide=1");
          }}
          className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-sand"
        >
          Start page guide
        </button>
      </div>
    </section>
  );
}
