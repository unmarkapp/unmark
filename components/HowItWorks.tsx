const steps = [
  {
    verb: "Drop",
    body: "Drop a Gemini image, a Veo or Flow video, or open Tools for background cutout.",
    color: "bg-foreground text-background",
  },
  {
    verb: "Clean",
    body: "Unmark removes the Gemini sparkle from every frame, cuts out the subject, or clears the background.",
    color: "bg-brand text-white",
  },
  {
    verb: "Download",
    body: "Get a clean export at full quality: still, MP4, or transparent PNG. Ready to share or post.",
    color: "bg-peach text-ink",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h2 className="animate-section-reveal font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl lg:max-w-xs">
          How Unmark works
        </h2>
        <p className="animate-section-reveal max-w-md text-base leading-relaxed text-muted">
          Built for Gemini sparkles on images and video, plus background removal
          when you need a clean cutout.
        </p>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.verb}
            className="animate-section-reveal flex flex-col gap-4 bg-surface px-6 py-7"
          >
            <div
              className={`inline-flex h-10 w-auto items-center rounded-[var(--radius-md)] px-3.5 font-display text-sm font-semibold ${step.color}`}
            >
              {step.verb}
            </div>
            <p className="text-sm leading-relaxed text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
