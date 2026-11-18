import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../lib/logger";

function normalizeEnvValue(raw: string | undefined): string {
  if (!raw) return "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

export function getSupabaseAdminUrl(): string {
  return (
    normalizeEnvValue(process.env.SUPABASE_URL) ||
    normalizeEnvValue(process.env.VITE_SUPABASE_URL) ||
    normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    ""
  );
}

export function getSupabaseServiceRoleKey(): string {
  return normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isSupabaseAdminConfigured(): boolean {
  const url = getSupabaseAdminUrl();
  const key = getSupabaseServiceRoleKey();
  return Boolean(
    url &&
    key &&
    !url.includes("your-supabase-url") &&
    !key.includes("placeholder") &&
    !key.includes("your-service-role-key"),
  );
}

let adminClientInstance: SupabaseClient | null = null;

export function resetSupabaseAdminClientForTesting(): void {
  adminClientInstance = null;
}

/**
 * Returns the privileged server-side Supabase client singleton.
 * Bypasses RLS for administrative operations (payment events, order fulfillments).
 * NEVER expose this client to the browser.
 * Fails closed if SUPABASE_SERVICE_ROLE_KEY is not defined.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  const url = getSupabaseAdminUrl();
  const key = getSupabaseServiceRoleKey();

  if (!url || !key) {
    const isTest =
      typeof process !== "undefined" &&
      (process.env.NODE_ENV === "test" || Boolean(process.env.VITEST));
    if (!isTest) {
      logger.warn(
        "integrations",
        "supabase.admin.key_missing",
        "SUPABASE_SERVICE_ROLE_KEY is not defined in the server environment",
      );
    }
    throw new Error(
      "Supabase admin client is not configured. Define SUPABASE_SERVICE_ROLE_KEY in your server environment.",
    );
  }

  adminClientInstance = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClientInstance;
}

export interface RecordPaymentEventParams {
  orderId: string;
  eventId: string;
  eventType: string;
  status: "initiated" | "pending" | "successful" | "failed" | "refunded";
  amountPaise: number;
  rawPayload: Record<string, unknown>;
}

/**
 * Persists an immutable financial transaction record in Supabase.
 * Fails closed if Supabase admin is not configured.
 */
export async function recordPaymentEvent(
  params: RecordPaymentEventParams,
): Promise<{ id?: string; error?: string }> {
  if (!isSupabaseAdminConfigured()) {
    return { error: "Supabase admin client is not configured" };
  }

  try {
    const admin = getSupabaseAdminClient();
    const { data, error } = await admin
      .from("payment_events")
      .insert({
        order_id: params.orderId,
        event_id: params.eventId,
        event_type: params.eventType,
        status: params.status,
        amount_paise: params.amountPaise,
        raw_payload: params.rawPayload,
      })
      .select("id")
      .single();

    if (error) {
      logger.error("payments", "payment_event.persist_failed", "Failed to persist payment event", {
        metadata: { orderId: params.orderId, eventId: params.eventId },
      });
      return { error: "Database error persisting payment event" };
    }

    logger.info(
      "payments",
      "payment_event.persisted",
      `Payment event persisted successfully: ${params.eventId}`,
      { resource_type: "payment_event", resource_id: data.id },
    );
    return { id: data.id };
  } catch {
    logger.error(
      "payments",
      "payment_event.unhandled_error",
      "Unhandled error recording payment event",
      { metadata: { orderId: params.orderId } },
    );
    return { error: "Internal payment recording failure" };
  }
}
