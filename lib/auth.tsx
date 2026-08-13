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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  email_notifications?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  updateEmailNotifications: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_BASE =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8080";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${AUTH_BASE}/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = (await response.json()) as AuthUser;
      setUser({
        ...data,
        email_notifications: data.email_notifications !== false,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const loginWithGoogle = useCallback(() => {
    window.location.href = `${AUTH_BASE}/auth/google/login`;
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${AUTH_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }, []);

  const updateEmailNotifications = useCallback(async (enabled: boolean) => {
    const response = await fetch(`${AUTH_BASE}/auth/me/preferences`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_notifications: enabled }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message =
        typeof body.error === "string"
          ? body.error
          : "Could not update notification preference";
      throw new Error(message);
    }

    const data = (await response.json()) as AuthUser;
    setUser({
      ...data,
      email_notifications: data.email_notifications !== false,
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refresh,
      loginWithGoogle,
      logout,
      updateEmailNotifications,
    }),
    [user, loading, refresh, loginWithGoogle, logout, updateEmailNotifications],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
