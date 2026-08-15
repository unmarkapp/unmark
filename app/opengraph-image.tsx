import { ImageResponse } from "next/og";

export const alt = "Unmark — Gemini watermark remover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SPARKLE =
  "M0 -9.2 L 2.1 -2.1 L 9.2 0 L 2.1 2.1 L 0 9.2 L -2.1 2.1 L -9.2 0 L -2.1 -2.1 Z";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#F4F0E6",
          color: "#111111",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 320,
            height: 320,
            borderRadius: 999,
            background: "#D61C0D",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -40,
            top: 48,
            width: 180,
            height: 72,
            background: "#0047AB",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -60,
            bottom: -80,
            width: 280,
            height: 280,
            borderRadius: 999,
            background: "#FFCC00",
            opacity: 0.5,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              background: "#D61C0D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="-14 -14 28 28">
              <path d={SPARKLE} fill="#FFFFFF" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Unmark
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Remove Gemini watermarks online
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#5C5C5C",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            Clean 16:9 and 9:16 Gemini exports at original quality.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#D61C0D",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          unmark.ink
        </div>
      </div>
    ),
    { ...size },
  );
}
