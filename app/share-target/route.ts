import { NextResponse } from "next/server";

/**
 * Fallback if the service worker is not yet controlling this client.
 * Shared files cannot be forwarded across a redirect without IndexedDB,
 * so we send the user to the chooser with an empty inbox.
 */
export async function POST(request: Request) {
  const url = new URL("/share?need_pwa=1", request.url);
  return NextResponse.redirect(url, 303);
}
