"use client";

import { useEffect, useState } from "react";

import { CanvaPoweredBy, CanvaWordmark } from "@/components/CanvaBrand";
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
  const previewUrl =
    context.shareUrl ||
    (context.jobId ? `/s/${context.jobId}` : undefined);

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
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0D1216]/55 p-4 backdrop-blur-[2px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="canva-promo-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(13,18,22,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="relative px-6 pb-5 pt-6 text-center"
          style={{
            background:
              "linear-gradient(135deg, #7D2AE8 0%, #8B3DFF 42%, #00C4CC 100%)",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg leading-none text-white transition hover:bg-white/25"
            aria-label="Close"
          >
            ×
          </button>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
            Works with Canva
          </p>
          <div className="mt-3 flex justify-center rounded-xl bg-white px-4 py-2.5 shadow-sm">
            <CanvaWordmark className="h-8 w-auto" />
          </div>
        </div>

        <div className="px-6 pb-6 pt-5">
          {isImage && previewUrl ? (
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border border-[#E8E8E8] bg-[#F4F4F6] shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : null}

          <h2
            id="canva-promo-title"
            className="text-center text-[22px] font-semibold leading-tight tracking-tight text-[#0D1216]"
          >
            {isImage ? "Continue in Canva" : "Design in Canva"}
          </h2>

          <p className="mt-2 text-center text-sm leading-relaxed text-[#6B7280]">
            {isImage
              ? "Open your cleaned image in Canva to resize, add text, or build social posts."
              : "Start a new design in Canva — video import is not supported yet."}
          </p>

          {error ? (
            <p className="mt-4 rounded-lg bg-[#FEF2F2] px-3 py-2 text-center text-sm text-[#B42318]">
              {error}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-2.5">
            {canImport ? (
              <button
                type="button"
                disabled={loading}
                onClick={() => void handleEditInCanva()}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#7D2AE8] px-4 text-sm font-semibold text-white transition hover:bg-[#6B24D4] disabled:opacity-60"
              >
                {loading ? (
                  "Opening Canva…"
                ) : canvaConnected ? (
                  "Edit in Canva"
                ) : (
                  "Connect Canva & edit"
                )}
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleReferral}
              className={`h-11 w-full rounded-lg px-4 text-sm font-semibold transition ${
                canImport
                  ? "border border-[#E8E8E8] bg-white text-[#0D1216] hover:bg-[#F9FAFB]"
                  : "bg-[#7D2AE8] text-white hover:bg-[#6B24D4]"
              }`}
            >
              {canImport ? "Create free account" : "Get started — it’s free"}
            </button>
          </div>

          <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 text-xs text-[#6B7280]">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
              className="rounded border-[#D1D5DB] text-[#7D2AE8] focus:ring-[#7D2AE8]"
            />
            Don&apos;t show again
          </label>

          <CanvaPoweredBy className="mt-4" />
        </div>
      </div>
    </div>
  );
}

export function shouldShowCanvaPromo(): boolean {
  return !isCanvaPromoDismissed();
}

export type { CanvaPromoContext };
