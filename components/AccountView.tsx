"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/lib/credits";
import {
  formatCents,
  formatTransactionType,
  confirmCheckout,
  getBalance,
  grantSignupCredits,
  listPacks,
  listTransactions,
  startCheckout,
  type BillingAccount,
  type CreditPack,
  type CreditTransaction,
} from "@/lib/billing";
import NotificationPreferenceToggle from "@/components/NotificationPreferenceToggle";

type AccountTab = "profile" | "history" | "billing";

export default function AccountView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, updateEmailNotifications } = useAuth();
  const { refreshCredits } = useCredits();
  const [tab, setTab] = useState<AccountTab>("billing");
  const [account, setAccount] = useState<BillingAccount | null>(null);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [buyingCode, setBuyingCode] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [prefSaving, setPrefSaving] = useState(false);

  const refreshBilling = useCallback(async () => {
    setBillingLoading(true);
    setBillingError(null);
    try {
      await grantSignupCredits().catch(() => undefined);
      const [balance, packList, txList] = await Promise.all([
        getBalance(),
        listPacks(),
        listTransactions(),
      ]);
      setAccount(balance);
      setPacks(packList);
      setTransactions(txList);
      await refreshCredits();
    } catch (err) {
      setBillingError(
        err instanceof Error ? err.message : "Could not load credits",
      );
    } finally {
      setBillingLoading(false);
    }
  }, [refreshCredits]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      void refreshBilling();
    }
  }, [user, refreshBilling]);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const sessionId =
      searchParams.get("session_id") ||
      searchParams.get("razorpay_payment_link_id");
    if (!checkout || !user) return;

    if (checkout === "success") {
      setTab("billing");
      setPurchaseMessage(
        "Payment received. Adding credits to your balance…",
      );
      void (async () => {
        let granted = false;
        for (const delay of [300, 1000, 2500]) {
          await new Promise((r) => setTimeout(r, delay));
          if (sessionId && !granted) {
            try {
              const result = await confirmCheckout(sessionId);
              if (result.account) {
                setAccount(result.account);
              }
              granted = true;
            } catch {
              // Webhook may still be processing — keep polling balance
            }
          }
          await refreshBilling();
          if (granted) break;
        }
        setPurchaseMessage(
          granted
            ? "Payment successful. Credits were added to your balance."
            : "Payment received. If credits don’t appear, refresh in a moment.",
        );
        router.replace("/account");
      })();
    } else if (checkout === "cancel") {
      setTab("billing");
      setBillingError("Checkout cancelled. No charge was made.");
      router.replace("/account");
    }
  }, [searchParams, user, refreshBilling, router]);

  const handleBuy = async (code: string) => {
    setBuyingCode(code);
    setPurchaseMessage(null);
    setBillingError(null);
    try {
      const result = await startCheckout(code);
      if (!result.checkout_url) {
        throw new Error("No checkout URL returned");
      }
      window.location.href = result.checkout_url;
    } catch (err) {
      setBillingError(
        err instanceof Error ? err.message : "Could not start checkout",
      );
      setBuyingCode(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="mx-auto flex w-full max-w-5xl px-4 py-20 sm:px-6">
        <div className="text-sm text-muted">
          {loading ? "Loading account…" : "Signed out. Redirecting…"}
        </div>
      </div>
    );
  }

  const displayName = user.name || "Unmark user";
  const email = user.email;
  const initials = (displayName[0] || email[0] || "U").toUpperCase();
  const fastCredits = account?.fast_credits ?? 0;
  const totalCredits = fastCredits;
  const libraryLimit = account?.library_limit ?? 50;
  const extraLibrarySlots = account?.extra_library_slots ?? 0;
  const creditPacks = packs.filter((pack) => (pack.library_slots || 0) === 0);
  const libraryPacks = packs.filter((pack) => (pack.library_slots || 0) > 0);
  const emailNotifications = user.email_notifications !== false;

  const handleNotificationPreference = async (enabled: boolean) => {
    setPrefSaving(true);
    setBillingError(null);
    try {
      await updateEmailNotifications(enabled);
    } catch (err) {
      setBillingError(
        err instanceof Error
          ? err.message
          : "Could not update notification preference",
      );
    } finally {
      setPrefSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:gap-12">
      <aside className="w-full shrink-0 lg:w-52">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          My Account
        </div>

        <nav className="mt-4 space-y-1">
          <SidebarButton
            active={tab === "profile"}
            onClick={() => setTab("profile")}
            icon={
              <path
                d="M9 9a3 3 0 100-6 3 3 0 000 6zM3 15.5c0-2.5 2.7-4 6-4s6 1.5 6 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            }
            label="Profile"
          />
          <SidebarButton
            active={false}
            onClick={() => router.push("/library")}
            icon={
              <>
                <rect
                  x="2.5"
                  y="3.5"
                  width="13"
                  height="11"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M5 11.5l2.2-2.4 1.6 1.5 2.4-2.8L13 11.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            }
            label="Library"
          />
          <SidebarButton
            active={tab === "history"}
            onClick={() => setTab("history")}
            icon={
              <path
                d="M3.5 4.5h11M3.5 9h11M3.5 13.5h7"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            }
            label="Credit History"
          />
          <SidebarButton
            active={tab === "billing"}
            onClick={() => setTab("billing")}
            icon={
              <>
                <rect
                  x="2.5"
                  y="4.5"
                  width="13"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M2.5 7.5h13"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </>
            }
            label="Credits & Billing"
          />
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-4">
          {user.picture ? (
            <img
              src={user.picture}
              alt={displayName}
              className="h-16 w-16 rounded-full object-cover "
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#fcd34d] to-brand text-lg font-bold text-white ">
              {initials}
            </div>
          )}
          <div>
            <div className="text-xl font-bold text-foreground">
              {displayName}
            </div>
            <div className="mt-0.5 text-sm text-muted">{email}</div>
            {!billingLoading && account && (
              <div className="mt-1 text-sm font-medium text-brand">
                {totalCredits} credit{totalCredits === 1 ? "" : "s"} available
              </div>
            )}
          </div>
        </div>

        {billingError && (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {billingError}
            <button
              type="button"
              onClick={() => void refreshBilling()}
              className="ml-2 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {purchaseMessage && (
          <div className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {purchaseMessage}
          </div>
        )}

        {tab === "profile" && (
          <div className="mt-8 border border-border bg-white p-6 ">
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Name</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {displayName}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 font-medium text-foreground">{email}</dd>
              </div>
              <div>
                <dt className="text-muted">Credits</dt>
                <dd className="mt-1 font-medium text-foreground">
                  {billingLoading ? "Loading…" : `${fastCredits} fast credits`}
                </dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="text-muted">Notifications</dt>
                <dd className="mt-3">
                  <NotificationPreferenceToggle
                    enabled={emailNotifications}
                    onChange={(enabled) =>
                      void handleNotificationPreference(enabled)
                    }
                    disabled={prefSaving}
                  />
                  <p className="mt-2 text-xs text-muted">
                    When enabled, we email you when long video jobs finish.
                    Background removal and image jobs always update here
                    automatically.
                  </p>
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 text-sm font-medium text-brand hover:underline"
            >
              ← Back to Unmark
            </button>
          </div>
        )}

        {tab === "history" && (
          <div className="mt-8 overflow-hidden border border-border bg-white ">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-foreground">
                Credit History
              </h2>
              <p className="mt-1 text-sm text-muted">
                Signup bonus, purchases, usage, and refunds.
              </p>
            </div>

            {billingLoading ? (
              <p className="px-5 py-8 text-sm text-muted sm:px-6">
                Loading history…
              </p>
            ) : transactions.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted sm:px-6">
                No credit activity yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-surface text-[11px] font-semibold uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-5 py-3 sm:px-6">Date</th>
                      <th className="px-3 py-3">Type</th>
                      <th className="px-3 py-3">Credit</th>
                      <th className="px-3 py-3">Amount</th>
                      <th className="px-3 py-3">Balance after</th>
                      <th className="px-5 py-3 sm:px-6">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f0e8]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="text-foreground">
                        <td className="whitespace-nowrap px-5 py-3.5 text-muted sm:px-6">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="px-3 py-3.5">
                          <TypeBadge type={tx.type} />
                        </td>
                        <td className="px-3 py-3.5 capitalize text-muted">
                          {tx.credit_type === "high" ? "High quality" : "Fast"}
                        </td>
                        <td
                          className={`px-3 py-3.5 font-semibold tabular-nums ${
                            tx.amount > 0
                              ? "text-success"
                              : tx.amount < 0
                                ? "text-danger"
                                : "text-muted"
                          }`}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </td>
                        <td className="px-3 py-3.5 tabular-nums text-muted">
                          {tx.balance_after}
                        </td>
                        <td className="max-w-[220px] truncate px-5 py-3.5 text-muted sm:px-6">
                          {tx.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "billing" && (
          <>
            <div className="mt-8 border border-border bg-white p-5  sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Your credits
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Credits are used each time you remove a Gemini watermark.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("history")}
                  className="text-sm font-medium text-brand hover:underline"
                >
                  View history →
                </button>
              </div>

              {billingLoading ? (
                <p className="mt-6 text-sm text-muted">Loading balance…</p>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <CreditStat
                    label="Fast credits"
                    value={fastCredits}
                    hint="Used for each Gemini watermark removal"
                  />
                  <CreditStat
                    label="Library slots"
                    value={libraryLimit}
                    hint={
                      extraLibrarySlots > 0
                        ? `50 free + ${extraLibrarySlots} purchased`
                        : "50 free slots included"
                    }
                  />
                </div>
              )}
            </div>

            <div className="mt-6 border border-border bg-white p-5  sm:p-6">
              <h2 className="text-base font-semibold text-foreground">
                Buy more credits
              </h2>
              <p className="mt-2 text-sm text-muted">
                Secure checkout powered by Razorpay. Credits are added after
                payment succeeds.
              </p>

              <div className="mt-5 space-y-3">
                {billingLoading && creditPacks.length === 0 ? (
                  <p className="text-sm text-muted">Loading packs…</p>
                ) : (
                  creditPacks.map((pack) => (
                    <PackOption
                      key={pack.code}
                      pack={pack}
                      busy={buyingCode === pack.code}
                      disabled={buyingCode !== null}
                      onBuy={() => void handleBuy(pack.code)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 border border-border bg-white p-5  sm:p-6">
              <h2 className="text-base font-semibold text-foreground">
                Library storage
              </h2>
              <p className="mt-2 text-sm text-muted">
                Permanent slots for Cloud saves. Separate from compute credits.
              </p>

              <div className="mt-5 space-y-3">
                {billingLoading && libraryPacks.length === 0 ? (
                  <p className="text-sm text-muted">Loading packs…</p>
                ) : libraryPacks.length === 0 ? (
                  <p className="text-sm text-muted">
                    No storage packs available yet.
                  </p>
                ) : (
                  libraryPacks.map((pack) => (
                    <PackOption
                      key={pack.code}
                      pack={pack}
                      busy={buyingCode === pack.code}
                      disabled={buyingCode !== null}
                      onBuy={() => void handleBuy(pack.code)}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function TypeBadge({ type }: { type: CreditTransaction["type"] }) {
  const label = formatTransactionType(type);
  const styles =
    type === "signup_bonus"
      ? "bg-cream text-brand"
      : type === "purchase"
        ? "bg-cream text-success"
        : type === "spend"
          ? "bg-cream text-brand-hover"
          : type === "refund"
            ? "bg-cream text-muted-strong"
            : "bg-cream text-muted";

  return (
    <span
      className={`inline-flex px-2 py-0.5 text-[11px] font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

function CreditStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="border border-border bg-surface px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </div>
      <div className="mt-1 text-3xl font-bold tabular-nums text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted">{hint}</div>
    </div>
  );
}

function PackOption({
  pack,
  onBuy,
  busy,
  disabled,
}: {
  pack: CreditPack;
  onBuy: () => void;
  busy: boolean;
  disabled: boolean;
}) {
  const parts: string[] = [];
  if ((pack.library_slots || 0) > 0) {
    parts.push(`+${pack.library_slots} Library slots`);
  }
  if (pack.fast_credits > 0) parts.push(`${pack.fast_credits} fast`);
  if (pack.high_credits > 0) parts.push(`${pack.high_credits} HQ`);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-white p-4">
      <div>
        <div className="font-semibold text-foreground">{pack.name}</div>
        <div className="mt-0.5 text-sm text-muted">
          {parts.join(" · ") || "Pack"}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-foreground">
          {formatCents(pack.amount_cents, pack.currency)}
        </span>
        <button
          type="button"
          onClick={onBuy}
          disabled={disabled}
          className="bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Redirecting…" : "Buy"}
        </button>
      </div>
    </div>
  );
}

function SidebarButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-cream text-brand"
          : "text-muted hover:bg-cream hover:text-foreground"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        {icon}
      </svg>
      {label}
    </button>
  );
}
