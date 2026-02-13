import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f1e8",
          borderRadius: "22px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "150px",
            height: "150px",
            backgroundColor: "#ffffff",
            border: "6px solid #000000",
            boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
          }}
        >
          <span
            style={{
              fontSize: "90px",
              fontWeight: 900,
              color: "#000000",
            }}
          >
            S
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

