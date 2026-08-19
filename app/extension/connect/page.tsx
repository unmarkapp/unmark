import type { Metadata } from "next";

import ExtensionConnect from "@/components/ExtensionConnect";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Connect Safari extension",
  description: "Hand your Unmark session to the Safari extension.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/extension/connect" },
};

export default function ExtensionConnectPage() {
  return (
    <div className="surface-grain min-h-screen text-foreground">
      <SiteHeader />
      <ExtensionConnect />
      <SiteFooter />
    </div>
  );
}
