"use client";

import { BRAND, SPARKLE_PATH } from "@/components/brand/logos";

function BananaIcon({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden
    >
      {/* Banana body */}
      <path
        d="M20 56 C18 42 22 28 32 20 C42 12 58 14 64 24 C68 32 62 44 50 50 C40 56 28 58 20 56Z"
        fill="#F0C98A"
      />
      {/* Banana curve highlight */}
      <path
        d="M28 24 C32 18 42 14 52 18"
        stroke="#FDFBF7"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Banana tip left */}
      <path
        d="M20 56 C16 56 14 52 16 48"
        stroke="#C5401F"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Banana tip right */}
      <path
        d="M64 24 C66 20 64 16 60 16"
        stroke="#C5401F"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SparkleDecor({
  x,
  y,
  scale = 1,
  opacity = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={18 * scale}
      height={18 * scale}
      viewBox="-12 -12 24 24"
      style={{ position: "absolute", left: x, top: y, opacity }}
      aria-hidden
    >
      <path d={SPARKLE_PATH} fill={BRAND.peach} />
    </svg>
  );
}

export default function ClosingCta() {
  const scrollToUpload = () => {
    window.dispatchEvent(new CustomEvent("unmark:set-mode", { detail: "clean" }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden border-t border-border/80 bg-foreground text-background dark:bg-surface-raised dark:text-foreground">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">

        {/* Left: copy */}
        <div className="flex flex-col items-start">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Clean media, free
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.025em] sm:text-5xl md:text-6xl">
            Your media.{" "}
            <span className="text-brand">Clean</span>
            {" "}and ready.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-relaxed opacity-70 sm:text-lg">
            Drop a Gemini image or Veo video, clear the sparkle, or cut out the
            subject. Original quality, ready to post.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToUpload}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1),0_10px_20px_-8px_rgba(0,0,0,0.4)] transition hover:bg-brand-hover active:scale-[0.98]"
            >
              Try Instant free
            </button>
            <a
              href="/tools/create"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-current/20 px-6 py-3.5 text-sm font-semibold opacity-80 transition hover:opacity-100 active:scale-[0.98]"
            >
              Open Create →
            </a>
          </div>
        </div>

        {/* Right: Nano Banana logo card */}
        <div className="flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-white/10 bg-white/5 px-12 py-14 shadow-[0_24px_64px_rgba(0,0,0,0.5)] backdrop-blur-sm">

            {/* Decorative sparkles */}
            <SparkleDecor x={16} y={18} scale={0.8} opacity={0.5} />
            <SparkleDecor x={-8} y={80} scale={0.6} opacity={0.35} />
            <SparkleDecor x={180} y={24} scale={0.7} opacity={0.45} />
            <SparkleDecor x={170} y={100} scale={1} opacity={0.3} />
            <SparkleDecor x={90} y={-10} scale={0.5} opacity={0.4} />

            {/* Banana icon with glow */}
            <div className="relative flex items-center justify-center rounded-full p-5"
              style={{ background: "radial-gradient(circle, rgba(240,201,138,0.18) 0%, transparent 70%)" }}
            >
              <BananaIcon size={88} />
            </div>

            {/* Label */}
            <p className="mt-5 font-display text-2xl font-semibold tracking-tight text-background dark:text-foreground">
              Nano Banana
            </p>
            <p className="mt-1.5 text-sm opacity-60">
              Generate without the sparkle
            </p>

            {/* Pill badge */}
            <a
              href="/tools/create"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/20"
            >
              <svg width="10" height="10" viewBox="-8 -8 16 16" aria-hidden>
                <path
                  d="M0 -6.5 C 0.3 -1.8 1.8 -0.3 6.5 0 C 1.8 0.3 0.3 1.8 0 6.5 C -0.3 1.8 -1.8 0.3 -6.5 0 C -1.8 -0.3 -0.3 -1.8 0 -6.5 Z"
                  fill="currentColor"
                />
              </svg>
              Try Create
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
