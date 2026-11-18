import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

function getEnvValue(metaKey?: string, procKey?: string): string {
  if (typeof import.meta !== "undefined" && import.meta.env && metaKey) {
    const val = import.meta.env[metaKey];
    if (typeof val === "string" && val.trim().length > 0) return val.trim();
  }
  if (typeof process !== "undefined" && process.env && procKey) {
    const val = process.env[procKey];
    if (typeof val === "string" && val.trim().length > 0) return val.trim();
  }
  return "";
}

export function getSupabaseUrl(): string {
  return (
    getEnvValue("VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL") ||
    getEnvValue("", "SUPABASE_URL") ||
    ""
  );
}

export function getSupabaseAnonKey(): string {
  return (
    getEnvValue("VITE_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
    getEnvValue("", "SUPABASE_ANON_KEY") ||
    ""
  );
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url &&
    key &&
    !url.includes("your-supabase-url") &&
    !key.includes("placeholder") &&
    !key.includes("your-anon-key"),
  );
}

let clientInstance: SupabaseClient | null = null;

export function resetSupabaseClientForTesting(): void {
  clientInstance = null;
}

/**
 * Returns the client-side Supabase client singleton.
 * Uses the anonymous public key with Row-Level Security enforced.
 * Fails closed if credentials are not configured.
 */
export function getSupabaseClient(): SupabaseClient {
  if (clientInstance) {
    return clientInstance;
  }

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    const isTest =
      typeof process !== "undefined" &&
      (process.env.NODE_ENV === "test" || Boolean(process.env.VITEST));
    if (!isTest) {
      logger.warn(
        "integrations",
        "supabase.client.credentials_missing",
        "Supabase credentials missing from environment",
        {
          metadata: {
            hasUrl: Boolean(url),
            hasAnonKey: Boolean(key),
          },
        },
      );
    }
    throw new Error(
      "Supabase client is not configured. Define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.",
    );
  }

  clientInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return clientInstance;
}

/**
 * Lazy proxy export for the client singleton.
 * Ensures module evaluation does not throw in clean environments where Supabase keys are not set.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = Reflect.get(client, prop);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
