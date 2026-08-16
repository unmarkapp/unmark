"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

import { GA_MEASUREMENT_ID } from "@/lib/analytics";

/**
 * Extra page views for client-side navigations only.
 * The first hit is sent by the Google tag in <head>.
 */
function GaPageviews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: pagePath });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <Suspense fallback={null}>
      <GaPageviews />
    </Suspense>
  );
}
