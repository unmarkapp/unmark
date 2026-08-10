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

  const refreshCredits = useCallback(async () => {
    if (!user) {
      setAccount(null);
      return;
    }

    setLoading(true);
    try {
      // Small delay so billing spend from the worker can commit first
      const balance = await getBalance();
      setAccount(balance);
    } catch {
      // Keep previous balance on transient errors
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setAccount(null);
      return;
    }
    void refreshCredits();
  }, [user, refreshCredits]);

  const value = useMemo(
    () => ({
      account,
      fastCredits: account ? account.fast_credits : null,
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
