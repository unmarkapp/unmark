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
