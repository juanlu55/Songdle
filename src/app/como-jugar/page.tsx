import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cómo jugar a Songdle - Instrucciones y reglas del juego",
  description: "Aprende a jugar a Songdle, el Wordle de canciones. Escucha fragmentos de música, usa las pistas y adivina la canción en 6 intentos. Guía completa con trucos y estrategias.",
  keywords: [
    "cómo jugar Songdle", "instrucciones Songdle", "reglas Songdle",
    "tutorial Wordle canciones", "guía juego musical"
  ],
  alternates: {
    canonical: "/como-jugar",
  },
  openGraph: {
    title: "Cómo jugar a Songdle - Instrucciones completas",
    description: "Aprende a jugar a Songdle, el Wordle de canciones. Escucha fragmentos de música y adivina la canción en 6 intentos.",
    url: "https://songdle.es/como-jugar",
    type: "article",
  },
};

// JSON-LD para la página de instrucciones
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Cómo jugar a Songdle",
  description: "Guía paso a paso para jugar a Songdle, el Wordle de canciones",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Escucha la canción",
      text: "Presiona el botón de play para comenzar a escuchar un fragmento de la canción del día. El tiempo de reproducción se acumula.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Pausa cuando quieras",
      text: "Puedes pausar la reproducción en cualquier momento. El temporizador se detiene cuando pausas, así que tómate tu tiempo para pensar.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Haz tu intento",
      text: "Escribe el nombre de la canción que crees que es. El autocompletado te ayudará a encontrarla en la lista.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Analiza las pistas",
      text: "Cada intento te muestra pistas de colores: verde significa que coincide con la canción correcta, rojo que no coincide. Las pistas son: Género, Década, País, Idioma y Voces.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "¡Adivina en 6 intentos!",
      text: "Tienes 6 intentos y 30 segundos máximo de escucha para adivinar la canción del día.",
    },
  ],
};

