export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload",
      body: "Drop a Gemini PNG, JPG, or WebP — ideally 16:9 or 9:16.",
    },
    {
      num: "02",
      title: "Remove",
      body: "Use Auto for the Gemini sparkle, or Manual if you need to fine-tune the box.",
    },
    {
      num: "03",
      title: "Download",
      body: "Get a clean export at full original quality, ready to share.",
    },
  ];

  return (
    <section
      id="how"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          How to remove a Gemini watermark
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Unmark targets the Gemini sparkle in the corner — a focused Gemini
          watermark remover, not a generic eraser for every logo.
        </p>
      </div>

      <ol className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
        {steps.map((step) => (
          <li key={step.num} className="text-center sm:text-left">
            <div className="font-display text-4xl font-semibold text-brand/80">
              {step.num}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
