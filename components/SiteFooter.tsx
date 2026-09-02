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
    <footer className="bg-background" style={{ borderTop: '2px solid var(--border-strong)' }}>
      {/* Footer identifier bar */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 xl:px-8">
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.3em] text-brand">// UNMARK SYSTEM</span>
          <span className="font-mono text-[8px]" style={{ color: 'var(--border-strong)' }}>///</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">WATERMARK REMOVAL ENGINE</span>
        </div>
      </div>

      {/* Main grid */}
      <div
        className="mx-auto grid w-full max-w-7xl grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto]"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Brand block */}
        <div className="border-b p-6 sm:border-b-0 sm:border-r sm:p-8" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="flex items-center gap-2 mb-5">
            <BrandLogo size={18} />
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-foreground">
              UNMARK<sup className="text-brand" style={{ fontSize: '0.65em', verticalAlign: 'super' }}>®</sup>
            </span>
          </Link>
          <p className="font-mono text-[9px] leading-relaxed uppercase tracking-wide text-muted max-w-[22ch]">
            Remove Gemini watermarks from images and video. Free Instant in your
            browser; Cloud for Library and the extension.
          </p>
          <div className="mt-5">
            <ProductHuntBadge />
          </div>
        </div>

        {/* Guides */}
        <div className="border-b p-6 sm:border-b-0 sm:border-r sm:p-8" style={{ borderColor: 'var(--border)' }}>
          <p className="font-mono text-[7px] font-bold uppercase tracking-[0.35em] text-brand mb-4">
            // GUIDES
          </p>
          <nav className="flex flex-col gap-2.5">
            {GUIDE_LINKS.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="font-mono text-[9px] uppercase tracking-wide text-muted transition-colors hover:text-foreground"
              >
                {guide.title}
              </Link>
            ))}
            <Link
              href="/guides"
              className="font-mono text-[9px] uppercase tracking-wide text-muted transition-colors hover:text-foreground"
            >
              All guides
            </Link>
          </nav>
        </div>

        {/* Product */}
        <div className="border-b p-6 sm:border-b-0 sm:border-r sm:p-8" style={{ borderColor: 'var(--border)' }}>
          <p className="font-mono text-[7px] font-bold uppercase tracking-[0.35em] text-brand mb-4">
            // PRODUCT
          </p>
          <nav className="flex flex-col gap-2.5">
            {PRODUCT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[9px] uppercase tracking-wide text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Account */}
        <div className="p-6 sm:p-8">
          <p className="font-mono text-[7px] font-bold uppercase tracking-[0.35em] text-brand mb-4">
            // ACCOUNT
          </p>
          <nav className="flex flex-col gap-2.5">
            {ACCOUNT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[9px] uppercase tracking-wide text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 xl:px-8">
        <div className="flex items-center gap-4">
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
            © {year} UNMARK
          </p>
          <span className="font-mono text-[8px]" style={{ color: 'var(--border-strong)' }}>///</span>
          <p className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-muted sm:block">
            UNIT/WEB-01
          </p>
        </div>
        <Link
          href="/delete-account"
          className="font-mono text-[8px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-brand"
        >
          [ DELETE ACCOUNT ]
        </Link>
      </div>
    </footer>
  );
}
