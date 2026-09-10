import type { Metadata } from "next";
import { Suspense } from "react";
import CluesGame from "../components/CluesGame";

export const metadata: Metadata = {
  title: "Cinco pistas",
  description:
    "Como La Pista Musical de Pasapalabra: cinco pistas que se van aclarando, cada audio de un momento distinto de la canción. El Wordle de canciones, modo Cinco pistas.",
  alternates: { canonical: "/cinco-pistas" },
  openGraph: {
    title: "Songdle · Cinco pistas",
    description: "Como Pasapalabra: cinco pistas, de difícil a fácil. Adivina la canción del día.",
    url: "https://songdle.es/cinco-pistas",
  },
};

function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
      <p className="font-black uppercase tracking-wide">Cargando…</p>
    </div>
  );
}

export default function CincoPistasPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CluesGame mode="cinco" />
    </Suspense>
  );
}
