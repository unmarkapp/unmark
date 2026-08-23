type Cell = "yes" | "no" | "partial" | string;

type Row = {
  capability: string;
  diy: Cell;
  unmark: Cell;
};

const ROWS: Row[] = [
  { capability: "Setup", diy: "Write upload + polling code", unmark: "Add one connector URL" },
  { capability: "Auth", diy: "Build your own key management", unmark: "OAuth or bearer token" },
  { capability: "Watermark removal", diy: "no", unmark: "yes" },
  { capability: "Background removal", diy: "no", unmark: "yes" },
  { capability: "Video support", diy: "partial", unmark: "yes" },
  { capability: "Job status polling", diy: "You build it", unmark: "get_job_status tool included" },
  { capability: "Works in Claude & Cursor", diy: "no", unmark: "yes" },
];

function CellValue({ value }: { value: Cell }) {
  if (value === "yes") {
    return (
      <span
        className="inline-flex items-center justify-center text-success"
        role="img"
        aria-label="Yes"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M4.5 10.5 8 14l7.5-8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (value === "no") {
    return (
      <span
        className="inline-flex items-center justify-center text-danger"
        role="img"
        aria-label="No"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span
        className="inline-flex items-center justify-center font-display text-xl font-semibold text-brand/80"
        role="img"
        aria-label="Limited"
      >
        ~
      </span>
    );
  }
  return <span className="text-sm font-medium text-muted-strong">{value}</span>;
}

export default function DevCompareTable() {
  return (
    <section className="mx-auto w-full max-w-5xl border-t border-border/80 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
          Why MCP
        </p>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
          Skip the glue code
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          No upload endpoints to wire up, no polling loop to write. The tools your
          agent needs are already on the other end of the connector.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[0_18px_50px_-28px_rgb(var(--shadow-color)/0.35)]">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Comparison of building your own watermark removal glue code versus the
            Unmark MCP server
          </caption>
          <thead>
            <tr className="bg-ink text-cream dark:bg-foreground dark:text-ink">
              <th scope="col" className="px-4 py-3.5 font-semibold sm:px-5">
                Capability
              </th>
              <th scope="col" className="px-3 py-3.5 text-center font-medium text-cream/75 sm:px-4">
                DIY integration
              </th>
              <th scope="col" className="bg-cobalt px-3 py-3.5 text-center font-semibold text-white sm:px-4">
                Unmark MCP
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.capability} className="border-t border-border/90 even:bg-background/40">
                <th scope="row" className="px-4 py-3.5 font-medium text-foreground sm:px-5">
                  {row.capability}
                </th>
                <td className="px-3 py-3.5 text-center sm:px-4">
                  <CellValue value={row.diy} />
                </td>
                <td className="bg-brand-soft/50 px-3 py-3.5 text-center dark:bg-brand/10 sm:px-4">
                  <CellValue value={row.unmark} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
