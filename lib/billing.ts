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
  library_limit?: number;
  extra_library_slots?: number;
}

export interface CreditPack {
  code: string;
  name: string;
  fast_credits: number;
  high_credits: number;
  library_slots?: number;
  amount_cents: number;
  currency: string;
}

export type CreditTransactionType =
  | "signup_bonus"
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

export async function listPacks(): Promise<CreditPack[]> {
  const data = await billingFetch<{ packs: CreditPack[] }>("/v1/packs");
  return data.packs || [];
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
  // 409 = already granted — treat as success
  if (response.ok || response.status === 409) return;
  throw new Error("Failed to grant signup credits");
}

export async function startCheckout(productCode: string): Promise<{
  checkout_url: string;
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

export async function confirmCheckout(sessionId: string): Promise<{
  purchase: { id: string; status: string; fast_credits: number };
  account: BillingAccount;
}> {
  return billingFetch("/v1/checkout/confirm", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId }),
  });
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
