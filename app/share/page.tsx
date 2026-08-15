import type { Metadata } from "next";
import { Suspense } from "react";

import ShareTargetView from "@/components/ShareTargetView";

export const metadata: Metadata = {
  title: "Open with Unmark",
  description:
    "Share a photo to Unmark, then clean the Gemini sparkle or remove the background.",
  robots: { index: false, follow: false },
};

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted">
          Opening shared image…
        </div>
      }
    >
      <ShareTargetView />
    </Suspense>
  );
}
