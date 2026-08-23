"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/api";

interface FeedbackButtonsProps {
  jobId: string;
}

type Rating = "like" | "dislike";

export default function FeedbackButtons({ jobId }: FeedbackButtonsProps) {
  const [selected, setSelected] = useState<Rating | null>(null);
  const [busy, setBusy] = useState(false);

  const handleRate = async (rating: Rating) => {
    if (busy || selected === rating) return;
    setBusy(true);
    try {
      await submitFeedback(jobId, rating);
      setSelected(rating);
    } catch {
      // silently fail — feedback is non-critical
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted">Was this helpful?</span>
      <button
        type="button"
        aria-label="Thumbs up"
        aria-pressed={selected === "like"}
        disabled={busy}
        onClick={() => void handleRate("like")}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-95 disabled:opacity-50 ${
          selected === "like"
            ? "border-brand bg-brand text-white"
            : "border-border bg-surface text-muted hover:border-brand/40 hover:text-brand"
        }`}
      >
        <ThumbUpIcon />
      </button>
      <button
        type="button"
        aria-label="Thumbs down"
        aria-pressed={selected === "dislike"}
        disabled={busy}
        onClick={() => void handleRate("dislike")}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition active:scale-95 disabled:opacity-50 ${
          selected === "dislike"
            ? "border-danger bg-danger text-white"
            : "border-border bg-surface text-muted hover:border-danger/40 hover:text-danger"
        }`}
      >
        <ThumbDownIcon />
      </button>
    </div>
  );
}

function ThumbUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M5 15H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2m0 7V8m0 7h6.5a1 1 0 0 0 .97-.757l1.5-6A1 1 0 0 0 13 7H9.5V3a2 2 0 0 0-2-2L5 6v9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11 1h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2m0-7V8m0-7H4.5a1 1 0 0 0-.97.757l-1.5 6A1 1 0 0 0 3 10h3.5v4a2 2 0 0 0 2 2L11 10V1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
