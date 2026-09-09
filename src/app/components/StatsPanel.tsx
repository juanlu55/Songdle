import type { GameMode } from "@/lib/game-modes";
import { GAME_MODES } from "@/lib/game-modes";
import type { Statistics } from "@/lib/game-storage";

export default function StatsPanel({
  mode,
  statistics,
  highlightAttempt,
  tripleWin,
  showPointLabels = false,
}: {
  mode: GameMode;
  statistics: Statistics;
  highlightAttempt?: number | null;
  tripleWin?: boolean;
  showPointLabels?: boolean;
}) {
  const maxAttempts = GAME_MODES[mode].maxAttempts;
  const bars = Array.from({ length: maxAttempts }, (_, i) => i + 1);
  const maxCount = Math.max(...bars.map((num) => statistics.guessDistribution[num] || 0), 1);

  return (
    <div>
      {tripleWin && (
        <div className="mb-4 border-4 border-black bg-[#ffd700] p-3 text-center">
          <p className="text-sm font-black uppercase tracking-wide">3/3 del día</p>
          <p className="text-[10px] font-bold text-black/60 uppercase">
            Has ganado Clásico, Tres pistas y Cinco pistas
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
          <div className="text-2xl font-black">{statistics.gamesPlayed}</div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Jugadas</div>
        </div>
        <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
          <div className="text-2xl font-black">
            {statistics.gamesPlayed > 0
              ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
              : 0}%
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Victorias</div>
        </div>
        <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
          <div className="text-2xl font-black">{statistics.currentStreak}</div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Racha</div>
        </div>
        <div className="text-center border-2 border-black p-3 bg-[#f5f1e8]">
          <div className="text-2xl font-black">{statistics.maxStreak}</div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">Mejor</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-black uppercase tracking-wide mb-3 text-black/60">
          Distribución de victorias
        </h4>
        {bars.map((num) => {
          const count = statistics.guessDistribution[num] || 0;
          const percentage = (count / maxCount) * 100;
          const isCurrentGame = highlightAttempt === num;
          const points = maxAttempts - num + 1;

          return (
            <div key={num} className="flex items-center gap-2 mb-2">
              <div className="text-xs font-black w-3">{num}</div>
              <div className="flex-1 flex items-center">
                <div
                  className={`h-6 border-2 border-black flex items-center justify-end pr-2 transition-all ${
                    isCurrentGame ? "bg-[#a8e6cf]" : "bg-[#f5f1e8]"
                  }`}
                  style={{ width: `${Math.max(percentage, 8)}%` }}
                >
                  <span className="text-xs font-bold">{count}</span>
                </div>
              </div>
              {showPointLabels && (
                <div className="text-[10px] font-bold uppercase text-black/40 w-10 text-right">
                  {points} pts
                </div>
              )}
            </div>
          );
        })}
      </div>

      {mode === "classic" && statistics.gamesWon > 0 && (
        <div className="border-2 border-black bg-[#f5f1e8] p-3 text-center">
          <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">
            Tiempo medio
          </div>
          <div className="text-xl font-black font-mono">
            {(statistics.totalTime / statistics.gamesWon).toFixed(2)}s
          </div>
        </div>
      )}
    </div>
  );
}
