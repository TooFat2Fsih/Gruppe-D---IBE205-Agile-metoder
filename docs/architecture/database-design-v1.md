# Database design v1 — Stadionhopper

**Status:** implementation proposal; no database provisioned. Derived from `docs/domain/domain-model.md` and `domain-model.pseudo.md`. Technology baseline: ADR-001.

## Naming and identity

PostgreSQL `snake_case` table/column names map to the existing domain entities. Use UUID primary keys and `timestamptz` for timestamps. `users.id` references `auth.users.id` (Supabase Auth); `users.email` is a profile copy and **not** an independent credential store. Migration scripts will need a secure account/profile creation approach.

| Domain | Table | Columns / constraints |
|---|---|---|
| User | `public.users` | `id uuid PK FK auth.users(id)`, `name text not null`, `email text`, `profile_image_url text null`, `created_at timestamptz not null default now()` |
| Stadium | `public.stadiums` | `id uuid PK`, `name text not null`, `location text not null`, `capacity integer null CHECK (capacity >= 0)` |
| Club | `public.clubs` | `id uuid PK`, `name text not null`, `city text not null`, `logo_url text null`, `primary_stadium_id uuid null FK stadiums(id)` |
| Match | `public.matches` | `id uuid PK`, `home_club_id uuid not null FK clubs(id)`, `away_club_id uuid not null FK clubs(id)`, `stadium_id uuid not null FK stadiums(id)`, `start_time timestamptz not null`, `status text not null`, `competition text null`, `CHECK(home_club_id <> away_club_id)` |
| CheckIn | `public.check_ins` | `id uuid PK`, `user_id uuid not null FK users(id)`, `match_id uuid not null FK matches(id)`, `created_at timestamptz not null default now()`, `photo_url text null`, `comment text null` |
| Post | `public.posts` | `id uuid PK`, `user_id uuid not null FK users(id)`, `check_in_id uuid null FK check_ins(id)`, `text text not null`, `image_url text null`, `created_at timestamptz not null default now()` |
| Event | `public.events` | `id uuid PK`, `organizer_club_id uuid null FK clubs(id)`, `title text not null`, `description text null`, `start_time timestamptz not null`, `location text not null` |
| EventAttendance | `public.event_attendance` | `user_id uuid FK users(id)`, `event_id uuid FK events(id)`, `status text not null`, `created_at timestamptz not null default now()`, `PRIMARY KEY(user_id,event_id)` |

All UUID primary keys should have a database-side UUID default when migrations are implemented. Index `matches(start_time)`, `matches(stadium_id)`, `check_ins(user_id,created_at desc)`, `check_ins(match_id)`, and `event_attendance(event_id)`.

## Invariants

1. `matches.stadium_id` is the source of truth. **Do not add `check_ins.stadium_id`**; derive the stadium with a join `check_ins → matches → stadiums`.
2. `home_club_id <> away_club_id`.
3. `check_ins.user_id` is taken from authenticated server context, not a caller-supplied user ID.
4. New CheckIn persistence must be verified by subsequent Visit History retrieval (GitHub #18).
5. No uniqueness restriction on `(user_id, match_id)` is assumed until repeat-check-in policy is decided. Enforce an explicit policy before shipping.
6. Photo requirement remains open from the US04 quality review; `photo_url` is nullable in this draft.
7. Visit History semantics (all check-ins vs unique stadiums) remain open from US06; first technical flow lists individual check-ins without claiming this settles the product decision.
8. `posts.check_in_id` is optional. When populated, authorization must ensure the referenced check-in belongs to the same user unless a later explicit product rule allows otherwise.

## Security and privacy

- Enable RLS on **every** exposed `public` table before connecting clients.
- Users may read and update only their own profile by default; check-ins are private to their owner until a deliberate sharing feature is approved.
- Only authorized server/admin workflows can create/update match, club and stadium records; public read access to pilot match data can be permitted.
- For check-ins, INSERT/SELECT/UPDATE/DELETE policies (as enabled) must verify `auth.uid() = user_id`; avoid client-controlled user IDs.
- Social posts and event attendance require separate policy design before implementation. Never use a Supabase service-role key in client-side code.
- Do not store credentials in `users`; consider retention/deletion of profile and visit data.

## Implementation order

1. Supabase Auth + `users` profile linkage.
2. `stadiums`, `clubs`, `matches` and reproducible pilot seed data.
3. `check_ins` and indexes, with access policies and check-in/history integration test.
4. `posts`, `events`, `event_attendance` once corresponding backlog work is approved.

## Open decisions

Repeat check-in policy; permitted check-in time window; whether photo is required; visit history aggregation; statuses for Match and EventAttendance; public vs private social data; administration roles; event creator roles. These are not resolved by this document.
