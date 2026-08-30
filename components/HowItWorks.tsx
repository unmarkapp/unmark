const steps = [
  {
    id: "MOD-01",
    verb: "DROP",
    indicator: "INPUT",
    body: "Drop a Gemini image, a Veo or Flow video, or open Tools for background cutout.",
    accentTop: false,
  },
  {
    id: "MOD-02",
    verb: "CLEAN",
    indicator: "PROCESSING",
    body: "Unmark removes the Gemini sparkle from every frame, cuts out the subject, or clears the background.",
    accentTop: true,
  },
  {
    id: "MOD-03",
    verb: "DOWNLOAD",
    indicator: "OUTPUT",
    body: "Get a clean export at full quality: still, MP4, or transparent PNG. Ready to share or post.",
    accentTop: false,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      className="mx-auto w-full max-w-7xl"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Section label row */}
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-6 xl:px-8"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-brand">
          // OPERATIONAL SEQUENCE
        </span>
        <p className="hidden font-mono text-[8px] uppercase tracking-wide text-muted lg:block">
          GEMINI SPARKLE /// IMAGE + VIDEO
        </p>
      </div>

      {/* Section title */}
      <div
        className="px-4 py-8 sm:px-6 sm:py-10 xl:px-8"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h2 className="animate-section-reveal font-mono font-black uppercase text-foreground"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            lineHeight: '0.95',
            letterSpacing: '-0.03em',
          }}>
          HOW UNMARK<br />
          <span style={{ color: 'var(--brand)' }}>WORKS</span>
        </h2>
        <p className="animate-section-reveal mt-4 max-w-md font-mono text-[10px] uppercase tracking-wide text-muted">
          Built for Gemini sparkles on images and video, plus background removal
          when you need a clean cutout.
        </p>
      </div>

      {/* Steps grid — 1px gap creates razor-thin dividers */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3"
        style={{ background: 'var(--border)', gap: '1px' }}
      >
        {steps.map((step, idx) => (
          <div
            key={step.verb}
            className="animate-section-reveal flex flex-col bg-background"
          >
            {/* Module header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="font-mono text-[7px] font-bold uppercase tracking-[0.35em] text-muted">
                {step.id}
              </span>
              <span
                className="font-mono text-[7px] font-bold uppercase tracking-[0.25em]"
                style={{ color: step.accentTop ? 'var(--brand)' : 'var(--muted)' }}
              >
                {step.indicator}
              </span>
            </div>

            {/* Module content */}
            <div className="flex flex-1 flex-col gap-5 px-5 py-6">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[9px] font-bold text-muted/40 uppercase">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-mono font-black uppercase text-foreground"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                    lineHeight: '1',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step.verb}
                </h3>
              </div>
              <p className="font-mono text-[10px] leading-relaxed text-muted">
                {step.body}
              </p>
            </div>

            {/* Bottom accent line */}
            <div
              className="h-0.5"
              style={{ background: step.accentTop ? 'var(--brand)' : 'var(--border-strong)' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
