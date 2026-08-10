import type { WatermarkRect } from "./geometry";

const ALPHA_THRESHOLD = 0.002;
const MAX_ALPHA = 0.99;
const LOGO_VALUE = 255;

/**
 * Reverse alpha blending (white logo):
 *   final = α·logo + (1-α)·original
 *   original = (final - α·logo) / (1-α)
 */
export function removeWatermark(
  imageData: ImageData,
  alphaMap: Float32Array,
  position: WatermarkRect,
  options: { alphaGain?: number } = {},
): void {
  const { x, y, width, height } = position;
  const gain =
    Number.isFinite(options.alphaGain) && (options.alphaGain ?? 0) > 0
      ? (options.alphaGain as number)
      : 1;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const imgIdx = ((y + row) * imageData.width + (x + col)) * 4;
      const alphaIdx = row * width + col;

      let alpha = alphaMap[alphaIdx]! * gain;
      if (alpha < ALPHA_THRESHOLD) continue;
      alpha = Math.min(alpha, MAX_ALPHA);

      for (let c = 0; c < 3; c++) {
        const watermarked = imageData.data[imgIdx + c]!;
        const original =
          (watermarked - alpha * LOGO_VALUE) / (1 - alpha);
        imageData.data[imgIdx + c] = Math.max(
          0,
          Math.min(255, Math.round(original)),
        );
      }
    }
  }
}
