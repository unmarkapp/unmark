import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side fetch of a result image so the browser can download it
 * (cross-origin S3 URLs ignore the HTML download attribute).
 *
 * Allowlist: Unmark API hosts + known Unmark media buckets only
 * (not bare *.amazonaws.com).
 */
function isAllowedDownloadHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "api.unmark.ink" || h === "localhost" || h === "127.0.0.1") {
    return true;
  }
  if (
    h === "unmark-results.s3.amazonaws.com" ||
    h === "unmark-results.s3.us-east-1.amazonaws.com" ||
    (h.startsWith("unmark-") &&
      h.includes(".s3.") &&
      h.endsWith(".amazonaws.com"))
  ) {
    return true;
  }
  // Path-style S3 — bucket segment checked in isAllowedDownloadURL.
  if (h === "s3.amazonaws.com" || /^s3\.[a-z0-9-]+\.amazonaws\.com$/.test(h)) {
    return true;
  }
  // Known Unmark result buckets (virtual-hosted).
  if (
    h.includes(".s3.") &&
    h.endsWith(".amazonaws.com") &&
    (h.startsWith("watermark-remove-") || h.startsWith("unmark-"))
  ) {
    return true;
  }
  return false;
}

function isAllowedDownloadURL(parsed: URL): boolean {
  const host = parsed.hostname.toLowerCase();
  if (!isAllowedDownloadHost(host)) {
    return false;
  }
  if (
    host === "s3.amazonaws.com" ||
    /^s3\.[a-z0-9-]+\.amazonaws\.com$/.test(host)
  ) {
    const bucket = parsed.pathname.split("/").filter(Boolean)[0] || "";
    return (
      bucket.startsWith("unmark-") || bucket.startsWith("watermark-remove-")
    );
  }
  return true;
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");
  const fileName =
    request.nextUrl.searchParams.get("filename") || "cleaned.png";

  if (!rawUrl) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (
    parsed.protocol !== "https:" &&
    parsed.hostname !== "localhost" &&
    parsed.hostname !== "127.0.0.1"
  ) {
    return NextResponse.json({ error: "url not allowed" }, { status: 400 });
  }

  if (!isAllowedDownloadURL(parsed)) {
    return NextResponse.json({ error: "url not allowed" }, { status: 400 });
  }

  const upstream = await fetch(rawUrl);
  if (!upstream.ok) {
    return NextResponse.json(
      { error: "failed to fetch result" },
      { status: 502 },
    );
  }

  const bytes = await upstream.arrayBuffer();
  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";
  const safeName = fileName.replace(/[^\w.\-]+/g, "_") || "cleaned.png";

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Cache-Control": "no-store",
    },
  });
}
