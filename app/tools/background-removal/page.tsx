import type { Metadata } from "next";

import BackgroundRemovalTool from "@/components/BackgroundRemovalTool";

export const metadata: Metadata = {
  title: "Background Removal",
  description:
    "Remove image backgrounds automatically. Upload a photo and download a transparent PNG cutout — free on Unmark.",
  alternates: { canonical: "/tools/background-removal" },
};

export default function BackgroundRemovalPage() {
  return <BackgroundRemovalTool />;
}
