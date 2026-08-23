"use client";

import { useState } from "react";

type TokenType =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "number"
  | "function"
  | "property"
  | "flag"
  | "variable";

type Lang = "bash" | "json" | "python" | "javascript" | "text";

type Token = { text: string; type: TokenType };

export type Snippet = {
  id: string;
  label: string;
  lang: Lang;
  filename?: string;
  code: string;
};

/** Ordered (type, pattern) pairs — earlier patterns win on overlapping matches. */
const RULES: Record<Lang, Array<[TokenType, string]>> = {
  bash: [
    ["comment", "#.*"],
    ["string", `"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'`],
    ["flag", "(?<=^|\\s)-{1,2}[A-Za-z][\\w-]*"],
    ["variable", "\\$\\{?[A-Za-z_][\\w]*\\}?"],
    ["keyword", "\\b(?:curl|npx|npm|node|python3?|pip|export|echo)\\b"],
  ],
  json: [
    ["property", '"[^"]*"(?=\\s*:)'],
    ["string", '"(?:[^"\\\\]|\\\\.)*"'],
    ["keyword", "\\b(?:true|false|null)\\b"],
    ["number", "-?\\b\\d+(?:\\.\\d+)?\\b"],
  ],
  python: [
    ["comment", "#.*"],
    [
      "string",
      `'''[\\s\\S]*?'''|"""[\\s\\S]*?"""|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'`,
    ],
    [
      "keyword",
      "\\b(?:def|import|from|return|if|elif|else|for|while|in|as|with|try|except|class|None|True|False|and|or|not|async|await)\\b",
    ],
    ["number", "\\b\\d+(?:\\.\\d+)?\\b"],
    ["function", "\\b[A-Za-z_]\\w*(?=\\()"],
    ["property", "(?<=\\.)[A-Za-z_]\\w*"],
  ],
  javascript: [
    ["comment", "//.*|/\\*[\\s\\S]*?\\*/"],
    [
      "string",
      "`(?:[^`\\\\]|\\\\.)*`|\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'",
    ],
    [
      "keyword",
      "\\b(?:const|let|var|function|async|await|return|import|from|export|default|new|if|else|for|while|class|extends|try|catch|throw|typeof|instanceof|of|in|null|undefined|true|false|this)\\b",
    ],
    ["number", "\\b\\d+(?:\\.\\d+)?\\b"],
    ["function", "\\b[A-Za-z_$][\\w$]*(?=\\()"],
    ["property", "(?<=\\.)[A-Za-z_$][\\w$]*"],
  ],
  text: [],
};

function tokenize(code: string, lang: Lang): Token[] {
  const rules = RULES[lang];
  if (rules.length === 0) return [{ text: code, type: "plain" }];

  const re = new RegExp(rules.map(([, pattern]) => `(${pattern})`).join("|"), "gm");
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code))) {
    if (match.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, match.index), type: "plain" });
    }
    const groupIndex = match.slice(1).findIndex((g) => g !== undefined);
    tokens.push({ text: match[0], type: rules[groupIndex][0] });
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) re.lastIndex += 1;
  }
  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), type: "plain" });
  }
  return tokens;
}

function toLines(tokens: Token[]): Token[][] {
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    const parts = token.text.split("\n");
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part.length > 0) lines[lines.length - 1].push({ text: part, type: token.type });
    });
  }
  return lines;
}

const TOKEN_CLASS: Record<TokenType, string> = {
  plain: "text-[#f3ede1]",
  comment: "text-[#8a8172] italic",
  string: "text-[#7ee7c7]",
  keyword: "text-[#ff8a7a] font-medium",
  number: "text-[#f0c98a]",
  function: "text-[#7eb0ff]",
  property: "text-[#c9a8ff]",
  flag: "text-[#7eb0ff]",
  variable: "text-[#f0c98a]",
};

function Highlighted({ code, lang }: { code: string; lang: Lang }) {
  const lines = toLines(tokenize(code, lang));
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="w-7 shrink-0 select-none text-right text-[#6f6656] sm:w-8">
            {i + 1}
          </span>
          <span className="ml-4 min-w-0 flex-1 whitespace-pre-wrap break-words">
            {line.length === 0 ? (
              " "
            ) : (
              line.map((token, j) => (
                <span key={j} className={TOKEN_CLASS[token.type]}>
                  {token.text}
                </span>
              ))
            )}
          </span>
        </div>
      ))}
    </>
  );
}

export default function CodeBlock({
  snippets,
  defaultId,
}: {
  snippets: Snippet[];
  defaultId?: string;
}) {
  const [activeId, setActiveId] = useState(defaultId ?? snippets[0]?.id);
  const [copied, setCopied] = useState(false);
  const active = snippets.find((s) => s.id === activeId) ?? snippets[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[#1c1a17] shadow-[0_18px_50px_-28px_rgb(var(--shadow-color)/0.5)]">
      <div className="flex items-center justify-between border-b border-border bg-[#141210]">
        <div className="flex flex-1 overflow-x-auto">
          {snippets.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveId(s.id)}
              className={`shrink-0 border-r border-white/10 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] transition ${
                s.id === active.id
                  ? "bg-[#1c1a17] text-[#f3ede1]"
                  : "text-[#a89e8e] hover:text-[#f3ede1]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a89e8e] transition hover:text-[#f3ede1]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {active.filename ? (
        <div className="border-b border-white/10 px-4 py-1.5 font-mono text-[11px] text-[#a89e8e]">
          {active.filename}
        </div>
      ) : null}
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:text-[13.5px]">
        <Highlighted code={active.code} lang={active.lang} />
      </pre>
    </div>
  );
}
