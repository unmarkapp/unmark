"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

import { useAuth } from "@/lib/auth";
import {
  completeWalkthrough,
  resetWalkthrough,
  shouldForceWalkthrough,
} from "@/lib/walkthrough";

type Step = {
  id: string;
  title: string;
  body: string;
  target?: string;
};

const PAD = 8;

export default function Walkthrough() {
  const { user, loading } = useAuth();
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const steps: Step[] = useMemo(() => {
    const account: Step = user
      ? {
          id: "account",
          target: "[data-walkthrough=account]",
          title: "Credits and Library",
          body: "Cloud jobs, video, and Library use credits. Your balance is here — Instant image cleanup stays free.",
        }
      : {
          id: "account",
          target: "[data-walkthrough=account]",
          title: "Sign in for Cloud",
          body: "Instant stills need no account. Sign in with Google when you want video, Library, or bulk.",
        };

    return [
      {
        id: "welcome",
        title: "Welcome to Unmark",
        body: "Four quick steps: drop a Gemini file, try a sample, then Cloud and the rest of the tools if you need them.",
      },
      {
        id: "drop",
        target: "[data-walkthrough=drop]",
        title: "Drop a file",
        body: "Images and short videos go here. Instant cleans a still in your browser — no sign-in.",
      },
      {
        id: "sample",
        target: "[data-walkthrough=sample]",
        title: "Or try a sample",
        body: "No file handy? The sample Gemini still has a sparkle in the corner. One tap shows the result.",
      },
      account,
      {
        id: "tools",
        target: "[data-walkthrough=tools]",
        title: "More tools",
        body: "Cutouts, the Chrome extension, and video live further down the page. Skip anytime — this guide will not show again.",
      },
    ];
  }, [user]);

  const step = stepIndex === null ? null : steps[stepIndex];
  const isLast = stepIndex !== null && stepIndex === steps.length - 1;

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector<HTMLElement>(step.target);
    if (!el) {
      setRect(null);
      return;
    }
    setRect(el.getBoundingClientRect());
  }, [step]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (loading) return;
    const force = shouldForceWalkthrough();
    if (!force) return;
    resetWalkthrough();
    const timer = window.setTimeout(() => setStepIndex(0), 650);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!step) return;
    const el = step.target
      ? document.querySelector<HTMLElement>(step.target)
      : null;
    el?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    const timer = window.setTimeout(measure, 320);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step, measure]);

  const finish = useCallback(() => {
    completeWalkthrough();
    setStepIndex(null);
    if (shouldForceWalkthrough()) {
      const url = new URL(window.location.href);
      url.searchParams.delete("guide");
      window.history.replaceState({}, "", url.pathname + url.hash);
    }
  }, []);

  const next = () => {
    if (stepIndex === null) return;
    if (isLast) {
      finish();
      return;
    }
    setStepIndex(stepIndex + 1);
  };

  const back = () => {
    if (stepIndex === null || stepIndex === 0) return;
    setStepIndex(stepIndex - 1);
  };

  useEffect(() => {
    if (stepIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        next();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // next/back close over stepIndex; rebind each step.
  });

  if (!mounted || stepIndex === null || !step) return null;

  const highlight = rect
    ? {
        top: Math.max(8, rect.top - PAD),
        left: Math.max(8, rect.left - PAD),
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
      }
    : null;

  const tooltipStyle = tooltipPosition(highlight);

  return createPortal(
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="walkthrough-title">
      <div className="absolute inset-0 bg-ink/55" onClick={finish} />

      {highlight ? (
        <div
          aria-hidden
          className="pointer-events-none absolute border-2 border-peach bg-transparent"
          style={{
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
          }}
        />
      ) : null}

      <div
        className="absolute z-[81] w-[min(calc(100vw-2rem),22rem)] border-2 border-ink bg-surface p-5 shadow-[6px_6px_0_0_var(--ink)]"
        style={tooltipStyle}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          {stepIndex + 1} / {steps.length}
        </p>
        <h2
          id="walkthrough-title"
          className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground"
        >
          {step.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-strong">{step.body}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={finish}
            className="min-h-11 min-w-11 px-3 text-sm font-medium text-muted transition hover:text-foreground"
          >
            Skip
          </button>
          <div className="flex items-center gap-2">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={back}
                className="min-h-11 border-2 border-ink bg-surface px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground transition hover:bg-cream"
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              onClick={next}
              className="min-h-11 border-2 border-ink bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
            >
              {isLast ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function tooltipPosition(highlight: {
  top: number;
  left: number;
  width: number;
  height: number;
} | null): CSSProperties {
  const width = Math.min(window.innerWidth - 32, 352);
  if (!highlight) {
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width,
    };
  }

  const spaceBelow = window.innerHeight - (highlight.top + highlight.height);
  const placeBelow = spaceBelow > 220 || highlight.top < 180;
  const left = Math.min(
    Math.max(16, highlight.left),
    window.innerWidth - width - 16,
  );

  if (placeBelow) {
    return {
      top: highlight.top + highlight.height + 14,
      left,
      width,
    };
  }

  return {
    top: highlight.top - 14,
    left,
    width,
    transform: "translateY(-100%)",
  };
}
