import type { Metadata } from "next";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  ARTICLE_IMAGE,
  EDITORIAL_AUTHOR,
  GUIDES_PUBLISHED,
  GUIDES_REVIEWED,
  formatReviewDate,
  personJsonLd,
} from "@/lib/editorial";
import { MCP_SERVER_URL, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "MCP Server Guide",
  description:
    "Connect Unmark to Claude, Cursor, and other MCP clients. Remove Gemini watermarks and backgrounds from public image URLs using your Unmark account.",
  alternates: { canonical: "/guides/mcp-server" },
  openGraph: {
    title: "Unmark MCP Server Guide",
    description:
      "Connect Unmark to Claude and other MCP clients for watermark removal and background cleanup.",
    url: "/guides/mcp-server",
    type: "article",
  },
};

const claudeSteps = [
  "Open Claude → Settings → Connectors → Add custom connector.",
  "Name it Unmark and paste the MCP server URL (see below).",
  "Sign in with Google when Claude prompts you — this links your Unmark account.",
  "In chat, ask Claude to remove a watermark or background from a public image URL.",
];

const cursorSteps = [
  "Install Python 3.11+ and clone the unmark-mcp package from the repo (see README).",
  "Sign in on unmark.ink and copy your session cookie, or set UNMARK_BEARER_TOKEN for local dev.",
  "Add the server to Cursor MCP settings (stdio transport).",
  "Restart Cursor and invoke tools from the agent chat.",
];

const examplePrompts = [
  "Remove the watermark from https://www.unmark.ink/s/abc123 using Unmark",
  "Remove the background from https://example.com/photo.png using Unmark",
  "Clean the Gemini sparkle from this share link: https://www.unmark.ink/s/xyz789",
];

const tools = [
  {
    name: "remove_watermark",
    description:
      "Remove the Gemini sparkle watermark. Pass image_url (public HTTPS) or a unmark.ink share link.",
  },
  {
    name: "remove_background",
    description:
      "Remove the image background. Same URL rules as remove_watermark.",
  },
  {
    name: "get_job_status",
    description: "Check progress or fetch results for a Cloud job by job ID.",
  },
];

const faqItems = [
  {
    question: "Do I need a separate API key?",
    answer:
      "Not for Claude Connectors. Claude’s hosted MCP uses OAuth with the same Google account you use on Unmark — you sign in once when you add the connector. Local Cursor or other stdio setups can use a bearer token or a browser session cookie instead of OAuth. There is no second Unmark “MCP key” to buy. Cloud credits on your Unmark account are what the tools spend when they actually clean an image.",
  },
  {
    question: "Why does Claude say it cannot read my upload?",
    answer:
      "Hosted MCP can only fetch public HTTPS image URLs or Unmark share links. Claude’s private upload paths (for example files under /mnt/user-data) are not visible to Unmark. Put the still on a public URL, share it from Library, or use the agent skill on a local file in Cursor. This is the most common setup miss — the connector is working; the image URL is not reachable.",
  },
  {
    question: "Does MCP use Cloud credits?",
    answer:
      "Yes. remove_watermark, remove_background, and get_job_status call the same Cloud product as the website and the Chrome extension. Finished jobs show up in Library so you can download them in the browser too. Instant in the browser does not use MCP and does not need a connector — it is the no-account stills path. Use MCP when you want Claude or another client to trigger cleanup from chat.",
  },
  {
    question: "Can a coding agent clean files in my repo?",
    answer:
      "Yes — that is the agent skill, not hosted MCP. Install from https://www.unmark.ink/skills so Cursor, Claude Code, or Codex can clean local stills as part of a larger task. MCP stays the chat connector for public URLs. Pick skill for repo files, MCP for “clean this https link,” and Instant for a one-off drop in the browser.",
  },
];

const pageUrl = `${SITE_URL}/guides/mcp-server`;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Unmark MCP Server",
        item: pageUrl,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Unmark MCP Server",
    description:
      "Connect Unmark to Claude, Cursor, and other MCP clients for Gemini watermark removal and background cutouts.",
    url: pageUrl,
    image: ARTICLE_IMAGE,
    datePublished: GUIDES_PUBLISHED,
    dateModified: GUIDES_REVIEWED,
    author: personJsonLd(),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  },
];

