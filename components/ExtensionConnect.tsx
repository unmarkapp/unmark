"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/auth";

type Status = "loading" | "needs-sign-in" | "handing-off" | "connected" | "error";

export default function ExtensionConnect() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) {
      setStatus("loading");
      return;
    }
    if (!user) {
      setStatus("needs-sign-in");
      return;
    }

    let cancelled = false;
    const ack = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "UNMARK_SAFARI_SESSION_ACK") {
        setStatus("connected");
      }
    };
    window.addEventListener("message", ack);

    const run = async () => {
      setStatus("handing-off");
      try {
        const res = await fetch("/api/extension/session", {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Could not read your Unmark session.");
        }
        const body = (await res.json()) as { token?: string };
        if (!body.token) {
          throw new Error("Could not read your Unmark session.");
        }
        if (cancelled) return;
        window.postMessage(
          { type: "UNMARK_SAFARI_SESSION", token: body.token },
          window.location.origin,
        );
        window.setTimeout(() => {
          if (!cancelled) {
            setStatus((current) =>
              current === "connected" ? current : "error",
            );
            setError(
              (current) =>
                current ||
                "Enable Unmark for Gemini on unmark.ink in Safari → Settings → Extensions, then reload this page.",
            );
          }
        }, 2500);
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    };

    void run();
    return () => {
      cancelled = true;
      window.removeEventListener("message", ack);
    };
  }, [loading, user]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">
        Safari extension
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Connect Unmark</h1>
      <p className="mt-3 text-muted">
        Safari cannot read the Unmark cookie the way Chrome does. This page
        hands your session to the extension, then you can Unmark images on
        Gemini.
      </p>

      {status === "loading" || status === "handing-off" ? (
        <p className="mt-8 text-sm text-muted">Connecting…</p>
      ) : null}

      {status === "needs-sign-in" ? (
        <button
          type="button"
          className="mx-auto mt-8 h-11 rounded-none border-2 border-ink bg-brand px-6 text-sm font-semibold text-white"
          onClick={loginWithGoogle}
        >
          Sign in with Google
        </button>
      ) : null}

      {status === "connected" ? (
        <p className="mt-8 border-2 border-ink bg-paper px-4 py-3 text-sm font-semibold">
          Connected. Open Gemini and click Unmark on an image.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="mt-8 border-2 border-ink px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </main>
  );
}
