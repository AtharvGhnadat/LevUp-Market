import type { Page, Route } from "@playwright/test";

export const fixtureEmail = "student@example.invalid";
export const fixturePassword = "Fixture password 2026";
export const fixtureName = "Sample Student";

const user = {
  id: "e8000000-0000-4000-8000-000000000001",
  aud: "authenticated",
  role: "authenticated",
  email: fixtureEmail,
  email_confirmed_at: "2026-11-19T00:00:00.000Z",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: { full_name: fixtureName, role: "admin" },
  created_at: "2026-11-19T00:00:00.000Z",
};

function session() {
  const expires = Math.floor(Date.now() / 1000) + 3600;
  const jwtHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const jwtPayload = Buffer.from(
    JSON.stringify({ sub: user.id, exp: expires, role: "authenticated" }),
  ).toString("base64url");
  return {
    access_token: `${jwtHeader}.${jwtPayload}.synthetic-signature`,
    refresh_token: "fixture-refresh-token",
    expires_in: 3600,
    expires_at: expires,
    token_type: "bearer",
    user,
  };
}

export async function seedSession(page: Page) {
  await page.addInitScript((saved) => {
    if (sessionStorage.getItem("levup-fixture-session-seeded")) return;
    sessionStorage.setItem("levup-fixture-session-seeded", "yes");
    localStorage.setItem("sb-localhost-auth-token", JSON.stringify(saved));
  }, session());
}

export async function mockAuth(
  page: Page,
  options: {
    delayUser?: Promise<void>;
    revokeUser?: boolean;
    failSignOut?: boolean;
    duplicate?: boolean;
  } = {},
) {
  const calls: Array<{
    method: string;
    endpoint: string;
    payload: Record<string, unknown> | null;
    redirectTo: string | null;
  }> = [];
  await page.route("**/__auth-fixture/auth/v1/**", async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const endpoint = url.pathname.replace(/^.*\/auth\/v1\//, "");
    const method = request.method();
    const payload = request.postData() ? (request.postDataJSON() as Record<string, unknown>) : null;
    calls.push({ method, endpoint, payload, redirectTo: url.searchParams.get("redirect_to") });
    const send = (json: unknown, status = 200) =>
      route.fulfill({ status, json, headers: { "x-supabase-api-version": "2024-01-01" } });

    if (endpoint === "user" && method === "GET") {
      await options.delayUser;
      if (options.revokeUser) return send({ code: "bad_jwt", msg: "Invalid token" }, 401);
      return send(user);
    }
    if (endpoint === "user" && method === "PUT") return send(user);
    if (endpoint === "token" && url.searchParams.get("grant_type") === "password") {
      if (payload?.email !== fixtureEmail || payload?.password !== fixturePassword) {
        return send({ code: "invalid_credentials", msg: "Provider detail hidden by the UI." }, 400);
      }
      return send(session());
    }
    if (endpoint === "token" && url.searchParams.get("grant_type") === "pkce") {
      if (
        !payload?.code_verifier ||
        !["verify-email-fixture", "recover-password-fixture"].includes(String(payload.auth_code))
      ) {
        return send({ code: "otp_expired", msg: "Invalid or expired" }, 400);
      }
      return send(session());
    }
    if (endpoint === "signup") {
      if (options.duplicate) return send({ code: "user_already_exists", msg: "User exists" }, 422);
      return send({ ...user, email_confirmed_at: null });
    }
    if (endpoint === "recover" || endpoint === "resend") return send({});
    if (endpoint === "logout") {
      if (options.failSignOut)
        return send({ code: "unexpected_failure", msg: "Logout failed" }, 400);
      return route.fulfill({ status: 204 });
    }
    return send({ code: "unexpected_fixture_request", msg: "Unexpected test endpoint" }, 400);
  });
  return calls;
}
