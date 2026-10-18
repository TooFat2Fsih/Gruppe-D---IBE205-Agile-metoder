# Delivery 3 — Increment Review and Working Prototype

## Scope from assignment
Prototype: user login, user profiles, stadium check-ins, social activity feed (prioritize if time is short).
Engineering: automated key-feature tests; CI builds/tests on commits; collect process data from GitHub.
Report: 5–10 pages covering Sprint Review, Retrospective, teamwork, testing, CI/CD and lessons learned.

## Sprint increment status (evidence, not assumptions)
- Before D3: match list is deployed; Supabase read access verified by the developer in Preview and Production.
- Auth/profile increment: implementation proposed in this branch, NOT yet merged or verified against live Supabase.
- Check-ins and social feed: not yet implemented.
- Team Sprint Review / Retrospective: not yet performed; do not fabricate group participation.
- GitHub Actions workflow: exists, but verify checks for this branch before merging.
- Collect actual commit timestamps, PRs, CI run URLs/results, deployment outcomes and defects throughout sprint.

## Manual acceptance checks before merge
1. Run migration `supabase/migrations/202610180001_auth_profiles.sql` in Supabase SQL Editor.
2. Ensure Supabase Auth email signup is enabled; inspect email confirmation settings.
3. In Vercel Preview, register with a test email and confirm as configured.
4. Log in; verify /profil displays the account and name; log out; verify access is denied.
5. Verify users cannot read other users' profiles (RLS) and no credentials appear in logs.
6. Check the GitHub Actions build/test result and capture the Preview deployment result.

## Security and limitations
- Auth uses Supabase Auth REST endpoints through Next.js API routes; session tokens are HTTP-only cookies.
- This prototype does not implement password reset, profile editing, rate limiting, or production-grade abuse controls.
- Never commit service-role keys, real user passwords or environment variable values.
- RLS for profile read exists in the first migration; profile provisioning requires the new migration.
- Check-ins and social feed will require separate RLS design and testing.
