/**
 * Genera los iconos estáticos de la marca a partir de src/lib/brand-svg.ts.
 * Uso: npx --yes tsx scripts/generate-brand-icons.ts
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { appIconSvg } from "../src/lib/brand-svg";

const root = path.resolve(__dirname, "..");

async function png(svg: string) {
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/** ICO con PNG embebidos (soportado por todos los navegadores actuales) */
function ico(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function main() {
  const out = (p: string) => path.join(root, p);

  // PWA: "maskable" necesita el contenido dentro del 80 % central
  writeFileSync(out("public/icon-192.png"), await png(appIconSvg({ size: 192, scale: 0.62 })));
  writeFileSync(out("public/icon-512.png"), await png(appIconSvg({ size: 512, scale: 0.62 })));
  writeFileSync(out("public/apple-touch-icon.png"), await png(appIconSvg({ size: 180, scale: 0.72 })));
  writeFileSync(out("public/icon.svg"), appIconSvg({ size: 512, scale: 0.72, radius: 0 }));

  const f16 = await png(appIconSvg({ size: 16, scale: 0.94, simple: true, radius: 18 }));
  const f32 = await png(appIconSvg({ size: 32, scale: 0.9, simple: true, radius: 18 }));
  const f48 = await png(appIconSvg({ size: 48, scale: 0.88, simple: true, radius: 18 }));
  writeFileSync(
    out("src/app/favicon.ico"),
    ico([
      { size: 16, data: f16 },
      { size: 32, data: f32 },
      { size: 48, data: f48 },
    ])
  );

  console.log("Iconos generados.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
