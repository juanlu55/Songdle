const fs = require('fs');
const path = require('path');

// Leer el archivo CSV
const csvPath = path.join(__dirname, '../los40_songs_1990_2025 - los40_songs_1990_2025.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parsear CSV manualmente (simple parser)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

// Procesar líneas del CSV
const lines = csvContent.split('\n');
const headers = parseCSVLine(lines[0]);

console.log('Headers encontrados:', headers);

// Encontrar índices de las columnas que necesitamos
const songTitleIdx = headers.indexOf('songTitle');
const artistNameIdx = headers.indexOf('artistName');
const genreIdx = headers.indexOf('Género');
const decadeIdx = headers.indexOf('Década');
const countryIdx = headers.indexOf('País');
const languageIdx = headers.indexOf('Idioma');
// Buscar "Voz" con cualquier caracter al final
const voicesIdx = headers.findIndex(h => h.startsWith('Voz'));
const mediaUrlIdx = headers.indexOf('mediaUrl');
const youtubeUrlIdx = headers.indexOf('youtubeUrl');
const coverImageIdx = headers.indexOf('coverImageUrl');
const idIdx = headers.indexOf('id');
const dateIdx = headers.indexOf('date');
const spotifyUrlIdx = headers.indexOf('spotifyUrl');
const bestPositionIdx = headers.indexOf('bestPosition');

console.log(`\nÍndices encontrados:
- songTitle: ${songTitleIdx}
- artistName: ${artistNameIdx}
- Género: ${genreIdx}
- Década: ${decadeIdx}
- País: ${countryIdx}
- Idioma: ${languageIdx}
- Voz: ${voicesIdx}
- mediaUrl: ${mediaUrlIdx}
- youtubeUrl: ${youtubeUrlIdx}
- coverImageUrl: ${coverImageIdx}
- id: ${idIdx}
- date: ${dateIdx}
- spotifyUrl: ${spotifyUrlIdx}
- bestPosition: ${bestPositionIdx}
`);

// Función para limpiar géneros (quitar emojis)
function cleanGenre(genre) {
  if (!genre) return 'Desconocido';
  return genre.replace(/[^\w\s\/\-]/gi, '').trim();
}

// Función para normalizar década
function normalizeDecade(decade) {
  if (!decade) return 'Desconocido';
  // "Los 90" -> "1990s", "Los 00" -> "2000s", "Los 20" -> "2020s"
  const match = decade.match(/\d{2}/);
  if (match) {
    const year = parseInt(match[0]);
    // Si es >= 90, es 1900s, si es < 30, es 2000s
    if (year >= 90) {
      return `19${year}s`;
    } else {
      return `20${year.toString().padStart(2, '0')}s`;
    }
  }
  return decade;
}

// Función para normalizar voces
function normalizeVoices(voices) {
  if (!voices) return 'Desconocido';
  if (voices === 'Masculinas') return 'Masculino';
  if (voices === 'Femeninas') return 'Femenino';
  if (voices === 'Mixto') return 'Mixto';
  return voices;
}

// Procesar canciones
const songs = [];
let skipped = 0;

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  
  const fields = parseCSVLine(lines[i]);
  
  const songTitle = fields[songTitleIdx];
  const artistName = fields[artistNameIdx];
  const genre = cleanGenre(fields[genreIdx]);
  const decade = normalizeDecade(fields[decadeIdx]);
  const country = fields[countryIdx];
  const language = fields[languageIdx];
  // Limpiar caracteres especiales de voces
  const rawVoices = fields[voicesIdx] ? fields[voicesIdx].replace(/[\r\n]/g, '').trim() : '';
  const voices = normalizeVoices(rawVoices);
  const mediaUrl = fields[mediaUrlIdx];
  const youtubeUrl = fields[youtubeUrlIdx];
  const coverImage = fields[coverImageIdx];
  const id = fields[idIdx];
  const date = fields[dateIdx];
  const spotifyUrl = fields[spotifyUrlIdx];
  const bestPosition = fields[bestPositionIdx];
  
  // Verificar que tenga los campos esenciales
  if (!songTitle || !artistName) {
    skipped++;
    continue;
  }
  
  // Formatear fecha si existe
  let formattedDate = '';
  if (date) {
    try {
      const dateObj = new Date(date);
      formattedDate = dateObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (e) {
      formattedDate = '';
    }
  }
  
  songs.push({
    id: id || `song-${i}`,
    title: songTitle,
    artist: artistName,
    genre,
    decade,
    country: country || 'Desconocido',
    language: language || 'Desconocido',
    voices,
    audioUrl: mediaUrl || youtubeUrl || '',
    imageUrl: coverImage || '',
    displayName: `${songTitle} - ${artistName}`,
    numberOneDate: formattedDate,
    spotifyUrl: spotifyUrl || '',
    bestPosition: bestPosition || ''
  });
}

console.log(`\nCanciones procesadas: ${songs.length}`);
console.log(`Canciones omitidas: ${skipped}`);

// Generar el archivo TypeScript
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
}

// Base de datos de canciones de Los 40 (1990-2025)
// Total: ${songs.length} canciones
export const songs: Song[] = ${JSON.stringify(songs, null, 2)};

// La canción del día (cambia cada día)
// Puedes usar Date para seleccionar una canción diferente cada día
const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 0);
const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
const songIndex = dayOfYear % songs.length;

export const todaySong: Song = songs[songIndex];
`;

// Guardar el archivo
const outputPath = path.join(__dirname, '../src/app/data/songs.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`\n✅ Archivo generado: ${outputPath}`);
console.log(`📊 Total de canciones: ${songs.length}`);
console.log(`🎵 Canción del día (índice ${songs.length > 0 ? 'dayOfYear % ' + songs.length : '0'}): rotación automática`);

// Mostrar algunas estadísticas
const genreCount = {};
const decadeCount = {};
const countryCount = {};

songs.forEach(song => {
  genreCount[song.genre] = (genreCount[song.genre] || 0) + 1;
  decadeCount[song.decade] = (decadeCount[song.decade] || 0) + 1;
  countryCount[song.country] = (countryCount[song.country] || 0) + 1;
});

console.log('\n📈 Estadísticas:');
console.log('\nGéneros más comunes:');
Object.entries(genreCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([genre, count]) => console.log(`  - ${genre}: ${count}`));

console.log('\nDécadas:');
Object.entries(decadeCount)
  .sort((a, b) => b[1] - a[1])
  .forEach(([decade, count]) => console.log(`  - ${decade}: ${count}`));

console.log('\nPaíses más comunes:');
Object.entries(countryCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([country, count]) => console.log(`  - ${country}: ${count}`));

