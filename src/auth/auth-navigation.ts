import { to } from "@/lib/routes";

const defaultDestination = "/account";
const returnPaths = new Set([
  "/",
  "/account",
  "/cart",
  "/checkout",
  "/custom-project",
  "/projects",
]);
const returnStorageKey = "levup-auth-return-v1";
const recoveryStorageKey = "levup-auth-recovery-v1";
const returnLifetime = 60 * 60 * 1000;

export function safeAuthDestination(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.length > 1024 ||
    /[\\\s]/.test(value) ||
    Array.from(value).some(
      (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
  ) {
    return defaultDestination;
  }

  try {
    const origin = "https://levup.invalid";
    const url = new URL(value, origin);
    const path = value.split(/[?#]/, 1)[0];
    if (
      url.origin !== origin ||
      path !== url.pathname ||
      (!returnPaths.has(path) && !/^\/projects\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path))
    ) {
      return defaultDestination;
    }
    return path + url.search + url.hash;
  } catch {
    return defaultDestination;
  }
}

export function authEntry(path: "/login" | "/signup", destination: string): string {
  const next = safeAuthDestination(destination);
  return to(next === defaultDestination ? path : `${path}?${new URLSearchParams({ next })}`);
}

export function authCallbackUrl(path: "/auth/callback" | "/reset-password"): string {
  const url = new URL(to(path), window.location.origin);
  if (url.origin !== window.location.origin)
    throw new Error("Authentication requires a same-origin callback.");
  return url.href;
}

export function rememberAuthDestination(destination: string) {
  try {
    window.localStorage.setItem(
      returnStorageKey,
      JSON.stringify({
        next: safeAuthDestination(destination),
        expiresAt: Date.now() + returnLifetime,
      }),
    );
  } catch {
    // Storage can be restricted. The callback will fall back to the account page.
  }
}

export function consumeAuthDestination(): string {
  try {
    const value = window.localStorage.getItem(returnStorageKey);
    window.localStorage.removeItem(returnStorageKey);
    if (!value) return defaultDestination;
    const saved = JSON.parse(value) as { next?: unknown; expiresAt?: unknown };
    if (
      typeof saved.next === "string" &&
      typeof saved.expiresAt === "number" &&
      saved.expiresAt > Date.now()
    ) {
      return safeAuthDestination(saved.next);
    }
  } catch {
    // An unavailable or malformed return value never controls navigation.
  }
  return defaultDestination;
}

export function setRecoveryAccount(userId: string | null) {
  try {
    if (userId) window.localStorage.setItem(recoveryStorageKey, userId);
    else window.localStorage.removeItem(recoveryStorageKey);
  } catch {
    // A blocked storage API cannot invalidate the provider's current session.
  }
}

export function isRecoveryAccount(userId: string): boolean {
  try {
    return window.localStorage.getItem(recoveryStorageKey) === userId;
  } catch {
    return false;
  }
}
