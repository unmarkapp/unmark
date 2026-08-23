import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import ProductHuntBadge from "@/components/ProductHuntBadge";
import { GUIDE_LINKS } from "@/lib/seo";

const PRODUCT_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/extension", label: "Chrome extension" },
  { href: "/tools", label: "Tools" },
  { href: "/tools/background-removal", label: "Background removal" },
  { href: "/android", label: "Android early access" },
  { href: "/guides/mcp-server", label: "MCP server" },
  { href: "/skills", label: "Agent skill" },
];

const ACCOUNT_LINKS = [
  { href: "/library", label: "Library" },
  { href: "/account", label: "Credits" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo size={28} />
              <span className="font-display text-base font-semibold tracking-tight text-foreground">
                Unmark
              </span>
            </Link>
            <p className="max-w-[26ch] text-sm leading-relaxed text-muted">
              Remove Gemini watermarks from images and video. Free Instant in your
              browser; Cloud for Library and the extension.
            </p>
            <ProductHuntBadge />
          </div>

          {/* Guides */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Guides
            </p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-strong">
              {GUIDE_LINKS.map((guide) => (
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

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Product
            </p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-strong">
              {PRODUCT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Account
            </p>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-muted-strong">
              {ACCOUNT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted">
          <p>© {year} Unmark</p>
          <Link href="/delete-account" className="transition hover:text-foreground">
            Delete account
          </Link>
        </div>
      </div>
    </footer>
  );
}
