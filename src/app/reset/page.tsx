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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        {isResetting ? (
          <>
            <div className="text-6xl mb-4 animate-spin">🔄</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Reseteando datos...
            </h1>
            <p className="text-gray-600">
              Eliminando progreso guardado
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Listo!
            </h1>
            <p className="text-gray-600">
              Redirigiendo al juego...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

