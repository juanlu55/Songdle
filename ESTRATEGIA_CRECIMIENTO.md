# Estrategia de Crecimiento: De 30 a 1000+ usuarios

## Estado actual ✅

**Métricas:**
- ~29 usuarios únicos (23 sept)
- +52.6% crecimiento orgánico desde 24 agosto
- Crecimiento viral orgánico (WhatsApp, boca a boca)

**Fortalezas técnicas:**
- ✅ SEO muy bien configurado (metadata, OG, Twitter Cards, JSON-LD)
- ✅ Analytics con Amplitude
- ✅ PWA instalable
- ✅ Share a WhatsApp funcionando
- ✅ 3 modos de juego únicos
- ✅ Dominio propio songdle.es

---

## Objetivo: 1000 usuarios jugando

Para llegar a 1000 necesitas **multiplicar x35 tu base actual**. Esto requiere una combinación de:
1. **Tracción inicial** (primeros 100-300 usuarios)
2. **Crecimiento viral sostenido** (k-factor > 0.5)
3. **Retención alta** (daily active users)

---

## 🎯 PLAN DE ACCIÓN: 5 Estrategias Priorizadas

### **FASE 1: Quick Wins (Semana 1-2)** - Esfuerzo bajo, impacto alto

#### 1.1 🚀 Launch en comunidades relevantes
**Dónde postear (en orden de prioridad):**

1. **Reddit** (potencial: 500-1000 primeros usuarios)
   - r/wordle (1.4M miembros) - "I made a Spanish music version of Wordle"
   - r/WebGames (800k) - Post como "Free daily music game"
   - r/casualiknow (si existe comunidad musical)
   - r/Music (32M) - Post educativo sobre música de Los 40
   - r/spain (300k), r/es (200k) - En español
   
   **Cómo postear:**
   - Título: "I built a music Wordle for Spanish hits (Heardle alternative)"
   - Incluir GIF/video de gameplay
   - Mostrar los 3 modos
   - Ser genuino, no spam
   - Responder todos los comentarios rápido

2. **Product Hunt** (potencial: 200-500 usuarios, credibilidad)
   - Hacer el launch oficial
   - Necesitas:
     - Buen tagline: "Wordle meets Shazam for Spanish music"
     - Screenshot/video demo
     - 5-10 hunters para upvotear en las primeras horas
   - Objetivo: Top 10 del día = 300-800 visitors

3. **Hacker News - Show HN** (potencial: 500-2000 usuarios si llega a front)
   - Título: "Show HN: Songdle – Daily music quiz with Spanish hits"
   - Post técnico: explicar cómo funciona, tech stack
   - El detalle de los 3 modos es muy interesante
   - Timing: Martes-Jueves 8-10am PST

4. **IndieHackers**
   - Post en el foro
   - Compartir métricas y growth journey
   - Pedir feedback

5. **Twitter/X**
   - Thread sobre el proyecto
   - Mencionar a cuentas de música española, Los 40, etc.
   - Usar hashtags: #wordle #heardle #musicgames #indiegames

6. **Comunidades de música española**
   - Foros de fans de artistas
   - Grupos de Facebook de música
   - Discord servers de música

**ROI:** Si ejecutas bien 2-3 de estos, puedes llegar a 200-500 usuarios en 2 semanas.

---

#### 1.2 📱 Mejorar el Share para viralidad

**Problema actual:** El share es bueno pero puede ser MÁS viral.

**Mejoras específicas:**

1. **Añadir resultado visual más impactante**
   ```
   🎵 Songdle #412
   🎯 2/6 en 8.34s ⚡
   🟥🟩⬛⬛⬛⬛
   
   ¿Puedes hacerlo mejor? 👇
   songdle.es
   ```

2. **A/B test del copy**
   - Actual: "Songdle - Adivina la canción"
   - Test: "🎵 Lo saqué en 2 intentos (8.34s). ¿Tú puedes?"
   - Test: "❌ No pude con la de hoy. ¿Alguien la tiene?"
   
