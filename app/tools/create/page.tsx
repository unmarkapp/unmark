import type { Metadata } from "next";

import CreateGenerateTool from "@/components/CreateGenerateTool";

export const metadata: Metadata = {
  title: "Create with Nano Banana",
  description:
    "Generate with Gemini Nano Banana in Unmark. API images have no Gemini-app sparkle. Coming soon on the web — already live in the iOS app.",
  alternates: { canonical: "/tools/create" },
};

export default function CreatePage() {
  return <CreateGenerateTool />;
}
