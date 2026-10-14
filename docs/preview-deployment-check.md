# Preview deployment verification

This documentation-only change triggers a fresh build on `feature/supabase-foundation` after connecting the repository to Vercel.

Before merging PR #25, verify that Vercel creates a Preview deployment, that the environment variables `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` are configured for Preview, and that the seeded example match loads from Supabase. GitHub CI alone does not verify database connectivity or RLS.
