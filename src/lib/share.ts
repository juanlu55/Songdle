import type { Song } from "@/app/data/songs";

export const SITE_URL = "https://songdle.es";

export function getShareUrl(medium: string) {
  const url = new URL(SITE_URL);
  url.searchParams.set("utm_source", "share");
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", "daily");
  return url.toString();
}

export function getWhatsAppShareHref(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

interface ClueMatch {
  genre: boolean;
  decade: boolean;
  country: boolean;
  language: boolean;
  voices: boolean;
}

interface ShareAttempt {
  isCorrect: boolean;
  clues?: ClueMatch;
}

export function buildClueLines(attempts: ShareAttempt[]) {
  return attempts
    .map((attempt) => {
      if (attempt.isCorrect) return "🟩🟩🟩🟩🟩";
      if (!attempt.clues) return "⬜⬜⬜⬜⬜";
      const { genre, decade, country, language, voices } = attempt.clues;
      return `${genre ? "🟩" : "🟥"}${decade ? "🟩" : "🟥"}${country ? "🟩" : "🟥"}${language ? "🟩" : "🟥"}${voices ? "🟩" : "🟥"}`;
    })
    .join("\n");
}

export function buildShareText({
  gameNumber,
  won,
  attemptCount,
  maxAttempts,
  time,
  clueLines,
  shareUrl,
}: {
  gameNumber: number;
  won: boolean;
  attemptCount: number;
  maxAttempts: number;
  time: string;
  clueLines: string;
  shareUrl: string;
}) {
  const emoji = won ? "🎯" : "❌";
  const attemptsText = won ? `${attemptCount}/${maxAttempts}` : `X/${maxAttempts}`;

  return `🎵 Songdle #${gameNumber}
${emoji} ${attemptsText} intentos
⏱️ ${time} segundos

${clueLines}

${shareUrl}`;
}

export async function renderShareImageBlob({
  gameNumber,
  won,
  attemptCount,
  maxAttempts,
  time,
  attempts,
}: {
  gameNumber: number;
  won: boolean;
  attemptCount: number;
  maxAttempts: number;
  time: string;
  attempts: ShareAttempt[];
}): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const width = 720;
  const rowH = 56;
  const headerH = 280;
  const height = headerH + attempts.length * (rowH + 12) + 120;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#f5f1e8";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 8;
  ctx.fillRect(40, 40, width - 80, height - 80);
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(70, 70, 280, 70);
  ctx.lineWidth = 6;
  ctx.strokeRect(70, 70, 280, 70);
  ctx.fillStyle = "#000000";
  ctx.font = "900 40px sans-serif";
  ctx.fillText("SONGDLE", 88, 118);

  ctx.font = "700 22px sans-serif";
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillText(`#${gameNumber}  ·  ${won ? "GANADO" : "PERDIDO"}`, 70, 175);

  ctx.fillStyle = "#000000";
  ctx.font = "900 36px sans-serif";
  ctx.fillText(
    won ? `${attemptCount}/${maxAttempts} intentos` : `X/${maxAttempts} intentos`,
    70,
    225
  );
  ctx.font = "700 24px monospace";
  ctx.fillText(`${time}s`, 70, 265);

  attempts.forEach((attempt, index) => {
    const y = headerH + index * (rowH + 12);
    const colors = attempt.isCorrect
      ? ["#a8e6cf", "#a8e6cf", "#a8e6cf", "#a8e6cf", "#a8e6cf"]
      : attempt.clues
        ? [
            attempt.clues.genre ? "#a8e6cf" : "#ff6b6b",
            attempt.clues.decade ? "#a8e6cf" : "#ff6b6b",
            attempt.clues.country ? "#a8e6cf" : "#ff6b6b",
            attempt.clues.language ? "#a8e6cf" : "#ff6b6b",
            attempt.clues.voices ? "#a8e6cf" : "#ff6b6b",
          ]
        : ["#d9d3c7", "#d9d3c7", "#d9d3c7", "#d9d3c7", "#d9d3c7"];

    colors.forEach((color, i) => {
      const x = 70 + i * 92;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 80, rowH);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(x, y, 80, rowH);
    });
  });

  ctx.fillStyle = "#000000";
  ctx.font = "700 22px sans-serif";
  ctx.fillText("songdle.es", 70, height - 70);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export function getSpotifySearchUrl(song: Song) {
  const artist = song.artist.replace(/;/g, " ");
  const query = `${song.title} ${artist}`.replace(/\s+/g, " ").trim();
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}
