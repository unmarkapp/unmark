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
import { SITE_ONE_LINER } from "@/lib/seo";

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
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-8 pt-8 sm:px-6">

        <section className="mx-auto mt-12 max-w-3xl text-center sm:mt-16">
          <p className="animate-rise text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Images · video · background cutout
          </p>
          <h1 className="animate-rise-delay mt-3 font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl md:leading-[1.08]">
            Unmark — Gemini watermark remover
          </h1>

          <p className="animate-rise-delay mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {SITE_ONE_LINER} Free Instant cleanup in your browser, or Cloud for
            Library, bulk jobs, and the Chrome extension.
          </p>
        </section>

        <section
          id="upload"
          className="animate-rise-delay-2 mx-auto mt-10 max-w-3xl sm:mt-12"
        >
          {children}
        </section>
      </div>

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
