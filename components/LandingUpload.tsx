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

function UploadIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 16V7M12 7l-3.5 3.5M12 7l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
      {/* Mode toggle */}
      <div className="unmark-glass mb-3 grid grid-cols-2 gap-1 p-1">
        <button
          type="button"
          onClick={() => setMode("clean")}
          className={`rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-semibold transition ${
            mode === "clean"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted hover:bg-sand hover:text-foreground"
          }`}
        >
          Clean
        </button>
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-semibold transition ${
            mode === "create"
              ? "bg-brand text-white shadow-sm"
              : "text-muted hover:bg-sand hover:text-foreground"
          }`}
        >
          Create
        </button>
      </div>

      {mode === "create" ? (
        <>
          <p className="mb-4 text-center text-sm text-muted">
            Prompt Nano Banana: images without the Gemini sparkle
          </p>
          <CreateGenerateCard />
        </>
      ) : (
        <>
          {/* Drop zone */}
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
            className={`group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-12 text-center transition duration-200 ${
              isDragging
                ? "border-brand bg-brand-soft/30"
                : "border-border-strong bg-surface hover:border-brand/40 hover:bg-cream"
            }`}
          >
            <div
              className={`mb-5 flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-foreground text-background transition duration-300 ${
                isDragging ? "scale-110" : "group-hover:scale-105"
              }`}
            >
              <UploadIcon />
            </div>

            <h2 className="font-display text-xl font-semibold tracking-[-0.01em] text-foreground sm:text-2xl">
              Drop Gemini images or video
            </h2>

            <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-muted">
              Images free with Instant. Video up to 60s via Cloud.
            </p>

            <button
              type="button"
              data-walkthrough="sample"
              onClick={(event) => {
                event.stopPropagation();
                onTrySample();
              }}
              disabled={sampleBusy}
              className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_8px_16px_-6px_rgb(var(--shadow-color)/0.3)] transition hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60"
            >
              {sampleBusy ? "Loading…" : "Try a sample"}
            </button>

            <p className="mt-4 text-xs text-muted/70">
              Up to 10 images · Video 1 credit / 5s
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

          <PrivacyNote className="mt-3 text-center text-xs leading-relaxed text-muted" />
        </>
      )}
      <Walkthrough />
    </LandingShell>
  );
}
