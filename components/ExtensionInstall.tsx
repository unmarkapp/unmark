import Link from "next/link";

import { CHROME_WEB_STORE_URL } from "@/lib/seo";

const steps = [
  {
    num: "01",
    title: "Install",
    body: "Add Unmark for Gemini from the Chrome Web Store.",
  },
  {
    num: "02",
    title: "Generate",
    body: "Open Gemini or Google Flow and create images as usual.",
  },
  {
    num: "03",
    title: "Clean",
    body: "Generate or capture the latest image — Unmark removes the sparkle and downloads the clean file.",
  },
];

export default function ExtensionInstall() {
  return (
    <section
      id="extension"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Chrome extension</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
          Unmark while you generate.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Stay on Gemini or Google Flow. The extension cleans as you generate
          and saves the file — no manual upload each time. For video watermark
          removal and background cutouts, use{" "}
          <Link
            href="/"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            unmark.ink
          </Link>
          .
        </p>
      </div>

      <ol className="mx-auto mt-14 grid max-w-3xl gap-8 sm:grid-cols-3 sm:gap-6">
        {steps.map((step) => (
          <li key={step.num} className="text-center sm:text-left">
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] font-mono text-sm font-semibold tabular-nums ${
                step.num === "01"
                  ? "bg-cobalt text-white"
                  : step.num === "02"
                    ? "bg-peach text-ink"
                    : "bg-brand text-white"
              }`}
            >
              {step.num}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col items-center gap-3">
        <a
          href={CHROME_WEB_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-md)] bg-cobalt px-6 py-3.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.08)] transition hover:brightness-110"
        >
          <ChromeIcon />
          Add to Chrome
          <span aria-hidden className="ml-1">
            →
          </span>
        </a>
        <p className="max-w-sm text-center text-xs leading-relaxed text-muted">
          Free on the Chrome Web Store. Works with Gemini and Google Flow.
        </p>
      </div>
    </section>
  );
}

function ChromeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 8c6.2 0 11.5 3.5 14.1 8.6L29.5 24H24V8z"
      />
      <path
        fill="#FBBC04"
        d="M9.9 16.6C12.5 11.5 17.8 8 24 8v16H14.5L9.9 16.6z"
      />
      <path
        fill="#34A853"
        d="M24 40c-6.2 0-11.5-3.5-14.1-8.6L14.5 24H24v16z"
      />
      <path
        fill="#4285F4"
        d="M38.1 31.4C35.5 36.5 30.2 40 24 40V24h9.5l4.6 7.4z"
      />
      <circle cx="24" cy="24" r="7.5" fill="#fff" />
      <circle cx="24" cy="24" r="5" fill="#4285F4" />
    </svg>
  );
}
