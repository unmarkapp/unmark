import Link from "next/link";

import { CHROME_WEB_STORE_URL, PRODUCT_TOOLS } from "@/lib/seo";

type ProductTool = (typeof PRODUCT_TOOLS)[number];

interface ProductToolCardProps {
  tool: ProductTool;
  /** "grid" stacks the CTA below the copy (get-started grid). "row" places it inline (tools index list). */
  layout?: "grid" | "row";
}

export default function ProductToolCard({
  tool,
  layout = "grid",
}: ProductToolCardProps) {
  const isExtension = tool.id === "extension";
  const comingSoon = "comingSoon" in tool && tool.comingSoon;
  const href = isExtension ? CHROME_WEB_STORE_URL : tool.href;

  const wrapperClass =
    layout === "row"
      ? "group flex h-full flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-left transition hover:bg-sand sm:flex-row sm:items-center sm:justify-between"
      : "group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-left transition hover:bg-sand";
  const lockedClass =
    layout === "row"
      ? "flex h-full flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-left sm:flex-row sm:items-center sm:justify-between"
      : "flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-left";

  const ctaClass = `text-sm font-semibold ${
    comingSoon ? "text-muted" : "text-brand group-hover:text-brand-hover"
  } ${layout === "grid" ? "mt-4" : ""}`;

  const body = (
    <>
      <div className={layout === "row" ? "" : undefined}>
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground">
            {tool.title}
          </h3>
          <span className="rounded-full bg-peach px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
            {tool.badge}
          </span>
        </div>
        <p
          className={`${layout === "grid" ? "mt-2 flex-1" : "mt-1"} text-sm leading-relaxed text-muted`}
        >
          {tool.description}
        </p>
      </div>
      <span className={ctaClass}>
        {tool.cta}
        {comingSoon ? "" : " →"}
      </span>
    </>
  );

  if (isExtension) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={comingSoon ? lockedClass : wrapperClass}>
      {body}
    </Link>
  );
}
