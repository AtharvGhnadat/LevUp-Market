# Versioning Policy — LevUp Projects

## Semantic Versioning

This project uses [Semantic Versioning 2.0.0](https://semver.org/): `MAJOR.MINOR.PATCH`

| Segment | Increment when |
|---|---|
| `MAJOR` | Incompatible API or database schema changes requiring user action |
| `MINOR` | New features added in a backward-compatible manner |
| `PATCH` | Backward-compatible bug fixes |

## Pre-release Versions

| Range | Meaning |
|---|---|
| `v0.x.x` | Pre-production. No stability guarantees. Breaking changes possible in any release. |
| `v1.0.0` | First verified production release. Stability commitments begin. |

## Planned Release Milestones

| Version | Milestone |
|---|---|
| `v0.1.0` | Engineering foundation complete: CI, linting, testing, logging infrastructure |
| `v0.2.0` | Next.js migration complete with visual parity confirmed |
| `v0.3.0` | Supabase integration: auth, database, storage |
| `v0.4.0` | Cashfree payment integration (sandbox verified) |
| `v0.5.0` | Customer dashboard complete |
| `v0.6.0` | Admin portal complete |
| `v1.0.0` | First production release: all PRD features, security review, load tested |

> [!CAUTION]
> Do not tag a version unless it has been tested and verified. Never fabricate version history.

## Git Tagging

Tags are applied to commits on `main` only, after a successful CI run and manual verification:

```bash
git tag -a v0.1.0 -m "chore: engineering foundation complete"
git push origin v0.1.0
```

## CHANGELOG Relationship

Every tagged version must have a corresponding entry in [CHANGELOG.md](CHANGELOG.md) that lists all additions, changes, fixes, deprecations, removals, and security notes since the previous version.
