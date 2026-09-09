# Songdle — especificación de modos Tres pistas y Cinco pistas

Documento de producto. No es implementación. El modo actual (Clásico) no cambia.

Objetivo: mismos rituales que Clásico (una partida al día, racha, historial, share sin spoiler) con dos mecánicas distintas, pensadas también como demos para radio y TV. En público **no** usamos nombres de LOS40 ni de Pasapalabra.

---

## 1. Decisiones de producto

Estas son las llamadas que hacemos ahora. Si alguna no encaja, se cambia aquí antes de picar código.

| Decisión | Qué hacemos | Por qué |
|---|---|---|
| Nombres públicos | **Clásico**, **Tres pistas**, **Cinco pistas** | El share y las URLs no pueden llevar marcas de terceros. En demos privadas sí se co-brandea. |
| ¿Misma canción en los 3? | **No.** Cada modo tiene **su canción del día**, del mismo catálogo, con offset. | Si fuera la misma, jugar Clásico destrozaría los otros dos. Queremos que se puedan jugar los tres sin spoiler. |
| ¿Se pueden jugar los 3 cada día? | **Sí.** | Más motivo para volver. Cada modo tiene racha propia. |
| ¿Un ranking global? | **Sí, suave:** badge “3/3 del día” si ganas los tres. No sustituye a las rachas. | Flex compartible extra, sin mezclar reglas. |
| Skip | En Tres y Cinco hay **Pasar**. Gasta la pista y abre la siguiente, sin palo de pistas de atributos. | Así funcionan Heardle / Pistaza / La Pista. En Clásico no hay skip. |
| Pistas GEN/DEC/PAÍ/IDI/VOZ | **Solo Clásico.** | En los otros modos la pista **es** el audio, la letra o el acertijo. Mezclar los dos sistemas diluye el share. |
| Tiempo de escucha (30 s) | **Solo Clásico.** Tres y Cinco no cronometran la escucha. | Ahí el flex es “en qué pista caíste”, no los segundos de play. |
| Autocompletado | Igual en los tres: hay que elegir canción del catálogo. | Evita debates de título (“Baby” vs “Baby ft. Ludacris”). |
| Al ganar o perder | Misma pantalla de siempre: canción, artista, Spotify, countdown, share texto + imagen. | Tiene que sentirse el mismo producto. |

---

## 2. Lo que no cambia (el “sentir Songdle”)

Da igual el modo. El jugador tiene que reconocer esto:

1. Una canción por modo y día (medianoche Madrid).
2. Si recargas, sigues donde estabas.
3. Al terminar, modal de stats + botón de compartir.
4. El share **no dice el título**.
5. Stats locales: partidas, % victorias, racha, mejor racha, distribución.
6. Countdown a la siguiente.
7. Mismo look (bordes negros, cream, tipo Wordle musical).

El Clásico sigue siendo la home (`/`). Los otros dos son pestañas/rutas hermanas, no mini-juegos escondidos.

---

## 3. Información arquitectónica

### Rutas

| Modo | Ruta pública | Título en UI |
|---|---|---|
| Clásico | `/` | Clásico |
| Tres pistas | `/tres-pistas` | Tres pistas |
| Cinco pistas | `/cinco-pistas` | Cinco pistas |

Header compartido con las 3 pestañas. La activa, subrayada. Demo para un partner: misma app con `?partner=los40` (o similar) que **oculta las otras pestañas** y puede cambiar logo/copy. El partner nunca ve el modo del otro.

### Canción del día

Misma función que hoy (`selectDailySong`), con offset por modo para no repetir tema:

- Clásico: `dayOfYear`
- Tres pistas: `dayOfYear + 97`
- Cinco pistas: `dayOfYear + 193`

Offsets primos respecto al tamaño típico del pool para que no coincidan en racha corta. Solo canciones con audio reproducible.

### Persistencia (localStorage)

Claves **separadas por modo**. No mezclar estados.

```
songdle-game-state           / songdle-statistics
songdle-game-state-tres      / songdle-statistics-tres
songdle-game-state-cinco     / songdle-statistics-cinco
```

Estado de partida: igual que ahora (`attempts`, `gameWon`, `gameLost`, `gameDate`, …) más `stageIndex` y si el último acto fue `guess` o `skip`.

Stats por modo:

```
gamesPlayed
gamesWon
currentStreak
maxStreak
totalTime          // opcional en Tres/Cinco; se puede dejar a 0
lastPlayedDate
guessDistribution  // Clásico: 1–6; Tres: 1–3; Cinco: 1–5
```

`guessDistribution[n]` = partidas **ganadas** en la pista/intento `n`. Las perdidas no entran en la barra (igual que Clásico).

Pantalla de stats: las mismas tarjetas que ahora, leyendo las stats del modo en el que estás. Un recuadro extra si hoy ya tienes 3/3.

---

## 4. Modo Tres pistas

