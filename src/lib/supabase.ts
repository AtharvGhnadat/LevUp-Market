import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./supabase-config";

export { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./supabase-config";

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

  if (!isSupabaseConfigured()) {
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
      "Supabase client is not configured. Define VITE_SUPABASE_URL and a public Supabase key in your environment.",
    );
  }

  clientInstance = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      flowType: "pkce",
      detectSessionInUrl: false,
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
