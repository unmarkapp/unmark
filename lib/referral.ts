const REFERRAL_STORAGE_KEY = "unmark_ref";

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}

/** Persist ?ref= invite code until the user signs up. */
export function captureReferralFromUrl(): void {
  if (typeof window === "undefined") return;

  const ref = new URLSearchParams(window.location.search).get("ref");
  if (!ref) return;

  const code = normalizeReferralCode(ref);
  if (code.length < 4) return;

  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, code);
  } catch {
    // ignore
  }
}

export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const code = localStorage.getItem(REFERRAL_STORAGE_KEY);
    return code ? normalizeReferralCode(code) : null;
  } catch {
    return null;
  }
}

export function clearStoredReferralCode(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function referralInviteUrl(code: string, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/?ref=${encodeURIComponent(normalizeReferralCode(code))}`;
}

export function shareMessage(siteUrl: string): string {
  return `Remove Gemini & Veo watermarks for free with Unmark — ${siteUrl}`;
}
