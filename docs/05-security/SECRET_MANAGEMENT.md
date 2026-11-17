# Secret Management & Credential Hygiene — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Secret Classification

| Tier                            | Secrets                                                                            | Storage Location                                 | Exposure Rules                                                       |
| ------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| **Tier 1 (Critical Financial)** | `CASHFREE_CLIENT_SECRET`<br>`CASHFREE_WEBHOOK_SECRET`                              | Vercel Environment Variables (Encrypted at rest) | Server-side API handlers only. Never logged. Never in Git.           |
| **Tier 2 (Database Root)**      | `SUPABASE_SERVICE_ROLE_KEY`                                                        | Vercel Environment Variables                     | Server-side Next.js route handlers only. Never bundled in client JS. |
| **Tier 3 (Public Keys)**        | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`<br>`CASHFREE_APP_ID` | Vercel & `.env.local`                            | Safe for client bundle. Protected by PostgreSQL RLS.                 |

---

## 2. Leakage Prevention Policies

1. **Strict `.env*` Exclusions**: All real environment files (`.env`, `.env.local`, `.env.production`) are excluded in `.gitignore`. Only `.env.example` with blank dummy values is committed.
2. **Log Redaction**: Central logging utility automatically strips credentials matching key patterns: `secret`, `key`, `token`, `password`, `otp`, `signature`, `auth`.
3. **Automated Secret Scanning**: Pre-commit hooks and GitHub Actions secret scanning scan commits for pattern-matched credentials before push.
