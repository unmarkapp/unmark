"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCredits } from "@/lib/credits";
import { loadHilltopWatchAd } from "@/lib/hilltopAds";

const COUNTDOWN_SECONDS = 10;
const DAILY_LIMIT = 3;
const AD_ENGAGED_MESSAGE = "unmark-ad-engaged";
const AD_FILLED_MESSAGE = "unmark-ad-filled";
const AD_EMPTY_MESSAGE = "unmark-ad-empty";
const AD_FILL_TIMEOUT_MS = 5000;

export type WatchAdReward = "credit" | "instant";

interface WatchAdModalProps {
  usedToday: number;
  reward: WatchAdReward;
  onGranted: () => void;
  onClose: () => void;
  onAdsUnavailable?: () => void;
}

function Modal({
  usedToday,
  reward,
  onGranted,
  onClose,
  onAdsUnavailable,
}: WatchAdModalProps) {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adClicked, setAdClicked] = useState(false);
  const [adUnavailable, setAdUnavailable] = useState(false);
  const [frameSrc] = useState(() => `/watch-ad-frame?t=${Date.now()}`);
  const ignoreIframeBlurRef = useRef(false);
  const adFilledRef = useRef(false);
  const { refreshCredits } = useCredits();

  useEffect(() => {
    loadHilltopWatchAd();
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const inModal = target.closest("[data-unmark-watch-ad]");
      ignoreIframeBlurRef.current = Boolean(inModal && target.tagName !== "IFRAME");
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const type = event.data?.type;
      if (type === AD_FILLED_MESSAGE) {
        adFilledRef.current = true;
        return;
      }
      if (type === AD_EMPTY_MESSAGE) {
        if (!adFilledRef.current && reward === "instant") setAdUnavailable(true);
        return;
      }
      if (type !== AD_ENGAGED_MESSAGE) return;
      if (event.data?.via === "blur" && ignoreIframeBlurRef.current) return;
      setAdClicked(true);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-unmark-watch-ad]")) return;
      setAdClicked(true);
    };
    window.addEventListener("message", onMessage);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [reward]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  useEffect(() => {
    if (reward !== "instant") return;
    const t = window.setTimeout(() => {
      if (!adFilledRef.current) setAdUnavailable(true);
    }, AD_FILL_TIMEOUT_MS);
    return () => window.clearTimeout(t);
  }, [reward]);

  useEffect(() => {
    if (!adUnavailable) return;
    onAdsUnavailable?.();
  }, [adUnavailable, onAdsUnavailable]);

  const instantUnlocked = reward === "instant" && adUnavailable;
  const canClaim =
    instantUnlocked || (adClicked && seconds <= 0);

  const handleClaim = async () => {
    if (!canClaim) return;
    setClaiming(true);
    setError(null);
    try {
      if (reward === "instant") {
        setClaimed(true);
        setTimeout(() => {
          onGranted();
          onClose();
        }, 400);
        return;
      }
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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-[8vh] pb-28"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-background shadow-2xl" data-unmark-watch-ad>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {reward === "instant"
                ? "Watch ad · Instant cleanup"
                : "Watch ad · get 1 free clean"}
            </p>
            {reward === "credit" ? (
              <p className="mt-0.5 text-xs text-muted">
                {remaining} of {DAILY_LIMIT} remaining today
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-muted">
                {instantUnlocked
                  ? "No ad loaded — Instant still works"
                  : "Runs in your browser after the ad"}
              </p>
            )}
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

        <div className="bg-sand">
          <iframe
            src={frameSrc}
            title="Advertisement"
            className="block h-[280px] w-full border-0 bg-ink"
            referrerPolicy="no-referrer-when-downgrade"
            allow="autoplay; fullscreen"
            onError={() => {
              if (reward === "instant") setAdUnavailable(true);
            }}
          />
        </div>

        <div className="space-y-3 px-5 py-4">
          {claimed ? (
            <p className="text-center text-sm font-semibold text-brand">
              {reward === "instant" ? "Starting Instant…" : "+1 credit added ✓"}
            </p>
          ) : error ? (
            <p className="text-center text-sm text-danger">{error}</p>
          ) : null}

          {!claimed && (
            <button
              type="button"
              onClick={() => void handleClaim()}
              disabled={!canClaim || claiming || claimed}
              className="w-full rounded-[var(--radius-md)] bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {claiming
                ? "Claiming…"
                : instantUnlocked
                  ? "Start Instant cleanup"
                  : seconds > 0
                    ? `Wait ${seconds}s…`
                    : !adClicked
                      ? "Click an ad to continue"
                      : reward === "instant"
                        ? "Start Instant cleanup"
                        : "Claim 1 free credit"}
            </button>
          )}

          <p className="text-center text-[11px] text-muted">
            {instantUnlocked
              ? "No ad was available. You can continue Instant now."
              : reward === "instant"
                ? "Click an ad, then Instant runs on this device."
                : "Click an ad, then claim your free credit."}
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
  onAdsUnavailable?: () => void;
  reward?: WatchAdReward;
  open?: boolean;
  onClose?: () => void;
  showTrigger?: boolean;
}

export default function WatchAdForCredit({
  usedToday = 0,
  onGranted,
  onAdsUnavailable,
  reward = "credit",
  open: openProp,
  onClose,
  showTrigger = true,
}: WatchAdForCreditProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { refreshCredits } = useCredits();
  const open = openProp ?? internalOpen;

  const close = () => {
    setInternalOpen(false);
    onClose?.();
  };

  if (reward === "credit" && usedToday >= DAILY_LIMIT && showTrigger) {
    return (
      <p className="text-xs text-muted">
        Ad credits used for today ({DAILY_LIMIT}/{DAILY_LIMIT}). Resets at midnight UTC.
      </p>
    );
  }

  return (
    <>
      {showTrigger ? (
        <button
          type="button"
          onClick={() => {
            loadHilltopWatchAd();
            setInternalOpen(true);
          }}
          className="text-sm font-medium text-brand transition hover:underline"
        >
          Watch a short ad for 1 free clean
        </button>
      ) : null}
      {open && (
        <Modal
          usedToday={usedToday}
          reward={reward}
          onGranted={() => {
            if (reward === "credit") void refreshCredits();
            onGranted?.();
          }}
          onAdsUnavailable={onAdsUnavailable}
          onClose={close}
        />
      )}
    </>
  );
}
