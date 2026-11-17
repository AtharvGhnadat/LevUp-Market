# Observability & Monitoring Standard — LevUp Projects

**Document Status:** Baseline  
**Tooling Target:** Sentry + Vercel Analytics + Uptime Robot  
**Last Updated:** 2026-11-17

---

## 1. Metrics & Health Checks

- **Endpoint Health**: `GET /api/health` probes Supabase connectivity and response time.
- **Core Web Vitals**: Real-User Monitoring (RUM) tracks LCP (< 2.5s), FID/INP (< 200ms), and CLS (< 0.1).
- **Error Tracking**: Sentry captures uncaught client-side React errors and serverless function exceptions, grouped by release commit SHA.

---

## 2. Alert Escalation Thresholds

| Severity          | Condition                                      | Notification Channel          | Response SLA      |
| ----------------- | ---------------------------------------------- | ----------------------------- | ----------------- |
| **P1 — Critical** | Webhook error rate > 5% OR Site down (> 1 min) | SMS / Telegram / On-call call | < 15 minutes      |
| **P2 — Major**    | Checkout creation failure > 2%                 | Discord / Email alert         | < 1 hour          |
| **P3 — Moderate** | Catalog page TTFB > 2.0s                       | Jira / GitHub issue           | Next business day |
