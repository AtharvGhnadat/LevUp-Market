# Google sign-in for LevUp Projects

Sign In and Create Account use the same Google button. The Firebase popup obtains a Google provider credential. Supabase verifies that credential and issues the session consumed by the customer workspace and its row-level security policies. The temporary Firebase session uses in-memory persistence and is cleared after the exchange.

## Configure a deployment

1. In the Firebase project `levup-market`, open Authentication → Sign-in method → Google. Enable the provider and select a project support email. In Authentication → Settings → Authorized domains, add each host that will serve the application.
2. Open the Firebase Google provider's Web SDK configuration and identify its **Web client ID**. In Supabase → Authentication → Sign In / Providers → Google, enable Google and configure the matching Google OAuth Web client ID. If the dashboard requires a client secret, enter the matching OAuth secret directly in that dashboard. For an existing Google configuration, preserve existing client IDs and add the Firebase web client ID to its accepted audiences.
3. Set `VITE_FIREBASE_API_KEY` to the Firebase web app's public API key in the frontend build environment. The Supabase URL and publishable key are also required. Rebuild after changing Vite environment variables.
4. From the deployed origin, open a protected route while signed out, continue with Google and choose a test account. Confirm the return to that route, reload the account page and sign out. Also test cancellation and the Create Account entry point. Existing email/password users should verify access to their original profile and orders.

[Firebase Google authentication](https://firebase.google.com/docs/auth/web/google-signin) · [Supabase Google provider](https://supabase.com/docs/guides/auth/social-sign-in/auth-google)
