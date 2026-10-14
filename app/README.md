# Stadionhopper — runnable app scaffold

**Status:** initial frontend/backend scaffold only. No Supabase connection, authentication, check-in persistence, visit history or deployment has been implemented.

## Requirements

Node.js 22 LTS or later and npm. This scaffold is based on Next.js 15 / React 19 / TypeScript / Tailwind CSS 4 / Vitest 3. Dependency versions are constrained in `package.json`; generate and commit a lockfile before production/CI use.

## Run locally

```bash
cd app
npm install
npm run dev
```

Open `http://localhost:3000`. The page displays **clearly marked demonstration data**, not real fixtures. `GET /api/health` returns a scaffold-only JSON health response.

## Checks

```bash
npm run lint   # TypeScript type checking
npm test       # Vitest unit test
npm run build  # Next.js production build
```

**Verification note:** commands are provided but have not been executed by the GitHub documentation commit. Run and record their results before claiming a passing build or CI.

## Structure

- `src/app/` — App Router UI and health endpoint
- `src/lib/` — small presentation data model and unit test
- `.env.example` — placeholder only; no real credentials

## Next steps

Review Deliverable 3 requirements; decide and document any needed framework changes; add Supabase client and migrations in separate issues/PRs; implement authenticated check-in and visit history with integration tests. Keep `docs/architecture/adr-001-technology-stack.md`, `docs/architecture/database-design-v1.md` and `docs/architecture/api-contracts-v1.md` as the source of proposed design decisions.
