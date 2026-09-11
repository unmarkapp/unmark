export interface VideoFrameCapture {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Grabs a representative still frame from a video file for manual
 * watermark-region selection. Seeks partway into the clip (rather than
 * frame 0) to avoid a black or fade-in opening frame.
 */
export function captureVideoFrame(file: File): Promise<VideoFrameCapture> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    let settled = false;

    const cleanup = () => {
      video.onloadedmetadata = null;
      video.onseeked = null;
      video.onerror = null;
      URL.revokeObjectURL(url);
    };

    const finish = (result: VideoFrameCapture | Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    };

    const timeout = setTimeout(() => {
      finish(new Error("Timed out capturing video frame."));
    }, 5000);

    video.onloadedmetadata = () => {
      const seekTo = Math.min(0.5, (video.duration || 0) / 2);
      video.currentTime = Number.isFinite(seekTo) ? seekTo : 0;
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) {
        finish(new Error("Could not read video dimensions."));
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        finish(new Error("Canvas unavailable."));
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);
      finish({
        dataUrl: canvas.toDataURL("image/jpeg", 0.92),
        width,
        height,
      });
    };

    video.onerror = () => {
      clearTimeout(timeout);
      finish(new Error("Failed to load video for frame capture."));
    };

    video.src = url;
  });
}
