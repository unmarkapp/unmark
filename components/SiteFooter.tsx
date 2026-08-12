import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-6">
        <div className="flex max-w-md items-start gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <BrandLogo size={28} />
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              Unmark
            </span>
          </Link>
          <p className="pt-0.5 text-sm leading-relaxed text-muted">
            Unmark removes the Gemini sparkle watermark from images. Optimized
            for 16:9 and 9:16 Gemini exports.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-muted-strong">
            <Link href="/#compare" className="transition hover:text-brand">
              Before / after
            </Link>
            <Link href="/#how" className="transition hover:text-brand">
              How it works
            </Link>
            <Link href="/#faq" className="transition hover:text-brand">
              FAQ
            </Link>
            <Link
              href="/guides/remove-gemini-watermark"
              className="transition hover:text-brand"
            >
              Guide
            </Link>
            <Link
              href="/guides/mcp-server"
              className="transition hover:text-brand"
            >
              MCP
            </Link>
            <Link href="/extension" className="transition hover:text-brand">
              Extension
            </Link>
            <Link href="/tools" className="transition hover:text-brand">
              Tools
            </Link>
            <Link href="/library" className="transition hover:text-brand">
              Library
            </Link>
            <Link href="/account" className="transition hover:text-brand">
              Credits
            </Link>
            <Link href="/brand" className="transition hover:text-brand">
              Brand
            </Link>
            <Link href="/privacy" className="transition hover:text-brand">
              Privacy
            </Link>
          </nav>
          <p className="text-xs text-muted">© {year} Unmark</p>
        </div>
      </div>
    </footer>
  );
}
