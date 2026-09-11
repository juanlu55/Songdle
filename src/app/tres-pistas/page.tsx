import type { Metadata } from "next";
import { Suspense } from "react";
import CluesGame from "../components/CluesGame";

export const metadata: Metadata = {
  title: "Tres pistas",
  description:
    "Como Pistaza, de la radio: tres pistas de difícil a fácil para adivinar la canción del día. Melodía, letra y fragmento. El Wordle de canciones, modo Tres pistas.",
  alternates: { canonical: "/tres-pistas" },
  openGraph: {
    title: "Songdle · Tres pistas",
    description: "Como Pistaza: melodía, letra y fragmento. Adivina la canción del día.",
    url: "https://songdle.es/tres-pistas",
  },
};

function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center">
      <p className="font-black uppercase tracking-wide">Cargando…</p>
    </div>
  );
}

export default function TresPistasPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CluesGame mode="tres" />
    </Suspense>
  );
}
