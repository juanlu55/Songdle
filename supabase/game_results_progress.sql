-- Guarda también las partidas en curso/abandonadas en game_results.
-- La fila se crea al primer play (status 'playing') y se actualiza en cada intento
-- hasta que la partida termina (status 'finished'). Se puede volver a ejecutar.
-- Es compatible con clientes antiguos: su insert directo crea filas 'finished' por defecto.

alter table public.game_results
  add column if not exists status text not null default 'finished',
  add column if not exists updated_at timestamptz not null default now();

alter table public.game_results drop constraint if exists game_results_status_check;
alter table public.game_results
  add constraint game_results_status_check check (status in ('playing', 'finished'));

-- Una partida empezada puede tener 0 intentos
alter table public.game_results drop constraint if exists game_results_attempts_check;
alter table public.game_results
  add constraint game_results_attempts_check check (attempts between 0 and 6);

-- Los anónimos no pueden hacer UPDATE directo: solo a través de esta función, que
-- toca únicamente la fila de ese player_id y día, y solo hacia delante.
create or replace function public.save_classic_progress(
  p_player_id uuid,
  p_game_date date,
  p_song_id text,
  p_attempts integer,
  p_elapsed_seconds numeric,
  p_finished boolean,
  p_won boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'Europe/Madrid')::date;
  v_status text := case when p_finished then 'finished' else 'playing' end;
  v_attempts smallint := least(greatest(coalesce(p_attempts, 0), 0), 6);
  v_elapsed numeric := least(greatest(coalesce(p_elapsed_seconds, 0), 0), 30);
begin
  -- Solo la partida de hoy (con margen de un día por zonas horarias)
  if p_game_date is null or p_game_date not between v_today - 1 and v_today + 1 then
    return;
  end if;
  if p_finished and v_attempts < 1 then
    return;
  end if;

  insert into game_results as g
    (player_id, mode, game_date, song_id, won, attempts, elapsed_seconds, status, updated_at)
  values
    (p_player_id, 'classic', p_game_date, p_song_id,
     p_finished and coalesce(p_won, false), v_attempts, v_elapsed, v_status, now())
  on conflict (player_id, mode, game_date) do update set
    attempts = greatest(g.attempts, excluded.attempts),
    elapsed_seconds = greatest(g.elapsed_seconds, excluded.elapsed_seconds),
    won = excluded.won,
    status = excluded.status,
    updated_at = now()
  where g.status = 'playing';
end;
$$;

revoke all on function public.save_classic_progress(uuid, date, text, integer, numeric, boolean, boolean) from public;
grant execute on function public.save_classic_progress(uuid, date, text, integer, numeric, boolean, boolean) to anon, authenticated;

-- Las stats que se muestran al jugador siguen contando solo partidas terminadas
create or replace function public.classic_daily_stats(p_date date)
returns table (played bigint, won bigint, win_rate numeric, avg_win_seconds numeric)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*)::bigint,
    count(*) filter (where won)::bigint,
    case
      when count(*) = 0 then null
      else round(100.0 * count(*) filter (where won) / count(*), 0)
    end,
    round(avg(elapsed_seconds) filter (where won), 2)
  from public.game_results
  where mode = 'classic'
    and game_date = p_date
    and status = 'finished';
$$;
