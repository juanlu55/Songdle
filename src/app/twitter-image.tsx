import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Songdle - Adivina la canción del día";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          padding: "60px",
        }}
      >
        {/* Main Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            border: "8px solid #000000",
            boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
            padding: "60px",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "6px solid #000000",
                boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                padding: "15px 30px",
                display: "flex",
              }}
            >
              <span
                style={{
                  fontSize: "80px",
                  fontWeight: 900,
                  color: "#000000",
                  letterSpacing: "-2px",
                }}
              >
                SONGDLE
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#000000",
              }}
            />
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "rgba(0,0,0,0.6)",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              El Wordle de canciones en español
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "36px",
              fontWeight: 600,
              color: "#000000",
              margin: "0 0 20px 0",
              lineHeight: 1.4,
            }}
          >
            Escucha un fragmento y adivina la canción en 6 intentos.
          </p>
          <p
            style={{
              fontSize: "28px",
              fontWeight: 500,
              color: "rgba(0,0,0,0.7)",
              margin: 0,
            }}
          >
            🎵 Juego diario gratuito con éxitos de Los 40 Principales
          </p>

          {/* Bottom bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "50px",
              paddingTop: "30px",
              borderTop: "4px solid #000000",
            }}
          >
            {/* Audio bars */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <div
                style={{
                  width: "24px",
                  height: "50px",
                  backgroundColor: "#a8e6cf",
                  border: "3px solid #000000",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "70px",
                  backgroundColor: "#a8e6cf",
                  border: "3px solid #000000",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "55px",
                  backgroundColor: "#ff6b6b",
                  border: "3px solid #000000",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "80px",
                  backgroundColor: "#a8e6cf",
                  border: "3px solid #000000",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "45px",
                  backgroundColor: "#a8e6cf",
                  border: "3px solid #000000",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "65px",
                  backgroundColor: "#ff6b6b",
                  border: "3px solid #000000",
                }}
              />
            </div>

            {/* URL */}
            <div
              style={{
                backgroundColor: "#000000",
                padding: "15px 30px",
                display: "flex",
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                songdle.es
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

