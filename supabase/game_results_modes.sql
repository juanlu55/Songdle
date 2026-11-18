-- Guarda en game_results también las partidas de Tres pistas y Cinco pistas.
-- Requiere game_results_progress.sql. Se puede volver a ejecutar.

alter table public.game_results drop constraint if exists game_results_mode_check;
alter table public.game_results
  add constraint game_results_mode_check check (mode in ('classic', 'tres', 'cinco'));

-- Igual que save_classic_progress pero para cualquier modo.
-- En los modos de pistas no hay cronómetro: elapsed_seconds llega a 0 y los
-- intentos son las acciones (respuesta o pasar). Al ganar, attempts = pista en la que acertó.
create or replace function public.save_game_progress(
  p_mode text,
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
  v_max smallint := case p_mode when 'classic' then 6 when 'tres' then 3 when 'cinco' then 5 end;
  v_status text := case when p_finished then 'finished' else 'playing' end;
  v_attempts smallint;
  v_elapsed numeric := least(greatest(coalesce(p_elapsed_seconds, 0), 0), 30);
begin
  if v_max is null then
    return;
  end if;
  v_attempts := least(greatest(coalesce(p_attempts, 0), 0), v_max);

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
    (p_player_id, p_mode, p_game_date, p_song_id,
     p_finished and coalesce(p_won, false), v_attempts, v_elapsed, v_status, now())
  on conflict (player_id, mode, game_date) do update set
    -- Al ganar en un modo de pistas, attempts pasa a ser la pista del acierto (puede bajar)
    attempts = case when excluded.status = 'finished' then excluded.attempts
                    else greatest(g.attempts, excluded.attempts) end,
    elapsed_seconds = greatest(g.elapsed_seconds, excluded.elapsed_seconds),
    won = excluded.won,
    status = excluded.status,
    updated_at = now()
  where g.status = 'playing';
end;
$$;

revoke all on function public.save_game_progress(text, uuid, date, text, integer, numeric, boolean, boolean) from public;
grant execute on function public.save_game_progress(text, uuid, date, text, integer, numeric, boolean, boolean) to anon, authenticated;

-- Compatibilidad con clientes antiguos que aún llaman a la versión solo-clásico
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
language sql
security definer
set search_path = public
as $$
  select public.save_game_progress('classic', p_player_id, p_game_date, p_song_id,
                                   p_attempts, p_elapsed_seconds, p_finished, p_won);
$$;
