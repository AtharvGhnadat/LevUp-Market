# Security Testing & Verification — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Automated Security Verification Gates

| Test Category               | Target Vector                         | Tooling                                | Execution Frequency                 |
| --------------------------- | ------------------------------------- | -------------------------------------- | ----------------------------------- |
| **Dependency Scanning**     | Known CVEs in npm / pnpm dependencies | `pnpm audit` / Dependabot              | Every PR and weekly cron            |
| **Secret Scanning**         | Accidental API secret commits         | GitHub Secret Scanning                 | Pre-commit & on push                |
| **Static Code Analysis**    | XSS, SQLi, Prototype Pollution        | ESLint Security Plugin                 | Every PR via GitHub Actions         |
| **RLS Policy Testing**      | Cross-tenant data leakage             | Vitest + Supabase Local Test Container | Automated test run on schema change |
| **Webhook Signature Tests** | Replay & altered payload forgery      | Vitest unit test suite                 | Every PR                            |

---

## 2. Manual Penetration & Architecture Review

Prior to `v1.0.0` production deployment:

- Verify that every admin API route rejects non-allowlisted bearer tokens.
- Attempt price tampering via forged checkout payloads (must result in 422 error).
- Attempt direct unauthenticated S3/Supabase Storage URL access (must return 403 Forbidden).
