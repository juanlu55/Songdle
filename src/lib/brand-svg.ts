/**
 * Símbolo de Songdle como SVG en texto, para iconos, imágenes OG y el canvas de compartir.
 * La versión React vive en src/app/components/Brand.tsx: si cambias la geometría, cambia ambas.
 */

export const BRAND = {
  papel: "#f5f1e8",
  tinta: "#141210",
  rec: "#ff5a4e",
  acierto: "#a8e6cf",
  oro: "#ffd23f",
  polvo: "#d9d3c7",
  blanco: "#fffdf8",
  surco: "#2c2925",
} as const;

/** El sexto de la marca, de las 12 a las 2 */
export const BRAND_WEDGE_PATH = "M50 50 L50 2 A48 48 0 0 1 91.57 26 Z";

/** Disco en un viewBox 0 0 100 100. `simple` quita surcos (para ≤ 32 px). */
export function discMarkup({ simple = false }: { simple?: boolean } = {}) {
  const grooves = simple
    ? ""
    : `<circle cx="50" cy="50" r="40" fill="none" stroke="${BRAND.surco}" stroke-width="1.6"/>` +
      `<circle cx="50" cy="50" r="32" fill="none" stroke="${BRAND.surco}" stroke-width="1.6"/>`;
  const hole = simple ? "" : `<circle cx="50" cy="50" r="3.2" fill="${BRAND.tinta}"/>`;
  return (
    `<circle cx="50" cy="50" r="48" fill="${BRAND.tinta}"/>` +
    grooves +
    `<path d="${BRAND_WEDGE_PATH}" fill="${BRAND.rec}"/>` +
    `<circle cx="50" cy="50" r="${simple ? 15 : 13}" fill="${BRAND.papel}"/>` +
    hole
  );
}

/**
 * Icono cuadrado: fondo papel y disco centrado.
 * `scale` es la fracción del lado que ocupa el disco (0.62 deja margen para iconos "maskable").
 */
export function appIconSvg({
  size,
  scale = 0.72,
  simple = false,
  radius = 0,
}: {
  size: number;
  scale?: number;
  simple?: boolean;
  radius?: number;
}) {
  const d = 100 * scale;
  const o = (100 - d) / 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" rx="${radius}" fill="${BRAND.papel}"/>` +
    `<g transform="translate(${o} ${o}) scale(${scale})">${discMarkup({ simple })}</g>` +
    `</svg>`
  );
}

/** Disco solo, sin fondo */
export function discSvg({ size, simple = false }: { size: number; simple?: boolean }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">${discMarkup({ simple })}</svg>`;
}

export function svgDataUri(svg: string) {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
