import type { Metadata } from "next";

import AndroidEarlyAccess from "@/components/AndroidEarlyAccess";

export const metadata: Metadata = {
  title: "Android Early Access — Join Closed Testing",
  description:
    "Join Unmark closed testing on Google Play. Opt in as a tester so we can ship the Android app to production.",
  alternates: { canonical: "/android" },
  openGraph: {
    title: "Unmark Android early access",
    description:
      "Become a Play tester for Unmark. Twelve opted-in testers for 14 days unlocks production.",
    url: "/android",
    type: "website",
  },
};

export default function AndroidPage() {
  return <AndroidEarlyAccess />;
}
