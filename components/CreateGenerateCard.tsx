"use client";

import { useEffect, useRef, useState } from "react";
import { generateImage, getJobStatus } from "@/lib/api";
import FeedbackButtons from "@/components/FeedbackButtons";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/lib/credits";
import { useToast } from "@/components/Toast";
import {
  GENERATE_ASPECTS,
  GENERATE_MODELS,
  GENERATE_WEB_ENABLED,
  creditPluralSuffix,
} from "@/lib/generate";

const MAX_POLL = 120;

interface CreateGenerateCardProps {
  initialAttachment?: File | null;
  onAttachmentConsumed?: () => void;
}

export default function CreateGenerateCard({
  initialAttachment,
  onAttachmentConsumed,
}: CreateGenerateCardProps = {}) {
  const { user, loginWithGoogle } = useAuth();
  const { createCredits, refreshCredits } = useCredits();
  const { toast } = useToast();
  const attachInputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(GENERATE_MODELS[0].id);
  const [selectedAspect, setSelectedAspect] = useState<string>(GENERATE_ASPECTS[0]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLabel, setStatusLabel] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultJobId, setResultJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAttachChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (!file) return;
    setAttachment(file);
    const url = URL.createObjectURL(file);
    setAttachmentPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const clearAttachment = () => {
    setAttachment(null);
    setAttachmentPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  useEffect(() => {
    if (!initialAttachment) return;
    setAttachment(initialAttachment);
    const url = URL.createObjectURL(initialAttachment);
    setAttachmentPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    onAttachmentConsumed?.();
  }, [initialAttachment, onAttachmentConsumed]);

  const activeModel =
    GENERATE_MODELS.find((m) => m.id === selectedModel) ?? GENERATE_MODELS[0];

  const canGenerate =
    GENERATE_WEB_ENABLED && prompt.trim().length > 0 && !loading;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    if (!user) {
      loginWithGoogle();
      return;
    }

    if ((createCredits ?? 0) < activeModel.credits) {
      setError(
        `You need ${activeModel.credits} Create credit${creditPluralSuffix(activeModel.credits)} (purchased). Daily free credits are for Clean only.`,
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResultUrl(null);
    setStatusLabel("Starting…");

    try {
      const job = await generateImage({
        prompt: prompt.trim(),
        model_id: selectedModel,
        aspect_ratio: selectedAspect,
        attachment,
      });

      void refreshCredits();
      setStatusLabel(
        attachment
          ? `Generating from your photo with ${activeModel.label}…`
          : `Generating with ${activeModel.label}…`,
      );

      for (let attempt = 0; attempt < MAX_POLL; attempt++) {
        const status = await getJobStatus(job.job_id);

        if (status.status === "completed") {
          if (!status.result_url) throw new Error("No result URL returned.");
          setResultUrl(status.result_url);
          setResultJobId(job.job_id);
          setStatusLabel(null);
          void refreshCredits();
          toast("Image ready.", "success");
          setLoading(false);
          return;
        }

        if (status.status === "failed") {
          throw new Error(status.error || "Generation failed.");
        }

        await new Promise<void>((r) => setTimeout(r, 1500));
      }

      throw new Error("Generation timed out. Please try again.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate image.";
      setError(message);
      setStatusLabel(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResultUrl(null);
    setResultJobId(null);
    setError(null);
    setPrompt("");
    clearAttachment();
  };

  if (!GENERATE_WEB_ENABLED) {
    return (
      <div className="unmark-glass flex min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
          Coming soon
        </p>
        <p className="font-display text-xl font-semibold text-foreground">
          Create on the web
        </p>
        <p className="text-sm leading-relaxed text-muted">
          Prompt Nano Banana and get images without the Gemini sparkle.
        </p>
      </div>
    );
  }

  /* Result view */
  if (resultUrl) {
    return (
      <div className="unmark-glass overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resultUrl}
          alt="Generated image"
          className="w-full object-contain"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-medium text-muted transition hover:text-foreground"
            >
              Generate another
            </button>
            {resultJobId ? <FeedbackButtons jobId={resultJobId} /> : null}
          </div>
          <a
            href={resultUrl}
            download="unmark-create.png"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.98]"
          >
            Download
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="unmark-glass p-4 sm:p-5">
      {/* Prompt */}
      <label htmlFor="create-prompt" className="sr-only">
        Prompt
      </label>
      <textarea
        id="create-prompt"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="A cinematic still of a copper teapot on sand linen, soft window light…"
        disabled={loading}
        className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-surface px-3.5 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-50"
      />

      {/* Attachment */}
      <input
        ref={attachInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAttachChange}
      />
      {attachmentPreview && attachment ? (
        <div className="mt-3 flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={attachmentPreview}
            alt="Reference photo"
            className="h-14 w-14 shrink-0 rounded-[var(--radius-sm)] border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Reference photo</p>
            <p className="text-xs text-muted">Sent with your prompt</p>
            <button
              type="button"
              disabled={loading}
              onClick={clearAttachment}
              className="mt-1 text-xs font-medium text-brand transition hover:text-brand-hover disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => attachInputRef.current?.click()}
          className="mt-3 flex w-full items-center gap-2.5 rounded-[var(--radius-md)] border border-border bg-surface px-3.5 py-3 transition hover:bg-cream disabled:opacity-50"
        >
          <PlusIcon />
          <span className="text-[13px] font-semibold uppercase tracking-wide text-foreground">
            Attach photo
          </span>
          <span className="ml-auto text-xs text-muted">Optional</span>
        </button>
      )}

      {/* Model */}
      <p className="mt-4 text-[13px] font-semibold text-muted-strong">
        Model
      </p>
      <div className="mt-2 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
        {GENERATE_MODELS.map((option, index) => (
          <button
            key={option.id}
            type="button"
            disabled={loading}
            onClick={() => setSelectedModel(option.id)}
            className={`flex w-full items-center justify-between px-3.5 py-3 text-left transition ${
              index > 0 ? "border-t border-border" : ""
            } ${
              selectedModel === option.id
                ? "bg-brand-soft/60 dark:bg-brand/10"
                : "hover:bg-cream"
            } disabled:opacity-50`}
          >
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                {option.label}
              </p>
              <p className="text-xs text-muted">{option.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-strong">
                {option.credits} credit{creditPluralSuffix(option.credits)}
              </span>
              <span
                className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${
                  selectedModel === option.id
                    ? "border-brand bg-brand"
                    : "border-border"
                }`}
                aria-hidden
              />
            </div>
          </button>
        ))}
      </div>

      {/* Aspect ratio */}
      <p className="mt-4 text-[13px] font-semibold text-muted-strong">
        Aspect ratio
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {GENERATE_ASPECTS.map((ratio) => (
          <button
            key={ratio}
            type="button"
            disabled={loading}
            onClick={() => setSelectedAspect(ratio)}
            className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition active:scale-95 disabled:opacity-50 ${
              selectedAspect === ratio
                ? "border-brand bg-brand text-white"
                : "border-border bg-surface text-foreground hover:bg-cream"
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>

      {/* Error */}
      {error ? (
        <p className="mt-3 rounded-[var(--radius-sm)] bg-danger-bg px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {/* Generate button */}
      <button
        type="button"
        onClick={() => void handleGenerate()}
        disabled={!canGenerate}
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-md)] bg-brand px-4 py-3.5 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_8px_16px_-6px_rgb(var(--shadow-color)/0.3)] transition hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <SpinnerIcon />
            {statusLabel ?? "Generating…"}
          </>
        ) : (
          <>
            <SparkleIcon />
            Generate
          </>
        )}
      </button>

      <p className="mt-2.5 text-center text-xs text-muted">
        {activeModel.credits} Create credit
        {creditPluralSuffix(activeModel.credits)} for {activeModel.label} ·
        images without the Gemini sparkle.
      </p>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="15" height="15" viewBox="-8 -8 16 16" fill="none" aria-hidden>
      <path
        d="M0 -6.5 C 0.3 -1.8 1.8 -0.3 6.5 0 C 1.8 0.3 0.3 1.8 0 6.5 C -0.3 1.8 -1.8 0.3 -6.5 0 C -1.8 -0.3 -0.3 -1.8 0 -6.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
