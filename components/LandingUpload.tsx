"use client";

import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

import CreateGenerateCard from "@/components/CreateGenerateCard";
import LandingShell from "@/components/LandingShell";

interface LandingUploadProps {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilesSelected: (files: File[]) => void;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function isVideoFile(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  return /\.(mp4|mov|webm|m4v)$/i.test(file.name);
}

type HomeMode = "clean" | "create";

export default function LandingUpload({
  onFileChange,
  onFilesSelected,
}: LandingUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<HomeMode>("clean");

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);

    const list = Array.from(event.dataTransfer.files || []).filter(
      (file) => isImageFile(file) || isVideoFile(file),
    );
    if (list.length === 0) return;
    onFilesSelected(list.slice(0, 10));
  };

  return (
    <LandingShell>
      <div className="mb-4 grid grid-cols-2 border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => setMode("clean")}
          className={`px-3 py-2 text-sm font-semibold transition ${
            mode === "clean"
              ? "bg-cream text-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          Clean
        </button>
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`px-3 py-2 text-sm font-semibold transition ${
            mode === "create"
              ? "bg-cream text-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          Create
        </button>
      </div>

      {mode === "create" ? (
        <>
          <p className="mb-4 text-center text-sm text-muted">
            Prompt Nano Banana — no Gemini app sparkle
          </p>
          <CreateGenerateCard />
        </>
      ) : (
        <>
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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed px-6 py-14 text-center transition duration-300 ${
              dragging
                ? "border-brand bg-cream"
                : "border-border bg-surface/80 hover:border-brand hover:bg-cream/70"
            }`}
          >
            <div
              className={`mb-6 flex h-16 w-16 items-center justify-center border border-brand-line bg-cream text-brand transition duration-500 ${
                dragging ? "animate-soft-pulse" : "group-hover:scale-105"
              }`}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 16V6M12 6l-4 4M12 6l4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 18h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Drop Gemini images or video
            </h2>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Images: Instant or Cloud. Video: Cloud only — visible Gemini/Veo
              sparkle, up to 60s / 1080p / 100MB.
            </p>

            <p className="mt-5 text-xs tracking-wide text-muted">
              Images up to 10 · Video 1 credit / 5s
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm,.m4v"
              multiple
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          <p className="mt-4 text-center text-xs text-muted">
            Visible Gemini sparkle only · not SynthID · files stay private
          </p>
        </>
      )}
    </LandingShell>
  );
}
