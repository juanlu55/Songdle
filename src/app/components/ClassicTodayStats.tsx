import type { ClassicDailyStats } from "@/lib/classic-daily-stats";

function paceLine(userSeconds: number, avgSeconds: number) {
  if (avgSeconds <= 0) return null;
  const delta = Math.round((1 - userSeconds / avgSeconds) * 100);
  if (delta > 0) return `Un ${delta}% más rápido que la media`;
  if (delta < 0) return `Un ${Math.abs(delta)}% más lento que la media`;
  return "Justo en la media de hoy";
}

export default function ClassicTodayStats({
  stats,
  won,
  userSeconds,
}: {
  stats: ClassicDailyStats;
  won: boolean;
  userSeconds: number | null;
}) {
  if (stats.played <= 0) return null;

  const winRate = stats.winRate ?? Math.round((stats.won / stats.played) * 100);
  const pace =
    won && userSeconds != null && stats.avgWinSeconds != null
      ? paceLine(userSeconds, stats.avgWinSeconds)
      : null;

  return (
    <div className="mt-6">
      <p className="text-xs font-black uppercase tracking-wide text-black/60 mb-3">Stats de hoy</p>
      <div className="flex gap-4">
        <div className="flex-1 border-4 border-black bg-white p-3 text-center">
          <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">
            Tiempo medio
          </div>
          <div className="text-2xl font-black font-mono">
            {stats.avgWinSeconds == null ? "—" : `${stats.avgWinSeconds.toFixed(2)}s`}
          </div>
        </div>
        <div className="flex-1 border-4 border-black bg-white p-3 text-center">
          <div className="text-xs font-black uppercase tracking-wide text-black/60 mb-1">Acierto</div>
          <div className="text-2xl font-black">{Math.round(winRate)}%</div>
          <div className="text-[10px] font-bold uppercase tracking-wide text-black/60">
            {stats.won} de {stats.played}
          </div>
        </div>
      </div>
      {pace && <p className="mt-3 text-center text-xs font-black uppercase">{pace}</p>}
    </div>
  );
}
