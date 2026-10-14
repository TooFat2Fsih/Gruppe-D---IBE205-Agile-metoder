# API contracts v1 — Stadionhopper

**Status:** proposed interfaces, not implemented. Stack: Next.js Route Handlers, TypeScript, Supabase Auth and PostgreSQL (ADR-001). Based on Deliverable 2 architecture and domain model.

## Conventions

- Prefix `/api/v1`; JSON responses. UTC timestamps in ISO 8601. UUID identifiers.
- Auth via validated Supabase session/cookies on server. Do not trust a `userId` supplied by the browser.
- Error shape: `{ "error": { "code": "MACHINE_READABLE", "message": "Human-readable explanation" } }`.
- Common HTTP codes: 200/201 success, 400 invalid input, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 500 unexpected error. Validate input server-side.
- Pagination: initial `limit` + `cursor` for lists; enforce max limit.
- These contracts are proposals; no endpoints exist yet.

## First vertical slice

### `GET /api/v1/matches?from=<ISO8601>&limit=20`

**Auth:** public read of pilot match data, subject to course/privacy requirements.

**200:** `{ "items": [{ "id": "uuid", "startTime": "2026-10-20T17:00:00Z", "status": "scheduled", "competition": null, "homeClub": { "id": "uuid", "name": "Home" }, "awayClub": { "id": "uuid", "name": "Away" }, "stadium": { "id": "uuid", "name": "Ground", "location": "Town" } }], "nextCursor": null }`.

### `GET /api/v1/matches/{matchId}`

**200:** one match with home club, away club and stadium; **404** if unknown.

### `GET /api/v1/me`

**Auth:** required. **200:** `{ "id": "uuid", "name": "Supporter", "email": "user@example.test", "profileImageUrl": null }`. Do not return other users' private fields.

### `POST /api/v1/check-ins`

**Auth:** required.

**Request:** `{ "matchId": "uuid", "photoUrl": null, "comment": null }`.

**Server:** validate session, match existence and any check-in timing/duplicate policy once approved; insert with `user_id` from session, `match_id` from body. Resolve stadium via Match. Never accept `stadiumId` or `userId` in request.

**201:** `{ "id": "uuid", "matchId": "uuid", "createdAt": "2026-10-20T17:05:00Z", "stadium": { "id": "uuid", "name": "Ground" } }`.

**Error:** 401 no session; 404 match not found; 400 invalid input; 409 if an eventual duplicate/time policy rejects check-in. Never show a success UI for a failed insert.

### `GET /api/v1/me/check-ins?limit=20&cursor=<opaque>`

**Auth:** required. Returns only the authenticated user's persisted records, newest first, including joined match/stadium details.

**200:** `{ "items": [{ "id": "uuid", "createdAt": "2026-10-20T17:05:00Z", "match": { "id": "uuid", "startTime": "2026-10-20T17:00:00Z" }, "stadium": { "id": "uuid", "name": "Ground" } }], "nextCursor": null }`.

This route is the regression target for Issue #18: after a successful POST, a subsequent GET must include the saved record.

## Later features — contracts to design, not implement yet

- `GET /api/v1/posts` and `POST /api/v1/posts` for social feed; privacy/moderation rules required.
- `GET /api/v1/events`, `POST /api/v1/events/{eventId}/rsvp`, `GET /api/v1/me/event-attendance` for event RSVP.
- Authorized club/stadium management endpoints; admin roles and permissions not yet defined.
- Follow/friend feature requires its own model and access rules; it is a Discovery MVP Must Have but was intentionally excluded from the Deliverable 2 minimal domain model.

## Acceptance tests to implement

1. Anonymous users can view published pilot matches but cannot create check-ins or view `/me` data.
2. Authenticated user can create a check-in for a valid match; persisted `match_id` matches request and stadium is obtained from `matches.stadium_id`.
3. New check-in appears in that user's Visit History after a fresh request.
4. User A cannot retrieve User B's check-ins; client-supplied `userId` cannot override session identity.
5. Missing match returns 404; malformed UUID returns 400; database failure does not yield a false success confirmation.
6. Match with identical home/away club is rejected by database constraint.
7. When duplicate and check-in time policies are decided, add tests for both.

## Dependencies

`docs/domain/domain-model.md`, `docs/domain/domain-model.pseudo.md`, `docs/architecture/architecture.md`, `docs/architecture/adr-001-technology-stack.md`, Development Backlog DEV-03/04/06–11 and Issues #6, #7, #12–14, #18.
