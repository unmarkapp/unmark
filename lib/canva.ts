import { SITE_URL } from "@/lib/seo";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.unmark.ink";

const CANVA_REFERRAL_URL =
  "https://www.canva.com/create?utm_source=unmark&utm_medium=referral&utm_campaign=post_download";

const DISMISS_KEY = "unmark_canva_promo_dismissed";

export type CanvaPromoContext = {
  jobId?: string;
  shareUrl?: string;
  title?: string;
  /** Images only — video hides Edit in Canva import */
  mediaType?: "image" | "video";
};

export function isCanvaPromoDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DISMISS_KEY) === "1";
}

export function dismissCanvaPromoPermanent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DISMISS_KEY, "1");
}

export function canvaReferralUrl(): string {
  return CANVA_REFERRAL_URL;
}

export function shareUrlForJob(jobId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/s/${jobId}`;
  }
  return `${SITE_URL}/s/${jobId}`;
}

export async function fetchCanvaStatus(): Promise<{
  configured: boolean;
  connected: boolean;
}> {
  const response = await fetch(
    `${API_BASE_URL}/v1/integrations/canva/status`,
    { credentials: "include" },
  );
  if (!response.ok) {
    return { configured: false, connected: false };
  }
  return response.json();
}

export function canvaConnectUrl(returnTo: string, force = false): string {
  const path =
    typeof window !== "undefined"
      ? returnTo || window.location.pathname
      : returnTo || "/";
  const params = new URLSearchParams({ return_to: path });
  if (force) {
    params.set("force", "1");
  }
  return `${API_BASE_URL}/v1/integrations/canva/connect?${params}`;
}

function redirectToCanvaConnect(force = false): void {
  const returnTo =
    typeof window !== "undefined" ? window.location.pathname : "/";
  window.location.href = canvaConnectUrl(returnTo, force);
}

export async function importToCanva(input: {
  jobId?: string;
  imageUrl?: string;
  title?: string;
}): Promise<{ edit_url: string }> {
  const response = await fetch(
    `${API_BASE_URL}/v1/integrations/canva/import`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: input.jobId,
        image_url: input.imageUrl,
        title: input.title,
      }),
    },
  );
  const body = await response.json().catch(() => ({}));
  if (response.status === 401 && body.detail === "canva_not_connected") {
    const err = new Error("canva_not_connected");
    throw err;
  }
  if (response.status === 401 && body.detail === "canva_reconnect_required") {
    const err = new Error("canva_reconnect_required");
    throw err;
  }
  if (!response.ok) {
    const detail =
      typeof body.detail === "string" ? body.detail : "Could not open in Canva";
    if (detail.includes("missing_scope")) {
      const err = new Error("canva_reconnect_required");
      throw err;
    }
    throw new Error(detail);
  }
  return body;
}

export async function openInCanva(ctx: CanvaPromoContext): Promise<void> {
  const jobId = ctx.jobId;
  const shareUrl = ctx.shareUrl || (jobId ? shareUrlForJob(jobId) : undefined);

  if (!jobId && !shareUrl) {
    window.open(canvaReferralUrl(), "_blank", "noopener,noreferrer");
    return;
  }

  try {
    const result = await importToCanva({
      jobId,
      imageUrl: shareUrl,
      title: ctx.title || "Unmark export",
    });
    window.open(result.edit_url, "_blank", "noopener,noreferrer");
  } catch (err) {
    if (err instanceof Error && err.message === "canva_not_connected") {
      redirectToCanvaConnect(false);
      return;
    }
    if (err instanceof Error && err.message === "canva_reconnect_required") {
      redirectToCanvaConnect(true);
      return;
    }
    throw err;
  }
}
