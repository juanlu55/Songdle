import { getSpainDate } from "@/lib/madrid-date";

const GAME_START = new Date("2025-11-08T00:00:00+01:00");

export function getGameNumber(date: Date = new Date()) {
  const today = getSpainDate(date);
  const daysSinceStart = Math.floor(
    (today.getTime() - GAME_START.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;
  return daysSinceStart > 0 ? daysSinceStart : 1;
}
