# Configuración de Amplitude Analytics 📊

## ✅ Instalación Completada

Ya está instalado el paquete `@amplitude/analytics-browser` y el código está integrado en el proyecto.

---

## 🔑 Paso 1: Obtener API Key de Amplitude

### 1.1 Crear Cuenta (si no tienes)

1. Ve a https://amplitude.com/
2. Click en "Get Started" o "Sign Up"
3. Completa el registro (es gratis)

### 1.2 Crear Proyecto

1. Una vez dentro, click en "Create Project"
2. Nombre: **Songdle** (o el que prefieras)
3. Selecciona tu plan (hay uno gratuito)

### 1.3 Obtener API Key

1. En el dashboard, ve a **Settings** (⚙️)
2. Click en **Projects**
3. Selecciona tu proyecto **Songdle**
4. Copia la **API Key** (formato: `a1b2c3d4e5f6g7h8i9j0...`)

---

## ⚙️ Paso 2: Configurar en tu Proyecto

### 2.1 Crear Archivo .env.local

Crea un archivo llamado `.env.local` en la raíz del proyecto:

```bash
cd /Users/JuanLuis/Documents/SinSorpresas
touch .env.local
```

### 2.2 Añadir API Key

Edita `.env.local` y añade:

```env
NEXT_PUBLIC_AMPLITUDE_API_KEY=tu_api_key_aqui
```

**Reemplaza `tu_api_key_aqui` con tu API key real de Amplitude.**

