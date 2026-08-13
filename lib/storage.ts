const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type StorageProvider = "unmark" | "google_drive";

export interface StorageProviderInfo {
  available: boolean;
  connected: boolean;
  folder_name?: string;
}

export interface StorageStatus {
  configured: boolean;
  default_provider: StorageProvider;
  providers: {
    unmark: StorageProviderInfo;
    google_drive: StorageProviderInfo;
  };
}

export async function getStorageStatus(): Promise<StorageStatus> {
  const response = await fetch(
    `${API_BASE}/v1/integrations/storage/status`,
    { credentials: "include" },
  );
  if (!response.ok) {
    throw new Error("Could not load storage settings");
  }
  return (await response.json()) as StorageStatus;
}

export async function connectGoogleDrive(): Promise<void> {
  const returnTo = `${window.location.origin}/account`;
  const response = await fetch(
    `${API_BASE}/v1/integrations/storage/google-drive/connect?return_to=${encodeURIComponent(returnTo)}`,
    {
      credentials: "include",
      headers: { Accept: "application/json" },
    },
  );
  if (!response.ok) {
    throw new Error("Could not start Google Drive connect");
  }
  const data = (await response.json()) as { authorize_url?: string };
  if (!data.authorize_url) {
    throw new Error("Missing authorize URL");
  }
  window.location.href = data.authorize_url;
}

export async function disconnectGoogleDrive(): Promise<void> {
  const response = await fetch(
    `${API_BASE}/v1/integrations/storage/google-drive/disconnect`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("Could not disconnect Google Drive");
  }
}

export async function setDefaultStorageProvider(
  provider: StorageProvider,
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/v1/integrations/storage/preferences`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ default_provider: provider }),
    },
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.detail === "string"
        ? body.detail
        : "Could not update storage preference";
    throw new Error(message);
  }
}

export function storageProviderLabel(provider: StorageProvider): string {
  switch (provider) {
    case "google_drive":
      return "Google Drive";
    default:
      return "Unmark Cloud";
  }
}
