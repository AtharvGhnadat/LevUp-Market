import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, AuthNotice } from "@/components/auth/AuthFields";
import { Button } from "@/components/ui/Button";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { to } from "@/lib/routes";
import {
  authCallbackUrl,
  authEntry,
  rememberAuthDestination,
  safeAuthDestination,
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
import { useAuth } from "@/auth/auth-context";

export function AuthCredentialsPage({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const params = new URLSearchParams(window.location.search);
  const destination = safeAuthDestination(params.get("next"));
  const { state } = useAuth();
  const configured = isSupabaseConfigured();
  const [error, setError] = useState("");
  const [emailSentTo, setEmailSentTo] = useState("");
  const [resendPending, setResendPending] = useState(false);
  const [resendNotice, setResendNotice] = useState("");
  const expired = params.get("reason") === "expired";
  const reset = params.get("reason") === "reset";

  const { errors, pending, onSubmit } = useAuthForm(
    (values) => ({
      ...(signup && {
        name: !values.name?.trim()
          ? "Enter your full name."
          : values.name.trim().length > 80
            ? "Use 80 characters or fewer."
            : undefined,
      }),
      email: emailError(values.email ?? ""),
      password: signup
        ? newPasswordError(values.password ?? "")
        : !values.password
          ? "Enter your password."
          : undefined,
      ...(signup && { confirmation: confirmationError(values.password, values.confirmation) }),
    }),
    async (values) => {
      setError("");
      try {
        const auth = getSupabaseClient().auth;
        const email = values.email.trim();
        if (signup) {
          rememberAuthDestination(destination);
          const { data, error: failure } = await auth.signUp({
            email,
            password: values.password,
            options: {
              data: { full_name: values.name.trim() },
              emailRedirectTo: authCallbackUrl("/auth/callback"),
            },
          });
          if (failure) {
            if (
              failure.code === "user_already_exists" ||
              failure.code === "email_exists" ||
              (!failure.code && failure.status === 422)
            ) {
              setEmailSentTo(email);
            } else {
              setError(
                authErrorMessage(failure, "We couldn't start account setup. Please try again."),
              );
            }
            return;
          }
          if (!data.session || !data.user?.email_confirmed_at) {
            if (data.session) await auth.signOut({ scope: "local" });
            setEmailSentTo(email);
            return;
          }
        } else {
          const { data, error: failure } = await auth.signInWithPassword({
            email,
            password: values.password,
          });
          if (failure) {
            setError(
              authErrorMessage(
                failure,
                "We couldn't sign you in. Check your email and password and try again.",
              ),
            );
            return;
          }
          if (!data.session || !data.user?.email_confirmed_at) {
            setError(
              "Confirm your email before signing in. Check your inbox for the confirmation link.",
            );
            return;
          }
        }
        setRecoveryAccount(null);
        window.location.replace(to(destination));
      } catch {
        setError("We couldn't reach account services. Please try again.");
      }
    },
  );

  async function resend() {
    if (resendPending) return;
    setError("");
    setResendNotice("");
    setResendPending(true);
    try {
      const { error: failure } = await getSupabaseClient().auth.resend({
        type: "signup",
        email: emailSentTo,
        options: { emailRedirectTo: authCallbackUrl("/auth/callback") },
      });
      if (failure?.status === 429) {
        setError("Too many requests. Wait a moment before trying again.");
      } else {
        setResendNotice(
          "If this address can receive another confirmation link, we'll send one shortly.",
        );
      }
    } catch {
      setError("We couldn't reach account services. Please try again.");
    } finally {
      setResendPending(false);
    }
  }

  if (emailSentTo) {
    return (
      <AuthLayout
        title="Check your inbox"
        description="Follow the email confirmation link to finish setting up your account."
        guide={{
          title: "Use the same browser",
          description:
            "Open the link in the browser you used to create your account. Check junk mail if the message is taking longer than expected.",
        }}
      >
        <AuthNotice>
          If this address can receive a confirmation link, you’ll get an email shortly.
        </AuthNotice>
        {error && (
          <div className="mt-3">
            <AuthNotice error>{error}</AuthNotice>
          </div>
        )}
        {resendNotice && (
          <div className="mt-3">
            <AuthNotice>{resendNotice}</AuthNotice>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Button variant="outline" onClick={() => void resend()} disabled={resendPending}>
            {resendPending ? "Sending…" : "Resend confirmation"}
          </Button>
          <a
            href={authEntry("/login", destination)}
            className="min-h-11 content-center text-sm font-medium text-volt-text underline underline-offset-3"
          >
            Back to Sign In
          </a>
        </div>
      </AuthLayout>
    );
  }

  const title = signup ? "Create your LevUp account" : "Sign in to your workspace";
  return (
    <AuthLayout
      mode={mode}
      title={title}
      description={
        signup
          ? "Start with your sign-in details. You can add your institution and project interests later."
          : "Access your engineering projects, requests and account details."
      }
      guide={{
        title: "Continue where you left off",
        description:
          "Your project selections stay in this browser while you sign in or create an account.",
      }}
    >
      {state.status === "loading" ? (
        <AuthNotice>Checking your session…</AuthNotice>
      ) : state.status === "signed-in" ? (
        <AuthNotice>
          You’re already signed in.{" "}
          <a
            href={to(destination)}
            className="font-medium text-volt-text underline underline-offset-3"
          >
            Continue
          </a>
        </AuthNotice>
      ) : (
        <form
          onSubmit={(event) => {
            setError("");
            void onSubmit(event);
          }}
          noValidate
          aria-busy={pending}
          className="space-y-4"
        >
          {!configured && (
            <AuthNotice error>Account services aren’t available in this environment.</AuthNotice>
          )}
          {!signup && expired && (
            <AuthNotice>Your session expired. Sign in to continue.</AuthNotice>
          )}
          {!signup && reset && (
            <AuthNotice>Password updated. Sign in with your new password.</AuthNotice>
          )}
          {error && <AuthNotice error>{error}</AuthNotice>}
          {Object.values(errors).some(Boolean) && (
            <AuthNotice error>Check the highlighted fields and try again.</AuthNotice>
          )}
          {signup && (
            <AuthField
              name="name"
              label="Full name"
              autoComplete="name"
              required
              error={errors.name}
            />
          )}
          <AuthField
            name="email"
            label="Email address"
            autoComplete="email"
            type="email"
            required
            error={errors.email}
          />
          <AuthField
            name="password"
            label="Password"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            required
            hint={signup ? passwordHint : undefined}
            error={errors.password}
          />
          {signup ? (
            <AuthField
              name="confirmation"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              error={errors.confirmation}
            />
          ) : (
            <a
              href={to("/forgot-password")}
              className="inline-flex min-h-11 items-center text-sm font-medium text-volt-text underline-offset-3 hover:underline"
            >
              Forgot password?
            </a>
          )}
          <Button
            type="submit"
            variant="ink"
            className="mt-1 w-full min-h-12 justify-between px-5 font-sans"
            disabled={pending || !configured}
          >
            {pending
              ? signup
                ? "Creating account…"
                : "Signing in…"
              : signup
                ? "Create Account"
                : "Sign In"}
            <ArrowRight size={18} aria-hidden="true" />
          </Button>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
            {signup ? "Already have an account?" : "New to LevUp?"}
            <a
              href={authEntry(signup ? "/login" : "/signup", destination)}
              className="inline-flex min-h-11 items-center font-medium text-volt-text underline underline-offset-3"
            >
              {signup ? "Sign In" : "Create Account"}
            </a>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
