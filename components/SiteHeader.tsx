"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/lib/credits";

export default function SiteHeader() {
  const router = useRouter();
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const { fastCredits } = useCredits();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-background">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <BrandLogo size={34} />
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            Unmark
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted lg:flex">
          <Link href="/#get-started" className="transition hover:text-foreground">
            Get started
          </Link>
          <Link href="/#how" className="transition hover:text-foreground">
            How it works
          </Link>
          <Link href="/tools" className="transition hover:text-foreground">
            Tools
          </Link>
          <Link href="/extension" className="transition hover:text-foreground">
            Extension
          </Link>
          <Link href="/#apps" className="transition hover:text-foreground">
            Apps
          </Link>
          {!loading && user ? (
            <>
              <Link href="/library" className="transition hover:text-foreground">
                Library
              </Link>
              <Link href="/account" className="transition hover:text-foreground">
                Credits
              </Link>
            </>
          ) : null}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />
        {!loading && user ? (
          <>
            <Link
              href="/account"
              className="hidden items-center gap-1.5 border-2 border-ink bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground sm:inline-flex"
            >
              {fastCredits === null ? "…" : `${fastCredits} credits`}
            </Link>
            <Link href="/account" className="flex items-center gap-2">
              {user.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-8 w-8 object-cover ring-2 ring-ink"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center bg-cobalt text-xs font-bold text-white">
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </div>
              )}
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="text-sm font-medium text-muted transition hover:text-foreground"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={loginWithGoogle}
            disabled={loading}
            className="inline-flex items-center gap-2 border-2 border-ink bg-brand px-3.5 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover disabled:opacity-50"
          >
            <GoogleIcon />
            Sign in
          </button>
        )}
      </div>
      </div>
    </header>
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
