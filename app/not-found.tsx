import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <p className="font-mono text-sm font-semibold tabular-nums text-brand">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
          This page went missing.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
          The sparkle isn&apos;t the only thing Unmark can clean up — this
          page just isn&apos;t here. Try the homepage or one of the tools
          below.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_10px_20px_-8px_rgb(var(--shadow-color)/0.3)] transition hover:bg-brand-hover"
          >
            Back to Unmark
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-sand"
          >
            Browse tools
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
