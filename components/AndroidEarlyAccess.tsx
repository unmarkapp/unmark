import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  ANDROID_EARLY_ACCESS_URL,
  ANDROID_TESTER_GROUP_EMAIL,
  ANDROID_TESTER_GROUP_URL,
} from "@/lib/seo";

const steps = [
  {
    n: "1",
    title: "Join the tester group",
    body: `Join ${ANDROID_TESTER_GROUP_EMAIL} with the Google account you'll use for Unmark. Play only recognizes accounts in this group.`,
  },
  {
    n: "2",
    title: "Open the Play opt-in page, tap Become a tester",
    body: "Use the button below on your Android phone, signed in with the same account. Adding your email in Play Console alone is not enough.",
  },
  {
    n: "3",
    title: "Install Unmark",
    body: "After you're opted in, install from the testing listing. Stay opted in for 14 days so we can ship to production.",
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
            <span className="font-display text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
              Unmark
            </span>
          </div>

          <p className="animate-rise-delay mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Android · Closed testing
          </p>
          <h1 className="animate-rise-delay mt-3 font-display text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl md:leading-[1.1]">
            Join Android early access
          </h1>
          <p className="animate-rise-delay mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Help Unmark leave closed testing. Play needs at least 12 testers who
            tap Become a tester and stay opted in for 14 days before we can go
            live on Google Play.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={ANDROID_TESTER_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)] transition hover:bg-brand-hover"
            >
              Join tester group
            </a>
            <a
              href={ANDROID_EARLY_ACCESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-sand"
            >
              Become a tester on Play
            </a>
            <Link
              href="/#apps"
              className="inline-flex rounded-[var(--radius-md)] border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-sand"
            >
              iOS & Android
            </Link>
          </div>
          <p className="animate-rise-delay mx-auto mt-3 max-w-md text-xs text-muted">
            Joining the group takes a minute to approve. Once you're in, the
            Play button above will recognize your account.
          </p>
        </section>

        <ol className="mx-auto mt-16 grid max-w-3xl gap-3 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.n}
              className="rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-5 text-left"
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
