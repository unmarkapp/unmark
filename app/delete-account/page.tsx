import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Delete your Unmark account",
  description:
    "Request deletion of your Unmark account and associated data on web, Android, and iOS.",
  alternates: { canonical: "/delete-account" },
  openGraph: {
    title: "Delete your Unmark account · Unmark",
    description:
      "How to request that Unmark delete your account and associated data.",
    url: "/delete-account",
  },
};

const SUPPORT_EMAIL = "pythondemo4@gmail.com";
const MAIL_HREF = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Delete my Unmark account")}`;
const updated = "August 17, 2026";

export default function DeleteAccountPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">Unmark</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
          Delete your Unmark account
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-strong">
          This page is for the Unmark app (web, Android, and iOS) at{" "}
          <Link
            href="/"
            className="text-brand-hover underline-offset-2 hover:underline"
          >
            www.unmark.ink
          </Link>
          . Use it to request that we delete your Unmark account and the data
          tied to it.
        </p>

        <div className="mt-10 rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            How to request deletion
          </p>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-muted-strong">
            <li>
              Email{" "}
              <a
                href={MAIL_HREF}
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>{" "}
              from the Google address you use to sign in to Unmark.
            </li>
            <li>
              Use the subject line <strong>Delete my Unmark account</strong>.
            </li>
            <li>
              Include the Google email on the account. If you bought credits,
              include a recent payment date or receipt if you have one.
            </li>
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            We confirm the request and complete deletion within 14 days, unless
            a shorter period is required by law. Typical reply time is within
            two business days (Monday–Friday).
          </p>
          <a
            href={MAIL_HREF}
            className="mt-5 inline-flex rounded-[var(--radius-md)] bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)] transition hover:bg-brand-hover"
          >
            Email a deletion request
          </a>
        </div>

        <div className="prose-privacy mt-12 space-y-10 text-[15px] leading-relaxed text-muted-strong">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Data we delete
            </h2>
            <p>When we delete your Unmark account, we remove:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Your Unmark account and Google sign-in link</li>
              <li>Library files and Cloud job history for that account</li>
              <li>Session cookies and in-app sign-in state</li>
              <li>Unused credit balance on the account</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Data we may keep
            </h2>
            <p>
              We may retain payment and invoice records (amount, date, and
              processor identifiers) for tax, accounting, and fraud prevention,
              typically up to 7 years or as required by law. Those records are
              not used to restore your Unmark account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Delete some data without deleting your account
            </h2>
            <p>
              You can remove individual Cloud results from{" "}
              <Link
                href="/library"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                Library
              </Link>{" "}
              while keeping the account. Instant cleanup in the browser does not
              store images on Unmark.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Privacy
            </h2>
            <p>
              See the{" "}
              <Link
                href="/privacy"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                Unmark Privacy Policy
              </Link>{" "}
              for how we collect and use data.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
