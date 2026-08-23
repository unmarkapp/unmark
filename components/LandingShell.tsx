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
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
      aria-hidden
    />
  ),
});

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M2.5 7.5 5.5 10.5l6-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LandingShell({
  children,
  showHow = true,
}: {
  children: ReactNode;
  showHow?: boolean;
}) {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />
      <main>
        {showHow ? (
          /* HERO: asymmetric split - text left, tool right */
          <section
            id="upload"
            className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pt-16 xl:px-8 lg:flex lg:min-h-[calc(100dvh-68px)] lg:items-center"
          >
            <div className="grid w-full gap-10 lg:grid-cols-[1fr_480px] lg:gap-14 xl:grid-cols-[1fr_520px] xl:gap-20">
              {/* Left column: hero copy */}
              <div className="flex flex-col justify-center">
                <h1 className="animate-rise font-display text-4xl font-semibold tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
                  Remove Gemini watermarks
                </h1>

                <p className="animate-rise-delay mt-5 max-w-[46ch] text-base leading-relaxed text-muted sm:text-lg">
                  Unmark cleans the Gemini sparkle from images and video, or cuts
                  out subjects. Free Instant in your browser, no account needed.
                </p>

                <ul className="animate-rise-delay-2 mt-7 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                  <li className="flex items-center gap-1.5">
                    <CheckIcon />
                    Free Instant for images
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckIcon />
                    No account required
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckIcon />
                    Original quality download
                  </li>
                </ul>
              </div>

              {/* Right column: upload tool (injected by LandingUpload) */}
              <div className="animate-rise-delay-2 w-full">
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
