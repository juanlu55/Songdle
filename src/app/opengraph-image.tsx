import { ImageResponse } from "next/og";
import { BRAND, discSvg, svgDataUri } from "@/lib/brand-svg";

export const runtime = "edge";

export const alt = "Songdle - Adivina la canción del día";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const archivo = await fetch(
    new URL("../assets/fonts/Archivo-ExpandedBlack.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const disc = svgDataUri(discSvg({ size: 600 }));
  const smallDisc = svgDataUri(discSvg({ size: 120 }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: BRAND.papel,
          fontFamily: "Archivo",
          color: BRAND.tinta,
          overflow: "hidden",
        }}
      >
        {/* El disco grande, saliendo por la derecha */}
        <img
          src={disc}
          width={540}
          height={540}
          alt=""
          style={{ position: "absolute", right: -120, top: 45 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 72px 64px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Logotipo: S◉NGDLE */}
            <div style={{ display: "flex", alignItems: "center", fontSize: 104, lineHeight: 1, letterSpacing: -1 }}>
              <span>S</span>
              <img src={smallDisc} width={78} height={78} alt="" style={{ margin: "0 4px" }} />
              <span>NGDLE</span>
            </div>
            <div style={{ display: "flex", marginTop: 36, fontSize: 50, lineHeight: 1.08, maxWidth: 620 }}>
              Adivina la canción del día
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, fontSize: 22, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: BRAND.tinta,
                color: BRAND.papel,
                padding: "10px 18px",
              }}
            >
              songdle.es
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: BRAND.blanco,
                border: `4px solid ${BRAND.tinta}`,
                padding: "6px 14px",
              }}
            >
              Números 1 de Los 40 · 6 intentos
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Archivo", data: archivo, weight: 900, style: "normal" }],
    }
  );
}
