import type { WatermarkRect } from "./geometry";

const NEAR_BLACK = 5;
const MAX_HI_ALPHA_NEAR_BLACK = 0.18;
const MAX_DARK_GHOST_DELTA = 14;
const MAX_BRIGHT_SPARKLE_DELTA = 6;
const MAX_LOGO_SURROUND_IMBALANCE = 10;
const MIN_EFFECTIVE_ALPHA_GAIN = 0.45;
const MIN_EFFECTIVE_ALPHA_GAIN_SMALL = 0.28;
const ALPHA_GAIN_CANDIDATES = [
  0.28, 0.35, 0.42, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.05, 1.1,
] as const;
const NCC_REFINE_RADIUS = 16;
const MIN_DETECT_SCORE = 0.12;
/** Shirt / paisley / hair: mean luma is a bad ghost detector. */
const TEXTURE_STD = 16;
/** Navy / charcoal: restored sparkle pixels should go this dark. */
const DARK_SURROUND_LUMA = 40;
/** Flat studio color (blue backdrop, not knit): full reverse-alpha. */
const FLAT_SURROUND_STD = 14;

export function surroundAllowsFullReverse(
  loMean: number,
  loStd: number,
): boolean {
  if (loMean < DARK_SURROUND_LUMA) return true;
  return loStd < FLAT_SURROUND_STD;
}

function lumaAt(data: Uint8ClampedArray, idx: number): number {
  const r = data[idx]!;
  const g = data[idx + 1]!;
  const b = data[idx + 2]!;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Peak channel — same basis as the α capture, and sees blue logos luma misses. */
function peakAt(data: Uint8ClampedArray, idx: number): number {
  return Math.max(data[idx]!, data[idx + 1]!, data[idx + 2]!) / 255;
}

function regionStats(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
  alphaCut = 0.08,
): {
  bright: number;
  ghost: number;
  burn: number;
  score: number;
  loStd: number;
  hiStd: number;
  hiMean: number;
  loMean: number;
} {
  const { data, width } = imageData;
  const { x, y, width: rw, height: rh } = rect;

  let hiSum = 0;
  let hiN = 0;
  let loSum = 0;
  let loN = 0;
  let burnN = 0;
  let activeN = 0;
  const hiVals: number[] = [];
  const loVals: number[] = [];

  const gray: number[] = [];
  const alphaVals: number[] = [];

  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const a = alphaMap[row * rw + col]!;
      const idx = ((y + row) * width + (x + col)) * 4;
      const L = lumaAt(data, idx);
      gray.push(peakAt(data, idx));
      alphaVals.push(a);

      if (a >= alphaCut) {
        hiSum += L;
        hiN++;
        activeN++;
        hiVals.push(L);
        const r = data[idx]!;
        const g = data[idx + 1]!;
        const b = data[idx + 2]!;
        if (r <= NEAR_BLACK && g <= NEAR_BLACK && b <= NEAR_BLACK) {
          burnN++;
        }
      } else if (a < 0.02) {
        loSum += L;
        loN++;
        loVals.push(L);
      }
    }
  }

  const hiMean = hiN > 0 ? hiSum / hiN : 0;
  const loMean = loN > 0 ? loSum / loN : 0;
  const bright = hiN >= 8 && loN >= 8 ? hiMean - loMean : 0;
  const ghost = hiN >= 8 && loN >= 8 ? loMean - hiMean : 0;
  const burn = activeN > 0 ? burnN / activeN : 0;
  const score = ncc(gray, alphaVals);

  return {
    bright,
    ghost,
    burn,
    score,
    loStd: stdev(loVals),
    hiStd: stdev(hiVals),
    hiMean,
    loMean,
  };
}

function stdev(vals: number[]): number {
  if (vals.length < 8) return 0;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  let s = 0;
  for (const v of vals) s += (v - mean) * (v - mean);
  return Math.sqrt(s / vals.length);
}

function ncc(a: number[], b: number[]): number {
  const n = a.length;
  if (n === 0 || n !== b.length) return 0;
  let meanA = 0;
  let meanB = 0;
  for (let i = 0; i < n; i++) {
    meanA += a[i]!;
    meanB += b[i]!;
  }
  meanA /= n;
  meanB /= n;
  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i]! - meanA;
    const db = b[i]! - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const den = Math.sqrt(denA * denB);
  return den < 1e-12 ? 0 : num / den;
}

export function spatialCorrelation(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
): number {
  return regionStats(imageData, alphaMap, rect).score;
}

