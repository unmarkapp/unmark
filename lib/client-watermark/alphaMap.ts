/** Build α map from a solid-background capture of the Gemini sparkle. */
export function calculateAlphaMap(
  bgCaptureImageData: ImageData,
): Float32Array {
  const { width, height, data } = bgCaptureImageData;
  const alphaMap = new Float32Array(width * height);
  for (let i = 0; i < alphaMap.length; i++) {
    const idx = i * 4;
    alphaMap[i] =
      Math.max(data[idx]!, data[idx + 1]!, data[idx + 2]!) / 255;
  }
  return alphaMap;
}

/** Bilinear resize of an α map (mask scale). */
export function resizeAlphaMap(
  src: Float32Array,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): Float32Array {
  if (srcW === dstW && srcH === dstH) return src;
  const out = new Float32Array(dstW * dstH);
  const xScale = srcW / dstW;
  const yScale = srcH / dstH;
  for (let y = 0; y < dstH; y++) {
    const sy = (y + 0.5) * yScale - 0.5;
    const y0 = Math.max(0, Math.min(srcH - 1, Math.floor(sy)));
    const y1 = Math.min(srcH - 1, y0 + 1);
    const fy = sy - y0;
    for (let x = 0; x < dstW; x++) {
      const sx = (x + 0.5) * xScale - 0.5;
      const x0 = Math.max(0, Math.min(srcW - 1, Math.floor(sx)));
      const x1 = Math.min(srcW - 1, x0 + 1);
      const fx = sx - x0;
      const a00 = src[y0 * srcW + x0]!;
      const a10 = src[y0 * srcW + x1]!;
      const a01 = src[y1 * srcW + x0]!;
      const a11 = src[y1 * srcW + x1]!;
      out[y * dstW + x] =
        a00 * (1 - fx) * (1 - fy) +
        a10 * fx * (1 - fy) +
        a01 * (1 - fx) * fy +
        a11 * fx * fy;
    }
  }
  return out;
}