export default function McpServerGuidePage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      <SiteHeader />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-brand">Guide</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Unmark MCP Server
        </h1>
        <p className="mt-3 text-sm text-muted">
          By{" "}
          <Link
            href="/about"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            {EDITORIAL_AUTHOR.name}
          </Link>
          {" · "}
          Updated {formatReviewDate(GUIDES_REVIEWED)}
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-strong sm:text-lg">
          Connect {SITE_NAME} to AI assistants via the Model Context Protocol (MCP).
          Remove Gemini watermarks, strip backgrounds, and poll Cloud jobs — all using
          your Unmark credits and Library. This is the chat connector for Claude,
          Cursor, and other MCP clients: paste the hosted server URL, sign in with
          Google, then ask the agent to call remove_watermark or remove_background on
          a public image URL. It is not the free Instant drop zone and not the repo
          skill on /skills. Instant stills stay in the browser; MCP tool calls use
          the same Cloud balance as the website.
        </p>

        <section className="mt-12 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Server URL
          </h2>
          <p className="mt-2 text-sm text-muted">
            Use this URL when adding a custom connector in Claude or other hosted MCP
            clients:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-border bg-white/80 p-4 text-sm">
            <code>{MCP_SERVER_URL}</code>
          </pre>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Claude Connectors
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            Claude supports hosted MCP with OAuth — no API keys to paste. You sign in
            with the same Google account you use on{" "}
            <Link href="/" className="text-brand underline-offset-2 hover:underline">
              unmark.ink
            </Link>
            .
          </p>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-muted-strong">
            {claudeSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Example prompts
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            Hosted MCP cannot read files from Claude&apos;s upload sandbox. Always use a
            public <code className="text-sm">image_url</code> or an Unmark share link.
          </p>
          <ul className="mt-5 space-y-3">
            {examplePrompts.map((prompt) => (
              <li
                key={prompt}
                className="rounded-xl border border-border bg-cream/30 px-4 py-3 text-sm text-foreground"
              >
                &ldquo;{prompt}&rdquo;
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Tools</h2>
          <ul className="mt-5 space-y-4">
            {tools.map((tool) => (
              <li key={tool.name} className="rounded-xl border border-border p-4">
                <code className="text-sm font-semibold text-brand">{tool.name}</code>
                <p className="mt-1 text-sm leading-relaxed text-muted-strong">
                  {tool.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Image URLs & share links
          </h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted-strong">
            <li>
              <strong className="font-semibold text-foreground">Public HTTPS URLs</strong>{" "}
              — direct links to PNG/JPEG/WebP files work best.
            </li>
            <li>
              <strong className="font-semibold text-foreground">Unmark share links</strong>{" "}
              — <code className="text-sm">https://www.unmark.ink/s/&lt;job-id&gt;</code>{" "}
              resolves automatically to your Cloud job image.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Not supported in hosted MCP
              </strong>{" "}
              — local file paths (e.g. Claude upload paths like{" "}
              <code className="text-sm">/mnt/user-data/uploads/...</code>) are only
              available in local stdio setups such as Cursor.
            </li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            MCP vs Instant vs the agent skill
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            Instant is the no-account stills tool in the browser. Use it when you
            have one Gemini PNG and you want a download now. The agent skill is
            for Cursor, Claude Code, and Codex working on files already in a
            repo. MCP is for chat: you pass a public image URL or an Unmark
            share link, and Claude (or another client) calls Unmark Cloud.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-strong">
            Hosted MCP will not see a file you attached only inside Claude.
            Local stdio in Cursor can use env tokens and, in some setups, local
            paths — that is why the Cursor block below exists. If you only
            needed a sparkle off a still, skip this page and open Instant.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-cream/50 p-6">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Cursor (local stdio)
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-strong">
            For Cursor or other editors that run MCP as a local process, configure stdio
            transport and point at the <code className="text-sm">unmark-mcp</code> package
            in the repo. Local mode can use bearer tokens or session cookies for auth.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-strong">
            {cursorSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            Example <code className="text-sm">.cursor/mcp.json</code>:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-white/80 p-4 text-xs sm:text-sm">
            <code>{`{
  "mcpServers": {
    "unmark": {
      "command": "python",
      "args": ["-m", "unmark_mcp.server"],
      "env": {
        "UNMARK_API_URL": "https://api.unmark.ink",
        "UNMARK_BEARER_TOKEN": "<your-token-if-using-static-auth>"
      }
    }
  }
}`}</code>
          </pre>
        </section>

        <div className="mt-14 rounded-2xl border border-border bg-cream/50 px-6 py-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Connect Claude to Unmark
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Copy the MCP URL into Claude Connectors, sign in with Google, and start
            cleaning images from chat.
          </p>
          <p className="mt-5 font-mono text-sm text-brand">{MCP_SERVER_URL}</p>
        </div>

        <section className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Common questions
          </h2>
          <div className="mt-8 space-y-8">
            {faqItems.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-strong">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-sm text-muted">
          Need a repo workflow instead of chat tools?{" "}
          <Link href="/skills" className="text-brand underline-offset-2 hover:underline">
            Install the Unmark skill
          </Link>
          . Need the web app?{" "}
          <Link href="/" className="text-brand underline-offset-2 hover:underline">
            Open Unmark
          </Link>{" "}
          or see{" "}
          <Link
            href="/guides/remove-gemini-watermark"
            className="text-brand underline-offset-2 hover:underline"
          >
            how to remove Gemini watermarks
          </Link>
          .
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
