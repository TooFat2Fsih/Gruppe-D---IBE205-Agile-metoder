# Delivery 3 — Increment Review and Working Prototype

## Delivered scope (verified October 18, 2026)
- Live prototype: https://stadionhopper.vercel.app
- Authentication: register, sign in, profile and sign out (PR #26).
- Stadium/match check-in, personal history, duplicate check-in prevention and authentication-aware navigation (PR #27).
- Opt-in sharing of check-ins to an authenticated activity feed; duplicate sharing prevention (PR #28).
- Demonstration match and stadium are fictional seed data. Check-ins do **not** verify physical attendance.

## GitHub process evidence
- PR #22: backlog, architecture decisions, database/API planning.
- PR #23: Next.js scaffold and CI.
- PR #24: removed temporary lockfile workflow.
- PR #25: Supabase schema, seed and fixture fetching.
- PR #26: Auth/profile; merged October 18, 2026.
- PR #27: check-ins/history; merged October 18, 2026.
- PR #28: opt-in social feed; merged October 18, 2026 at 20:33 UTC.
- Main commit after PR #28: `312f4a3baa01c25141f8e8e1c084c3eb99218ae2`.
- Successful main CI: https://github.com/jgaseland/Gruppe-D---IBE205-Agile-metoder/actions/runs/39163877077
- Earlier scaffold CI failure (later fixed): https://github.com/jgaseland/Gruppe-D---IBE205-Agile-metoder/actions/runs/38623569092

## Manually checked behavior (performed with test accounts)
| Scenario | Observed result |
| --- | --- |
| Registration, login, profile and logout | Worked |
| Check-in and personal visit history | Worked |
| Duplicate check-in | Rejected |
| Logged-out check-in | Blocked / prompted to sign in |
| Authenticated navigation | Correct profile/logout controls |
| Second account viewing its own history | No first-account entries shown |
| Share a check-in to feed | Activity appeared |
| Second account reading shared feed activity | Activity visible |
| Duplicate feed sharing | Rejected |
| Logged-out feed access | Blocked |

These are manual **UI-level** observations, not a complete integration, load or penetration test. In particular, direct cross-user writes against Supabase Row Level Security were **not** adversarially tested.

## Automated checks
`.github/workflows/app-checks.yml` runs on app/workflow changes in pull requests and pushes to `main`. It installs dependencies with `npm ci`, runs `npm run lint` (which is currently **TypeScript typechecking**, not ESLint), runs `npm test` (Vitest), and builds the Next.js application. Successful CI proves these configured checks passed for the tested commit; it does not establish production availability or complete security.

## Sprint review and retrospective — evidence limits
A formal **group** Sprint Review and Retrospective did not take place. The deliverable report contains an explicitly individual review of delivered scope, quality checks, blockers and improvements; it must not be presented as a team ceremony. No external pilot feedback or formal usability study has been claimed.

## Open limitations / next steps
- Independently verify Supabase RLS policies with adversarial cross-account requests.
- Capture dated production screenshots and GitHub Actions screenshots for report evidence.
- Test complete user journey again on the production URL before submission.
- Review open GitHub issues and distinguish completed implementation from UX hypotheses and unresolved usability work.
- Follow/friend, photo upload, moderation, reactions, event RSVPs and attendance validation are outside the verified D3 increment.
- Keep user data and access tokens out of screenshots and repository history.
