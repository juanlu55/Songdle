import type { Song } from "@/app/data/songs";
import { songOverrides } from "@/lib/song-overrides";

export function enrichSong(song: Song): Song {
  const extra = songOverrides[song.id];
  if (!extra) return song;
  return { ...song, ...extra };
}

export function songHasLyrics(song: Song) {
  return Boolean(enrichSong(song).lyricLine?.trim());
}

export function songHasCincoContent(song: Song) {
  const enriched = enrichSong(song);
  return Boolean(enriched.lyricLine?.trim() && enriched.titleRiddle?.trim());
}
