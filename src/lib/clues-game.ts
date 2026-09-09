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
    "Escucha un poco más",
    "El título, con otras palabras",
    "Escucha el estribillo",
  ][stageIndex] ?? "";
}
