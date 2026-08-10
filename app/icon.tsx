import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Knockout mark: copper tile, white sparkle cutout. */
export default function Icon() {
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
          borderRadius: 96,
        }}
      >
        <svg
          width="280"
          height="280"
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
