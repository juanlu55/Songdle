import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heardle en español: alternativa gratis al Wordle de canciones",
  description:
    "Heardle cerró. Songdle es la alternativa en español: escucha un fragmento y adivina la canción del día, con números 1 de Los 40 Principales. Gratis, sin registro.",
  keywords: [
    "heardle español",
    "heardle en español",
    "alternativa a heardle",
    "wordle canciones",
    "wordle musical",
    "adivinar canciones",
    "juego adivinar música",
    "songdle",
  ],
  alternates: {
    canonical: "/heardle-espanol",
  },
  openGraph: {
    title: "Heardle en español | Songdle, el Wordle de canciones",
    description:
      "La alternativa a Heardle en español: una canción al día, 6 intentos y pistas de género, década y país.",
    url: "https://songdle.es/heardle-espanol",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Heardle en español: alternativa al Wordle de canciones",
  url: "https://songdle.es/heardle-espanol",
  description:
    "Songdle es una alternativa a Heardle en español. Adivina la canción del día con fragmentos de audio y pistas.",
  inLanguage: "es-ES",
  isPartOf: {
    "@type": "WebSite",
    name: "Songdle",
    url: "https://songdle.es",
  },
};

export default function HeardleEspanol() {
  return (
    <div className="min-h-screen bg-[#f5f1e8] py-8 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-black/60 hover:text-black transition-colors mb-4"
          >
            ← Jugar ahora
          </Link>

          <div className="inline-block border-4 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black text-black tracking-tight">
              Heardle en español
            </h1>
          </div>
          <p className="mt-4 text-black/70 font-medium leading-relaxed">
            Heardle, el Wordle de canciones original, cerró. Songdle es la alternativa
            gratuita en español: cada día, un número 1 de Los 40 Principales.
          </p>
        </header>

        <main>
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
              ¿Qué era Heardle?
            </h2>
            <p className="text-black/80 font-medium leading-relaxed mb-4">
              Heardle era un juego diario inspirado en Wordle: escuchabas un fragmento
              de una canción y tenías 6 intentos para adivinarla. Spotify lo compró y
              lo apagó en 2023. Desde entonces, quien busca{" "}
              <strong>Heardle en español</strong> acaba en copias incompletas o en
              páginas en inglés.
            </p>
            <p className="text-black/80 font-medium leading-relaxed">
              Songdle cubre ese hueco con un catálogo que la gente en España sí reconoce:
              éxitos que fueron número 1 en Los 40 Principales desde 1990.
            </p>
          </section>

          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
              Songdle vs Heardle
            </h2>
            <div className="space-y-3 text-sm font-medium text-black/80">
              <div className="border-2 border-black bg-[#a8e6cf] p-4">
                <p className="font-black uppercase text-xs mb-1">Catálogo</p>
                <p>Números 1 de Los 40, no un mix genérico internacional.</p>
              </div>
              <div className="border-2 border-black bg-[#f5f1e8] p-4">
                <p className="font-black uppercase text-xs mb-1">Pistas</p>
                <p>
                  Cada fallo te dice si coinciden género, década, país, idioma y voces.
                  No solo “escucha un segundo más”.
                </p>
              </div>
              <div className="border-2 border-black bg-[#f5f1e8] p-4">
                <p className="font-black uppercase text-xs mb-1">Idioma</p>
                <p>Interfaz en español y canciones que suenan en la radio española.</p>
              </div>
              <div className="border-2 border-black bg-[#f5f1e8] p-4">
                <p className="font-black uppercase text-xs mb-1">Precio</p>
                <p>Gratis, sin registro y sin anuncios invasivos.</p>
              </div>
            </div>
          </section>

          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
              Cómo se juega
            </h2>
            <ol className="space-y-3 text-sm font-medium text-black/80 list-decimal list-inside">
              <li>Pulsa play y escucha. El tiempo solo corre mientras suena.</li>
              <li>Tienes 30 segundos de audio y 6 intentos.</li>
              <li>Si fallas, las casillas te dicen qué atributos coinciden.</li>
              <li>Comparte el resultado en WhatsApp sin destripar la canción.</li>
            </ol>
            <p className="mt-4 text-sm font-medium text-black/70">
              Guía completa en{" "}
              <Link href="/como-jugar" className="underline font-black">
                cómo jugar a Songdle
              </Link>
              .
            </p>
          </section>

          <div className="text-center space-y-4">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-[#a8e6cf] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Jugar al Songdle de hoy
            </Link>
          </div>
        </main>

        <footer className="mt-8 border-4 border-black bg-black p-4 text-center">
          <p className="text-white text-sm font-bold uppercase tracking-wide">
            Songdle — Alternativa a Heardle en español
          </p>
        </footer>
      </div>
    </div>
  );
}
