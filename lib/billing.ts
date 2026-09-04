const BILLING_BASE =
  process.env.NEXT_PUBLIC_BILLING_URL || "/billing-api";

export type PlanId = "free" | "premium";

export interface BillingAccount {
  user_id: string;
  plan_id: PlanId;
  fast_credits: number;
  high_credits: number;
  subscription_status: string;
  signup_bonus_at?: string;
  last_daily_grant_date?: string;
  last_share_bonus_date?: string;
  referrals_count?: number;
  daily_free_credits?: number;
  share_bonus_credits?: number;
  referral_referrer_credits?: number;
  share_bonus_claimed_today?: boolean;
  payments_enabled?: boolean;
  library_limit?: number;
  extra_library_slots?: number;
  paid_fast_credits?: number;
  create_credits?: number;
  cloud_storage_unlocked?: boolean;
}

export interface CreditPack {
  code: string;
  name: string;
  fast_credits: number;
  high_credits: number;
  library_slots?: number;
  unlock_cloud_storage?: boolean;
  amount_cents: number;
  currency: string;
}

export type CreditTransactionType =
  | "signup_bonus"
  | "daily_grant"
  | "referral_reward"
  | "share_reward"
  | "purchase"
  | "spend"
  | "refund"
  | "adjustment";

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: CreditTransactionType;
  credit_type: "fast" | "high";
  amount: number;
  balance_after: number;
  reference_id?: string;
  description: string;
  created_at: string;
}

async function billingFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BILLING_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Billing request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getBalance(): Promise<BillingAccount> {
  return billingFetch<BillingAccount>("/v1/balance");
}

export async function listPacks(): Promise<{
  packs: CreditPack[];
  paymentsEnabled: boolean;
}> {
  const data = await billingFetch<{
    packs: CreditPack[];
    payments_enabled?: boolean;
  }>("/v1/packs");
  return {
    packs: data.packs || [],
    paymentsEnabled: data.payments_enabled === true,
  };
}

export async function listTransactions(): Promise<CreditTransaction[]> {
  const data = await billingFetch<{ transactions: CreditTransaction[] }>(
    "/v1/transactions",
  );
  return data.transactions || [];
}

export async function grantSignupCredits(): Promise<void> {
  const response = await fetch(`${BILLING_BASE}/v1/credits/signup`, {
    method: "POST",
    credentials: "include",
  });
  if (response.ok) return;
  throw new Error("Failed to grant signup credits");
}

export async function claimShareBonus(): Promise<BillingAccount> {
  const data = await billingFetch<{ account: BillingAccount }>(
    "/v1/rewards/share",
    { method: "POST" },
  );
  return data.account;
}

const AUTH_BASE =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8080";

export async function applyReferralCode(code: string): Promise<void> {
  const response = await fetch(`${AUTH_BASE}/auth/me/referral`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code.trim().toUpperCase() }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      typeof body.error === "string"
        ? body.error
        : "Could not apply invite code";
    throw new Error(message);
  }
}

export async function startCheckout(productCode: string): Promise<{
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  purchase: { id: string; status: string };
}> {
  return billingFetch("/v1/checkout", {
    method: "POST",
    body: JSON.stringify({
      product_code: productCode,
      idempotency_key: `web:${productCode}:${Date.now()}`,
    }),
  });
}

export async function verifyPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{
  purchase: { id: string; status: string; fast_credits: number };
  account: BillingAccount;
}> {
  return billingFetch("/v1/verify-payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** @deprecated Prefer verifyPayment for Standard Checkout. */
export async function confirmCheckout(sessionId: string): Promise<{
  purchase: { id: string; status: string; fast_credits: number };
  account: BillingAccount;
}> {
  return billingFetch("/v1/checkout/confirm", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId }),
  });
}

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayInstance;
  }
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay requires a browser"));
  }
  if (window.Razorpay) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Razorpay checkout")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(opts: {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  description?: string;
  onSuccess: (response: RazorpaySuccessResponse) => void | Promise<void>;
  onDismiss?: () => void;
  onFailure?: (message: string) => void;
}): Promise<void> {
  await loadRazorpayScript();
  if (!window.Razorpay) {
    throw new Error("Razorpay checkout is unavailable");
  }

  const key =
    opts.keyId ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "";
  if (!key) {
    throw new Error("Razorpay key is missing");
  }

  const rzp = new window.Razorpay({
    key,
    amount: opts.amount,
    currency: (opts.currency || "INR").toUpperCase(),
    name: "Unmark",
    description: opts.description || "Unmark credits",
    order_id: opts.orderId,
    handler: (response) => {
      void opts.onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        opts.onDismiss?.();
      },
    },
    theme: { color: "#0f766e" },
  });

  rzp.on("payment.failed", (response) => {
    const message =
      response?.error?.description || "Payment failed. Please try again.";
    opts.onFailure?.(message);
  });

  rzp.open();
}

export function formatCents(cents: number, currency = "inr"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatTransactionType(type: CreditTransactionType): string {
  switch (type) {
    case "signup_bonus":
      return "Signup bonus";
    case "daily_grant":
      return "Daily credits";
    case "referral_reward":
      return "Invite bonus";
    case "share_reward":
      return "Share bonus";
    case "purchase":
      return "Purchase";
    case "spend":
      return "Used";
    case "refund":
      return "Refund";
    case "adjustment":
      return "Adjustment";
    default:
      return type;
  }
}
