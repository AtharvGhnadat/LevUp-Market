import {
  googleSignInConfigured,
  googleErrorMessage,
  signInWithGoogle,
} from "@/auth/google-sign-in";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { GoogleIcon } from "@/components/brand/GoogleIcon";
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

const rememberedEmailKey = "levup-remembered-email";

function readRememberedEmail() {
  try {
    return localStorage.getItem(rememberedEmailKey) ?? "";
  } catch {
    return "";
  }
}

function rememberEmail(value: string) {
  try {
    if (value) localStorage.setItem(rememberedEmailKey, value);
    else localStorage.removeItem(rememberedEmailKey);
  } catch {
    /* The form also works when storage is unavailable. */
  }
}

export function AuthCredentialsPage({ mode }: { mode: "login" | "signup" }) {
  const signup = mode === "signup";
  const [savedEmail] = useState(() => (signup ? "" : readRememberedEmail()));
  const params = new URLSearchParams(window.location.search);
  const destination = safeAuthDestination(
    params.get("next") ?? (signup ? "/account/profile" : null),
  );
  const { state } = useAuth();
  const [googlePending, setGooglePending] = useState(false);
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
        if (!signup) rememberEmail(values.rememberEmail ? email : "");
        setRecoveryAccount(null);
        window.location.replace(to(destination));
      } catch {
        setError("We couldn't reach account services. Please try again.");
      }
    },
  );

  async function continueWithGoogle() {
    if (pending || googlePending) return;
    setError("");
    setGooglePending(true);
    try {
      await signInWithGoogle();
      setRecoveryAccount(null);
      window.location.replace(to(destination));
    } catch (failure) {
      setError(googleErrorMessage(failure));
    } finally {
      setGooglePending(false);
    }
  }

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
      } else if (failure && (!failure.status || failure.status >= 500)) {
        setError("We couldn’t reach account services. Please try again.");
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

  return (
    <AuthLayout
      mode={mode}
      title={signup ? "Create Account" : "Welcome back"}
      description={
        signup
          ? "Set up your LevUp Projects account to get started."
          : "Sign in to your LevUp account."
      }
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
            if (googlePending) event.preventDefault();
            else void onSubmit(event);
          }}
          noValidate
          aria-busy={pending || googlePending}
          className={signup ? "registration-form" : undefined}
        >
          {googleSignInConfigured && (
            <>
              <button
                type="button"
                disabled={!configured || pending || googlePending}
                onClick={() => void continueWithGoogle()}
                className="auth-google-btn flex min-h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-alloy/20 bg-white px-4 text-xs font-semibold text-alloy shadow-2xs transition-colors duration-150 hover:border-alloy/35 hover:bg-mineral/40 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <GoogleIcon className="size-4 shrink-0" />
                <span>{googlePending ? "Connecting to Google…" : "Continue with Google"}</span>
              </button>
              <div className="auth-divider my-1.5">
                <span>or continue with email</span>
              </div>
            </>
          )}
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
              icon={UserRound}
              placeholder="Enter your full name"
              autoComplete="name"
              required
              error={errors.name}
            />
          )}
          <AuthField
            name="email"
            label="Email address"
            icon={Mail}
            defaultValue={savedEmail}
            placeholder="Enter your email address"
            autoComplete="email"
            type="email"
            required
            error={errors.email}
          />
          <AuthField
            name="password"
            label="Password"
            labelAction={
              !signup && (
                <a
                  href={to("/forgot-password")}
                  className="inline-flex min-h-11 items-center text-xs font-medium text-volt-text underline-offset-3 hover:underline sm:text-sm"
                >
                  Forgot password?
                </a>
              )
            }
            type="password"
            icon={LockKeyhole}
            placeholder={signup ? "Create a password" : "Enter your password"}
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
              icon={LockKeyhole}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
              error={errors.confirmation}
            />
          ) : (
            <div className="auth-options">
              <label>
                <input
                  type="checkbox"
                  name="rememberEmail"
                  defaultChecked={Boolean(savedEmail)}
                  onChange={(event) => {
                    if (!event.currentTarget.checked) rememberEmail("");
                  }}
                />
                Remember my email
              </label>
            </div>
          )}
          <Button
            type="submit"
            variant="primary"
            className="auth-submit w-full"
            disabled={pending || googlePending || !configured}
          >
            {pending
              ? signup
                ? "Creating account…"
                : "Signing in…"
              : signup
                ? "Create Account"
                : "Sign In"}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <div className="auth-divider">
            <span>
              {signup ? "Already have an account?" : "New to LevUp?"}{" "}
              <a href={authEntry(signup ? "/login" : "/signup", destination)}>
                {signup ? "Sign In" : "Create an account"}
              </a>
            </span>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
