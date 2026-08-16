"use client";

import { useRef, useState } from "react";

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
    if (file) void process(file);
  };

  return (
    <section
      id="try"
      className="mt-12 border-2 border-ink bg-surface px-4 py-6 sm:px-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        Instant · no account
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        Remove the sparkle on this page
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Drop a Gemini still. Cleanup runs in your browser — then download the
        PNG.
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
          className={`mt-5 flex min-h-[200px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-ink px-4 py-10 text-center transition ${
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
              className="max-h-64 w-full border-2 border-ink object-contain bg-cream"
            />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt="Sparkle removed"
            className="max-h-64 w-full border-2 border-ink object-contain bg-cream"
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
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {resultUrl ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={resultUrl}
            download={fileName}
            className="inline-flex border-2 border-ink bg-brand px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
          >
            Download PNG
          </a>
          <button
            type="button"
            onClick={reset}
            className="inline-flex border-2 border-ink bg-surface px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition hover:bg-cream"
          >
            Try another
          </button>
        </div>
      ) : null}
    </section>
  );
}
