# Authentication Architecture — LevUp Projects

**Document Status:** Baseline  
**Identity Provider:** Supabase Auth  
**Last Updated:** 2026-11-17  

---

## 1. Authentication Mechanisms

### 1.1 Customer (Student) Authentication
- **Methods**: Email + Password or Email Magic Link / OTP.
- **Session Tokens**: JWT access tokens stored in `httpOnly`, `SameSite=Lax`, `Secure` cookies.
- **Token Expiration**: Access token expires in 1 hour; refresh token rotated every 7 days.

### 1.2 Administrative Authentication
- **Access Boundary**: Accessible via `/admin-login`.
- **Identity Enforcement**:
  1. Successful authentication with Supabase Auth credentials.
  2. Next.js middleware verifies that `user.id` is present in `public.admin_users` with `is_active = true`.
  3. Multi-Factor Authentication (TOTP via authenticator app) is strictly enforced.
  4. If user is authenticated but not in the allowlist: returns HTTP 403 Forbidden and logs security audit event.

---

## 2. Session Lifecycle & Invalidation

- **Logout**: Flushes local session tokens, clears server-side HTTP cookies, and revokes Supabase refresh token.
- **Password Reset**: Secure email link with single-use cryptographic token expiring in 15 minutes.