export function refinePlacementNcc(
  imageData: ImageData,
  alphaMap: Float32Array,
  seed: WatermarkRect,
  radius = NCC_REFINE_RADIUS,
): WatermarkRect & { score: number } {
  const { width: imgW, height: imgH } = imageData;
  const { width: rw, height: rh, size } = seed;
  let best = { ...seed, score: spatialCorrelation(imageData, alphaMap, seed) };

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = seed.x + dx;
      const y = seed.y + dy;
      if (x < 0 || y < 0 || x + rw > imgW || y + rh > imgH) continue;
      const rect: WatermarkRect = {
        size,
        x,
        y,
        width: rw,
        height: rh,
        mapKey: seed.mapKey,
      };
      const score = spatialCorrelation(imageData, alphaMap, rect);
      if (score > best.score) {
        best = { ...rect, score };
      }
    }
  }
  return best;
}

function nccPeakAt(
  imageData: ImageData,
  alphaMap: Float32Array,
  x: number,
  y: number,
  rw: number,
  rh: number,
): number {
  const { data, width } = imageData;
  const n = rw * rh;
  let meanP = 0;
  let meanA = 0;
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      meanP += peakAt(data, ((y + row) * width + (x + col)) * 4);
      meanA += alphaMap[row * rw + col]!;
    }
  }
  meanP /= n;
  meanA /= n;
  let num = 0;
  let denP = 0;
  let denA = 0;
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const dp = peakAt(data, ((y + row) * width + (x + col)) * 4) - meanP;
      const da = alphaMap[row * rw + col]! - meanA;
      num += dp * da;
      denP += dp * dp;
      denA += da * da;
    }
  }
  const den = Math.sqrt(denP * denA);
  return den < 1e-12 ? 0 : num / den;
}

/**
 * Coarse-to-fine scan for a map that is not on the official Gemini corner
 * (Erasio `method=scan`). Search the right/lower ~65% of the frame.
 */
export function scanPlacementNcc(
  imageData: ImageData,
  alphaMap: Float32Array,
  size: number,
  mapKey: WatermarkRect["mapKey"],
): (WatermarkRect & { score: number }) | null {
  const { width: imgW, height: imgH } = imageData;
  if (imgW < size || imgH < size) return null;

  const step = size <= 48 ? 4 : 8;
  // Bottom-right quadrant only. A 35% scan locks onto food/fabric and
  // burns a second box (beige patch) while the real sparkle stays in BR.
  const xMin = Math.max(0, Math.floor(imgW * 0.5));
  const yMin = Math.max(0, Math.floor(imgH * 0.45));
  const xMax = imgW - size;
  const yMax = imgH - size;

  let bestX = xMin;
  let bestY = yMin;
  let bestScore = -1;

  for (let y = yMin; y <= yMax; y += step) {
    for (let x = xMin; x <= xMax; x += step) {
      const score = nccPeakAt(imageData, alphaMap, x, y, size, size);
      if (score > bestScore) {
        bestScore = score;
        bestX = x;
        bestY = y;
      }
    }
  }

  const seed: WatermarkRect = {
    size,
    x: bestX,
    y: bestY,
    width: size,
    height: size,
    mapKey,
  };
  return refinePlacementNcc(imageData, alphaMap, seed, step);
}

/**
 * Per-channel logo color from the detected overlay.
 * White sparkle → ~255,255,255; blue Gemini icon → high B, low R/G.
 */
export function estimateLogoRgb(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
): [number, number, number] {
  const { data, width } = imageData;
  const { x, y, width: rw, height: rh } = rect;
  let rW = 0;
  let gW = 0;
  let bW = 0;
  let wSum = 0;
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const a = alphaMap[row * rw + col]!;
      if (a < 0.12) continue;
      const idx = ((y + row) * width + (x + col)) * 4;
      rW += data[idx]! * a;
      gW += data[idx + 1]! * a;
      bW += data[idx + 2]! * a;
      wSum += a;
    }
  }
  if (wSum < 4) return [255, 255, 255];
  const r = rW / wSum;
  const g = gW / wSum;
  const b = bW / wSum;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const maxc = Math.max(r, g, b);
  const minc = Math.min(r, g, b);
  const mid = r + g + b - maxc - minc;
  // Only the solid blue Gemini app icon: one channel dominates.
  // Mixed / white sparkles must stay logo=white or marble turns beige.
  if (maxc > 140 && maxc - mid > 50 && minc < 90 && spread > 40) {
    return [
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b)),
    ];
  }
  return [255, 255, 255];
}

/** Clone ImageData so gain probes don't mutate the canvas buffer. */
export function cloneImageData(source: ImageData): ImageData {
  return new ImageData(
    new Uint8ClampedArray(source.data),
    source.width,
    source.height,
  );
}

