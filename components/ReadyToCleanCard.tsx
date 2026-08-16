"use client";

import ImageEditor from "@/components/ImageEditor";
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
  onSelectionChange: (selection: Selection | null) => void;
  onRemove: () => void;
  onReset: () => void;
  onDownloadComplete?: () => void;
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
  onSelectionChange,
  onRemove,
  onReset,
  onDownloadComplete,
}: ReadyToCleanCardProps) {
  const { dailyFreeCredits, paymentsEnabled } = useCredits();
  const canSubmit = detectMode === "auto" || hasSelection;
  const needsAuth = engine === "cloud";
  const blockedByAuth = needsAuth && !isAuthenticated;
  const blockedByCredits = needsAuth && isAuthenticated && !hasCredits;

  if (processing && !resultUrl) {
    return (
      <div className="unmark-glass p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative mx-auto w-full max-w-[240px] shrink-0 overflow-hidden bg-ink sm:mx-0">
            <img
              src={imageUrl}
              alt="Processing"
              className="block h-auto w-full object-contain"
            />

            <div className="absolute inset-0 bg-[#1a1a2e]/15" />
            <div className="watermark-scan-line" />

            <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center px-3">
              <div className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-white">
                <span className="h-2 w-2 bg-peach" />
                {engine === "instant"
                  ? "Cleaning in your browser..."
                  : "Saving to your Library..."}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 py-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Processing
            </div>

            <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
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
          <div className="font-display text-sm font-semibold tracking-wide text-brand">
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
          className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-surface text-foreground transition hover:bg-cream disabled:opacity-40"
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
              className="inline-flex border-2 border-ink bg-surface p-0.5"
              role="group"
              aria-label="Detection mode"
            >
              <button
                type="button"
                onClick={() => onDetectModeChange("auto")}
                disabled={processing}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                  detectMode === "auto"
                    ? "bg-brand text-white"
                    : "text-foreground hover:bg-cream"
                }`}
              >
                Auto (Gemini)
              </button>
              <button
                type="button"
                onClick={() => onDetectModeChange("manual")}
                disabled={processing}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                  detectMode === "manual"
                    ? "bg-white text-ink"
                    : "text-foreground hover:bg-cream"
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
                className="inline-flex border-2 border-ink bg-surface p-0.5"
                role="group"
                aria-label="Processing mode"
              >
                <button
                  type="button"
                  onClick={() => onEngineChange("instant")}
                  disabled={processing}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                    engine === "instant"
                      ? "bg-ink text-white"
                      : "text-foreground hover:bg-cream"
                  }`}
                >
                  Instant
                </button>
                <button
                  type="button"
                  onClick={() => onEngineChange("cloud")}
                  disabled={processing}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                    engine === "cloud"
                      ? "bg-cobalt text-white"
                      : "text-foreground hover:bg-cream"
                  }`}
                >
                  Cloud
                </button>
              </div>

              <p className="text-sm text-muted">
                {engine === "instant"
                  ? "Free and private — download from this device"
                  : "Saves to Library · uses credits"}
              </p>
            </div>
          ) : null}
        </div>
      )}

      <div className="overflow-hidden border-2 border-ink bg-cream">
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
        <div className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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
            onClick={onRemove}
            className="btn-play inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-cobalt px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
          <button
            type="button"
            onClick={() => {
              void downloadImage(resultUrl, `cleaned-${fileName}`).then(() => {
                onDownloadComplete?.();
              });
            }}
            className="inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-brand px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover sm:w-auto"
          >
            Download cleaned image
            <span aria-hidden>↓</span>
          </button>
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
            Instant stays on this device. Switch to Cloud to save to Library.
          </p>
        )}

        {!resultUrl && canSubmit && blockedByCredits && (
          <p className="mt-2 text-xs text-muted">
            {paymentsEnabled ? (
              <>
                No credits left.{" "}
                <a
                  href="/account"
                  className="font-medium text-brand hover:underline"
                >
                  Buy more credits
                </a>{" "}
                or use Instant for a quick local cleanup.
              </>
            ) : (
              <>
                Out of credits for today. You get {dailyFreeCredits ?? 5} free
                Cloud credits each day, or use Instant now.
              </>
            )}
          </p>
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
