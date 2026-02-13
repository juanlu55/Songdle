# Guía: Configurar Analytics para Songdle 📊

## Opción 1: Vercel Analytics (Recomendado - Más Fácil)

### Ventajas
- ✅ Configuración en **30 segundos**
- ✅ Sin cookies (GDPR friendly)
- ✅ Métricas en tiempo real
- ✅ Integración perfecta con Next.js
- ✅ **Gratis** hasta 100k eventos/mes

### Instalación

```bash
npm install @vercel/analytics
```

### Implementación

Edita `src/app/layout.tsx` y añade:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />  {/* ← Añade esta línea */}
      </body>
    </html>
  )
}
```

### Activar en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Analytics
3. Click en "Enable"
4. ¡Listo! Verás estadísticas inmediatamente

### Dashboard

Accede a: `vercel.com/[tu-proyecto]/analytics`

Verás:
- 👥 Visitantes únicos
- 📊 Páginas vistas
- 📍 Países de origen
- 📱 Dispositivos (mobile/desktop)
- 🌐 Navegadores

---

## Opción 2: Google Analytics 4 (Más Completo)

### Ventajas
- ✅ **Gratis** sin límites
- ✅ Métricas muy detalladas
- ✅ Embudo de conversión
- ✅ Tiempo real
- ⚠️ Requiere configuración de cookies

### 1. Crear Cuenta

1. Ve a https://analytics.google.com
2. Crea una cuenta/propiedad
3. Obtén tu **Measurement ID** (ej: `G-XXXXXXXXXX`)

### 2. Instalación

```bash
npm install @next/third-parties
```

### 3. Implementación

Edita `src/app/layout.tsx`:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />  {/* Tu ID aquí */}
      </body>
    </html>
  )
}
```

### 4. Dashboard

Accede a: https://analytics.google.com

Verás:
- 👥 Usuarios activos en tiempo real
- 📊 Páginas más visitadas
- 🌍 Ubicaciones geográficas
- 📱 Dispositivos y navegadores
- ⏱️ Tiempo de permanencia
- 📈 Tasa de rebote

---

## Opción 3: Plausible (Privado y Simple)

### Ventajas
- ✅ Sin cookies
- ✅ Dashboard muy simple
- ✅ Open source
- ❌ De pago ($9/mes) o self-hosted

### Instalación

```bash
npm install next-plausible
```

### Implementación

Edita `src/app/layout.tsx`:

```typescript
import PlausibleProvider from 'next-plausible'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <PlausibleProvider domain="songdle.es">
        <body>
          {children}
        </body>
      </PlausibleProvider>
    </html>
  )
}
```

### Cuenta

1. Regístrate en https://plausible.io
2. Añade tu dominio `songdle.es`
3. Dashboard automático

---

## Opción 4: Umami (Gratuito, Self-Hosted)

### Ventajas
- ✅ 100% gratis
- ✅ Sin cookies
- ✅ Open source
- ⚠️ Requiere servidor propio (Railway, Vercel, etc.)

### Despliegue Rápido

1. Fork: https://github.com/umami-software/umami
2. Deploy en Railway/Vercel (1 click)
3. Crea un sitio web en Umami
4. Obtén el script tracking

### Implementación

Añade a `src/app/layout.tsx`:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <script
          defer
          src="https://tu-umami.vercel.app/script.js"
          data-website-id="tu-website-id"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

---

## 📊 Comparación Rápida

| Herramienta | Precio | Configuración | Privacidad | Dashboard |
|-------------|--------|---------------|------------|-----------|
| **Vercel Analytics** | Gratis (hasta 100k) | ⭐⭐⭐⭐⭐ Muy fácil | ✅ Sin cookies | Simple |
| **Google Analytics** | Gratis | ⭐⭐⭐⭐ Fácil | ⚠️ Con cookies | Completo |
| **Plausible** | $9/mes | ⭐⭐⭐⭐ Fácil | ✅ Sin cookies | Simple |
| **Umami** | Gratis | ⭐⭐⭐ Medio | ✅ Sin cookies | Simple |

---

## 🎯 Mi Recomendación

### Para Empezar Rápido
**Vercel Analytics**: Si despliegas en Vercel, es la opción perfecta. En 30 segundos tienes métricas.

### Para Máximo Detalle
**Google Analytics 4**: Si quieres análisis profundo y no te importa la configuración de cookies.

### Para Privacidad Total
**Umami (self-hosted)**: Si quieres control total y cero costos.

---

## 📈 Métricas Importantes para Songdle

Lo que querrás ver:
- 👥 **Visitantes únicos diarios**
- 🔄 **Usuarios recurrentes** (vuelven cada día)
- 📊 **Tasa de completitud** (cuántos terminan el juego)
- 📱 **Mobile vs Desktop**
- 🌍 **Países principales**
- ⏱️ **Tiempo promedio en el sitio**

---

## 🚀 Instalación Express (Vercel Analytics)

```bash
# 1. Instalar
npm install @vercel/analytics

# 2. Editar layout (ver arriba)

# 3. Deploy
git add .
git commit -m "Add analytics"
git push

# 4. Activar en Vercel dashboard
```

---

## 🔧 Extras: Eventos Personalizados

Si usas Vercel Analytics, puedes trackear eventos específicos:

```typescript
import { track } from '@vercel/analytics';

// Cuando alguien gana
track('game_won', { 
  attempts: attempts.length,
  time: elapsedTime 
});

// Cuando comparten
track('share_clicked');

// Cuando escuchan audio
track('audio_played');
```

Esto te dará insights más profundos sobre cómo usan el juego.

---

## ❓ Preguntas Frecuentes

**Q: ¿Necesito consentimiento de cookies?**  
A: Con Vercel Analytics, Plausible o Umami **NO** (sin cookies). Con Google Analytics **SÍ** (requiere banner de consentimiento).

**Q: ¿Puedo ver datos en tiempo real?**  
A: Sí, todas las opciones tienen visualización en tiempo real.

**Q: ¿Cuánto cuesta?**  
A: Vercel Analytics es gratis hasta 100k eventos/mes (suficiente para empezar). Google Analytics es gratis siempre.

**Q: ¿Afecta la velocidad del sitio?**  
A: Mínimamente. Todas estas herramientas cargan de forma asíncrona y no bloquean el renderizado.

---

## 📞 Ayuda

Si eliges alguna opción, puedo ayudarte a:
1. Implementarla en el código
2. Configurar eventos personalizados
3. Interpretar las métricas
4. Optimizar según los datos

¿Cuál opción te interesa más? 🚀


