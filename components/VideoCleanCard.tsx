"use client";

import ImageEditor from "@/components/ImageEditor";

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface VideoCleanCardProps {
  videoUrl: string;
  fileName: string;
  fileSize: number;
  durationSec: number | null;
  estimatedCredits: number;
  processing: boolean;
  statusLabel?: string | null;
  error?: string | null;
  resultUrl?: string | null;
  isAuthenticated: boolean;
  hasCredits: boolean;
  detectMode: "auto" | "manual";
  onDetectModeChange: (mode: "auto" | "manual") => void;
  hasSelection: boolean;
  onSelectionChange: (selection: Selection | null) => void;
  frameUrl: string | null;
  frameWidth: number | null;
  frameHeight: number | null;
  onRemove: () => void;
  onReset: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "—";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

async function downloadFile(url: string, fileName: string) {
  const safeName = fileName.replace(/[^\w.\-]+/g, "_") || "cleaned.mp4";
  const downloadName = safeName.includes(".") ? safeName : `${safeName}.mp4`;

  let objectUrl = url;
  let shouldRevoke = false;

  if (!url.startsWith("blob:")) {
    const proxy = `/api/download-result?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(downloadName)}`;
    const response = await fetch(proxy);
    if (!response.ok) throw new Error("Failed to fetch video for download");
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
  if (shouldRevoke) URL.revokeObjectURL(objectUrl);
}

export default function VideoCleanCard({
  videoUrl,
  fileName,
  fileSize,
  durationSec,
  estimatedCredits,
  processing,
  statusLabel,
  error,
  resultUrl,
  isAuthenticated,
  hasCredits,
  detectMode,
  onDetectModeChange,
  hasSelection,
  onSelectionChange,
  frameUrl,
  frameWidth,
  frameHeight,
  onRemove,
  onReset,
}: VideoCleanCardProps) {
  const blockedByAuth = !isAuthenticated;
  const blockedByCredits = isAuthenticated && !hasCredits;
  const canSubmit = detectMode === "auto" || hasSelection;
  const manualAvailable = Boolean(frameUrl && frameWidth && frameHeight);

  if (processing && !resultUrl) {
    return (
      <div className="unmark-glass p-4 sm:p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative mx-auto w-full max-w-[320px] shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-ink sm:mx-0">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={videoUrl}
              className="block h-auto w-full object-contain opacity-70"
              muted
              playsInline
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="font-display text-lg font-semibold text-foreground">
              Cleaning your video…
            </p>
            <p className="mt-1 text-sm text-muted">
              {statusLabel || "Uploading"} — then we’ll take you to Library.
              You’ll get an email when it’s ready.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unmark-glass overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-foreground">
            {fileName}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {formatBytes(fileSize)}
            {durationSec != null ? ` · ${formatDuration(durationSec)}` : ""}
            {` · ~${estimatedCredits} credit${estimatedCredits === 1 ? "" : "s"}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-muted transition hover:text-foreground"
        >
          Choose another
        </button>
      </div>

      {!resultUrl && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
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
              disabled={processing || !manualAvailable}
              title={
                manualAvailable
                  ? undefined
                  : "Couldn’t capture a frame from this video for manual selection."
              }
              className={`rounded-[var(--radius-sm)] px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
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
              : "Drag over the watermark — the box applies to every frame."}
          </p>
        </div>
      )}

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="bg-ink p-3 sm:p-4">
          {!resultUrl && detectMode === "manual" && frameUrl && frameWidth && frameHeight ? (
            <ImageEditor
              imageUrl={frameUrl}
              imageWidth={frameWidth}
              imageHeight={frameHeight}
              onSelectionChange={onSelectionChange}
            />
          ) : (
            /* eslint-disable-next-line jsx-a11y/media-has-caption */
            <video
              src={resultUrl || videoUrl}
              controls
              playsInline
              className="mx-auto max-h-[420px] w-full object-contain"
            />
          )}
        </div>

        <div className="flex flex-col justify-center gap-4 p-4 sm:p-6">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
              {resultUrl ? "Video cleaned" : "Cloud video cleanup"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Longer clips process in the background — we’ll email you and
              show progress in Library. Max 60s · 1080p · 100MB.
            </p>
          </div>

          {!resultUrl && detectMode === "auto" && (
            <div className="rounded-[var(--radius-md)] border border-warning/30 bg-warning-bg px-3.5 py-3 text-sm text-warning">
              <p className="font-semibold">
                Only the Gemini/Veo sparkle watermark is supported
              </p>
              <p className="mt-1 leading-relaxed text-warning/90">
                We detect and remove the small “sparkle” mark Gemini and Veo
                add to generated video. Clips from other tools (e.g. other AI
                video generators) won’t have that mark — switch to Manual and
                draw a box around it instead.
              </p>
            </div>
          )}

          {!resultUrl && detectMode === "manual" && (
            <div className="rounded-[var(--radius-md)] border border-border bg-sand px-3.5 py-3 text-sm text-muted">
              <p className="font-semibold text-foreground">
                Works on any watermark
              </p>
              <p className="mt-1 leading-relaxed">
                Draw a box around the watermark on the still frame — it’ll be
                removed from every frame using generic inpainting, so results
                can vary a bit more than the Gemini sparkle’s precision
                removal.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          {resultUrl ? (
            <button
              type="button"
              onClick={() =>
                void downloadFile(
                  resultUrl,
                  `${fileName.replace(/\.[^.]+$/, "") || "cleaned"}-cleaned.mp4`,
                )
              }
              className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-cobalt px-5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.08)] transition hover:brightness-110"
            >
              Download MP4
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onRemove}
                disabled={blockedByAuth || blockedByCredits || !canSubmit}
                className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-brand px-5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_10px_20px_-8px_rgb(var(--shadow-color)/0.3)] transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {blockedByAuth
                  ? "Sign in to clean video"
                  : blockedByCredits
                    ? "Buy credits to continue"
                    : `Clean video · ${estimatedCredits} credit${estimatedCredits === 1 ? "" : "s"}`}
              </button>
              {detectMode === "manual" && !hasSelection && (
                <p className="text-xs text-muted">
                  Draw a box around the watermark to continue.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
