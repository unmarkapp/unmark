"use client";

import { useEffect } from "react";

import { loadHilltopPopunder } from "@/lib/hilltopAds";

/** Loads the Hilltop popunder on every page (including client-side navigations). */
export default function HilltopPopunder() {
  useEffect(() => {
    loadHilltopPopunder();
  }, []);

  return null;
}
