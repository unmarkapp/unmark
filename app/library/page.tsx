import type { Metadata } from "next";

import LibraryView from "@/components/LibraryView";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse and download your cleaned Gemini images.",
  robots: { index: false, follow: false },
};

export default function LibraryPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <SiteHeader />
      </div>

      <main>
        <LibraryView />
      </main>

      <SiteFooter />
    </div>
  );
}
