export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload",
      body: "Drop a Gemini image, a Veo/Flow video, or open Tools for background cutout.",
    },
    {
      num: "02",
      title: "Clean",
      body: "Remove the Gemini sparkle with Auto, process video on Cloud, or cut out the subject.",
    },
    {
      num: "03",
      title: "Download",
      body: "Get a clean export at full quality — stills, MP4, or transparent PNG — ready to share.",
    },
  ];

  return (
    <section
      id="how"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          How Unmark works
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Built for Gemini sparkles on images and video — plus background
          removal when you need a clean cutout.
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
