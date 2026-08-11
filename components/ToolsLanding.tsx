import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const TOOLS = [
  {
    href: "/tools/background-removal",
    title: "Background removal",
    description:
      "Automatic cutout with transparent PNG output. Portraits, products, and general photos.",
    badge: "New",
  },
] as const;

export default function ToolsLanding() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-5 sm:px-6">
        <SiteHeader />

        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Unmark
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tools
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Extra utilities beyond Gemini watermark removal — same quality bar,
            built for creators.
          </p>
        </section>

        <ul className="mx-auto mt-12 grid max-w-2xl gap-4">
          {TOOLS.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="group flex flex-col gap-2 border border-border bg-surface/90 p-5 transition hover:border-brand hover:bg-cream/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      {tool.title}
                    </h2>
                    {tool.badge ? (
                      <span className="bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                        {tool.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">{tool.description}</p>
                </div>
                <span className="text-sm font-semibold text-brand group-hover:text-brand-hover">
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <SiteFooter />
      </div>
    </div>
  );
}
