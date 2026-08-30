"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

import AppsSection from "@/components/AppsSection";
import ClosingCta from "@/components/ClosingCta";
import ExtensionInstall from "@/components/ExtensionInstall";
import GetStartedTools from "@/components/GetStartedTools";
import HowItWorks from "@/components/HowItWorks";
import LandingBeforeAfter from "@/components/LandingBeforeAfter";
import LandingCompare from "@/components/LandingCompare";
import LandingFaq from "@/components/LandingFaq";
import LandingSeoContent from "@/components/LandingSeoContent";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const ProductTour = dynamic(() => import("@/components/ProductTour"), {
  ssr: false,
  loading: () => (
    <section
      id="tour"
      className="mx-auto w-full max-w-7xl"
      style={{ borderTop: '1px solid var(--border)', minHeight: '5rem' }}
      aria-hidden
    />
  ),
});

export default function LandingShell({
  children,
  showHow = true,
  mode = "clean",
}: {
  children: ReactNode;
  showHow?: boolean;
  mode?: "clean" | "create";
}) {
  const isCreate = mode === "create";

  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />
      <main>
        {showHow ? (
          /* HERO: asymmetric grid — copy left, tool right */
          <section
            id="upload"
            className="relative mx-auto w-full max-w-7xl"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <div
              className="grid w-full grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px]"
            >
              {/* Left column: hero copy */}
              <div
                className="flex flex-col justify-between p-6 sm:p-8 xl:p-12"
                style={{ borderRight: '1px solid var(--border)' }}
              >
                {/* Top: system identifier */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-brand">
                    {isCreate ? "// GENERATE SYSTEM" : "// WATERMARK REMOVAL SYSTEM"}
                  </span>
                </div>

                {/* Main headline */}
                <div className="flex-1 flex flex-col justify-center py-6">
                  <h1
                    className="animate-rise font-mono font-black uppercase text-foreground"
                    style={{
                      fontSize: 'clamp(3rem, 7vw, 9rem)',
                      lineHeight: '0.9',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {isCreate ? (
                      <>
                        GENERATE<br />
                        <span style={{ color: 'var(--brand)' }}>WITHOUT</span><br />
                        SPARKLE
                      </>
                    ) : (
                      <>
                        WATER<br />
                        <span style={{ color: 'var(--brand)' }}>MARK</span><br />
                        ELIM<br />
                        INATION
                      </>
                    )}
                  </h1>

                  {/* Divider */}
                  <div
                    className="mt-6 mb-5 h-px"
                    style={{ background: 'var(--border-strong)' }}
                  />

                  {/* Telemetry readout */}
                  <div className="animate-rise-delay flex flex-col gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                    {isCreate ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'var(--brand)' }}>›</span>
                          <span>MODEL: NANO BANANA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'var(--brand)' }}>›</span>
                          <span>REFERENCE PHOTO: SUPPORTED</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'var(--brand)' }}>›</span>
                          <span>OUTPUT: CLEAN GENERATION</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'var(--brand)' }}>›</span>
                          <span>ENGINE: INSTANT + CLOUD</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'var(--brand)' }}>›</span>
                          <span>MODEL: GEMINI SPARKLE DETECTOR</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'var(--brand)' }}>›</span>
                          <span>ACCESS: FREE — NO ACCOUNT NEEDED</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom: feature list */}
                <ul
                  className="animate-rise-delay-2 flex flex-col gap-1.5 pt-5"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  {isCreate ? (
                    <>
                      <li className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                        <span
                          className="h-px w-5 shrink-0"
                          style={{ background: 'var(--border-strong)' }}
                        />
                        No Gemini sparkle
                      </li>
                      <li className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                        <span
                          className="h-px w-5 shrink-0"
                          style={{ background: 'var(--border-strong)' }}
                        />
                        Attach a reference photo
                      </li>
                      <li className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                        <span
                          className="h-px w-5 shrink-0"
                          style={{ background: 'var(--border-strong)' }}
                        />
                        Multiple models
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                        <span
                          className="h-px w-5 shrink-0"
                          style={{ background: 'var(--brand)' }}
                        />
                        Free Instant for images
                      </li>
                      <li className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                        <span
                          className="h-px w-5 shrink-0"
                          style={{ background: 'var(--border-strong)' }}
                        />
                        No account required
                      </li>
                      <li className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                        <span
                          className="h-px w-5 shrink-0"
                          style={{ background: 'var(--border-strong)' }}
                        />
                        Original quality download
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Right column: upload tool (injected by caller) */}
              <div className="animate-rise-delay-2 w-full p-4 sm:p-6">
                {children}
              </div>
            </div>
          </section>
        ) : (
          /* Tool active state: no hero, just the card */
          <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
            {children}
          </div>
        )}

        {showHow ? (
          <>
            <GetStartedTools />
            <LandingBeforeAfter />
            <LandingCompare />
            <HowItWorks />
            <ProductTour />
            <ExtensionInstall />
            <AppsSection />
            <LandingSeoContent />
            <LandingFaq />
            <ClosingCta />
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
