"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "unmark_ad_advisory_v1";

export default function AdAdvisoryBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (e.g. private mode with strict settings) — skip
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div
      role="alertdialog"
      aria-label="Advertising notice"
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 bg-background"
      style={{ borderColor: 'var(--border-strong)' }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
        {/* Icon + text */}
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 shrink-0 font-mono text-[10px] font-bold"
            style={{ color: 'var(--brand)' }}
            aria-hidden
          >
            [!]
          </span>
          <p className="font-mono text-[10px] leading-relaxed text-muted max-w-2xl">
            This site shows <strong className="text-foreground font-bold">third-party popunder ads</strong> (Hilltop Ads, AdCash) that may include adult content (18+). Ads are not controlled by Unmark.{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 transition-colors hover:text-foreground"
              onClick={dismiss}
            >
              Privacy policy
            </Link>
          </p>
        </div>

        {/* Dismiss */}
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 border px-4 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:border-foreground hover:text-foreground"
          style={{ borderColor: 'var(--border-strong)' }}
          aria-label="Dismiss advertising notice"
        >
          [ OK, GOT IT ]
        </button>
      </div>
    </div>
  );
}
