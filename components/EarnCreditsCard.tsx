"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/lib/credits";
import {
  applyReferralCode,
  claimShareBonus,
  type BillingAccount,
} from "@/lib/billing";
import {
  clearStoredReferralCode,
  getStoredReferralCode,
  referralInviteUrl,
  shareMessage,
} from "@/lib/referral";
import { SITE_URL } from "@/lib/seo";

type EarnCreditsCardProps = {
  account: BillingAccount | null;
  onRefresh: () => Promise<void>;
};

export default function EarnCreditsCard({
  account,
  onRefresh,
}: EarnCreditsCardProps) {
  const { user, refresh: refreshAuth } = useAuth();
  const { refreshCredits } = useCredits();
  const [inviteInput, setInviteInput] = useState(
    () => getStoredReferralCode() ?? "",
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const referralCode = user?.referral_code ?? "";
  const inviteLink = referralCode
    ? referralInviteUrl(referralCode, SITE_URL)
    : "";
  const codeLoading = Boolean(user) && !referralCode;
  const dailyFree = account?.daily_free_credits ?? 5;
  const shareBonus = account?.share_bonus_credits ?? 2;
  const referralBonus = account?.referral_referrer_credits ?? 3;
  const referralsCount = account?.referrals_count ?? 0;
  const shareClaimed = account?.share_bonus_claimed_today === true;
  const referredApplied = user?.referred_by_applied === true;

  const refreshAll = async () => {
    await Promise.all([refreshAuth(), refreshCredits(), onRefresh()]);
  };

  useEffect(() => {
    if (user && !user.referral_code) {
      void refreshAuth();
    }
  }, [user, refreshAuth]);

  const copyInviteLink = async () => {
    if (!inviteLink) return;
    setError(null);
    try {
      await navigator.clipboard.writeText(inviteLink);
      setMessage("Invite link copied");
    } catch {
      setError("Could not copy link");
    }
  };

  const shareApp = async () => {
    if (!inviteLink) return;
    setError(null);
    setBusy("share");
    try {
      const text = shareMessage(inviteLink);
      if (navigator.share) {
        await navigator.share({
          title: "Unmark — Gemini watermark remover",
          text,
          url: inviteLink,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setMessage("Share text copied — paste it anywhere");
      }
      await claimShareBonus();
      await refreshAll();
      setMessage(
        shareClaimed
          ? "Thanks for sharing!"
          : `+${shareBonus} credits added for sharing today`,
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      if (
        err instanceof Error &&
        /already claimed|409/i.test(err.message)
      ) {
        setMessage("Share bonus already claimed today");
      } else {
        setError(
          err instanceof Error ? err.message : "Could not claim share bonus",
        );
      }
    } finally {
      setBusy(null);
    }
  };

  const applyInviteCode = async () => {
    const code = inviteInput.trim();
    if (!code) return;
    setBusy("invite");
    setError(null);
    setMessage(null);
    try {
      await applyReferralCode(code);
      clearStoredReferralCode();
      setInviteInput("");
      await refreshAll();
      setMessage("Invite code applied — bonus credits added");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not apply invite code",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-6 border border-border bg-white p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">
        Earn free credits
      </h2>
      <p className="mt-2 text-sm text-muted">
        Daily login credits, sharing Unmark, and inviting friends.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <RewardTile
          title="Daily credits"
          value={`${dailyFree}/day`}
          hint="Added automatically at midnight UTC"
          done
        />
        <RewardTile
          title="Share Unmark"
          value={`+${shareBonus}`}
          hint={
            shareClaimed
              ? "Claimed today — come back tomorrow"
              : "Once per day via share or copy"
          }
          done={shareClaimed}
        />
        <RewardTile
          title="Invite friends"
          value={`+${referralBonus}`}
          hint={`${referralsCount} joined · you both get credits`}
          done={false}
        />
      </div>

      {referralCode ? (
        <div className="mt-6 border border-border bg-surface px-4 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Your invite code
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="font-mono text-lg font-bold tracking-widest text-foreground">
              {referralCode}
            </span>
            <button
              type="button"
              onClick={() => void copyInviteLink()}
              className="text-sm font-medium text-brand hover:underline"
            >
              Copy link
            </button>
          </div>
          <p className="mt-2 break-all text-xs text-muted">{inviteLink}</p>
        </div>
      ) : codeLoading ? (
        <div className="mt-6 border border-border bg-surface px-4 py-4 text-sm text-muted">
          Generating your invite code…
        </div>
      ) : (
        <div className="mt-6 border border-border bg-surface px-4 py-4">
          <p className="text-sm text-muted">
            Sign in to get your personal invite code.
          </p>
          <button
            type="button"
            onClick={() => void refreshAuth()}
            className="mt-2 text-sm font-medium text-brand hover:underline"
          >
            Refresh
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!inviteLink || busy !== null}
          onClick={() => void shareApp()}
          className="bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "share"
            ? "Sharing…"
            : shareClaimed
              ? "Share again"
              : `Share & earn +${shareBonus}`}
        </button>
        <button
          type="button"
          disabled={!inviteLink || busy !== null}
          onClick={() => void copyInviteLink()}
          className="border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand-line disabled:cursor-not-allowed disabled:opacity-60"
        >
          Copy invite link
        </button>
      </div>

      {!referredApplied && (
        <div className="mt-6 border-t border-border pt-5">
          <div className="text-sm font-medium text-foreground">
            Have a friend&apos;s invite code?
          </div>
          <p className="mt-1 text-sm text-muted">
            Enter it once for bonus credits when you join through a referral.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              type="text"
              value={inviteInput}
              onChange={(event) =>
                setInviteInput(event.target.value.toUpperCase())
              }
              placeholder="INVITE CODE"
              className="min-w-[10rem] flex-1 border border-border bg-white px-3 py-2 font-mono text-sm uppercase tracking-wider text-foreground"
            />
            <button
              type="button"
              disabled={!inviteInput.trim() || busy !== null}
              onClick={() => void applyInviteCode()}
              className="bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy === "invite" ? "Applying…" : "Apply code"}
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className="mt-4 text-sm text-success">{message}</p>
      )}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function RewardTile({
  title,
  value,
  hint,
  done,
}: {
  title: string;
  value: string;
  hint: string;
  done: boolean;
}) {
  return (
    <div className="border border-border bg-surface px-4 py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          {title}
        </div>
        {done ? (
          <span className="text-[10px] font-semibold uppercase text-success">
            Active
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted">{hint}</div>
    </div>
  );
}
