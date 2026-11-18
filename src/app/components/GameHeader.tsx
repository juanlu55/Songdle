"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { GameMode } from "@/lib/game-modes";
import { GAME_MODES } from "@/lib/game-modes";
import ModeTabs from "./ModeTabs";
import { Logo } from "./Brand";

function HeaderCopy({
  mode,
  tagline,
  description,
}: {
  mode: GameMode;
  tagline?: string;
  description?: string;
}) {
  const searchParams = useSearchParams();
  const partner = searchParams.get("partner");
  const config = GAME_MODES[mode];
  const shownTagline = partner
    ? "La canción del día"
    : tagline ?? config.tagline;
  const shownDescription = partner
    ? "Una canción cada día. Adivínala antes de que se acaben las pistas."
    : description ?? config.description;

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-rec" aria-hidden="true"></div>
        <p className="text-black/60 text-xs font-mono font-bold uppercase tracking-widest">
          {shownTagline}
        </p>
      </div>
      <p className="mt-3 text-sm font-medium text-black/70 max-w-xl leading-relaxed">
        {shownDescription}
      </p>
    </>
  );
}

export default function GameHeader({
  mode,
  onOpenHowToPlay,
  onOpenStats,
  tagline,
  description,
}: {
  mode: GameMode;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
  tagline?: string;
  description?: string;
}) {
  return (
    <header className="mb-6 relative" role="banner">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-[1.6rem] min-[400px]:text-[2rem] sm:text-5xl text-black leading-none pt-1">
          <Logo />
        </h1>

        <nav className="flex gap-2" aria-label="Navegación principal">
          <button
            onClick={onOpenHowToPlay}
            className="border-3 border-black bg-white p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-hard transition-all"
            title="Cómo jugar"
            aria-label="Abrir instrucciones de cómo jugar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            onClick={onOpenStats}
            className="border-3 border-black bg-white p-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-hard transition-all"
            title="Ver estadísticas"
            aria-label="Ver estadísticas del juego"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </nav>
      </div>

      <Suspense fallback={<div className="mb-3 h-8" />}>
        <ModeTabs current={mode} />
      </Suspense>

      <Suspense fallback={null}>
        <HeaderCopy mode={mode} tagline={tagline} description={description} />
      </Suspense>
    </header>
  );
}
