import Link from "next/link";
import BrandBar from "@/app/components/BrandBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Songdle - El Wordle de canciones español",
  description: "Conoce Songdle, el juego diario de adivinar canciones inspirado en Wordle. Creado con canciones de Los 40 Principales desde 1990. Historia, equipo y contacto.",
  keywords: [
    "sobre Songdle", "qué es Songdle", "Wordle canciones español",
    "juego musical español", "Los 40 Principales juego"
  ],
  alternates: {
    canonical: "/sobre-songdle",
  },
  openGraph: {
    title: "Sobre Songdle - El Wordle de canciones español",
    description: "Conoce Songdle, el juego diario de adivinar canciones inspirado en Wordle.",
    url: "https://songdle.es/sobre-songdle",
    type: "article",
  },
};

export default function SobreSongdle() {
  return (
    <div className="min-h-screen bg-papel py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <BrandBar cta="Jugar" />
          
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight leading-tight text-balance">
              Sobre Songdle
            </h1>
          </div>
        </header>

        {/* Contenido principal */}
        <main>
          {/* Qué es Songdle */}
          <section className="bg-white border-3 border-black p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-3 border-black pb-2">
              🎵 ¿Qué es Songdle?
            </h2>
            <p className="text-black/80 font-medium leading-relaxed mb-4">
              <strong>Songdle</strong> es un juego gratuito de adivinar canciones, inspirado en el popular 
              <strong> Wordle</strong>. En lugar de palabras, aquí el reto es escuchar un fragmento de una 
              canción e identificarla antes de que se acabe el tiempo.
            </p>
            <p className="text-black/80 font-medium leading-relaxed">
              Cada día a medianoche se selecciona una nueva canción de nuestra biblioteca musical, 
              que incluye éxitos que han sido <strong>número 1 en Los 40 Principales</strong> desde 1990 
              hasta la actualidad.
            </p>
          </section>

          {/* Cómo surgió */}
          <section className="bg-white border-3 border-black p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-3 border-black pb-2">
              💡 La idea detrás del juego
            </h2>
            <p className="text-black/80 font-medium leading-relaxed mb-4">
              Songdle nació de la combinación de dos pasiones: los <strong>juegos de palabras diarios</strong> 
              como Wordle y el <strong>amor por la música</strong>. Queríamos crear una experiencia donde 
              el conocimiento musical se convirtiera en un reto divertido.
            </p>
            <p className="text-black/80 font-medium leading-relaxed">
              El sistema de pistas (género, década, país, idioma y voces) está diseñado para que incluso 
              si no reconoces la canción al instante, puedas acercarte usando la lógica y tu 
              conocimiento musical general.
            </p>
          </section>

          {/* Características */}
          <section className="bg-white border-3 border-black p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-3 border-black pb-2">
              ✨ Características
            </h2>
            
            <div className="grid gap-4">
              <div className="border-2 border-black bg-papel p-4">
                <h3 className="font-black uppercase text-sm mb-2">🆓 100% Gratuito</h3>
                <p className="text-sm text-black/70">
                  Sin suscripciones, sin anuncios invasivos, sin límites. Juega todos los días gratis.
                </p>
              </div>
              
              <div className="border-2 border-black bg-papel p-4">
                <h3 className="font-black uppercase text-sm mb-2">📅 Una canción por día</h3>
                <p className="text-sm text-black/70">
                  Todos los jugadores adivinan la misma canción cada día. Compara resultados con amigos.
                </p>
              </div>
              
              <div className="border-2 border-black bg-papel p-4">
                <h3 className="font-black uppercase text-sm mb-2">📊 Estadísticas personales</h3>
                <p className="text-sm text-black/70">
                  Sigue tu progreso, mantén tu racha y mejora tu tiempo medio de acierto.
                </p>
              </div>
              
              <div className="border-2 border-black bg-papel p-4">
                <h3 className="font-black uppercase text-sm mb-2">📱 Diseño responsive</h3>
                <p className="text-sm text-black/70">
                  Juega desde cualquier dispositivo: móvil, tablet o ordenador.
                </p>
              </div>
              
              <div className="border-2 border-black bg-acierto p-4">
                <h3 className="font-black uppercase text-sm mb-2">🎤 Música de Los 40</h3>
                <p className="text-sm text-black/70">
                  Canciones que han sido número 1 en Los 40 Principales desde 1990. ¡Puro éxito!
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white border-3 border-black p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-3 border-black pb-2">
              ❓ Preguntas frecuentes
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-black text-sm mb-2">¿A qué hora cambia la canción?</h3>
                <p className="text-sm text-black/70">
                  La canción del día cambia a medianoche, hora española (CET/CEST).
                </p>
              </div>
              
              <div className="border-t-2 border-black/20 pt-4">
                <h3 className="font-black text-sm mb-2">¿Puedo jugar varias veces al día?</h3>
                <p className="text-sm text-black/70">
                  Solo hay una canción por día. Una vez que termines (ganes o pierdas), 
                  tendrás que esperar al día siguiente para una nueva.
                </p>
              </div>
              
              <div className="border-t-2 border-black/20 pt-4">
                <h3 className="font-black text-sm mb-2">¿Se guardan mis estadísticas?</h3>
                <p className="text-sm text-black/70">
                  Sí, tus estadísticas se guardan en tu navegador. Si borras los datos del navegador, 
                  se perderán.
                </p>
              </div>
              
              <div className="border-t-2 border-black/20 pt-4">
                <h3 className="font-black text-sm mb-2">¿Puedo sugerir canciones?</h3>
                <p className="text-sm text-black/70">
                  ¡Por supuesto! Nos encanta recibir sugerencias. Utiliza nuestras redes sociales 
                  para hacérnoslas llegar.
                </p>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section className="bg-white border-3 border-black p-6 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-3 border-black pb-2">
              📬 Contacto
            </h2>
            <p className="text-black/80 font-medium leading-relaxed mb-4">
              ¿Tienes sugerencias, has encontrado un error o simplemente quieres saludar? 
              ¡Nos encantaría saber de ti!
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-medium">
                📧 Email: <a href="mailto:hola@songdle.es" className="text-blue-600 underline hover:no-underline">hola@songdle.es</a>
              </p>
              {/* Añade redes sociales cuando las tengas
              <p className="font-medium">
                🐦 Twitter: <a href="https://twitter.com/songdle_es" className="text-blue-600 underline hover:no-underline">@songdle_es</a>
              </p>
              */}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center space-y-4">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-acierto border-3 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-hard transition-all"
            >
              🎵 ¡Jugar ahora!
            </Link>
            
            <div>
              <Link
                href="/como-jugar"
                className="inline-block px-6 py-3 bg-white border-3 border-black font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-hard transition-all text-sm"
              >
                Cómo jugar →
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 border-3 border-black bg-black p-4 text-center">
          <p className="text-white text-sm font-bold uppercase tracking-wide">
            Songdle — El Wordle de canciones
          </p>
          <p className="text-white/60 text-xs mt-1">
            Hecho con ❤️ para amantes de la música
          </p>
        </footer>
      </div>
    </div>
  );
}