/**
 * How well RAB removed a sparkle-shaped overlay (works on paisley).
 * High NCC of (before − after) vs α means we subtracted the watermark
 * shape, not fabric. Clip penalty catches over-subtraction to black.
 */
export function rabResidualScore(
  before: ImageData,
  after: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
): number {
  const { x, y, width: rw, height: rh } = rect;
  const delta: number[] = [];
  const alphaVals: number[] = [];
  let hiN = 0;
  let clipN = 0;
  let loSum = 0;
  let loN = 0;
  const loLuma: number[] = [];
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const a = alphaMap[row * rw + col]!;
      const idx = ((y + row) * before.width + (x + col)) * 4;
      delta.push(lumaAt(before.data, idx) - lumaAt(after.data, idx));
      alphaVals.push(a);
      if (a < 0.02) {
        const L = lumaAt(before.data, idx);
        loSum += L;
        loN++;
        loLuma.push(L);
      }
      if (a >= 0.08) {
        hiN++;
        const r = after.data[idx]!;
        const g = after.data[idx + 1]!;
        const b = after.data[idx + 2]!;
        if (r <= 2 && g <= 2 && b <= 2) clipN++;
      }
    }
  }
  const corr = ncc(delta, alphaVals);
  const clip = hiN > 0 ? clipN / hiN : 0;
  const loMean = loN > 0 ? loSum / loN : 0;
  const fullReverse = surroundAllowsFullReverse(loMean, stdev(loLuma));
  // On black / navy / flat studio color, restored logo pixels may clip.
  // Penalizing that picked a weak gain and left a glassy star.
  return corr - (fullReverse ? 0 : clip * 2);
}

export function rabCost(after: {
  bright: number;
  ghost: number;
  burn: number;
}): number {
  // Heavy penalty on inverted (dark) leftovers; leftover bright is better
  // than a burned star.
  return (
    after.burn * 80 +
    Math.max(0, after.ghost) * 3 +
    Math.max(0, after.bright) +
    Math.max(0, -after.bright) * 4
  );
}

export function pickAlphaGain(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
  applyPass: (
    target: ImageData,
    alphaMap: Float32Array,
    rect: WatermarkRect,
    gain: number,
  ) => void,
): number | null {
  const before = regionStats(imageData, alphaMap, rect);
  const textured = before.loStd >= TEXTURE_STD;
  const fullReverse = surroundAllowsFullReverse(before.loMean, before.loStd);
  const dark = before.loMean < DARK_SURROUND_LUMA;
  const small = rect.size <= 40;
  const minGain = small
    ? MIN_EFFECTIVE_ALPHA_GAIN_SMALL
    : MIN_EFFECTIVE_ALPHA_GAIN;
  // Map isn't on a bright sparkle — RAB would stamp an inverted star.
  if (before.bright < -4) return null;
  let bestGain: number | null = null;
  let bestKey: [number, number, number, number] | null = null;

  for (const gain of ALPHA_GAIN_CANDIDATES) {
    if (gain < minGain) continue;
    if (small && gain > 0.7 && !fullReverse) continue;
    const probe = cloneImageData(imageData);
    applyPass(probe, alphaMap, rect, gain);
    const after = regionStats(probe, alphaMap, rect);
    if (after.burn > MAX_HI_ALPHA_NEAR_BLACK && !dark) continue;
    if (after.hiMean + 2 < after.loMean && !dark) continue;
    if (!textured && !dark) {
      if (after.ghost > MAX_DARK_GHOST_DELTA * 1.35) continue;
      if (Math.abs(after.bright) > MAX_LOGO_SURROUND_IMBALANCE) continue;
    }
    if (!dark && after.bright > (textured ? 12 : MAX_BRIGHT_SPARKLE_DELTA)) continue;
    if (
      !textured &&
      !dark &&
      before.bright > MAX_BRIGHT_SPARKLE_DELTA &&
      after.bright > before.bright * 0.35
    ) {
      continue;
    }
    const overshoot = Math.max(0, after.loMean - after.hiMean);
    const remain = Math.max(0, after.bright);
    const key: [number, number, number, number] = fullReverse
      ? [remain, overshoot, Math.abs(gain - 1), 0]
      : [
          after.burn,
          overshoot,
          remain,
          Math.abs(gain - (small ? 0.62 : 1)),
        ];
    if (
      !bestKey ||
      key[0] < bestKey[0] ||
      (key[0] === bestKey[0] && key[1] < bestKey[1]) ||
      (key[0] === bestKey[0] &&
        key[1] === bestKey[1] &&
        key[2] < bestKey[2]) ||
      (key[0] === bestKey[0] &&
        key[1] === bestKey[1] &&
        key[2] === bestKey[2] &&
        key[3] < bestKey[3])
    ) {
      bestKey = key;
      bestGain = gain;
    }
  }

  if (bestGain == null) return null;

  const probe = cloneImageData(imageData);
  applyPass(probe, alphaMap, rect, bestGain);
  const after = regionStats(probe, alphaMap, rect);
  if (after.burn > MAX_HI_ALPHA_NEAR_BLACK && !dark) return null;
  if (after.hiMean + 2 < after.loMean && !dark) return null;
  if (!textured && !dark) {
    if (after.bright > MAX_BRIGHT_SPARKLE_DELTA) return null;
    if (Math.abs(after.bright) > MAX_LOGO_SURROUND_IMBALANCE) return null;
  } else if (!dark && (after.bright > 14 || after.bright < -2)) {
    return null;
  }
  return bestGain;
}

