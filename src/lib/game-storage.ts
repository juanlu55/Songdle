import type { GameMode } from "@/lib/game-modes";
import { GAME_MODES, emptyGuessDistribution } from "@/lib/game-modes";
import { getMadridDateString } from "@/lib/madrid-date";
import type { CluesAttempt, StageActionKind } from "@/lib/clues-game";

export interface ClueMatch {
  genre: boolean;
  decade: boolean;
  country: boolean;
  language: boolean;
  voices: boolean;
}

export interface ClassicAttempt {
  guess: string;
  time: number;
  isCorrect: boolean;
  clues?: ClueMatch;
}

export interface ClassicGameState {
  attempts: ClassicAttempt[];
  elapsedTime: number;
  gameWon: boolean;
  gameLost: boolean;
  gameDate: string;
}

export interface CluesGameState {
  attempts: CluesAttempt[];
  stageIndex: number;
  lastAction: StageActionKind | null;
  gameWon: boolean;
  gameLost: boolean;
  gameDate: string;
}

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: { [key: number]: number };
  totalTime: number;
  lastPlayedDate: string;
}

export function defaultStatistics(mode: GameMode = "classic"): Statistics {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: emptyGuessDistribution(GAME_MODES[mode].maxAttempts),
    totalTime: 0,
    lastPlayedDate: "",
  };
}

export function loadJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadStatistics(mode: GameMode): Statistics {
  const saved = loadJson<Statistics>(GAME_MODES[mode].statsKey);
  if (!saved) return defaultStatistics(mode);
  return {
    ...defaultStatistics(mode),
    ...saved,
    guessDistribution: {
      ...emptyGuessDistribution(GAME_MODES[mode].maxAttempts),
      ...saved.guessDistribution,
    },
  };
}

export function saveStatistics(mode: GameMode, stats: Statistics) {
  saveJson(GAME_MODES[mode].statsKey, stats);
}

function madridDateOffset(dateString: string, days: number) {
  const [year, month, day] = dateString.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, 12));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

export function updateModeStatistics({
  mode,
  previous,
  won,
  attemptCount,
  time = 0,
  today = getMadridDateString(),
}: {
  mode: GameMode;
  previous: Statistics;
  won: boolean;
  attemptCount: number;
  time?: number;
  today?: string;
}): Statistics {
  const wonYesterday = previous.lastPlayedDate === madridDateOffset(today, -1);
  const continueStreak = won && (previous.lastPlayedDate === "" || wonYesterday);

  const next: Statistics = {
    gamesPlayed: previous.gamesPlayed + 1,
    gamesWon: won ? previous.gamesWon + 1 : previous.gamesWon,
    currentStreak: won ? (continueStreak ? previous.currentStreak + 1 : 1) : 0,
    maxStreak: 0,
    guessDistribution: { ...previous.guessDistribution },
    totalTime: won ? previous.totalTime + time : previous.totalTime,
    lastPlayedDate: today,
  };

  const maxAttempts = GAME_MODES[mode].maxAttempts;
  if (won && attemptCount >= 1 && attemptCount <= maxAttempts) {
    next.guessDistribution[attemptCount] =
      (next.guessDistribution[attemptCount] || 0) + 1;
  }

  next.maxStreak = Math.max(next.currentStreak, previous.maxStreak);
  return next;
}

export function hasWonModeToday(mode: GameMode, today = getMadridDateString()) {
  const state = loadJson<{ gameWon?: boolean; gameDate?: string }>(
    GAME_MODES[mode].storageKey
  );
  return Boolean(state?.gameWon && state.gameDate === today);
}

export function hasTripleWinToday(today = getMadridDateString()) {
  return (
    hasWonModeToday("classic", today) &&
    hasWonModeToday("tres", today) &&
    hasWonModeToday("cinco", today)
  );
}

const TRIPLE_WIN_KEY = "songdle-triple-win-date";

export function markTripleWinIfNeeded(today = getMadridDateString()) {
  if (!hasTripleWinToday(today)) return false;
  const already = typeof window !== "undefined" ? localStorage.getItem(TRIPLE_WIN_KEY) : null;
  if (already === today) return false;
  if (typeof window !== "undefined") {
    localStorage.setItem(TRIPLE_WIN_KEY, today);
  }
  return true;
}
