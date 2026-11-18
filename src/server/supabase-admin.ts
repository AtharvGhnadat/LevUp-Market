import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://mgeygvcilbcfjkoehppm.supabase.co";

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let adminClientInstance: SupabaseClient | null = null;

/**
 * Returns the privileged server-side Supabase client singleton.
 * Bypasses RLS for administrative operations (payment events, order fulfillments).
 * NEVER expose this client to the browser.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    logger.warn(
      "integrations",
      "supabase.admin.key_missing",
      "SUPABASE_SERVICE_ROLE_KEY is not defined in the server environment",
    );
  }

  adminClientInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
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
 */
export async function recordPaymentEvent(
  params: RecordPaymentEventParams,
): Promise<{ id?: string; error?: string }> {
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
      logger.error(
        "payments",
        "payment_event.persist_failed",
        `Failed to persist payment event: ${error.message}`,
        { metadata: { error: error.message, orderId: params.orderId, eventId: params.eventId } },
      );
      return { error: error.message };
    }

    logger.info(
      "payments",
      "payment_event.persisted",
      `Payment event persisted successfully: ${params.eventId}`,
      { resource_type: "payment_event", resource_id: data.id },
    );
    return { id: data.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      "payments",
      "payment_event.unhandled_error",
      `Unhandled error recording payment event: ${message}`,
      { metadata: { orderId: params.orderId } },
    );
    return { error: message };
  }
}
