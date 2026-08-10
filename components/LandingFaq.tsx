"use client";

import { useId, useState } from "react";

import { FAQ_ITEMS } from "@/lib/seo";

export default function LandingFaq() {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Gemini watermark FAQ
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Short answers to how people remove the Gemini sparkle stamp from
          images.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl divide-y divide-border">
        {FAQ_ITEMS.map((item, index) => {
          const panelId = `${baseId}-panel-${index}`;
          const isOpen = open === index;
          return (
            <div key={item.question} className="py-4">
              <h3>
                <button
                  type="button"
                  id={`${baseId}-btn-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-start justify-between gap-4 text-left text-base font-semibold text-foreground transition hover:text-brand"
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 font-display text-xl text-brand"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              {isOpen ? (
                <p
                  id={panelId}
                  role="region"
                  aria-labelledby={`${baseId}-btn-${index}`}
                  className="mt-3 pr-8 text-sm leading-relaxed text-muted-strong"
                >
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
