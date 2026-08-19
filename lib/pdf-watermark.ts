import {
  getJobStatus,
  type JobResponse,
  type JobStatus,
} from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/backend";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function errorFromResponse(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const body = JSON.parse(text) as { detail?: unknown };
    if (typeof body.detail === "string" && body.detail.trim()) {
      return body.detail;
    }
  } catch {
    // ignore
  }
  return text || `Submit failed (${res.status})`;
}

export async function submitPdfWatermark(file: File): Promise<JobResponse> {
  const form = new FormData();
  form.append("pdf", file, file.name);

  const res = await fetch(`${API_BASE}/v1/remove-pdf-watermark`, {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await errorFromResponse(res));
  }

  return res.json();
}

export async function pollPdfWatermarkJob(
  jobId: string,
  onUpdate?: (status: JobStatus) => void,
): Promise<JobStatus> {
  for (let i = 0; i < 80; i++) {
    const status = await getJobStatus(jobId);
    onUpdate?.(status);
    if (status.status === "completed") return status;
    if (status.status === "failed") {
      throw new Error(status.error || "PDF watermark removal failed");
    }
    await sleep(1500);
  }
  throw new Error("Timed out waiting for the cleaned PDF");
}

export async function fetchPdfResultBlob(resultUrl: string): Promise<Blob> {
  const proxy = `/api/download-result?url=${encodeURIComponent(
    resultUrl,
  )}&filename=${encodeURIComponent("cleaned.pdf")}`;
  const res = await fetch(proxy, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch cleaned PDF");
  return res.blob();
}
