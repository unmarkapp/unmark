import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import ProductHuntBadge from "@/components/ProductHuntBadge";
import { GUIDE_LINKS } from "@/lib/seo";

const PRODUCT_LINKS = [
  { href: "/product", label: "Product" },
  { href: "/extension", label: "Chrome extension" },
  { href: "/tools", label: "Tools" },
  { href: "/android", label: "Android early access" },
  { href: "/guides/mcp-server", label: "MCP server" },
  { href: "/skills", label: "Agent skill" },
];

const ACCOUNT_LINKS = [
  { href: "/library", label: "Library" },
  { href: "/account", label: "Credits" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
  { href: "/status", label: "Status" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      {/* Main grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:px-6 sm:py-20 xl:px-8">
        {/* Brand block */}
        <div>
          <Link href="/" className="mb-4 flex items-center gap-2">
            <BrandLogo size={20} />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Unmark
            </span>
          </Link>
          <p className="max-w-[30ch] text-sm leading-relaxed text-muted">
            Remove Gemini watermarks from images and video. Free Instant in
            your browser; Cloud for Library and the extension.
          </p>
          <div className="mt-5">
            <ProductHuntBadge />
          </div>
        </div>

        {/* Guides */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
            Guides
          </p>
          <nav className="flex flex-col gap-3">
            {GUIDE_LINKS.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="text-sm text-muted transition hover:text-foreground"
              >
                {guide.title}
              </Link>
            ))}
            <Link
              href="/guides"
              className="text-sm text-muted transition hover:text-foreground"
            >
              All guides
            </Link>
          </nav>
        </div>

        {/* Product */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
            Product
          </p>
          <nav className="flex flex-col gap-3">
            {PRODUCT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Account */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
            Account
          </p>
          <nav className="flex flex-col gap-3">
            {ACCOUNT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 text-xs text-muted sm:px-6 xl:px-8">
          <p>© {year} Unmark</p>
          <Link href="/delete-account" className="transition hover:text-foreground">
            Delete account
          </Link>
        </div>
      </div>
    </footer>
  );
}
