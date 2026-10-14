# Supabase foundation (Sprint 1A)

**Status:** migrations and read-only integration code prepared, **not applied to any Supabase project**. No real connection, authentication, check-in writes or production data.

## Setup

1. Create a **development** project at https://supabase.com/dashboard (a team-controlled account is preferable). Check course requirements and data region first.
2. In Supabase SQL Editor, apply `migrations/202610140001_initial_schema.sql` on a fresh project. SQL Editor runs with elevated permissions; review SQL before execution. Do not apply to an existing database with live data.
3. Optionally run `seed.sql` for **fictional** sample data. These are not real football fixtures.
4. Copy `app/.env.example` to `app/.env.local`, fill in `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from project API settings. **Never commit .env.local.**
5. From `app/`, run `npm ci`, `npm run dev`, then open http://localhost:3000. Without credentials, the page shows a configuration message; with credentials, it fetches up to 20 matches through read-only PostgREST.

## Security and boundaries

- All eight tables have RLS enabled. Anonymous reads only access stadium, club and match reference data; personal tables are restricted or denied.
- No write policies are enabled. Check-in persistence, authorization, repeat/time policies and Auth must be designed and tested in a separate PR before enabling mutations.
- No service-role or secret API key in the frontend, server environment, repository or CI.
- The server-side integration uses HTTPS PostgREST with a publishable/anon key to avoid changing dependencies in this preparatory PR. A typed Supabase client can be introduced when auth is implemented.
- Migration is an initial one-time schema, not an upgrade path for existing databases. Validate with a disposable Supabase project and add migration tooling later.
- No claim of live Supabase connectivity or real-user testing.

## Acceptance checks

- SQL migration succeeds in a clean Supabase development project.
- Anonymous query to `matches` with joins returns only non-personal fields.
- Anonymous reads of `users`, `check_ins`, `posts` and `event_attendance` return no personal records.
- Anonymous and authenticated client writes are rejected by RLS.
- Page displays a helpful error when credentials are absent or a query fails, rather than silently showing fake live results.
- `npm run lint`, `npm test`, and `npm run build` pass in GitHub Actions.

See `docs/architecture/database-design-v1.md` and `docs/architecture/api-contracts-v1.md` for product decisions still open.
