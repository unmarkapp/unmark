import type { Metadata } from "next";

import ToolsLanding from "@/components/ToolsLanding";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Unmark tools — background removal and more utilities for creators working with AI-generated images.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <ToolsLanding />;
}
