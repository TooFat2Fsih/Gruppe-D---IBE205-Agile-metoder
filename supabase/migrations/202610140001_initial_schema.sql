-- Stadionhopper: initial schema based on docs/domain/domain-model.md.
-- Run on a NEW Supabase project. No production data migrations have been tested.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  profile_image_url text,
  created_at timestamptz not null default now()
);
create table public.stadiums (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  capacity integer check (capacity >= 0)
);
create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  logo_url text,
  primary_stadium_id uuid references public.stadiums(id) on delete set null
);
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  home_club_id uuid not null references public.clubs(id),
  away_club_id uuid not null references public.clubs(id),
  stadium_id uuid not null references public.stadiums(id),
  start_time timestamptz not null,
  status text not null,
  competition text,
  constraint different_clubs check (home_club_id <> away_club_id)
);
create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  match_id uuid not null references public.matches(id),
  created_at timestamptz not null default now(),
  photo_url text,
  comment text
);
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  check_in_id uuid references public.check_ins(id),
  text text not null,
  image_url text,
  created_at timestamptz not null default now()
);
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_club_id uuid references public.clubs(id),
  title text not null,
  description text,
  start_time timestamptz not null,
  location text not null
);
create table public.event_attendance (
  user_id uuid not null references public.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  status text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);
create index matches_start_time_idx on public.matches(start_time);
create index matches_stadium_idx on public.matches(stadium_id);
create index check_ins_user_created_idx on public.check_ins(user_id, created_at desc);
create index check_ins_match_idx on public.check_ins(match_id);
create index event_attendance_event_idx on public.event_attendance(event_id);

-- Deny by default. Public read is limited to non-personal fixture reference data.
alter table public.users enable row level security;
alter table public.stadiums enable row level security;
alter table public.clubs enable row level security;
alter table public.matches enable row level security;
alter table public.check_ins enable row level security;
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.event_attendance enable row level security;

create policy "read stadium reference data" on public.stadiums for select to anon, authenticated using (true);
create policy "read club reference data" on public.clubs for select to anon, authenticated using (true);
create policy "read match reference data" on public.matches for select to anon, authenticated using (true);
create policy "read own profile" on public.users for select to authenticated using ((select auth.uid()) = id);
create policy "read own check ins" on public.check_ins for select to authenticated using ((select auth.uid()) = user_id);
create policy "read own attendance" on public.event_attendance for select to authenticated using ((select auth.uid()) = user_id);
-- No client INSERT/UPDATE/DELETE policies yet: authorization, check-in timing,
-- duplicate rules and profile provisioning are not implemented.
-- Posts/events intentionally have no public policies until privacy rules are decided.
