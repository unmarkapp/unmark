"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { loadAdcashPop, pathAllowsAdcash } from "@/lib/adcashAds";

/** Loads AdCash pop after client-side navigations onto marketing routes. */
export default function AdcashPop() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathAllowsAdcash(pathname)) return;
    loadAdcashPop();
  }, [pathname]);

  return null;
}
