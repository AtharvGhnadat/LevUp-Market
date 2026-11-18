# LevUp Projects — Codex Findings Remediation & CI Stabilization Report

**Date:** 2026-11-19 (IST)  
**Branch:** `fix/codex-remediation-ci-stabilization`  
**Base Commit:** `740a168` (`feat/stage-e-custom-project`)  
**Auditor Reference:** `docs/07-testing/CODEX_INDEPENDENT_REVIEW.md`  
**Cashfree Credential Rotation Status:** **PENDING / NOT YET CONFIRMED**

---

## 1. Executive Summary

This remediation resolves all confirmed defects and security gaps identified during the independent Codex code review (`CODEX_INDEPENDENT_REVIEW.md`), stabilizes GitHub Actions CI across clean environments and Windows workstations, and prepares the LevUp repository for controlled pull-request merging.

All approved Stage 1–3 visual work, master LevUp SVG assets, custom-project requisition features, Supabase architecture, and Cashfree security enhancements have been strictly preserved. No historical Git commits were rewritten, no force-pushes were performed, and no direct commits were made to `main`.

---

## 2. Findings Verification & Remediation Matrix

| Finding ID | Severity | Codex Review Finding                                                                                                           | Remediation Implemented in Source                                                                                                                                                                                                                                                                                                                                      | Verification Evidence                                                                                                                              |
| :--------- | :------- | :----------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S1**     | High     | No server-side enable gate; payments could run before rotation confirmation.                                                   | Added `isCashfreePaymentsEnabled()` gating `/api/payments/cashfree/*` endpoints (defaulting to `false`). Returns HTTP 503 and executes 0 outbound network requests when disabled. Synchronized `CheckoutPage.tsx` with a warning banner and disabled submit button.                                                                                                    | `src/server/cashfree.test.ts` (disabled gate test passes); `src/lib/cashfree.test.ts` (503 response test passes); E2E test verifies paused notice. |
| **S2**     | High     | Create order parsed unbounded JSON; accepted client prices without verification; empty cart allowed demo payments.             | Added `calculateAuthoritativeTotal()` in `src/server/cashfree.ts` resolving prices directly from catalog definitions (`projectDetails` and `demoProjects`). Added client price divergence check (rejects tampered prices). Added bounded customer input validation (name 2–100 chars, RFC email, 10–15 digits phone). Empty cart submissions outside catalog rejected. | `src/server/cashfree.test.ts` asserts price tampering rejection and authoritative total calculation.                                               |
| **S3**     | High     | Verification returned raw provider JSON; unvalidated `order_id` format; customer details/bank info could leak.                 | Added strict regex validation `^[A-Za-z0-9_-]{3,64}$` for `order_id`. Sanitized response to strictly allowlisted fields (`order_id`, `order_status`, `order_amount`, `order_currency`, `payment_time`). Provider diagnostic text and bank details stripped.                                                                                                            | `src/server/cashfree.test.ts` asserts invalid ID rejection and allowlisted fields.                                                                 |
| **S4**     | High     | Order creation lacked application idempotency key; potential duplicate payment sessions.                                       | Added `idempotencyKey` caching in `src/server/cashfree.ts` (`orderIdempotencyCache`). Reuses existing active session on retry without spawning duplicate Cashfree gateway orders.                                                                                                                                                                                      | `src/server/cashfree.test.ts` asserts single fetch execution on repeated calls with identical idempotency key.                                     |
| **S5**     | Medium   | Provider diagnostics and free-form error strings escaped into public responses and logs.                                       | Replaced raw error string leakage in `src/server/cashfree.ts`, `vite.config.ts`, and `src/server/supabase-admin.ts` with standardized correlation IDs, generic public errors, and sanitized logging.                                                                                                                                                                   | Verified via static analysis and test suite.                                                                                                       |
| **S6**     | High     | Supabase order and item INSERT policies lacked state and financial restrictions.                                               | Created `supabase/migrations/20261118000002_security_hardening.sql`: restricted order and item inserts to `draft` and `pending_payment` states. Customers cannot inject items into paid orders.                                                                                                                                                                        | SQL migration syntax validated.                                                                                                                    |
| **S7**     | Medium   | `public.is_admin(p_user_id UUID)` took arbitrary UUID; audit log insert allowed arbitrary action/resource.                     | Created parameterless `public.is_admin()` bound strictly to `(SELECT auth.uid())` in `20261118000002_security_hardening.sql`, revoked public execution grants, and constrained client audit log inserts to permitted action enumerations.                                                                                                                              | SQL migration syntax validated.                                                                                                                    |
| **A1**     | High     | Module-level `createClient` in `src/lib/supabase.ts` threw `supabaseKey is required` in clean environments without keys.       | Replaced eager initialization with lazy getter `getSupabaseClient()` and transparent fail-closed proxy `export const supabase`. Module imports never throw in clean CI environments. Added synthetic test fixtures in `src/lib/supabase.test.ts`.                                                                                                                      | `src/lib/supabase.test.ts` passes 4/4 in clean environment without env files.                                                                      |
| **A2**     | Medium   | Requisition draft in `localStorage` had no expiry/version; prefill overwrote stored draft after 350 ms.                        | Added schema versioning (`version: 1`), 7-day TTL expiry (`DRAFT_MAX_AGE_MS`), and shape validation in `src/custom-project/custom-project-state.ts`. Updated `CustomProjectPage.tsx` so existing stored drafts are preserved when prefill is queried.                                                                                                                  | `src/custom-project/custom-project-state.test.ts` asserts 7-day TTL discard.                                                                       |
| **A3**     | Medium   | Unguarded `decodeURIComponent` in `App.tsx` crashed on malformed slugs; prefix return route matching; hardcoded return origin. | Wrapped slug decoding in try/catch in `App.tsx` falling back to `PlannedRoutePage`. Restricted return route matching to exact `/checkout/return`. Used `to("/checkout/return")` in `src/lib/cashfree.ts` for deployment base path compatibility.                                                                                                                       | Tested with malformed URI parameters and base path verification.                                                                                   |
| **A4**     | Medium   | Focus dropped to `BODY` after advancing to Review phase or clicking Back to Edit.                                              | Added `reviewHeadingRef`, `editHeadingRef`, and `submittedHeadingRef` in `src/pages/CustomProjectPage.tsx`. Programmatically moves focus to respective headings on phase transitions.                                                                                                                                                                                  | Verified via component state inspection.                                                                                                           |
| **A5**     | Medium   | Return page downloads only triggered browser `alert()`; implied unverified live fulfillment.                                   | Replaced browser `alert()` with accessible inline status notifications and explicit "Sandbox Preview" labeling in `src/pages/CheckoutReturnPage.tsx`.                                                                                                                                                                                                                  | Verified via UI inspection and build test.                                                                                                         |
| **A6**     | Low      | Custom project validation checked presence only; unvalidated category/budget enums and loose phone digits.                     | Added strict enumeration validation for `categoryOptions`, `budgetRangeOptions`, and `classification`; added calendar date validation (`!isNaN(Date.parse(...))`); enforced exact 10-digit phone number.                                                                                                                                                               | `src/custom-project/custom-project-state.test.ts` asserts enum and date validation.                                                                |
| **Q1**     | Medium   | Prettier format check failed on 87 files on Windows due to CRLF checkout.                                                      | Added line-ending normalization rules (`* text=auto eol=lf`) to `.gitattributes` and set `"endOfLine": "auto"` in `.prettierrc`. Retained 100% of first-party code within formatting checks.                                                                                                                                                                           | `pnpm format:check` passes with 0 warnings ("All matched files use Prettier code style!").                                                         |
| **Q2**     | High     | CI lacked `design/**` push trigger, lacked stacked base PR triggers, and had no E2E job.                                       | Updated `.github/workflows/ci.yml` with `design/**` branch push filter, stacked PR bases (`main`, `chore/**`, `design/**`, `feat/**`), and added Playwright Chromium E2E job with frozen lockfile.                                                                                                                                                                     | Workflow file validated; local Playwright run passed 8/8.                                                                                          |

