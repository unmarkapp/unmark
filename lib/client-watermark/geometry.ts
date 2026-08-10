/**
 * Gemini visible-watermark geometry (classic bottom-right sparkle).
 *
 * Exact export sizes match Cloud RAB. Near-miss sizes (re-encode / crop)
 * snap to the closest known Gemini size within a small tolerance.
 */

export type WatermarkRect = {
  size: 48 | 96;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Tier = "0.5k" | "1k" | "2k";

const TIER_CONFIG: Record<
  Tier,
  { logo_size: 48 | 96; margin_right: number; margin_bottom: number }
> = {
  "0.5k": { logo_size: 48, margin_right: 32, margin_bottom: 32 },
  "1k": { logo_size: 96, margin_right: 64, margin_bottom: 64 },
  "2k": { logo_size: 96, margin_right: 64, margin_bottom: 64 },
};

/** Exact Gemini export sizes → watermark tier. */
const GEMINI_SIZES: Array<[number, number, Tier]> = [
  // 1k
  [1024, 1024, "1k"],
  [512, 2064, "1k"],
  [352, 2928, "1k"],
  [848, 1264, "1k"],
  [1264, 848, "1k"],
  [896, 1200, "1k"],
  [2064, 512, "1k"],
  [1200, 896, "1k"],
  [928, 1152, "1k"],
  [1152, 928, "1k"],
  [2928, 352, "1k"],
  [768, 1376, "1k"],
  [1376, 768, "1k"],
  [1408, 768, "1k"],
  [1584, 672, "1k"],
  // 2k
  [2048, 2048, "2k"],
  [512, 2048, "2k"],
  [384, 3072, "2k"],
  [1696, 2528, "2k"],
  [2528, 1696, "2k"],
  [1792, 2400, "2k"],
  [2048, 512, "2k"],
  [2400, 1792, "2k"],
  [1856, 2304, "2k"],
  [2304, 1856, "2k"],
  [3072, 384, "2k"],
  [1536, 2752, "2k"],
  [2752, 1536, "2k"],
  [3168, 1344, "2k"],
  // 0.5k
  [512, 512, "0.5k"],
  [256, 1024, "0.5k"],
  [192, 1536, "0.5k"],
  [424, 632, "0.5k"],
  [632, 424, "0.5k"],
  [448, 600, "0.5k"],
  [1024, 256, "0.5k"],
  [600, 448, "0.5k"],
  [464, 576, "0.5k"],
  [576, 464, "0.5k"],
  [1536, 192, "0.5k"],
  [384, 688, "0.5k"],
  [688, 384, "0.5k"],
  [792, 168, "0.5k"],
];

const SIZE_TOLERANCE_PX = 16;

function configForSize(width: number, height: number) {
  let best: { tier: Tier; dist: number } | null = null;
  for (const [w, h, tier] of GEMINI_SIZES) {
    const dist = Math.abs(width - w) + Math.abs(height - h);
    if (dist === 0) {
      return TIER_CONFIG[tier];
    }
    if (dist <= SIZE_TOLERANCE_PX && (!best || dist < best.dist)) {
      best = { tier, dist };
    }
  }
  if (best) {
    return TIER_CONFIG[best.tier];
  }
  if (width > 1024 && height > 1024) {
    return TIER_CONFIG["2k"];
  }
  // Landscape / portrait Gemini-like canvases default to 96px mark.
  if (Math.max(width, height) >= 1024 && Math.min(width, height) >= 512) {
    return TIER_CONFIG["1k"];
  }
  return TIER_CONFIG["0.5k"];
}

export function getWatermarkInfo(
  width: number,
  height: number,
): WatermarkRect {
  const config = configForSize(width, height);
  const size = config.logo_size;
  return {
    size,
    x: width - config.margin_right - size,
    y: height - config.margin_bottom - size,
    width: size,
    height: size,
  };
}

function pushUnique(out: WatermarkRect[], rect: WatermarkRect) {
  if (
    rect.x < 0 ||
    rect.y < 0 ||
    rect.width <= 0 ||
    rect.height <= 0
  ) {
    return;
  }
  if (
    out.some(
      (r) =>
        r.x === rect.x &&
        r.y === rect.y &&
        r.size === rect.size,
    )
  ) {
    return;
  }
  out.push(rect);
}

/** Candidate official placements for both 48 and 96 sparkle tiers. */
export function officialPlacements(
  width: number,
  height: number,
): WatermarkRect[] {
  const primary = getWatermarkInfo(width, height);
  const out: WatermarkRect[] = [];
  pushUnique(out, primary);

  for (const size of [96, 48] as const) {
    const margin = size === 96 ? 64 : 32;
    pushUnique(out, {
      size,
      x: width - margin - size,
      y: height - margin - size,
      width: size,
      height: size,
    });
    // Common near-miss margins when exports are slightly cropped.
    for (const m of [48, 56, 72, 80]) {
      pushUnique(out, {
        size,
        x: width - m - size,
        y: height - m - size,
        width: size,
        height: size,
      });
    }
  }

  return out.filter(
    (r) => r.x + r.width <= width && r.y + r.height <= height,
  );
}
