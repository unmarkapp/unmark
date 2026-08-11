"use client";

import { ReactNode } from "react";

import ClosingCta from "@/components/ClosingCta";
import ExtensionInstall from "@/components/ExtensionInstall";
import HowItWorks from "@/components/HowItWorks";
import LandingBeforeAfter from "@/components/LandingBeforeAfter";
import LandingCompare from "@/components/LandingCompare";
import LandingFaq from "@/components/LandingFaq";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function LandingShell({
  children,
  showHow = true,
}: {
  children: ReactNode;
  showHow?: boolean;
}) {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-8 pt-5 sm:px-6">
        <SiteHeader />

        <section className="mx-auto mt-12 max-w-3xl text-center sm:mt-16">
          <h1 className="animate-rise font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl md:leading-[1.05]">
            Unmark
          </h1>
          <p className="animate-rise-delay mt-3 text-sm font-medium tracking-wide text-brand sm:text-base">
            Gemini watermark remover
          </p>

          <p className="animate-rise-delay mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Clean Gemini images instantly in your browser, or use Cloud for
            Library, bulk processing, and the Chrome extension.
          </p>
        </section>

        <section className="animate-rise-delay-2 mx-auto mt-10 max-w-3xl sm:mt-12">
          {children}
        </section>
      </div>

      {showHow ? (
        <>
          <LandingBeforeAfter />
          <LandingCompare />
          <HowItWorks />
          <ExtensionInstall />
          <LandingFaq />
          <ClosingCta />
        </>
      ) : null}
      <SiteFooter />
    </div>
  );
}
