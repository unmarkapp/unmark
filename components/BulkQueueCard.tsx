"use client";

import { useCredits } from "@/lib/credits";

export type BulkItemStatus =
  | "ready"
  | "processing"
  | "completed"
  | "failed";

export interface BulkQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: BulkItemStatus;
  error?: string | null;
  resultUrl?: string | null;
  jobId?: string | null;
}

interface BulkQueueCardProps {
  items: BulkQueueItem[];
  processing: boolean;
  zipping?: boolean;
  isAuthenticated: boolean;
  hasCredits: boolean;
  fastCredits?: number | null;
  error?: string | null;
  onRemoveAll: () => void;
  onDownloadZip: () => void;
  onReset: () => void;
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function statusLabel(status: BulkItemStatus): string {
  switch (status) {
    case "ready":
      return "Ready";
    case "processing":
      return "Processing";
    case "completed":
      return "Done";
    case "failed":
      return "Failed";
  }
}

function statusClass(status: BulkItemStatus): string {
  switch (status) {
    case "ready":
      return "text-muted";
    case "processing":
      return "text-brand";
    case "completed":
      return "text-success";
    case "failed":
      return "text-danger";
  }
}

export default function BulkQueueCard({
  items,
  processing,
  zipping = false,
  isAuthenticated,
  hasCredits,
  fastCredits = null,
  error,
  onRemoveAll,
  onDownloadZip,
  onReset,
}: BulkQueueCardProps) {
  const { dailyFreeCredits, paymentsEnabled } = useCredits();
  const count = items.length;
  const completed = items.filter((item) => item.status === "completed").length;
  const failed = items.filter((item) => item.status === "failed").length;
  const started = processing || completed + failed > 0;
  const allDone = completed + failed === count && count > 0 && !processing;
  const canZip = completed > 0;

  return (
    <div className="unmark-glass p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-cream text-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect
              x="3"
              y="5"
              width="11"
              height="11"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <rect
              x="10"
              y="8"
              width="11"
              height="11"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            Cloud bulk
          </div>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.01em] text-foreground sm:text-2xl">
            {allDone
              ? completed === count
                ? "All images cleaned"
                : `${completed} cleaned${failed ? `, ${failed} failed` : ""}`
              : processing
                ? "Cleaning in the cloud"
                : `${count} image${count === 1 ? "" : "s"} ready`}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Bulk cleanup saves results to your Library
            {allDone ? " — download the zip anytime." : "."}
          </p>
          {!started ? (
            <p className="mt-2 text-sm font-semibold text-brand-hover">
              Uses {count} credit{count === 1 ? "" : "s"}
              {typeof fastCredits === "number"
                ? ` · you have ${fastCredits}`
                : ""}
              .
            </p>
          ) : null}
        </div>
      </div>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.previewUrl}
              alt=""
              className="h-12 w-12 shrink-0 rounded-[var(--radius-sm)] object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">
                {item.file.name}
              </div>
              <div
                className={`mt-0.5 flex items-center gap-1.5 text-xs font-medium ${statusClass(item.status)}`}
              >
                {item.status === "processing" ? <Spinner /> : null}
                {item.error || statusLabel(item.status)}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {error ? (
        <div className="mt-4 border border-danger-border bg-danger-bg px-3 py-2.5 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex items-center gap-2">
        {!started ? (
          <button
            type="button"
            disabled={!isAuthenticated || !hasCredits || count === 0}
            onClick={onRemoveAll}
            className="inline-flex flex-1 items-center justify-center rounded-[var(--radius-md)] bg-cobalt px-5 py-3.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.08)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!isAuthenticated
              ? "Sign in for cloud bulk"
              : !hasCredits
                ? `Need ${count} credit${count === 1 ? "" : "s"}`
                : `Clean ${count} image${count === 1 ? "" : "s"} · save to Library`}
          </button>
        ) : allDone ? (
          <button
            type="button"
            disabled={!canZip || zipping}
            onClick={onDownloadZip}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_10px_20px_-8px_rgb(var(--shadow-color)/0.3)] transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {zipping ? (
              <>
                <Spinner className="text-white" />
                Preparing zip…
              </>
            ) : (
              <>Download as Zip ({completed})</>
            )}
          </button>
        ) : (
          <div className="flex flex-1 items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-3.5 text-sm font-semibold text-white">
            <Spinner className="text-white" />
            <span>
              {completed} of {count} complete
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onReset}
          disabled={processing || zipping}
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface text-foreground transition hover:bg-sand disabled:opacity-40"
          title="Clear selection"
          aria-label="Clear selection"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 4v6h6M20 20v-6h-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5 9A8 8 0 004.5 9M3.5 15a8 8 0 0016 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {allDone ? (
        <p className="mt-3 text-center text-sm text-muted">
          Also in{" "}
          <a href="/library" className="font-semibold text-brand hover:underline">
            Library
          </a>
          .
        </p>
      ) : !started && !isAuthenticated ? (
        <p className="mt-3 text-sm text-muted">
          Bulk, Library save, and the Chrome extension need a signed-in Cloud
          account. Instant browser mode is for one image at a time.
        </p>
      ) : !started && !hasCredits ? (
        <p className="mt-3 text-sm text-brand-hover">
          {paymentsEnabled ? (
            <>
              You’re out of credits.{" "}
              <a href="/account" className="font-semibold underline">
                Buy more
              </a>{" "}
              to continue.
            </>
          ) : (
            <>
              You’re out of credits for today. You get{" "}
              {dailyFreeCredits ?? 5} free Cloud credits each day, or use
              Instant for one image.
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}
