"use client";

import CreateGenerateCard from "@/components/CreateGenerateCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function CreateGenerateTool() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6">

        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Unmark Tools
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Create with Nano Banana
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Send a prompt. Gemini draws the image with no app sparkle — no
            Ultra required. Unmark is not run on Create. Uses Create credits
            from a pack; daily free is for Clean.
            Web is locked until the generate API finishes deploying.
          </p>
        </section>

        <div className="mx-auto mt-10 max-w-xl">
          <CreateGenerateCard />
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