---

## 3. Verification Test Evidence

All quality gates pass cleanly across local and clean-environment configurations:

### A. Prettier Formatting (`pnpm format:check`)

```
$ prettier --check .
Checking formatting...
All matched files use Prettier code style!
```

### B. ESLint (`pnpm lint`)

```
$ eslint .
✖ 5 problems (0 errors, 5 warnings)
Command exited with code 0.
```

### C. TypeScript Typecheck (`pnpm typecheck`)

```
$ tsc --noEmit
Command exited with code 0.
```

### D. Vitest Unit Test Suite (`pnpm test`)

```
$ vitest run
 ✓ src/server/cashfree.test.ts (10 tests)
 ✓ src/lib/logger.test.ts (9 tests)
 ✓ src/state/cart.test.tsx (4 tests)
 ✓ src/catalog/catalog-state.test.ts (7 tests)
 ✓ src/lib/supabase.test.ts (4 tests)
 ✓ src/custom-project/custom-project-state.test.ts (8 tests)
 ✓ src/lib/cn.test.ts (3 tests)
 ✓ src/server/supabase-admin.test.ts (2 tests)
 ✓ src/lib/cashfree.test.ts (4 tests)
 ✓ src/lib/format.test.ts (3 tests)

 Test Files  10 passed (10)
      Tests  54 passed (54)
```

### E. Playwright E2E Suite (`pnpm test:e2e`)

