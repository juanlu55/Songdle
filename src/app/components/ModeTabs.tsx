"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MODE_ORDER, GAME_MODES, type GameMode } from "@/lib/game-modes";
import { amplitudeEvents } from "@/lib/amplitude";

export default function ModeTabs({ current }: { current: GameMode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const partner = searchParams.get("partner");

  if (partner) {
    return (
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-block border-4 border-black bg-black px-3 py-1 text-white">
          <p className="text-xs font-black uppercase tracking-wider">
            {GAME_MODES[current].title}
          </p>
        </div>
        {partner === "demo" && (
          <span className="border-2 border-black bg-[#ffd700] px-2 py-0.5 text-[10px] font-black uppercase">
            Demo
          </span>
        )}
      </div>
    );
  }

  return (
    <nav className="mb-3 flex flex-wrap gap-2" aria-label="Modos de juego">
      {MODE_ORDER.map((mode) => {
        const config = GAME_MODES[mode];
        const active = mode === current;
        return (
          <Link
            key={mode}
            href={config.path}
            onClick={() => {
              if (mode !== current) {
                amplitudeEvents.modeSelected(mode, current);
              }
            }}
            aria-current={active ? "page" : undefined}
            className={`border-4 border-black px-3 py-1 text-xs font-black uppercase tracking-wide transition-all ${
              active
                ? "bg-black text-white shadow-none"
                : "bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {config.title}
          </Link>
        );
      })}
      <span className="sr-only">Estás en {pathname}</span>
    </nav>
  );
}