Inspiración interna: Pistaza (tarareo → letra robot → clip). En producto público es **tres tipos de pista**, de difícil a fácil. Una sola canción. Tres actos. Sin rival.

### Loop

Empiezas en la pista 1. Oyes **solo** lo de esa pista. Dos acciones: **Adivinar** (autocompletado) o **Pasar**.

- Acierto → ganas. No se revelan las pistas que no usaste.
- Fallo o pasar → siguiente pista.
- Fallo o pasar en la 3 → pierdes. Se revela la canción.

No hay cuarta oportunidad. Un fallo en la 1 no da pistas de género/década.

### Las tres pistas

| # | Nombre interno | Qué percibe el jugador | Cómo lo construimos (MVP → después) |
|---|---|---|---|
| 1 | Melodía | “Esto suena a la canción pero no está el hit cantado.” | **MVP:** 1,5–2 s del arranque, volumen de graves, sin estribillo. **Luego:** instrumental / karaoke / hum sintético si hay pipeline. |
| 2 | Letra | Un verso escrito + locución tipo robot (TTS). | Campo `lyricLine` en la canción. Si no hay TTS el primer día, el verso en pantalla **basta**. |
| 3 | Clip | Fragmento reconocible (estribillo o gancho), 4–6 s. | El audio que ya usamos en Clásico, recortado al gancho si podemos; si no, los primeros 6 s. |

Copy de UI por pista (corto):

1. “Escucha la melodía”
2. “Lee la letra”
3. “Escucha el fragmento”

### Puntuación y distribución

Ganar en pista 1 / 2 / 3 = 3 / 2 / 1 “puntos” de pista (solo para stats y share, no hay premio). Perder = 0.

Histograma: barras **1, 2, 3** (pista en la que acertaste), no 1–6.

### Share (sin spoiler)

Formato paralelo al Clásico. El grid es **una fila de 3**, no 5 cuadraditos de atributos.

Leyenda:

- `⬛` pista no usada (ganaste antes)
- `⬜` pasaste
- `🟥` fallaste
- `🟩` acertaste en esa pista

Ejemplo, acierto en la 2 tras fallar la 1:

```
🎵 Songdle · Tres pistas #412
🎯 2/3
🎤📝🎧
🟥🟩⬛

https://songdle.es/tres-pistas
```

Ejemplo, pasar + pasar + acierto:

```
🎵 Songdle · Tres pistas #412
🎯 3/3
🎤📝🎧
⬜⬜🟩

https://songdle.es/tres-pistas
```

Derrota:

```
🎵 Songdle · Tres pistas #412
❌ X/3
🎤📝🎧
🟥⬜🟥

https://songdle.es/tres-pistas
```

Iconos `🎤📝🎧` van **una sola vez**, encima del grid, para que se lea en WhatsApp qué era cada columna. No poner el título ni el artista.

Imagen de share: misma tarjeta Songdle (cream, borde negro) con el grid de 3 y la etiqueta “TRES PISTAS”.

### Cómo jugar (texto para `/como-jugar` y tutorial in-app)

Tienes 3 pistas, cada vez más claras. La primera es solo melodía. Si no, un verso. Si no, un trozo de la canción. Puedes pasar. Cuanto antes aciertes, mejor queda el share.

---

## 5. Modo Cinco pistas

Inspiración interna: La Pista Musical (5 pistas mixtas, de 5 a 1). En público: **cinco pistas**, un jugador, sin pulsador ni rival. El duelo TV no se replica; el share hace de “duelo asíncrono” entre amigos.

### Loop

Igual que Tres: oyes/lees **solo la pista actual**. Adivinar o Pasar. 5 actos. Ganas al primer acierto. Pierdes si agotas las 5.

### Las cinco pistas

| # | Tipo | Qué percibe el jugador | Puntos si acierta |
|---|---|---|---|
| 1 | Audio corto | 2–3 s de intro o arranque. Duro a propósito. | 5 |
| 2 | Verso | Una línea de letra, en pantalla (y TTS si existe). | 4 |
| 3 | Audio medio | 4–5 s, más melodía o pre-estribillo. | 3 |
| 4 | Título con otras palabras | Acertijo: el título dicho con sinónimos / traducción al castellano. **Sin** el título real. | 2 |
| 5 | Audio fácil | Estribillo o gancho, 6–8 s. | 1 |

La pista 4 es la que diferencia este modo de un Heardle. Ejemplos de tono (no usar estos temas si no tocan):

- *Everybody* → “Todos y cada uno”
- *Another Day in Paradise* → “Un día más en el paraíso”
- *Pa ti toa* → “Enterita para ti”

Reglas para escribir el acertijo:

- Misma idea semántica, **cero palabras del título original** salvo artículos (*el, la, un*).
- Si el título está en inglés, se puede “traducir” al castellano (como en TV).
- Longitud parecida (no un párrafo).
- No incluir el nombre del artista.

