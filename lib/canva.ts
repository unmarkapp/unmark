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

function openCanvaEditUrl(editUrl: string, pendingTab: Window | null): void {
  if (pendingTab && !pendingTab.closed) {
    try {
      pendingTab.opener = null;
      pendingTab.location.href = editUrl;
      return;
    } catch {
      // Fall through to same-tab navigation.
    }
  }
  window.location.assign(editUrl);
}

function openPendingCanvaTab(): Window | null {
  const tab = window.open("about:blank", "_blank");
  if (tab && !tab.closed) {
    try {
      tab.document.title = "Opening Canva…";
      tab.document.body.innerHTML =
        "<p style=\"font:16px/1.5 system-ui,sans-serif;padding:24px;color:#0D1216\">Opening your design in Canva…</p>";
    } catch {
      // Cross-origin restrictions on about:blank are fine to ignore.
    }
  }
  return tab;
}

function closePendingCanvaTab(tab: Window | null): void {
  if (tab && !tab.closed) {
    tab.close();
  }
}

export async function openInCanva(ctx: CanvaPromoContext): Promise<void> {
  const jobId = ctx.jobId;
  const shareUrl = ctx.shareUrl || (jobId ? shareUrlForJob(jobId) : undefined);

  if (!jobId && !shareUrl) {
    window.open(canvaReferralUrl(), "_blank", "noopener,noreferrer");
    return;
  }

  // Open the tab synchronously on click — async fetch alone loses the gesture
  // and popup blockers silently block window.open after await.
  const pendingTab = openPendingCanvaTab();

  try {
    const result = await importToCanva({
      jobId,
      imageUrl: shareUrl,
      title: ctx.title || "Unmark export",
    });
    if (!result.edit_url) {
      throw new Error("Canva did not return an edit link");
    }
    openCanvaEditUrl(result.edit_url, pendingTab);
  } catch (err) {
    closePendingCanvaTab(pendingTab);
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
