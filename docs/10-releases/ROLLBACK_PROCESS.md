# Rollback Process & Disaster Recovery — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Instant Application Rollback (Vercel)

If a critical flaw (e.g. checkout broken, severe crash, security leak) is detected post-deployment:
1. Open Vercel Project Dashboard → Deployments.
2. Select previous stable deployment.
3. Click **Instant Rollback**. Vercel redirects edge routing to previous deployment instantly (~2 seconds).

---

## 2. Database Rollback

If a migration introduced breaking changes:
1. Review the down-migration script associated with the failed version in `supabase/migrations/`.
2. Apply the down-migration using Supabase CLI.
3. Verify data integrity against transaction logs.

---

## 3. Git Emergency Revert

```bash
# Checkout main and create hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/revert-release-xyz

# Revert commit cleanly
git revert <commit-sha> -m 1

# Push and initiate emergency PR
git push origin hotfix/revert-release-xyz
```
