import { isPlayableSong } from "../src/lib/audio";
import { getTodaySong, selectDailySong } from "../src/lib/daily-song";
import { songHasCincoContent, songHasLyrics } from "../src/lib/song-content";
import { songOverrides } from "../src/lib/song-overrides";
import {
  applyCluesAction,
  buildStageCells,
  createCluesRoundState,
  clipHint,
  resolveClipWindow,
  stageCopy,
} from "../src/lib/clues-game";
import { buildCluesShareText, buildShareText, getShareUrl } from "../src/lib/share";
import { workingPremiumSongs, workingRegularSongs, songs } from "../src/app/data/songs";
import { getMadridDayOfYear } from "../src/lib/madrid-date";
import { GAME_MODES } from "../src/lib/game-modes";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const overrideIds = Object.keys(songOverrides);
assert(overrideIds.length >= 30, `expected at least 30 overrides, got ${overrideIds.length}`);

for (const id of overrideIds) {
  const song = songs.find((item) => item.id === id);
  assert(song, `override id not in catalog: ${id}`);
  assert(songHasLyrics(song), `override missing lyricLine: ${id}`);
  assert(songHasCincoContent(song), `override missing titleRiddle: ${id}`);
}

const date = new Date("2026-09-09T12:00:00+02:00");
const classic = getTodaySong(date, "classic");
const tres = getTodaySong(date, "tres");
const cinco = getTodaySong(date, "cinco");

assert(isPlayableSong(classic), "classic song must be playable");
assert(isPlayableSong(tres), "tres song must be playable");
assert(isPlayableSong(cinco), "cinco song must be playable");
assert(songHasLyrics(tres), `tres song needs lyrics: ${tres.displayName}`);
assert(songHasCincoContent(cinco), `cinco song needs riddle: ${cinco.displayName}`);
assert(classic.id !== tres.id, "classic and tres should not share the same daily song");
assert(classic.id !== cinco.id, "classic and cinco should not share the same daily song");
assert(tres.id !== cinco.id, "tres and cinco should not share the same daily song");

const classicSameIndex = selectDailySong({
  dayOfYear: getMadridDayOfYear(date),
  premium: workingPremiumSongs,
  regular: workingRegularSongs,
  catalog: songs,
});
assert(
  getTodaySong(date, "classic").id === classicSameIndex.id,
  "classic selection with offset 0 must match previous daily picker"
);

let state = createCluesRoundState();
state = applyCluesAction(
  state,
  { action: "guess", guess: "A", isCorrect: false, stageIndex: 0 },
  3
);
assert(state.stageIndex === 1 && !state.gameWon && !state.gameLost, "wrong guess should advance");
state = applyCluesAction(
  state,
  { action: "skip", isCorrect: false, stageIndex: 1 },
  3
);
assert(state.stageIndex === 2 && state.lastAction === "skip", "skip should advance");
state = applyCluesAction(
  state,
  { action: "guess", guess: "B", isCorrect: true, stageIndex: 2 },
  3
);
assert(state.gameWon && !state.gameLost, "correct guess on last stage wins");
const winCells = buildStageCells(state.attempts, 3);
assert(winCells.join(",") === "wrong,skip,correct", `unexpected cells ${winCells.join(",")}`);

let lost = createCluesRoundState();
lost = applyCluesAction(lost, { action: "skip", isCorrect: false, stageIndex: 0 }, 3);
lost = applyCluesAction(lost, { action: "skip", isCorrect: false, stageIndex: 1 }, 3);
lost = applyCluesAction(lost, { action: "skip", isCorrect: false, stageIndex: 2 }, 3);
assert(lost.gameLost && !lost.gameWon, "skipping the last stage should lose");

const classicShare = buildShareText({
  gameNumber: 412,
  won: true,
  attemptCount: 2,
  maxAttempts: 6,
  time: "4.32",
  clueLines: "🟥🟥🟩🟩🟩\n🟩🟩🟩🟩🟩",
  shareUrl: "https://songdle.es/?utm_source=share&utm_medium=clipboard&utm_campaign=daily",
});
assert(classicShare.startsWith("🎵 Songdle #412"), "classic share title must stay unchanged");
assert(classicShare.includes("⏱️ 4.32 segundos"), "classic share still includes time");
assert(!classicShare.includes("Tres pistas"), "classic share must not mention other modes");

const tresShare = buildCluesShareText({
  mode: "tres",
  gameNumber: 412,
  won: true,
  stageCount: 2,
  maxAttempts: 3,
  cells: ["wrong", "correct", "unused"],
  shareUrl: "https://songdle.es/tres-pistas?utm_source=share&utm_medium=clipboard&utm_campaign=daily",
});
assert(tresShare.includes("Tres pistas #412"), tresShare);
assert(tresShare.includes("🎯 2/3"), tresShare);
assert(tresShare.includes("🎤📝🎧"), tresShare);
assert(tresShare.includes("🟥🟩⬛"), tresShare);
assert(!tresShare.toLowerCase().includes("los40"), "public share cannot mention los40");

