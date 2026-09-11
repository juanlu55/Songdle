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
    tutorialKey: "songdle-tutorial-tres-v2",
    shareLabel: "Tres pistas",
    shareIcons: "🎤📝🎧",
    tagline: "Como Pistaza, tú contra la canción",
    description:
      "Inspirado en Pistaza, el concurso de la radio: tres pistas de difícil a fácil y sin rival. Primero una melodía, luego un verso, y si no sale, un trozo de la canción. Pasa cuando no la tengas. Cuanto antes aciertes, más flex en el share.",
  },
  cinco: {
    id: "cinco",
    path: "/cinco-pistas",
    title: "Cinco pistas",
    maxAttempts: 5,
    dayOffset: 193,
    storageKey: "songdle-game-state-cinco",
    statsKey: "songdle-statistics-cinco",
    tutorialKey: "songdle-tutorial-cinco-v2",
    shareLabel: "Cinco pistas",
    shareIcons: "🔊📜🔊🧩🔊",
    tagline: "Como La Pista de Pasapalabra",
    description:
      "Inspirado en La Pista Musical de Pasapalabra: cinco pistas que se van aclarando, de 5 puntos a 1, y sin pulsador. Un trozo del principio, un verso, otro momento de la canción, el título dicho de otra forma, y el estribillo. El duelo es el share con tus amigos.",
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
