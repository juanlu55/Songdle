export const getMadridDateParts = (date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
};

export const getSpainDate = (date: Date = new Date()) => {
  const { year, month, day } = getMadridDateParts(date);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
};

export const getMadridDateString = (date: Date = new Date()) => {
  const { year, month, day } = getMadridDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const getMadridDayOfYear = (date: Date = new Date()) => {
  const { year, month, day } = getMadridDateParts(date);
  const utcNoon = Date.UTC(year, month - 1, day, 12);
  const utcJan1 = Date.UTC(year, 0, 1, 12);
  return Math.floor((utcNoon - utcJan1) / (1000 * 60 * 60 * 24)) + 1;
};

/** Milisegundos hasta la siguiente medianoche en Europe/Madrid. */
export const getMsUntilNextMadridMidnight = (date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hours = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minutes = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  const seconds = Number(parts.find((part) => part.type === "second")?.value ?? 0);
  const elapsedMs = ((hours * 60 + minutes) * 60 + seconds) * 1000;
  const dayMs = 24 * 60 * 60 * 1000;
  const remaining = dayMs - elapsedMs;
  return remaining > 0 ? remaining : dayMs;
};

export const formatCountdown = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
};
