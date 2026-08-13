export interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type JobStatusValue =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type Quality = "fast" | "high";

export interface JobResponse {
  job_id: string;
  status: JobStatusValue;
  quality: Quality;
  input_key: string;
  output_key: string;
  job_type?: string;
}

export type MediaType = "image" | "video";

export type StorageProvider = "unmark" | "google_drive";

export type StorageStatus =
  | "ready"
  | "pending"
  | "uploading"
  | "failed"
  | "provider_disconnected";

export interface JobStatus {
  job_id: string;
  status: JobStatusValue;
  media_type?: MediaType;
  job_type?: string;
  quality?: Quality;
  filename?: string;
  created_at?: string;
  completed_at?: string;
  result_url?: string;
  preview_url?: string;
  share_url?: string;
  poster_url?: string;
  external_web_url?: string;
  storage_provider?: StorageProvider;
  storage_status?: StorageStatus;
  storage_error?: string;
  s3_offloaded?: boolean;
  duration_sec?: number;
  credits_charged?: number;
  error?: string;
}

export interface LibraryJob extends JobStatus {
  filename?: string;
  created_at?: string;
  completed_at?: string;
}

export interface VideoJobResponse {
  job_id: string;
  status: JobStatusValue;
  media_type: "video";
  quality: Quality;
  duration_sec?: number;
  credits_charged?: number;
  filename?: string;
  input_key?: string;
  output_key?: string;
  notice?: string;
  notify_email?: string | null;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/backend";

export function isWatermarkRemovalJob(job: LibraryJob): boolean {
  return (
    job.status === "completed" &&
    job.media_type !== "video" &&
    job.job_type !== "bg_remove"
  );
}

export async function removeBackgroundFromJob(
  jobId: string,
): Promise<JobResponse> {
  const res = await fetch(
    `${API_BASE_URL}/v1/jobs/${encodeURIComponent(jobId)}/remove-background`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail =
      typeof body.detail === "string"
        ? body.detail
        : `Background removal failed (${res.status})`;
    throw new Error(detail);
  }

  return res.json();
}

export async function removeWatermark(
  file: File,
  selection: Selection | null,
  quality: Quality = "fast",
): Promise<JobResponse> {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("quality", quality);

  if (
    selection &&
    selection.width > 0 &&
    selection.height > 0
  ) {
    formData.append("x", String(selection.x));
    formData.append("y", String(selection.y));
    formData.append("width", String(selection.width));
    formData.append("height", String(selection.height));
  }

  const response = await fetch(`${API_BASE_URL}/v1/remove-watermark`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    let message = "Failed to create job.";

    try {
      const body = await response.json();
      if (body.detail) {
        message =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      // Ignore invalid JSON response.
    }

    throw new Error(message);
  }

  return response.json();
}

export interface BulkJobResponse {
  job_id: string;
  status: JobStatusValue;
  quality: Quality;
  input_key: string;
  output_key: string;
  filename?: string;
  batch_id?: string;
  credits_prepaid?: boolean;
}

export interface BulkRemoveResponse {
  batch_id: string;
  credits_charged: number;
  quality: Quality;
  jobs: BulkJobResponse[];
  errors?: { filename: string; error: string }[];
}

export async function removeWatermarkVideo(
  file: File,
): Promise<VideoJobResponse> {
  const formData = new FormData();
  formData.append("video", file);

  const response = await fetch(
    `${API_BASE_URL}/v1/remove-watermark/video`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    let message = "Failed to create video job.";
    try {
      const body = await response.json();
      if (body.detail) {
        message =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      // Ignore invalid JSON response.
    }
    throw new Error(message);
  }

  return response.json();
}

export async function removeWatermarkBulk(
  files: File[],
  quality: Quality = "fast",
): Promise<BulkRemoveResponse> {
  const formData = new FormData();
  formData.append("quality", quality);

  for (const file of files) {
    formData.append("images", file);
  }

  const response = await fetch(
    `${API_BASE_URL}/v1/remove-watermark/bulk`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
  );

  if (!response.ok) {
    let message = "Failed to create bulk jobs.";

    try {
      const body = await response.json();
      if (body.detail) {
        message =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      // Ignore invalid JSON response.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(
    `${API_BASE_URL}/v1/jobs/${encodeURIComponent(jobId)}`,
    {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    },
  );

  if (!response.ok) {
    let message = "Failed to get job status.";

    try {
      const body = await response.json();
      if (body.detail) {
        message = body.detail;
      }
    } catch {
      // Ignore invalid JSON response.
    }

    throw new Error(message);
  }

  return response.json();
}

export interface LibraryListResult {
  jobs: LibraryJob[];
  library_used: number;
  library_limit: number;
}

export async function listJobs(options?: {
  limit?: number;
  status?: JobStatusValue;
}): Promise<LibraryListResult> {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.status) params.set("status", options.status);

  const query = params.toString();
  const response = await fetch(
    `${API_BASE_URL}/v1/jobs${query ? `?${query}` : ""}`,
    {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    },
  );

  if (!response.ok) {
    let message = "Failed to load library.";
    try {
      const body = await response.json();
      if (body.detail) {
        message =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await response.json()) as {
    jobs?: LibraryJob[];
    library_used?: number;
    library_limit?: number;
  };
  return {
    jobs: data.jobs || [],
    library_used: data.library_used ?? 0,
    library_limit: data.library_limit ?? 50,
  };
}

export async function deleteJob(jobId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/v1/jobs/${encodeURIComponent(jobId)}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok && response.status !== 204) {
    let message = "Failed to delete item.";
    try {
      const body = await response.json();
      if (body.detail) {
        message =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export async function downloadProcessedImage(
  url: string,
  fileName: string,
): Promise<void> {
  const safeName = fileName.replace(/[^\w.\-]+/g, "_") || "cleaned.png";
  const fallbackExt = /\.mp4$/i.test(safeName) ? ".mp4" : ".png";
  const downloadName = safeName.includes(".")
    ? safeName
    : `${safeName}${fallbackExt}`;

  let objectUrl = url;
  let shouldRevoke = false;

  if (!url.startsWith("blob:")) {
    const proxy = `/api/download-result?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(downloadName)}`;
    const response = await fetch(proxy);
    if (!response.ok) {
      throw new Error("Failed to fetch image for download");
    }
    const blob = await response.blob();
    objectUrl = URL.createObjectURL(blob);
    shouldRevoke = true;
  }

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = downloadName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  if (shouldRevoke) {
    URL.revokeObjectURL(objectUrl);
  }
}
