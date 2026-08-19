import type { Metadata } from "next";
import { Suspense } from "react";

import AccountView from "@/components/AccountView";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Unmark credits for Gemini watermark removal.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/account" },
};

export default function AccountPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />

      <main className="relative">
        <Suspense
          fallback={
            <div className="mx-auto max-w-5xl px-4 py-20 text-sm text-muted">
              Loading account…
            </div>
          }
        >
          <AccountView />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
