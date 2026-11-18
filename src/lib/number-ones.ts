import { songs, type Song } from "@/app/data/songs";

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export interface NumberOne {
  id: string;
  title: string;
  artist: string;
  genre: string;
  country: string;
  language: string;
  imageUrl?: string;
  date: Date;
  dateLabel: string;
}

export interface YearSummary {
  year: number;
  count: number;
  first: NumberOne;
  last: NumberOne;
  topArtists: Array<{ artist: string; count: number }>;
  spanishShare: number;
  topGenre: { genre: string; count: number };
}

/** "20 de enero de 1990" → Date (UTC). */
function parseSpanishDate(value: string | undefined): Date | null {
  const match = value?.match(/(\d{1,2}) de ([a-záéíóú]+) de (\d{4})/i);
  if (!match) return null;
  const month = MONTHS.indexOf(match[2].toLowerCase());
  if (month < 0) return null;
  return new Date(Date.UTC(Number(match[3]), month, Number(match[1])));
}

/** "Karol G;Nicki Minaj" → "Karol G y Nicki Minaj" */
export function formatArtists(artist: string): string {
  const parts = artist.split(";").map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) return parts[0] ?? artist;
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

function toNumberOne(song: Song): NumberOne | null {
  const date = parseSpanishDate(song.numberOneDate);
  if (!date) return null;
  return {
    id: song.id,
    title: song.title,
    artist: formatArtists(song.artist),
    genre: song.genre,
    country: song.country,
    language: song.language,
    imageUrl: song.imageUrl,
    date,
    dateLabel: song.numberOneDate!.replace(/ de \d{4}$/, ""),
  };
}

const allNumberOnes: NumberOne[] = songs
  .map(toNumberOne)
  .filter((s): s is NumberOne => s !== null)
  .sort((a, b) => a.date.getTime() - b.date.getTime());

const byYear = new Map<number, NumberOne[]>();
for (const song of allNumberOnes) {
  const year = song.date.getUTCFullYear();
  const list = byYear.get(year) ?? [];
  list.push(song);
  byYear.set(year, list);
}

export const NUMBER_ONE_YEARS: number[] = [...byYear.keys()].sort((a, b) => a - b);

export function getNumberOnesByYear(year: number): NumberOne[] {
  return byYear.get(year) ?? [];
}

function countBy<T>(items: T[], key: (item: T) => string[]) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const k of key(item)) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"));
}

export function getYearSummary(year: number): YearSummary | null {
  const list = getNumberOnesByYear(year);
  if (list.length === 0) return null;

  // Cada artista de una colaboración cuenta por separado
  const songsOfYear = songs.filter((s) => parseSpanishDate(s.numberOneDate)?.getUTCFullYear() === year);
  const artistCounts = countBy(songsOfYear, (s) => s.artist.split(";").map((a) => a.trim()));
  const topCount = artistCounts[0]?.[1] ?? 0;
  const topArtists =
    topCount >= 2
      ? artistCounts.filter(([, c]) => c === topCount).map(([artist, count]) => ({ artist, count }))
      : [];

  const spanish = list.filter((s) => s.language.split(";")[0] === "Español").length;
  const [genre, genreCount] = countBy(list, (s) => [s.genre])[0];

  return {
    year,
    count: list.length,
    first: list[0],
    last: list[list.length - 1],
    topArtists,
    spanishShare: Math.round((100 * spanish) / list.length),
    topGenre: { genre, count: genreCount },
  };
}

export function spotifySearchUrl(song: Pick<NumberOne, "title" | "artist">) {
  return `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
}
