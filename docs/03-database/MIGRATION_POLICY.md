# Database Migration Policy — LevUp Projects

**Document Status:** Baseline  
**Migration Tooling:** Supabase CLI / Versioned SQL Migrations  
**Last Updated:** 2026-11-17

---

## 1. Migration Principles

1. **Versioned, Forward-Only Migrations**: All schema modifications must be committed as numbered SQL files in `supabase/migrations/` (format: `YYYYMMDDHHMMSS_<name>.sql`).
2. **Zero-Downtime Design**: Schema additions (new columns, indexes, tables) must be backward-compatible with running application versions. Never drop columns or re-type fields without a phased transition.
3. **No Direct Production DDL**: Modifying production schemas manually via the Supabase dashboard SQL editor is strictly forbidden. All production changes must originate from version-controlled migration files applied via automated CI/CD.
4. **Idempotency**: DDL scripts should employ `IF NOT EXISTS` / `IF EXISTS` where appropriate.

---

## 2. Migration Lifecycle

```
[ Local Dev ] ──> supabase db diff -f <feature_name>
       │
       ▼
[ Review ] ────> Check backwards compatibility & RLS policies in PR
       │
       ▼
[ Staging ] ───> Apply to Supabase Staging via CI (supabase db push)
       │
       ▼
[ Prod ] ──────> Apply to Supabase Production during maintenance window
```

---

## 3. Rollback Procedures

- Every migration PR must document a tested rollback SQL script.
- If a migration fails mid-execution, PostgreSQL transactions roll back the migration step automatically.
- Column removals must follow a 3-release deprecation cycle:
  - **Release N**: Mark column deprecated, remove writes.
  - **Release N+1**: Remove all code reads.
  - **Release N+2**: Apply migration dropping the column.
