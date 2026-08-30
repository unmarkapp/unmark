"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    <header className="sticky top-0 z-40 bg-background">
      {/* Tactical status bar */}
      <div className="hidden border-b border-border bg-surface lg:block">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-1 sm:px-6 xl:px-8">
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-muted">SYS/WEB-01</span>
          <span className="font-mono text-[8px] text-border">///</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">ENGINE: INSTANT + CLOUD</span>
          <span className="font-mono text-[8px] text-border">///</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-cobalt">STATUS: OPERATIONAL</span>
          <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.2em] text-muted">REV 2.6</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="border-b-2" style={{ borderColor: 'var(--border-strong)' }}>
        <div className="mx-auto flex w-full max-w-7xl items-stretch">

          {/* Logo block */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2.5 border-r px-4 py-3 transition-colors hover:bg-surface sm:px-6 xl:px-8"
            style={{ borderColor: 'var(--border)' }}
          >
            <BrandLogo size={20} />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-foreground">
              UNMARK<sup className="text-brand" style={{ fontSize: '0.6em', verticalAlign: 'super', marginLeft: '1px' }}>®</sup>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav
            className="hidden min-w-0 flex-1 items-stretch lg:flex"
            aria-label="Primary navigation"
          >
            <NavLinks user={user} loading={loading} />
          </nav>

          {/* Right controls */}
          <div className="ml-auto flex shrink-0 items-stretch" data-walkthrough="account">

            {/* Theme toggle */}
            <div
              className="flex items-center border-l px-3 transition-colors hover:bg-surface"
              style={{ borderColor: 'var(--border)' }}
            >
              <ThemeToggle />
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="flex h-full items-center justify-center border-l px-4 text-foreground transition-colors hover:bg-surface lg:hidden"
              style={{ borderColor: 'var(--border)' }}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            {!loading && user ? (
              <>
                {/* Credits display */}
                <Link
                  href="/account"
                  className="hidden items-center divide-x divide-border border-l font-mono tabular-nums transition-colors hover:bg-surface sm:flex"
                  style={{ borderColor: 'var(--border)' }}
                  title="Clean credits (daily) · Create credits (purchased)"
                >
                  <span className="flex items-center gap-1.5 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                    <span className="text-foreground text-[11px] tabular-nums">
                      {fastCredits === null ? "—" : fastCredits}
                    </span>
                    CLEAN
                  </span>
                  {GENERATE_WEB_ENABLED && (
                    <span className="flex items-center gap-1.5 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-muted">
                      <span className="text-foreground text-[11px] tabular-nums">
                        {createCredits === null ? "—" : createCredits}
                      </span>
                      CREATE
                    </span>
                  )}
                </Link>

                {/* Avatar */}
                <Link
                  href="/account"
                  className="flex items-center border-l px-3 transition-colors hover:bg-surface"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {user.picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-6 w-6 object-cover"
                      style={{ outline: '1px solid var(--border-strong)' }}
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center bg-foreground font-mono text-[9px] font-bold text-background">
                      {(user.name || user.email || "U")[0].toUpperCase()}
                    </div>
                  )}
                </Link>

                {/* Exit */}
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="hidden border-l px-4 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:bg-surface hover:text-foreground sm:flex sm:items-center"
                  style={{ borderColor: 'var(--border)' }}
                >
                  EXIT
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={loading}
                className="flex items-center gap-2 border-l bg-brand px-5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
                style={{ borderColor: 'var(--brand)' }}
              >
                <GoogleIcon />
                SIGN IN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav panel */}
      {menuOpen ? (
        <nav
          id="mobile-nav"
          className="border-b-2 bg-background lg:hidden"
          style={{ borderColor: 'var(--border-strong)' }}
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6">
            <MobileNavLinks user={user} loading={loading} onNavigate={closeMenu} />
            {!loading && user ? (
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="py-3.5 text-left font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted"
              >
                [ EXIT SESSION ]
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
    "flex h-full items-center border-r px-4 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-muted transition-colors hover:bg-surface hover:text-foreground";

  return (
    <>
      <Link href="/#get-started" className={linkClass} style={{ borderColor: 'var(--border)' }}>
        GET STARTED
      </Link>
      <Link href="/#how" className={linkClass} style={{ borderColor: 'var(--border)' }}>
        HOW IT WORKS
      </Link>
      <Link href="/?guide=1" className={linkClass} style={{ borderColor: 'var(--border)' }}>
        TOUR
      </Link>
      <Link href="/tools" className={linkClass} style={{ borderColor: 'var(--border)' }}>
        TOOLS
      </Link>
      <Link href="/extension" className={linkClass} style={{ borderColor: 'var(--border)' }}>
        EXTENSION
      </Link>
      <Link href="/skills" className={linkClass} style={{ borderColor: 'var(--border)' }}>
        SKILLS
      </Link>
      <Link
        href="/#apps"
        className={`${linkClass} gap-2`}
        style={{ borderColor: 'var(--border)' }}
      >
        APPS
        {APPS_NAV_BADGE ? (
          <span className="bg-brand px-1 py-px font-mono text-[7px] font-bold uppercase tracking-wider text-white">
            {APPS_NAV_BADGE}
          </span>
        ) : null}
      </Link>
      {!loading && user ? (
        <>
          <Link href="/library" className={linkClass} style={{ borderColor: 'var(--border)' }}>
            LIBRARY
          </Link>
          <Link href="/account" className={linkClass} style={{ borderColor: 'var(--border)' }}>
            CREDITS
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
  const linkClass =
    "block py-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground";

  return (
    <>
      <Link href="/#get-started" className={linkClass} onClick={onNavigate}>[ GET STARTED ]</Link>
      <Link href="/#how" className={linkClass} onClick={onNavigate}>[ HOW IT WORKS ]</Link>
      <Link href="/?guide=1" className={linkClass} onClick={onNavigate}>[ TOUR ]</Link>
      <Link href="/tools" className={linkClass} onClick={onNavigate}>[ TOOLS ]</Link>
      <Link href="/extension" className={linkClass} onClick={onNavigate}>[ EXTENSION ]</Link>
      <Link href="/skills" className={linkClass} onClick={onNavigate}>[ SKILLS ]</Link>
      <Link href="/#apps" className={linkClass} onClick={onNavigate}>[ APPS ]</Link>
      {!loading && user ? (
        <>
          <Link href="/library" className={linkClass} onClick={onNavigate}>[ LIBRARY ]</Link>
          <Link href="/account" className={linkClass} onClick={onNavigate}>[ CREDITS ]</Link>
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
    <svg width="12" height="12" viewBox="0 0 18 18" aria-hidden>
      <path fill="#fff" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#fff" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
      <path fill="#fff" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#fff" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}
