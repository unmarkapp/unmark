import Link from "next/link";

import { CHROME_WEB_STORE_URL } from "@/lib/seo";

const steps = [
  {
    label: "Install",
    body: "Add Unmark for Gemini from the Chrome Web Store in one click.",
  },
  {
    label: "Generate",
    body: "Open Gemini or Google Flow and create images or video as usual.",
  },
  {
    label: "Clean",
    body: "Unmark removes the sparkle and downloads the clean file automatically.",
  },
];

export default function ExtensionInstall() {
  return (
    <section
      id="extension"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16">
        {/* Left: header + steps */}
        <div>
          <h2 className="animate-section-reveal font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            Unmark while you generate
          </h2>
          <p className="animate-section-reveal mt-4 max-w-md text-base leading-relaxed text-muted">
            Stay on Gemini or Google Flow. The extension cleans as you generate and
            saves the file automatically. For video and background cutouts, use{" "}
            <Link
              href="/"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              unmark.ink
            </Link>
            .
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.label}
                className="animate-section-reveal flex flex-col gap-3 bg-surface px-5 py-6"
              >
                <span className="font-display text-sm font-semibold text-brand">
                  {step.label}
                </span>
                <p className="text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex flex-col items-start gap-3 lg:pt-2">
          <a
            href={CHROME_WEB_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[var(--radius-md)] bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[0_1px_2px_rgb(var(--shadow-color)/0.08)] transition hover:opacity-85 active:scale-[0.98]"
          >
            <ChromeIcon />
            Add to Chrome
          </a>
          <p className="max-w-[18ch] text-xs leading-relaxed text-muted">
            Free on the Chrome Web Store.
          </p>
        </div>
      </div>
    </section>
  );
}

function ChromeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 8c6.2 0 11.5 3.5 14.1 8.6L29.5 24H24V8z" />
      <path fill="#FBBC04" d="M9.9 16.6C12.5 11.5 17.8 8 24 8v16H14.5L9.9 16.6z" />
      <path fill="#34A853" d="M24 40c-6.2 0-11.5-3.5-14.1-8.6L14.5 24H24v16z" />
      <path fill="#4285F4" d="M38.1 31.4C35.5 36.5 30.2 40 24 40V24h9.5l4.6 7.4z" />
      <circle cx="24" cy="24" r="7.5" fill="#fff" />
      <circle cx="24" cy="24" r="5" fill="#4285F4" />
    </svg>
  );
}
