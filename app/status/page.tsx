import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { breadcrumbJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "System status",
  description: "Live status for Unmark's Cloud cleanup, background removal, purchases, and sign-in.",
  alternates: { canonical: "/status" },
  openGraph: {
    title: "System status · Unmark",
    description: "Live status for Unmark's Cloud cleanup, background removal, purchases, and sign-in.",
    url: "/status",
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

type ServiceStatus = {
  id: string;
  label: string;
  status: "operational" | "unhealthy";
};

type StatusResponse = {
  checked_at: string;
  overall: "operational" | "degraded";
  services: ServiceStatus[];
};

async function getStatus(): Promise<StatusResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/status`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return (await res.json()) as StatusResponse;
  } catch {
    return null;
  }
}

export default async function StatusPage() {
  const data = await getStatus();

  const allOperational = data?.overall === "operational";
  const bannerText = !data
    ? "Status is temporarily unavailable"
    : allOperational
      ? "All systems operational"
      : "Some systems are experiencing issues";

  return (
    <div className="surface-grain min-h-screen text-foreground">
      <JsonLd data={breadcrumbJsonLd([{ name: "Status", path: "/status" }])} />
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-muted">Live status</p>
        <h1 className="mt-2 font-display font-medium text-foreground text-4xl sm:text-5xl">
          System status
        </h1>

        <div
          className={`mt-8 flex items-center gap-3 rounded-[var(--radius-lg)] border px-5 py-4 ${
            !data || !allOperational
              ? "border-danger-border bg-danger-bg"
              : "border-border bg-success-bg"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              !data || !allOperational ? "bg-danger" : "bg-success"
            }`}
          />
          <p
            className={`text-sm font-medium ${
              !data || !allOperational ? "text-danger" : "text-success"
            }`}
          >
            {bannerText}
          </p>
        </div>

        <div className="mt-6 divide-y divide-border rounded-[var(--radius-lg)] border border-border">
          {(data?.services ?? []).map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <span className="text-sm font-medium text-foreground">
                {service.label}
              </span>
              <span
                className={`inline-flex items-center gap-2 text-sm ${
                  service.status === "operational" ? "text-success" : "text-danger"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    service.status === "operational" ? "bg-success" : "bg-danger"
                  }`}
                />
                {service.status === "operational" ? "Operational" : "Unhealthy"}
              </span>
            </div>
          ))}
          {!data ? (
            <div className="px-5 py-6 text-sm text-muted">
              Could not reach the status service. Try again shortly.
            </div>
          ) : null}
        </div>

        <p className="mt-6 text-xs text-muted">
          {data
            ? `Last checked ${new Date(data.checked_at).toLocaleString()}`
            : null}
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