3. **Challenge friends** - Añadir botón "Retar a un amigo"
   - Copy WhatsApp: "🎵 Te reto a que lo hagas mejor. Yo: 2/6 en 8.34s"

4. **Stats compartibles**
   - Botón "Compartir mi racha de 15 días 🔥"
   - Imagen con badge de logros

**Implementación:** 2-4 horas de desarrollo.

---

#### 1.3 🔔 Retención: Recordatorios diarios

**El problema:** Los usuarios juegan una vez y se olvidan.

**Soluciones (de más fácil a más complejo):**

1. **PWA Push Notifications** (implementar PRIMERO)
   - "🎵 Nueva canción del día disponible"
   - Pedir permiso DESPUÉS de la primera partida ganada (no antes)
   - Enviar a las 9am hora España
   - CTR esperado: 20-40%

2. **Email opt-in (opcional)**
   - Al final de partida: "¿Quieres que te avisemos cada día?"
   - Newsletter semanal con stats: "Esta semana acertaron 12.450 jugadores"

3. **Widget de racha**
   - "No pierdas tu racha de 7 días 🔥"
   - Mostrar en la pantalla final

**Implementación:** Push notifications = 4-6 horas. Vale totalmente la pena.

---

### **FASE 2: SEO & Content (Semana 2-4)** - Tráfico orgánico sostenido

#### 2.1 🔍 SEO Long-tail: Páginas por canción/artista

**Oportunidad:** Crear contenido buscable que traiga tráfico.

**Páginas a crear:**
1. `/canciones/despacito-luis-fonsi` - Historia, curiosidades, video oficial
2. `/artistas/shakira` - Todas sus canciones en Songdle
3. `/decadas/2000s` - Las mejores canciones de los 2000s
4. `/blog/canciones-mas-dificiles-songdle` - Content marketing

**Beneficios:**
- Tráfico de Google: gente buscando letras, curiosidades
- Backlinks naturales
- Engagement: "¿Sabías que esta canción estuvo X semanas en el #1?"

**Ejemplos de búsquedas que capturarías:**
- "canciones número 1 de los 40 2005"
- "historia de despacito"
- "juegos de música en español"
- "wordle de canciones"
- "heardle en español"

**Implementación:** 
- Crear plantillas dinámicas
- Usar datos que ya tienes (songs.ts)
- 1-2 días de desarrollo

---

#### 2.2 📊 Página de stats globales

**Crear:** `/stats` o `/leaderboard`

**Contenido:**
- Canción más difícil del mes
- Promedio de intentos por canción
- Artistas más jugados
- Stats globales: "12.450 partidas jugadas hoy"

**Por qué funciona:**
- Social proof ("Wow, hay mucha gente jugando")
- Contenido compartible
- SEO: updates diarios

---

#### 2.3 🎯 Landing pages específicas

1. `/heardle-espanol` (ya existe) - Optimizar para "heardle español"
2. `/wordle-canciones` - Crear con ese keyword
3. `/juego-adivinar-canciones` - Long tail
4. `/para-fans-los-40` - Segmento específico

---

### **FASE 3: Growth Loops (Semana 4-8)** - Crecimiento exponencial

#### 3.1 🏆 Sistema de logros/badges

**Implementar:**
- "Racha de 7 días 🔥"
- "Perfectionist: 5 victorias en el 1er intento"
- "Triple Crown: Gana los 3 modos hoy"
- "Speed Demon: Gana en menos de 5 segundos"

**Hacer que sean COMPARTIBLES:**
- "Desbloqueé el badge 'Perfectionist' 🏆"
- Imagen generada automáticamente
- Esto añade una razón extra para compartir

---

#### 3.2 👥 Referral system simple

**Implementar:**
- Cada usuario tiene un link: `songdle.es?ref=juan123`
- Mostrar: "15 amigos se unieron por ti"
- Reward: Badge especial "Embajador" a los 10 referidos

