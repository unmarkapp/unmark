import { NextRequest, NextResponse } from "next/server";

/**
 * Short share link: https://www.unmark.ink/s/{jobId}
 * Proxies media from the API (which streams from S3) — no S3 redirect.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await context.params;
  if (!jobId || !/^[0-9a-fA-F-]{8,64}$/.test(jobId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const kind = request.nextUrl.searchParams.get("kind") || "result";
  const exp = request.nextUrl.searchParams.get("exp");
  const sig = request.nextUrl.searchParams.get("sig");
  const apiBase = (
    process.env.API_UPSTREAM ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.unmark.ink"
  ).replace(/\/$/, "");

  const upstreamHeaders: HeadersInit = {};
  const range = request.headers.get("range");
  if (range) {
    upstreamHeaders.Range = range;
  }

  const qs = new URLSearchParams({ kind });
  if (exp) qs.set("exp", exp);
  if (sig) qs.set("sig", sig);

  const upstream = await fetch(
    `${apiBase}/v1/share/${encodeURIComponent(jobId)}?${qs.toString()}`,
    {
      headers: upstreamHeaders,
      cache: "no-store",
    },
  );

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: "Not found" },
      { status: upstream.status === 404 ? 404 : 502 },
    );
  }

  const headers = new Headers();
  for (const name of [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
  ]) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "private, max-age=300");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
