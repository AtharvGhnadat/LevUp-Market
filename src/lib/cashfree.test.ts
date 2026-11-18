import { describe, it, expect, vi, beforeEach } from "vitest";
import { launchCashfreeCheckout, verifyPaymentStatus, getPaymentGatewayStatus } from "./cashfree";

const { mockCheckout } = vi.hoisted(() => ({
  mockCheckout: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@cashfreepayments/cashfree-js", () => ({
  load: vi.fn().mockResolvedValue({
    checkout: mockCheckout,
  }),
}));

describe("Cashfree Client Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls create-order and launches checkout modal", async () => {
    const mockOrderResponse = {
      order_id: "LP_test_123",
      payment_session_id: "session_mock_456",
      order_status: "ACTIVE",
      order_amount: 3999,
      order_currency: "INR",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockOrderResponse,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await launchCashfreeCheckout({
      orderAmount: 3999,
      customerDetails: {
        customerId: "cust_test",
        customerName: "Aman Verma",
        customerEmail: "aman@example.com",
        customerPhone: "9876543210",
      },
      projectTitle: "Smart Home Automation",
    });

    expect(result.order_id).toBe("LP_test_123");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/payments/cashfree/create-order",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(mockCheckout).toHaveBeenCalledWith({
      paymentSessionId: "session_mock_456",
      redirectTarget: "_modal",
    });

    vi.unstubAllGlobals();
  });

  it("handles 503 payments disabled response cleanly (S1)", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({
        error: "Payment processing is currently disabled.",
        code: "PAYMENTS_DISABLED",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      launchCashfreeCheckout({
        customerDetails: {
          customerId: "cust_test",
          customerName: "Aman Verma",
          customerEmail: "aman@example.com",
          customerPhone: "9876543210",
        },
      }),
    ).rejects.toThrow(/disabled/i);

    vi.unstubAllGlobals();
  });

  it("retrieves gateway status from server endpoint", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        enabled: false,
        environment: "sandbox",
        rotationStatus: "PENDING_NOT_CONFIRMED",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const status = await getPaymentGatewayStatus();
    expect(status.enabled).toBe(false);
    expect(status.rotationStatus).toBe("PENDING_NOT_CONFIRMED");

    vi.unstubAllGlobals();
  });

  it("verifies payment status via API", async () => {
    const mockVerifyResponse = {
      order_id: "LP_test_123",
      order_status: "PAID",
      order_amount: 3999,
      order_currency: "INR",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockVerifyResponse,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await verifyPaymentStatus("LP_test_123");
    expect(result.order_status).toBe("PAID");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/payments/cashfree/verify-order?order_id=LP_test_123",
    );

    vi.unstubAllGlobals();
  });
});
