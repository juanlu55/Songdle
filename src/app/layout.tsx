import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display de la marca: Archivo con eje de anchura para el logotipo y los titulares
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const siteUrl = "https://songdle.es";
const siteName = "Songdle";
const siteDescription = "Songdle es el Wordle de canciones: escucha un fragmento y adivina la canción en 6 intentos. Juego diario gratuito con las mejores canciones de Los 40 Principales. ¡Pon a prueba tu oído musical!";

export const metadata: Metadata = {
  // Básicos
  title: {
    default: "Songdle - Adivina la canción | Wordle musical en español",
    template: "%s | Songdle"
  },
  description: siteDescription,
  keywords: [
    "Songdle", "Wordle canciones", "Wordle musical", "adivinar canciones",
    "juego musical", "Los 40 Principales", "juego adivinar música",
    "Wordle español", "juego diario canciones", "quiz musical",
    "escuchar y adivinar", "juego de música online", "trivia musical",
    "heardle español", "heardle en español", "alternativa a heardle"
  ],
  authors: [{ name: "Songdle" }],
  creator: "Songdle",
  publisher: "Songdle",
  
  // Canonical y alternates
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
    },
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Open Graph para redes sociales
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: siteName,
    title: "Songdle - Adivina la canción del día",
    description: siteDescription,
  },
  
  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "Songdle - Adivina la canción del día",
    description: siteDescription,
    creator: "@songdle_es",
  },
  
  // Iconos y manifest
  manifest: "/manifest.json",
  
  // Otros
  category: "games",
  classification: "Music Game, Puzzle Game, Daily Game",
  
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      inLanguage: "es-ES",
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#game`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      applicationCategory: "GameApplication",
      operatingSystem: "Web Browser",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR"
      },
      author: {
        "@type": "Organization",
        name: siteName,
        url: siteUrl
      },
      genre: ["Music", "Puzzle", "Trivia"],
      gamePlatform: "Web Browser",
      inLanguage: "es-ES"
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon-512.png`,
        width: 512,
        height: 512
      },
      sameAs: [
        // Añade tus redes sociales aquí cuando las tengas
        // "https://twitter.com/songdle_es",
        // "https://instagram.com/songdle_es"
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cómo se juega a Songdle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Presiona el botón de play para escuchar un fragmento de la canción del día. Tienes 30 segundos máximo de escucha y 6 intentos para adivinar. Cada intento te da pistas sobre el género, década, país, idioma y tipo de voces."
          }
        },
        {
          "@type": "Question",
          name: "¿Es gratis jugar a Songdle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, Songdle es completamente gratuito. Cada día hay una nueva canción para adivinar."
          }
        },
        {
          "@type": "Question",
          name: "¿Qué canciones incluye Songdle?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Songdle incluye canciones que han sido número 1 en Los 40 Principales desde 1990 hasta la actualidad."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
