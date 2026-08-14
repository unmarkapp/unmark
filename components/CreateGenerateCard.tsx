"use client";

import { GENERATE_ASPECTS, GENERATE_MODELS, GENERATE_WEB_ENABLED } from "@/lib/generate";

export default function CreateGenerateCard() {
  const defaultModel = GENERATE_MODELS[0];

  return (
    <div className="relative overflow-hidden border border-border bg-surface/85 p-4 sm:p-5">
      <div
        className="pointer-events-none select-none opacity-55"
        aria-hidden
      >
        <label className="sr-only" htmlFor="create-prompt">
          Prompt
        </label>
        <textarea
          id="create-prompt"
          disabled
          rows={5}
          defaultValue=""
          placeholder="A cinematic still of a copper teapot on sand linen, soft window light…"
          className="w-full resize-none border border-border bg-surface px-3.5 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted"
        />

        <p className="mt-4 text-[13px] font-semibold text-muted-strong">
          Model
        </p>
        <div className="mt-2 border border-border bg-surface">
          {GENERATE_MODELS.map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center justify-between px-3.5 py-3 ${
                index === 0 ? "bg-cream/80" : ""
              } ${index > 0 ? "border-t border-border" : ""}`}
            >
              <div>
                <p className="text-[15px] font-semibold text-foreground">
                  {option.label}
                </p>
                <p className="text-xs text-muted">{option.subtitle}</p>
              </div>
              <span className="text-xs font-semibold text-muted-strong">
                {option.credits} credits
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[13px] font-semibold text-muted-strong">
          Aspect
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {GENERATE_ASPECTS.map((ratio, index) => (
            <span
              key={ratio}
              className={`border px-2.5 py-1.5 text-[13px] font-medium ${
                index === 0
                  ? "border-brand bg-cream text-brand"
                  : "border-border bg-surface text-foreground"
              }`}
            >
              {ratio}
            </span>
          ))}
        </div>

        <div className="mt-5 bg-brand/45 px-4 py-3.5 text-center text-[15px] font-semibold text-white">
          Generate &amp; clean
        </div>
        <p className="mt-2.5 text-center text-xs text-muted">
          {defaultModel.credits} credits for {defaultModel.label} · Gemini
          draws the image, Unmark removes the sparkle
        </p>
      </div>

      {!GENERATE_WEB_ENABLED ? (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/70 backdrop-blur-[1px]">
          <div className="mx-6 max-w-sm border border-brand-line bg-cream px-5 py-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand">
              Coming soon
            </p>
            <p className="mt-2 font-display text-xl font-semibold text-foreground">
              Create on the web
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Prompt Nano Banana, then Unmark removes the sparkle. This is live
              in the iOS app — web unlocks as soon as the API finishes rolling
              out.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
