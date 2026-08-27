"use client";

import { useRef, useState } from "react";

import WatchAdForCredit from "@/components/WatchAdModal";
import { useDropToClean } from "@/lib/dropToClean";

/**
 * Instant-only Gemini sparkle cleanup for guide pages.
 * No account. Files stay in the browser.
 */
export default function InstantCleanEmbed() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging } = useDropToClean();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("cleaned.png");
  const [watchOpen, setWatchOpen] = useState(false);
  const [skipWatchAd, setSkipWatchAd] = useState(false);
  const pendingFile = useRef<File | null>(null);

  const reset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    setBusy(false);
  };

  const process = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Choose a PNG, JPG, or WebP.");
      return;
    }
    reset();
    setBusy(true);
    setFileName(file.name.replace(/\.[^.]+$/, "") + "-clean.png");
    const preview = URL.createObjectURL(file);
    setOriginalUrl(preview);
    try {
      const { getClientWatermarkEngine } = await import(
        "@/lib/client-watermark/engine"
      );
      const client = await getClientWatermarkEngine();
      const result = await client.processFile(file);
      setResultUrl(URL.createObjectURL(result.blob));
      const { trackEvent } = await import("@/lib/analytics");
      trackEvent("instant_clean", { method: "embed" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not clean this image. Try another Gemini export.",
      );
    } finally {
      setBusy(false);
    }
  };

  const onFiles = (files: FileList | File[] | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a PNG, JPG, or WebP.");
      return;
    }
    pendingFile.current = file;
    if (skipWatchAd) {
      void process(file);
      return;
    }
    setWatchOpen(true);
  };

  return (
    <section
      id="try"
      className="unmark-glass mt-12 px-4 py-6 sm:px-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        Instant · no account
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] text-foreground">
        Remove the sparkle on this page
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Drop a Gemini still. Watch a short ad, then cleanup runs in your
        browser — Instant stills never leave your device.
      </p>

      {!resultUrl ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            onFiles(event.dataTransfer.files);
          }}
          className={`mt-5 flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border-strong rounded-[var(--radius-lg)] px-4 py-10 text-center transition ${
            isDragging || busy ? "bg-peach/30" : "hover:bg-cream"
          }`}
        >
          <p className="font-display text-lg font-semibold text-foreground">
            {busy ? "Cleaning…" : "Drop a Gemini image"}
          </p>
          <p className="mt-1 text-sm text-muted">PNG, JPG, or WebP</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {originalUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={originalUrl}
              alt="Original Gemini export"
              className="max-h-64 w-full rounded-[var(--radius-md)] border border-border object-contain bg-cream"
            />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Sparkle removed"
            className="max-h-64 w-full rounded-[var(--radius-md)] border border-border object-contain bg-cream"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {error ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <WatchAdForCredit
        reward="instant"
        open={watchOpen}
        showTrigger={false}
        onClose={() => {
          setWatchOpen(false);
          pendingFile.current = null;
        }}
        onAdsUnavailable={() => setSkipWatchAd(true)}
        onGranted={() => {
          const file = pendingFile.current;
          setWatchOpen(false);
          pendingFile.current = null;
          if (file) void process(file);
        }}
      />

      {resultUrl ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={resultUrl}
            download={fileName}
            className="inline-flex rounded-[var(--radius-md)] bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)] transition hover:bg-brand-hover"
          >
            Download PNG
          </a>
          <button
            type="button"
            onClick={reset}
            className="inline-flex rounded-[var(--radius-md)] border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-sand"
          >
            Try another
          </button>
        </div>
      ) : null}
    </section>
  );
}
