"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/lib/credits";
import { APPS_NAV_BADGE } from "@/lib/seo";

export default function SiteHeader() {
  const router = useRouter();
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const { fastCredits } = useCredits();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.replace("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 xl:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={closeMenu}>
          <BrandLogo size={34} />
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            Unmark
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 text-sm font-medium text-muted lg:flex">
          <NavLinks user={user} loading={loading} />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3" data-walkthrough="account">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface text-foreground transition hover:bg-sand lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          {!loading && user ? (
            <>
              <Link
                href="/account"
                className="hidden items-center gap-1.5 rounded-full border border-border bg-sand px-3 py-1.5 font-mono text-[11px] font-semibold tabular-nums text-foreground transition hover:bg-cream sm:inline-flex"
              >
                {fastCredits === null ? "…" : `${fastCredits} credits`}
              </Link>
              <Link href="/account" className="flex items-center gap-2">
                {user.picture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cobalt text-xs font-bold text-white">
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="hidden text-sm font-medium text-muted transition hover:text-foreground sm:inline"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={loading}
              className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-md)] bg-brand px-4 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_10px_20px_-8px_rgb(var(--shadow-color)/0.35)] transition hover:bg-brand-hover disabled:opacity-50"
            >
              <GoogleIcon />
              Sign in
            </button>
          )}
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-background px-4 py-4 text-sm font-medium text-muted lg:hidden sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <NavLinks user={user} loading={loading} onNavigate={closeMenu} />
            {!loading && user ? (
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="text-left text-sm font-medium text-muted"
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
  onNavigate,
}: {
  user: ReturnType<typeof useAuth>["user"];
  loading: boolean;
  onNavigate?: () => void;
}) {
  const linkClass = "transition hover:text-foreground";
  return (
    <>
      <Link href="/#get-started" className={linkClass} onClick={onNavigate}>
        Get started
      </Link>
      <Link href="/#how" className={linkClass} onClick={onNavigate}>
        How it works
      </Link>
      <Link href="/?guide=1" className={linkClass} onClick={onNavigate}>
        Tour
      </Link>
      <Link href="/tools" className={linkClass} onClick={onNavigate}>
        Tools
      </Link>
      <Link href="/extension" className={linkClass} onClick={onNavigate}>
        Extension
      </Link>
      <Link href="/skills" className={linkClass} onClick={onNavigate}>
        Skills
      </Link>
      <Link
        href="/#apps"
        className={`inline-flex items-center gap-1.5 ${linkClass}`}
        onClick={onNavigate}
      >
        Apps
        {APPS_NAV_BADGE ? (
          <span className="rounded-full bg-peach px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-ink">
            {APPS_NAV_BADGE}
          </span>
        ) : null}
      </Link>
      {!loading && user ? (
        <>
          <Link href="/library" className={linkClass} onClick={onNavigate}>
            Library
          </Link>
          <Link href="/account" className={linkClass} onClick={onNavigate}>
            Credits
          </Link>
        </>
      ) : null}
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#fff"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#fff"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      />
      <path
        fill="#fff"
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#fff"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
