# Security Incident & Remediation Record — INC-2026-11-18-CASHFREE

**Date Identified:** 2026-11-18  
**Severity:** High (Exposed Payment Gateway Sandbox Secret in Local Git Commit)  
**Remediation Status:** Local Code & History Remediated · **Credential Rotation PENDING / NOT YET CONFIRMED**

---

## 1. Incident Summary

During push verification of local branch `design/unslop-foundation`, GitHub Push Protection (`GH013`) blocked the push because local commit `2895c12` (`feat(payments): implement cashfree pg sdk checkout order flow and return handler`) contained hardcoded fallback values for `CASHFREE_APP_ID` and `CASHFREE_CLIENT_SECRET` inside `src/server/cashfree.ts`.

- **Remote Exposure:** None. `2895c12` and its descendant commits were never pushed to `origin`.
- **Client Bundle Exposure:** None. Redacted inspection of built `dist/` assets confirmed zero Cashfree secrets in client-side JS/CSS/HTML bundles.
- **Other Secrets:** Redacted full-history scan across all Git refs (`git rev-list --all`) found zero other exposed secrets (no Supabase service role keys, JWTs, database passwords, private keys, or tracked `.env.local` files).

---

## 2. Remediation Actions Executed

1. **Private Disaster-Recovery Backup:** Created and verified an offline Git bundle outside the repository (`git bundle verify` passed); excluded from all remote pushes and preserved without aggressive reflog pruning until remote sync is confirmed.
2. **Fail-Closed Credential Enforcement (`src/server/cashfree.ts`):** Removed all hardcoded App ID and Client Secret fallbacks. `getCredentials()` now loads exclusively from server environment variables (with local `.env.local` fallback disabled under test runners), rejects placeholder strings, and throws a configuration error before any outbound API request when required credentials are absent.
3. **Automated Security Tests (`src/server/cashfree.test.ts`):** Replaced implicit fallback reliance with synthetic stubbed test credentials (`vi.stubEnv`) and added explicit unit tests asserting fail-closed behavior for missing and placeholder credentials.
4. **Local-Only History Cleanup:** Rewrote only the 6 unpublished local commits (`2895c12`..`ad7a4ad`) into cleaned replacements (`d48a990`..`7ddb92a`). Diff verification confirmed zero unintended changes to Stage 2, Supabase, Stage 3, or Stage E files.

---

## 3. Remaining Security Blocker

> [!CAUTION]
> **Credential Rotation Status: PENDING / NOT YET CONFIRMED**
>
> Treat the previously hardcoded Cashfree sandbox credentials as compromised. Do **not** enable live or sandbox payment processing until the affected sandbox API key pair is revoked/rotated inside the authorized Cashfree merchant dashboard and new credentials are provisioned strictly via server-side environment variables / secret manager.
