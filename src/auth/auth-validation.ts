import type { AuthError } from "@supabase/supabase-js";

export const passwordMinimum = 12;
export const passwordHint = "Use at least 12 characters.";

export function emailError(value: string): string | undefined {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
}

export function newPasswordError(value: string): string | undefined {
  if (value.length < passwordMinimum) return passwordHint;
  if (new TextEncoder().encode(value).length > 72)
    return "Use a shorter password. Passwords can be up to 72 bytes.";
}

export function confirmationError(password: string, confirmation: string): string | undefined {
  if (!confirmation) return "Confirm your password.";
  if (password !== confirmation) return "The passwords do not match.";
}

export function authErrorMessage(error: AuthError, fallback: string): string {
  if (
    error.status === 429 ||
    error.code === "over_email_send_rate_limit" ||
    error.code === "over_request_rate_limit"
  ) {
    return "Too many attempts. Wait a moment before trying again.";
  }
  if (
    error.name === "AuthRetryableFetchError" ||
    error.status === 0 ||
    (error.status && error.status >= 500)
  )
    return "We couldn’t reach account services. Please try again.";
  if (error.code === "weak_password")
    return "Your password did not meet the security requirements. Try a longer, unique password.";
  if (error.code === "same_password")
    return "Choose a password you have not already used for this account.";
  if (error.code === "email_not_confirmed")
    return "Confirm your email before signing in. Check your inbox for the confirmation link.";
  return fallback;
}
