# Songdle

Un proyecto web simple construido con Next.js y Tailwind CSS.

## 🚀 Características

- ⚡ Next.js 15 con App Router
- 🎨 Tailwind CSS para estilos
- 📱 Diseño responsive
- 🔧 TypeScript
- ✨ ESLint configurado

## 🛠️ Desarrollo Local

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar servidor de desarrollo:
```bash
npm run dev
```

3. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Deployment en Vercel

### Opción 1: Deploy automático desde GitHub

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Conecta tu cuenta de GitHub
4. Importa el repositorio
5. Vercel detectará automáticamente que es un proyecto Next.js
6. ¡Deploy automático!

### Opción 2: Deploy desde terminal

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. En el directorio del proyecto:
```bash
vercel
```

3. Sigue las instrucciones en pantalla

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css      # Estilos globales con Tailwind
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página principal
```

## 🎨 Personalización

- Edita `src/app/page.tsx` para cambiar el contenido
- Modifica `src/app/globals.css` para estilos globales
- Usa clases de Tailwind para estilos rápidos

## 📝 Próximos Pasos

- [ ] Añadir más páginas
- [ ] Implementar componentes reutilizables
- [ ] Añadir funcionalidades específicas
- [ ] Optimizar para SEO