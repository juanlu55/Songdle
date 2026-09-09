import {
  songs,
  workingPremiumSongs,
  workingRegularSongs,
  type Song,
} from "@/app/data/songs";
import { isPlayableSong } from "@/lib/audio";
import type { GameMode } from "@/lib/game-modes";
import { GAME_MODES } from "@/lib/game-modes";
import { getMadridDayOfYear } from "@/lib/madrid-date";
import { enrichSong, songHasCincoContent, songHasLyrics } from "@/lib/song-content";

export function selectDailySong({
  dayOfYear,
  premium,
  regular,
  catalog,
  requires,
}: {
  dayOfYear: number;
  premium: Song[];
  regular: Song[];
  catalog: Song[];
  requires?: (song: Song) => boolean;
}): Song {
  const matches = (song: Song | undefined | null): song is Song =>
    isPlayableSong(song) && (requires ? requires(song) : true);

  const playablePool = [...premium, ...regular].filter(matches);

  let candidate: Song | undefined;
  if (dayOfYear < premium.length) {
    candidate = premium[dayOfYear];
  } else if (dayOfYear < premium.length + regular.length) {
    candidate = regular[dayOfYear - premium.length];
  }

  if (matches(candidate)) {
    return candidate;
  }

  const pool = playablePool.length > 0 ? playablePool : catalog.filter(matches);
  if (pool.length === 0) {
    throw new Error("Songdle no tiene ninguna canción con audio reproducible");
  }

  const start = ((dayOfYear % pool.length) + pool.length) % pool.length;
  for (let i = 0; i < pool.length; i++) {
    const song = pool[(start + i) % pool.length];
    if (matches(song)) return song;
  }

  return pool[0];
}

function requirementsForMode(mode: GameMode): ((song: Song) => boolean) | undefined {
  if (mode === "tres") {
    return (song) => songHasLyrics(song);
  }
  if (mode === "cinco") {
    return (song) => songHasCincoContent(song);
  }
  return undefined;
}

export const getTodaySong = (
  date: Date = new Date(),
  mode: GameMode = "classic"
): Song => {
  const selected = selectDailySong({
    dayOfYear: getMadridDayOfYear(date) + GAME_MODES[mode].dayOffset,
    premium: workingPremiumSongs,
    regular: workingRegularSongs,
    catalog: songs,
    requires: requirementsForMode(mode),
  });
  return enrichSong(selected);
};
