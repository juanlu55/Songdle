import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

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
          backgroundColor: "#f5f1e8",
          border: "2px solid #000000",
        }}
      >
        <span
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "#000000",
          }}
        >
          S
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}

