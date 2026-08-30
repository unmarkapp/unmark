"use client";

export default function ClosingCta() {
  const scrollToUpload = () => {
    window.dispatchEvent(new CustomEvent("unmark:set-mode", { detail: "clean" }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      className="relative bg-background"
      style={{ borderTop: '2px solid var(--border-strong)' }}
    >
      {/* Section identifier */}
      <div
        className="px-4 py-2.5 sm:px-6 xl:px-8"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-brand">
          // INITIATE SEQUENCE
        </span>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left: copy */}
        <div
          className="flex flex-col items-start p-8 sm:p-12"
          style={{ borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        >
          <h2
            className="font-mono font-black uppercase text-foreground"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 5rem)',
              lineHeight: '0.9',
              letterSpacing: '-0.04em',
            }}
          >
            YOUR<br />
            MEDIA.<br />
            <span style={{ color: 'var(--brand)' }}>CLEAN</span><br />
            AND<br />
            READY.
          </h2>

          <div
            className="mt-7 mb-6 h-px w-full"
            style={{ background: 'var(--border-strong)' }}
          />

          <p className="max-w-md font-mono text-[10px] leading-relaxed uppercase tracking-wide text-muted">
            Drop a Gemini image or Veo video, clear the sparkle, or cut out the
            subject. Original quality, ready to post.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToUpload}
              className="inline-flex items-center justify-center gap-2 bg-brand px-6 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-brand-hover"
              style={{ border: '2px solid var(--brand)' }}
            >
              [ TRY INSTANT FREE ]
            </button>
            <a
              href="/tools/create"
              className="inline-flex items-center justify-center px-6 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-muted transition-colors hover:text-foreground"
              style={{ border: '1px solid var(--border-strong)' }}
            >
              OPEN CREATE ///
            </a>
          </div>
        </div>

        {/* Right: system specs card */}
        <div
          className="flex items-center justify-center p-8 sm:p-12"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="w-full max-w-xs"
            style={{ border: '1px solid var(--border-strong)' }}
          >
            {/* Card header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span className="font-mono text-[7px] font-bold uppercase tracking-[0.35em] text-brand">
                SYSTEM SPECS
              </span>
              <span className="font-mono text-[7px] uppercase tracking-wider text-muted">
                REV 2.6
              </span>
            </div>

            {/* Spec rows */}
            <div
              className="divide-y font-mono text-[9px]"
              style={{ borderColor: 'var(--border)' }}
            >
              {[
                { label: "MODE", value: "INSTANT + CLOUD" },
                { label: "INPUT", value: "IMAGE / VIDEO" },
                { label: "OUTPUT", value: "PNG / MP4" },
                { label: "QUALITY", value: "ORIGINAL" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3">
                  <span className="uppercase tracking-wide text-muted">{label}</span>
                  <span className="font-bold uppercase text-foreground">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-3">
                <span className="uppercase tracking-wide text-muted">STATUS</span>
                <span
                  className="flex items-center gap-1.5 font-bold uppercase"
                  style={{ color: 'var(--cobalt)' }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 animate-soft-pulse"
                    style={{ background: 'var(--cobalt)' }}
                  />
                  OPERATIONAL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
