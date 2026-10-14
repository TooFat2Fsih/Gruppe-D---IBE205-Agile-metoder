# ADR-001: Implementation technology stack

**Status:** Selected as the working implementation baseline by the project lead on 2026-10-14; pending team review and Deliverable 3 rubric check. **Not** a collective team decision.

## Decision

- **Application:** mobile-first web app with Next.js (React), TypeScript and Tailwind CSS.
- **API/business rules:** Next.js Route Handlers and server-side TypeScript modules; preserve separate presentation, application and data-access responsibilities even within one deployable app.
- **Data:** Supabase-hosted PostgreSQL, with version-controlled SQL migrations and seed data.
- **Authentication:** Supabase Auth; PostgreSQL Row Level Security (RLS) for user-scoped data, server-side authorization for mutations.
- **Testing:** Vitest for units/integration, Playwright for end-to-end tests.
- **CI:** GitHub Actions running checks and tests on pull requests.
- **Hosting:** Vercel for the Next.js app; Supabase for the managed database/auth.

No services or accounts have been provisioned, and no functional application or CI workflow has been implemented by this decision alone.

## Rationale

One TypeScript application reduces integration overhead for a small team while retaining the layered client/API/database architecture described in Deliverable 2. PostgreSQL naturally models User, Club, Stadium, Match, CheckIn, Post, Event and EventAttendance. Managed authentication and hosting reduce infrastructure work. A mobile-first web application is sufficient for the initial prototype and avoids parallel native-app builds.

## Core invariants

- Match.stadiumId is the authoritative stadium relationship for a match-based CheckIn; do not introduce a conflicting CheckIn.stadiumId.
- A successful check-in must persist and then appear in that user's Visit History. Treat the prototype limitation in Issue #18 as a regression scenario, not evidence of a production backend defect.
- Check-in writes require an authenticated user and must enforce authorization on the server/database, not only in the browser.
- Never expose service-role keys to the browser; use environment variables and least-privilege RLS policies.

## Trade-offs and review triggers

- Supabase and Vercel are managed-service dependencies; evaluate course rules, costs, data location and account access before deployment.
- Route Handlers are appropriate for the first increment, but business logic should stay modular so it can later move to a separate backend if needed.
- Reassess if Deliverable 3 mandates another language, framework, hosting platform, or architecture.
- Technology versions will be pinned when scaffolding begins; do not assume a particular latest version here.

## Next steps

1. Draft schema and API contracts without provisioning credentials.
2. After checking Deliverable 3 requirements, scaffold the project and add local setup instructions.
3. Implement a small vertical slice: login → match → check-in → history, then automated tests and CI.
4. Request team review on PR #22; record any objections and changes explicitly.
