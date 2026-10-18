# Delivery 3 — Increment Review and Working Prototype

## Required scope
Running prototype: login, profiles, check-ins, social feed (prioritize if time is short).
Quality: automated tests, CI build/test, GitHub process evidence.
Sprint Review and Retrospective report: 5–10 pages, teamwork/testing/CI/CD reflections.

## Verified evidence
- PR #26 merged: login/profile manually tested in Vercel Preview, GitHub Actions passed.
- PR #27: check-in and visit history manually tested; duplicate rejected; logged-out user prompted to log in; GitHub Actions passed. Navigation fix built but manual confirmation pending.
- This feed branch: NOT yet live-tested; tests and Preview need confirmation.
- User isolation RLS across separate accounts has NOT been tested.
- Team Sprint Review and Retrospective have NOT been conducted.

## Social feed acceptance checklist
1. Merge PR #27 first, after remaining review/security checks.
2. Run `supabase/migrations/202610180003_social_feed.sql` in SQL Editor.
3. Log in, visit /profil, click 'Del dette besøket i feeden' on a check-in.
4. Confirm feed on home page displays 'Supporter · Sjekket inn på kamp'.
5. Verify logged-out visitors cannot see the feed; duplicate sharing is rejected.
6. Use two test accounts to confirm user B sees user A's shared activity but cannot create a post for A's check-in.
7. Record GitHub Actions, Vercel Preview, screenshots and any defects.

## Privacy decisions and limitations
- Feed is opt-in, not automatic. Only authenticated users can read it.
- The feed displays generic 'Supporter' labels, not names or email addresses.
- Feed is a simple activity list; no comments, reactions, photos, moderation or delete feature yet.
- User consent to share should be explained before enabling broad production use.
- Never claim team review, group testing or security checks without evidence.
