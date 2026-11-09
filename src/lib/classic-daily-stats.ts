import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PLAYER_KEY = "songdle-player-id";
const REPORTED_KEY = "songdle-classic-reported-date";

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

async function submitClassicResult(result: ClassicResult) {
  const supabase = getClient();
  if (!supabase) return;
  if (localStorage.getItem(REPORTED_KEY) === result.gameDate) return;

  const { error } = await supabase.from("game_results").insert({
    player_id: getPlayerId(),
    mode: "classic",
    game_date: result.gameDate,
    song_id: result.songId,
    won: result.won,
    attempts: Math.min(6, Math.max(1, Math.round(result.attempts))),
    elapsed_seconds: clampElapsed(result.elapsedSeconds),
  });

  if (!error || error.code === "23505") {
    localStorage.setItem(REPORTED_KEY, result.gameDate);
    return;
  }

  console.error("No se pudo guardar la partida de hoy");
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
  await submitClassicResult(result);
  return fetchClassicDailyStats(result.gameDate);
}
