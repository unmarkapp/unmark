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

type ToastTone = "default" | "error" | "success";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "default") => {
    const id = ++toastId;
    setItems((current) => [...current, { id, message, tone }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
        {items.map((item) => (
          <ToastBubble
            key={item.id}
            item={item}
            onDone={() => dismiss(item.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastBubble({
  item,
  onDone,
}: {
  item: ToastItem;
  onDone: () => void;
}) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 3200);
    return () => window.clearTimeout(id);
  }, [onDone]);

  const toneClass =
    item.tone === "error"
      ? "border-danger-border bg-danger-bg text-danger"
      : item.tone === "success"
        ? "border-border bg-surface-raised text-success"
        : "border-border bg-surface-raised text-foreground";

  return (
    <div
      role="status"
      className={`pointer-events-auto max-w-sm rounded-[var(--radius-md)] border px-4 py-3 text-sm font-medium shadow-[0_1px_2px_rgb(var(--shadow-color)/0.06),0_12px_28px_-10px_rgb(var(--shadow-color)/0.35)] ${toneClass}`}
    >
      {item.message}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
