"use client";

import { useEffect, useState } from "react";

import {
  canvaReferralUrl,
  dismissCanvaPromoPermanent,
  fetchCanvaStatus,
  isCanvaPromoDismissed,
  openInCanva,
  type CanvaPromoContext,
} from "@/lib/canva";

type CanvaPromoModalProps = {
  open: boolean;
  onClose: () => void;
  context: CanvaPromoContext;
};

export default function CanvaPromoModal({
  open,
  onClose,
  context,
}: CanvaPromoModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canvaConfigured, setCanvaConfigured] = useState(false);
  const [canvaConnected, setCanvaConnected] = useState(false);

  const isImage = context.mediaType !== "video";
  const canImport =
    isImage && Boolean(context.jobId || context.shareUrl) && canvaConfigured;

  useEffect(() => {
    if (!open) return;
    setError(null);
    setDontShowAgain(false);
    void fetchCanvaStatus().then((status) => {
      setCanvaConfigured(status.configured);
      setCanvaConnected(status.connected);
    });
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      dismissCanvaPromoPermanent();
    }
    onClose();
  };

  const handleReferral = () => {
    window.open(canvaReferralUrl(), "_blank", "noopener,noreferrer");
    handleClose();
  };

  const handleEditInCanva = async () => {
    setLoading(true);
    setError(null);
    try {
      await openInCanva(context);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not open in Canva",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="canva-promo-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-foreground"
          aria-label="Close"
        >
          ×
        </button>

        <div className="px-8 pb-8 pt-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#7d2ae8]/10 text-lg font-bold text-[#7d2ae8]">
            C
          </div>

          <h2
            id="canva-promo-title"
            className="mt-5 font-display text-2xl font-semibold tracking-tight text-foreground"
          >
            Your image is clean.
            <br />
            Ready to design?
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-strong">
            Resize for Instagram, add text, or expand the background in Canva —
            like Pexels after a free download.
          </p>

          {error ? (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3">
            {canImport ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => void handleEditInCanva()}
                className="w-full rounded-full bg-[#7d2ae8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6b22c9] disabled:opacity-60"
              >
                {loading
                  ? "Opening Canva…"
                  : canvaConnected
                    ? "Edit in Canva"
                    : "Connect Canva & edit"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleReferral}
              className={`w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                canImport
                  ? "border border-border bg-white text-foreground hover:bg-cream/80"
                  : "bg-[#7d2ae8] text-white hover:bg-[#6b22c9]"
              }`}
            >
              {canImport ? "Open Canva (free)" : "Get started in Canva — free"}
            </button>
          </div>

          {!isImage ? (
            <p className="mt-4 text-xs text-muted">
              Video editing in Canva is not supported yet — use the free Canva
              link to start a new design.
            </p>
          ) : null}

          <label className="mt-6 flex cursor-pointer items-center justify-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
              className="rounded border-border"
            />
            Don&apos;t show again
          </label>
        </div>
      </div>
    </div>
  );
}

export function shouldShowCanvaPromo(): boolean {
  return !isCanvaPromoDismissed();
}

export type { CanvaPromoContext };
