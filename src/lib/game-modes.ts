export type GameMode = "classic" | "tres" | "cinco";

export interface GameModeConfig {
  id: GameMode;
  path: string;
  title: string;
  maxAttempts: number;
  dayOffset: number;
  storageKey: string;
  statsKey: string;
  tutorialKey: string;
  shareLabel: string;
  shareIcons: string;
  tagline: string;
  description: string;
}

export const GAME_MODES: Record<GameMode, GameModeConfig> = {
  classic: {
    id: "classic",
    path: "/",
    title: "Clásico",
    maxAttempts: 6,
    dayOffset: 0,
    storageKey: "songdle-game-state",
    statsKey: "songdle-statistics",
    tutorialKey: "songdle-tutorial-seen",
    shareLabel: "Clásico",
    shareIcons: "",
    tagline: "El Wordle de canciones — 6 intentos",
    description:
      "Escucha un fragmento y adivina la canción del día. Canciones que fueron número 1 en Los 40 Principales. Gratis, en español, una nueva cada medianoche.",
  },
  tres: {
    id: "tres",
    path: "/tres-pistas",
    title: "Tres pistas",
    maxAttempts: 3,
    dayOffset: 97,
    storageKey: "songdle-game-state-tres",
    statsKey: "songdle-statistics-tres",
    tutorialKey: "songdle-tutorial-tres",
    shareLabel: "Tres pistas",
    shareIcons: "🎤📝🎧",
    tagline: "Tres pistas — de difícil a fácil",
    description:
      "Tienes 3 pistas, cada vez más claras. La primera es solo melodía. Si no, un verso. Si no, un trozo de la canción. Puedes pasar. Cuanto antes aciertes, mejor queda el share.",
  },
  cinco: {
    id: "cinco",
    path: "/cinco-pistas",
    title: "Cinco pistas",
    maxAttempts: 5,
    dayOffset: 193,
    storageKey: "songdle-game-state-cinco",
    statsKey: "songdle-statistics-cinco",
    tutorialKey: "songdle-tutorial-cinco",
    shareLabel: "Cinco pistas",
    shareIcons: "🔊📜🔊🧩🔊",
    tagline: "Cinco pistas — el flex es sacarla pronto",
    description:
      "Cinco pistas que se van aclarando: un trozo de canción, un verso, más canción, el título dicho de otra forma, y el estribillo. Pasa si no la tienes.",
  },
};

export const MODE_ORDER: GameMode[] = ["classic", "tres", "cinco"];

export function emptyGuessDistribution(maxAttempts: number): Record<number, number> {
  const distribution: Record<number, number> = {};
  for (let i = 1; i <= maxAttempts; i++) {
    distribution[i] = 0;
  }
  return distribution;
}
