create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  program_track text not null check (program_track in ('bloating', 'constipation', 'mixed')),
  start_date date not null default current_date,
  current_day integer not null default 1,
  current_streak integer not null default 0,
  points integer not null default 0,
  level integer not null default 1
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  bm boolean,
  bristol_type integer check (bristol_type between 1 and 7),
  bloating integer check (bloating between 1 and 5),
  pain integer check (pain between 1 and 5),
  session_completed boolean not null default false,
  unique(user_id, date)
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  day_number integer not null,
  track text not null check (track in ('bloating', 'constipation', 'mixed')),
  title text not null,
  duration integer not null,
  audio_url text not null,
  focus text not null
);
