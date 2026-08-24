import {
  songs,
  workingPremiumSongs,
  workingRegularSongs,
  type Song,
} from "@/app/data/songs";
import { isPlayableSong } from "@/lib/audio";
import { getMadridDayOfYear } from "@/lib/madrid-date";

export function selectDailySong({
  dayOfYear,
  premium,
  regular,
  catalog,
}: {
  dayOfYear: number;
  premium: Song[];
  regular: Song[];
  catalog: Song[];
}): Song {
  const playablePool = [...premium, ...regular].filter(isPlayableSong);

  let candidate: Song | undefined;
  if (dayOfYear < premium.length) {
    candidate = premium[dayOfYear];
  } else if (dayOfYear < premium.length + regular.length) {
    candidate = regular[dayOfYear - premium.length];
  }

  if (isPlayableSong(candidate)) {
    return candidate;
  }

  const pool = playablePool.length > 0 ? playablePool : catalog.filter(isPlayableSong);
  if (pool.length === 0) {
    throw new Error("Songdle no tiene ninguna canción con audio reproducible");
  }

  const start = ((dayOfYear % pool.length) + pool.length) % pool.length;
  for (let i = 0; i < pool.length; i++) {
    const song = pool[(start + i) % pool.length];
    if (isPlayableSong(song)) return song;
  }

  return pool[0];
}

export const getTodaySong = (date: Date = new Date()): Song => {
  return selectDailySong({
    dayOfYear: getMadridDayOfYear(date),
    premium: workingPremiumSongs,
    regular: workingRegularSongs,
    catalog: songs,
  });
};
