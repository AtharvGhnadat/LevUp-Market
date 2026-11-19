# Customer authentication audit and verification

19 November 2026 (IST) · Branch `feat/customer-auth-experience` · Base `335a451`

## Existing experience

The live Chromium audit found no account actions in the desktop header or compact drawer. `/login` and `/register` rendered roadmap pages with a construction icon and no input controls. `/signup`, recovery, account and dashboard routes were missing. The existing storefront header fit at all eight requested widths. The app already had a lazy Supabase client and a browser-local cart. It had no shared session provider or protected customer route.

[Desktop baseline](../02-design-system/screenshots/authentication/before-login-desktop.png) · [Mobile baseline](../02-design-system/screenshots/authentication/before-login-mobile.png)

## Approved direction

- **Product** — LevUp customers sign in, register or recover access so they can return to their engineering-project journey.
- **Character** — Precise, reassuring, practical.
- **World** — An engineering service desk, using Mineral for the main surface, Alloy for structure and Volt for purposeful emphasis.
- **Moments** — The form leads. Confirmation and recovery states prioritize the next action.
- **Signature** — A short Volt edge rule sets off confirmation and recovery notices.

## Implementation

| Area              | Result                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account entry     | `/login` and `/signup` handle actual Supabase email and password operations. `/register` preserves old links. Signup asks for name, email and password.                                                                               |
| Email links       | `/auth/callback`, `/forgot-password` and `/reset-password` use the Supabase SDK and a confirmed PKCE code exchange. Unknown or duplicate email requests get neutral responses.                                                        |
| Account settings  | The verified user endpoint supplies name, email and verified status at `/account`. Password recovery and device sign-out are available.                                                                                               |
| Navigation        | Desktop shows Sign In and Create Account after session restore, or one Account disclosure after verified sign-in. The compact drawer contains the corresponding actions. The account controls use the existing drawer focus behavior. |
| Cart and checkout | Sign-in returns to an allowed internal destination and preserves local cart selections. Checkout uses the existing gate and guest preview.                                                                                            |
| Security          | The client build validates the expected public key formats. Customer metadata is display-only. Release still requires hosted redirect, mail and RLS verification. [Authentication architecture](../05-security/AUTHENTICATION.md)     |

## Browser evidence

Chromium captured the full pages using the actual application and a local Supabase HTTP fixture. All visible account details are synthetic.

| State                 | Desktop                                                                                                                                                                                         | Mobile                                                                                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sign in               | [Screenshot](../02-design-system/screenshots/authentication/login-desktop.png)                                                                                                                  | [Screenshot](../02-design-system/screenshots/authentication/login-mobile.png)                                                                                                                     |
| Create account        | [Screenshot](../02-design-system/screenshots/authentication/signup-desktop.png)                                                                                                                 | [Screenshot](../02-design-system/screenshots/authentication/signup-mobile.png)                                                                                                                    |
| Forgot password       | [Screenshot](../02-design-system/screenshots/authentication/forgot-password-desktop.png)                                                                                                        | [Screenshot](../02-design-system/screenshots/authentication/forgot-password-mobile.png)                                                                                                           |
| Account settings      | [Screenshot](../02-design-system/screenshots/authentication/account-desktop.png)                                                                                                                | [Screenshot](../02-design-system/screenshots/authentication/account-mobile.png)                                                                                                                   |
| Account navigation    | [Account disclosure](../02-design-system/screenshots/authentication/account-dropdown-desktop.png)                                                                                               | [Signed-out drawer](../02-design-system/screenshots/authentication/drawer-signed-out-mobile.png) · [Signed-in drawer](../02-design-system/screenshots/authentication/drawer-signed-in-mobile.png) |
| Validation and errors | [Required fields](../02-design-system/screenshots/authentication/login-validation-desktop.png) · [Authentication error](../02-design-system/screenshots/authentication/login-error-desktop.png) | [Short viewport](../02-design-system/screenshots/authentication/signup-short-viewport.png)                                                                                                        |
| Email verification    | [Check your inbox](../02-design-system/screenshots/authentication/confirmation-desktop.png)                                                                                                     |                                                                                                                                                                                                   |
| Browser zoom          | [200% Chromium zoom](../02-design-system/screenshots/authentication/login-zoom-200.png)                                                                                                         |                                                                                                                                                                                                   |

## Verification scope

The auth browser tests use the actual installed Supabase JS SDK against a local HTTP double. They cover login validation, password visibility, neutral duplicate response, signup resend, PKCE code exchange, recovery, expired links, initial load, authorized account visibility, a revoked session, mobile sign-out failure, route redirection and cart package/add-on restoration. The fixture supplies user-editable role metadata to a normal customer and asserts that no admin link appears. Hosted RLS still requires a staging test with separate users. The configured provider's public settings were checked independently over HTTPS. Live customer sign-in, email delivery and dashboard redirect settings were not exercised.

- Chromium reflow checks passed from 320px through 1440px. Native 200% zoom reduced the viewport from 1414px to 707px without overflow. The 320 × 420px viewport kept the signup action reachable by scrolling. This verifies the shortened viewport behavior. A physical mobile keyboard was outside the browser setup.
- The captured forms use IBM Plex Sans and Manrope. The field border has a measured 3.41:1 contrast against Mineral, the main Alloy text has 11.24:1, and the Volt focus and link token has 5.06:1.
- Build configuration rejected a synthetic private key in a browser credential variable. The 25 generated JavaScript files had no matches for the checked private credential names or synthetic test session markers.

| Gate                | Local result                                              |
| ------------------- | --------------------------------------------------------- |
| `pnpm format:check` | Passed                                                    |
| `pnpm lint`         | Passed with four existing warnings outside authentication |
| `pnpm typecheck`    | Passed                                                    |
| `pnpm test`         | 67 unit tests                                             |
| `pnpm test:e2e`     | 26 Chromium tests                                         |
| `pnpm build`        | Passed                                                    |

Method adapted from [Unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
