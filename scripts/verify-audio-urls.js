const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Leer el archivo de canciones actual
const songsPath = path.join(__dirname, '../src/app/data/songs.ts');
const content = fs.readFileSync(songsPath, 'utf-8');

// Extraer las canciones
const match = content.match(/export const songs: Song\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('❌ No se pudo extraer las canciones');
  process.exit(1);
}

const songs = JSON.parse(match[1]);
console.log(`📊 Total de canciones a verificar: ${songs.length}\n`);

// Función para verificar si una URL funciona
function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      // Considerar exitoso si es 200 o 302 (redirect)
      resolve(res.statusCode === 200 || res.statusCode === 302);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Verificar todas las canciones
async function verifyAllSongs() {
  let working = 0;
  let notWorking = 0;
  let checked = 0;

  console.log('🔍 Verificando URLs de audio...\n');
  console.log('Progreso:');

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const isWorking = await checkUrl(song.audioUrl);
    
    song.audioWorking = isWorking;
    
    if (isWorking) {
      working++;
    } else {
      notWorking++;
    }
    
    checked++;
    
    // Mostrar progreso cada 50 canciones
    if (checked % 50 === 0 || checked === songs.length) {
      const percentage = ((checked / songs.length) * 100).toFixed(1);
      console.log(`  ${checked}/${songs.length} (${percentage}%) - ✓ ${working} funcionan | ✗ ${notWorking} no funcionan`);
    }
  }

  console.log('\n✅ Verificación completada!\n');
  console.log('📊 RESULTADOS FINALES:');
  console.log(`  ✓ Funcionan: ${working} (${((working/songs.length)*100).toFixed(1)}%)`);
  console.log(`  ✗ No funcionan: ${notWorking} (${((notWorking/songs.length)*100).toFixed(1)}%)`);

  return songs;
}

// Ejecutar verificación
verifyAllSongs().then(verifiedSongs => {
  console.log('\n💾 Guardando resultados...\n');
  
  // Guardar un archivo temporal con los resultados
  const resultsPath = path.join(__dirname, 'audio-verification-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    totalSongs: verifiedSongs.length,
    workingSongs: verifiedSongs.filter(s => s.audioWorking).length,
    notWorkingSongs: verifiedSongs.filter(s => !s.audioWorking).length,
    verifiedAt: new Date().toISOString(),
    songs: verifiedSongs
  }, null, 2));
  
  console.log(`✅ Resultados guardados en: ${resultsPath}`);
  console.log('\n📋 Ejemplos de canciones que funcionan:\n');
  
  const workingSamples = verifiedSongs.filter(s => s.audioWorking).slice(0, 5);
  workingSamples.forEach((song, i) => {
    console.log(`${i+1}. ${song.title} - ${song.artist}`);
    console.log(`   URL: ${song.audioUrl.substring(0, 60)}...`);
  });
  
  console.log('\n❌ Ejemplos de canciones que NO funcionan:\n');
  
  const notWorkingSamples = verifiedSongs.filter(s => !s.audioWorking).slice(0, 5);
  notWorkingSamples.forEach((song, i) => {
    console.log(`${i+1}. ${song.title} - ${song.artist}`);
    console.log(`   URL: ${song.audioUrl.substring(0, 60)}...`);
  });
  
  console.log('\n✨ Siguiente paso: Ejecuta "node scripts/update-songs-with-audio-status.js" para actualizar songs.ts');
}).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

