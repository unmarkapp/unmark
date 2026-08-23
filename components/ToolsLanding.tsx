import Link from "next/link";

import InstantCleanEmbed from "@/components/InstantCleanEmbed";
import JsonLd from "@/components/JsonLd";
import PrivacyNote from "@/components/PrivacyNote";
import ProductToolCard from "@/components/ProductToolCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { PRODUCT_TOOLS } from "@/lib/seo";

export default function ToolsLanding() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <JsonLd data={breadcrumbJsonLd([{ name: "Tools", path: "/tools" }])} />
      <SiteHeader />
      <main className="relative mx-auto w-full max-w-5xl px-4 pb-12 pt-8 sm:px-6">
        <section className="mx-auto mt-10 max-w-3xl text-center sm:mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Unmark
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Unmark tools — watermark, video, and cutouts
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Image watermark removal, video cleanup, and background cutouts —
            one product for AI media that is ready to publish. Instant for a
            Gemini still is on this page; video and cutouts open their own
            tools.
          </p>
        </section>

        <div className="mx-auto max-w-3xl">
          <InstantCleanEmbed />
          <PrivacyNote />
        </div>

        <ul className="mx-auto mt-12 grid max-w-2xl gap-4">
          {PRODUCT_TOOLS.map((tool) => (
            <li key={tool.id}>
              <ProductToolCard tool={tool} layout="row" />
            </li>
          ))}
        </ul>

        <section className="mx-auto mt-14 max-w-2xl space-y-3 text-sm leading-relaxed text-muted-strong">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Which tool should I open?
          </h2>
          <p>
            Use Instant above for a single Gemini sparkle still. Open{" "}
            <Link href="/tools/background-removal" className="text-brand hover:underline">
              background removal
            </Link>{" "}
            for a transparent PNG. Video lives on the homepage drop zone and the
            Veo / Flow guides. The{" "}
            <Link
              href="/guides/free-gemini-watermark-remover"
              className="text-brand hover:underline"
            >
              free Gemini watermark remover
            </Link>{" "}
            guide explains what Instant covers versus Cloud credits. Agents
            should start at the{" "}
            <Link href="/guides/mcp-server" className="text-brand hover:underline">
              MCP server
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
