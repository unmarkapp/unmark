"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  connectGoogleDrive,
  disconnectGoogleDrive,
  getStorageStatus,
  setDefaultStorageProvider,
  storageProviderLabel,
  type StorageProvider,
  type StorageStatus,
} from "@/lib/storage";

type Props = {
  unlocked?: boolean;
  paymentsEnabled?: boolean;
  onUnlock?: () => void;
  unlocking?: boolean;
};

export default function LibraryStorageSettings({
  unlocked = false,
  paymentsEnabled = false,
  onUnlock,
  unlocking = false,
}: Props) {
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setStatus(await getStorageStatus());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load storage settings",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const cloudUnlocked =
    unlocked || status?.cloud_storage_unlocked === true;

  const handleProviderChange = async (provider: StorageProvider) => {
    if (provider === "google_drive" && !cloudUnlocked) {
      setError("Unlock Cloud Storage to use Google Drive.");
      return;
    }
    setBusy("provider");
    setError(null);
    setMessage(null);
    try {
      await setDefaultStorageProvider(provider);
      await refresh();
      if (provider === "google_drive") {
        setMessage(
          "Library saves will use Google Drive. Existing cleanups are syncing — refresh Library in a moment.",
        );
      } else {
        setMessage(`Library saves will use ${storageProviderLabel(provider)}.`);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update storage",
      );
    } finally {
      setBusy(null);
    }
  };

  const handleConnect = async () => {
    if (!cloudUnlocked) {
      setError("Unlock Cloud Storage to connect Google Drive.");
      return;
    }
    setBusy("connect");
    setError(null);
    try {
      await connectGoogleDrive();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not connect Google Drive",
      );
      setBusy(null);
    }
  };

  const handleDisconnect = async () => {
    setBusy("disconnect");
    setError(null);
    setMessage(null);
    try {
      await disconnectGoogleDrive();
      await refresh();
      setMessage("Google Drive disconnected.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not disconnect",
      );
    } finally {
      setBusy(null);
    }
  };

  const google = status?.providers.google_drive;
  const current = status?.default_provider ?? "unmark";

  return (
    <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">
        Library storage
      </h2>
      <p className="mt-2 text-sm text-muted">
        Your Library slots save to Unmark Cloud by default. Unlock Cloud Storage
        to connect Google Drive and sync cleanups to{" "}
        <span className="font-medium text-foreground">Unmark/Cleanups</span>.
      </p>

      {!cloudUnlocked && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-cream px-4 py-4">
          <p className="text-sm font-medium text-foreground">
            Cloud Storage is locked
          </p>
          <p className="mt-1 text-sm text-muted">
            One-time unlock to connect Google Drive and choose where new Library
            saves go.
          </p>
          {paymentsEnabled && onUnlock ? (
            <button
              type="button"
              disabled={unlocking || busy !== null}
              onClick={onUnlock}
              className="mt-3 rounded-[var(--radius-md)] bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)] transition hover:bg-brand-hover disabled:opacity-60"
            >
              {unlocking ? "Opening…" : "Unlock Cloud Storage"}
            </button>
          ) : (
            <p className="mt-3 text-sm text-muted">
              <Link href="/account" className="font-medium text-brand hover:underline">
                Buy Unlock Cloud Storage
              </Link>{" "}
              when payments are available.
            </p>
          )}
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-muted">Loading storage settings…</p>
      ) : (
        <div className="mt-5 space-y-3">
          <StorageOption
            name="Unmark Cloud"
            hint="Stored on Unmark (default)"
            selected={current === "unmark"}
            disabled={busy !== null}
            onSelect={() => void handleProviderChange("unmark")}
          />
          <StorageOption
            name="Google Drive"
            hint={
              !cloudUnlocked
                ? "Unlock Cloud Storage to enable"
                : google?.connected
                  ? `Folder: ${google.folder_name || "Unmark/Cleanups"}`
                  : google?.available
                    ? "Connect to save cleanups in your Drive"
                    : "Not configured on this server"
            }
            selected={current === "google_drive"}
            disabled={
              busy !== null ||
              !cloudUnlocked ||
              !google?.available ||
              !google.connected
            }
            locked={!cloudUnlocked}
            onSelect={() => void handleProviderChange("google_drive")}
          />

          {cloudUnlocked && google?.available && (
            <div className="flex flex-wrap gap-3 pt-2">
              {google.connected ? (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void handleDisconnect()}
                  className="text-sm font-medium text-muted hover:text-foreground disabled:opacity-60"
                >
                  {busy === "disconnect" ? "Disconnecting…" : "Disconnect Drive"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void handleConnect()}
                  className="rounded-[var(--radius-md)] bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06)] transition hover:bg-brand-hover disabled:opacity-60"
                >
                  {busy === "connect" ? "Connecting…" : "Connect Google Drive"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {message && <p className="mt-4 text-sm text-success">{message}</p>}
      {error && <p className="mt-4 text-sm text-danger">{error}</p>}
    </div>
  );
}

function StorageOption({
  name,
  hint,
  selected,
  disabled,
  locked,
  onSelect,
}: {
  name: string;
  hint: string;
  selected: boolean;
  disabled: boolean;
  locked?: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-4 has-[:checked]:border-brand ${
        disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      } ${locked ? "opacity-60" : ""}`}
    >
      <input
        type="radio"
        name="library-storage"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        className="mt-1"
      />
      <span>
        <span className="block text-sm font-medium text-foreground">
          {name}
          {locked ? " · Locked" : ""}
        </span>
        <span className="mt-1 block text-xs text-muted">{hint}</span>
      </span>
    </label>
  );
}
