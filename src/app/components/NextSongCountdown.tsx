"use client";

import { useEffect, useState } from "react";
import { formatCountdown, getMsUntilNextMadridMidnight } from "@/lib/madrid-date";

export default function NextSongCountdown() {
  const [remainingMs, setRemainingMs] = useState(() => getMsUntilNextMadridMidnight());

  useEffect(() => {
    const tick = () => setRemainingMs(getMsUntilNextMadridMidnight());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="border-4 border-black bg-[#f5f1e8] p-4 text-center mb-6">
      <p className="text-[10px] font-black uppercase tracking-wide text-black/60 mb-1">
        Próxima canción en
      </p>
      <p className="text-2xl font-black font-mono tracking-tight">
        {formatCountdown(remainingMs)}
      </p>
    </div>
  );
}
