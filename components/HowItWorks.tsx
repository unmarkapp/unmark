const steps = [
  {
    verb: "Drop",
    body: "Drop a Gemini image, a Veo or Flow video, or open Tools for background cutout.",
  },
  {
    verb: "Clean",
    body: "Unmark removes the Gemini sparkle from every frame, cuts out the subject, or clears the background.",
  },
  {
    verb: "Download",
    body: "Get a clean export at full quality: still, MP4, or transparent PNG. Ready to share or post.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto w-full max-w-7xl border-t border-border">
      {/* Section title */}
      <div className="px-4 py-16 sm:px-6 sm:py-24 xl:px-8">
        <p className="animate-section-reveal mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          How it works
        </p>
        <h2 className="animate-section-reveal font-display font-medium text-foreground text-4xl sm:text-5xl">
          Three steps, no learning curve
        </h2>
        <p className="animate-section-reveal mt-4 max-w-md text-sm leading-relaxed text-muted">
          Built for Gemini sparkles on images and video, plus background
          removal when you need a clean cutout.
        </p>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 gap-4 px-4 pb-16 sm:grid-cols-3 sm:px-6 sm:pb-24 xl:px-8">
        {steps.map((step, idx) => (
          <div
            key={step.verb}
            className="animate-section-reveal rounded-[var(--radius-lg)] border border-border p-6"
          >
            <span className="text-xs font-semibold text-muted">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-2xl font-medium text-foreground">
              {step.verb}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
