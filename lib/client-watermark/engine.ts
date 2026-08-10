import { calculateAlphaMap } from "./alphaMap";
import { removeWatermark } from "./blend";
import {
  officialPlacements,
  type WatermarkRect,
} from "./geometry";
import { inpaintSparkleRegion } from "./inpaint";
import {
  cloneImageData,
  isRabResultSafe,
  MIN_DETECT_SCORE,
  pickAlphaGain,
  refinePlacementNcc,
  regionStats,
} from "./quality";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function surroundMeanLuma(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
): number {
  const { data, width } = imageData;
  let sum = 0;
  let n = 0;
  for (let row = 0; row < rect.height; row++) {
    for (let col = 0; col < rect.width; col++) {
      const a = alphaMap[row * rect.width + col]!;
      if (a >= 0.02) continue;
      const idx = ((rect.y + row) * width + (rect.x + col)) * 4;
      const r = data[idx]!;
      const g = data[idx + 1]!;
      const b = data[idx + 2]!;
      sum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
      n++;
    }
  }
  return n > 0 ? sum / n : 255;
}

/**
 * Remaining bright peak in the processed logo area vs surround.
 * Catches "white sparkle still there + black ghost below".
 */
function residualBrightPeak(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
): number {
  const { data, width } = imageData;
  let hiMax = 0;
  let loSum = 0;
  let loN = 0;
  for (let row = 0; row < rect.height; row++) {
    for (let col = 0; col < rect.width; col++) {
      const a = alphaMap[row * rect.width + col]!;
      const idx = ((rect.y + row) * width + (rect.x + col)) * 4;
      const L = 0.2126 * data[idx]! + 0.7152 * data[idx + 1]! + 0.0722 * data[idx + 2]!;
      if (a >= 0.08) {
        hiMax = Math.max(hiMax, L);
      } else if (a < 0.02) {
        loSum += L;
        loN++;
      }
    }
  }
  const loMean = loN > 0 ? loSum / loN : 0;
  return hiMax - loMean;
}

/**
 * Browser-side Gemini sparkle remover via reverse alpha blending,
 * with soft inpaint fallback when RAB would burn or leave the mark.
 */
export class ClientWatermarkEngine {
  private alphaMaps: Partial<Record<48 | 96, Float32Array>> = {};

  private constructor(
    private readonly bg48: HTMLImageElement,
    private readonly bg96: HTMLImageElement,
  ) {}

  static async create(): Promise<ClientWatermarkEngine> {
    const [bg48, bg96] = await Promise.all([
      loadImage("/gemini-alpha/bg_48.png"),
      loadImage("/gemini-alpha/bg_96.png"),
    ]);
    return new ClientWatermarkEngine(bg48, bg96);
  }

  private async getAlphaMap(size: 48 | 96): Promise<Float32Array> {
    const cached = this.alphaMaps[size];
    if (cached) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D unavailable");

    ctx.drawImage(size === 48 ? this.bg48 : this.bg96, 0, 0);
    const map = calculateAlphaMap(ctx.getImageData(0, 0, size, size));
    this.alphaMaps[size] = map;
    return map;
  }

  async processFile(file: File): Promise<{
    blob: Blob;
    width: number;
    height: number;
    rect: WatermarkRect;
    method: "rab" | "inpaint";
  }> {
    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await loadImage(objectUrl);
      return this.processImageElement(img);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  async processImageElement(img: HTMLImageElement): Promise<{
    blob: Blob;
    width: number;
    height: number;
    rect: WatermarkRect;
    method: "rab" | "inpaint";
  }> {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D unavailable");

    ctx.drawImage(img, 0, 0);
    const original = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imageData = cloneImageData(original);

    const candidates = officialPlacements(canvas.width, canvas.height);
    type Ranked = WatermarkRect & { score: number; alphaMap: Float32Array };
    const ranked: Ranked[] = [];

    for (const seed of candidates) {
      if (
        seed.x < 0 ||
        seed.y < 0 ||
        seed.x + seed.width > canvas.width ||
        seed.y + seed.height > canvas.height
      ) {
        continue;
      }
      const alphaMap = await this.getAlphaMap(seed.size);
      // Wider refine — Instant used to burn a black mark below the real sparkle
      // when the seed was slightly off.
      const refined = refinePlacementNcc(original, alphaMap, seed, 28);
      ranked.push({ ...refined, alphaMap });
    }

    ranked.sort((a, b) => b.score - a.score);

    let method: "rab" | "inpaint" = "inpaint";
    let usedRect: WatermarkRect | null = null;

    for (const candidate of ranked) {
      if (candidate.score < MIN_DETECT_SCORE * 0.75) continue;
      const rect: WatermarkRect = {
        size: candidate.size,
        x: candidate.x,
        y: candidate.y,
        width: candidate.width,
        height: candidate.height,
      };
      const { alphaMap } = candidate;
      const before = regionStats(original, alphaMap, rect);

      // Dark backgrounds: full-strength RAB burns a black sparkle under the
      // real mark. Prefer inpaint instead of shipping a dual-sparkle artifact.
      const surround = surroundMeanLuma(original, alphaMap, rect);
      if (surround < 90 && before.bright > 8) {
        continue;
      }

      const gain = pickAlphaGain(
        original,
        alphaMap,
        rect,
        (target, map, position, g) => {
          removeWatermark(target, map, position, { alphaGain: g });
        },
      );
      if (gain == null) continue;

      const probe = cloneImageData(original);
      removeWatermark(probe, alphaMap, rect, { alphaGain: gain });
      if (
        !isRabResultSafe(
          probe,
          alphaMap,
          rect,
          before.bright,
          before.ghost,
        )
      ) {
        continue;
      }

      // Extra guard: bright peak must not remain above the surround.
      if (residualBrightPeak(probe, alphaMap, rect) > 18) {
        continue;
      }

      imageData.data.set(probe.data);
      method = "rab";
      usedRect = rect;
      break;
    }

    if (method === "inpaint") {
      // Prefer the highest-scoring 96px placement (Gemini 1k/2k), else best overall.
      const best96 = ranked.find((c) => c.size === 96);
      const best = best96 ?? ranked[0];
      if (!best) {
        throw new Error("Image too small for Gemini watermark region");
      }
      usedRect = {
        size: best.size,
        x: best.x,
        y: best.y,
        width: best.width,
        height: best.height,
      };
      imageData.data.set(original.data);
      inpaintSparkleRegion(imageData, best.alphaMap, usedRect);

      // If a second strong candidate is offset, clean that too (stacked ghost case).
      for (const extra of ranked.slice(0, 3)) {
        if (extra === best) continue;
        if (extra.score < MIN_DETECT_SCORE) continue;
        const dx = Math.abs(extra.x - best.x);
        const dy = Math.abs(extra.y - best.y);
        if (dx < 8 && dy < 8 && extra.size === best.size) continue;
        inpaintSparkleRegion(imageData, extra.alphaMap, {
          size: extra.size,
          x: extra.x,
          y: extra.y,
          width: extra.width,
          height: extra.height,
        });
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to encode PNG"))),
        "image/png",
      );
    });

    return {
      blob,
      width: canvas.width,
      height: canvas.height,
      rect: usedRect!,
      method,
    };
  }
}

let enginePromise: Promise<ClientWatermarkEngine> | null = null;

export function getClientWatermarkEngine(): Promise<ClientWatermarkEngine> {
  if (!enginePromise) {
    enginePromise = ClientWatermarkEngine.create();
  }
  return enginePromise;
}

/** Drop cached engine (dev HMR / tests). */
export function resetClientWatermarkEngine(): void {
  enginePromise = null;
}
