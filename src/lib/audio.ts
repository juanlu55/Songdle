import type { Song } from "@/app/data/songs";

const HTTP_URL = /^https?:\/\//i;
const BROKEN_PRISA_MP4_PATH = /\/mp4$/i;

export function isPlayableSong(song: Song | undefined | null): song is Song {
  if (!song) return false;
  const audioUrl = song.audioUrl?.trim();
  if (!audioUrl || !HTTP_URL.test(audioUrl)) return false;
  if (song.audioWorking === false) return false;
  // URLs tipo .../dest/01000/mp4 (falta el punto) no reproducen
  if (BROKEN_PRISA_MP4_PATH.test(audioUrl) && !/\.mp4$/i.test(audioUrl)) {
    return false;
  }
  return true;
}

export function isUsableAudioUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!HTTP_URL.test(trimmed)) return false;
  if (BROKEN_PRISA_MP4_PATH.test(trimmed) && !/\.mp4$/i.test(trimmed)) {
    return false;
  }
  return true;
}

/** Fuentes de audio en orden: clip principal y, si existe, preview de Spotify. */
export function getAudioSources(song: Song): string[] {
  const sources: string[] = [];
  if (isUsableAudioUrl(song.audioUrl)) {
    sources.push(song.audioUrl.trim());
  }
  const preview = song.spotifyUrl?.trim();
  if (
    preview &&
    isUsableAudioUrl(preview) &&
    preview.includes("mp3-preview") &&
    !sources.includes(preview)
  ) {
    sources.push(preview);
  }
  return sources;
}
