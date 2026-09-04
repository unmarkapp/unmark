"use client";

const SPECS = [
  { label: "Mode", value: "Instant + Cloud" },
  { label: "Input", value: "Image / video" },
  { label: "Output", value: "PNG / MP4" },
  { label: "Quality", value: "Original" },
];

export default function ClosingCta() {
  const scrollToUpload = () => {
    window.dispatchEvent(new CustomEvent("unmark:set-mode", { detail: "clean" }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 xl:px-8">
        {/* Left: copy */}
        <div className="flex flex-col items-start justify-center">
          <h2 className="font-display font-medium text-foreground text-4xl sm:text-5xl">
            Your media, clean and ready
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Drop a Gemini image or Veo video, clear the sparkle, or cut out
            the subject. Original quality, ready to post.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToUpload}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.98]"
            >
              Try Instant free
            </button>
            <a
              href="/tools/create"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border px-6 py-3 text-sm font-medium text-foreground transition hover:bg-sand"
            >
              Open Create
            </a>
          </div>
        </div>

        {/* Right: specs card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs rounded-[var(--radius-lg)] border border-border">
            <div className="divide-y divide-border text-sm">
              {SPECS.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-muted">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-muted">Status</span>
                <span className="flex items-center gap-1.5 font-medium text-success">
                  <span className="inline-block h-1.5 w-1.5 animate-soft-pulse rounded-full bg-success" />
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