export function isRabResultSafe(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
  beforeBright: number,
  _beforeGhost: number,
): boolean {
  const after = regionStats(imageData, alphaMap, rect);
  if (after.burn > MAX_HI_ALPHA_NEAR_BLACK) return false;
  if (after.hiMean + 2 < after.loMean) return false;
  if (after.loStd >= TEXTURE_STD) {
    return after.bright <= 14 && after.bright >= -2;
  }
  if (
    after.ghost > MAX_DARK_GHOST_DELTA &&
    after.ghost > 4
  ) {
    return false;
  }
  if (after.bright > MAX_BRIGHT_SPARKLE_DELTA) return false;
  if (Math.abs(after.bright) > MAX_LOGO_SURROUND_IMBALANCE) return false;
  if (
    beforeBright > MAX_BRIGHT_SPARKLE_DELTA &&
    after.bright > beforeBright * 0.35
  ) {
    return false;
  }
  return true;
}

export function isFullReverseSurround(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
): boolean {
  const s = regionStats(imageData, alphaMap, rect);
  return surroundAllowsFullReverse(s.loMean, s.loStd);
}

/**
 * On flat studio color, pull leftover glass-star pixels toward surround.
 * Peak channel catches blue-on-blue leftovers luma misses.
 */
export function flattenLeftoverSparkle(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
): void {
  const { data, width } = imageData;
  const { x, y, width: rw, height: rh } = rect;
  const before = regionStats(imageData, alphaMap, rect);
  if (before.loStd >= TEXTURE_STD) return;

  const loRgb = [0, 0, 0];
  let loN = 0;
  let loPeak = 0;
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const a = alphaMap[row * rw + col]!;
      if (a >= 0.02) continue;
      const idx = ((y + row) * width + (x + col)) * 4;
      loRgb[0] += data[idx]!;
      loRgb[1] += data[idx + 1]!;
      loRgb[2] += data[idx + 2]!;
      loPeak += Math.max(data[idx]!, data[idx + 1]!, data[idx + 2]!);
      loN++;
    }
  }
  if (loN < 8) return;
  loRgb[0] /= loN;
  loRgb[1] /= loN;
  loRgb[2] /= loN;
  loPeak /= loN;

  const t = new Float32Array(rw * rh);
  let leftoverN = 0;
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const a = alphaMap[row * rw + col]!;
      if (a < 0.08) continue;
      const idx = ((y + row) * width + (x + col)) * 4;
      const peak = Math.max(data[idx]!, data[idx + 1]!, data[idx + 2]!);
      if (peak <= loPeak + 3) continue;
      t[row * rw + col] = Math.min(1, (peak - loPeak) / 16);
      leftoverN++;
    }
  }
  if (leftoverN < 3) return;

  const dilated = new Float32Array(rw * rh);
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      let m = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const rr = row + dy;
          const cc = col + dx;
          if (rr < 0 || cc < 0 || rr >= rh || cc >= rw) continue;
          m = Math.max(m, t[rr * rw + cc]!);
        }
      }
      const a = alphaMap[row * rw + col]!;
      dilated[row * rw + col] = a >= 0.04 ? m : 0;
    }
  }

  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const w = dilated[row * rw + col]!;
      if (w < 0.05) continue;
      const idx = ((y + row) * width + (x + col)) * 4;
      data[idx] = Math.round(data[idx]! * (1 - w) + loRgb[0] * w);
      data[idx + 1] = Math.round(data[idx + 1]! * (1 - w) + loRgb[1] * w);
      data[idx + 2] = Math.round(data[idx + 2]! * (1 - w) + loRgb[2] * w);
    }
  }
}

export { MIN_DETECT_SCORE, regionStats, TEXTURE_STD };
