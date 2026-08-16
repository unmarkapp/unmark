"use client";

import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import CanvaPromoModal, {
  shouldShowCanvaPromo,
} from "@/components/CanvaPromoModal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/lib/auth";
import {
  fetchResultBlob,
  pollBackgroundRemovalJob,
  submitBackgroundRemoval,
} from "@/lib/bg-remove";
import { shareUrlForJob } from "@/lib/canva";
import { useDropToClean } from "@/lib/dropToClean";

type ViewMode = "cutout" | "original" | "compare";

export default function BackgroundRemovalTool() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const { pendingBgId, consumePendingBgFile } = useDropToClean();
  const inputRef = useRef<HTMLInputElement>(null);
  const heldFile = useRef<File | null>(null);
  const [hasHeldShare, setHasHeldShare] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [mode, setMode] = useState<ViewMode>("cutout");
  const [hasResult, setHasResult] = useState(false);
  const [fileName, setFileName] = useState("image");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [cutoutBlob, setCutoutBlob] = useState<Blob | null>(null);
  const [completedJobId, setCompletedJobId] = useState<string | null>(null);
  const [canvaPromoOpen, setCanvaPromoOpen] = useState(false);

  const revokeUrls = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (cutoutUrl) URL.revokeObjectURL(cutoutUrl);
    setOriginalUrl(null);
    setCutoutUrl(null);
    setCutoutBlob(null);
    setHasResult(false);
    setCompletedJobId(null);
  }, [originalUrl, cutoutUrl]);

  const processFile = useCallback(
    async (file: File) => {
      if (!user) {
        setError("Sign in to use background removal.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please choose a valid image file.");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setError("File is too large (max 25 MB).");
        return;
      }

      setError("");
      revokeUrls();
      setFileName(file.name.replace(/\.[^.]+$/, "") || "image");
      setOriginalUrl(URL.createObjectURL(file));
      setLoading(true);
      setStatus("Uploading…");
      setMode("cutout");

      try {
        const queued = await submitBackgroundRemoval(file);
        setStatus("Queued…");
        const done = await pollBackgroundRemovalJob(queued.job_id, (s) => {
          if (s.status === "processing") setStatus("Removing background…");
        });
        if (!done.result_url) throw new Error("No result URL");
        const blob = await fetchResultBlob(done.result_url);
        setCutoutBlob(blob);
        setCutoutUrl(URL.createObjectURL(blob));
        setCompletedJobId(done.job_id);
        setHasResult(true);
        setStatus("Done");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Background removal failed.",
        );
        revokeUrls();
      } finally {
        setLoading(false);
      }
    },
    [revokeUrls, user],
  );

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void processFile(file);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (!user) return;
      const item = [...(event.clipboardData?.items || [])].find((i) =>
        i.type.startsWith("image/"),
      );
      const file = item?.getAsFile();
      if (file) void processFile(file);
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [processFile, user]);

  useEffect(() => {
    if (pendingBgId === 0 || authLoading) return;
    const file = consumePendingBgFile();
    if (!file) return;
    if (user) {
      void processFile(file);
      return;
    }
    heldFile.current = file;
    setHasHeldShare(true);
  }, [pendingBgId, consumePendingBgFile, authLoading, user, processFile]);

  useEffect(() => {
    if (!user || !heldFile.current) return;
    const file = heldFile.current;
    heldFile.current = null;
    setHasHeldShare(false);
    void processFile(file);
  }, [user, processFile]);

  const download = () => {
    if (!cutoutBlob || !cutoutUrl) return;
    const a = document.createElement("a");
    a.href = cutoutUrl;
    a.download = `${fileName}-nobg.png`;
    a.click();
    if (shouldShowCanvaPromo()) {
      setCanvaPromoOpen(true);
    }
  };

  const reset = () => {
    revokeUrls();
    setError("");
    setStatus("");
    setMode("cutout");
  };

  return (
    <div className="surface-grain min-h-screen text-foreground">
      <CanvaPromoModal
        open={canvaPromoOpen}
        onClose={() => setCanvaPromoOpen(false)}
        context={{
          jobId: completedJobId ?? undefined,
          shareUrl: completedJobId ? shareUrlForJob(completedJobId) : undefined,
          title: `${fileName}-nobg`,
          mediaType: "image",
        }}
      />
      <SiteHeader />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6">

        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Unmark Tools
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Background removal
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Upload a photo. Unmark cuts out the subject so you can download a
            transparent PNG — portraits, products, and AI stills.
          </p>
        </section>

        {!user && !authLoading ? (
          <div className="mx-auto mt-10 max-w-md text-center">
            <p className="text-sm text-muted">
              {hasHeldShare
                ? "Image is ready. Sign in so Unmark can remove the background and save it to Library."
                : "Sign in so your cutout can be processed and saved to Library."}
            </p>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="mt-4 bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Sign in with Google
            </button>
          </div>
        ) : null}

        {user && !hasResult ? (
          <div className="mx-auto mt-10 max-w-2xl">
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragging(false);
              }}
              onDrop={onDrop}
              className={`flex min-h-[260px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-ink bg-surface px-6 py-12 text-center transition ${
                dragging ? "bg-peach/30" : "hover:bg-cream"
              }`}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center bg-cobalt text-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
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
              <p className="font-display text-xl font-semibold">Upload image</p>
              <p className="mt-2 text-sm text-muted">
                or drop a file · paste from clipboard
              </p>
              <p className="mt-1 text-xs text-muted">
                PNG, JPG, WebP · up to 25 MB · Cloud queue
              </p>
            </div>
            {error ? (
              <p className="mt-3 text-center text-sm text-danger">{error}</p>
            ) : null}
            {loading ? (
              <p className="mt-3 text-center text-sm text-muted">{status}</p>
            ) : null}
          </div>
        ) : null}

        {user && hasResult ? (
          <div className="mx-auto mt-8 max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(["cutout", "original", "compare"] as ViewMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`border px-3 py-1.5 text-xs font-semibold capitalize transition ${
                      mode === m
                        ? "border-brand bg-cream text-brand-hover"
                        : "border-border bg-surface text-muted hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {status ? (
                  <span className="text-xs text-muted">{status}</span>
                ) : null}
                <button
                  type="button"
                  onClick={reset}
                  className="border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-foreground"
                >
                  New image
                </button>
                <button
                  type="button"
                  onClick={download}
                  disabled={!cutoutBlob}
                  className="bg-brand px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-hover disabled:opacity-50"
                >
                  Download PNG
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden border border-border bg-surface shadow-sm">
              {loading ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
                  <p className="text-sm text-muted">{status || "Processing…"}</p>
                </div>
              ) : mode === "compare" ? (
                <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-2">
                  <div className="relative flex items-center justify-center bg-background p-6">
                    <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Original
                    </span>
                    {originalUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={originalUrl}
                        alt="Original"
                        className="max-h-[min(60vh,520px)] max-w-full object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="checkerboard relative flex items-center justify-center p-6">
                    <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Cutout
                    </span>
                    {cutoutUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cutoutUrl}
                        alt="Cutout"
                        className="max-h-[min(60vh,520px)] max-w-full object-contain"
                      />
                    ) : null}
                  </div>
                </div>
              ) : (
                <div
                  className={`flex min-h-[420px] items-center justify-center p-6 ${
                    mode === "cutout" ? "checkerboard" : "bg-background"
                  }`}
                >
                  {(mode === "original" ? originalUrl : cutoutUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mode === "original" ? originalUrl! : cutoutUrl!}
                      alt={mode === "original" ? "Original" : "Cutout"}
                      className="max-h-[min(60vh,520px)] max-w-full object-contain"
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/bmp,image/tiff"
          className="hidden"
          onChange={onFileChange}
        />

        <section className="mx-auto mt-16 max-w-3xl border-t border-border/80 pt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            What you get
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            Unmark background removal keeps the subject and drops the rest so
            you can drop the PNG onto a new backdrop, a slide, or a product
            listing. Sign in so the cutout can save to Library alongside your
            cleaned Gemini stills.
          </p>
          <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight">
            How to cut out a photo
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-muted-strong">
            <li>Sign in on Unmark.</li>
            <li>Drop a PNG, JPG, or WebP (up to 25 MB).</li>
            <li>Wait for the cutout, then download the transparent PNG.</li>
          </ol>
          <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight">
            Best files to upload
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            A single subject on a simple background works best — a person, a
            product, or an AI still. Busy collages and tiny subjects in the
            corner are harder. For Gemini sparkle removal, use Instant or Cloud
            on the homepage first, then cut out the cleaned file here.
          </p>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
