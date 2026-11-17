# Change Control & Architecture Decision Procedure — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. When is an ADR Required?

An Architecture Decision Record (ADR) must be created in `docs/01-architecture/adr/` before implementing changes that:
- Introduce or replace a core library, framework, or third-party service (e.g. Drizzle ORM, Sentry).
- Alter database schema relationships or migration policies.
- Alter payment gateway workflows or reconciliation contracts.
- Modify security boundaries or authentication models.

---

## 2. Change Control Workflow

1. Developer authors proposed ADR using standard format (Context, Decision, Alternatives, Consequences).
2. Peer / Lead review and approval.
3. Status updated from `Proposed` to `Accepted`.
4. Implementation proceeds referencing the ADR number.
