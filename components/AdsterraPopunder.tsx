"use client";

import { useEffect } from "react";

import { loadAdsterraPopunder } from "@/lib/adsterraAds";

/** Loads the Adsterra popunder on every page (including client-side navigations). */
export default function AdsterraPopunder() {
  useEffect(() => {
    loadAdsterraPopunder();
  }, []);

  return null;
}
