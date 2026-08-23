"use client";

import {
  PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { BRAND, SPARKLE_PATH } from "@/components/brand/logos";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  /** Fixed box (e.g. "9 / 16") so side-by-side demos share height. */
  aspectRatio?: string;
  /** object-fit when aspectRatio is set. Prefer "contain" for demos so watermarks aren't cropped. */
  objectFit?: "cover" | "contain";
  /** object-position when the image is cropped or letterboxed. */
  objectPosition?: string;
}

function SparkleMark({
  className = "",
  fill = BRAND.cream,
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="-12 -12 24 24"
      className={className}
      aria-hidden
    >
      <path d={SPARKLE_PATH} fill={fill} />
    </svg>
  );
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  aspectRatio,
  objectFit = "cover",
  objectPosition = "center",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const afterImgRef = useRef<HTMLImageElement | null>(null);

  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [afterReady, setAfterReady] = useState(false);
  const [afterError, setAfterError] = useState(false);

  useEffect(() => {
    setAfterReady(false);
    setAfterError(false);
    setPosition(50);
    // If the browser already has this image cached, onLoad won't fire.
    // Check .complete after a tick to catch that case.
    const img = afterImgRef.current;
    if (!img) return;
    const tick = requestAnimationFrame(() => {
      if (img.complete && img.naturalWidth > 0) setAfterReady(true);
      else if (img.complete && img.naturalWidth === 0) setAfterError(true);
    });
    return () => cancelAnimationFrame(tick);
  }, [afterUrl]);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;

    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();

    if (rect.width <= 0) {
      return;
    }

    const next = ((clientX - rect.left) / rect.width) * 100;

    setPosition(Math.max(0, Math.min(100, next)));
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) {
      return;
    }

    updatePosition(event.clientX);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDragging(false);
  };

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-[var(--radius-lg)] bg-ink select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          cursor: dragging ? "grabbing" : "ew-resize",
          ...(aspectRatio ? { aspectRatio } : null),
        }}
      >
        {/* Soft brand wash behind images */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(197,64,31,0.28), transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(79,91,102,0.18), transparent 50%)",
          }}
        />

        {/* BEFORE drives height unless aspectRatio locks the box */}
        <img
          src={beforeUrl}
          alt="Before Gemini watermark removal"
          width={768}
          height={1376}
          sizes="(min-width: 640px) 360px, calc(100vw - 2rem)"
          className={
            aspectRatio
              ? `relative z-[1] block h-full w-full ${objectFit === "contain" ? "object-contain" : "object-cover"}`
              : "relative z-[1] block h-auto w-full"
          }
          style={aspectRatio ? { objectPosition } : undefined}
          draggable={false}
        />

        {/* AFTER on the right side */}
        {!afterError && (
          <img
            ref={afterImgRef}
            src={afterUrl}
            alt="After Gemini watermark removal"
            width={768}
            height={1376}
            sizes="(min-width: 640px) 360px, calc(100vw - 2rem)"
            className={`absolute inset-0 z-[2] h-full w-full ${
              objectFit === "contain" ? "object-contain" : "object-cover"
            }`}
            style={{
              clipPath: `inset(0 0 0 ${position}%)`,
              opacity: afterReady ? 1 : 0,
              objectPosition,
            }}
            onLoad={() => setAfterReady(true)}
            onError={() => setAfterError(true)}
            draggable={false}
          />
        )}

        {!afterReady && !afterError && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ink/55 text-sm text-white">
            <span className="inline-flex items-center gap-2">
              <SparkleMark fill={BRAND.yellow} />
              Loading cleaned image…
            </span>
          </div>
        )}

        {afterError && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ink/70 px-4 text-center text-sm text-peach">
            Could not load the result image.
          </div>
        )}

        {/* Copper divider + knockout sparkle handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20"
          style={{ left: `${position}%` }}
        >
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-white" />

          <div
            className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_4px_14px_-2px_rgb(var(--shadow-color)/0.5)] transition ${
              aspectRatio ? "h-9 w-9" : "h-12 w-12"
            } ${dragging ? "scale-105" : ""}`}
            style={{
              background: BRAND.red,
            }}
          >
            <svg
              width={aspectRatio ? 20 : 28}
              height={aspectRatio ? 20 : 28}
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden
            >
              <path
                d="M10 8L6 14l4 6M18 8l4 6-4 6"
                stroke={BRAND.cream}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g transform="translate(14 14) scale(0.55)">
                <path d={SPARKLE_PATH} fill={BRAND.cream} />
              </g>
            </svg>
          </div>
        </div>

        {/* Brand labels */}
        <div className="pointer-events-none absolute left-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 shadow-[0_1px_2px_rgb(var(--shadow-color)/0.1)]">
          <SparkleMark fill={BRAND.red} />
          <span className="text-[11px] font-semibold text-foreground">
            Before
          </span>
        </div>

        <div className="pointer-events-none absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-cobalt px-2.5 py-1 shadow-[0_1px_2px_rgb(var(--shadow-color)/0.1)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2.5 6.2l2.2 2.2 4.8-4.8"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[11px] font-semibold text-white">
            After
          </span>
        </div>

        {/* Corner frame accents */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-30 h-5 w-5 border-b border-l border-brand/45" />
        <div className="pointer-events-none absolute bottom-3 right-3 z-30 h-5 w-5 border-b border-r border-brand/45" />
      </div>
    </div>
  );
}
