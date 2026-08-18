"use client";

import Script from "next/script";

import {
  SUPADEMO_DEMO_ID,
  SUPADEMO_EMBED_URL,
  SUPADEMO_SCRIPT_SRC,
} from "@/lib/supademo";

declare global {
  interface Window {
    Supademo?: { open: (id: string) => void };
  }
}

export default function ProductTour() {
  const openFullscreen = () => {
    window.Supademo?.open(SUPADEMO_DEMO_ID);
  };

  return (
    <section
      id="tour"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <Script src={SUPADEMO_SCRIPT_SRC} strategy="lazyOnload" />

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
          Product tour
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          See Unmark in action
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Click through a short walkthrough — upload a Gemini still, remove the
          sparkle, and download a clean file.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl overflow-hidden border-2 border-ink bg-ink shadow-[8px_8px_0_0_var(--ink)]">
        <div className="relative aspect-video w-full bg-ink">
          <iframe
            src={SUPADEMO_EMBED_URL}
            title="Unmark product tour — Gemini watermark remover"
            allow="clipboard-write; fullscreen"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={openFullscreen}
          className="btn-play inline-flex items-center justify-center border-2 border-ink bg-brand px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
        >
          Watch full screen
        </button>
      </div>
    </section>
  );
}
