import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Soft default for which payment provider/currency to show first (India ->
 * Razorpay/INR, elsewhere -> PayPal/USD). Not a security boundary — the
 * buyer can always switch manually, so a VPN making this wrong just shows
 * the "wrong" default, nothing more.
 */
export async function GET() {
  const h = await headers();
  // Vercel sets this automatically at the edge; empty in local dev.
  const country = (h.get("x-vercel-ip-country") || "").toUpperCase();
  const currency = country === "IN" ? "inr" : "usd";
  return NextResponse.json({ country, currency });
}
