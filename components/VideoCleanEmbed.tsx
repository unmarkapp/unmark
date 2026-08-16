"use client";

import { useRef } from "react";

import { useDropToClean } from "@/lib/dropToClean";

/**
 * Video drop zone for guide pages. Hands the file to the homepage cleaner
 * so the visitor starts on this page instead of being told to leave first.
 */
export default function VideoCleanEmbed({
  heading = "Clean a clip on this page",
  body = "Drop an MP4, MOV, or WebM. Unmark opens the cleaner with your file. Sign in only if Cloud asks — new accounts include credits to try a short video.",
}: {
  heading?: string;
  body?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, offerCleanFiles } = useDropToClean();

  const onFiles = (files: FileList | File[] | null) => {
    const list = files ? Array.from(files) : [];
    const video = list.find(
      (file) =>
        file.type.startsWith("video/") ||
        /\.(mp4|mov|webm|m4v)$/i.test(file.name),
    );
    if (video) offerCleanFiles([video]);
  };

  return (
    <section
      id="try"
      className="mt-12 border-2 border-ink bg-surface px-4 py-6 sm:px-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        Cloud · Library
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        {heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>

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
          isDragging ? "bg-peach/30" : "hover:bg-cream"
        }`}
      >
        <p className="font-display text-lg font-semibold text-foreground">
          Drop a Gemini, Veo, or Flow clip
        </p>
        <p className="mt-1 text-sm text-muted">
          MP4, MOV, or WebM · up to 60s / 1080p / 100MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm,.m4v"
        className="hidden"
        onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </section>
  );
}
