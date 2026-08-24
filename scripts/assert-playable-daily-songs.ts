import { isPlayableSong } from "../src/lib/audio";
import { getTodaySong, selectDailySong } from "../src/lib/daily-song";
import type { Song } from "../src/app/data/songs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const sample = (overrides: Partial<Song> = {}): Song => ({
  id: overrides.id ?? "1",
  title: "Test",
  artist: "Artist",
  displayName: "Test - Artist",
  audioUrl: overrides.audioUrl ?? "https://example.com/audio.mp4",
  genre: "Pop",
  decade: "2020s",
  country: "España",
  language: "Español",
  voices: "Masculino",
  audioWorking: overrides.audioWorking ?? true,
  ...overrides,
});

const broken = sample({
  id: "broken",
  audioWorking: false,
  audioUrl: "https://recursosweb.prisaradio.com/audios/dest/01000/mp4",
});
const playableA = sample({ id: "a", audioUrl: "https://example.com/a.mp4" });
const playableB = sample({ id: "b", audioUrl: "https://example.com/b.mp4" });

assert(!isPlayableSong(broken), "broken URL should not be playable");
assert(isPlayableSong(playableA), "valid URL should be playable");

const skipped = selectDailySong({
  dayOfYear: 0,
  premium: [broken],
  regular: [playableB],
  catalog: [broken, playableB],
});
assert(skipped.id === "b", `expected fallback to playable B, got ${skipped.id}`);

const kept = selectDailySong({
  dayOfYear: 0,
  premium: [playableA, playableB],
  regular: [],
  catalog: [playableA, playableB],
});
assert(kept.id === "a", `expected to keep premium[0], got ${kept.id}`);

const emptyPremiumUsesRegular = selectDailySong({
  dayOfYear: 5,
  premium: [broken, broken],
  regular: [playableA],
  catalog: [playableA],
});
assert(
  emptyPremiumUsesRegular.id === "a",
  `expected regular playable, got ${emptyPremiumUsesRegular.id}`
);

const today = getTodaySong();
assert(isPlayableSong(today), `today song is not playable: ${today.displayName} ${today.audioUrl}`);

const start = new Date("2026-01-01T12:00:00Z");
for (let i = 0; i < 366; i++) {
  const date = new Date(start);
  date.setUTCDate(start.getUTCDate() + i);
  const song = getTodaySong(date);
  assert(
    isPlayableSong(song),
    `unplayable daily song on ${date.toISOString().slice(0, 10)}: ${song.displayName} (${song.audioUrl})`
  );
}

console.log("✅ daily song selection never returns broken audio");
console.log(`🎵 today: ${today.displayName}`);
console.log(`🔗 ${today.audioUrl}`);
