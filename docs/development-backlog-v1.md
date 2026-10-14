# Development Backlog v1 — proposed

> **Status: proposal for team review.** Deliverable 3 instructions have not yet been released. No technology stack, assignees, sprint commitment, or changed MoSCoW priority has been approved.

## Scope and traceability

The first technical increment follows the documented Sprint 1 target: authentication → match discovery → match details → check-in → confirmation → visit history. This is **not** the whole Discovery MVP. The README also lists social feed, follow/friend functionality and simple club/stadium administration as Must Have; those remain in the product scope pending team and assignment review. Events/meetups with RSVP remain Should Have.

Related existing issues: #3–#8 (story/quality reviews), #11 (real usability testing), #12–#14 (UX improvements), #16–#17 (clickable prototype), #18 (check-in/history prototype quality gate), #19 (repository organization). Do not duplicate these without reviewing their status.

## Proposed development items

### DEV-01 — Select and document implementation stack

**Scope:** Record frontend, API, database, auth and hosting choices with rationale; distinguish proposal from approved decision.

**Acceptance criteria:** Decision record covers alternatives, cost/complexity and fit with layered architecture.

**Dependencies:** None.

### DEV-02 — Initialize runnable application

**Scope:** Create project scaffold with local setup instructions and environment template (no secrets).

**Acceptance criteria:** Fresh clone installs and runs locally; README commands verified.

**Dependencies:** DEV-01.

### DEV-03 — Implement core domain persistence

**Scope:** Model User, Club, Stadium, Match, CheckIn with Match as source of stadium for match check-ins.

**Acceptance criteria:** Schema and migrations reproducible; relationships tested; no redundant CheckIn.stadiumId.

**Dependencies:** DEV-01, DEV-02.

### DEV-04 — Implement sign-in and access control

**Scope:** Provide authentication for personal check-ins and profile.

**Acceptance criteria:** User can sign in/out; unauthenticated writes blocked; error states clear.

**Dependencies:** DEV-02.

### DEV-05 — Implement basic user profile

**Scope:** Show basic account identity and navigation to visits.

**Acceptance criteria:** Authenticated user can see their own profile; other users' private data protected.

**Dependencies:** DEV-04.

### DEV-06 — Build match and stadium discovery

**Scope:** Display pilot matches with stadium/club information, initially with clearly labeled seed data.

**Acceptance criteria:** Users can browse matches and identify stadium; empty/loading/error states handled.

**Dependencies:** DEV-02, DEV-03.

### DEV-07 — Build match details

**Scope:** Show selected match's teams, time and venue, with prominent check-in action.

**Acceptance criteria:** Selected match details consistent with data; check-in action easy to find (Issue #12).

**Dependencies:** DEV-06.

### DEV-08 — Persist match-based check-ins

**Scope:** Allow authenticated users to create a visit linked to a Match.

**Acceptance criteria:** Valid check-in saved against user and match; stadium derived from match; failures reported.

**Dependencies:** DEV-03, DEV-04, DEV-07.

### DEV-09 — Display persisted visit history

**Scope:** Retrieve and show current user's completed visits.

**Acceptance criteria:** Newly saved check-in appears in history, not just demo data; regression covers Issue #18.

**Dependencies:** DEV-08, DEV-05.

### DEV-10 — Provide check-in confirmation and error handling

**Scope:** Give clear saved-state feedback and route to visit history.

**Acceptance criteria:** Confirmation only after successful persistence; link to visits; errors do not show success (Issue #13).

**Dependencies:** DEV-08, DEV-09.

### DEV-11 — Add automated unit and integration tests

**Scope:** Test domain invariants, auth boundaries, check-in and visit-history roundtrip.

**Acceptance criteria:** Tests run locally; check-in→history integration passes; failures are visible.

**Dependencies:** DEV-03, DEV-08, DEV-09.

### DEV-12 — Configure GitHub Actions CI

**Scope:** Run install, lint/static checks, tests and build on PRs after stack selected.

**Acceptance criteria:** Workflow runs on PRs and main; failed tests/build fail job; no secrets committed.

**Dependencies:** DEV-02, DEV-11.

### DEV-13 — Run real-user usability test

**Scope:** Conduct small participant test on working or testable flow; distinguish observations from earlier simulated walkthrough.

**Acceptance criteria:** Consent and task script prepared; findings recorded as actual observations; new issues linked (Issue #11).

**Dependencies:** DEV-07, DEV-10.

### DEV-14 — Plan social feed and follow functionality

**Scope:** Specify and later implement social feed/follow capabilities retained as Must Have in original README MVP.

**Acceptance criteria:** Scope and acceptance criteria agreed; privacy/moderation risks noted; no implementation commitment before D3 brief.

**Dependencies:** DEV-01.

### DEV-15 — Plan events and club/stadium administration

**Scope:** Clarify original Must Have administration and Should Have event RSVP; split into separate stories when approved.

**Acceptance criteria:** Acceptance criteria and roles for administration specified; event RSVP separate and prioritized according to Discovery.

**Dependencies:** DEV-01.

## Suggested sequencing

1. Foundation: DEV-01–03, then DEV-04–07.
2. End-to-end slice: DEV-08–10, with DEV-11 tests developed alongside implementation.
3. Quality: DEV-12 and DEV-13.
4. Broader MVP: DEV-14–15 require scope clarification; retain Discovery MoSCoW categories.

## Decisions awaiting review

- Deliverable 3 rubric and scope
- Stack and deployment approach
- Photo requirement for MVP check-in (existing US04 quality review)
- Whether Visit History displays all visits or distinct stadiums (existing US06 quality review)
- How to handle real-user testing and the prototype's documented check-in/history limitation (#18)
- Team responsibilities and peer-review arrangements

**Working rule:** do not claim a peer review, user test, or functional CI implementation unless it actually occurred.