**Ejemplo:**
```env
NEXT_PUBLIC_AMPLITUDE_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 2.3 Reiniciar Servidor

```bash
# Detén el servidor (Ctrl+C)
# Vuelve a iniciar
npm run dev
```

---

## 📊 Eventos Trackeados

El proyecto ya tiene configurados estos eventos:

### 1. **play_clicked**
```javascript
// Se trackea cuando: Usuario hace click en PLAY
{
  elapsed_time: 5.32,
  action: 'play_audio'
}
```

### 2. **pause_clicked**
```javascript
// Se trackea cuando: Usuario hace click en PAUSE
{
  elapsed_time: 8.45,
  action: 'pause_audio'
}
```

### 3. **song_selected**
```javascript
// Se trackea cuando: Usuario selecciona una canción del dropdown
{
  song_name: 'Another Day in Paradise - Phil Collins',
  from_search: true,
  action: 'select_song'
}
```

### 4. **submit_clicked**
```javascript
// Se trackea cuando: Usuario hace click en ENVIAR
{
  attempt_number: 2,
  elapsed_time: '15.34',
  song_name: 'Blaze of Glory - Jon Bon Jovi',
  action: 'submit_guess'
}
```

### 5. **game_won**
```javascript
// Se trackea cuando: Usuario adivina correctamente
{
  attempts: 3,
  elapsed_time: '18.25',
  song_name: 'In Your Eyes - The Weeknd',
  outcome: 'win'
}
```

### 6. **game_lost**
```javascript
// Se trackea cuando: Usuario agota los 6 intentos
{
  attempts: 6,
  elapsed_time: '25.89',
  correct_song: 'In Your Eyes - The Weeknd',
  outcome: 'lose'
}
```

### 7. **share_clicked**
```javascript
// Se trackea cuando: Usuario hace click en COMPARTIR
{
  attempts: 3,
  won: true,
  share_method: 'clipboard',  // o 'native' en móvil
  action: 'share_results'
}
```

### 8. **tutorial_opened**
```javascript
// Se trackea cuando: Usuario abre el tutorial
{
  action: 'open_tutorial'
}
```

### 9. **stats_opened**
```javascript
// Se trackea cuando: Usuario abre estadísticas
{
  action: 'open_stats'
}
```

### 10. **clue_expanded**
```javascript
// Se trackea cuando: Usuario expande una pista
{
  clue_type: 'genre',  // o 'decade', 'country', 'language', 'voices'
  attempt_number: 2,
  action: 'expand_clue'
}
```

---

## 📈 Ver Datos en Amplitude

### Dashboard Principal

1. Ve a https://analytics.amplitude.com/
2. Selecciona tu proyecto **Songdle**
3. Dashboard muestra:
   - 👥 **Usuarios activos**
   - 📊 **Eventos por día**
   - 📈 **Tasa de retención**
   - 🌍 **Ubicaciones**

### Ver Eventos Específicos

1. En Amplitude, ve a **Events**
2. Verás todos los eventos que trackeas:
   - `play_clicked`
   - `song_selected`
   - `submit_clicked`
   - `game_won`
   - `share_clicked`
   - etc.

### Crear Gráficos Personalizados

1. Click en **Charts**
2. Click en **+ New**
3. Selecciona evento (ej: `game_won`)
4. Agrupa por propiedades (ej: `attempts`)
5. ¡Verás cuántos intentos necesita la gente para ganar!

---

## 🎯 Métricas Útiles para Songdle

### 1. **Tasa de Victoria**
```
Events: game_won / (game_won + game_lost)
```

### 2. **Promedio de Intentos**
```
Event: game_won
Group by: attempts
```

### 3. **Tiempo Promedio de Juego**
```
Event: game_won
Property: elapsed_time
```

### 4. **Canciones Más Difíciles**
```
Event: game_lost
Group by: correct_song
```

### 5. **Método de Compartir Preferido**
```
Event: share_clicked
Group by: share_method
```

### 6. **Pistas Más Consultadas**
```
Event: clue_expanded
Group by: clue_type
```

---

## 🧪 Probar que Funciona

### 1. Configurar API Key

Asegúrate de que `.env.local` está creado con tu API key.

### 2. Reiniciar Servidor

```bash
npm run dev
```

### 3. Verificar en Consola

Abre la consola del navegador (F12). Deberías ver:

```
📊 Amplitude inicializado
```

### 4. Jugar una Partida

1. Click en PLAY → Se trackea `play_clicked`
2. Selecciona una canción → Se trackea `song_selected`
3. Click en ENVIAR → Se trackea `submit_clicked`
4. Gana o pierde → Se trackea `game_won` o `game_lost`
5. Click en COMPARTIR → Se trackea `share_clicked`

### 5. Ver en Amplitude (Tiempo Real)

1. Ve a Amplitude dashboard
2. Click en **User Look-Up** (arriba a la derecha)
3. Verás eventos aparecer en tiempo real

---

## 🐛 Troubleshooting

### No veo el mensaje "Amplitude inicializado"

**Problema:** No está configurada la API key

**Solución:**
1. Verifica que el archivo `.env.local` existe
2. Verifica que la variable se llama `NEXT_PUBLIC_AMPLITUDE_API_KEY`
3. Reinicia el servidor (`npm run dev`)

### No veo eventos en Amplitude

**Problema:** La API key es incorrecta

**Solución:**
1. Ve a Amplitude → Settings → Projects
2. Copia la API key correcta
3. Actualiza `.env.local`
4. Reinicia el servidor

### Los eventos no aparecen inmediatamente

**Normal:** Amplitude puede tardar 1-2 minutos en mostrar eventos

**Solución:**
- Espera un momento y recarga el dashboard
- Usa "User Look-Up" para ver eventos en tiempo casi real

---

## 🔒 Seguridad

### ¿Es seguro exponer la API key?

**Sí**, las API keys de Amplitude para el lado del cliente están diseñadas para ser públicas.

### ¿Debo añadir .env.local al .gitignore?

**Sí**, por buenas prácticas. Añade a `.gitignore`:

```
.env.local
.env*.local
```

Así cada persona/servidor usa su propia configuración.

---

## 📚 Recursos Adicionales

- **Documentación Amplitude:** https://www.docs.developers.amplitude.com/
- **Dashboard Amplitude:** https://analytics.amplitude.com/
- **Guía de Eventos:** https://help.amplitude.com/hc/en-us/articles/229313067

---

## ✨ Próximos Pasos

Una vez configurado, puedes:

1. **Crear funnels** para ver dónde abandonan los usuarios
2. **Configurar cohortes** para segmentar usuarios
3. **Crear dashboards personalizados** con las métricas clave
4. **Configurar alertas** para eventos importantes

---

## 🎉 ¡Listo!

Ya tienes Amplitude completamente integrado en Songdle.

Solo falta:
1. ✅ Obtener tu API key de Amplitude
2. ✅ Crear `.env.local` con la API key
3. ✅ Reiniciar el servidor
4. ✅ ¡Empezar a ver datos!

**¿Necesitas ayuda?** Solo pregunta 🚀

