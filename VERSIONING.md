# Versioning Policy — LevUp Projects

## Semantic Versioning

This project uses [Semantic Versioning 2.0.0](https://semver.org/): `MAJOR.MINOR.PATCH`

| Segment | Increment when                                                    |
| ------- | ----------------------------------------------------------------- |
| `MAJOR` | Incompatible API or database schema changes requiring user action |
| `MINOR` | New features added in a backward-compatible manner                |
| `PATCH` | Backward-compatible bug fixes                                     |

## Pre-release Versions

| Range    | Meaning                                                                            |
| -------- | ---------------------------------------------------------------------------------- |
| `v0.x.x` | Pre-production. No stability guarantees. Breaking changes possible in any release. |
| `v1.0.0` | First verified production release. Stability commitments begin.                    |

## Planned Release Milestones

| Version  | Milestone                                                                               | Status                                                            |
| -------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `v0.1.0` | Engineering foundation complete: CI, linting, testing, logging infrastructure on `main` | Merge candidate (PR #1 open against `main`)                       |
| `v0.2.0` | Storefront design, Stage E custom requisition, Supabase schema, Cashfree sandbox (Vite) | Conditional on PR #1, PR #2, PR #3 merges & rotation confirmation |
| `v0.3.0` | Next.js App Router migration complete with full visual parity and SSR                   | Planned roadmap phase                                             |
| `v0.4.0` | Live Cashfree payments & transactional order fulfillment (merchant rotation verified)   | Blocked on confirmed credential rotation                          |
| `v0.5.0` | Customer dashboard complete                                                             | Planned roadmap phase                                             |
| `v0.6.0` | Admin portal complete                                                                   | Planned roadmap phase                                             |
| `v1.0.0` | First production release: all PRD features, security review, load tested                | Planned production milestone                                      |

> [!CAUTION]
> Do not tag a version unless it has been tested and verified. Never fabricate version history.
> SemVer tags are applied only to verified commits on `main` after PR merge, CI pass, and credential clearance. Historical SemVer tags remain deferred pending PR merge progression (`Foundation PR #1` → `Design` → `Stage E` → `Remediation`) and confirmed Cashfree credential rotation. See [docs/10-releases/VERSION_HISTORY.md](docs/10-releases/VERSION_HISTORY.md) for post-cleanup milestone mapping.

## Git Tagging

Tags are applied to commits on `main` only, after a successful CI run and manual verification:

```bash
git tag -a v0.1.0 -m "chore: engineering foundation complete"
git push origin v0.1.0
```

## CHANGELOG Relationship

Every tagged version must have a corresponding entry in [CHANGELOG.md](CHANGELOG.md) that lists all additions, changes, fixes, deprecations, removals, and security notes since the previous version.