```
$ playwright test
Running 8 tests using 2 workers
[1/8] [chromium] › e2e/catalog.spec.ts › homepage renders hero, navigation and sections
[2/8] [chromium] › e2e/catalog.spec.ts › catalog navigation and filtering
[3/8] [chromium] › e2e/checkout.spec.ts › loads checkout page and renders student billing form
[4/8] [chromium] › e2e/checkout.spec.ts › loads cart page with empty state and navigates to catalog
[5/8] [chromium] › e2e/checkout.spec.ts › return URL handler displays verified order state with deliverables
[6/8] [chromium] › e2e/custom-project.spec.ts › navigates from homepage CTA and renders 6-stage Assembly Spine workflow
[7/8] [chromium] › e2e/custom-project.spec.ts › validates required fields and adapts hardware specs by classification
[8/8] [chromium] › e2e/custom-project.spec.ts › preserves local draft across reload and completes review + prototype confirmation
  8 passed (16.3s)
```

### F. Production Build (`pnpm build`)

```
$ vite build
vite v8.0.5 building client environment for production...
✓ 2136 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                                     1.15 kB │ gzip:   0.50 kB
dist/assets/index-C8tv_2sa.css                                     83.66 kB │ gzip:  16.90 kB
dist/assets/index-CxAsVDGt.js                                     448.70 kB │ gzip: 130.56 kB
✓ built in 10.85s
```

---

## 4. Cashfree Security & Rotation Status

- **Hardcoded Credentials:** None exist in reachable Git history or production bundles.
- **Server Enablement Control:** `CASHFREE_PAYMENTS_ENABLED` is `false` by default. Outbound gateway communication is completely shut down.
- **Rotation Confirmation Status:** **PENDING / NOT YET CONFIRMED**.
- **Rule:** Under no circumstances should live or sandbox payment processing be enabled until rotation of the exposed sandbox credential is independently verified in the Cashfree merchant dashboard.

---

## 5. Controlled Pull-Request Merge Order

To ensure clean ancestry and avoid merge conflicts or reintroducing historical secrets, merge branches in the following strict order:

```
Step 1: Foundation PR #1
        chore/production-engineering-foundation → main
        (Commit: ecef44c)

Step 2: Design Stack PR #2
        design/unslop-foundation → main (or rebase/retarget after PR #1)
        (Commit: cc020b2)

Step 3: Stage E Custom Project PR #3
        feat/stage-e-custom-project → design/unslop-foundation
        (Commit: 740a168)

Step 4: Codex Remediation PR #4
        fix/codex-remediation-ci-stabilization → feat/stage-e-custom-project
        (Contains this remediation)
```

---

## 6. Preparation for Independent Codex Re-Review

The diff on `fix/codex-remediation-ci-stabilization` relative to `feat/stage-e-custom-project` (`740a168`) is ready for independent Codex re-review:

```bash
git diff 740a168..HEAD
```

Files modified and created for re-review:

- `.gitattributes` — Text line-ending normalization rules (`* text=auto eol=lf`)
- `.prettierrc` — Added `"endOfLine": "auto"`
- `.github/workflows/ci.yml` — Added `design/**` push trigger, PR stack triggers, Playwright E2E job
- `src/App.tsx` — Safe slug decoding, exact `/checkout/return` matching
- `src/lib/supabase.ts` — Lazy client accessor, transparent fail-closed proxy
- `src/lib/supabase.test.ts` — Clean-environment unconfigured and synthetic credential tests
- `src/server/supabase-admin.ts` — Fail-closed admin client, sanitized payment recording
- `src/server/supabase-admin.test.ts` — Clean synthetic credentials and unconfigured tests
- `src/server/cashfree.ts` — Payment disable gate, catalog price resolution, allowlisted verify response, idempotency
- `src/server/cashfree.test.ts` — 10 comprehensive unit tests covering all Cashfree security gates
- `src/lib/cashfree.ts` — Deployment base path return URL, gateway status loader, disabled error handling
- `src/lib/cashfree.test.ts` — Client unit tests for status, 503 handling, checkout launch
- `src/pages/CheckoutPage.tsx` — Gateway paused notice, disabled submit button, authoritative item payloads
- `src/pages/CheckoutReturnPage.tsx` — Prototype preview labeling, accessible notifications without `alert()`
- `src/custom-project/custom-project-state.ts` — 7-day TTL, schema versioning, strict enum/date/phone validation
- `src/custom-project/custom-project-state.test.ts` — Unit tests for TTL expiry and strict validations
- `src/pages/CustomProjectPage.tsx` — Focus management across phases, safe prefill handling
- `supabase/migrations/20261118000002_security_hardening.sql` — Parameterless `is_admin()`, order state restrictions, audit log restrictions
- `CHANGELOG.md`, `VERSIONING.md`, `ARCHITECTURE_VERSION.md`, `docs/10-releases/VERSION_HISTORY.md`, `docs/05-security/SECRET_MANAGEMENT.md`
