// Corrige géneros con tildes perdidas y décadas mal etiquetadas en src/app/data/songs.ts.
// La década se deriva del año de "numberOneDate". No cambia el orden de las canciones.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../src/app/data/songs.ts", import.meta.url);
const GENRES = {
  "Reggaetn / Msica Latina": "Reggaetón / Música Latina",
  "Electrnica / EDM": "Electrónica / EDM",
  "Clsica": "Clásica",
  "Cargando": "Pop", // "Licencia para bailar" - La Década Prodigiosa
};

let src = readFileSync(FILE, "utf8");
let genreFixes = 0;
let decadeFixes = 0;

// Cada objeto de canción es un bloque { ... } sin llaves anidadas.
src = src.replace(/\{[^{}]*"id": "[^"]*"[^{}]*\}/g, (block) => {
  block = block.replace(/"genre": "([^"]*)"/, (m, g) => {
    if (!(g in GENRES)) return m;
    genreFixes++;
    return `"genre": "${GENRES[g]}"`;
  });
  const year = block.match(/"numberOneDate": "[^"]*?((?:19|20)\d\d)"/)?.[1];
  if (year) {
    const decade = `${year.slice(0, 3)}0s`;
    block = block.replace(/"decade": "([^"]*)"/, (m, d) => {
      if (d === decade) return m;
      decadeFixes++;
      return `"decade": "${decade}"`;
    });
  }
  return block;
});

writeFileSync(FILE, src);
console.log({ genreFixes, decadeFixes });
