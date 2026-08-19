import type { Metadata } from "next";

import LibraryView from "@/components/LibraryView";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Library",
  description: "Browse and download your cleaned Gemini images.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />

      <main>
        <LibraryView />
      </main>

      <SiteFooter />
    </div>
  );
}
