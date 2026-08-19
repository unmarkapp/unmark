"use client";

import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/lib/auth";
import {
  fetchPdfResultBlob,
  pollPdfWatermarkJob,
  submitPdfWatermark,
} from "@/lib/pdf-watermark";

export default function PdfWatermarkTool() {
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const heldFile = useRef<File | null>(null);
  const [hasHeldShare, setHasHeldShare] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [fileName, setFileName] = useState("document");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [summary, setSummary] = useState("");

  const revokeUrls = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultBlob(null);
    setHasResult(false);
    setSummary("");
  }, [resultUrl]);

  const processFile = useCallback(
    async (file: File) => {
      if (!user) {
        setError("Sign in to clean a PDF.");
        return;
      }
      if (!isPdfFile(file)) {
        setError("Please choose a PDF file.");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError("File is too large (max 20 MB).");
        return;
      }

      setError("");
      revokeUrls();
      setFileName(file.name.replace(/\.pdf$/i, "") || "document");
      setLoading(true);
      setStatus("Cleaning PDF…");

      try {
        const queued = await submitPdfWatermark(file);
        setStatus(
          queued.status === "completed" ? "Saving…" : "Inspecting PDF…",
        );
        const done = await pollPdfWatermarkJob(queued.job_id, (s) => {
          if (s.status === "processing") setStatus("Removing overlay marks…");
        });
        if (!done.result_url) throw new Error("No result URL");
        const blob = await fetchPdfResultBlob(done.result_url);
        setResultBlob(blob);
        setResultUrl(URL.createObjectURL(blob));
        setSummary(
          typeof done.pdf_summary === "string" ? done.pdf_summary : "",
        );
        setHasResult(true);
        setStatus("Done");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "PDF watermark removal failed.",
        );
        revokeUrls();
      } finally {
        setLoading(false);
      }
    },
    [revokeUrls, user],
  );

  const holdOrProcess = (file: File) => {
    if (!isPdfFile(file)) {
      setError("Please choose a PDF file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File is too large (max 20 MB).");
      return;
    }
    if (user) {
      void processFile(file);
      return;
    }
    heldFile.current = file;
    setHasHeldShare(true);
    setError("");
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) holdOrProcess(file);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) holdOrProcess(file);
  };

  useEffect(() => {
    if (!user || !heldFile.current) return;
    const file = heldFile.current;
    heldFile.current = null;
    setHasHeldShare(false);
    void processFile(file);
  }, [user, processFile]);

  const download = () => {
    if (!resultBlob || !resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${fileName}-cleaned.pdf`;
    a.click();
  };

  const reset = () => {
    revokeUrls();
    setError("");
    setStatus("");
  };

  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6">
        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Unmark Tools
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            PDF watermark remover
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Upload a PDF you own. Unmark looks for overlay stamps, repeating
            marks, and watermark annotations, then rebuilds a clean file you
            can download from Library.
          </p>
        </section>

        {!user && !authLoading && hasHeldShare ? (
          <div className="mx-auto mt-10 max-w-md text-center">
            <p className="text-sm text-muted">
              PDF is ready. Sign in so Unmark can clean it and save it to
              Library.
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

        {!hasResult && !authLoading && (user || !hasHeldShare) ? (
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
                    d="M7 3h7l5 5v13H7V3z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3v5h5M9 13h6M9 17h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="font-display text-xl font-semibold">Upload PDF</p>
              <p className="mt-2 text-sm text-muted">or drop a file</p>
              <p className="mt-1 text-xs text-muted">
                PDF · up to 20 MB · up to 50 pages
                {user
                  ? " · 1 credit · saved to Library"
                  : " · sign in after you pick a file"}
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
              <p className="text-sm text-muted">
                {summary || "Cleaned PDF is ready."}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-foreground"
                >
                  New PDF
                </button>
                <button
                  type="button"
                  onClick={download}
                  disabled={!resultBlob}
                  className="bg-brand px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-hover disabled:opacity-50"
                >
                  Download PDF
                </button>
              </div>
            </div>
            <div className="overflow-hidden border border-border bg-surface shadow-sm">
              {resultUrl ? (
                <iframe
                  src={resultUrl}
                  title="Cleaned PDF preview"
                  className="h-[min(70vh,720px)] w-full bg-background"
                />
              ) : null}
            </div>
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={onFileChange}
        />

        <section className="mx-auto mt-16 max-w-3xl border-t border-border/80 pt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            What this removes
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            Overlay stamps, watermark annotations, optional-content marks, and
            repeating low-opacity or diagonal text that sits on top of the
            page. The file is rewritten so those objects are gone, then checked
            so page count and most of the body text still match.
          </p>
          <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight">
            What it does not remove yet
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            Marks burned into a scan or flattened into a full-page image. Those
            are pixels, not overlay objects. Encrypted PDFs are also skipped
            for now. Use this on documents you created or own — not to strip
            someone else’s copyright mark.
          </p>
          <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight">
            How to clean a PDF
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-muted-strong">
            <li>Drop a PDF (up to 20 MB, 50 pages) on this page.</li>
            <li>Sign in if Unmark asks — the file stays ready.</li>
            <li>Download the cleaned PDF. It is also saved to Library.</li>
          </ol>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" ||
    file.type === "application/x-pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}
