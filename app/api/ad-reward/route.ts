import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.unmark.ink";

export async function POST(req: NextRequest) {
  const cookie = req.headers.get("cookie") ?? "";
  const res = await fetch(`${API_BASE}/v1/credits/ad-reward`, {
    method: "POST",
    headers: {
      Cookie: cookie,
      "Content-Type": "application/json",
    },
  });

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
