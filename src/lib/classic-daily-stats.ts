import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { GAME_MODES, type GameMode } from "@/lib/game-modes";

const PLAYER_KEY = "songdle-player-id";
const REPORTED_KEY = "songdle-classic-reported-date";

/** Clave de "partida de hoy ya enviada". La del clásico se mantiene por compatibilidad. */
function reportedKey(mode: GameMode) {
  return mode === "classic" ? REPORTED_KEY : `songdle-${mode}-reported-date`;
}

export interface ClassicDailyStats {
  played: number;
  won: number;
  winRate: number | null;
  avgWinSeconds: number | null;
}

export interface ClassicResult {
  gameDate: string;
  songId: string;
  won: boolean;
  attempts: number;
  elapsedSeconds: number;
}

let client: SupabaseClient | null | undefined;

function getClient() {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    client = null;
    return null;
  }
  client = createClient(url, key);
  return client;
}

function getPlayerId() {
  const existing = localStorage.getItem(PLAYER_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(PLAYER_KEY, id);
  return id;
}

function clampElapsed(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return 0;
  return Math.min(30, Math.round(seconds * 100) / 100);
}

function toCount(value: unknown) {
  const count = Number(value);
  return Number.isFinite(count) ? count : 0;
}

function toNullableNumber(value: unknown) {
  if (value == null || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

interface Progress {
  gameDate: string;
  songId: string;
  attempts: number;
  elapsedSeconds: number;
}

async function saveProgress(mode: GameMode, params: Progress & { finished: boolean; won: boolean }) {
  const supabase = getClient();
  if (!supabase) return { ok: false };
  const max = GAME_MODES[mode].maxAttempts;
  const { error } = await supabase.rpc("save_game_progress", {
    p_mode: mode,
    p_player_id: getPlayerId(),
    p_game_date: params.gameDate,
    p_song_id: params.songId,
    p_attempts: Math.min(max, Math.max(0, Math.round(params.attempts))),
    p_elapsed_seconds: clampElapsed(params.elapsedSeconds),
    p_finished: params.finished,
    p_won: params.won,
  });
  return { ok: !error };
}

async function submitResult(mode: GameMode, result: ClassicResult) {
  const key = reportedKey(mode);
  if (localStorage.getItem(key) === result.gameDate) return;
  const { ok } = await saveProgress(mode, { ...result, finished: true });
  if (ok) {
    localStorage.setItem(key, result.gameDate);
    return;
  }
  console.error("No se pudo guardar la partida de hoy");
}

/**
 * Guarda una partida en curso: al primer play (0 intentos) y tras cada intento fallido.
 * Si el jugador abandona, queda la fila en estado 'playing' con los intentos que llevaba.
 */
export async function saveModeProgress(mode: GameMode, progress: Progress): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(reportedKey(mode)) === progress.gameDate) return;
    await saveProgress(mode, { ...progress, finished: false, won: false });
  } catch {
    // Sin localStorage o sin red: no bloquear el juego
  }
}

export function saveClassicProgress(progress: Progress): Promise<void> {
  return saveModeProgress("classic", progress);
}

/** Guarda el resultado final de un modo de pistas (Tres/Cinco). */
export async function publishModeResult(mode: GameMode, result: ClassicResult): Promise<void> {
  if (typeof window === "undefined" || result.attempts < 1) return;
  try {
    await submitResult(mode, result);
  } catch {
    // Sin localStorage o sin red: no bloquear el juego
  }
}

export async function fetchClassicDailyStats(gameDate: string): Promise<ClassicDailyStats | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("classic_daily_stats", { p_date: gameDate });
  if (error || data == null) {
    if (error) console.error("No se pudieron cargar las stats de hoy");
    return null;
  }

  const row = (Array.isArray(data) ? data[0] : data) as {
    played?: unknown;
    won?: unknown;
    win_rate?: unknown;
    avg_win_seconds?: unknown;
  } | null;
  if (!row) return null;

  const played = toCount(row.played);
  const won = toCount(row.won);
  return {
    played,
    won,
    winRate: toNullableNumber(row.win_rate) ?? (played > 0 ? Math.round((won / played) * 100) : null),
    avgWinSeconds: toNullableNumber(row.avg_win_seconds),
  };
}

export async function publishClassicResult(result: ClassicResult): Promise<ClassicDailyStats | null> {
  if (typeof window === "undefined" || result.attempts < 1) return null;
  await submitResult("classic", result);
  return fetchClassicDailyStats(result.gameDate);
}
