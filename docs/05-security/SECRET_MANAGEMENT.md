# Secret Management & Credential Hygiene — LevUp Projects

**Document Status:** Updated (Post-Remediation)  
**Last Updated:** 2026-11-18

---

## 1. Secret Classification

| Tier                            | Secrets                                                                            | Storage Location                                 | Exposure Rules                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| **Tier 1 (Critical Financial)** | `CASHFREE_CLIENT_SECRET`<br>`CASHFREE_WEBHOOK_SECRET`                              | Vercel Environment Variables (Encrypted at rest) | Server-side API handlers only. Never logged. Never in Git.                     |
| **Tier 2 (Database Root)**      | `SUPABASE_SERVICE_ROLE_KEY`                                                        | Vercel Environment Variables                     | Server-side Next.js route handlers only. Never bundled in client JS.           |
| **Tier 3 (Public Keys)**        | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`<br>`CASHFREE_APP_ID` | Vercel & `.env.local`                            | Safe for client bundle (`CASHFREE_APP_ID` kept server-side). Protected by RLS. |

---

## 2. Leakage Prevention Policies

1. **Strict `.env*` Exclusions**: All real environment files (`.env`, `.env.local`, `.env.production`) are excluded in `.gitignore`. Only `.env.example` with blank placeholder values is committed.
2. **Fail-Closed Credential Loading (Zero Hardcoded Defaults)**: Server services (`src/server/cashfree.ts`) MUST NEVER define hardcoded fallback credentials (including sandbox/test keys). Missing or placeholder credentials must throw a configuration error before any outbound network request is attempted.
3. **Synthetic Unit-Test Fixtures Only**: Automated tests (`src/server/cashfree.test.ts`) must stub obviously synthetic non-production strings via `vi.stubEnv` and must include explicit assertions proving fail-closed behavior when env vars are unset.
4. **Log Redaction**: Central logging utility automatically strips credentials matching key patterns: `secret`, `key`, `token`, `password`, `otp`, `signature`, `auth`.
5. **Automated Secret Scanning**: GitHub Push Protection and local history/bundle secret scans must pass before any push; never bypass Push Protection.

---

## 3. Incident Remediation Log

- **2026-11-18 — Cashfree Sandbox Fallback Removal:** See [INCIDENT_2026_11_18_CASHFREE_FALLBACK.md](INCIDENT_2026_11_18_CASHFREE_FALLBACK.md). Hardcoded sandbox fallbacks introduced in unpublished local commit `2895c12` were removed via local history remediation (`2895c12` → `d48a990`). **Credential rotation status: PENDING / NOT YET CONFIRMED** — payment processing remains blocked until rotation is confirmed in the Cashfree merchant portal.
