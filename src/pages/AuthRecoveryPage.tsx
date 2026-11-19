import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, AuthNotice } from "@/components/auth/AuthFields";
import { Button, ButtonLink } from "@/components/ui/Button";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { to } from "@/lib/routes";
import {
  authCallbackUrl,
  consumeAuthDestination,
  setRecoveryAccount,
} from "@/auth/auth-navigation";
import {
  authErrorMessage,
  confirmationError,
  emailError,
  newPasswordError,
  passwordHint,
} from "@/auth/auth-validation";
import { useAuthForm } from "@/auth/use-auth-form";
import { useAuthLink } from "@/auth/use-auth-link";

const inboxGuide = {
  title: "Open the link here",
  description:
    "Use the same browser that requested the email. If the link has expired, request a new one.",
};

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const configured = isSupabaseConfigured();
  const { errors, pending, onSubmit } = useAuthForm(
    ({ email }) => ({ email: emailError(email ?? "") }),
    async ({ email }) => {
      setError("");
      try {
        const { error: failure } = await getSupabaseClient().auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: authCallbackUrl("/reset-password") },
        );
        if (failure && (failure.status ?? 0) >= 500) {
          setError(
            authErrorMessage(failure, "We couldn't request a reset link. Please try again."),
          );
          return;
        }
        setSubmitted(true);
      } catch {
        setError("We couldn't reach account services. Please try again.");
      }
    },
  );

  return (
    <AuthLayout
      title={submitted ? "Check your inbox" : "Reset your password"}
      description={
        submitted
          ? "Look for a message from LevUp."
          : "Enter your account email to request a password reset link."
      }
      guide={inboxGuide}
    >
      {submitted ? (
        <>
          <AuthNotice>
            If an account uses this address, we’ll send a password reset link.
          </AuthNotice>
          <ButtonLink href={to("/login")} variant="ink" className="mt-5">
            Back to Sign In
          </ButtonLink>
        </>
      ) : (
        <form
          onSubmit={(event) => void onSubmit(event)}
          noValidate
          aria-busy={pending}
          className="space-y-4"
        >
          {!configured && (
            <AuthNotice error>Account services aren’t available in this environment.</AuthNotice>
          )}
          {error && <AuthNotice error>{error}</AuthNotice>}
          <AuthField
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            error={errors.email}
          />
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              variant="ink"
              className="min-h-12 font-sans"
              disabled={pending || !configured}
            >
              {pending ? "Sending…" : "Send reset link"}
            </Button>
            <a
              href={to("/login")}
              className="inline-flex min-h-11 items-center text-sm font-medium text-volt-text underline underline-offset-3"
            >
              Back to Sign In
            </a>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const link = useAuthLink("recovery");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [error, setError] = useState("");
  const [returnPending, setReturnPending] = useState(false);

  async function returnToLogin() {
    setError("");
    setReturnPending(true);
    try {
      const { error: failure } = await getSupabaseClient().auth.signOut({ scope: "local" });
      if (failure) throw failure;
      setRecoveryAccount(null);
      window.location.replace(to("/login?reason=reset"));
    } catch {
      setError("Your password was updated. We couldn't close the recovery session. Try again.");
    } finally {
      setReturnPending(false);
    }
  }

  const { errors, pending, onSubmit } = useAuthForm(
    ({ password, confirmation }) => ({
      password: newPasswordError(password ?? ""),
      confirmation: confirmationError(password, confirmation),
    }),
    async ({ password }) => {
      setError("");
      if (link.status !== "ready") return;
      try {
        const auth = getSupabaseClient().auth;
        const verified = await auth.getUser();
        if (verified.error || verified.data.user?.id !== link.userId) {
          setError("This recovery session is no longer valid. Request a new link.");
          return;
        }
        const { error: failure } = await auth.updateUser({ password });
        if (failure) {
          setError(
            authErrorMessage(
              failure,
              "We couldn't update your password. Try again or request a new link.",
            ),
          );
          return;
        }
        setPasswordSaved(true);
        await returnToLogin();
      } catch {
        setError("We couldn't reach account services. Please try again.");
      }
    },
  );

  return (
    <AuthLayout
      title="Choose a new password"
      description="Update the password for your LevUp account."
      guide={inboxGuide}
    >
      {link.status === "checking" && <AuthNotice>Checking your password reset link…</AuthNotice>}
      {link.status === "invalid" && (
        <>
          <AuthNotice error>This password reset link is invalid or expired.</AuthNotice>
          <ButtonLink href={to("/forgot-password")} variant="ink" className="mt-5">
            Request a new link
          </ButtonLink>
        </>
      )}
      {link.status === "ready" &&
        (passwordSaved ? (
          <div className="space-y-4">
            <AuthNotice>Your password was updated.</AuthNotice>
            {error && <AuthNotice error>{error}</AuthNotice>}
            <Button variant="ink" onClick={() => void returnToLogin()} disabled={returnPending}>
              {returnPending ? "Finishing…" : "Return to Sign In"}
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(event) => void onSubmit(event)}
            noValidate
            aria-busy={pending}
            className="space-y-4"
          >
            {error && <AuthNotice error>{error}</AuthNotice>}
            <AuthField
              name="password"
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              hint={passwordHint}
              error={errors.password}
            />
            <AuthField
              name="confirmation"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              error={errors.confirmation}
            />
            <Button type="submit" variant="ink" className="min-h-12 font-sans" disabled={pending}>
              {pending ? "Updating…" : "Update password"}
            </Button>
          </form>
        ))}
    </AuthLayout>
  );
}

function continueAfterConfirmation() {
  setRecoveryAccount(null);
  window.location.replace(to(consumeAuthDestination()));
}

export function AuthCallbackPage() {
  const state = useAuthLink("confirmation", continueAfterConfirmation);

  return (
    <AuthLayout
      title="Confirm your email"
      description="Finish creating your LevUp account."
      guide={{
        title: "Check your latest email",
        description:
          "Confirmation links can expire. A new account request can send a fresh link when the address is eligible.",
      }}
    >
      {state.status === "invalid" ? (
        <>
          <AuthNotice error>
            This confirmation link is invalid or expired. Use the latest link from your inbox or try
            creating your account again.
          </AuthNotice>
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink href={to("/signup")} variant="ink">
              Create Account
            </ButtonLink>
            <ButtonLink href={to("/login")} variant="outline">
              Sign In
            </ButtonLink>
          </div>
        </>
      ) : (
        <AuthNotice>Checking your confirmation link…</AuthNotice>
      )}
    </AuthLayout>
  );
}
