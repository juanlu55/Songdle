"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "songdle-game-state";

export default function ResetPage() {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(true);

  useEffect(() => {
    // Eliminar los datos del localStorage
    localStorage.removeItem(STORAGE_KEY);
    
    // Esperar un momento y redirigir
    setTimeout(() => {
      setIsResetting(false);
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }, 500);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          {isResetting ? (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-spin inline-block">🔄</div>
              </div>
              <div className="border-4 border-black bg-black text-white p-4 text-center">
                <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
                  Reseteando
                </h1>
                <p className="text-sm font-bold text-white/60 uppercase tracking-wide">
                  Eliminando progreso guardado
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 inline-block">✅</div>
              </div>
              <div className="border-4 border-black bg-[#a8e6cf] p-4 text-center">
                <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
                  ¡Listo!
                </h1>
                <p className="text-sm font-bold text-black/60 uppercase tracking-wide">
                  Redirigiendo al juego...
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="inline-block px-6 py-3 bg-black text-white border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
          >
            Volver al Juego
          </button>
        </div>
      </div>
    </div>
  );
}

