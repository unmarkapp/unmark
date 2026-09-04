"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Check } from "@phosphor-icons/react/dist/ssr";

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
          <section id="upload" className="relative mx-auto w-full max-w-7xl border-b border-border">
            <div className="grid w-full grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px]">
              {/* Left column: hero copy */}
              <div className="flex flex-col justify-center gap-7 p-6 sm:p-8 xl:p-16">
                <p className="animate-rise text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {isCreate ? "AI image generation" : "Gemini watermark removal"}
                </p>

                <h1
                  className="animate-rise font-display font-medium text-foreground"
                  style={{ fontSize: "clamp(2.5rem, 5vw, 4.25rem)" }}
                >
                  {isCreate ? (
                    <>
                      Generate images{" "}
                      <em className="not-italic text-muted">without</em> the
                      sparkle
                    </>
                  ) : (
                    <>
                      Remove the Gemini watermark,{" "}
                      <em className="not-italic text-muted">in seconds</em>
                    </>
                  )}
                </h1>

                <p className="animate-rise-delay max-w-md text-base leading-relaxed text-muted">
                  {isCreate
                    ? "Prompt Nano Banana and get a clean generation — attach a reference photo, choose a model, no sparkle to remove afterward."
                    : "Instant runs free in your browser — the file never leaves your device. Cloud handles video, Library, and the extension."}
                </p>

                <ul className="animate-rise-delay-2 flex flex-col gap-3">
                  {(isCreate
                    ? [
                        "No Gemini sparkle",
                        "Attach a reference photo",
                        "Multiple models",
                      ]
                    : [
                        "Free Instant for images",
                        "No account required",
                        "Original quality download",
                      ]
                  ).map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-foreground"
                    >
                      <Check size={16} weight="bold" className="shrink-0 text-muted" />
                      {item}
                    </li>
                  ))}
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
