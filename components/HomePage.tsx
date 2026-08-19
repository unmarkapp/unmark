"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import BulkQueueCard, {
  type BulkQueueItem,
} from "@/components/BulkQueueCard";
import LandingShell from "@/components/LandingShell";
import LandingUpload from "@/components/LandingUpload";
import ReadyToCleanCard from "@/components/ReadyToCleanCard";
import VideoCleanCard from "@/components/VideoCleanCard";
import {
  fetchSampleCleanFile,
  isSampleCleanFile,
} from "@/lib/sampleClean";

import {
  getJobStatus,
  removeWatermark,
  removeWatermarkBulk,
  removeWatermarkVideo,
  type JobStatusValue,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/lib/credits";
import { useToast } from "@/components/Toast";
import { useDropToClean } from "@/lib/dropToClean";
import { isVideoFile } from "@/lib/mediaFiles";
import type { CleanEngine } from "@/components/ReadyToCleanCard";

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MAX_FILES = 10;
const VIDEO_CREDIT_SECONDS = 5;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_VIDEO_DURATION_SEC = 60;

function videoCreditsForDuration(durationSec: number): number {
  if (durationSec <= 0) return 1;
  return Math.max(1, Math.ceil(durationSec / VIDEO_CREDIT_SECONDS));
}

function probeVideoMeta(
  file: File,
): Promise<{ duration: number; width: number; height: number; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration || 0,
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        url,
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video."));
    };
    video.src = url;
  });
}

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, loginWithGoogle } = useAuth();
  const { refreshCredits, fastCredits, dailyFreeCredits, paymentsEnabled } =
    useCredits();
  const { toast } = useToast();
  const { pendingId, consumePendingFiles } = useDropToClean();

  const outOfCreditsMessage = (needed?: number) => {
    if (paymentsEnabled) {
      if (needed && needed > 0) {
        return `You need ${needed} credit${needed === 1 ? "" : "s"}. Buy more from Account.`;
      }
      return "You’re out of credits. Buy more from Account to continue.";
    }
    const daily = dailyFreeCredits ?? 5;
    if (needed && needed > 0) {
      return `You need ${needed} credit${needed === 1 ? "" : "s"}. You get ${daily} free Cloud credits each day.`;
    }
    return `You’re out of credits for today. You get ${daily} free Cloud credits each day.`;
  };

  const [bulkItems, setBulkItems] = useState<BulkQueueItem[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkZipping, setBulkZipping] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [mediaKind, setMediaKind] = useState<"image" | "video">("image");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const [processing, setProcessing] = useState(false);
  const [sampleBusy, setSampleBusy] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] =
    useState<JobStatusValue | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [detectMode, setDetectMode] = useState<"auto" | "manual">("auto");
  const [engine, setEngine] = useState<CleanEngine>("instant");
  const [quality] = useState<"fast" | "high">("fast");

  const [imageDimensions, setImageDimensions] =
    useState<{
      width: number;
      height: number;
    } | null>(null);

  const pollingCancelled = useRef(false);
  const imageUrlRef = useRef<string | null>(null);
  const bulkPreviewUrls = useRef<string[]>([]);

  const clearResult = () => {
    setResultUrl((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  };

  const revokeCurrentImage = () => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }
  };

  const revokeBulkPreviews = () => {
    for (const url of bulkPreviewUrls.current) {
      URL.revokeObjectURL(url);
    }
    bulkPreviewUrls.current = [];
  };

  const revokeMedia = () => {
    revokeCurrentImage();
    setImageUrl(null);
    setVideoUrl(null);
    setVideoDuration(null);
    setImageDimensions(null);
  };

  const loadSelectedFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast("Please select an image.", "error");
      return;
    }

    revokeMedia();
    pollingCancelled.current = true;
    clearResult();

    setMediaKind("image");
    setFile(selectedFile);
    setJobId(null);
    setJobStatus(null);
    setError(null);
    setProcessing(false);
    setSelection(null);

    const url = URL.createObjectURL(selectedFile);
    const img = new Image();

    img.onload = () => {
      imageUrlRef.current = url;
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setImageUrl(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Failed to load image.");
    };

    img.src = url;
  };

  const loadSelectedVideo = async (selectedFile: File) => {
    if (selectedFile.size > MAX_VIDEO_BYTES) {
      toast("Video too large (max 100 MB).", "error");
      return;
    }

    revokeMedia();
    pollingCancelled.current = true;
    clearResult();

    setMediaKind("video");
    setFile(selectedFile);
    setEngine("cloud");
    setDetectMode("auto");
    setJobId(null);
    setJobStatus(null);
    setError(null);
    setProcessing(false);
    setSelection(null);

    try {
      const meta = await probeVideoMeta(selectedFile);
      if (meta.duration > MAX_VIDEO_DURATION_SEC + 0.5) {
        URL.revokeObjectURL(meta.url);
        setFile(null);
        toast(
          `Video too long (max ${MAX_VIDEO_DURATION_SEC}s). This clip is ~${meta.duration.toFixed(1)}s.`,
          "error",
        );
        return;
      }
      imageUrlRef.current = meta.url;
      setVideoUrl(meta.url);
      setVideoDuration(meta.duration);
      setImageDimensions({
        width: meta.width,
        height: meta.height,
      });
    } catch (err) {
      setFile(null);
      toast(
        err instanceof Error ? err.message : "Failed to load video.",
        "error",
      );
    }
  };

  const startWithFiles = (files: File[]) => {
    const videos = files.filter(isVideoFile);
    const images = files
      .filter((item) => item.type.startsWith("image/"))
      .slice(0, MAX_FILES);

    if (videos.length > 0 && images.length > 0) {
      toast("Choose either images or one video, not both.", "error");
      return;
    }

    if (videos.length > 1) {
      toast("Upload one video at a time.", "error");
      return;
    }

    if (videos.length === 1) {
      if (authLoading) {
        toast("One moment…");
        return;
      }
      revokeBulkPreviews();
      setBulkError(null);
      setBulkProcessing(false);
      setBulkItems([]);
      void loadSelectedVideo(videos[0]!);
      return;
    }

    if (images.length === 0) {
      toast("Please select an image or video.", "error");
      return;
    }

    if (images.length > MAX_FILES) {
      toast(`You can upload up to ${MAX_FILES} images.`, "error");
    }

    // Single image → Instant works without sign-in
    if (images.length === 1) {
      revokeBulkPreviews();
      setBulkError(null);
      setBulkProcessing(false);
      setBulkItems([]);
      setEngine("instant");
      setDetectMode("auto");
      loadSelectedFile(images[0]!);
      return;
    }

    // Multi → Cloud bulk (needs account)
    if (authLoading) {
      toast("One moment…");
      return;
    }

    if (!user) {
      toast(
        "Bulk cleanup needs Cloud sign-in. Drop one image to clean instantly without an account.",
        "error",
      );
      return;
    }

    revokeBulkPreviews();
    setBulkError(null);
    setBulkProcessing(false);
    revokeMedia();
    clearResult();
    setFile(null);
    setSelection(null);
    setDetectMode("auto");
    setMediaKind("image");

    const items: BulkQueueItem[] = images.map((imageFile, index) => {
      const previewUrl = URL.createObjectURL(imageFile);
      bulkPreviewUrls.current.push(previewUrl);
      return {
        id: `${imageFile.name}-${imageFile.size}-${index}-${Date.now()}`,
        file: imageFile,
        previewUrl,
        status: "ready",
      };
    });

    setBulkItems(items);
  };

  const startWithFilesRef = useRef(startWithFiles);
  startWithFilesRef.current = startWithFiles;

  useEffect(() => {
    if (pendingId === 0) return;
    const files = consumePendingFiles();
    if (files) startWithFilesRef.current(files);
  }, [pendingId, consumePendingFiles]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;
    startWithFiles(files);
  };

  const handleTrySample = async () => {
    setSampleBusy(true);
    try {
      const sample = await fetchSampleCleanFile();
      startWithFiles([sample]);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not load the sample image.",
        "error",
      );
    } finally {
      setSampleBusy(false);
    }
  };

  useEffect(() => {
    return () => {
      revokeCurrentImage();
      revokeBulkPreviews();
      pollingCancelled.current = true;
    };
  }, []);

  const waitForJob = async (
    id: string,
    onStatus?: (status: JobStatusValue) => void,
    options?: { allowVideo?: boolean; maxAttempts?: number },
  ) => {
    const maxAttempts = options?.maxAttempts ?? 120;
    const allowVideo = options?.allowVideo ?? false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (pollingCancelled.current) {
        return;
      }

      const job = await getJobStatus(id);

      if (pollingCancelled.current) {
        return;
      }

      onStatus?.(job.status);
      setJobStatus(job.status);

      if (job.status === "completed") {
        if (!job.result_url) {
          throw new Error(
            "Job completed but no result URL was returned.",
          );
        }

        try {
          const resultResponse = await fetch(job.result_url);

          if (!resultResponse.ok) {
            throw new Error(
              `Failed to download result (${resultResponse.status})`,
            );
          }

          const blob = await resultResponse.blob();
          const okType =
            blob.type.startsWith("image/") ||
            (allowVideo &&
              (blob.type.startsWith("video/") || blob.type === "application/mp4"));

          if (!okType) {
            throw new Error(
              allowVideo
                ? "Result URL did not return a media file."
                : "Result URL did not return an image.",
            );
          }

          setResultUrl(URL.createObjectURL(blob));
        } catch (downloadError) {
          console.warn(
            "Falling back to remote result URL:",
            downloadError,
          );
          setResultUrl(job.result_url);
        }

        void (async () => {
          for (const delay of [300, 800, 1500]) {
            await new Promise((r) => setTimeout(r, delay));
            await refreshCredits();
          }
        })();
        return;
      }

      if (job.status === "failed") {
        throw new Error(
          job.error || "Watermark removal failed.",
        );
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000);
      });
    }

    throw new Error(
      "Processing timed out. Please try again.",
    );
  };

  const updateBulkItem = (
    id: string,
    patch: Partial<BulkQueueItem>,
  ) => {
    setBulkItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  };

  const handleBulkRemove = async () => {
    if (bulkProcessing || bulkItems.length === 0) {
      return;
    }

    if (authLoading) {
      return;
    }

    if (!user) {
      loginWithGoogle();
      return;
    }

    const needed = bulkItems.length;
    if ((fastCredits ?? 0) < needed) {
      setBulkError(
        outOfCreditsMessage(needed),
      );
      return;
    }

    pollingCancelled.current = false;
    setBulkProcessing(true);
    setBulkError(null);

    setBulkItems((current) =>
      current.map((item) =>
        item.status === "completed"
          ? item
          : { ...item, status: "processing", error: null },
      ),
    );

    try {
      const pendingFiles = bulkItems
        .filter((item) => item.status !== "completed")
        .map((item) => item.file);

      const batch = await removeWatermarkBulk(pendingFiles, quality);
      void refreshCredits();

      let jobCursor = 0;
      const nextItems: BulkQueueItem[] = bulkItems.map((item) => {
        if (item.status === "completed") {
          return item;
        }

        const job = batch.jobs[jobCursor];
        jobCursor += 1;

        if (!job) {
          return {
            ...item,
            status: "failed",
            error: "Job was not created",
          };
        }

        return {
          ...item,
          jobId: job.job_id,
          status: "processing",
          error: null,
        };
      });

      setBulkItems(nextItems);

      const pending = nextItems.filter(
        (item) => item.jobId && item.status === "processing",
      );

      await Promise.all(
        pending.map(async (item) => {
          const jobId = item.jobId;
          if (!jobId) return;

          const maxAttempts = 120;
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (pollingCancelled.current) {
              return;
            }

            try {
              const status = await getJobStatus(jobId);

              if (status.status === "completed") {
                if (!status.result_url) {
                  updateBulkItem(item.id, {
                    status: "failed",
                    error: "No result URL",
                  });
                  return;
                }
                updateBulkItem(item.id, {
                  status: "completed",
                  error: null,
                  resultUrl: status.result_url,
                });
                return;
              }

              if (status.status === "failed") {
                updateBulkItem(item.id, {
                  status: "failed",
                  error: (status.error || "Failed").slice(0, 80),
                });
                return;
              }
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Status check failed";
              updateBulkItem(item.id, {
                status: "failed",
                error: message.slice(0, 80),
              });
              return;
            }

            await new Promise<void>((resolve) => {
              setTimeout(resolve, 1000);
            });
          }

          if (!pollingCancelled.current) {
            updateBulkItem(item.id, {
              status: "failed",
              error: "Timed out",
            });
          }
        }),
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to start bulk cloud cleanup.";

      setBulkItems((current) =>
        current.map((item) =>
          item.status === "processing"
            ? { ...item, status: "failed", error: message.slice(0, 80) }
            : item,
        ),
      );

      if (/library full/i.test(message)) {
        setBulkError(
          `${message} Free up space in Library or buy more storage in Account.`,
        );
        void refreshCredits();
      } else if (/insufficient|402|out of credits|need \d+/i.test(message)) {
        setBulkError(message);
        void refreshCredits();
      } else if (/sign in|unauthorized|401|invalid or expired/i.test(message)) {
        setBulkError("Please sign in for Cloud bulk, Library, and extension.");
      } else {
        setBulkError(message);
      }
    } finally {
      setBulkProcessing(false);
      void refreshCredits();
    }
  };

  const handleBulkDownloadZip = async () => {
    const completed = bulkItems.filter(
      (item) => item.status === "completed" && item.resultUrl,
    );
    if (completed.length === 0 || bulkZipping) {
      return;
    }

    setBulkZipping(true);
    setBulkError(null);

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const usedNames = new Set<string>();

      for (const item of completed) {
        const resultUrl = item.resultUrl;
        if (!resultUrl) continue;

        let baseName = item.file.name.replace(/\.[^.]+$/, "") || "cleaned";
        baseName = baseName.replace(/[^\w.\-]+/g, "_");
        let entryName = `${baseName}-cleaned.png`;
        let n = 2;
        while (usedNames.has(entryName)) {
          entryName = `${baseName}-cleaned-${n}.png`;
          n += 1;
        }
        usedNames.add(entryName);

        const proxy = `/api/download-result?url=${encodeURIComponent(resultUrl)}&filename=${encodeURIComponent(entryName)}`;
        const response = resultUrl.startsWith("blob:")
          ? await fetch(resultUrl)
          : await fetch(proxy);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${item.file.name}`);
        }
        const blob = await response.blob();
        zip.file(entryName, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const objectUrl = URL.createObjectURL(zipBlob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `unmark-gemini-${completed.length}.zip`;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create zip.";
      setBulkError(message);
    } finally {
      setBulkZipping(false);
    }
  };

  const handleRemoveVideo = async () => {
    if (!file || processing || mediaKind !== "video") {
      return;
    }

    if (authLoading) {
      return;
    }

    if (!user) {
      loginWithGoogle();
      return;
    }

    const needed = videoCreditsForDuration(videoDuration ?? 0);
    if ((fastCredits ?? 0) < needed) {
      setError(
        outOfCreditsMessage(needed),
      );
      return;
    }

    try {
      pollingCancelled.current = true;
      setProcessing(true);
      setError(null);
      clearResult();
      setJobId(null);
      setJobStatus("queued");

      const job = await removeWatermarkVideo(file);

      setJobId(job.job_id);
      setJobStatus(job.status);
      setProcessing(false);
      void refreshCredits();
      toast(
        job.notify_email
          ? "Video is cleaning — we’ll email you when it’s ready."
          : "Video is cleaning — follow it in Library.",
        "success",
      );
      router.push("/library");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to remove video watermark.";

      setProcessing(false);

      if (!user || /sign in|unauthorized|401|invalid or expired/i.test(message)) {
        setError("Please sign in to clean Gemini videos.");
        return;
      }

      if (/library full/i.test(message)) {
        setError(
          "Your Library is full. Delete old items or buy more storage in Account.",
        );
        void refreshCredits();
        return;
      }

      if (/insufficient|402|out of credits|need \d+/i.test(message)) {
        setError(message);
        void refreshCredits();
        return;
      }

      setError(message);
    }
  };

  const handleRemoveWatermark = async () => {
    if (!file || processing) {
      return;
    }

    if (mediaKind === "video") {
      await handleRemoveVideo();
      return;
    }

    if (
      detectMode === "manual" &&
      (!selection || selection.width <= 0 || selection.height <= 0)
    ) {
      return;
    }

    const useInstant = engine === "instant" && detectMode === "auto";

    if (!useInstant) {
      if (authLoading) {
        return;
      }

      if (!user) {
        loginWithGoogle();
        return;
      }

      if ((fastCredits ?? 0) < 1) {
        setError(outOfCreditsMessage());
        return;
      }
    }

    try {
      pollingCancelled.current = false;

      setProcessing(true);
      setError(null);
      clearResult();

      setJobId(null);
      setJobStatus(useInstant ? "processing" : "queued");

      if (useInstant) {
        const { getClientWatermarkEngine, resetClientWatermarkEngine } =
          await import("@/lib/client-watermark/engine");
        // Avoid stale singleton after hot reload during Instant iteration.
        resetClientWatermarkEngine();
        const client = await getClientWatermarkEngine();
        const result = await client.processFile(file);
        if (pollingCancelled.current) {
          return;
        }
        const url = URL.createObjectURL(result.blob);
        setResultUrl(url);
        setJobStatus("completed");
        setProcessing(false);
        const { trackEvent } = await import("@/lib/analytics");
        trackEvent("instant_clean", { method: "home" });
        toast("Cleaned — download now, or use Cloud to save to Library.", "success");
        return;
      }

      const job = await removeWatermark(
        file,
        detectMode === "manual" ? selection : null,
        quality,
      );

      if (pollingCancelled.current) {
        return;
      }

      setJobId(job.job_id);
      setJobStatus(job.status);

      await waitForJob(job.job_id);
      setProcessing(false);
      toast("Saved to your Library.", "success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to remove Gemini watermark.";

      setProcessing(false);

      if (engine === "instant" && detectMode === "auto") {
        setError(
          `${message} Try Cloud to save to Library, or use a different Gemini export.`,
        );
        return;
      }

      if (!user || /sign in|unauthorized|401|invalid or expired/i.test(message)) {
        setError("Please sign in to remove Gemini watermarks.");
        return;
      }

      if (/library full/i.test(message)) {
        setError(
          "Your Library is full. Delete old items or buy more storage in Account.",
        );
        void refreshCredits();
        return;
      }

      if (/insufficient|402|out of credits/i.test(message)) {
        setError(outOfCreditsMessage());
        void refreshCredits();
        return;
      }

      setError(message);
    }
  };

  const resetImage = () => {
    pollingCancelled.current = true;
    revokeMedia();
    revokeBulkPreviews();
    clearResult();

    setFile(null);
    setMediaKind("image");
    setSelection(null);
    setProcessing(false);
    setJobId(null);
    setJobStatus(null);
    setError(null);
    setBulkItems([]);
    setBulkProcessing(false);
    setBulkZipping(false);
    setBulkError(null);
  };

  const hasSelection = Boolean(
    selection &&
      selection.width > 0 &&
      selection.height > 0,
  );

  const estimatedVideoCredits = videoCreditsForDuration(videoDuration ?? 0);

  if (bulkItems.length > 0) {
    return (
      <LandingShell showHow={false}>
        <BulkQueueCard
          items={bulkItems}
          processing={bulkProcessing}
          zipping={bulkZipping}
          isAuthenticated={Boolean(user)}
          hasCredits={(fastCredits ?? 0) >= bulkItems.length}
          fastCredits={fastCredits}
          error={bulkError}
          onRemoveAll={() => {
            if (!user) {
              loginWithGoogle();
              return;
            }
            void handleBulkRemove();
          }}
          onDownloadZip={() => {
            void handleBulkDownloadZip();
          }}
          onReset={resetImage}
        />
      </LandingShell>
    );
  }

  if (mediaKind === "video" && file && videoUrl) {
    return (
      <LandingShell showHow={false}>
        <VideoCleanCard
          videoUrl={videoUrl}
          fileName={file.name}
          fileSize={file.size}
          durationSec={videoDuration}
          estimatedCredits={estimatedVideoCredits}
          processing={processing}
          statusLabel={processing ? "Uploading" : null}
          error={error}
          resultUrl={resultUrl}
          isAuthenticated={Boolean(user)}
          hasCredits={(fastCredits ?? 0) >= estimatedVideoCredits}
          onRemove={() => {
            void handleRemoveVideo();
          }}
          onReset={resetImage}
        />
      </LandingShell>
    );
  }

  if (!imageUrl || !file || !imageDimensions) {
    return (
      <LandingUpload
        onFileChange={handleFileChange}
        onTrySample={() => void handleTrySample()}
        sampleBusy={sampleBusy}
      />
    );
  }

  return (
    <LandingShell showHow={false}>
      <ReadyToCleanCard
        imageUrl={imageUrl}
        imageWidth={imageDimensions.width}
        imageHeight={imageDimensions.height}
        fileName={file.name}
        fileSize={file.size}
        isSample={isSampleCleanFile(file)}
        processing={processing}
        hasSelection={hasSelection}
        detectMode={detectMode}
        onDetectModeChange={(mode) => {
          setDetectMode(mode);
          if (mode === "auto") {
            setSelection(null);
          } else {
            setEngine("cloud");
          }
        }}
        engine={detectMode === "manual" ? "cloud" : engine}
        onEngineChange={setEngine}
        isAuthenticated={Boolean(user)}
        hasCredits={(fastCredits ?? 0) > 0}
        statusLabel={
          processing
            ? jobStatus === "processing"
              ? engine === "instant"
                ? "Instant"
                : "Cloud"
              : "Starting…"
            : `${imageDimensions.width} × ${imageDimensions.height}`
        }
        error={error}
        resultUrl={resultUrl}
        onSelectionChange={setSelection}
        onRemove={handleRemoveWatermark}
        onReset={resetImage}
      />

      {resultUrl && (
        <div className="mt-6 overflow-hidden border border-border bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center"
                style={{ background: "var(--brand)" }}
                aria-hidden
              >
                <svg width="18" height="18" viewBox="-12 -12 24 24" fill="none">
                  <path
                    d="M0 -9.2 C 0.42 -2.5 2.5 -0.42 9.2 0 C 2.5 0.42 0.42 2.5 0 9.2 C -0.42 2.5 -2.5 0.42 -9.2 0 C -2.5 -0.42 -0.42 -2.5 0 -9.2 Z"
                    fill="var(--brand-soft)"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="font-display text-sm font-semibold tracking-tight text-foreground">
                  Before / after
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  Sparkle out — drag the handle to compare
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Compare
            </div>
          </div>

          <div className="p-3 sm:p-4">
            <BeforeAfterSlider
              beforeUrl={imageUrl}
              afterUrl={resultUrl}
            />
          </div>
        </div>
      )}
    </LandingShell>
  );
}
