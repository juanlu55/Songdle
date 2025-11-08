# Cambios: Integración de Base de Datos Los 40

## Resumen
Se ha adaptado el proyecto Songdle para usar la base de datos real de canciones de Los 40 (1990-2025) en lugar de la base de datos de prueba.

## Cambios Realizados

### 1. Script de Conversión
**Archivo creado:** `scripts/convert-los40-csv.js`

Este script procesa el archivo CSV `los40_songs_1990_2025 - los40_songs_1990_2025.csv` y genera el archivo TypeScript con los datos de canciones.

**Funcionalidades:**
- Parsea el CSV manualmente para manejar campos con comas y comillas
- Mapea los campos del CSV a la estructura de datos del proyecto:
  - `songTitle` → `title`
  - `artistName` → `artist`
  - `Género` → `genre` (limpia emojis)
  - `Década` → `decade` (convierte "Los 90" a "1990s", etc.)
  - `País` → `country`
  - `Idioma` → `language`
  - `Voz` → `voices` (normaliza: "Masculinas" → "Masculino", etc.)
  - `mediaUrl` o `youtubeUrl` → `audioUrl`
  - `coverImageUrl` → `imageUrl`
  - `id` → `id`
- Genera estadísticas sobre géneros, décadas y países
- Implementa rotación automática de canción del día basada en el día del año

### 2. Archivo de Datos Generado
**Archivo actualizado:** `src/app/data/songs.ts`

**Estadísticas:**
- **Total de canciones:** 1,437 canciones
- **Canciones omitidas:** 1,488 (sin título o artista completo)

**Distribución por Género:**
- Pop: 918 canciones
- Reggaetón / Música Latina: 127
- Rock: 124
- Indie / Alternativo: 120
- Electrónica / EDM: 104
- Hip-Hop / Rap: 34
- Otros: 10

**Distribución por Década:**
- 2020s: 928 canciones
- 1990s: 509 canciones

**Distribución por País:**
- España: 474 canciones
- Estados Unidos: 291
- Reino Unido: 160
- Colombia: 39
- Italia: 32
- Canadá: 32
- Otros: 409

### 3. Canción del Día
La canción del día ahora cambia automáticamente cada día usando un algoritmo basado en el día del año:
```typescript
const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 0);
const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
const songIndex = dayOfYear % songs.length;
```

Esto significa que:
- Cada día del año tiene una canción diferente
- La canción es la misma para todos los usuarios en el mismo día
- El ciclo se repite cada año (365 canciones diferentes)

## Cómo Regenerar los Datos

Si necesitas actualizar la base de datos con un CSV nuevo:

```bash
# 1. Coloca el nuevo CSV en la raíz del proyecto
# 2. Actualiza la ruta en el script si es necesario
# 3. Ejecuta el script
node scripts/convert-los40-csv.js

# 4. Verifica que no haya errores de compilación
npm run build

# 5. Inicia el servidor de desarrollo
npm run dev
```

## Notas Importantes

### URLs de Audio
Las URLs de audio apuntan a los servidores de Prisa Radio (`recursosweb.prisaradio.com`):
- Formato: `https://recursosweb.prisaradio.com/audios/dest/[ID].mp4`
- **Advertencia:** Estas URLs pueden tener restricciones de CORS o requerir autenticación
- **Solución:** Si no funcionan, considera:
  1. Implementar un proxy en el backend
  2. Usar un servicio de streaming alternativo
  3. Descargar y alojar los archivos localmente (respetando derechos de autor)

### URLs de Imágenes
Las carátulas de álbumes también están alojadas en Prisa Radio:
- Formato: `https://recursosweb.prisaradio.com/fotos/dest/[ID].jpg`
- Pueden tener las mismas restricciones que el audio

### Campos del CSV Original
El CSV original contiene 39 campos, de los cuales se utilizan:
- `id`: ID único de la canción
- `songTitle`: Título de la canción
- `artistName`: Nombre del artista
- `Género`: Género musical (con emoji)
- `Década`: Década (formato "Los 90", "Los 00", etc.)
- `País`: País de origen
- `Idioma`: Idioma de la canción
- `Voz`: Tipo de voces (Masculinas/Femeninas/Mixto)
- `mediaUrl`: URL del archivo de audio MP4
- `youtubeUrl`: URL alternativa (YouTube)
- `coverImageUrl`: URL de la carátula

### Canciones Omitidas
Se omitieron 1,488 canciones (51% del total) porque:
- No tenían título o artista completo
- Campos vacíos en el CSV
- Errores en el parsing de líneas complejas

Para mejorar esto, podrías:
1. Revisar el CSV manualmente para corregir errores
2. Mejorar el parser para manejar casos especiales
3. Implementar validación más flexible

## Próximos Pasos

1. **Probar el Audio:**
   - Verifica si las URLs de audio funcionan en el navegador
   - Implementa manejo de errores para URLs que no funcionan
   - Considera usar YouTube como fuente alternativa

2. **Mejorar la Base de Datos:**
   - Revisar y corregir las canciones omitidas
   - Validar que todos los datos sean correctos
   - Añadir más metadatos si están disponibles

3. **Optimización:**
   - El archivo `songs.ts` es grande (18,000+ líneas)
   - Considera usar un archivo JSON separado
   - Implementa lazy loading si es necesario

4. **Testing:**
   - Prueba con diferentes canciones del día
   - Verifica que las pistas (género, década, país, etc.) funcionen correctamente
   - Prueba el autocompletado con los nombres reales de canciones

## Estructura del Proyecto

```
SinSorpresas/
├── scripts/
│   └── convert-los40-csv.js          # Script de conversión
├── src/
│   └── app/
│       ├── data/
│       │   └── songs.ts               # Base de datos generada (1,437 canciones)
│       └── page.tsx                   # Componente principal (sin cambios)
├── los40_songs_1990_2025 - los40_songs_1990_2025.csv  # CSV original
└── CAMBIOS_LOS40.md                   # Este archivo
```

## Contacto

Si tienes preguntas o encuentras problemas, revisa:
1. Los logs de compilación: `npm run build`
2. Los logs del servidor: `npm run dev`
3. La consola del navegador para errores de CORS o red

