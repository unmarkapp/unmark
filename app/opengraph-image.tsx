import { ImageResponse } from "next/og";

export const alt = "Unmark — Gemini watermark remover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(145deg, #FBF0E6 0%, #F2EEE5 55%, #E8D5C0 100%)",
          color: "#1A1A17",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#C77B36",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="-14 -14 28 28">
              <path
                d="M0 -9.2 C 0.42 -2.5 2.5 -0.42 9.2 0 C 2.5 0.42 0.42 2.5 0 9.2 C -0.42 2.5 -2.5 0.42 -9.2 0 C -2.5 -0.42 -0.42 -2.5 0 -9.2 Z"
                fill="#FBF0E6"
              />
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
              color: "#57534e",
              maxWidth: 820,
              lineHeight: 1.35,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Clean 16:9 and 9:16 Gemini exports at original quality.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#C77B36",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 600,
          }}
        >
          unmark.ink
        </div>
      </div>
    ),
    { ...size },
  );
}
