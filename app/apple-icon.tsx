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
          background: "#D61C0D",
        }}
      >
        <svg
          width="100"
          height="100"
          viewBox="-14 -14 28 28"
          style={{ display: "block" }}
        >
          <path
            d="M0 -9.2 L 2.1 -2.1 L 9.2 0 L 2.1 2.1 L 0 9.2 L -2.1 2.1 L -9.2 0 L -2.1 -2.1 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
