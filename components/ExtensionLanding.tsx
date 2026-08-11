import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { CHROME_WEB_STORE_URL } from "@/lib/seo";

const heroBenefits = [
  {
    title: "Queue prompts, unmark automatically",
    body: "Paste a list of prompts, generate on Gemini or Google Flow, and download cleaned PNGs.",
    icon: "sparkle" as const,
  },
  {
    title: "Fits Gemini and Google Flow",
    body: "Side panel stays open while you work — capture the latest image or run a full queue.",
    icon: "puzzle" as const,
  },
  {
    title: "Cloud credits & Library",
    body: "Sign in on Unmark so extension jobs use your credits and can land in Library.",
    icon: "shield" as const,
  },
];

const installSteps = [
  {
    title: "Open the store page",
    body: "Visit Unmark for Gemini on the Chrome Web Store.",
    icon: "store" as const,
  },
  {
    title: "Add to Chrome",
    body: "Click Add to Chrome and confirm the install.",
    icon: "chrome" as const,
  },
  {
    title: "Open Gemini or Flow",
    body: "The side panel detects the page and can capture or queue generations.",
    icon: "sparkle" as const,
  },
  {
    title: "Sign in & run",
    body: "Stay signed in on Unmark so credits apply, then start a queue or capture.",
    icon: "toggle" as const,
  },
];

const geminiChanges = [
  {
    title: "Prompt queue on the page",
    body: "Send prompts one by one to Gemini or Google Flow without leaving the tab.",
    icon: "sparkle" as const,
  },
  {
    title: "Capture & unmark",
    body: "Grab the latest generated image, remove the sparkle with Unmark Auto, download the clean file.",
    icon: "image" as const,
  },
  {
    title: "Side-panel controls",
    body: "Pause between prompts, auto-download, serial filenames, and environment settings.",
    icon: "toggle" as const,
  },
  {
    title: "Complement the web app",
    body: "Already-downloaded images? Clean them on unmark.ink Instant, or use the unmark CLI from the repo.",
    icon: "terminal" as const,
  },
];

