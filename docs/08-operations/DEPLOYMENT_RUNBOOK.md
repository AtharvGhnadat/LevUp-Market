# Production Deployment Runbook — LevUp Projects

**Document Status:** Baseline  
**Platform:** Vercel + Supabase  
**Last Updated:** 2026-11-17  

---

## 1. Pre-Deployment Steps

1. Verify all CI quality gates pass on `main` (lint, typecheck, build, unit tests).
2. Check database migration status:
   ```bash
   pnpm exec supabase db diff
   pnpm exec supabase migration list
   ```
3. Apply pending migrations to production Supabase:
   ```bash
   pnpm exec supabase db push
   ```
4. Verify Cashfree webhook endpoint matches `https://levupprojects.com/api/webhooks/cashfree`.

---

## 2. Deployment Execution

1. Create annotated release tag from `main`:
   ```bash
   git tag -a v1.0.0 -m "release: v1.0.0 production launch"
   git push origin v1.0.0
   ```
2. Vercel automatically deploys the tagged release.
3. Run smoke tests:
   - Check Homepage (`/`)
   - Check Catalog (`/projects`)
   - Check Project Detail (`/projects/esp32-smart-irrigation-system`)
   - Submit test inquiry on `/custom-project`
4. Update `docs/10-releases/DEPLOYMENT_HISTORY.md`.
