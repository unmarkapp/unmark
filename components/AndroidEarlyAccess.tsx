import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ANDROID_EARLY_ACCESS_URL } from "@/lib/seo";

const steps = [
  {
    n: "1",
    title: "Open the Play opt-in page",
    body: "Use the button below on your Android phone. Adding your email in Play Console is not enough.",
  },
  {
    n: "2",
    title: "Tap Become a tester",
    body: "Play only counts people who opt in on that page. Stay opted in for 14 days so we can ship to production.",
  },
  {
    n: "3",
    title: "Install Unmark",
    body: "After you join, install from the testing listing. Sign in with the same Google account you use on unmark.ink.",
  },
];

export default function AndroidEarlyAccess() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />
      <main className="relative mx-auto w-full max-w-5xl px-4 pb-8 pt-8 sm:px-6">
        <section className="relative mx-auto mt-14 max-w-3xl text-center sm:mt-20">
          <div className="animate-rise inline-flex items-center gap-2.5">
            <BrandLogo size={40} />
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Unmark
            </span>
          </div>

          <p className="animate-rise-delay mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Android · Closed testing
          </p>
          <h1 className="animate-rise-delay mt-3 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:leading-[1.1]">
            Join Android early access
          </h1>
          <p className="animate-rise-delay mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Help Unmark leave closed testing. Play needs at least 12 testers who
            tap Become a tester and stay opted in for 14 days before we can go
            live on Google Play.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={ANDROID_EARLY_ACCESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-ink bg-brand px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
            >
              Become a tester on Play
            </a>
            <Link
              href="/#apps"
              className="inline-flex border-2 border-ink bg-surface px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition hover:bg-cream"
            >
              iOS & Android
            </Link>
          </div>
        </section>

        <ol className="mx-auto mt-16 grid max-w-3xl gap-3 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.n}
              className="border-2 border-ink bg-surface px-4 py-5 text-left"
            >
              <p className="font-display text-2xl font-semibold text-brand">
                {step.n}
              </p>
              <h2 className="mt-2 font-display text-lg font-semibold text-foreground">
                {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted">
          Share this page:{" "}
          <span className="font-medium text-foreground">unmark.ink/android</span>
          . Testers need an Android phone and a Google account. iOS is still
          coming.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