export default function ComoJugar() {
  return (
    <div className="min-h-screen bg-[#f5f1e8] py-8 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-black/60 hover:text-black transition-colors mb-4"
          >
            ← Volver al juego
          </Link>
          
          <div className="inline-block border-4 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black text-black tracking-tight">
              Cómo Jugar
            </h1>
          </div>
        </header>

        {/* Contenido principal */}
        <main>
          {/* Introducción */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
              ¿Qué es Songdle?
            </h2>
            <p className="text-black/80 font-medium leading-relaxed mb-4">
              <strong>Songdle</strong> es un juego diario inspirado en Wordle, pero en lugar de adivinar palabras, 
              debes <strong>adivinar canciones escuchando fragmentos de audio</strong>. Cada día hay una nueva canción 
              de Los 40 Principales esperándote.
            </p>
            <p className="text-black/80 font-medium leading-relaxed">
              El reto está en identificar la canción usando el menor tiempo de escucha posible y 
              el menor número de intentos. ¿Podrás reconocerla en segundos?
            </p>
          </section>

          {/* Reglas del juego */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
              Reglas del Juego
            </h2>
            
            <div className="space-y-4">
              {/* Regla 1 */}
              <article className="border-2 border-black bg-[#f5f1e8] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#ff6b6b] border-2 border-black flex items-center justify-center font-black text-white">
                    1
                  </div>
                  <h3 className="font-black uppercase text-sm">Escucha y pausa</h3>
                </div>
                <p className="text-sm font-medium text-black/70 leading-relaxed">
                  Presiona <strong>▶ PLAY</strong> para escuchar la canción. 
                  Puedes <strong>PAUSAR ❚❚</strong> cuando quieras — el tiempo solo cuenta mientras reproduces.
                </p>
              </article>

              {/* Regla 2 */}
              <article className="border-2 border-black bg-[#f5f1e8] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#ff6b6b] border-2 border-black flex items-center justify-center font-black text-white">
                    2
                  </div>
                  <h3 className="font-black uppercase text-sm">Límite de tiempo</h3>
                </div>
                <p className="text-sm font-medium text-black/70 leading-relaxed">
                  Tienes un máximo de <strong>30 segundos</strong> de escucha total. 
                  Una vez agotados, no podrás escuchar más, ¡así que úsalos sabiamente!
                </p>
              </article>

              {/* Regla 3 */}
              <article className="border-2 border-black bg-[#f5f1e8] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#ff6b6b] border-2 border-black flex items-center justify-center font-black text-white">
                    3
                  </div>
                  <h3 className="font-black uppercase text-sm">6 intentos máximo</h3>
                </div>
                <p className="text-sm font-medium text-black/70 leading-relaxed">
                  Tienes <strong>6 intentos</strong> para adivinar la canción correcta. 
                  Escribe el nombre y selecciónala del listado.
                </p>
              </article>

              {/* Regla 4 */}
              <article className="border-2 border-black bg-[#a8e6cf] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center font-black text-white">
                    4
                  </div>
                  <h3 className="font-black uppercase text-sm">Sistema de pistas</h3>
                </div>
                <p className="text-sm font-medium text-black/70 leading-relaxed mb-3">
                  Cada intento te revela 5 pistas sobre tu canción comparada con la correcta:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="border-2 border-black bg-white p-2 text-center">
                    <div className="font-black">GEN</div>
                    <div className="text-black/60">Género</div>
                  </div>
                  <div className="border-2 border-black bg-white p-2 text-center">
                    <div className="font-black">DEC</div>
                    <div className="text-black/60">Década</div>
                  </div>
                  <div className="border-2 border-black bg-white p-2 text-center">
                    <div className="font-black">PAÍ</div>
                    <div className="text-black/60">País</div>
                  </div>
                  <div className="border-2 border-black bg-white p-2 text-center">
                    <div className="font-black">IDI</div>
                    <div className="text-black/60">Idioma</div>
                  </div>
                  <div className="border-2 border-black bg-white p-2 text-center col-span-2 sm:col-span-1">
                    <div className="font-black">VOZ</div>
                    <div className="text-black/60">Voces</div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Colores de las pistas */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
              Significado de los colores
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 border-2 border-black bg-[#a8e6cf]">
                <div className="w-8 h-8 bg-[#a8e6cf] border-2 border-black"></div>
                <div>
                  <div className="font-black uppercase text-sm">Verde = Coincide</div>
                  <div className="text-xs text-black/70">Este atributo es igual al de la canción correcta</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 border-2 border-black bg-[#ff6b6b]">
                <div className="w-8 h-8 bg-[#ff6b6b] border-2 border-black"></div>
                <div>
                  <div className="font-black uppercase text-sm">Rojo = No coincide</div>
                  <div className="text-xs text-black/70">Este atributo es diferente al de la canción correcta</div>
                </div>
              </div>
            </div>
          </section>

          {/* Consejos */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
              💡 Consejos y estrategias
            </h2>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-lg">🎧</span>
                <p className="text-sm font-medium text-black/80">
                  <strong>Escucha poco al principio:</strong> Intenta reconocer la canción con solo unos segundos. 
                  El ritmo, los primeros acordes o la voz suelen ser suficientes.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">🎯</span>
                <p className="text-sm font-medium text-black/80">
                  <strong>Usa las pistas:</strong> Si no aciertas, analiza las pistas. Por ejemplo, si el género 
                  coincide pero la década no, busca canciones similares de otras épocas.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">📱</span>
                <p className="text-sm font-medium text-black/80">
                  <strong>Comparte tu resultado:</strong> Al terminar, puedes compartir tu puntuación en redes 
                  sin revelar la canción. ¡Reta a tus amigos!
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">📅</span>
                <p className="text-sm font-medium text-black/80">
                  <strong>Juega cada día:</strong> Hay una nueva canción cada día a medianoche. 
                  Mantén tu racha jugando diariamente.
                </p>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-[#a8e6cf] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              🎵 ¡Jugar ahora!
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 border-4 border-black bg-black p-4 text-center">
          <p className="text-white text-sm font-bold uppercase tracking-wide">
            Songdle — El Wordle de canciones
          </p>
          <p className="text-white/60 text-xs mt-1">
            Una nueva canción cada día
          </p>
        </footer>
      </div>
    </div>
  );
}

