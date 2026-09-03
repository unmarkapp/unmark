/**
 * Gemini visible-watermark geometry.
 *
 * V1 (pre-Gemini 3.5): 48@32 / 96@64 — classic 1K sparkle at (864,864) on 1024².
 * V2 (Gemini 3.5+): 96@192 on large canvases; 1024-class uses a scaled ~36px
 * mark from the 192px canonical margin (Allen Kuo GeminiWatermarkTool, MIT).
 */

export type SparkleMapKey = "v1-48" | "v1-96" | "v2-36" | "v2-96";

export type WatermarkRect = {
  size: number;
  x: number;
  y: number;
  width: number;
  height: number;
  mapKey: SparkleMapKey;
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
  [1024, 576, "1k"],
  [576, 1024, "1k"],
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
  [2816, 1536, "2k"],
  [1536, 2816, "2k"],
  [2848, 1536, "2k"],
  [3168, 1344, "2k"],
  [2048, 1152, "2k"],
  [1152, 2048, "2k"],
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
  if (Math.max(width, height) >= 1024 && Math.min(width, height) >= 512) {
    return TIER_CONFIG["1k"];
  }
  return TIER_CONFIG["0.5k"];
}

function rectAt(
  width: number,
  height: number,
  size: number,
  margin: number,
  mapKey: SparkleMapKey,
): WatermarkRect {
  return {
    size,
    x: width - margin - size,
    y: height - margin - size,
    width: size,
    height: size,
    mapKey,
  };
}

/**
 * Gemini 3.5 1024-class: infer canonical 2K width, scale 192px margin + 96px logo.
 * From Allen Kuo GeminiWatermarkTool (MIT).
 */
export function v2SmallConfig(width: number, height: number): {
  logo_size: number;
  margin: number;
} {
  const longSide = Math.max(width, height);
  const shortSide = Math.min(width, height);

  let sourceLong = 2752;
  if (longSide > 1100) {
    const doubled = 2 * longSide;
    sourceLong = 2752;
    for (const cand of [2816, 2848]) {
      if (Math.abs(doubled - cand) < Math.abs(doubled - sourceLong)) {
        sourceLong = cand;
      }
    }
  } else if (shortSide >= 566) {
    sourceLong = 2752;
  } else if (shortSide >= 550) {
    sourceLong = 2816;
  } else {
    sourceLong = 2848;
  }

  const scale = longSide / sourceLong;
  const margin = Math.round(192 * scale);
  const ideal = Math.round(96 * scale);
  return {
    margin,
    logo_size: ideal <= 40 ? 36 : ideal,
  };
}

export function v2SmallRect(width: number, height: number): WatermarkRect {
  const v2s = v2SmallConfig(width, height);
  const mapKey: SparkleMapKey = v2s.logo_size <= 40 ? "v2-36" : "v2-96";
  return rectAt(width, height, v2s.logo_size, v2s.margin, mapKey);
}

export function getWatermarkInfo(
  width: number,
  height: number,
): WatermarkRect {
  const config = configForSize(width, height);
  const size = config.logo_size;
  return rectAt(
    width,
    height,
    size,
    config.margin_right,
    size === 48 ? "v1-48" : "v1-96",
  );
}

function pushUnique(out: WatermarkRect[], rect: WatermarkRect) {
  if (
    rect.x < 0 ||
    rect.y < 0 ||
    rect.width <= 0 ||
    rect.height <= 0 ||
    rect.x + rect.width > Number.MAX_SAFE_INTEGER
  ) {
    return;
  }
  if (
    out.some(
      (r) =>
        r.x === rect.x &&
        r.y === rect.y &&
        r.size === rect.size &&
        r.mapKey === rect.mapKey,
    )
  ) {
    return;
  }
  out.push(rect);
}

function pushIfFits(
  out: WatermarkRect[],
  width: number,
  height: number,
  rect: WatermarkRect,
) {
  if (rect.x + rect.width <= width && rect.y + rect.height <= height) {
    pushUnique(out, rect);
  }
}

