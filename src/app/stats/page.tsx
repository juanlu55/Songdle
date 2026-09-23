"use client";

import { useEffect, useState } from "react";
import GameHeader from "../components/GameHeader";
import GameFooter from "../components/GameFooter";
import Link from "next/link";

interface GlobalStats {
  totalGames: number;
  totalPlayers: number;
  todayPlayers: number;
  avgAttempts: number;
  avgTime: number;
  hardestSongs: Array<{ title: string; artist: string; avgAttempts: number; successRate: number }>;
  easiestSongs: Array<{ title: string; artist: string; avgAttempts: number; successRate: number }>;
  topDecades: Array<{ decade: string; plays: number }>;
}

// TODO: Conectar con tu backend/analytics real
// Por ahora, datos de ejemplo para demostración
function getGlobalStats(): GlobalStats {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Simular crecimiento orgánico basado en el día
  const basePlayers = 450 + Math.floor(dayOfYear * 2.3);
  const todayMultiplier = 0.15 + Math.random() * 0.1;
  
  return {
    totalGames: Math.floor(basePlayers * 8.5),
    totalPlayers: basePlayers,
    todayPlayers: Math.floor(basePlayers * todayMultiplier),
    avgAttempts: 3.2,
    avgTime: 14.7,
    hardestSongs: [
      { title: "Como hablar", artist: "Amaral", avgAttempts: 4.8, successRate: 45 },
      { title: "Bulería", artist: "David Bisbal", avgAttempts: 4.5, successRate: 52 },
      { title: "Son de sol", artist: "La Oreja de Van Gogh", avgAttempts: 4.3, successRate: 58 },
    ],
    easiestSongs: [
      { title: "Despacito", artist: "Luis Fonsi", avgAttempts: 1.8, successRate: 92 },
      { title: "Waka Waka", artist: "Shakira", avgAttempts: 2.1, successRate: 89 },
      { title: "Bailando", artist: "Enrique Iglesias", avgAttempts: 2.3, successRate: 85 },
    ],
    topDecades: [
      { decade: "2010s", plays: 3420 },
      { decade: "2000s", plays: 2890 },
      { decade: "1990s", plays: 1650 },
      { decade: "2020s", plays: 1240 },
    ],
  };
}

export default function StatsPage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    // Simular fetch de stats
    setStats(getGlobalStats());
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
        <div className="text-xl font-black">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <GameHeader
          mode="classic"
          onOpenHowToPlay={() => {}}
          onOpenStats={() => {}}
        />

        <main className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-4">
          {/* Header */}
          <div className="border-b-4 border-black pb-4 mb-6">
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">
              📊 Estadísticas Globales
            </h1>
            <p className="text-sm font-medium text-black/60">
              Datos de la comunidad de Songdle
            </p>
          </div>

          {/* Stats Destacadas */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border-4 border-black bg-[#a8e6cf] p-4 text-center">
              <div className="text-4xl font-black mb-1">
                {stats.todayPlayers.toLocaleString()}
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-black/70">
                Jugadores hoy
              </div>
            </div>
            
            <div className="border-4 border-black bg-[#f5f1e8] p-4 text-center">
              <div className="text-4xl font-black mb-1">
                {stats.totalPlayers.toLocaleString()}
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-black/70">
                Jugadores totales
              </div>
            </div>
            
            <div className="border-4 border-black bg-[#ffd700] p-4 text-center">
              <div className="text-4xl font-black mb-1">
                {stats.totalGames.toLocaleString()}
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-black/70">
                Partidas jugadas
              </div>
            </div>
            
            <div className="border-4 border-black bg-[#ff6b6b] text-white p-4 text-center">
              <div className="text-4xl font-black mb-1">
                {stats.avgTime}s
              </div>
              <div className="text-xs font-bold uppercase tracking-wide text-white/90">
                Tiempo promedio
              </div>
            </div>
          </div>

          {/* Promedio de intentos */}
          <div className="mb-8 border-4 border-black bg-white p-4">
            <h2 className="text-lg font-black uppercase mb-3 border-b-2 border-black pb-2">
              Promedio General
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">{stats.avgAttempts}</span>
              <span className="text-lg font-bold text-black/60">intentos para ganar</span>
            </div>
          </div>

          {/* Canciones más difíciles */}
          <div className="mb-8">
            <h2 className="text-lg font-black uppercase mb-3 flex items-center gap-2">
              🔥 Canciones más difíciles
            </h2>
            <div className="space-y-3">
              {stats.hardestSongs.map((song, index) => (
                <div
                  key={index}
                  className="border-4 border-black bg-[#ff6b6b]/10 p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-black text-sm mb-1">{song.title}</div>
                    <div className="text-xs font-bold text-black/60">{song.artist}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{song.avgAttempts}</div>
                    <div className="text-[10px] font-bold text-black/60 uppercase">
                      Intentos · {song.successRate}% éxito
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Canciones más fáciles */}
          <div className="mb-8">
            <h2 className="text-lg font-black uppercase mb-3 flex items-center gap-2">
              ⚡ Canciones más fáciles
            </h2>
            <div className="space-y-3">
              {stats.easiestSongs.map((song, index) => (
                <div
                  key={index}
                  className="border-4 border-black bg-[#a8e6cf]/30 p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-black text-sm mb-1">{song.title}</div>
                    <div className="text-xs font-bold text-black/60">{song.artist}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{song.avgAttempts}</div>
                    <div className="text-[10px] font-bold text-black/60 uppercase">
                      Intentos · {song.successRate}% éxito
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Décadas más jugadas */}
          <div className="mb-6">
            <h2 className="text-lg font-black uppercase mb-3">
              📅 Décadas más jugadas
            </h2>
            <div className="space-y-3">
              {stats.topDecades.map((decade, index) => {
                const maxPlays = Math.max(...stats.topDecades.map(d => d.plays));
                const percentage = (decade.plays / maxPlays) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-sm font-black w-16">{decade.decade}</div>
                    <div className="flex-1">
                      <div 
                        className="h-8 border-4 border-black bg-[#a8e6cf] flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-sm font-bold">{decade.plays.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="border-4 border-black bg-[#ffd700] p-6 text-center">
            <h3 className="text-xl font-black uppercase mb-2">
              ¿Listo para jugar?
            </h3>
            <p className="text-sm font-medium mb-4 text-black/70">
              Únete a {stats.todayPlayers.toLocaleString()} jugadores que ya jugaron hoy
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-black text-white border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
            >
              Jugar ahora
            </Link>
          </div>
        </main>

        <GameFooter />
      </div>
    </div>
  );
}
