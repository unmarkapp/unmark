"use client";

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
              href="/tools/background-removal"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-current/20 px-6 py-3.5 text-sm font-semibold opacity-80 transition hover:opacity-100 active:scale-[0.98]"
            >
              Background cutout
            </a>
          </div>
        </div>

        {/* Right: before/after image collage */}
        <div className="relative hidden lg:block" aria-hidden>
          {/* Card 1 — top left, tilted left */}
          <div className="absolute -left-4 top-0 w-[200px] -rotate-3 overflow-hidden rounded-[var(--radius-md)] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/sample-1-before.webp"
              alt="Before watermark removal"
              className="block h-auto w-full object-cover"
            />
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              Before
            </span>
          </div>

          {/* Card 2 — top right, tilted right */}
          <div className="absolute right-0 top-4 w-[200px] rotate-2 overflow-hidden rounded-[var(--radius-md)] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/sample-1-after.webp"
              alt="After watermark removal"
              className="block h-auto w-full object-cover"
            />
            <span className="absolute left-2 top-2 rounded-full bg-brand/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              After
            </span>
          </div>

          {/* Card 3 — bottom left */}
          <div className="absolute bottom-0 left-8 w-[190px] rotate-1 overflow-hidden rounded-[var(--radius-md)] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/sample-2-before.webp"
              alt="Before watermark removal"
              className="block h-auto w-full object-cover"
            />
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              Before
            </span>
          </div>

          {/* Card 4 — bottom right */}
          <div className="absolute -right-2 bottom-4 w-[190px] -rotate-2 overflow-hidden rounded-[var(--radius-md)] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/sample-2-after.webp"
              alt="After watermark removal"
              className="block h-auto w-full object-cover"
            />
            <span className="absolute left-2 top-2 rounded-full bg-brand/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              After
            </span>
          </div>

          {/* Spacer to give the absolute cards room */}
          <div className="h-[340px]" />
        </div>

        {/* Mobile: simple 2-up grid */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {[
            { src: "/demo/sample-1-before.webp", label: "Before", accent: false },
            { src: "/demo/sample-1-after.webp",  label: "After",  accent: true  },
            { src: "/demo/sample-2-before.webp", label: "Before", accent: false },
            { src: "/demo/sample-2-after.webp",  label: "After",  accent: true  },
          ].map(({ src, label, accent }) => (
            <div key={src} className="relative overflow-hidden rounded-[var(--radius-md)] border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={label} className="block h-auto w-full object-cover" />
              <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm ${accent ? "bg-brand/90" : "bg-black/60"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
