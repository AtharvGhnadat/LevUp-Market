import { useEffect } from "react";
import { useAuth } from "@/auth/auth-context";
import { authEntry } from "@/auth/auth-navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthNotice } from "@/components/auth/AuthFields";
import { Button, ButtonLink } from "@/components/ui/Button";
import { to } from "@/lib/routes";

export function AccountPage() {
  const { state, signOut, signOutPending, signOutError } = useAuth();
  const authStatus = state.status;
  const expired = state.status === "signed-out" && state.expired;

  useEffect(() => {
    if (authStatus !== "signed-out" && authStatus !== "recovering") return;
    if (signOutPending || signOutError) return;
    const params = new URLSearchParams({ next: "/account" });
    if (expired) params.set("reason", "expired");
    window.location.replace(to(`/login?${params}`));
  }, [authStatus, expired, signOutError, signOutPending]);

  const name =
    state.status === "signed-in" && typeof state.user.user_metadata.full_name === "string"
      ? state.user.user_metadata.full_name.trim()
      : "";
  return (
    <AuthLayout
      title="Account settings"
      description="Review the details used to sign in to LevUp."
      guide={{
        title: "Password and access",
        description:
          "Use a password reset link if you want to change your password. It will be sent to your account email.",
      }}
    >
      {state.status === "loading" && <AuthNotice>Checking your session…</AuthNotice>}
      {state.status === "unavailable" && (
        <>
          <AuthNotice error>We couldn’t verify your session. Try signing in again.</AuthNotice>
          <ButtonLink href={authEntry("/login", "/account")} variant="ink" className="mt-5">
            Sign In
          </ButtonLink>
        </>
      )}
      {(state.status === "signed-out" || state.status === "recovering") &&
        (signOutError ? (
          <>
            <AuthNotice error>{signOutError}</AuthNotice>
            <ButtonLink href={to("/login")} variant="ink" className="mt-5">
              Sign In
            </ButtonLink>
          </>
        ) : (
          <AuthNotice>{signOutPending ? "Signing out…" : "Taking you to Sign In…"}</AuthNotice>
        ))}
      {state.status === "signed-in" && (
        <>
          <dl className="divide-y divide-line rounded-md border border-line bg-white px-4">
            <div className="grid gap-1 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-sm font-medium text-muted">Name</dt>
              <dd className="text-sm wrap-anywhere">{name || "Name not provided"}</dd>
            </div>
            <div className="grid gap-1 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="text-sm font-medium text-muted">Email address</dt>
              <dd className="space-y-1 text-sm wrap-anywhere">
                <span className="block">{state.user.email}</span>
                <span className="text-xs font-medium text-success">Email verified</span>
              </dd>
            </div>
          </dl>
          {signOutError && (
            <div className="mt-4">
              <AuthNotice error>{signOutError}</AuthNotice>
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ButtonLink href={to("/forgot-password")} variant="ink">
              Reset password
            </ButtonLink>
            <Button variant="outline" disabled={signOutPending} onClick={() => void signOut()}>
              {signOutPending ? "Signing out…" : "Sign Out"}
            </Button>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
