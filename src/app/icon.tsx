import { ImageResponse } from "next/og";
import { appIconSvg, svgDataUri } from "@/lib/brand-svg";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <img
        src={svgDataUri(appIconSvg({ size: 32, scale: 0.9, simple: true, radius: 18 }))}
        width={32}
        height={32}
        alt=""
      />
    ),
    { ...size }
  );
}
