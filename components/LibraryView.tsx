"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  deleteJob,
  downloadProcessedImage,
  listJobs,
  type LibraryJob,
} from "@/lib/api";

export default function LibraryView() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [jobs, setJobs] = useState<LibraryJob[]>([]);
  const [libraryUsed, setLibraryUsed] = useState(0);
  const [libraryLimit, setLibraryLimit] = useState(50);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<LibraryJob | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const knownStatus = useRef<Map<string, string>>(new Map());

  const refresh = useCallback(async (opts?: { quiet?: boolean }) => {
    if (!opts?.quiet) {
      setLibraryLoading(true);
    }
    setError(null);
    try {
      const result = await listJobs({ limit: 100 });
      const next = result.jobs;

      // Toast when an in-progress job finishes while Library is open.
      for (const job of next) {
        const prev = knownStatus.current.get(job.job_id);
        if (
          prev &&
          prev !== "completed" &&
          prev !== "failed" &&
          job.status === "completed"
        ) {
          const label =
            job.media_type === "video" ? "Video ready" : "Image ready";
          setToast(label);
        }
        if (job.status) {
          knownStatus.current.set(job.job_id, job.status);
        }
      }

      setJobs(next);
      setLibraryUsed(result.library_used);
      setLibraryLimit(result.library_limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load library");
    } finally {
      if (!opts?.quiet) {
        setLibraryLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      void refresh();
    }
  }, [user, refresh]);

  // Poll while anything is queued/processing.
  useEffect(() => {
    const pending = jobs.some(
      (job) => job.status === "queued" || job.status === "processing",
    );
    if (!pending || !user) return;

    const id = window.setInterval(() => {
      void refresh({ quiet: true });
    }, 4000);
    return () => window.clearInterval(id);
  }, [jobs, user, refresh]);

  useEffect(() => {
    if (!selected) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const libraryFull = libraryUsed >= libraryLimit;
  const pendingCount = jobs.filter(
    (job) => job.status === "queued" || job.status === "processing",
  ).length;

  const fileLabel = (job: LibraryJob) => {
    const base =
      job.filename?.replace(/\.[^.]+$/, "") ||
      `cleaned-${job.job_id.slice(0, 8)}`;
    const ext = job.media_type === "video" ? "mp4" : "png";
    return `${base}-cleaned.${ext}`;
  };

  const shareLink = (job: LibraryJob) => {
    if (job.share_url) return job.share_url;
    if (typeof window !== "undefined") {
      return `${window.location.origin}/s/${job.job_id}`;
    }
    return `https://unmark.ink/s/${job.job_id}`;
  };

  const handleDownload = async (job: LibraryJob) => {
    if (!job.result_url) return;
    setDownloadingId(job.job_id);
    try {
      await downloadProcessedImage(job.result_url, fileLabel(job));
      setToast("Download started");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyLink = async (job: LibraryJob) => {
    if (job.status !== "completed") return;
    try {
      await navigator.clipboard.writeText(shareLink(job));
      setToast("Link copied");
    } catch {
      setToast("Could not copy link");
    }
  };

  const handleShare = async (job: LibraryJob) => {
    if (job.status !== "completed") return;
    const url = shareLink(job);
    try {
      if (navigator.share) {
        await navigator.share({
          title: fileLabel(job),
          url,
        });
        return;
      }
      await handleCopyLink(job);
    } catch {
      // User cancelled share — ignore
    }
  };

  const handleDelete = async (job: LibraryJob) => {
    if (deletingId) return;
    const confirmed = window.confirm(
      "Delete this item from your Library? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeletingId(job.job_id);
    try {
      await deleteJob(job.job_id);
      setSelected(null);
      setToast("Deleted");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-20 text-sm text-muted sm:px-6">
        {loading ? "Loading library…" : "Signed out. Redirecting…"}
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Library
            </h1>
            <p className="mt-2 text-sm text-muted">
              Used {libraryUsed} / {libraryLimit} slots
              {pendingCount > 0
                ? ` · ${pendingCount} in progress`
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            className="text-sm font-medium text-muted transition hover:text-foreground"
          >
            Refresh
          </button>
        </div>

        {pendingCount > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground">
            Cleaning in the background. We’ll email you when a video is ready —
            this page also updates automatically.
          </div>
        )}

        {libraryFull && (
          <div className="mt-6 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground">
            Library is full. Delete old items or{" "}
            <button
              type="button"
              onClick={() => router.push("/account")}
              className="font-semibold text-brand hover:underline"
            >
              buy more storage
            </button>
            .
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button
              type="button"
              onClick={() => void refresh()}
              className="ml-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {libraryLoading ? (
          <p className="py-16 text-sm text-muted">Loading library…</p>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted">No cleaned images or videos yet.</p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-3 text-sm font-medium text-brand hover:underline"
            >
              Remove a Gemini watermark →
            </button>
          </div>
        ) : (
          <ul className="library-masonry mt-8">
            {jobs.map((job) => {
              const canOpen =
                job.status === "completed" && Boolean(job.result_url);
              const label = job.filename || `Job ${job.job_id.slice(0, 8)}`;
              const thumb =
                job.media_type === "video"
                  ? job.poster_url || job.result_url
                  : job.result_url;
              const isVideo = job.media_type === "video";
              const isPending =
                job.status === "queued" || job.status === "processing";
              const isFailed = job.status === "failed";

              return (
                <li key={job.job_id} className="library-masonry-item">
                  {canOpen && thumb ? (
                    <button
                      type="button"
                      onClick={() => setSelected(job)}
                      className="group relative block w-full overflow-hidden rounded-2xl bg-surface outline-none transition duration-300 hover:brightness-[0.97] focus-visible:ring-2 focus-visible:ring-brand/50"
                      aria-label={`Open ${label}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={label}
                        loading="lazy"
                        className="block h-auto w-full object-cover transition duration-500 group-hover:scale-[1.015]"
                      />
                      {isVideo && (
                        <span className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Video
                        </span>
                      )}
                      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-black/0 transition group-hover:bg-black/10" />
                    </button>
                  ) : (
                    <div
                      className={`relative flex w-full flex-col items-center justify-center gap-2 rounded-2xl bg-surface px-4 text-center ${
                        isVideo ? "aspect-[9/16]" : "aspect-[3/4]"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {isPending
                          ? job.status === "processing"
                            ? "Cleaning…"
                            : "Queued"
                          : isFailed
                            ? "Failed"
                            : job.status || "…"}
                      </p>
                      <p className="line-clamp-2 text-sm text-foreground">
                        {label}
                      </p>
                      {isVideo && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          Video
                          {job.duration_sec
                            ? ` · ${Math.round(job.duration_sec)}s`
                            : ""}
                        </span>
                      )}
                      {isFailed && job.error && (
                        <p className="line-clamp-3 text-xs text-red-600">
                          {job.error}
                        </p>
                      )}
                      {(isPending || isFailed) && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(job)}
                          disabled={deletingId === job.job_id}
                          className="mt-1 text-xs font-medium text-muted underline hover:text-foreground disabled:opacity-50"
                        >
                          {deletingId === job.job_id ? "Removing…" : "Remove"}
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {toast && !selected && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow">
          {toast}
        </div>
      )}

      {selected?.result_url && (
        <div
          className="fixed inset-0 z-50 flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#1c1c1e]/[0.94]"
          role="dialog"
          aria-modal="true"
          aria-label={
            selected.media_type === "video" ? "Video preview" : "Image preview"
          }
        >
          <div className="flex shrink-0 items-center px-3 pb-1 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div
            className="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-10"
            onClick={() => setSelected(null)}
          >
            {selected.media_type === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={selected.result_url}
                poster={selected.poster_url}
                controls
                playsInline
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={selected.result_url}
                alt={selected.filename || "Processed image"}
                className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              />
            )}
          </div>

          <div className="relative flex shrink-0 justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
            <div
              className="flex items-center gap-1 rounded-2xl bg-[#2c2c2e]/95 px-2 py-1.5 shadow-xl backdrop-blur"
              onClick={(event) => event.stopPropagation()}
            >
              <ToolbarButton
                label="Share"
                onClick={() => void handleShare(selected)}
              >
                <path
                  d="M12 3v10M8.5 6.5L12 3l3.5 3.5M5 14v4.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </ToolbarButton>
              <ToolbarButton
                label="Copy link"
                onClick={() => void handleCopyLink(selected)}
              >
                <rect
                  x="8"
                  y="8"
                  width="10"
                  height="10"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M6 14V6.5A1.5 1.5 0 017.5 5H15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </ToolbarButton>
              <ToolbarButton
                label={
                  downloadingId === selected.job_id
                    ? "Downloading…"
                    : "Download"
                }
                onClick={() => void handleDownload(selected)}
                disabled={downloadingId === selected.job_id}
              >
                <path
                  d="M12 4v10M8 10l4 4 4-4M6 18h12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </ToolbarButton>
              <ToolbarButton
                label={
                  deletingId === selected.job_id ? "Deleting…" : "Delete"
                }
                onClick={() => void handleDelete(selected)}
                disabled={deletingId === selected.job_id}
              >
                <path
                  d="M5 7h14M9.5 7V5.5A1.5 1.5 0 0111 4h2a1.5 1.5 0 011.5 1.5V7M8 7l.8 11.5A1.5 1.5 0 0010.3 20h3.4a1.5 1.5 0 001.5-1.5L16 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </ToolbarButton>
            </div>

            {toast && (
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow">
                {toast}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function ToolbarButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
