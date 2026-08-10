import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side fetch of a result image so the browser can download it
 * (cross-origin S3 URLs ignore the HTML download attribute).
 */
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

  const host = parsed.hostname.toLowerCase();
  const allowed =
    host.endsWith(".amazonaws.com") ||
    host === "localhost" ||
    host === "127.0.0.1";

  if (!allowed) {
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
