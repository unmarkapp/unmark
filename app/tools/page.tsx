import type { Metadata } from "next";

import ToolsLanding from "@/components/ToolsLanding";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Unmark tools — Gemini image watermark removal, video cleanup, background cutouts, and the Chrome extension.",
  alternates: { canonical: "/tools" },
};

export default function ToolsPage() {
  return <ToolsLanding />;
}
