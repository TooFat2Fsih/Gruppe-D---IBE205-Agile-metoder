-- Delivery 3: opt-in social feed. Read posts only as authenticated users.
-- Posts cannot be created for another user's check-in.
-- Apply after the check-ins migration.
create unique index if not exists posts_one_per_checkin on public.posts(check_in_id) where check_in_id is not null;

create policy "authenticated read feed"
on public.posts for select to authenticated using (true);

create policy "insert own check in activity"
on public.posts for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and check_in_id is not null
  and exists (
    select 1 from public.check_ins ci
    where ci.id = check_in_id and ci.user_id = (select auth.uid())
  )
  and text = 'Sjekket inn på kamp'
);
-- No anonymous feed access, UPDATE or DELETE permissions.
