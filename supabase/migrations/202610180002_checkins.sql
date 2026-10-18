-- Delivery 3: authenticated users can create and read only their own check-ins.
-- Run after 202610140001_initial_schema.sql and 202610180001_auth_profiles.sql.
-- This prototype intentionally allows historical/demo match check-ins.
-- Duplicate check-ins for one user/match are disallowed.
create unique index if not exists check_ins_user_match_unique on public.check_ins (user_id, match_id);

create policy "insert own check ins"
on public.check_ins for insert to authenticated
with check ((select auth.uid()) = user_id);

-- The original migration already includes "read own check ins".
-- No UPDATE/DELETE or anonymous read access is granted.
