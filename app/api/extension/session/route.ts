import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * First-party handoff for the Safari extension.
 * Safari's cookies API often omits HttpOnly `unmark_session`; this route
 * can read it on www.unmark.ink because the cookie is scoped to .unmark.ink.
 */
export async function GET(request: NextRequest) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const token = (await cookies()).get("unmark_session")?.value?.trim();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "not signed in" },
      { status: 401 },
    );
  }

  return NextResponse.json(
    { ok: true, token },
    { headers: { "Cache-Control": "no-store" } },
  );
}
