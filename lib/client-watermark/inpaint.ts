import type { WatermarkRect } from "./geometry";

function luma(data: Uint8ClampedArray, idx: number): number {
  return 0.2126 * data[idx]! + 0.7152 * data[idx + 1]! + 0.0722 * data[idx + 2]!;
}

function dilateMask(
  mask: Uint8Array,
  rw: number,
  rh: number,
  rounds: number,
): Uint8Array {
  let cur = new Uint8Array(mask);
  for (let round = 0; round < rounds; round++) {
    const next = new Uint8Array(cur);
    for (let row = 0; row < rh; row++) {
      for (let col = 0; col < rw; col++) {
        const i = row * rw + col;
        if (cur[i]) continue;
        const up = row > 0 && cur[i - rw];
        const down = row + 1 < rh && cur[i + rw];
        const left = col > 0 && cur[i - 1];
        const right = col + 1 < rw && cur[i + 1];
        if (up || down || left || right) next[i] = 1;
      }
    }
    cur = next;
  }
  return cur;
}

function erodeMask(
  mask: Uint8Array,
  rw: number,
  rh: number,
  rounds: number,
): Uint8Array {
  let cur = new Uint8Array(mask);
  for (let round = 0; round < rounds; round++) {
    const next = new Uint8Array(rw * rh);
    for (let row = 1; row < rh - 1; row++) {
      for (let col = 1; col < rw - 1; col++) {
        const i = row * rw + col;
        if (
          cur[i] &&
          cur[i - 1] &&
          cur[i + 1] &&
          cur[i - rw] &&
          cur[i + rw]
        ) {
          next[i] = 1;
        }
      }
    }
    cur = next;
  }
  return cur;
}

/**
 * Box-blur luma over the rect (odd kernel). Used as local fabric estimate.
 */
function blurLumaRegion(
  data: Uint8ClampedArray,
  imgW: number,
  x: number,
  y: number,
  rw: number,
  rh: number,
  radius: number,
): Float32Array {
  const out = new Float32Array(rw * rh);
  const tmp = new Float32Array(rw * rh);
  // horizontal
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      let sum = 0;
      let n = 0;
      for (let dx = -radius; dx <= radius; dx++) {
        const cc = Math.min(rw - 1, Math.max(0, col + dx));
        const idx = ((y + row) * imgW + (x + cc)) * 4;
        sum += luma(data, idx);
        n++;
      }
      tmp[row * rw + col] = sum / n;
    }
  }
  // vertical
  for (let row = 0; row < rh; row++) {
    for (let col = 0; col < rw; col++) {
      let sum = 0;
      let n = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        const rr = Math.min(rh - 1, Math.max(0, row + dy));
        sum += tmp[rr * rw + col]!;
        n++;
      }
      out[row * rw + col] = sum / n;
    }
  }
  return out;
}

/**
 * Fill masked pixels from nearby non-mask neighbors only (Fast Marching-ish).
 */
function fillFromOutside(
  data: Uint8ClampedArray,
  imgW: number,
  x: number,
  y: number,
  rw: number,
  rh: number,
  hot: Uint8Array,
  passes: number,
  sampleRadius: number,
): void {
  for (let pass = 0; pass < passes; pass++) {
    const snapshot = new Uint8ClampedArray(data);
    const order: number[] = [];
    for (let i = 0; i < hot.length; i++) {
      if (hot[i]) order.push(i);
    }
    // Prefer edge pixels first (more known neighbors).
    order.sort((a, b) => {
      const ar = Math.floor(a / rw);
      const ac = a % rw;
      const br = Math.floor(b / rw);
      const bc = b % rw;
      const edgeA =
        (ar === 0 || ac === 0 || ar === rh - 1 || ac === rw - 1 ? 0 : 1) +
        neighborKnown(hot, rw, rh, ar, ac);
      const edgeB =
        (br === 0 || bc === 0 || br === rh - 1 || bc === rw - 1 ? 0 : 1) +
        neighborKnown(hot, rw, rh, br, bc);
      return edgeA - edgeB;
    });

    for (const mi of order) {
      const row = Math.floor(mi / rw);
      const col = mi % rw;
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;
      let wSum = 0;

      for (let dy = -sampleRadius; dy <= sampleRadius; dy++) {
        for (let dx = -sampleRadius; dx <= sampleRadius; dx++) {
          if (dx === 0 && dy === 0) continue;
          const rr = row + dy;
          const cc = col + dx;
          if (rr < 0 || cc < 0 || rr >= rh || cc >= rw) continue;
          const ni = rr * rw + cc;
          // Only sample known (non-hot) pixels.
          if (hot[ni]) continue;
          const dist = Math.hypot(dx, dy);
          const w = 1 / (dist * dist);
          const idx = ((y + rr) * imgW + (x + cc)) * 4;
          rSum += snapshot[idx]! * w;
          gSum += snapshot[idx + 1]! * w;
          bSum += snapshot[idx + 2]! * w;
          wSum += w;
        }
      }

      if (wSum <= 0) continue;
      const idx = ((y + row) * imgW + (x + col)) * 4;
      data[idx] = Math.round(rSum / wSum);
      data[idx + 1] = Math.round(gSum / wSum);
      data[idx + 2] = Math.round(bSum / wSum);
    }
  }
}

