import Link from "next/link";
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
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-block border-4 border-black bg-white px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
            <h1 className="text-6xl font-black text-black tracking-tight">
              404
            </h1>
          </div>
          
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
            className="block w-full py-4 bg-[#a8e6cf] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            🎵 Volver a jugar
          </Link>
          
          <Link
            href="/como-jugar"
            className="block w-full py-3 bg-white border-4 border-black font-bold uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
          >
            ¿Cómo se juega?
          </Link>
        </div>

        <div className="mt-8 border-4 border-black bg-black p-3">
          <p className="text-white text-xs font-bold uppercase tracking-wide">
            Songdle — El Wordle de canciones
          </p>
        </div>
      </div>
    </div>
  );
}

