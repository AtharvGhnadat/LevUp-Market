# Version History & Post-Remediation Milestone Mapping — LevUp Projects

**Document Status:** Pre-release (No Git SemVer tags created yet)  
**Last Updated:** 2026-11-18

> [!IMPORTANT]
> No SemVer Git tags have been created or pushed yet. All entries below reflect verified local/remote commit milestones and **proposed** post-cleanup tag candidates for review only.

---

## 1. Verified Commit History (Post-Remediation)

| Branch                                    | Commit SHA | Milestone Description                                                                                                                         | Remote Status                                                    |
| :---------------------------------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `main`                                    | `90020e2`  | Initial empty repository scaffold                                                                                                             | Pushed (`origin/main`)                                           |
| `main`                                    | `78b2142`  | Baseline Figma Make React/Vite frontend import                                                                                                | Pushed (`origin/main`)                                           |
| `chore/production-engineering-foundation` | `ecef44c`  | Engineering governance pack, structured logging, Vitest, ESLint/Prettier, Playwright E2E                                                      | Pushed (`origin/chore/production-engineering-foundation`, PR #1) |
| `design/unslop-foundation`                | `544f62e`  | Unslop visual audit (`UNSLOP_AUDIT.md`) and design direction (`DESIGN_DIRECTION.md`)                                                          | Pushed (`origin/design/unslop-foundation`)                       |
| `design/unslop-foundation`                | `304aa46`  | Stage 1 global Alloy & Volt design tokens, typography, navigation, WCAG contrast                                                              | Local (pending normal push)                                      |
| `design/unslop-foundation`                | `778f6ed`  | Stage 2 initial homepage Unslop refactoring                                                                                                   | Local (pending normal push)                                      |
| `design/unslop-foundation`                | `d48a990`  | Cashfree PG SDK checkout flow & return handler (remediated replacement for `2895c12`; fail-closed env validation, zero hardcoded credentials) | Local (pending normal push)                                      |
| `design/unslop-foundation`                | `e440f50`  | Supabase agent-skills and Postgres best practices installed (replayed from `8019c11`)                                                         | Local (pending normal push)                                      |
| `design/unslop-foundation`                | `4f73589`  | Supabase client, admin service, and initial RLS schema migration (replayed from `c7594ba`)                                                    | Local (pending normal push)                                      |
| `design/unslop-foundation`                | `e801d01`  | Stage 2 homepage alignment with approved visual reference (replayed from `cc37556`)                                                           | Local (pending normal push)                                      |
| `design/unslop-foundation`                | `cc020b2`  | Stage 3 brand-led Unslop transformation across storefront (replayed from `5670423`)                                                           | Local (pending normal push)                                      |
| `feat/stage-e-custom-project`             | `7ddb92a`  | Stage E `/custom-project` engineering requisition prototype with 6-stage Assembly Spine (replayed from `ad7a4ad`)                             | Local (pending normal push)                                      |

---

## 2. Local History Remediation Mapping (2026-11-18)

| Original Unpublished SHA | Replacement Cleaned SHA | Commit Subject                                                                          | Tree Diff vs. Original                                                                                                                 |
| :----------------------- | :---------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| `2895c12`                | `d48a990`               | `feat(payments): implement cashfree pg sdk checkout order flow and return handler`      | Removed hardcoded Cashfree fallbacks in `src/server/cashfree.ts`; added fail-closed & synthetic tests in `src/server/cashfree.test.ts` |
| `8019c11`                | `e440f50`               | `chore(skills): install supabase agent-skills and postgres best practices`              | Identical patch                                                                                                                        |
| `c7594ba`                | `4f73589`               | `feat(supabase): configure client, admin service, and initial schema migration`         | Identical patch                                                                                                                        |
| `cc37556`                | `e801d01`               | `feat(design): align stage 2 homepage with approved visual reference and design tokens` | Identical patch                                                                                                                        |
| `5670423`                | `cc020b2`               | `feat(design): complete stage 3 brand-led unslop transformation across storefront`      | Only `src/server/cashfree.ts` & `src/server/cashfree.test.ts` differ                                                                   |
| `ad7a4ad`                | `7ddb92a`               | `feat(custom-project): implement stage E engineering requisition workflow`              | Only `src/server/cashfree.ts` & `src/server/cashfree.test.ts` differ                                                                   |

---

## 3. Proposed SemVer Tag Mapping (For Review — Do Not Tag Until Merged to `main`)

Per [VERSIONING.md](../../VERSIONING.md), tags are applied only on `main` after PR merge, CI pass, and security clearance:

| Proposed Tag                     | Target Milestone (After Merge to `main`)                                                                                    | Prerequisites Before Tagging                                                                                                      |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| `v0.1.0`                         | Engineering governance foundation (`ecef44c`)                                                                               | Merge PR #1 to `main` and pass CI                                                                                                 |
| `v0.2.0-rc.1` _(or `v0.2.0`)_    | Storefront Unslop design system Stages 1–3 + Supabase schema + Cashfree sandbox integration (`cc020b2` + governance commit) | Merge `design/unslop-foundation`, confirm Cashfree sandbox credential rotation, verify sandbox payment flow with rotated env vars |
| `v0.2.1` _(or `v0.3.0-alpha.1`)_ | Stage E Custom Project Requisition prototype (`7ddb92a`)                                                                    | Merge `feat/stage-e-custom-project` (or defer minor bump until backend intake API + storage are wired)                            |
