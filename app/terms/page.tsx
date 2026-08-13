import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Unmark — Gemini watermark removal, Library, and optional Canva integration.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service · Unmark",
    description:
      "Terms of Service for Unmark — Gemini watermark removal, Library, and optional Canva integration.",
    url: "/terms",
  },
};

const updated = "August 13, 2026";

export default function TermsPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <div className="relative mx-auto w-full max-w-5xl px-4 pt-5 sm:px-6">
        <SiteHeader />
      </div>

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">Legal</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>

        <div className="prose-privacy mt-10 space-y-10 text-[15px] leading-relaxed text-muted-strong">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Agreement
            </h2>
            <p>
              These Terms of Service (“Terms”) govern your use of Unmark (“we”,
              “us”) at{" "}
              <Link href="/" className="text-brand-hover underline-offset-2 hover:underline">
                unmark.ink
              </Link>
              , our API, Chrome extension, and related services (collectively,
              the “Service”). By using the Service, you agree to these Terms and
              our{" "}
              <Link
                href="/privacy"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                Privacy Policy
              </Link>
              . If you do not agree, do not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              The Service
            </h2>
            <p>
              Unmark helps users remove visible Gemini / Veo-style sparkle
              watermarks from images and video they upload or submit for
              processing. Features may include instant (browser) processing,
              cloud jobs, a personal Library, background removal, share links,
              and optional third-party integrations such as Canva Connect.
            </p>
            <p>
              We may change, suspend, or discontinue any part of the Service at
              any time. We do not guarantee uninterrupted availability or that
              every image or video will process successfully.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Your account and content
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                You must provide accurate sign-in information and keep your
                Google account secure.
              </li>
              <li>
                You retain ownership of images and other content you upload. You
                grant us a limited license to host, process, store, and deliver
                that content solely to operate the Service.
              </li>
              <li>
                You are responsible for ensuring you have the right to upload
                and edit the content you submit, including compliance with
                Google, Canva, and other third-party terms.
              </li>
              <li>
                Do not use the Service for unlawful, harmful, or abusive
                purposes, or to infringe others’ intellectual property or
                privacy rights.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Credits and payments
            </h2>
            <p>
              Some features require credits or paid plans. Prices and credit
              rules are shown in the product before purchase. Payments are
              processed by third-party providers (for example Razorpay). Refunds
              are handled according to our published refund policy at the time
              of purchase, except where required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Third-party integrations
            </h2>
            <p>
              Optional integrations (for example{" "}
              <strong>Canva Connect</strong>) are provided by third parties
              under their own terms. When you connect Canva, you authorize Unmark
              to import images you choose into your Canva account using Canva’s
              APIs. We are not affiliated with or endorsed by Canva. Your use of
              Canva remains subject to Canva’s terms and policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Disclaimers
            </h2>
            <p>
              The Service is provided <strong>“as is”</strong> and{" "}
              <strong>“as available”</strong> without warranties of any kind,
              whether express or implied, including merchantability, fitness for
              a particular purpose, and non-infringement. We do not warrant that
              outputs will be watermark-free, error-free, or suitable for any
              specific commercial use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, Unmark and its operators
              will not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or for loss of profits, data,
              or goodwill, arising from your use of the Service. Our total
              liability for any claim relating to the Service is limited to the
              greater of (a) the amount you paid us in the twelve months before
              the claim or (b) one hundred U.S. dollars (USD $100).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Termination
            </h2>
            <p>
              You may stop using the Service at any time. We may suspend or
              terminate access if you violate these Terms or if needed to protect
              the Service or other users. Sections that by nature should
              survive termination (including disclaimers and limitation of
              liability) will survive.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Changes
            </h2>
            <p>
              We may update these Terms from time to time. The “Last updated”
              date will change when we do. Material changes may be communicated
              in the product. Continued use after changes means you accept the
              revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p>
              Questions about these Terms:{" "}
              <a
                href="mailto:pythondemo4@gmail.com"
                className="text-brand-hover underline-offset-2 hover:underline"
              >
                pythondemo4@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