/** Candidate official placements: V1 + V2 sparkle profiles. */
export function officialPlacements(
  width: number,
  height: number,
): WatermarkRect[] {
  const out: WatermarkRect[] = [];
  pushIfFits(out, width, height, getWatermarkInfo(width, height));

  // V1 classic.
  for (const [size, margin, mapKey] of [
    [96, 64, "v1-96"],
    [48, 32, "v1-48"],
  ] as const) {
    pushIfFits(out, width, height, rectAt(width, height, size, margin, mapKey));
    for (const m of [48, 56, 72, 80]) {
      pushIfFits(out, width, height, rectAt(width, height, size, m, mapKey));
    }
  }

  // V2 large: 96px logo, 192px margin (Gemini 3.5+ / 2K).
  pushIfFits(out, width, height, rectAt(width, height, 96, 192, "v2-96"));
  for (const m of [176, 184, 200, 208, 160, 224]) {
    pushIfFits(out, width, height, rectAt(width, height, 96, m, "v2-96"));
  }

  // V2 small: scaled 36–48px from canonical 192 margin.
  const v2s = v2SmallConfig(width, height);
  const smallKey: SparkleMapKey = v2s.logo_size <= 40 ? "v2-36" : "v2-96";
  pushIfFits(
    out,
    width,
    height,
    rectAt(width, height, v2s.logo_size, v2s.margin, smallKey),
  );
  for (const dm of [-8, -4, 4, 8]) {
    pushIfFits(
      out,
      width,
      height,
      rectAt(width, height, v2s.logo_size, v2s.margin + dm, smallKey),
    );
  }

  return out;
}

export function nccRadiusFor(rect: WatermarkRect): number {
  // Official V2-36 geometry is exact on square 1K; landscape 16:9 (1024x571)
  // is a few pixels off 576, so allow a short refine without a fabric hunt.
  if (rect.mapKey === "v2-36") return 4;
  if (rect.mapKey.startsWith("v2")) return 8;
  return 12;
}

function inBottomRight(
  rect: { x: number; y: number; width?: number; size: number },
  width: number,
  height: number,
): boolean {
  const rw = rect.width ?? rect.size;
  const rh = rect.size;
  return rect.x + rw > width * 0.6 && rect.y + rh > height * 0.52;
}

/**
 * One sparkle only. 1024-class Gemini 3.5 is a ~36px mark; applying the
 * classic 96px map beside it paints a second (wrong) ghost.
 */
export function pickSparkleWinner<T extends WatermarkRect & { score: number }>(
  ranked: T[],
  width: number,
  height: number,
  minScore: number,
): T | null {
  const ok = ranked.filter((c) => c.score >= minScore);
  const list = ok.length > 0 ? ok : ranked;
  if (list.length === 0) return null;

  const br = list.filter((c) => inBottomRight(c, width, height));
  const pool = br.length > 0 ? br : list;

  // Confident off-corner scan (Erasio 48px) — never a 96px fabric hit.
  // Landscape 16:9 knit scores ~0.5+ on the classic 96@64 box and would
  // leave the real ~36px sparkle on the sweater.
  if (
    pool[0]!.score >= 0.5 &&
    pool[0]!.size <= 52 &&
    inBottomRight(pool[0]!, width, height)
  ) {
    return pool[0]!;
  }

  const is1024Class = !(width > 1024 && height > 1024);
  if (is1024Class) {
    const smalls = pool.filter((c) => c.size <= 52);
    const large = pool.find((c) => c.size >= 90);
    const bestSmall = smalls[0];
    // Knit/fabric false positives on the 96px box commonly score ~0.5+, so a
    // relative margin alone isn't a safe filter — require near-certainty
    // before letting the classic 96px mark override a real small-mark hit.
    const largeIsNearCertain = large ? large.score >= 0.65 : false;
    if (
      bestSmall &&
      bestSmall.score >= minScore &&
      (!large || !largeIsNearCertain || large.score < bestSmall.score + 0.18)
    ) {
      const v2 = v2SmallConfig(width, height);
      const ex = width - v2.margin - v2.logo_size;
      const ey = height - v2.margin - v2.logo_size;
      const nearV2 = smalls.find(
        (c) => Math.hypot(c.x - ex, c.y - ey) <= 16,
      );
      if (nearV2 && nearV2.score >= bestSmall.score - 0.06) {
        return nearV2;
      }
      return bestSmall;
    }
  }
  return pool[0]!;
}
