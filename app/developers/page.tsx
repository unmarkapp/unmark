import type { Metadata } from "next";
import Link from "next/link";

import CodeBlock, { type Snippet } from "@/components/dev/CodeBlock";
import DevCompareTable from "@/components/dev/DevCompareTable";
import DevIntegrations from "@/components/dev/DevIntegrations";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { MCP_SERVER_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Unmark for Developers",
  description:
    "Call Unmark's watermark and background removal tools from Claude, Cursor, or any MCP client. One connector, no glue code.",
  alternates: { canonical: "/developers" },
  openGraph: {
    title: "Unmark for Developers",
    description:
      "Remove watermarks and backgrounds from your agent — one MCP connector for Claude, Cursor, and more.",
    url: "/developers",
    type: "website",
  },
};

const SNIPPETS: Snippet[] = [
  {
    id: "claude",
    label: "Claude",
    lang: "text",
    code: `# Settings → Connectors → Add custom connector
# Name: Unmark   URL: ${MCP_SERVER_URL}
# Sign in with Google when prompted, then just ask:

Remove the watermark from https://www.unmark.ink/s/abc123 using Unmark`,
  },
  {
    id: "cursor",
    label: "Cursor",
    lang: "json",
    filename: "~/.cursor/mcp.json",
    code: `{
  "mcpServers": {
    "unmark": {
      "url": "${MCP_SERVER_URL}",
      "transport": "http",
      "headers": {
        "Authorization": "Bearer \${UNMARK_TOKEN}"
      }
    }
  }
}`,
  },
  {
    id: "curl",
    label: "cURL",
    lang: "bash",
    code: `curl "${MCP_SERVER_URL}" \\
  --header "Content-Type: application/json" \\
  --header "Authorization: Bearer $UNMARK_TOKEN" \\
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "remove_watermark",
      "arguments": { "image_url": "https://example.com/photo.png" }
    }
  }'`,
  },
  {
    id: "python",
    label: "Python",
    lang: "python",
    filename: "remove.py",
    code: `from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

url = "${MCP_SERVER_URL}"
headers = {"Authorization": f"Bearer {token}"}

async with streamablehttp_client(url, headers=headers) as (read, write, _):
    async with ClientSession(read, write) as session:
        await session.initialize()
        result = await session.call_tool(
            "remove_watermark",
            {"image_url": "https://example.com/photo.png"},
        )
        print(result)`,
  },
];

export default function DevelopersPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />

      <main className="relative">
        <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <p className="inline-flex items-center gap-2 border-2 border-ink bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
            For developers
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
            Watermark removal your agent can call directly.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {SITE_NAME} ships an MCP server — connect it to Claude, Cursor, or any
            MCP client and call <code className="text-sm">remove_watermark</code>,{" "}
            <code className="text-sm">remove_background</code>, and{" "}
            <code className="text-sm">get_job_status</code> like any other tool.
            No SDK to install, no upload endpoint to build.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/guides/mcp-server"
              className="inline-flex items-center gap-2 border-2 border-ink bg-brand px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
            >
              Read the docs
            </Link>
            <a
              href={MCP_SERVER_URL}
              className="inline-flex items-center gap-2 border-2 border-ink bg-surface px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition hover:bg-cream"
            >
              Server URL
            </a>
          </div>

          <div className="mt-12">
            <CodeBlock snippets={SNIPPETS} />
          </div>
        </section>

        <DevCompareTable />
        <DevIntegrations />

        <section className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl border-2 border-ink bg-surface px-6 py-10 text-center">
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Full setup steps, tool schemas, and FAQ live in the guide.
            </p>
            <Link
              href="/guides/mcp-server"
              className="mt-6 inline-flex items-center gap-2 border-2 border-ink bg-brand px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
            >
              Open the MCP server guide
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
