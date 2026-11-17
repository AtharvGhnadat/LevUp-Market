# Backup & Disaster Recovery Standard — LevUp Projects

**Document Status:** Baseline  
**Target RPO:** 1 Hour | **Target RTO:** 4 Hours  
**Last Updated:** 2026-11-17  

---

## 1. Backup Strategy

- **Database (Supabase PostgreSQL)**: Daily automated physical backups with Point-In-Time-Recovery (PITR) enabled on production instances (retention: 7 days minimum).
- **Deliverables (Supabase Storage)**: Cross-region replication enabled on S3 storage buckets storing deliverable ZIP archives.
- **Source Code**: Replicated across GitHub and local developer clones.

---

## 2. Disaster Recovery Scenarios

- **Database Corruption / Data Loss**: Restore to nearest 5-minute PITR snapshot via Supabase dashboard; verify financial records against Cashfree gateway.
- **Vercel Outage**: Repoint Cloudflare DNS to alternative edge provider or backup Netlify / AWS Amplify deployment.
