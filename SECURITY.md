# Security Policy — LevUp Projects

## Supported Versions

| Version                   | Supported             |
| ------------------------- | --------------------- |
| Unreleased pre-production | ✅ Active development |

---

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

Report security concerns privately to:

**Email:** atharvgh07@gmail.com  
**Subject line:** `[SECURITY] LevUp Projects — <brief description>`

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested remediation (if known)

You will receive an acknowledgement within **48 hours**.

---

## Security Principles

- Cashfree Client Secret and payment credentials are **never** exposed in frontend code.
- All payment verification is performed **server-side only**.
- User data is isolated with Supabase Row-Level Security policies.
- Admin access requires verified server-side identity, not hidden frontend routes.
- Secrets are managed via environment variables and are never committed to Git.

---

## Responsible Disclosure

We ask that you:

- Give us reasonable time to investigate and patch before public disclosure.
- Avoid accessing or modifying other users' data.
- Not perform denial-of-service attacks.

We commit to:

- Acknowledging your report promptly.
- Keeping you informed of progress.
- Crediting you in security advisories (if desired).
