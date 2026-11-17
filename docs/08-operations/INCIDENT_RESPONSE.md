# Incident Response Plan — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Incident Severity Levels

- **SEV-1 (Critical Outage / Security Breach)**: Site unavailable, active data leak, payment webhook failure impacting all checkouts.
- **SEV-2 (Degraded Core Flow)**: Search malfunctioning, custom project form failing, delayed deliverable downloads.
- **SEV-3 (Minor / Cosmetic)**: UI glitch, non-breaking copy error, isolated filter issue.

---

## 2. Response Workflow

1. **Detection & Triage**: On-call engineer alerted by monitoring. Confirm scope and declare severity.
2. **Containment**: If security vulnerability, revoke credentials or activate Vercel maintenance mode.
3. **Remediation**: Deploy hotfix via `hotfix/*` branch or rollback to previous deployment SHA.
4. **Post-Mortem**: Document root cause, timeline, impact, and preventive action items within 48 hours.
