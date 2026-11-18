import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSupabaseAdminClient,
  isSupabaseAdminConfigured,
  recordPaymentEvent,
  resetSupabaseAdminClientForTesting,
} from "./supabase-admin";

vi.mock("@supabase/supabase-js", () => {
  const insertMock = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: { id: "mock-payment-event-uuid" },
        error: null,
      }),
    }),
  });

  return {
    createClient: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        insert: insertMock,
      }),
    }),
  };
});

describe("Supabase Admin Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    resetSupabaseAdminClientForTesting();
  });

  it("reports unconfigured and fails closed when service key is missing", async () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    vi.stubEnv("SUPABASE_URL", "");

    expect(isSupabaseAdminConfigured()).toBe(false);
    expect(() => getSupabaseAdminClient()).toThrow("Supabase admin client is not configured");

    const result = await recordPaymentEvent({
      orderId: "ord_test_123",
      eventId: "cf_evt_test_456",
      eventType: "PAYMENT_SUCCESS_WEBHOOK",
      status: "successful",
      amountPaise: 249900,
      rawPayload: { status: "SUCCESS" },
    });

    expect(result.error).toBe("Supabase admin client is not configured");
    expect(result.id).toBeUndefined();
  });

  it("creates admin client and records payment event with synthetic credentials", async () => {
    vi.stubEnv("SUPABASE_URL", "https://synthetic-project.supabase.co");
    vi.stubEnv(
      "SUPABASE_SERVICE_ROLE_KEY",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.synthetic-service-role-key",
    );

    expect(isSupabaseAdminConfigured()).toBe(true);

    const admin = getSupabaseAdminClient();
    expect(admin).toBeDefined();
    expect(typeof admin.from).toBe("function");

    const result = await recordPaymentEvent({
      orderId: "ord_test_123",
      eventId: "cf_evt_test_456",
      eventType: "PAYMENT_SUCCESS_WEBHOOK",
      status: "successful",
      amountPaise: 249900,
      rawPayload: { status: "SUCCESS" },
    });

    expect(result.id).toBe("mock-payment-event-uuid");
    expect(result.error).toBeUndefined();
  });
});