const skipShare = buildCluesShareText({
  mode: "tres",
  gameNumber: 412,
  won: true,
  stageCount: 3,
  maxAttempts: 3,
  cells: ["skip", "skip", "correct"],
  shareUrl: "https://songdle.es/tres-pistas",
});
assert(skipShare.includes("⬜⬜🟩"), skipShare);

const loseShare = buildCluesShareText({
  mode: "tres",
  gameNumber: 412,
  won: false,
  stageCount: 3,
  maxAttempts: 3,
  cells: ["wrong", "skip", "wrong"],
  shareUrl: "https://songdle.es/tres-pistas",
});
assert(loseShare.includes("❌ X/3"), loseShare);
assert(loseShare.includes("🟥⬜🟥"), loseShare);

const cincoShare = buildCluesShareText({
  mode: "cinco",
  gameNumber: 412,
  won: true,
  stageCount: 3,
  maxAttempts: 5,
  cells: ["wrong", "skip", "correct", "unused", "unused"],
  shareUrl: "https://songdle.es/cinco-pistas",
});
assert(cincoShare.includes("🔊📜🔊🧩🔊"), cincoShare);
assert(cincoShare.includes("🟥⬜🟩⬛⬛"), cincoShare);

assert(getShareUrl("clipboard").startsWith("https://songdle.es/?"), "classic share url stays on home");
assert(
  getShareUrl("clipboard", GAME_MODES.tres.path).includes("/tres-pistas"),
  "tres share url must point to tres route"
);

const start = new Date("2026-01-01T12:00:00Z");
for (let i = 0; i < 40; i++) {
  const day = new Date(start);
  day.setUTCDate(start.getUTCDate() + i);
  const tresSong = getTodaySong(day, "tres");
  const cincoSong = getTodaySong(day, "cinco");
  assert(songHasLyrics(tresSong), `tres missing lyrics on day ${i}: ${tresSong.displayName}`);
  assert(
    songHasCincoContent(cincoSong),
    `cinco missing riddle on day ${i}: ${cincoSong.displayName}`
  );
  assert(isPlayableSong(tresSong) && isPlayableSong(cincoSong), "clues songs must stay playable");
}

const intro = resolveClipWindow({ duration: 30, length: 2.5, slot: "intro" });
const bridge = resolveClipWindow({ duration: 30, length: 4.5, slot: "bridge" });
const hook = resolveClipWindow({ duration: 30, length: 7, slot: "hook" });
assert(intro.startSec === 0, `intro should start at 0, got ${intro.startSec}`);
assert(bridge.startSec > 6, `bridge should leave the intro, got ${bridge.startSec}`);
assert(hook.startSec > bridge.startSec + 3, `hook should be later than bridge (${bridge.startSec} vs ${hook.startSec})`);
assert(bridge.startSec + bridge.durationSec <= 30, "bridge must fit in the track");
assert(hook.startSec + hook.durationSec <= 30, "hook must fit in the track");
assert(
  hook.startSec >= bridge.startSec + bridge.durationSec - 0.5,
  "cinco clips should not be the same opening stretched"
);

const shortHook = resolveClipWindow({ duration: 12, length: 7, slot: "hook" });
assert(shortHook.startSec > 0, "even a short track should not play the hook from 0");
assert(shortHook.startSec + shortHook.durationSec <= 12.01, "short hook must stay in bounds");

const annotated = resolveClipWindow({
  duration: 30,
  length: 7,
  slot: "hook",
  preferredStart: 19,
});
assert(annotated.startSec === 19, `preferred hook start should win, got ${annotated.startSec}`);

assert(stageCopy("cinco", 2) === "Escucha otro momento", "cinco stage 3 copy should say another moment");
assert(!clipHint("intro", 2.5, intro.startSec).includes("Otro tramo"), "intro hint");
assert(clipHint("bridge", 4.5, bridge.startSec).includes("Otro tramo"), "bridge hint names another stretch");
assert(clipHint("bridge", 4.5, bridge.startSec).includes("0:10"), "bridge of a 30s track starts near 0:10");
assert(clipHint("hook", 7, hook.startSec).includes("Estribillo"), "hook hint");
assert(GAME_MODES.tres.description.toLowerCase().includes("pistaza"), "tres copy should name Pistaza");
assert(
  GAME_MODES.cinco.description.toLowerCase().includes("pasapalabra"),
  "cinco copy should name Pasapalabra"
);

console.log("✅ game modes, share grids, and 30-day content hold");
console.log(`🎵 classic: ${classic.displayName}`);
console.log(`🎤 tres: ${tres.displayName}`);
console.log(`🔊 cinco: ${cinco.displayName}`);
