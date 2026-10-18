# Delivery 3 — Increment Review and Working Prototype

## Assignment scope
Prototype: login, user profiles, stadium check-ins and a social feed (prioritize if short on time).
Quality: automated key-feature tests, CI build/test on commits, GitHub process evidence.
Report: 5–10 pages, Sprint Review and Retrospective, teamwork, testing, CI/CD and lessons learned.

## Actual evidence and remaining validation
- PR #26: Supabase Auth login/profile increment merged into main; developer manually tested registration, login, profile display and logout in Vercel Preview. GitHub Actions passed.
- Check-in increment: implemented in this branch, not yet validated against live Supabase or merged.
- Social feed: not implemented.
- Sprint Review / Retrospective: not yet conducted. Do not invent group participation or peer feedback.
- Collect actual GitHub PR/commit dates, CI results, deployment outcomes, manual test observations and defects.

## Acceptance tests for check-in PR
1. Review and run `supabase/migrations/202610180002_checkins.sql` in Supabase SQL Editor.
2. Open Vercel Preview, log in, open homepage and check in to the fictional demo match.
3. Confirm success message and a new entry in /profil under Min besøkshistorikk.
4. Try a duplicate check-in: should be rejected with an understandable message.
5. Log out and attempt to check in: should require login.
6. Verify RLS in Supabase: user A cannot read or insert rows for user B.
7. Confirm GitHub Actions checks pass before merging.

## Prototype limitations
- Check-in is allowed on any existing match, including the fictional demo fixture; no geolocation or match-time validation yet.
- The app only displays the first 20 matches and the 50 most recent check-ins.
- No photo upload, comments, social feed, moderation or admin UI yet.
- Live RLS isolation tests remain mandatory before claiming access controls are verified.