No necesitas dar premios monetarios. El reconocimiento social funciona.

---

#### 3.3 🎮 Modo competitivo semanal

**Nueva feature:**
- "Liga semanal" - Todos juegan la misma canción
- Ver el tiempo de tus amigos (si opt-in)
- Leaderboard semanal
- Resetea cada lunes

**Viral loop:**
- "Estás #3 de 450 jugadores esta semana"
- "Tu amigo Pedro te ganó por 2 segundos"

---

### **FASE 4: Partnerships (Ongoing)** - B2B

#### 4.1 🎙️ Radio y medios musicales

**Contactar:**
- LOS40 (obvio, ya usas sus datos)
- Cadena 100, Kiss FM, Radio 3
- Blogs de música: Jenesaispop, Rockdelux, Mondosonoro
- YouTube channels de música española

**Pitch:**
- "Widget gratuito para tu web"
- "Menciona a Songdle on-air: 'Juega en songdle.es'"
- Win-win: ellos dan contenido a audiencia, tú tráfico

---

#### 4.2 📱 Cross-promotion con otros juegos

**Buscar:**
- Otros daily games españoles
- Pazaak, Wordle ES, etc.
- "Al final de tu partida, prueba Songdle"

---

### **FASE 5: Paid (si funciona lo anterior)** - Acelerar crecimiento

Solo considerar si:
- Ya tienes 300-500 DAU orgánicos
- Retention > 40% day 7
- K-factor > 0.3 (cada usuario trae 0.3 usuarios)

**Opciones:**
1. **Facebook/Instagram Ads**
   - Target: España, México, Argentina
   - Intereses: Los 40, música española, Wordle, juegos
   - Objective: App installs o Traffic
   - Budget test: €50-100/día
   - CPA esperado: €0.50-1.50 por usuario

2. **Google Ads**
   - Keywords: "wordle canciones", "heardle español", "juego música"
   - Display en sites de música

3. **TikTok Ads** (si demográfico es joven)
   - Video del gameplay
   - Hook: "¿Puedes adivinar esta canción en 3 segundos?"

---

## 📊 Métricas clave a trackear

**Debes medir (ya tienes Amplitude):**

1. **DAU/WAU/MAU**
   - Daily Active Users
   - Objetivo: 300 DAU = ~1000 WAU

2. **Retention Cohorts**
   - Day 1: 40%+
   - Day 7: 20%+
   - Day 30: 10%+

3. **K-factor (viralidad)**
   - Shares por usuario: objetivo 0.5
   - Conversion rate del share: objetivo 10%
   - K = 0.5 * 0.10 = 0.05 (inicialmente)
   - Necesitas llegar a K > 0.3 para crecimiento sostenido

4. **Engagement**
   - % usuarios que juegan los 3 modos
   - Tiempo en site
   - Partidas por usuario/semana

5. **Fuentes de tráfico**
   - Organic search
   - Direct (PWA)
   - Social (WhatsApp shares)
   - Referral

6. **Conversion funnel**
   - Visitors → Jugaron 1ra vez
   - Jugaron 1ra vez → Completaron partida
   - Completaron partida → Compartieron
   - Compartieron → Volvieron día siguiente

---

## 🎯 Roadmap ejecutivo (Next 8 weeks)

### Semana 1-2: Launch & Quick Wins
- [ ] Reddit posts (r/wordle, r/WebGames, r/spain)
- [ ] Product Hunt launch
- [ ] Hacker News Show HN
- [ ] Mejorar share copy (A/B test)
- [ ] Implementar PWA push notifications

**Objetivo: 200 usuarios**

### Semana 3-4: Retención & Content
- [ ] Email capture (opcional)
- [ ] Primera ronda de content (3-5 páginas /canciones/)
- [ ] Página de stats globales
- [ ] Badges básicos (racha, victorias)

