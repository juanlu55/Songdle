const fs = require('fs');
const path = require('path');

// Leer resultados de verificación
const resultsPath = path.join(__dirname, 'audio-verification-results.json');
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));

console.log('📊 Resultados de verificación cargados:\n');
console.log(`Total: ${results.totalSongs}`);
console.log(`✓ Funcionan: ${results.workingSongs}`);
console.log(`✗ No funcionan: ${results.notWorkingSongs}`);
console.log(`\n🔄 Regenerando songs.ts con priorización...\n`);

// Separar canciones por estado de audio Y datos premium
const workingSongs = results.songs.filter(s => s.audioWorking);
const notWorkingSongs = results.songs.filter(s => !s.audioWorking);

// De las que funcionan, separar premium y regulares
const workingPremium = workingSongs.filter(s => s.spotifyUrl && s.numberOneDate);
const workingRegular = workingSongs.filter(s => !s.spotifyUrl || !s.numberOneDate);

// De las que NO funcionan, también separar
const notWorkingPremium = notWorkingSongs.filter(s => s.spotifyUrl && s.numberOneDate);
const notWorkingRegular = notWorkingSongs.filter(s => !s.spotifyUrl || !s.numberOneDate);

console.log('📊 DISTRIBUCIÓN DETALLADA:\n');
console.log('Con audio FUNCIONAL:');
console.log(`  🎵 Premium: ${workingPremium.length} (Spotify + fecha + audio ✓)`);
console.log(`  📀 Regular: ${workingRegular.length} (audio ✓)`);
console.log(`  Total: ${workingSongs.length}\n`);

console.log('Con audio NO FUNCIONAL:');
console.log(`  🎵 Premium: ${notWorkingPremium.length} (Spotify + fecha, pero audio ✗)`);
console.log(`  📀 Regular: ${notWorkingRegular.length} (audio ✗)`);
console.log(`  Total: ${notWorkingSongs.length}\n`);

// Generar TypeScript
const tsContent = `export interface Song {
  id: string;
  title: string;
  artist: string;
  displayName: string;
  audioUrl: string;
  imageUrl?: string;
  genre: string;        // Género musical
  decade: string;       // Década (ej: "1990s", "2000s")
  country: string;      // País de origen
  language: string;     // Idioma de la canción
  voices: string;       // "Masculino", "Femenino", "Mixto"
  numberOneDate?: string; // Fecha en que fue número 1 (formato legible)
  spotifyUrl?: string;    // URL de Spotify
  bestPosition?: string;  // Mejor posición alcanzada
  audioWorking?: boolean; // Si el audio está disponible
}

// Base de datos completa de canciones de Los 40 (1990-2025)
// Total: ${results.songs.length} canciones
// Con audio funcional: ${workingSongs.length} (${((workingSongs.length/results.songs.length)*100).toFixed(1)}%)
export const songs: Song[] = ${JSON.stringify(results.songs, null, 2)};

// ========================================
// CANCIONES CON AUDIO FUNCIONAL
// ========================================

// Canciones premium CON audio funcional: ${workingPremium.length}
// (Spotify + fecha de #1 + audio disponible)
const workingPremiumSongs: Song[] = ${JSON.stringify(workingPremium, null, 2)};

// Canciones regulares CON audio funcional: ${workingRegular.length}
// (Audio disponible, pero sin Spotify o sin fecha)
const workingRegularSongs: Song[] = ${JSON.stringify(workingRegular, null, 2)};

// ========================================
// SISTEMA DE SELECCIÓN DE CANCIÓN DEL DÍA
// ========================================
// Algoritmo determinista con triple priorización:
// 1. Primeros ${workingPremium.length} días: Canciones PREMIUM con audio ✓
// 2. Siguientes ${workingRegular.length} días: Canciones REGULARES con audio ✓
// 3. Resto: Canciones sin audio funcional (fallback)
//
// Esto garantiza que la mayoría del tiempo los usuarios escuchen audio real

const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 0);
const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

let todaySong: Song;

if (dayOfYear < workingPremiumSongs.length) {
  // Fase 1: Canciones premium con audio
  todaySong = workingPremiumSongs[dayOfYear];
} else if (dayOfYear < (workingPremiumSongs.length + workingRegularSongs.length)) {
  // Fase 2: Canciones regulares con audio
  const regularIndex = dayOfYear - workingPremiumSongs.length;
  todaySong = workingRegularSongs[regularIndex];
} else {
  // Fase 3: Fallback para días restantes del año
  const fallbackIndex = (dayOfYear - workingPremiumSongs.length - workingRegularSongs.length) % ${notWorkingSongs.length};
  const fallbackSongs = ${JSON.stringify(notWorkingSongs, null, 2)};
  todaySong = fallbackSongs[fallbackIndex];
}

export { todaySong };

// Estadísticas del sistema:
// - Días 1-${workingPremium.length}: Premium con audio ✓ (${((workingPremium.length/365)*100).toFixed(1)}% del año)
// - Días ${workingPremium.length + 1}-${workingPremium.length + workingRegular.length}: Regular con audio ✓ (${((workingRegular.length/365)*100).toFixed(1)}% del año)
// - Resto: Fallback sin audio (${(((365-workingPremium.length-workingRegular.length)/365)*100).toFixed(1)}% del año)
`;

// Guardar archivo
const outputPath = path.join(__dirname, '../src/app/data/songs.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`✅ Archivo actualizado: ${outputPath}\n`);
console.log('📅 CALENDARIO ANUAL:\n');

const phase1Days = workingPremium.length;
const phase2Days = workingRegular.length;
const phase3Days = Math.max(0, 365 - phase1Days - phase2Days);

console.log(`  Días 1-${phase1Days}:`);
console.log(`    🎵 Premium con audio funcional`);
console.log(`    ${((phase1Days/365)*100).toFixed(1)}% del año\n`);

console.log(`  Días ${phase1Days + 1}-${phase1Days + phase2Days}:`);
console.log(`    📀 Regular con audio funcional`);
console.log(`    ${((phase2Days/365)*100).toFixed(1)}% del año\n`);

if (phase3Days > 0) {
  console.log(`  Días ${phase1Days + phase2Days + 1}-365:`);
  console.log(`    ⚠️  Fallback (sin audio)`);
  console.log(`    ${((phase3Days/365)*100).toFixed(1)}% del año\n`);
}

console.log('✨ ¡Listo! El servidor detectará los cambios automáticamente.');
console.log('🎵 Ahora la mayoría de días tendrán audio funcional.');

