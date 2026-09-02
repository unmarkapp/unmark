"use client";

import { useEffect, useRef, useState } from "react";

interface BrandVideoPlayerProps {
  src: string;
  poster: string;
  className?: string;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function BrandVideoPlayer({
  src,
  poster,
  className,
}: BrandVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekRef = useRef<HTMLDivElement>(null);
  const scrubbingRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const seekToClientX = (clientX: number) => {
    const track = seekRef.current;
    const video = videoRef.current;
    if (!track || !video || !duration) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const start = () => {
    setStarted(true);
    void videoRef.current?.play();
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.closest("[data-brand-player]") as HTMLElement | null;
    if (!container) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void container.requestFullscreen?.();
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      data-brand-player
      className={`group/player relative aspect-video w-full overflow-hidden bg-ink ${className ?? ""}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => {
          if (!scrubbingRef.current) setCurrentTime(e.currentTarget.currentTime);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onClick={togglePlay}
      />

      {!started ? (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/10 text-white transition hover:bg-black/20"
          aria-label="Play product demo"
        >
          <span className="flex h-16 w-16 items-center justify-center bg-brand shadow-[0_4px_16px_-2px_rgb(var(--shadow-color)/0.5)]">
            <PlayIcon size={22} />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
            Play demo
          </span>
        </button>
      ) : (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 border-t border-white/15 bg-black/85 px-3 pb-2.5 pt-2 text-white backdrop-blur-sm">
          <div
            ref={seekRef}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            className="relative h-1.5 w-full cursor-pointer bg-white/20"
            onPointerDown={(e) => {
              scrubbingRef.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              seekToClientX(e.clientX);
            }}
            onPointerMove={(e) => {
              if (scrubbingRef.current) seekToClientX(e.clientX);
            }}
            onPointerUp={() => {
              scrubbingRef.current = false;
            }}
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 bg-brand"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="flex h-6 w-6 items-center justify-center text-white transition hover:text-brand"
              >
                {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={14} />}
              </button>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-white/70">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
                className="flex h-6 w-6 items-center justify-center text-white transition hover:text-brand"
              >
                {muted ? <MutedIcon size={16} /> : <VolumeIcon size={16} />}
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                className="flex h-6 w-6 items-center justify-center text-white transition hover:text-brand"
              >
                {isFullscreen ? <FullscreenExitIcon size={15} /> : <FullscreenIcon size={15} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  );
}

function VolumeIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 010 7" />
      <path d="M19 6a8.5 8.5 0 010 12" />
    </svg>
  );
}

function MutedIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16 9l5 6M21 9l-5 6" />
    </svg>
  );
}

function FullscreenIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  );
}

function FullscreenExitIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 9h5V4M20 9h-5V4M4 15h5v5M20 15h-5v5" />
    </svg>
  );
}