**Objetivo: 400 usuarios, retención 40% D1**

### Semana 5-6: Growth Loops
- [ ] Referral system
- [ ] Badges compartibles
- [ ] Modo competitivo semanal
- [ ] 10-15 páginas de content más

**Objetivo: 700 usuarios, K-factor > 0.2**

### Semana 7-8: Partnerships & Scale
- [ ] Contactar 5 radios/medios
- [ ] Cross-promo con otros juegos
- [ ] Influencers micro (TikTok/YouTube música)
- [ ] Evaluar paid ads si métricas son buenas

**Objetivo: 1000+ usuarios**

---

## 💡 Ideas adicionales (Backlog)

### Features que aumentan viralidad:
1. **Duelo 1v1 diario**
   - Reta a un amigo con un link
   - Ven quién es más rápido
   - "Pedro te retó a un duelo 🎯"

2. **Modo colaborativo**
   - 2-4 jugadores en la misma partida
   - Chat en vivo
   - "Invita amigos a resolver juntos"

3. **Torneos mensuales**
   - Clasificación para top 100
   - Premio: Featured en home, badge especial

4. **Custom playlists**
   - "Crea tu Songdle con tus canciones favoritas"
   - Compartir: "Juega mi Songdle de reggaeton"

5. **TikTok/Instagram integration**
   - Compartir video de tu resultado
   - AR filter "Adivina la canción"

### Content marketing:
1. **Blog posts virales:**
   - "Las 10 canciones más difíciles de Songdle"
   - "¿Qué dice tu Songdle sobre ti? Análisis por década"
   - "Historia de las canciones #1 de Los 40"

2. **Newsletter semanal:**
   - Top 10 mejores tiempos
   - Curiosidades de la canción de la semana
   - Tips para mejorar

3. **Podcast/YouTube:**
   - "Behind the Song" - Historia de cada canción

---

## 🎓 Aprendizajes de otros daily games

**Wordle llegó a 300k en 3 meses por:**
- Viral share innovador (los cuadraditos de colores)
- No saturar (1 vez al día crea FOMO)
- Boca a boca en Twitter

**Heardle (original) llegó a 1M en 2 meses por:**
- Launch en Product Hunt
- Timing (post-Wordle hype)
- Musical nostalgia

**Tu ventaja:**
- Nicho (español) = menos competencia
- 3 modos = más engagement
- Base de Los 40 = brand familiarity

---

## ✅ Checklist de prioridades (START HERE)

**Esta semana:**
1. [ ] Post en Reddit r/wordle (mejor día: lunes/martes)
2. [ ] Preparar Product Hunt launch (coordinar hunters)
3. [ ] Implementar push notifications PWA
4. [ ] Mejorar copy del share (A/B test)

**Próxima semana:**
1. [ ] Lanzar en Product Hunt (martes/miércoles)
2. [ ] Post en Hacker News
3. [ ] Badges de racha implementados
4. [ ] Primera página de stats globales

**Mes 1 objetivo: 300-500 usuarios activos**

---

## 📞 Dónde pedir ayuda

- r/SideProject - feedback de la comunidad
- IndieHackers - growth tips
- GrowthHackers - estrategias avanzadas
- r/marketing - distribución

---

## 🎯 TL;DR - Top 5 acciones AHORA

1. **POST EN REDDIT** (r/wordle, r/WebGames) - 2 horas de esfuerzo, 200-500 usuarios potenciales
2. **PRODUCT HUNT** - 4 horas de prep, 300-800 usuarios potenciales
3. **PUSH NOTIFICATIONS PWA** - 4-6 horas dev, 40% retention increase
4. **MEJOR SHARE COPY** - 1 hora, 20% más shares
5. **STATS GLOBALES PÁGINA** - 3-4 horas dev, social proof + SEO

**Con estas 5 acciones en 2 semanas puedes llegar a 200-400 usuarios.**

El resto es iterar, optimizar y seguir el roadmap.
