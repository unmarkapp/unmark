"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/lib/credits";
import { GENERATE_WEB_ENABLED } from "@/lib/generate";
import { APPS_NAV_BADGE } from "@/lib/seo";

export default function SiteHeader() {
  const router = useRouter();
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const { fastCredits, createCredits } = useCredits();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.replace("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-1 px-4 py-3 sm:px-6 xl:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2 pr-4"
        >
          <BrandLogo size={22} />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Unmark
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav
          className="hidden min-w-0 flex-1 items-center gap-1 lg:flex"
          aria-label="Primary navigation"
        >
          <NavLinks user={user} loading={loading} />
        </nav>

        {/* Right controls */}
        <div
          className="ml-auto flex shrink-0 items-center gap-1.5"
          data-walkthrough="account"
        >
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-foreground transition hover:bg-sand lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>

          {!loading && user ? (
            <>
              {/* Credits display */}
              <Link
                href="/account"
                className="hidden items-center gap-3 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted transition hover:bg-sand sm:flex"
                title="Clean credits (daily) · Create credits (purchased)"
              >
                <span className="flex items-center gap-1 tabular-nums">
                  <span className="font-semibold text-foreground">
                    {fastCredits === null ? "—" : fastCredits}
                  </span>
                  clean
                </span>
                {GENERATE_WEB_ENABLED && (
                  <span className="flex items-center gap-1 tabular-nums">
                    <span className="font-semibold text-foreground">
                      {createCredits === null ? "—" : createCredits}
                    </span>
                    create
                  </span>
                )}
              </Link>

              {/* Avatar */}
              <Link
                href="/account"
                className="flex items-center rounded-full transition hover:opacity-80"
              >
                {user.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </Link>

              {/* Exit */}
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="hidden rounded-[var(--radius-md)] px-3 py-1.5 text-xs text-muted transition hover:bg-sand hover:text-foreground sm:block"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={loading}
              className="flex items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-hover disabled:opacity-50"
            >
              <GoogleIcon />
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav panel */}
      {menuOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-background lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            <MobileNavLinks user={user} loading={loading} onNavigate={closeMenu} />
            {!loading && user ? (
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="border-t border-border py-3.5 text-left text-sm text-muted"
              >
                Sign out
              </button>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function NavLinks({
  user,
  loading,
}: {
  user: ReturnType<typeof useAuth>["user"];
  loading: boolean;
}) {
  const linkClass =
    "rounded-[var(--radius-md)] px-3 py-2 text-sm text-muted transition hover:bg-sand hover:text-foreground";

  return (
    <>
      <Link href="/#get-started" className={linkClass}>
        Get started
      </Link>
      <Link href="/#how" className={linkClass}>
        How it works
      </Link>
      <Link href="/?guide=1" className={linkClass}>
        Tour
      </Link>
      <Link href="/tools" className={linkClass}>
        Tools
      </Link>
      <Link href="/extension" className={linkClass}>
        Extension
      </Link>
      <Link href="/skills" className={linkClass}>
        Skills
      </Link>
      <Link href="/#apps" className={`${linkClass} inline-flex items-center gap-1.5`}>
        Apps
        {APPS_NAV_BADGE ? (
          <span className="rounded-full bg-peach px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">
            {APPS_NAV_BADGE}
          </span>
        ) : null}
      </Link>
      {!loading && user ? (
        <>
          <Link href="/library" className={linkClass}>
            Library
          </Link>
          <Link href="/account" className={linkClass}>
            Credits
          </Link>
        </>
      ) : null}
    </>
  );
}

function MobileNavLinks({
  user,
  loading,
  onNavigate,
}: {
  user: ReturnType<typeof useAuth>["user"];
  loading: boolean;
  onNavigate?: () => void;
}) {
  const linkClass = "block py-3.5 text-sm text-muted transition hover:text-foreground";

  return (
    <>
      <Link href="/#get-started" className={linkClass} onClick={onNavigate}>Get started</Link>
      <Link href="/#how" className={linkClass} onClick={onNavigate}>How it works</Link>
      <Link href="/?guide=1" className={linkClass} onClick={onNavigate}>Tour</Link>
      <Link href="/tools" className={linkClass} onClick={onNavigate}>Tools</Link>
      <Link href="/extension" className={linkClass} onClick={onNavigate}>Extension</Link>
      <Link href="/skills" className={linkClass} onClick={onNavigate}>Skills</Link>
      <Link href="/#apps" className={linkClass} onClick={onNavigate}>Apps</Link>
      {!loading && user ? (
        <>
          <Link href="/library" className={linkClass} onClick={onNavigate}>Library</Link>
          <Link href="/account" className={linkClass} onClick={onNavigate}>Credits</Link>
        </>
      ) : null}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden>
      <path fill="#fff" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#fff" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
      <path fill="#fff" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#fff" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}
