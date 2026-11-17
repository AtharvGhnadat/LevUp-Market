# Production Release Checklist — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Pre-Release Verification

- [ ] All code merged into `main` via reviewed pull requests.
- [ ] TypeScript compile passes (`pnpm typecheck`) with zero warnings or errors.
- [ ] Production build succeeds (`pnpm build`).
- [ ] Unit and integration test suite passes (`pnpm test`).
- [ ] Code coverage thresholds verified.
- [ ] No hardcoded secrets, API tokens, or test credentials present in code.
- [ ] Cashfree production webhook configured and signature verified.
- [ ] Supabase PostgreSQL migrations applied cleanly.
- [ ] Row-Level Security verified across all active tables.
- [ ] Legal policies (Refunds, Shipping, Privacy, Terms) verified and displayed honestly.

---

## 2. Post-Release Verification

- [ ] Homepage, catalog, and project detail load properly on production domain.
- [ ] Test purchase completed in staging/sandbox.
- [ ] Sentry / error monitoring active and receiving heartbeats.
- [ ] Release tag created (`vX.Y.Z`) and deployment logged in `docs/10-releases/DEPLOYMENT_HISTORY.md`.
