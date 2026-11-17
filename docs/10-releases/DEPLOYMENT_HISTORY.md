# Deployment History — LevUp Projects

> [!NOTE]
> This file records **actual verified deployments only**. It is never pre-populated with hypothetical or planned entries.

---

## Format

```
## v<version> — <environment> — <YYYY-MM-DD HH:MM UTC>

| Field | Value |
|---|---|
| Version | v0.x.x |
| Commit SHA | <full 40-char SHA> |
| Environment | production / staging / preview |
| Deployment ID | <Vercel deployment ID or equivalent> |
| Deployed by | <name or CI> |
| Migration status | N/A / applied / pending |
| Rollback reference | <previous deployment ID or git SHA> |
| Verification | <what was checked and by whom> |
```

---

## History

_No deployments have occurred. This file will be populated on first deployment._

---

## Pre-deployment Checklist

Before recording a deployment:

- [ ] CI passed (lint, typecheck, test, build)
- [ ] All environment variables confirmed in target environment
- [ ] Database migrations applied and verified
- [ ] Rollback procedure confirmed
- [ ] Post-deployment smoke test completed
- [ ] Monitoring alerts active
