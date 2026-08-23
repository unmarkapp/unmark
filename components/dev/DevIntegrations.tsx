const INTEGRATIONS = [
  { id: "claude", name: "Claude", line: "Hosted connector, OAuth sign-in" },
  { id: "cursor", name: "Cursor", line: "stdio MCP, bearer token" },
  { id: "vscode", name: "VS Code", line: "MCP via Copilot / Cline" },
  { id: "http", name: "Any MCP client", line: "Streamable HTTP transport" },
] as const;

function Monogram({ letter }: { letter: string }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-ink font-display text-lg font-bold text-white">
      {letter}
    </span>
  );
}

export default function DevIntegrations() {
  return (
    <section className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
          Integrations
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
          Works with the tools you already have open.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">
          One MCP server. Add the connector once, then call{" "}
          <code className="text-sm">remove_watermark</code> and{" "}
          <code className="text-sm">remove_background</code> from any client that
          speaks MCP.
        </p>
      </div>

      <ul className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {INTEGRATIONS.map((item) => (
          <li
            key={item.id}
            className="flex h-full items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-4"
          >
            <Monogram letter={item.name[0]} />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold text-foreground">
                {item.name}
              </span>
              <span className="mt-0.5 block text-sm text-muted">{item.line}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
