import {
  getJobStatus,
  type JobResponse,
  type JobStatus,
} from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/backend";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitBackgroundRemoval(
  file: File,
): Promise<JobResponse> {
  const form = new FormData();
  form.append("image", file, file.name);

  const res = await fetch(`${API_BASE}/v1/remove-background`, {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Submit failed (${res.status})`);
  }

  return res.json();
}

export async function pollBackgroundRemovalJob(
  jobId: string,
  onUpdate?: (status: JobStatus) => void,
): Promise<JobStatus> {
  for (let i = 0; i < 120; i++) {
    const status = await getJobStatus(jobId);
    onUpdate?.(status);
    if (status.status === "completed") return status;
    if (status.status === "failed") {
      throw new Error(status.error || "Background removal failed");
    }
    await sleep(1500);
  }
  throw new Error("Timed out waiting for background removal");
}

export async function fetchResultBlob(resultUrl: string): Promise<Blob> {
  // `resultUrl` is usually a cross-origin S3 URL; S3 CORS can break browser fetch.
  // Use our Next.js server proxy so the browser only talks to same-origin.
  const proxy = `/api/download-result?url=${encodeURIComponent(
    resultUrl,
  )}&filename=${encodeURIComponent("cleaned.png")}`;

  const res = await fetch(proxy, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch result");
  return res.blob();
}
