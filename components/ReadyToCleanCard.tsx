"use client";

import { useState } from "react";
import FeedbackButtons from "@/components/FeedbackButtons";
import ImageEditor from "@/components/ImageEditor";
import WatchAdForCredit from "@/components/WatchAdModal";
import { useCredits } from "@/lib/credits";

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CleanEngine = "instant" | "cloud";

interface ReadyToCleanCardProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  fileName: string;
  fileSize: number;
  isSample?: boolean;
  processing: boolean;
  hasSelection: boolean;
  detectMode: "auto" | "manual";
  onDetectModeChange: (mode: "auto" | "manual") => void;
  engine: CleanEngine;
  onEngineChange: (engine: CleanEngine) => void;
  isAuthenticated?: boolean;
  hasCredits?: boolean;
  statusLabel?: string | null;
  error?: string | null;
  resultUrl?: string | null;
  jobId?: string | null;
  onSelectionChange: (selection: Selection | null) => void;
  onRemove: () => void;
  onReset: () => void;
  onDownloadComplete?: () => void;
  onUseInCreate?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionFromName(name: string): string {
  const match = /\.[a-z0-9]+$/i.exec(name);
  return match?.[0] || ".png";
}

async function downloadImage(url: string, fileName: string) {
  const safeName = fileName.replace(/[^\w.\-]+/g, "_");
  const downloadName = safeName.includes(".")
    ? safeName
    : `${safeName}${extensionFromName(fileName) || ".png"}`;

  let objectUrl = url;
  let shouldRevoke = false;

  if (!url.startsWith("blob:")) {
    const proxy = `/api/download-result?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(downloadName)}`;
    const response = await fetch(proxy);
    if (!response.ok) {
      throw new Error("Failed to fetch image for download");
    }
    const blob = await response.blob();
    objectUrl = URL.createObjectURL(blob);
    shouldRevoke = true;
  }

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = downloadName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  if (shouldRevoke) {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function ReadyToCleanCard({
  imageUrl,
  imageWidth,
  imageHeight,
  fileName,
  fileSize,
  isSample = false,
  processing,
  hasSelection,
  detectMode,
  onDetectModeChange,
  engine,
  onEngineChange,
  isAuthenticated = false,
  hasCredits = true,
  statusLabel,
  error,
  resultUrl,
  jobId,
  onSelectionChange,
  onRemove,
  onReset,
  onDownloadComplete,
  onUseInCreate,
}: ReadyToCleanCardProps) {
  const { dailyFreeCredits, paymentsEnabled, refreshCredits } = useCredits();
  const [instantAdOpen, setInstantAdOpen] = useState(false);
  const [skipInstantAd, setSkipInstantAd] = useState(false);
  const canSubmit = detectMode === "auto" || hasSelection;
  const needsAuth = engine === "cloud";
  const blockedByAuth = needsAuth && !isAuthenticated;
  const blockedByCredits = needsAuth && isAuthenticated && !hasCredits;
  const instantNeedsAd = engine === "instant" && !isSample && !skipInstantAd;

  const requestRemove = () => {
    if (instantNeedsAd) {
      setInstantAdOpen(true);
      return;
    }
    onRemove();
  };

  if (processing && !resultUrl) {
    return (
      <div className="unmark-glass p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative mx-auto w-full max-w-[240px] shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-ink sm:mx-0">
            <img
              src={imageUrl}
              alt="Processing"
              className="block h-auto w-full object-contain"
            />

            <div className="absolute inset-0 bg-[var(--overlay)]" />
            <div className="watermark-scan-line" />

            <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-[0_4px_14px_-4px_rgb(var(--shadow-color)/0.5)]">
                <span className="h-2 w-2 rounded-full bg-peach" />
                {engine === "instant"
                  ? "Cleaning in your browser…"
                  : "Saving to your Library…"}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 py-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Processing
            </div>

            <h2 className="mt-3 font-display text-xl font-semibold tracking-[-0.01em] text-foreground sm:text-2xl">
              {engine === "instant"
                ? "Instant cleanup…"
                : "Cloud cleanup…"}
            </h2>

            <p className="mt-2 text-sm text-muted">
              {engine === "instant"
                ? "Cleaning on this device. Download when it’s done."
                : "Saving so you can open it from Library anytime."}
            </p>

            <div className="mt-4 truncate text-xs text-muted">
              {fileName}
              {statusLabel ? ` · ${statusLabel}` : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="unmark-glass p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-sm font-semibold tracking-[-0.01em] text-brand">
            {resultUrl ? "Cleaned" : "Ready to unmark"}
          </div>

          <div className="mt-2 truncate text-sm font-medium text-foreground">
            {fileName}
          </div>

          <div className="mt-1 text-sm text-muted">
            {formatBytes(fileSize)}
            {statusLabel ? ` · ${statusLabel}` : null}
          </div>
          {isSample && !resultUrl ? (
            <p className="mt-2 text-sm text-muted">
              Look at the bottom-right sparkle, then tap Remove instantly.
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={processing}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-sand disabled:opacity-40"
          aria-label="Change image"
          title="Change image"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 8a5 5 0 019.5-2.2M13 8a5 5 0 01-9.5 2.2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12.5 3v3h-3M3.5 13v-3h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {!resultUrl && (
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className="inline-flex rounded-[var(--radius-md)] border border-border bg-surface p-0.5"
              role="group"
              aria-label="Detection mode"
            >
              <button
                type="button"
                onClick={() => onDetectModeChange("auto")}
                disabled={processing}
                className={`rounded-[var(--radius-sm)] px-3 py-2 text-xs font-semibold transition ${
                  detectMode === "auto"
                    ? "bg-brand text-white"
                    : "text-foreground hover:bg-sand"
                }`}
              >
                Auto (Gemini)
              </button>
              <button
                type="button"
                onClick={() => onDetectModeChange("manual")}
                disabled={processing}
                className={`rounded-[var(--radius-sm)] px-3 py-2 text-xs font-semibold transition ${
                  detectMode === "manual"
                    ? "bg-ink text-white"
                    : "text-foreground hover:bg-sand"
                }`}
              >
                Manual
              </button>
            </div>

            <p className="text-sm text-muted">
              {detectMode === "auto"
                ? "Auto finds the Gemini sparkle."
                : "Drag over the Gemini sparkle — Cloud saves to Library."}
            </p>
          </div>

          {detectMode === "auto" ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                className="inline-flex rounded-[var(--radius-md)] border border-border bg-surface p-0.5"
                role="group"
                aria-label="Processing mode"
              >
                <button
                  type="button"
                  onClick={() => onEngineChange("instant")}
                  disabled={processing}
                  className={`rounded-[var(--radius-sm)] px-3 py-2 text-xs font-semibold transition ${
                    engine === "instant"
                      ? "bg-ink text-white"
                      : "text-foreground hover:bg-sand"
                  }`}
                >
                  Instant
                </button>
                <button
                  type="button"
                  onClick={() => onEngineChange("cloud")}
                  disabled={processing}
                  className={`rounded-[var(--radius-sm)] px-3 py-2 text-xs font-semibold transition ${
                    engine === "cloud"
                      ? "bg-cobalt text-white"
                      : "text-foreground hover:bg-sand"
                  }`}
                >
                  Cloud
                </button>
              </div>

              <p className="text-sm text-muted">
                {engine === "instant"
                  ? "Watch a short ad, then download from this device"
                  : "Saves to Library · uses credits"}
              </p>
            </div>
          ) : null}
        </div>
      )}

      <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-cream">
        {resultUrl ? (
          <img
            src={resultUrl}
            alt="Cleaned image"
            className="mx-auto block h-auto max-h-[70vh] w-auto max-w-full"
          />
        ) : detectMode === "manual" ? (
          <ImageEditor
            imageUrl={imageUrl}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            onSelectionChange={onSelectionChange}
          />
        ) : (
          <img
            src={imageUrl}
            alt={fileName}
            className="mx-auto block h-auto max-h-[70vh] w-auto max-w-full"
          />
        )}
      </div>

      {error && (
        <div className="mt-4 border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="mt-5">
        {!resultUrl ? (
          <button
            type="button"
            disabled={
              processing || !canSubmit || blockedByAuth || blockedByCredits
            }
            onClick={requestRemove}
            className="btn-play inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-cobalt px-5 py-3.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_10px_20px_-8px_rgb(var(--shadow-color)/0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {blockedByAuth
              ? "Sign in for Cloud"
              : blockedByCredits
                ? "Out of credits"
                : engine === "instant"
                  ? "Remove instantly"
                  : "Remove & save to Library"}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                void downloadImage(resultUrl, `cleaned-${fileName}`).then(() => {
                  onDownloadComplete?.();
                });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_10px_20px_-8px_rgb(var(--shadow-color)/0.3)] transition hover:bg-brand-hover"
            >
              Download cleaned image
              <span aria-hidden>↓</span>
            </button>
            {onUseInCreate ? (
              <button
                type="button"
                onClick={onUseInCreate}
                className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-sand"
              >
                Edit in Create
              </button>
            ) : null}
            {jobId ? <FeedbackButtons jobId={jobId} /> : null}
          </div>
        )}

        {resultUrl && isSample ? (
          <p className="mt-2 text-xs text-muted">
            Sample sparkle removed. Drop your own Gemini image to clean it the
            same way.
          </p>
        ) : null}

        {!resultUrl && detectMode === "manual" && !hasSelection && (
          <p className="mt-2 text-xs text-muted">
            Draw a box around the Gemini sparkle to continue.
          </p>
        )}

        {!resultUrl && canSubmit && engine === "instant" && (
          <p className="mt-2 text-xs text-muted">
            {isSample
              ? "Instant stays on this device. Switch to Cloud to save to Library."
              : "Watch a short ad, then Instant runs on this device. Switch to Cloud to save to Library."}
          </p>
        )}

        <WatchAdForCredit
          reward="instant"
          open={instantAdOpen}
          showTrigger={false}
          onClose={() => setInstantAdOpen(false)}
          onAdsUnavailable={() => setSkipInstantAd(true)}
          onGranted={() => {
            setInstantAdOpen(false);
            onRemove();
          }}
        />

        {!resultUrl && canSubmit && blockedByCredits && (
          <div className="mt-2 space-y-2 text-xs text-muted">
            {paymentsEnabled ? (
              <p>
                No credits left.{" "}
                <a href="/account" className="font-medium text-brand hover:underline">
                  Buy more credits
                </a>{" "}
                or use Instant for a quick local cleanup.
              </p>
            ) : (
              <p>
                Out of credits for today. You get {dailyFreeCredits ?? 5} free
                Cloud credits each day, or use Instant now.
              </p>
            )}
            <WatchAdForCredit onGranted={() => void refreshCredits()} />
          </div>
        )}

        {!resultUrl && canSubmit && blockedByAuth && (
          <p className="mt-2 text-xs text-muted">
            Cloud unlocks Library and the Chrome extension.
            Instant works without signing in.
          </p>
        )}
      </div>
    </div>
  );
}
