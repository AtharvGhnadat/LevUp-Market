# Customer authentication architecture

19 November 2026 (IST) · Vite SPA · Supabase Auth

## Active customer flow

| Route              | Behavior                                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/login`           | Password sign-in through Supabase and return to an allowed internal destination.                                                                                                 |
| `/signup`          | Registration with name, email and password. The inbox state handles accepted and duplicate requests with neutral copy.                                                           |
| `/register`        | Compatibility redirect to `/signup`.                                                                                                                                             |
| `/auth/callback`   | Exchanges the email confirmation code through the Supabase SDK, verifies the user and strips callback parameters.                                                                |
| `/forgot-password` | Requests a Supabase recovery email with a neutral confirmation.                                                                                                                  |
| `/reset-password`  | Accepts a valid PKCE recovery exchange and its `PASSWORD_RECOVERY` event. Updates credentials through Supabase, then signs out the recovery session before returning to Sign In. |
| `/account`         | Requires a verified, non-anonymous customer identity. Shows the provider's name, email and verification state and offers password recovery and local sign-out.                   |

One app provider subscribes to SDK session events. Its startup status reserves the account area until the session is established. The provider calls the authenticated Supabase user endpoint before exposing customer identity. The SDK owns browser session persistence and refresh. Local sign-out removes the browser session and requests provider revocation. If revocation fails after the SDK clears the browser session, the UI reports the distinction.

The application validates its return destination against available customer routes. Signup may store that validated relative path for up to one hour to carry it across the confirmation tab. The browser cart is stored independently. Recovery only opens password controls after verifying the expected callback flow and authenticated identity. It never treats a normal signed-in session alone as a verified password reset link.

## Authorization and exposure

The browser works with a publishable or legacy `anon` Supabase key. The Vite configuration rejects other key formats in the expected public key variables. Private Supabase and payment credentials belong in server-only settings.

An account route guard controls UI access. The provider's verified identity and database policies establish the applicable data boundary. Account settings reads identity from Supabase Auth and does not query user tables. Public signup sends `full_name` as display metadata only. It does not create admin assignments or consume metadata as an authorization signal. The existing SQL uses a separate `admin_users` allowlist and RLS for protected data. The Next.js cookie-based server session and administrative MFA flow remain planned architecture.

## Environment and deploy setup

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the browser build. `VITE_SUPABASE_ANON_KEY` is the compatibility option. Loopback HTTP is permitted for isolated local development. Hosted Auth endpoints use HTTPS.
2. Verify that Email is enabled, public signup is allowed and confirmation is required in Supabase Auth. The public settings endpoint returned HTTP 200 and confirmed those three settings for the workspace-configured project on 19 November. This read-only check did not exercise mail delivery.
3. Set Supabase Site URL to the actual HTTPS deployment and allow the exact `/auth/callback` and `/reset-password` paths for each deployed origin. Allow `http://localhost:8443/auth/callback` and `http://localhost:8443/reset-password` on the development project if that is the current local URL. Include the application base path for subdirectory deployments. Ensure both callback URLs serve the SPA shell on direct requests. [Supabase redirect URL guidance](https://supabase.com/docs/guides/auth/redirect-urls)
4. Verify the sender and SMTP configuration, published confirmation and recovery templates and same-browser delivery in a staging inbox. PKCE codes require the browser where the request started. A newly requested link can supersede the earlier verifier. Hosted allowlists, SMTP, deployment rewrites and a real inbox round trip were outside the checked public settings. [Supabase PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow)
5. Match the provider's configured password policy to the product requirement, check provider rate limits and use an isolated account to verify signup, confirmation, reset, sign-out and revocation before release. Validate hosted roles and RLS with dedicated accounts before adding any customer data routes. [Supabase password security](https://supabase.com/docs/guides/auth/password-security)

The Vite app currently serves placeholder Terms and Privacy pages. Publish the approved policy pages if signup requires explicit agreement. This feature introduces no new admin, checkout or payment capability.