Campo en datos: `titleRiddle: string`. Obligatorio para que una canción entre en el pool de Cinco. Si falta, esa canción no sale en este modo (sí puede salir en Clásico).

Campo `lyricLine: string`: verso reconocible, no el título. Obligatorio en Cinco; en Tres también.

### Share

Grid de **5**. Misma leyenda `⬛⬜🟥🟩`. Cabecera de tipos:

```
🎵 Songdle · Cinco pistas #412
🎯 3/5
🔊📜🔊🧩🔊
🟥⬜🟩⬛⬛

https://songdle.es/cinco-pistas
```

`🔊` audio, `📜` verso, `🧩` acertijo.

Histograma: barras 1–5 (pista del acierto). En la UI se puede etiquetar también “5 pts … 1 pt” debajo, para quien venga del concurso, **sin decir “segundos” ni “rosco”**.

Imagen de share: igual que Tres, etiqueta “CINCO PISTAS”, cinco celdas.

### Cómo jugar

Cinco pistas que se van aclarando: un trozo de canción, un verso, más canción, el título dicho de otra forma, y el estribillo. Pasa si no la tienes. El flex es sacarla pronto.

---

## 6. Contenido que hay que tener (bloquea el modo)

Clásico ya corre con `audioUrl` + metadatos.

| Campo | Clásico | Tres | Cinco |
|---|---|---|---|
| Audio reproducible | sí | sí | sí |
| `lyricLine` | no | sí | sí |
| `titleRiddle` | no | no | sí |
| Recortes de audio (inicio / gancho / estribillo) | no | deseable | deseable |

**MVP de contenido:** no hace falta anotar las 850. Anotar a mano **las próximas 30 del calendario** de cada modo (o un JSON de overrides por `song.id`). El resto se puede ir rellenando. Si el día D no tiene `lyricLine` / `titleRiddle`, el selector salta a la siguiente canción playable **con** esos campos.

TTS robot: v2. El verso escrito cubre la pista 2 de Tres y la 2 de Cinco.

Recortes finos de audio: v1.1. El MVP puede usar `playbackRate` + `currentTime` en el mismo archivo (0–2 s, 0–5 s, estribillo si conocemos `hookStartSec`).

---

## 7. Tutorial, vacío y bordes

- Primera visita a un modo: modal de 3–4 viñetas (como el tutorial de Clásico), clave `songdle-tutorial-tres` / `songdle-tutorial-cinco`.
- Si el usuario ya vio el de Clásico, **igual** enseñamos el del modo nuevo: las reglas no se intuyen.
- Pasar en la última pista = perder (no hay pista extra).
- Adivinar una canción que no está en el catálogo: imposible; el submit solo acepta selección de la lista.
- Mismo catálogo de sugerencias en los tres modos (no filtrar por década).
- Audio bloqueado por autoplay: mismo patrón que Clásico (play explícito).

---

## 8. White-label (LOS40 / TV), fuera de la UI pública

El código de reglas es el mismo. Lo que cambia por partner:

- Una sola ruta visible.
- Logo, color, copy (“La canción del día”).
- Share: nombre del partner en la primera línea, URL del partner.
- Canción: su lista / su día, no el offset público.
- Nunca tres tabs con el nombre del programa.

Demos: `/tres-pistas?partner=demo` y `/cinco-pistas?partner=demo` con skin neutra. Skins reales, cuando haya acuerdo.

---

## 9. Analytics

Eventos actuales de Clásico + `mode: classic | tres | cinco` en todos.

Nuevos:

- `mode_selected`
- `stage_viewed` (número de pista)
- `stage_skipped`
- `guess_submitted` (con `stage`)
- `share_clicked` (con `mode`)

El 3/3 del día: `triple_win` una vez por `gameDate`.

---

## 10. Criterios de “se siente Songdle”

Un modo está bien cuando:

1. Puedes terminar en menos de un minuto.
2. El share se entiende en WhatsApp **sin** haber jugado (grid + X/N).
3. La racha duele si fallas un día.
4. Al volver mañana, la pestaña correcta restaura la partida.
5. Clásico no se ha roto (stats y share viejos siguen igual).

---

## 11. Fuera de alcance (ahora)

- Multijugador / pulsador en tiempo real (Cinco no es un duelo live).
- Premios, tazas, segundos de rosco.
- Nombres o assets de LOS40 / Antena 3 / ITV en producción.
- Rewarded video / banners.
- Generación masiva de hums o riddles con IA sin revisión.

---

## 12. Orden de implementación sugerido

1. Shell de rutas + tabs + persistencia por modo (Clásico intacto).
2. Tres pistas con audio recortado + verso en texto + share/stats.
3. Cinco pistas + `titleRiddle` + pool filtrado.
4. Imagen de share de cada modo.
5. Overrides de contenido para 30 días.
6. Query `partner` para demos.

El paso 2 ya sirve para una reunión. El 3, para la otra. No hace falta tener los dos perfectos el mismo día.