export default function ExtensionLanding() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-8 pt-5 sm:px-6">
        <SiteHeader />

        <section className="relative mx-auto mt-14 max-w-3xl text-center sm:mt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 -z-10 mx-auto h-56 max-w-2xl opacity-80"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(199,123,54,0.22),transparent_68%)]" />
            <div className="absolute left-1/2 top-1/2 h-px w-[120%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
            <div className="absolute left-1/2 top-[58%] h-px w-[100%] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-line/40 to-transparent" />
          </div>

          <div className="animate-rise inline-flex items-center gap-2.5">
            <BrandLogo size={40} />
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Unmark
            </span>
          </div>

          <h1 className="animate-rise-delay mt-6 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] md:leading-[1.1]">
            Chrome extension for Gemini
          </h1>
          <p className="animate-rise-delay mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Queue prompts on Gemini or Google Flow, remove the sparkle with
            Unmark, and download clean images — without leaving the page.
          </p>

          <div className="animate-rise-delay-2 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={CHROME_WEB_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              <ChromeIcon />
              Add to Chrome
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border border-border bg-surface/80 px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-brand-line hover:text-brand"
            >
              <DownloadIcon />
              Use online remover
            </Link>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Free on the Chrome Web Store. Sign in on Unmark so credits apply.
          </p>
        </section>

        <section className="mx-auto mt-16 grid max-w-4xl gap-10 border-t border-border/80 pt-14 sm:mt-20 sm:grid-cols-3 sm:gap-8">
          {heroBenefits.map((item, i) => (
            <div
              key={item.title}
              className="text-center sm:text-left"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center border border-border bg-cream text-foreground sm:mx-0">
                <FeatureIcon name={item.icon} />
              </div>
              <h2 className="mt-4 text-base font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </section>
      </div>

      <section
        id="install"
        className="border-t border-border/80 bg-surface/40"
      >
        <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Installation
            </h2>
            <p className="mt-3 text-base text-muted">
              Recommended via Chrome Web Store — four steps to start.
            </p>
          </div>

          <ol className="mx-auto mt-14 grid max-w-4xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {installSteps.map((step, index) => (
              <li key={step.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-foreground">
                  <FeatureIcon name={step.icon} />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                  Step {index + 1}
                </p>
                <h3 className="mt-1.5 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-12 flex max-w-2xl items-start gap-3 border border-border bg-cream/80 px-4 py-3.5 text-left sm:px-5">
            <span className="mt-0.5 shrink-0 text-brand">
              <FeatureIcon name="shield" />
            </span>
            <p className="text-sm leading-relaxed text-muted">
              Install from the{" "}
              <a
                href={CHROME_WEB_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand underline-offset-2 hover:underline"
              >
                Chrome Web Store
              </a>{" "}
              for auto-updates, then sign in on Unmark so extension jobs use
              your credits and can land in Library.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/80">
        <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              What changes on Gemini
            </h2>
            <p className="mt-3 text-base text-muted">
              Stay in Gemini or Google Flow and get clean images directly.
            </p>
          </div>

          <ul className="mx-auto mt-14 grid max-w-3xl gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-12">
            {geminiChanges.map((item) => (
              <li key={item.title} className="flex gap-4 text-left">
                <div className="mt-0.5 shrink-0 text-foreground">
                  <FeatureIcon name={item.icon} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border/80">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <span className="select-none font-display text-[16vw] font-semibold leading-none tracking-tight text-brand/[0.07] sm:text-[12vw]">
            EXTEND
          </span>
        </div>
        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-24">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Clean while you generate.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Prefer a single download? Use Instant on the homepage — free, private,
            no extension required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a
              href={CHROME_WEB_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              <ChromeIcon />
              Add to Chrome
            </a>
            <Link
              href="/privacy"
              className="text-sm font-medium text-muted transition hover:text-brand"
            >
              Privacy & extension data
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FeatureIcon({
  name,
}: {
  name: "sparkle" | "puzzle" | "shield" | "store" | "chrome" | "toggle" | "image" | "terminal";
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "sparkle":
      return (
        <svg {...common}>
          <path
            d="M12 3.5c.35 2.8 1.7 4.15 4.5 4.5-2.8.35-4.15 1.7-4.5 4.5-.35-2.8-1.7-4.15-4.5-4.5 2.8-.35 4.15-1.7 4.5-4.5z"
            strokeLinejoin="round"
          />
          <path d="M18.5 14.5c.2 1.5.9 2.2 2.4 2.4-1.5.2-2.2.9-2.4 2.4-.2-1.5-.9-2.2-2.4-2.4 1.5-.2 2.2-.9 2.4-2.4z" />
        </svg>
      );
    case "puzzle":
      return (
        <svg {...common}>
          <path
            d="M8 4h4v2.2a1.8 1.8 0 103.6 0V4H18a2 2 0 012 2v4h-2.2a1.8 1.8 0 100 3.6H20v4a2 2 0 01-2 2h-4v-2.2a1.8 1.8 0 10-3.6 0V20H8a2 2 0 01-2-2v-4h2.2a1.8 1.8 0 100-3.6H6V6a2 2 0 012-2z"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 3.5l7 2.5v5.2c0 4.2-2.8 7.4-7 9.3-4.2-1.9-7-5.1-7-9.3V6l7-2.5z"
            strokeLinejoin="round"
          />
          <path d="M9.5 12.2l1.8 1.8 3.4-3.6" strokeLinecap="round" />
        </svg>
      );
    case "store":
      return (
        <svg {...common}>
          <path d="M4.5 9.5h15v10a1 1 0 01-1 1h-13a1 1 0 01-1-1v-10z" />
          <path d="M4 9.5l1.5-5h13L20 9.5" strokeLinejoin="round" />
          <path d="M9.5 20.5v-5h5v5" />
        </svg>
      );
    case "chrome":
      return <ChromeIcon size={20} />;
    case "toggle":
      return (
        <svg {...common}>
          <rect x="3.5" y="8" width="17" height="8" rx="4" />
          <circle cx="15.5" cy="12" r="2.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M3.5 15.5l4.5-3.5 3 2.5 3.5-4 6 5" strokeLinejoin="round" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <path d="M5 8.5l4.5 3.5L5 15.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.5 15.5H19" strokeLinecap="round" />
        </svg>
      );
  }
}

function ChromeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
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

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4v10.5M8 11.5l4 4 4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
