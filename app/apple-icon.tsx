import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#C77B36",
          borderRadius: 36,
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="-14 -14 28 28"
          style={{ display: "block" }}
        >
          <path
            d="M0 -9.2 C 0.42 -2.5 2.5 -0.42 9.2 0 C 2.5 0.42 0.42 2.5 0 9.2 C -0.42 2.5 -2.5 0.42 -9.2 0 C -2.5 -0.42 -0.42 -2.5 0 -9.2 Z"
            fill="#FBF0E6"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
