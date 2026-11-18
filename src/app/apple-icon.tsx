import { ImageResponse } from "next/og";
import { appIconSvg, svgDataUri } from "@/lib/brand-svg";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <img src={svgDataUri(appIconSvg({ size: 180, scale: 0.72 }))} width={180} height={180} alt="" />
    ),
    { ...size }
  );
}
