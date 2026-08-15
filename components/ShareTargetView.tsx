"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useDropToClean } from "@/lib/dropToClean";
import { isImageFile, isVideoFile, mediaFilesFromList } from "@/lib/mediaFiles";
import {
  clearIncomingShare,
  readIncomingShare,
  writeIncomingShare,
} from "@/lib/shareInbox";

export default function ShareTargetView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const needPwa = searchParams.get("need_pwa") === "1";
  const { incomingId, offerCleanFiles, offerBgFile } = useDropToClean();
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [canInstall, setCanInstall] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  const previewUrl = useMemo(() => {
    const image = files.find(isImageFile);
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [files]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    try {
      const incoming = await readIncomingShare();
      setFiles(incoming ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInbox();
  }, [incomingId, loadInbox]);

  useEffect(() => {
    const standaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setStandalone(standaloneMode);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const takeFiles = (next: File[]) => {
    const media = mediaFilesFromList(next, 10);
    setFiles(media);
    if (media.length > 0) {
      void writeIncomingShare(media);
    }
  };

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    takeFiles(Array.from(event.target.files || []));
    event.target.value = "";
  };

  const chooseClean = async () => {
    if (files.length === 0) return;
    await clearIncomingShare();
    offerCleanFiles(files);
    router.push("/#upload");
  };

  const chooseBgRemove = async () => {
    const image = files.find(isImageFile);
    if (!image) return;
    await clearIncomingShare();
    offerBgFile(image);
    router.push("/tools/background-removal");
  };

  const installApp = async () => {
    const prompt = deferredPrompt.current;
    if (!prompt) return;
    setInstalling(true);
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } finally {
      deferredPrompt.current = null;
      setCanInstall(false);
      setInstalling(false);
    }
  };

  const hasVideo = files.some(isVideoFile);
  const hasImage = files.some(isImageFile);

  return (
    <div className="surface-grain min-h-screen text-foreground">
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-5 sm:px-6">
        <SiteHeader />

        <section className="mx-auto mt-10 max-w-xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Open with Unmark
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            What should we do?
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            Share a photo from any app, then pick Clean or background remove.
          </p>
        </section>

        {needPwa && files.length === 0 ? (
          <p className="mx-auto mt-6 max-w-md text-center text-sm text-danger">
            Install Unmark on your home screen first so shares land here instead
            of a browser tab.
          </p>
        ) : null}

        <div className="mx-auto mt-8 max-w-xl">
          {loading ? (
            <p className="text-center text-sm text-muted">Loading shared image…</p>
          ) : files.length === 0 ? (
            <div className="border border-border bg-surface/90 p-6 text-center">
              <p className="text-sm text-muted">
                No image yet. On Android Chrome, install Unmark, then use Share
                → Unmark from Photos, WhatsApp, Files, or Gemini.
              </p>
              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-ink bg-brand px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
                >
                  Choose a photo
                </button>
                {canInstall && !standalone ? (
                  <button
                    type="button"
                    onClick={() => void installApp()}
                    disabled={installing}
                    className="border-2 border-ink bg-peach px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition hover:brightness-95 disabled:opacity-60"
                  >
                    {installing ? "Installing…" : "Install Unmark"}
                  </button>
                ) : null}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                On iPhone, install the Unmark app, then Share → Unmark from
                Photos or any app.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden border border-border bg-surface">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt={files[0]?.name || "Shared image"}
                    className="mx-auto max-h-[min(50vh,420px)] w-full object-contain bg-background"
                  />
                ) : (
                  <div className="flex min-h-[180px] items-center justify-center px-6 text-sm text-muted">
                    {files[0]?.name || "Shared file"}
                  </div>
                )}
              </div>
              <p className="mt-3 text-center text-xs text-muted">
                {files.length === 1
                  ? files[0]?.name
                  : `${files.length} files ready`}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void chooseClean()}
                  className="border-2 border-ink bg-cobalt px-4 py-4 text-left text-white transition hover:brightness-110"
                >
                  <span className="block text-sm font-semibold">Clean</span>
                  <span className="mt-1 block text-xs text-white/80">
                    Remove the Gemini sparkle
                    {hasVideo ? " from this video" : ""}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void chooseBgRemove()}
                  disabled={!hasImage}
                  className="border-2 border-ink bg-surface px-4 py-4 text-left transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="block text-sm font-semibold text-foreground">
                    Remove background
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {hasImage
                      ? "Transparent PNG cutout"
                      : "Images only — not available for video"}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-4 w-full text-center text-xs font-semibold text-muted transition hover:text-foreground"
              >
                Choose a different file
              </button>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          multiple
          className="hidden"
          onChange={onPick}
        />

        <SiteFooter />
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
