import Link from "next/link";
import { Disc, Logo } from "@/app/components/Brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que buscas no existe. Vuelve a Songdle para adivinar la canción del día.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-papel flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Link href="/" aria-label="Songdle, ir al juego del día" className="mb-8 inline-block text-3xl text-black">
            <Logo />
          </Link>
          <h1 className="mb-4 flex items-center justify-center gap-2 text-7xl font-black text-black">
            <span className="sr-only">404</span>
            <span aria-hidden="true" className="flex items-center gap-2">4<Disc className="h-[0.74em] w-[0.74em]" />4</span>
          </h1>
          
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
            ¡Página no encontrada!
          </h2>
          
          <p className="text-black/60 font-medium mb-8">
            Parece que esta canción no está en nuestra lista de reproducción. 
            ¿Por qué no vuelves al juego?
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-4 bg-acierto border-3 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-hard transition-all"
          >
            🎵 Volver a jugar
          </Link>
          
          <Link
            href="/como-jugar"
            className="block w-full py-3 bg-white border-3 border-black font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-hard transition-all text-sm"
          >
            ¿Cómo se juega?
          </Link>
        </div>

        <div className="mt-8 border-3 border-black bg-black p-3">
          <p className="text-white text-xs font-bold uppercase tracking-wide">
            Songdle — El Wordle de canciones
          </p>
        </div>
      </div>
    </div>
  );
}

