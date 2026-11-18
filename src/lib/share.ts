import type { Song } from "@/app/data/songs";
import { GAME_MODES } from "@/lib/game-modes";
import { STAGE_CELL_EMOJI, type StageCell } from "@/lib/clues-game";
import { BRAND } from "@/lib/brand-svg";

export const SITE_URL = "https://songdle.es";

export function getShareUrl(medium: string, path?: string) {
  const url = path ? new URL(path, SITE_URL) : new URL(SITE_URL);
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
  
  // Copy más viral dependiendo del resultado
  let callToAction = "";
  if (won) {
    if (attemptCount === 1) {
      callToAction = "¿Quién puede superarme? 🏆";
    } else if (attemptCount <= 2) {
      callToAction = "¿Puedes hacerlo mejor? 👇";
    } else if (parseFloat(time) < 10) {
      callToAction = `${time}s ⚡ ¿Puedes ser más rápido?`;
    } else {
      callToAction = "¿Cuántos intentos necesitas tú?";
    }
  } else {
    callToAction = "Esta estuvo difícil 😅 ¿Alguien la tiene?";
  }

  return `🎵 Songdle #${gameNumber}
${emoji} ${attemptsText} · ${time}s ${won && parseFloat(time) < 10 ? "⚡" : ""}

${clueLines}

${callToAction}
${shareUrl}`;
}

// ---------- Dibujo de marca en canvas ----------

type DiscSegment = "acierto" | "polvo" | "papel" | null;

function displayFont(weight: number, px: number) {
  const family =
    (typeof document !== "undefined" &&
      getComputedStyle(document.body).getPropertyValue("--font-archivo").trim()) ||
    "'Arial Black', sans-serif";
  return `${weight} ${px}px ${family}`;
}

function setExpanded(ctx: CanvasRenderingContext2D, on: boolean) {
  if ("fontStretch" in ctx) {
    (ctx as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = on ? "expanded" : "normal";
  }
}

async function ensureFonts(ctx: CanvasRenderingContext2D) {
  try {
    await document.fonts.load(displayFont(900, 40));
  } catch {
    // Si la fuente no carga, el canvas usa la alternativa
  }
  setExpanded(ctx, true);
}

function wedge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, i: number, n: number) {
  const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / n;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, a0, a1);
  ctx.closePath();
}

/** El símbolo de la marca */
function drawBrandDisc(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.fillStyle = BRAND.tinta;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  wedge(ctx, cx, cy, r, 0, 6);
  ctx.fillStyle = BRAND.rec;
  ctx.fill();
  ctx.fillStyle = BRAND.papel;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.29, 0, Math.PI * 2);
  ctx.fill();
}

/** El disco con la partida: un gajo por intento */
function drawResultDisc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  segments: DiscSegment[]
) {
  const color = { acierto: BRAND.acierto, polvo: BRAND.polvo, papel: BRAND.papel };
  ctx.fillStyle = BRAND.tinta;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  segments.forEach((seg, i) => {
    if (!seg) return;
    wedge(ctx, cx, cy, r, i, segments.length);
    ctx.fillStyle = color[seg];
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = BRAND.tinta;
    ctx.stroke();
  });
  ctx.lineWidth = 5;
  ctx.strokeStyle = BRAND.tinta;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = BRAND.papel;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.27, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = BRAND.tinta;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.07, 0, Math.PI * 2);
  ctx.fill();
}

/** Logotipo S◉NGDLE con la línea base en `y` */
function drawWordmark(ctx: CanvasRenderingContext2D, x: number, y: number, px: number) {
  ctx.font = displayFont(900, px);
  ctx.fillStyle = BRAND.tinta;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("S", x, y);
  let cursor = x + ctx.measureText("S").width;
  const d = px * 0.74;
  const gap = px * 0.03;
  drawBrandDisc(ctx, cursor + gap + d / 2, y - px * 0.36, d / 2);
  cursor += d + gap * 2;
  ctx.fillText("NGDLE", cursor, y);
}

function drawCard(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = BRAND.papel;
  ctx.fillRect(0, 0, width, height);
  // Sombra dura
  ctx.fillStyle = BRAND.tinta;
  ctx.fillRect(52, 52, width - 80, height - 80);
  ctx.fillStyle = BRAND.blanco;
  ctx.fillRect(40, 40, width - 80, height - 80);
  ctx.lineWidth = 6;
  ctx.strokeStyle = BRAND.tinta;
  ctx.strokeRect(40, 40, width - 80, height - 80);
}

