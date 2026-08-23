"use client";

import { ChangeEvent, useRef, useState } from "react";

import CreateGenerateCard from "@/components/CreateGenerateCard";
import LandingShell from "@/components/LandingShell";
import PrivacyNote from "@/components/PrivacyNote";
import Walkthrough from "@/components/Walkthrough";
import { useDropToClean } from "@/lib/dropToClean";

interface LandingUploadProps {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTrySample: () => void;
  sampleBusy?: boolean;
}

type HomeMode = "clean" | "create";

export default function LandingUpload({
  onFileChange,
  onTrySample,
  sampleBusy = false,
}: LandingUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging } = useDropToClean();
  const [mode, setMode] = useState<HomeMode>("clean");

  return (
    <LandingShell>
      <div className="unmark-glass mb-4 grid grid-cols-2 gap-1 p-1">
        <button
          type="button"
          onClick={() => setMode("clean")}
          className={`rounded-[var(--radius-sm)] px-3 py-3 text-sm font-semibold transition ${
            mode === "clean"
              ? "bg-cobalt text-white"
              : "text-foreground hover:bg-sand"
          }`}
        >
          Clean
        </button>
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`rounded-[var(--radius-sm)] px-3 py-3 text-sm font-semibold transition ${
            mode === "create"
              ? "bg-brand text-white"
              : "text-foreground hover:bg-sand"
          }`}
        >
          Create
        </button>
      </div>

      {mode === "create" ? (
        <>
          <p className="mb-4 text-center text-sm text-muted">
            Prompt Nano Banana — images without the Gemini sparkle
          </p>
          <CreateGenerateCard />
        </>
      ) : (
        <>
          <div
            role="button"
            tabIndex={0}
            data-walkthrough="drop"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            className={`group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed border-border-strong rounded-[var(--radius-lg)] bg-surface px-6 py-14 text-center transition duration-300 ${
              isDragging ? "bg-peach/30" : "hover:bg-cream"
            }`}
          >
            <div
              className={`mb-6 flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] bg-cobalt text-white transition duration-500 ${
                isDragging ? "animate-soft-pulse" : "group-hover:scale-105"
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

            <h2 className="font-display text-2xl font-semibold tracking-[-0.01em] text-foreground sm:text-3xl">
              Drop Gemini images or video
            </h2>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Images with Instant or Cloud. Video with Cloud — Gemini sparkle,
              up to 60s / 1080p / 100MB.
            </p>

            <button
              type="button"
              data-walkthrough="sample"
              onClick={(event) => {
                event.stopPropagation();
                onTrySample();
              }}
              disabled={sampleBusy}
              className="btn-play mt-6 inline-flex min-h-11 items-center justify-center gap-2.5 rounded-[var(--radius-md)] bg-peach px-5 py-3 text-sm font-semibold text-ink shadow-[0_1px_2px_rgb(var(--shadow-color)/0.04)] transition hover:brightness-95 disabled:opacity-60"
            >
              {sampleBusy ? "Loading sample…" : "Try a sample"}
            </button>

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

          <p className="mt-2 text-center text-xs text-muted">
            Sample Gemini still with a sparkle in the corner — Instant is free,
            no account.
          </p>
          <PrivacyNote className="mt-3 text-center text-xs leading-relaxed text-muted" />
        </>
      )}
      <Walkthrough />
    </LandingShell>
  );
}
