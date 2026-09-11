export type StageActionKind = "guess" | "skip";
export type StageCell = "unused" | "skip" | "wrong" | "correct";

export interface CluesAttempt {
  action: StageActionKind;
  guess?: string;
  isCorrect: boolean;
  stageIndex: number;
}

export interface CluesRoundState {
  attempts: CluesAttempt[];
  stageIndex: number;
  lastAction: StageActionKind | null;
  gameWon: boolean;
  gameLost: boolean;
}

export const STAGE_CELL_EMOJI: Record<StageCell, string> = {
  unused: "⬛",
  skip: "⬜",
  wrong: "🟥",
  correct: "🟩",
};

export function createCluesRoundState(): CluesRoundState {
  return {
    attempts: [],
    stageIndex: 0,
    lastAction: null,
    gameWon: false,
    gameLost: false,
  };
}

export function applyCluesAction(
  state: CluesRoundState,
  attempt: CluesAttempt,
  maxStages: number
): CluesRoundState {
  const attempts = [...state.attempts, attempt];
  if (attempt.action === "guess" && attempt.isCorrect) {
    return {
      attempts,
      stageIndex: attempt.stageIndex,
      lastAction: attempt.action,
      gameWon: true,
      gameLost: false,
    };
  }

  const nextStage = attempt.stageIndex + 1;
  if (nextStage >= maxStages) {
    return {
      attempts,
      stageIndex: attempt.stageIndex,
      lastAction: attempt.action,
      gameWon: false,
      gameLost: true,
    };
  }

  return {
    attempts,
    stageIndex: nextStage,
    lastAction: attempt.action,
    gameWon: false,
    gameLost: false,
  };
}

export function buildStageCells(
  attempts: CluesAttempt[],
  maxStages: number
): StageCell[] {
  const cells: StageCell[] = Array.from({ length: maxStages }, () => "unused");
  for (const attempt of attempts) {
    if (attempt.stageIndex < 0 || attempt.stageIndex >= maxStages) continue;
    if (attempt.action === "skip") {
      cells[attempt.stageIndex] = "skip";
    } else if (attempt.isCorrect) {
      cells[attempt.stageIndex] = "correct";
    } else {
      cells[attempt.stageIndex] = "wrong";
    }
  }
  return cells;
}

export function cluesPoints(won: boolean, winStageIndex: number, maxStages: number) {
  if (!won) return 0;
  return maxStages - winStageIndex;
}

export function stageCopy(mode: "tres" | "cinco", stageIndex: number): string {
  if (mode === "tres") {
    return ["Escucha la melodía", "Lee la letra", "Escucha el fragmento"][stageIndex] ?? "";
  }
  return [
    "Escucha un trozo corto",
    "Lee la letra",
    "Escucha otro momento",
    "El título, con otras palabras",
    "Escucha el estribillo",
  ][stageIndex] ?? "";
}

export type ClipSlot = "intro" | "bridge" | "hook";

export function resolveClipWindow({
  duration,
  length,
  slot,
  preferredStart,
}: {
  duration: number;
  length: number;
  slot: ClipSlot;
  preferredStart?: number;
}): { startSec: number; durationSec: number } {
  const trackDuration =
    Number.isFinite(duration) && duration > 0.5 ? duration : 30;
  const durationSec = Math.min(length, Math.max(0.8, trackDuration - 0.05));
  const maxStart = Math.max(0, trackDuration - durationSec);

  const ratio: Record<ClipSlot, number> = {
    intro: 0,
    bridge: 0.34,
    hook: 0.62,
  };

  let startSec = ratio[slot] * trackDuration;
  if (
    slot === "hook" &&
    preferredStart != null &&
    Number.isFinite(preferredStart) &&
    preferredStart >= 0
  ) {
    startSec = preferredStart;
  }

  startSec = Math.min(Math.max(0, startSec), maxStart);
  return { startSec, durationSec };
}

export function formatClipClock(sec: number) {
  const total = Math.max(0, Math.floor(sec));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function clipHint(slot: ClipSlot | undefined, durationSec: number, startSec = 0) {
  const from = formatClipClock(startSec);
  const len = `${durationSec}s`;
  if (slot === "intro") return `Intro · ${from} · ${len}`;
  if (slot === "bridge") return `Otro tramo · ${from} · ${len}`;
  if (slot === "hook") return `Estribillo · ${from} · ${len}`;
  return `Clip de ${len}`;
}
