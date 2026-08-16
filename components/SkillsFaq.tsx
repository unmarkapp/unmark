"use client";

import { useId, useState } from "react";

export type FaqItem = { question: string; answer: string };

export default function SkillsFaq({ items }: { items: readonly FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto mt-12 max-w-2xl divide-y divide-border">
      {items.map((item, index) => {
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
  );
}
