"use client";

import ProductToolCard from "@/components/ProductToolCard";
import { PRODUCT_TOOLS } from "@/lib/seo";

export default function GetStartedTools() {
  return (
    <section
      id="get-started"
      data-walkthrough="tools"
      className="mx-auto w-full max-w-7xl"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Section label */}
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-6 xl:px-8"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-brand">
          // TOOLS
        </span>
        <span className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-muted sm:block">
          SELECT MODULE
        </span>
      </div>

      {/* Section title */}
      <div
        className="px-4 py-8 sm:px-6 sm:py-10 xl:px-8"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h2
            className="animate-section-reveal font-mono font-black uppercase text-foreground"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              lineHeight: '0.95',
              letterSpacing: '-0.03em',
            }}
          >
            TOOLS READY<br />TO USE
          </h2>
          <p className="animate-section-reveal max-w-md font-mono text-[10px] leading-relaxed uppercase tracking-wide text-muted">
            Pick the tool you need. Instant images are free, Cloud handles video and
            cutouts, and the Chrome extension works directly inside Gemini.
          </p>
        </div>

        <ul className="mt-8 grid gap-px sm:grid-cols-2" style={{ background: 'var(--border)' }}>
          {PRODUCT_TOOLS.map((tool) => (
            <li key={tool.id} className="animate-section-reveal bg-background">
              <ProductToolCard tool={tool} layout="grid" />
            </li>
          ))}
        </ul>

        <p className="mt-6 font-mono text-[9px] uppercase tracking-wide text-muted">
          Prefer mobile?{" "}
          <a href="/android" className="font-bold text-brand transition-colors hover:text-brand-hover">
            Android early access
          </a>
          <span className="mx-2 text-border">///</span>
          <a href="/#apps" className="font-bold text-brand transition-colors hover:text-brand-hover">
            iOS soon
          </a>
        </p>
      </div>
    </section>
  );
}