function neighborKnown(
  hot: Uint8Array,
  rw: number,
  rh: number,
  row: number,
  col: number,
): number {
  let known = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const rr = row + dy;
      const cc = col + dx;
      if (rr < 0 || cc < 0 || rr >= rh || cc >= rw) continue;
      if (!hot[rr * rw + cc]) known++;
    }
  }
  return -known;
}

/**
 * Browser port of Cloud Gemini overlay removal:
 * inpaint only bright residual inside the alpha silhouette, then mop leftover glow.
 */
export function inpaintSparkleRegion(
  imageData: ImageData,
  alphaMap: Float32Array,
  rect: WatermarkRect,
  alphaCut = 0.04,
): void {
  const { data, width: imgW } = imageData;
  const { x, y, width: rw, height: rh } = rect;

  const silhouette = new Uint8Array(rw * rh);
  for (let i = 0; i < alphaMap.length; i++) {
    silhouette[i] = alphaMap[i]! >= alphaCut ? 1 : 0;
  }
  const sil = dilateMask(silhouette, rw, rh, 2);

  const bgGray = blurLumaRegion(data, imgW, x, y, rw, rh, Math.max(12, (rw / 4) | 0));

  // Hot = bright residual inside silhouette (the sparkle overlay).
  let hot: Uint8Array = new Uint8Array(rw * rh);
  let hotCount = 0;
  for (let i = 0; i < sil.length; i++) {
    if (!sil[i]) continue;
    const row = Math.floor(i / rw);
    const col = i % rw;
    const idx = ((y + row) * imgW + (x + col)) * 4;
    const residual = luma(data, idx) - bgGray[i]!;
    if (residual > 3) {
      hot[i] = 1;
      hotCount++;
    }
  }

  if (hotCount < Math.max(20, Math.floor(sil.reduce((a, b) => a + b, 0) / 10))) {
    // Soft / low-contrast logos: use eroded silhouette core.
    hot = erodeMask(sil, rw, rh, 2);
    if (hot.every((v) => !v)) {
      hot = new Uint8Array(sil);
    }
  } else {
    hot = dilateMask(hot, rw, rh, 1);
    for (let i = 0; i < hot.length; i++) {
      if (!sil[i]) hot[i] = 0;
    }
  }

  fillFromOutside(data, imgW, x, y, rw, rh, hot, 10, 4);

  // Second pass: leftover glow still brighter than local fabric.
  const bgGray2 = blurLumaRegion(data, imgW, x, y, rw, rh, Math.max(12, (rw / 4) | 0));
  const leftover = new Uint8Array(rw * rh);
  let leftCount = 0;
  for (let i = 0; i < sil.length; i++) {
    if (!sil[i]) continue;
    const row = Math.floor(i / rw);
    const col = i % rw;
    const idx = ((y + row) * imgW + (x + col)) * 4;
    if (luma(data, idx) - bgGray2[i]! > 5) {
      leftover[i] = 1;
      leftCount++;
    }
  }

  if (leftCount > 0) {
    const left = dilateMask(leftover, rw, rh, 1);
    for (let i = 0; i < left.length; i++) {
      if (!sil[i]) left[i] = 0;
    }
    fillFromOutside(data, imgW, x, y, rw, rh, left, 8, 5);
  }

  // Final clamp: any remaining hi-α pixel brighter than surround mean → pull to surround.
  let loSum = 0;
  let loN = 0;
  for (let i = 0; i < alphaMap.length; i++) {
    if (alphaMap[i]! >= 0.02) continue;
    const row = Math.floor(i / rw);
    const col = i % rw;
    const idx = ((y + row) * imgW + (x + col)) * 4;
    loSum += luma(data, idx);
    loN++;
  }
  const loMean = loN > 0 ? loSum / loN : 0;
  if (loMean > 0) {
    for (let i = 0; i < alphaMap.length; i++) {
      if (alphaMap[i]! < 0.08) continue;
      const row = Math.floor(i / rw);
      const col = i % rw;
      const idx = ((y + row) * imgW + (x + col)) * 4;
      const L = luma(data, idx);
      if (L > loMean + 6) {
        // Blend toward local surround estimate.
        const t = Math.min(1, (L - loMean) / 40);
        const target = loMean;
        const scale = (target / Math.max(L, 1)) * t + (1 - t);
        data[idx] = Math.max(0, Math.min(255, Math.round(data[idx]! * scale)));
        data[idx + 1] = Math.max(
          0,
          Math.min(255, Math.round(data[idx + 1]! * scale)),
        );
        data[idx + 2] = Math.max(
          0,
          Math.min(255, Math.round(data[idx + 2]! * scale)),
        );
      }
    }
  }
}
