# Threat Model — LevUp Projects

**Document Status:** Baseline  
**Framework:** STRIDE  
**Last Updated:** 2026-11-17

---

## 1. Threat Identification & Mitigation (STRIDE)

| STRIDE Threat              | Potential Vulnerability in LevUp                                          | Impact                                                          | Mitigation Strategy                                                                                                |
| -------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Spoofing**               | Forged Cashfree webhook notification                                      | Attacker marks unpaid orders as paid without transferring funds | Raw request HMAC-SHA256 signature verification with secret key; compare with constant-time equality.               |
| **Tampering**              | Price manipulation in client cart or request body                         | Attacker purchases a ₹4,999 project for ₹1                      | Authoritative server-side price recalculation from database; client prices ignored.                                |
| **Repudiation**            | Customer claims custom project was never delivered or milestones paid     | Financial / operational dispute                                 | Append-only immutable `payment_events`, delivery timestamps, and courier AWB records.                              |
| **Information Disclosure** | Student accesses another student's source code or private details         | Academic dishonesty, privacy violation                          | Supabase Row-Level Security on all tables; time-limited signed URLs (15 min) for file downloads.                   |
| **Denial of Service**      | Volumetric spamming of custom project inquiry or order creation endpoints | Serverless cost spikes, API degradation                         | Cloudflare / Vercel Edge rate limiting, IP-based request throttling, CAPTCHA on unauthenticated forms if required. |
| **Elevation of Privilege** | Normal student accesses `/admin-login` and performs admin operations      | Unauthorized catalog edits, fake refunds, unearned deliverables | Server-side role check querying `admin_users` table; MFA enforced for all admin sessions.                          |
