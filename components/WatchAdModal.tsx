"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCredits } from "@/lib/credits";

// Replace with your AdSense Display ad unit slot ID from adsense.google.com
const AD_CLIENT = "ca-pub-3904291439301971";
const AD_SLOT = "2108255139"; // TODO: paste your display ad slot ID here

const COUNTDOWN_SECONDS = 10;
const DAILY_LIMIT = 3;

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface WatchAdModalProps {
  usedToday: number;
  onGranted: () => void;
  onClose: () => void;
}

function Modal({ usedToday, onGranted, onClose }: WatchAdModalProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshCredits } = useCredits();

  // Push AdSense ad after mount
  useEffect(() => {
    if (!AD_SLOT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not loaded yet — ignore
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleClaim = async () => {
    setClaiming(true);
    setError(null);
    try {
      const res = await fetch("/api/ad-reward", {
        method: "POST",
        credentials: "include",
      });
      if (res.status === 429) {
        setError(`You've used all ${DAILY_LIMIT} ad credits today. Come back tomorrow.`);
        return;
      }
      if (!res.ok) throw new Error("Failed");
      await refreshCredits();
      setClaimed(true);
      setTimeout(() => {
        onGranted();
        onClose();
      }, 1200);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setClaiming(false);
    }
  };

  const remaining = DAILY_LIMIT - usedToday;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-background shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Watch ad · get 1 free clean</p>
            <p className="text-xs text-muted mt-0.5">{remaining} of {DAILY_LIMIT} remaining today</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-sand hover:text-foreground"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Ad slot */}
        <div className="bg-sand px-5 py-4 min-h-[160px] flex items-center justify-center">
          {AD_SLOT ? (
            <ins
              ref={adRef}
              className="adsbygoogle block w-full"
              style={{ display: "block", minHeight: "120px" }}
              data-ad-client={AD_CLIENT}
              data-ad-slot={AD_SLOT}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center text-muted">
              <div className="h-16 w-16 rounded-[var(--radius-md)] border-2 border-dashed border-border flex items-center justify-center text-2xl">
                📢
              </div>
              <p className="text-xs font-medium">Ad slot not configured yet</p>
              <p className="text-[11px]">Add your AdSense slot ID to WatchAdModal.tsx</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 space-y-3">
          {claimed ? (
            <p className="text-center text-sm font-semibold text-brand">
              +1 credit added ✓
            </p>
          ) : error ? (
            <p className="text-center text-sm text-danger">{error}</p>
          ) : null}

          {!claimed && (
            <button
              type="button"
              onClick={() => void handleClaim()}
              disabled={seconds > 0 || claiming || claimed}
              className="w-full rounded-[var(--radius-md)] bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {seconds > 0
                ? `Wait ${seconds}s…`
                : claiming
                  ? "Claiming…"
                  : "Claim 1 free credit"}
            </button>
          )}

          <p className="text-center text-[11px] text-muted">
            Watching the ad supports Unmark and keeps Instant free.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface WatchAdForCreditProps {
  usedToday?: number;
  onGranted?: () => void;
}

export default function WatchAdForCredit({ usedToday = 0, onGranted }: WatchAdForCreditProps) {
  const [open, setOpen] = useState(false);
  const { refreshCredits } = useCredits();

  if (usedToday >= DAILY_LIMIT) {
    return (
      <p className="text-xs text-muted">
        Ad credits used for today ({DAILY_LIMIT}/{DAILY_LIMIT}). Resets at midnight UTC.
      </p>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-brand transition hover:underline"
      >
        Watch a short ad for 1 free clean
      </button>
      {open && (
        <Modal
          usedToday={usedToday}
          onGranted={() => {
            void refreshCredits();
            onGranted?.();
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
