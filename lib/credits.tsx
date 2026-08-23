"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth";
import { getBalance, type BillingAccount } from "@/lib/billing";

interface CreditsContextValue {
  account: BillingAccount | null;
  fastCredits: number | null;
  /** Purchased-only credits for Create. Separate from daily free fastCredits. */
  createCredits: number | null;
  dailyFreeCredits: number | null;
  paymentsEnabled: boolean;
  libraryLimit: number | null;
  extraLibrarySlots: number | null;
  loading: boolean;
  refreshCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextValue | null>(null);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [account, setAccount] = useState<BillingAccount | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = user?.id;

  const refreshCredits = useCallback(async () => {
    if (!userId) {
      setAccount(null);
      return;
    }

    setLoading(true);
    try {
      const balance = await getBalance();
      setAccount(balance);
    } catch {
      // Keep previous balance on transient errors
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setAccount(null);
      return;
    }
    void refreshCredits();
  }, [userId, refreshCredits]);

  const value = useMemo(
    () => ({
      account,
      fastCredits: account ? account.fast_credits : null,
      createCredits: account
        ? (account.create_credits ?? account.paid_fast_credits ?? 0)
        : null,
      dailyFreeCredits: account?.daily_free_credits ?? null,
      paymentsEnabled: account?.payments_enabled === true,
      libraryLimit: account ? (account.library_limit ?? 50) : null,
      extraLibrarySlots: account
        ? (account.extra_library_slots ?? 0)
        : null,
      loading,
      refreshCredits,
    }),
    [account, loading, refreshCredits],
  );

  return (
    <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
  );
}

export function useCredits() {
  const ctx = useContext(CreditsContext);
  if (!ctx) {
    throw new Error("useCredits must be used within CreditsProvider");
  }
  return ctx;
}
