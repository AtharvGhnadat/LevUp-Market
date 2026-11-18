import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://mgeygvcilbcfjkoehppm.supabase.co";

const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  "";

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the client-side Supabase client singleton.
 * Uses the anonymous public key with Row-Level Security enforced.
 */
export function getSupabaseClient(): SupabaseClient {
  if (clientInstance) {
    return clientInstance;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    logger.warn(
      "integrations",
      "supabase.client.credentials_missing",
      "Supabase credentials missing; initializing with fallback configuration",
      {
        metadata: {
          hasUrl: Boolean(SUPABASE_URL),
          hasAnonKey: Boolean(SUPABASE_ANON_KEY),
        },
      },
    );
  }

  clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return clientInstance;
}

export const supabase = getSupabaseClient();
