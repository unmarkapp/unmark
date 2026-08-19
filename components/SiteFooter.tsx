import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import ProductHuntBadge from "@/components/ProductHuntBadge";
import { GUIDE_LINKS } from "@/lib/seo";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const primaryGuides = GUIDE_LINKS.slice(0, 4);

  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex max-w-md flex-col gap-4">
            <div className="flex items-start gap-3">
              <Link href="/" className="flex shrink-0 items-center gap-2.5">
                <BrandLogo size={28} />
                <span className="font-display text-base font-semibold tracking-tight text-foreground">
                  Unmark
                </span>
              </Link>
              <p className="pt-0.5 text-sm leading-relaxed text-muted">
                Unmark cleans AI media — Gemini watermark removal for images and
                video, plus background cutouts. Free Instant on the web; Cloud for
                Library and the Chrome extension.
              </p>
            </div>
            <ProductHuntBadge />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Guides
              </p>
              <nav className="mt-3 flex flex-col gap-2 text-sm font-medium text-muted-strong">
                {primaryGuides.map((guide) => (
                  <Link
                    key={guide.href}
                    href={guide.href}
                    className="transition hover:text-brand"
                  >
                    {guide.title}
                  </Link>
                ))}
                <Link href="/guides" className="transition hover:text-brand">
                  All guides
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Product
              </p>
              <nav className="mt-3 flex flex-col gap-2 text-sm font-medium text-muted-strong">
                <Link href="/product" className="transition hover:text-brand">
                  Product
                </Link>
                <Link href="/#get-started" className="transition hover:text-brand">
                  Get started
                </Link>
                <Link href="/#compare" className="transition hover:text-brand">
                  Before / after
                </Link>
                <Link href="/#how" className="transition hover:text-brand">
                  How it works
                </Link>
                <Link href="/#faq" className="transition hover:text-brand">
                  FAQ
                </Link>
                <Link href="/extension" className="transition hover:text-brand">
                  Chrome extension
                </Link>
                <Link href="/android" className="transition hover:text-brand">
                  Android early access
                </Link>
                <Link href="/#apps" className="transition hover:text-brand">
                  iOS & Android
                </Link>
                <Link href="/tools/background-removal" className="transition hover:text-brand">
                  Background removal
                </Link>
                <Link href="/guides/mcp-server" className="transition hover:text-brand">
                  MCP server
                </Link>
                <Link href="/skills" className="transition hover:text-brand">
                  Agent skill
                </Link>
                <Link href="/developers" className="transition hover:text-brand">
                  Developers
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
                <Link href="/support" className="transition hover:text-brand">
                  Contact support
                </Link>
                <Link href="/privacy" className="transition hover:text-brand">
                  Privacy
                </Link>
                <Link href="/delete-account" className="transition hover:text-brand">
                  Delete account
                </Link>
                <Link href="/terms" className="transition hover:text-brand">
                  Terms
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-muted">© {year} Unmark</p>
      </div>
    </footer>
  );
}
