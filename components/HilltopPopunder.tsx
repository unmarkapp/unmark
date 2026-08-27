"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { loadHilltopPopunder, pathAllowsHilltopPopunder } from "@/lib/hilltopAds";

/** Loads the Hilltop popunder after client-side navigations onto marketing routes. */
export default function HilltopPopunder() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathAllowsHilltopPopunder(pathname)) return;
    loadHilltopPopunder();
  }, [pathname]);

  return null;
}
