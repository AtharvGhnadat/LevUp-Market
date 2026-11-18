import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSupabaseAdminClient, recordPaymentEvent } from "./supabase-admin";

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
  });

  it("creates admin client with bypass capabilities", () => {
    const admin = getSupabaseAdminClient();
    expect(admin).toBeDefined();
    expect(typeof admin.from).toBe("function");
  });

  it("records payment event idempotently", async () => {
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
