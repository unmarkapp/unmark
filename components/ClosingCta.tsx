"use client";

export default function ClosingCta() {
  const scrollToUpload = () => {
    window.dispatchEvent(new CustomEvent("unmark:set-mode", { detail: "clean" }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden border-t border-border/80 bg-foreground text-background dark:bg-surface-raised dark:text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start px-4 py-20 sm:px-6 sm:py-24">
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
    </section>
  );
}