function monoFont(weight: number, px: number) {
  const family =
    (typeof document !== "undefined" &&
      getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim()) ||
    "monospace";
  return `${weight} ${px}px ${family}`;
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
  const headerH = 300;
  const height = headerH + attempts.length * (rowH + 12) + 120;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  await ensureFonts(ctx);
  drawCard(ctx, width, height);
  drawWordmark(ctx, 72, 126, 46);

  ctx.font = monoFont(700, 20);
  ctx.fillStyle = "rgba(20,18,16,0.6)";
  ctx.fillText(`#${gameNumber}  ·  ${won ? "GANADO" : "PERDIDO"}`, 72, 182);

  ctx.fillStyle = BRAND.tinta;
  ctx.font = displayFont(900, 34);
  ctx.fillText(
    won ? `${attemptCount}/${maxAttempts} intentos` : `X/${maxAttempts} intentos`,
    72,
    230
  );
  ctx.font = monoFont(700, 24);
  ctx.fillText(`${time}s`, 72, 266);

  const segments: DiscSegment[] = Array.from({ length: maxAttempts }, (_, i) => {
    const attempt = attempts[i];
    if (!attempt) return null;
    return attempt.isCorrect ? "acierto" : "polvo";
  });
  drawResultDisc(ctx, width - 150, 180, 82, segments);

  attempts.forEach((attempt, index) => {
    const y = headerH + index * (rowH + 12);
    const colors = attempt.isCorrect
      ? Array(5).fill(BRAND.acierto)
      : attempt.clues
        ? [
            attempt.clues.genre,
            attempt.clues.decade,
            attempt.clues.country,
            attempt.clues.language,
            attempt.clues.voices,
          ].map((match) => (match ? BRAND.acierto : BRAND.polvo))
        : Array(5).fill(BRAND.blanco);

    colors.forEach((color, i) => {
      const x = 72 + i * 92;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 80, rowH);
      ctx.lineWidth = 4;
      ctx.strokeStyle = BRAND.tinta;
      ctx.strokeRect(x, y, 80, rowH);
    });
  });

  ctx.fillStyle = BRAND.tinta;
  ctx.font = monoFont(700, 22);
  ctx.fillText("songdle.es", 72, height - 72);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export function buildCluesShareText({
  mode,
  gameNumber,
  won,
  stageCount,
  maxAttempts,
  cells,
  shareUrl,
}: {
  mode: "tres" | "cinco";
  gameNumber: number;
  won: boolean;
  stageCount: number;
  maxAttempts: number;
  cells: StageCell[];
  shareUrl: string;
}) {
  const config = GAME_MODES[mode];
  const emoji = won ? "🎯" : "❌";
  const score = won ? `${stageCount}/${maxAttempts}` : `X/${maxAttempts}`;
  const grid = cells.map((cell) => STAGE_CELL_EMOJI[cell]).join("");

  return `🎵 Songdle · ${config.shareLabel} #${gameNumber}
${emoji} ${score}
${config.shareIcons}
${grid}

${shareUrl}`;
}

const CELL_COLORS: Record<StageCell, string> = {
  unused: BRAND.papel,
  skip: BRAND.blanco,
  wrong: BRAND.polvo,
  correct: BRAND.acierto,
};

const CELL_MARKS: Record<StageCell, string> = {
  unused: "",
  skip: "–",
  wrong: "✗",
  correct: "✓",
};

export async function renderCluesShareImageBlob({
  mode,
  gameNumber,
  won,
  stageCount,
  maxAttempts,
  cells,
}: {
  mode: "tres" | "cinco";
  gameNumber: number;
  won: boolean;
  stageCount: number;
  maxAttempts: number;
  cells: StageCell[];
}): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const width = 720;
  const height = 540;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  await ensureFonts(ctx);
  drawCard(ctx, width, height);
  drawWordmark(ctx, 72, 126, 46);

  // Modo
  ctx.font = displayFont(800, 18);
  const label = GAME_MODES[mode].shareLabel.toUpperCase();
  const labelW = ctx.measureText(label).width + 28;
  ctx.fillStyle = BRAND.tinta;
  ctx.fillRect(72, 150, labelW, 38);
  ctx.fillStyle = BRAND.papel;
  ctx.fillText(label, 86, 176);

  ctx.font = monoFont(700, 20);
  ctx.fillStyle = "rgba(20,18,16,0.6)";
  ctx.fillText(`#${gameNumber}  ·  ${won ? "GANADO" : "PERDIDO"}`, 72, 222);

  ctx.fillStyle = BRAND.tinta;
  ctx.font = displayFont(900, 34);
  ctx.fillText(won ? `${stageCount}/${maxAttempts}` : `X/${maxAttempts}`, 72, 266);

  drawResultDisc(
    ctx,
    width - 150,
    186,
    82,
    cells.map((cell) =>
      cell === "correct" ? "acierto" : cell === "wrong" ? "polvo" : cell === "skip" ? "papel" : null
    )
  );

  const cellCount = cells.length;
  const gap = 16;
  const cellSize = Math.min(96, (width - 144 - gap * (cellCount - 1)) / cellCount);
  const rowWidth = cellCount * cellSize + (cellCount - 1) * gap;
  const startX = (width - rowWidth) / 2;
  const y = 316;

  cells.forEach((cell, i) => {
    const x = startX + i * (cellSize + gap);
    ctx.fillStyle = CELL_COLORS[cell];
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.lineWidth = 5;
    ctx.strokeStyle = BRAND.tinta;
    if (cell === "unused") ctx.setLineDash([10, 8]);
    ctx.strokeRect(x, y, cellSize, cellSize);
    ctx.setLineDash([]);
    if (CELL_MARKS[cell]) {
      ctx.fillStyle = BRAND.tinta;
      ctx.font = displayFont(900, cellSize * 0.45);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(CELL_MARKS[cell], x + cellSize / 2, y + cellSize / 2);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }
  });

  ctx.fillStyle = BRAND.tinta;
  ctx.font = monoFont(700, 22);
  ctx.fillText("songdle.es", 72, height - 72);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

export function getSpotifySearchUrl(song: Song) {
  const artist = song.artist.replace(/;/g, " ");
  const query = `${song.title} ${artist}`.replace(/\s+/g, " ").trim();
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}
