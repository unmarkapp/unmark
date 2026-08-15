import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  BRAND,
  BrandWordmark,
  LOGO_THEMES,
  LogoByTheme,
} from "@/components/brand/logos";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Brand",
  description: "Unmark logo themes, wordmark, and color palette.",
  alternates: { canonical: "/brand" },
  openGraph: {
    title: "Brand · Unmark",
    description: "Unmark logo themes, wordmark, and color palette.",
    url: "/brand",
  },
};

const swatches: { hex: string; name: string }[] = [
  { hex: BRAND.ink, name: "Ink" },
  { hex: BRAND.copper, name: "Copper" },
  { hex: BRAND.peach, name: "Peach" },
  { hex: BRAND.cream, name: "Cream" },
  { hex: BRAND.sand, name: "Sand" },
];

export default function BrandPage() {
  return (
    <div className="surface-grain min-h-screen text-[var(--ink)]">
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-[var(--brand)]">Brand system</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Logo themes
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          Four marks built around the Gemini sparkle — detection, fade, and
          removal. Knockout is the primary app icon.
        </p>

        <section className="mt-12 rounded-2xl border border-border/80 bg-[var(--surface)] p-8 sm:p-10">
          <BrandWordmark />
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LOGO_THEMES.map((theme) => (
            <article
              key={theme.id}
              className="flex flex-col items-center rounded-2xl border border-border/80 bg-white px-5 py-8 text-center"
            >
              <div className="flex h-24 w-full items-center justify-center">
                <LogoByTheme theme={theme.id} size={theme.id === "fade" ? 112 : 72} />
              </div>
              <h2 className="mt-5 text-base font-semibold text-[var(--ink)]">
                {theme.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {theme.blurb}
              </p>
              {theme.id === "knockout" ? (
                <span className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-[var(--brand)]">
                  Primary
                </span>
              ) : null}
            </article>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Palette
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {swatches.map((s) => (
              <div key={s.hex} className="min-w-0">
                <div
                  className="aspect-[4/3] rounded-xl border border-border/60"
                  style={{ background: s.hex }}
                />
                <p className="mt-2 text-sm font-semibold">{s.name}</p>
                <p className="font-mono text-xs text-[var(--muted)]">{s.hex}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Concept sheet
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Reference export used for store and marketing.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border/80 bg-[var(--sand)]">
            <Image
              src="/brand/unmark-logo-themes.png"
              alt="Unmark logo concepts: Knockout, Fade out, Corner target, Eraser, wordmark, and palette"
              width={1400}
              height={788}
              className="h-auto w-full"
              priority
            />
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Assets live in{" "}
            <code className="rounded bg-cream px-1.5 py-0.5 text-[13px]">
              /public/brand/
            </code>
            .{" "}
            <Link href="/" className="text-[var(--brand-hover)] underline-offset-2 hover:underline">
              Back home
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
