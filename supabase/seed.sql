-- Optional, fictional demonstration records only. Do not mistake for real fixtures.
-- Apply after initial migration in a disposable development Supabase project.
insert into public.stadiums (id, name, location, capacity) values
 ('10000000-0000-4000-8000-000000000001','Eksempel stadion','Demoby',1200)
on conflict (id) do nothing;
insert into public.clubs (id, name, city, primary_stadium_id) values
 ('20000000-0000-4000-8000-000000000001','Hjemmelag','Demoby','10000000-0000-4000-8000-000000000001'),
 ('20000000-0000-4000-8000-000000000002','Bortelag','Eksempelby',null)
on conflict (id) do nothing;
insert into public.matches (id, home_club_id, away_club_id, stadium_id, start_time, status, competition) values
 ('30000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','2026-11-15T15:00:00Z','scheduled','DEMO – ikke virkelig kamp')
on conflict (id) do nothing;
