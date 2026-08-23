import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Unmark and the Unmark for Gemini Chrome extension collect and use data.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy · Unmark",
    description:
      "How Unmark and the Unmark for Gemini Chrome extension collect and use data.",
    url: "/privacy",
  },
};

const updated = "August 16, 2026";

export default function PrivacyPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">Legal</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>

        <div className="prose-privacy mt-10 space-y-10 text-[15px] leading-relaxed text-muted-strong">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Overview
            </h2>
            <p>
              Unmark (“we”, “us”) provides a web app at{" "}
              <Link href="/" className="text-brand-hover underline-offset-2 hover:underline">
                unmark.ink
              </Link>{" "}
              and the <strong>Unmark for Gemini</strong> Chrome extension. Both
              remove the Gemini sparkle watermark from images you choose to
              process. This policy explains what data we collect, why, and how
              we handle it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Data we collect
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Account information.</strong> If you sign in with
                Google, we receive your Google account identifier, name, and
                email address to create and manage your Unmark account.
              </li>
              <li>
                <strong>Authentication.</strong> We set a session cookie (
                <code className="rounded bg-cream px-1.5 py-0.5 text-[13px]">
                  unmark_session
                </code>
                ) so you stay signed in. The Chrome extension may read this
                cookie (or an optional pasted session token) only to call the
                Unmark API on your behalf.
              </li>
              <li>
                <strong>Images you upload or capture.</strong> Images you
                submit on the website, or that the extension captures from
                Gemini / Google Flow for processing, are sent to our servers to
                remove the watermark and return a cleaned file.
              </li>
              <li>
                <strong>Usage and billing.</strong> We store job metadata (for
                example timestamps, status, credit usage) and, if you purchase
                credits, payment-related records via our payment processor
                (Razorpay). We do not store full card numbers.
              </li>
              <li>
                <strong>Analytics.</strong> We use Google Analytics 4 to
                understand how the site is used (pages viewed, traffic source,
                and whether Instant cleanup completed). Google may set cookies
                and receive your IP address and device/browser details. You can
                block this with a browser analytics opt-out or cookie controls.
              </li>
              <li>
                <strong>Extension settings.</strong> Preferences such as
                environment URLs, download options, and prompt queue text are
                stored locally in Chrome storage on your device.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              How we use data
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide watermark removal and deliver cleaned images.</li>
              <li>Authenticate you and apply your credit balance.</li>
              <li>Operate, secure, and improve the service.</li>
              <li>
                Communicate about your account or service issues when needed.
              </li>
            </ul>
            <p>
              We do <strong>not</strong> sell your personal data. We do not use
              your data for creditworthiness or lending decisions. We do not use
              or transfer user data for purposes unrelated to Unmark’s single
              purpose: removing Gemini sparkle watermarks from images.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Chrome extension
            </h2>
            <p>
              The extension runs on Gemini and Google Flow pages only as needed
              to queue prompts, capture generated images, send them to Unmark
              for processing, and optionally download the cleaned files. It does
              not sell browsing data or share your images with unrelated third
              parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Service providers
            </h2>
            <p>
              We use infrastructure and vendors necessary to run Unmark, such as
              cloud hosting (AWS), databases, Google (sign-in and Analytics), and
              Razorpay (payments). They process data only to provide those
              services to us, under their own terms and safeguards. Google
              Analytics is described in{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-brand-hover underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google’s privacy policy
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Retention
            </h2>
            <p>
              Processed images and job records are kept only as long as needed
              to provide the service (for example to show recent results in your
              library) and to meet operational or legal requirements. You may
              request deletion of your account and associated data on the{" "}
              <Link
                href="/delete-account"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                Delete your Unmark account
              </Link>{" "}
              page.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Security
            </h2>
            <p>
              We use HTTPS and access controls appropriate to a small SaaS
              product. No method of transmission or storage is perfectly secure;
              please use a strong Google account and sign out on shared devices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Children
            </h2>
            <p>
              Unmark is not directed at children under 13. We do not knowingly
              collect personal information from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Changes
            </h2>
            <p>
              We may update this policy from time to time. The “Last updated”
              date at the top will change when we do. Continued use of Unmark
              after an update means you accept the revised policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p>
              Questions about privacy:{" "}
              <a
                href="mailto:pythondemo4@gmail.com"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                pythondemo4@gmail.com
              </a>
              . For billing or refunds, see{" "}
              <Link
                href="/support"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                Contact support
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
