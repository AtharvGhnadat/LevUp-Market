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

---

## 4. Server-Side Payment Enablement Control (S1)

To strictly enforce safety before credential rotation confirmation:

1. **Explicit Enablement Gate**: An environment control `CASHFREE_PAYMENTS_ENABLED` is required. It defaults to `false` in development, test, CI, and production.
2. **Fail-Closed Gate**: When `CASHFREE_PAYMENTS_ENABLED !== "true"`, all payment creation and verification endpoints respond with HTTP 503 (`PAYMENTS_DISABLED`) and zero outbound network calls to Cashfree are attempted. Credentials are not even inspected.
3. **UI Synchronization**: Storefront checkout mirrors gateway state, alerting customers that payments are paused and disabling submit buttons.

---

## 5. Supabase Clean-Environment Security (A1, S6, S7)

1. **Lazy Initialization & Module Boundaries**: Neither client nor admin Supabase instances are initialized at module evaluation time. The public `supabase` client is wrapped in a fail-closed proxy that raises clean configuration errors only if methods are invoked when unconfigured.
2. **Synthetic Unit Fixtures**: Unit tests run in clean environments with no live Supabase credentials, using synthetic environment variables (`vi.stubEnv`) and module mocks.
3. **Security Definer Hardening**: `supabase/migrations/20261118000002_security_hardening.sql` hardens `public.is_admin()` by eliminating arbitrary UUID parameters, binding strictly to caller `auth.uid()`, and revoking public execute privileges.
4. **Order Insertion Constraints**: Financial orders and order items can only be created by customers in `draft` or `pending_payment` status.

---

## 6. Public Error & Diagnostic Redaction (S5)

1. Gateway responses to browsers return allowlisted fields only (`order_id`, `order_status`, `order_amount`, `order_currency`, `payment_time`).
2. Raw provider diagnostics, upstream JSON error bodies, and customer PII are strictly excluded from client responses and structured log messages. Generic user-facing messages are paired with correlation IDs for operational tracing.
