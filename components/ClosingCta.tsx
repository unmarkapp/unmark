"use client";

export default function ClosingCta() {
  const scrollToUpload = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden border-t border-border/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span className="select-none font-display text-[18vw] font-semibold leading-none tracking-tight text-brand/[0.07] sm:text-[14vw]">
          REMOVE
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Your images.
        </h2>
        <p className="mt-2 bg-gradient-to-r from-brand to-brand-hover bg-clip-text font-display text-4xl font-semibold tracking-tight text-transparent sm:text-5xl md:text-6xl">
          No Gemini sparkle.
        </p>

        <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
          Drop a Gemini image, clear the corner mark with Auto, and download a
          clean file — original quality, ready to post.
        </p>

        <button
          type="button"
          onClick={scrollToUpload}
          className="mt-8 inline-flex items-center justify-center bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          Remove Gemini watermark
          <span aria-hidden className="ml-2">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
