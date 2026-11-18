import { writeFileSync } from "node:fs";
import { songs, type Song } from "../src/app/data/songs";

function sqlText(value: string | undefined) {
  if (value == null || value === "") return "null";
  return `'${value.replaceAll("'", "''")}'`;
}

function sqlBool(value: boolean | undefined) {
  return value ? "true" : "false";
}

function sqlNumber(value: number | undefined) {
  return value == null || Number.isNaN(value) ? "null" : String(value);
}

function row(song: Song) {
  return `  (${[
    sqlText(song.id),
    sqlText(song.title),
    sqlText(song.artist),
    sqlText(song.displayName),
    sqlText(song.audioUrl) === "null" ? "''" : sqlText(song.audioUrl),
    sqlText(song.imageUrl),
    sqlText(song.genre),
    sqlText(song.decade),
    sqlText(song.country),
    sqlText(song.language),
    sqlText(song.voices),
    sqlText(song.numberOneDate),
    sqlText(song.spotifyUrl),
    sqlText(song.bestPosition),
    sqlBool(song.audioWorking),
    sqlText(song.lyricLine),
    sqlText(song.titleRiddle),
    sqlNumber(song.hookStartSec),
  ].join(", ")})`;
}

const columns = [
  "id",
  "title",
  "artist",
  "display_name",
  "audio_url",
  "image_url",
  "genre",
  "decade",
  "country",
  "language",
  "voices",
  "number_one_date",
  "spotify_url",
  "best_position",
  "audio_working",
  "lyric_line",
  "title_riddle",
  "hook_start_sec",
].join(", ");

const updates = [
  "title",
  "artist",
  "display_name",
  "audio_url",
  "image_url",
  "genre",
  "decade",
  "country",
  "language",
  "voices",
  "number_one_date",
  "spotify_url",
  "best_position",
  "audio_working",
  "lyric_line",
  "title_riddle",
  "hook_start_sec",
]
  .map((column) => `  ${column} = excluded.${column}`)
  .join(",\n");

const batches: string[] = [];
const size = 200;
for (let index = 0; index < songs.length; index += size) {
  const values = songs.slice(index, index + size).map(row).join(",\n");
  batches.push(
    `insert into public.songs (${columns})\nvalues\n${values}\non conflict (id) do update set\n${updates};`
  );
}

const sql = `-- Catálogo de Songdle. Se puede volver a ejecutar: actualiza por id.
create table if not exists public.songs (
  id text primary key,
  title text not null,
  artist text not null,
  display_name text not null,
  audio_url text not null,
  image_url text,
  genre text not null,
  decade text not null,
  country text not null,
  language text not null,
  voices text not null,
  number_one_date text,
  spotify_url text,
  best_position text,
  audio_working boolean not null default false,
  lyric_line text,
  title_riddle text,
  hook_start_sec numeric
);

create index if not exists songs_artist_idx on public.songs (artist);
create index if not exists songs_decade_idx on public.songs (decade);
create index if not exists songs_genre_idx on public.songs (genre);
create index if not exists songs_audio_working_idx on public.songs (audio_working);

alter table public.songs enable row level security;

drop policy if exists "public can read songs" on public.songs;
create policy "public can read songs"
  on public.songs
  for select
  to anon, authenticated
  using (true);

revoke all on table public.songs from anon, authenticated;
grant select on table public.songs to anon, authenticated;

${batches.join("\n\n")}
`;

writeFileSync("supabase/songs.sql", sql);
console.log(`songs=${songs.length} bytes=${Buffer.byteLength(sql)} batches=${batches.length}`);
