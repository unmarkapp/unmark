import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact support",
  description:
    "Contact Unmark support for billing, credits, refunds, and product help.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Contact support · Unmark",
    description:
      "Email Unmark for billing, credits, refunds, and product help.",
    url: "/support",
  },
};

const SUPPORT_EMAIL = "pythondemo4@gmail.com";
const updated = "August 14, 2026";

export default function SupportPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">Help</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Contact support
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-strong">
          Unmark is the Gemini watermark remover at{" "}
          <Link
            href="/"
            className="text-brand-hover underline-offset-2 hover:underline"
          >
            www.unmark.ink
          </Link>
          . Use this page to reach us about your account, credits, payments, or
          the product.
        </p>

        <div className="mt-10 border border-border bg-surface p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            Email us
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Unmark%20support`}
            className="mt-2 block font-display text-2xl font-semibold tracking-tight text-foreground hover:text-brand"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We read every message. Typical reply time is within two business
            days (Monday–Friday). Include the Google email on your Unmark
            account and, for billing, the payment date or receipt.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Unmark%20support`}
            className="mt-5 inline-flex bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Send an email
          </a>
        </div>

        <div className="prose-privacy mt-12 space-y-10 text-[15px] leading-relaxed text-muted-strong">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              What we can help with
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>Purchases, invoices, failed checkouts, and missing credits</li>
              <li>Refunds and charge questions (see below)</li>
              <li>Account access, Library, Cloud jobs, and the Chrome extension</li>
              <li>Privacy or data-deletion requests</li>
            </ul>
            <p>
              Instant image cleanup runs in your browser and does not require an
              account. Cloud features (video, Library, bulk, Create) use the
              signed-in account and credits shown on{" "}
              <Link
                href="/account"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                Credits
              </Link>
              .
            </p>
          </section>

          <section id="refunds" className="scroll-mt-24 space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Billing and refunds
            </h2>
            <p>
              Credit packs are digital goods. Payments are processed by our
              payment partners (including Stripe and Razorpay). We do not store
              full card numbers.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Unused purchased credits.</strong> Email us within 14
                days of purchase. If the pack has not been spent, we can refund
                the original payment method where the processor allows it.
              </li>
              <li>
                <strong>Used credits.</strong> Spent Clean or Create credits are
                generally not refundable, except where required by law.
              </li>
              <li>
                <strong>Daily free credits.</strong> These are complimentary and
                not for sale, so they are not refundable.
              </li>
              <li>
                <strong>Duplicate or failed charges.</strong> Write to us with
                the charge date and amount. We will investigate with the payment
                partner.
              </li>
            </ul>
            <p>
              Refunds, when approved, go back to the original payment method.
              Processing time depends on your bank or card network (often 5–10
              business days after we issue the refund).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Chargebacks
            </h2>
            <p>
              If a charge looks wrong, contact us first so we can fix it
              quickly. Filing a dispute with your bank without talking to us can
              delay a refund and may lead to account suspension while the
              dispute is open.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Legal
            </h2>
            <p>
              Unmark is operated as Unmark. Website:{" "}
              <Link
                href="/"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                https://www.unmark.ink
              </Link>
              . See our{" "}
              <Link
                href="/terms"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                Privacy Policy
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
