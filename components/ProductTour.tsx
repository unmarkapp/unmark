"use client";

import Script from "next/script";
import { useState } from "react";

import {
  SUPADEMO_DEMO_ID,
  SUPADEMO_EMBED_URL,
  SUPADEMO_SCRIPT_SRC,
} from "@/lib/supademo";
import { resetWalkthrough } from "@/lib/walkthrough";

declare global {
  interface Window {
    Supademo?: { open: (id: string) => void };
  }
}

export default function ProductTour() {
  const [playing, setPlaying] = useState(false);

  const startEmbed = () => setPlaying(true);

  const openFullscreen = () => {
    setPlaying(true);
    window.Supademo?.open(SUPADEMO_DEMO_ID);
  };

  return (
    <section
      id="tour"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      {playing ? <Script src={SUPADEMO_SCRIPT_SRC} strategy="afterInteractive" /> : null}

      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
          Product tour
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
          See Unmark in action
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Click through a short walkthrough — upload a Gemini still, remove the
          sparkle, and download a clean file.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[var(--radius-lg)] bg-ink shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_24px_48px_-20px_rgb(var(--shadow-color)/0.5)]">
        <div className="relative aspect-video w-full bg-ink">
          {playing ? (
            <iframe
              src={SUPADEMO_EMBED_URL}
              title="Unmark product tour — Gemini watermark remover"
              allow="clipboard-write; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={startEmbed}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink text-white transition hover:bg-ink/90"
              aria-label="Play product tour"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand shadow-[0_4px_16px_-2px_rgb(var(--shadow-color)/0.5)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-sm font-semibold">
                Play tour
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={openFullscreen}
          className="btn-play inline-flex items-center justify-center rounded-[var(--radius-md)] bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_10px_20px_-8px_rgb(var(--shadow-color)/0.3)] transition hover:bg-brand-hover"
        >
          Watch full screen
        </button>
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
