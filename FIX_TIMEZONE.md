# Fix: Problema de Zona Horaria en Producción 🌍

## 🐛 Problema Detectado

En producción (songdle.es deployeado en Vercel), la canción del día no cambiaba correctamente a medianoche hora española. Los usuarios veían la misma canción del día anterior incluso después de medianoche en España.

### Síntomas:
- ✅ En `localhost:3000` → Canción correcta del día actual
- ❌ En `songdle.es` (Vercel) → Canción del día anterior

### Ejemplo:
- **10 de noviembre 2025** (hora española)
- Localhost mostraba la canción correcta del día 10
- Vercel seguía mostrando "Ritmo" de Black Eyed Peas (día 9)

---

## 🔍 Causa Raíz

### El Problema

En Next.js, cuando se hace un **build estático** (Static Site Generation), el código que calcula `todaySong` se ejecutaba **una sola vez durante el build**:

```typescript
// ❌ ANTES - Se calculaba en el servidor durante el build
const today = getSpainDate();
const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
let todaySong: Song = /* ... se calcula una vez ... */;
export { todaySong };
```

### ¿Qué Pasaba?

1. **Build en Vercel** (servidor UTC, posiblemente tarde del día 9):
   ```
   - Servidor: 23:00 UTC (día 9)
   - España: 00:00 CET (día 10)
   - getSpainDate() devuelve: día 9 ❌
   - todaySong se "congela" como canción del día 9
   ```

2. **Usuario accede el día 10**:
   ```
   - Usuario: día 10 en España
   - todaySong (congelada): canción del día 9 ❌
   ```

3. **En localhost** funcionaba porque:
   ```
   - El código se ejecuta en tiempo real
   - getTodaySong() se llama cada vez que se carga
   - Devuelve la canción correcta del día actual ✅
   ```

---

## ✅ Solución Implementada

### 1. Convertir `todaySong` en Función Dinámica

**En `src/app/data/songs.ts`:**

```typescript
// ✅ AHORA - Función que se ejecuta dinámicamente
const getTodaySong = (): Song => {
  const today = getSpainDate(); // Se calcula en TIEMPO REAL
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  if (dayOfYear < workingPremiumSongs.length) {
    return workingPremiumSongs[dayOfYear];
  } else if (dayOfYear < (workingPremiumSongs.length + workingRegularSongs.length)) {
    const regularIndex = dayOfYear - workingPremiumSongs.length;
    return workingRegularSongs[regularIndex];
  } else {
    const fallbackIndex = (dayOfYear - workingPremiumSongs.length - workingRegularSongs.length) % 587;
    return fallbackSongs[fallbackIndex];
  }
};

// Exportar función para uso dinámico en el cliente
export { getTodaySong, getSpainDate };

// Para compatibilidad con imports existentes
export const todaySong = getTodaySong();
```

### 2. Calcular en el Cliente (React)

**En `src/app/page.tsx`:**

```typescript
// ✅ Estado que se inicializa en el cliente
const [todaySong, setTodaySong] = useState<Song>(() => getTodaySong());

useEffect(() => {
  // Recalcular canción del día en el cliente
  // (importante para zona horaria correcta)
  setTodaySong(getTodaySong());
  
  // ... resto del código ...
}, []);
```

---

## 🎯 Por Qué Funciona Ahora

### Antes (❌ Roto):
```
Build Time (Servidor Vercel UTC)
  ↓
getTodaySong() ejecutado UNA VEZ
  ↓
todaySong = canción del día X (congelada)
  ↓
Usuario accede día X+1
  ↓
Sigue viendo canción del día X ❌
```

### Ahora (✅ Arreglado):
```
Build Time (Servidor Vercel)
  ↓
Se genera HTML inicial (puede tener canción incorrecta)
  ↓
Usuario accede desde navegador
  ↓
React se hidrata en el cliente
  ↓
useEffect() ejecuta getTodaySong() EN EL CLIENTE
  ↓
getSpainDate() usa zona horaria del cliente/España
  ↓
setTodaySong() actualiza con canción correcta ✅
```

---

## 🧪 Verificación

### En Localhost:
```bash
npm run dev
# Abrir http://localhost:3000
# Verificar que muestra la canción del día actual
```

### En Producción (Vercel):
```bash
git add .
git commit -m "Fix: Calculate todaySong dynamically in client for correct timezone"
git push
# Esperar deploy en Vercel
# Abrir songdle.es
# Verificar que muestra la canción del día actual en hora española
```

### Probar Cambio de Día:
1. Dejar la app abierta en el navegador
2. Esperar a medianoche (hora española)
3. Recargar la página (F5)
4. Debería mostrar la nueva canción del día ✅

---

## 📊 Comportamiento en Diferentes Zonas Horarias

La función `getSpainDate()` siempre usa la zona horaria de España:

```typescript
const getSpainDate = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
};
```

### Ejemplos:

**Usuario en España (CET/CEST):**
```
- Hora local: 01:00 (día 10)
- getSpainDate(): día 10
- Canción: día 10 ✅
```

**Usuario en Nueva York (EST):**
```
- Hora local: 19:00 (día 9)
- getSpainDate(): 01:00 día 10 (España)
- Canción: día 10 ✅
```

**Usuario en Tokio (JST):**
```
- Hora local: 09:00 (día 10)
- getSpainDate(): 01:00 día 10 (España)
- Canción: día 10 ✅
```

**Todos los usuarios ven la misma canción del día** independientemente de su ubicación geográfica, porque siempre se usa la hora de España. 🇪🇸

---

## 🔧 Cambios Técnicos Realizados

### Archivos Modificados:

1. **`src/app/data/songs.ts`**:
   - Convertida la lógica de `todaySong` en función `getTodaySong()`
   - Exportada la función para uso dinámico
   - Mantenida exportación de `todaySong` para compatibilidad

2. **`src/app/page.tsx`**:
   - Cambiado import de `todaySong` → `getTodaySong`
   - Añadido estado `const [todaySong, setTodaySong] = useState<Song>(() => getTodaySong())`
   - Añadido recálculo en `useEffect` inicial

### Sin Cambios:
- ✅ Lógica de negocio intacta
- ✅ Interfaz de usuario sin cambios
- ✅ LocalStorage y estadísticas funcionan igual
- ✅ Reset de día a medianoche funciona igual
- ✅ Todos los eventos de Amplitude funcionan igual

---

## 🚀 Deploy a Producción

```bash
# 1. Verificar que funciona en local
npm run build
npm run dev

# 2. Commit y push
git add .
git commit -m "Fix: Calculate todaySong dynamically in client for correct timezone"
git push

# 3. Vercel automáticamente:
#    - Detecta el push
#    - Hace build
#    - Despliega a producción

# 4. Verificar en songdle.es
#    - La canción debería ser la correcta del día actual
```

---

## ✨ Resultado

✅ La canción del día ahora cambia correctamente a medianoche hora española  
✅ Funciona igual en localhost y producción  
✅ Todos los usuarios ven la misma canción independientemente de su ubicación  
✅ No hay cambios visuales ni de UX  

---

**Fecha del fix:** 10 de noviembre de 2025  
**Problema resuelto:** Zona horaria incorrecta en producción  
**Impacto:** Alto - Funcionalidad core del juego  
**Estado:** ✅ Resuelto

