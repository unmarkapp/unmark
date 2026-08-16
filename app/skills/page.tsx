import type { Metadata } from "next";
import Link from "next/link";

import CodeBlock, { type Snippet } from "@/components/dev/CodeBlock";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SkillsFaq from "@/components/SkillsFaq";
import { MCP_SERVER_URL, SITE_NAME, SITE_URL } from "@/lib/seo";

const SKILLS_REPO = "unmarkapp/unmark";
const SKILLS_GITHUB = `https://github.com/${SKILLS_REPO}/tree/main/skills/unmark`;
const INSTALL_CMD = `npx skills add ${SKILLS_REPO} --skill unmark`;

export const metadata: Metadata = {
  title: "AI Agent Skill for Gemini Image Cleanup",
  description:
    "Give Cursor, Claude Code, or Codex a repeatable Unmark workflow for cleaning Gemini sparkles on local images — plus MCP when you want a connector instead of a script.",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Unmark Agent Skill — Codex, Claude, Cursor",
    description:
      "Install an Unmark skill so coding agents can clean Gemini watermarks on local stills while they update docs or prep a batch.",
    url: "/skills",
    type: "website",
  },
};

const SNIPPETS: Snippet[] = [
  {
    id: "install",
    label: "Install",
    lang: "bash",
    code: `# Add the skill to this agent workspace
${INSTALL_CMD}

# Sign in on unmark.ink, then set the same token used for Unmark MCP
export UNMARK_BEARER_TOKEN=…`,
  },
  {
    id: "clean",
    label: "Clean",
    lang: "bash",
    filename: "skills/unmark/scripts/run.mjs",
    code: `# One Gemini still
node skills/unmark/scripts/run.mjs remove ./input.png --output ./clean.png

# A folder of exports
node skills/unmark/scripts/run.mjs remove ./exports --out-dir ./cleaned`,
  },
];

const WHAT_YOU_GET = [
  {
    title: "Instruction file",
    body: "A SKILL.md agents load so they know when to clean Gemini stills and how to call Unmark.",
  },
  {
    title: "Local runner",
    body: "A script that takes PNG, JPG, or WebP paths, writes cleaned files, and can print JSON for pipelines.",
  },
  {
    title: "MCP when you want it",
    body: "If Cursor or Claude already has the Unmark connector, the skill tells the agent to use that instead.",
  },
] as const;

const WORKFLOWS = [
  {
    title: "Repo asset cleanup",
    body: "Let Cursor or Codex clean generated images while updating docs, examples, or site content.",
  },
  {
    title: "Batch publishing prep",
    body: "Process a folder of Gemini exports before you ship blog covers, social cards, or tutorial screenshots.",
  },
  {
    title: "Same account as the web",
    body: "Cleaned stills land in your Unmark Library. Video and Instant-in-browser cleanup stay on the website.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "What is the Unmark skill?",
    answer:
      "A reusable instruction file plus a script so coding agents can remove the visible Gemini sparkle from local image files. Install once per workspace, then ask the agent to clean stills as part of a larger task.",
  },
  {
    question: "When should I use the skill instead of the website?",
    answer:
      "Use the skill when cleanup is part of a repo or batch workflow. Use Instant on the homepage when you only need to drop in one or two images by hand.",
  },
  {
    question: "Is this the right page for manual cleanup?",
    answer:
      "Usually no. This page is for agent workflows. For manual cleanup, use Instant on unmark.ink — no account required for a single image.",
  },
  {
    question: "Does the skill keep files only on my machine?",
    answer:
      "The script sends stills to Unmark Cloud and writes the cleaned file back to your workspace. Results also appear in Library. For in-browser cleanup that never leaves the device, use Instant on the homepage.",
  },
  {
    question: "Is the skill different from MCP?",
    answer:
      "Same Unmark account, different shape. MCP is a connector your assistant calls as tools. The skill is an instruction file the agent reads, then it runs a local script on file paths. Use MCP in Claude or Cursor chat; use the skill when the agent is already working in a git workspace.",
  },
  {
    question: "Do I need an Unmark account?",
    answer:
      "Yes for the skill and for MCP. Instant on the website can clean one image without signing in. The skill uses your Cloud credits, same as the web app.",
  },
] as const;

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function SkillsPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <SiteHeader />

      <main className="relative">
        <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <p className="inline-flex items-center gap-2 border-2 border-ink bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
            AI agent workflow
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem] md:leading-[1.08]">
            Agent skill for Gemini image cleanup.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Give Cursor, Claude Code, or Codex a repeatable way to clean Gemini
            sparkles on local stills while it updates docs, prepares repo files,
            or runs a batch. {SITE_NAME} already has{" "}
            <Link
              href="/developers"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              MCP
            </Link>{" "}
            for chat tools — this is the file-path version.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#install"
              className="inline-flex items-center gap-2 border-2 border-ink bg-brand px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
            >
              Install the skill
            </a>
            <Link
              href="/#upload"
              className="inline-flex items-center gap-2 border-2 border-ink bg-surface px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition hover:bg-cream"
            >
              Use the website
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
              What you get
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Instructions, a runner, and MCP when it is already there.
            </h2>
          </div>
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {WHAT_YOU_GET.map((item) => (
              <li
                key={item.title}
                className="flex h-full flex-col border-2 border-ink bg-surface p-5"
              >
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="install"
          className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
              Install
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Add it to the workspace once.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Works with Cursor, Claude Code, Codex, and other agents that load
              Markdown skill files. Then call the bundled script whenever image
              cleanup is part of a larger task.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            <CodeBlock snippets={SNIPPETS} />
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-muted">
            Keep <code className="text-sm">--skill unmark</code> so only this
            skill is added to the workspace.
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted">
            Prefer a connector instead of a script?{" "}
            <Link
              href="/developers"
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              Add Unmark MCP
            </Link>{" "}
            at{" "}
            <a
              href={MCP_SERVER_URL}
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              mcp.unmark.ink
            </a>
            .
          </p>
        </section>

        <section className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
              Workflows
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Where the skill pays off.
            </h2>
          </div>
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {WORKFLOWS.map((item) => (
              <li
                key={item.title}
                className="flex h-full flex-col border-2 border-ink bg-surface p-5"
              >
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="faq"
          className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Skills FAQ
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Agent workflows, MCP, and when to stay on the website.
            </p>
          </div>
          <SkillsFaq items={FAQ_ITEMS} />
        </section>

        <section className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl border-2 border-ink bg-surface px-6 py-10 text-center">
            <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Install once. The agent does the rest.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              Instant on the homepage stays a click away for one-off images.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#install"
                className="inline-flex items-center gap-2 border-2 border-ink bg-brand px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-hover"
              >
                Install the skill
              </a>
              <a
                href={SKILLS_GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-ink bg-surface px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-foreground transition hover:bg-cream"
              >
                View on GitHub
              </a>
            </div>
            <p className="mt-6 text-xs text-muted">
              {SITE_URL}/skills · {INSTALL_CMD}
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
