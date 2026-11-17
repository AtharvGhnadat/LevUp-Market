# Changelog

All notable changes to LevUp Projects are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

> [!NOTE]
> This project is in pre-release. No version has been tagged. Entries in **[Unreleased]** accumulate until a tagged release is verified.

---

## [Unreleased]

### Added

- Engineering governance foundation branch `chore/production-engineering-foundation`
- Complete `docs/` system covering all 11 governance dimensions:
  - `docs/00-product/`: PRD record (marking original as missing from repo), SCOPE, FEATURE_INVENTORY, REQUIREMENTS_TRACEABILITY, USER_JOURNEYS, ACCEPTANCE_CRITERIA
  - `docs/01-architecture/`: EXISTING_SYSTEM_ASSESSMENT, ARCHITECTURE, TECH_STACK, SYSTEM_CONTEXT, FRONTEND_ARCHITECTURE, BACKEND_ARCHITECTURE, INTEGRATIONS, SCALABILITY, DEPLOYMENT_ARCHITECTURE, ADR-0001
  - `docs/02-design-system/`: BRAND_GUIDELINES, COLOR_TOKENS, TYPOGRAPHY, COMPONENTS, RESPONSIVE_LAYOUTS, ACCESSIBILITY, DESIGN_CHANGELOG
  - `docs/03-database/`: SCHEMA (PostgreSQL DDL), DATA_DICTIONARY, RELATIONSHIPS, MIGRATION_POLICY, RLS_AND_PERMISSIONS
  - `docs/04-api/`: openapi.yaml, API_CONVENTIONS, ERROR_HANDLING, WEBHOOK_CONTRACTS
  - `docs/05-security/`: THREAT_MODEL (STRIDE), AUTHENTICATION, AUTHORIZATION, SECRET_MANAGEMENT, SECURITY_TESTING
  - `docs/06-payments/`: CASHFREE_INTEGRATION, PAYMENT_LIFECYCLE, PAYMENT_SCHEDULES, REFUND_POLICY_IMPLEMENTATION, RECONCILIATION
  - `docs/07-testing/`: TEST_STRATEGY, TEST_CASES, E2E_TEST_CASES, COVERAGE_POLICY
  - `docs/08-operations/`: LOGGING_STANDARD, AUDIT_POLICY, OBSERVABILITY, BACKUP_RECOVERY, INCIDENT_RESPONSE, DEPLOYMENT_RUNBOOK, LOG_RETENTION
  - `docs/09-development/`: DEVELOPER_SETUP, CODING_STANDARDS, BRANCHING, CHANGE_CONTROL, LOCAL_ENVIRONMENT
  - `docs/10-releases/`: RELEASE_CHECKLIST, RELEASE_NOTES_TEMPLATE, ROLLBACK_PROCESS, DEPLOYMENT_HISTORY
- Structured application logger `src/lib/logger.ts` implementing UTC partitioning, schema standardization, and recursive key redaction
- Testing framework: Vitest 5, React Testing Library 16, jsdom, and `@testing-library/jest-dom`
- 20 unit tests across 5 test suites (`format`, `cn`, `logger`, `catalog-state`, `cart`)
- CI configuration in `.github/workflows/ci.yml` running typecheck, unit tests, and production build
- Pull request review template `.github/pull_request_template.md`
- Root governance: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `VERSIONING.md`, `ARCHITECTURE_VERSION.md`, `.env.example`, `.gitignore`

### Changed

- `package.json`: Renamed to `levup-market`, added `test`, `test:watch`, `test:coverage`, `typecheck`, and `format:check` scripts

---

## Pre-history

| Date | Commit | Description |
|---|---|---|
| 2026-11-17 | `78b2142` | Add files from Figma Make — full Figma-generated frontend |
| 2026-11-17 | `90020e2` | Initial commit — empty repository scaffold |
