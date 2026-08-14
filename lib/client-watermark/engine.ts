import { calculateAlphaMap, resizeAlphaMap } from "./alphaMap";
import { removeWatermark } from "./blend";
import {
  nccRadiusFor,
  officialPlacements,
  pickSparkleWinner,
  type SparkleMapKey,
  type WatermarkRect,
} from "./geometry";
import { inpaintSparkleRegion } from "./inpaint";
import {
  cloneImageData,
  estimateLogoRgb,
  flattenLeftoverSparkle,
  isFullReverseSurround,
  MIN_DETECT_SCORE,
  rabResidualScore,
  refinePlacementNcc,
  scanPlacementNcc,
} from "./quality";

const APPLY_GAINS = [0.55, 0.62, 0.7, 0.78, 0.85, 0.92, 1] as const;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function nativeSize(key: SparkleMapKey): 36 | 48 | 96 {
  if (key === "v1-48") return 48;
  if (key === "v2-36") return 36;
  return 96;
}

function mapForRect(
  native: Float32Array,
  nativeSide: number,
  size: number,
): Float32Array {
  if (size === nativeSide) return native;
  return resizeAlphaMap(native, nativeSide, nativeSide, size, size);
}

/**
 * Browser Gemini sparkle remover: reverse alpha blending with V1 + V2 maps.
 * Inpaint only if no inverse lands cleanly.
 */
export class ClientWatermarkEngine {
  private alphaMaps: Partial<Record<SparkleMapKey, Float32Array>> = {};

  private constructor(
    private readonly bg48: HTMLImageElement,
    private readonly bg96: HTMLImageElement,
    private readonly bg96v2: HTMLImageElement,
    private readonly bg36v2: HTMLImageElement,
  ) {}

  static async create(): Promise<ClientWatermarkEngine> {
    const [bg48, bg96, bg96v2, bg36v2] = await Promise.all([
      loadImage("/gemini-alpha/bg_48.png"),
      loadImage("/gemini-alpha/bg_96.png"),
      loadImage("/gemini-alpha/bg_96_v2.png"),
      loadImage("/gemini-alpha/bg_36_v2.png"),
    ]);
    return new ClientWatermarkEngine(bg48, bg96, bg96v2, bg36v2);
  }

  private captureMap(img: HTMLImageElement, size: number): Float32Array {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D unavailable");
    ctx.drawImage(img, 0, 0, size, size);
    return calculateAlphaMap(ctx.getImageData(0, 0, size, size));
  }

  private getAlphaMap(key: SparkleMapKey): Float32Array {
    const cached = this.alphaMaps[key];
    if (cached) return cached;

    let map: Float32Array;
    if (key === "v1-48") {
      map = this.captureMap(this.bg48, 48);
    } else if (key === "v1-96") {
      map = this.captureMap(this.bg96, 96);
    } else if (key === "v2-96") {
      map = this.captureMap(this.bg96v2, 96);
    } else {
      map = this.captureMap(this.bg36v2, 36);
    }
    this.alphaMaps[key] = map;
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

    type Ranked = WatermarkRect & { score: number; alphaMap: Float32Array };
    const ranked: Ranked[] = [];

    for (const seed of officialPlacements(canvas.width, canvas.height)) {
      if (
        seed.x < 0 ||
        seed.y < 0 ||
        seed.x + seed.width > canvas.width ||
        seed.y + seed.height > canvas.height
      ) {
        continue;
      }
      const native = this.getAlphaMap(seed.mapKey);
      const side = nativeSize(seed.mapKey);
      const alphaMap = mapForRect(native, side, seed.size);
      const refined = refinePlacementNcc(
        original,
        alphaMap,
        seed,
        nccRadiusFor(seed),
      );
      ranked.push({
        ...refined,
        alphaMap: mapForRect(native, side, refined.width),
      });
    }

    // Erasio `method=scan`: 48px "old" logo is often off the official corner.
    for (const key of ["v1-48", "v2-36"] as const) {
      const native = this.getAlphaMap(key);
      const side = nativeSize(key);
      const scanned = scanPlacementNcc(original, native, side, key);
      if (!scanned || scanned.score < MIN_DETECT_SCORE) continue;
      ranked.push({
        ...scanned,
        alphaMap: native,
      });
    }

    ranked.sort((a, b) => b.score - a.score);

    const winner = pickSparkleWinner(
      ranked,
      canvas.width,
      canvas.height,
      MIN_DETECT_SCORE,
    );

    let method: "rab" | "inpaint" = "inpaint";
    let usedRect: WatermarkRect | null = null;

    if (winner) {
      const native = this.getAlphaMap(winner.mapKey);
      const side = nativeSize(winner.mapKey);
      const map = mapForRect(native, side, winner.size);
      const logoRgb = estimateLogoRgb(original, map, winner);
      const distRight = canvas.width - (winner.x + winner.size);
      const distBottom = canvas.height - (winner.y + winner.size);
      const officialCorner = distRight <= 220 && distBottom <= 220;
      const fullReverse = isFullReverseSurround(original, map, winner);
      const preferredGain = fullReverse
        ? 1
        : winner.mapKey === "v1-48" && !officialCorner
          ? 0.62
          : 1;
      const gains = fullReverse ? ([1] as const) : APPLY_GAINS;
      const seeds: WatermarkRect[] = [winner];
      for (const dy of [-1, 0, 1]) {
        for (const dx of [-1, 0, 1]) {
          if (dx === 0 && dy === 0) continue;
          const shifted: WatermarkRect = {
            ...winner,
            x: winner.x + dx,
            y: winner.y + dy,
          };
          if (
            shifted.x < 0 ||
            shifted.y < 0 ||
            shifted.x + shifted.width > canvas.width ||
            shifted.y + shifted.height > canvas.height
          ) {
            continue;
          }
          seeds.push(shifted);
        }
      }

      const preferred = cloneImageData(original);
      removeWatermark(preferred, map, winner, {
        alphaGain: preferredGain,
        logoRgb,
      });
      let best: { rect: WatermarkRect; probe: ImageData; score: number } = {
        rect: winner,
        probe: preferred,
        score: rabResidualScore(original, preferred, map, winner),
      };
      for (const seed of seeds) {
        for (const gain of gains) {
          if (
            seed.x === winner.x &&
            seed.y === winner.y &&
            gain === preferredGain
          ) {
            continue;
          }
          const probe = cloneImageData(original);
          removeWatermark(probe, map, seed, { alphaGain: gain, logoRgb });
          const score = rabResidualScore(original, probe, map, seed);
          if (score > best.score + 0.04) {
            best = { rect: seed, probe, score };
          }
        }
      }

      imageData.data.set(best.probe.data);
      flattenLeftoverSparkle(imageData, map, best.rect);
      method = "rab";
      usedRect = best.rect;
    }

    if (method === "inpaint") {
      const best = winner ?? ranked[0];
      if (!best) {
        throw new Error("Image too small for Gemini watermark region");
      }
      usedRect = {
        size: best.size,
        x: best.x,
        y: best.y,
        width: best.width,
        height: best.height,
        mapKey: best.mapKey,
      };
      imageData.data.set(original.data);
      inpaintSparkleRegion(imageData, best.alphaMap, usedRect);
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
