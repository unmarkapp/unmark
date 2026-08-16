"use client";

import Link from "next/link";

import { CHROME_WEB_STORE_URL, PRODUCT_TOOLS } from "@/lib/seo";

export default function GetStartedTools() {
  return (
    <section
      id="get-started"
      className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">Get started</p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Ready to use Unmark
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Pick the tool you need — Instant images free, Cloud for video and
          cutouts, or the Chrome extension on Gemini.
        </p>
      </div>

      <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
        {PRODUCT_TOOLS.map((tool) => {
          const isExtension = tool.id === "extension";
          const comingSoon = "comingSoon" in tool && tool.comingSoon;
          const href = isExtension ? CHROME_WEB_STORE_URL : tool.href;
          const external = isExtension;
          const className =
            "group flex h-full flex-col border-2 border-ink bg-surface p-5 text-left transition hover:bg-cream";
          const lockedClassName =
            "flex h-full flex-col border-2 border-ink bg-surface p-5 text-left";

          const body = (
            <>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {tool.title}
                </h3>
                <span className="bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                  {tool.badge}
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {tool.description}
              </p>
              <span
                className={`mt-4 text-sm font-semibold ${
                  comingSoon
                    ? "text-muted"
                    : "text-brand group-hover:text-brand-hover"
                }`}
              >
                {tool.cta}
                {comingSoon ? "" : " →"}
              </span>
            </>
          );

          return (
            <li key={tool.id}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {body}
                </a>
              ) : (
                <Link
                  href={href}
                  className={comingSoon ? lockedClassName : className}
                >
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted">
        Prefer mobile?{" "}
        <a href="/#apps" className="font-medium text-brand underline-offset-2 hover:underline">
          iOS and Android
        </a>
        .
      </p>
    </section>
  );
}
