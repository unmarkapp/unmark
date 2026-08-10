import type { WatermarkRect } from "./geometry";

const NEAR_BLACK = 5;
const MAX_HI_ALPHA_NEAR_BLACK = 0.18;
const MAX_DARK_GHOST_DELTA = 14;
const MAX_BRIGHT_SPARKLE_DELTA = 6;
const MAX_LOGO_SURROUND_IMBALANCE = 6;
const MIN_EFFECTIVE_ALPHA_GAIN = 0.55;
const ALPHA_GAIN_CANDIDATES = [0.55, 0.65, 0.75, 0.85, 1] as const;
const NCC_REFINE_RADIUS = 16;
const MIN_DETECT_SCORE = 0.12;

function lumaAt(data: Uint8ClampedArray, idx: number): number {
  const r = data[idx]!;
  const g = data[idx + 1]!;
  const b = data[idx + 2]!;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function regionStats(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
  alphaCut = 0.08,
): { bright: number; ghost: number; burn: number; score: number } {
  const { data, width } = imageData;
  const { x, y, width: rw, height: rh } = rect;

  let hiSum = 0;
  let hiN = 0;
  let loSum = 0;
  let loN = 0;
  let burnN = 0;
  let activeN = 0;

  const gray: number[] = [];
  const alphaVals: number[] = [];

  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      const a = alphaMap[row * rw + col]!;
      const idx = ((y + row) * width + (x + col)) * 4;
      const L = lumaAt(data, idx);
      gray.push(L / 255);
      alphaVals.push(a);

      if (a >= alphaCut) {
        hiSum += L;
        hiN++;
        activeN++;
        const r = data[idx]!;
        const g = data[idx + 1]!;
        const b = data[idx + 2]!;
        if (r <= NEAR_BLACK && g <= NEAR_BLACK && b <= NEAR_BLACK) {
          burnN++;
        }
      } else if (a < 0.02) {
        loSum += L;
        loN++;
      }
    }
  }

  const hiMean = hiN > 0 ? hiSum / hiN : 0;
  const loMean = loN > 0 ? loSum / loN : 0;
  const bright = hiN >= 8 && loN >= 8 ? hiMean - loMean : 0;
  const ghost = hiN >= 8 && loN >= 8 ? loMean - hiMean : 0;
  const burn = activeN > 0 ? burnN / activeN : 0;
  const score = ncc(gray, alphaVals);

  return { bright, ghost, burn, score };
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
      const rect: WatermarkRect = { size, x, y, width: rw, height: rh };
      const score = spatialCorrelation(imageData, alphaMap, rect);
      if (score > best.score) {
        best = { ...rect, score };
      }
    }
  }
  return best;
}

/** Clone ImageData so gain probes don't mutate the canvas buffer. */
export function cloneImageData(source: ImageData): ImageData {
  return new ImageData(
    new Uint8ClampedArray(source.data),
    source.width,
    source.height,
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
  let bestGain: number | null = null;
  let bestKey: [number, number, number, number] | null = null;

  for (const gain of ALPHA_GAIN_CANDIDATES) {
    if (gain < MIN_EFFECTIVE_ALPHA_GAIN) continue;
    const probe = cloneImageData(imageData);
    applyPass(probe, alphaMap, rect, gain);
    const after = regionStats(probe, alphaMap, rect);
    if (after.burn > MAX_HI_ALPHA_NEAR_BLACK) continue;
    if (
      after.ghost > MAX_DARK_GHOST_DELTA &&
      after.ghost > before.ghost + 6
    ) {
      continue;
    }
    if (after.ghost > MAX_DARK_GHOST_DELTA * 1.35) continue;
    if (after.bright > MAX_BRIGHT_SPARKLE_DELTA) continue;
    if (Math.abs(after.bright) > MAX_LOGO_SURROUND_IMBALANCE) continue;
    if (
      before.bright > MAX_BRIGHT_SPARKLE_DELTA &&
      after.bright > before.bright * 0.35
    ) {
      continue;
    }
    const key: [number, number, number, number] = [
      Math.abs(after.bright),
      Math.max(0, after.ghost),
      Math.abs(after.score),
      -gain,
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
  if (
    after.ghost > MAX_DARK_GHOST_DELTA &&
    after.ghost > before.ghost + 4
  ) {
    return null;
  }
  if (after.bright > MAX_BRIGHT_SPARKLE_DELTA) return null;
  if (Math.abs(after.bright) > MAX_LOGO_SURROUND_IMBALANCE) return null;
  return bestGain;
}

export function isRabResultSafe(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
  beforeBright: number,
  beforeGhost: number,
): boolean {
  const after = regionStats(imageData, alphaMap, rect);
  if (after.burn > MAX_HI_ALPHA_NEAR_BLACK) return false;
  if (
    after.ghost > MAX_DARK_GHOST_DELTA &&
    after.ghost > beforeGhost + 4
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

export { MIN_DETECT_SCORE, regionStats };
