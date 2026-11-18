import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculateAuthoritativeTotal,
  clearOrderCacheForTesting,
  createCashfreeOrder,
  getCashfreeBaseUrl,
  isCashfreePaymentsEnabled,
  verifyCashfreeOrder,
} from "./cashfree";

describe("Cashfree PG Server Service", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    clearOrderCacheForTesting();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    clearOrderCacheForTesting();
  });

  it("determines correct base URL for environments", () => {
    expect(getCashfreeBaseUrl("sandbox")).toBe("https://sandbox.cashfree.com/pg");
    expect(getCashfreeBaseUrl("production")).toBe("https://api.cashfree.com/pg");
  });

  it("defaults to disabled payments and fails closed with zero provider requests (S1)", async () => {
    vi.stubEnv("CASHFREE_PAYMENTS_ENABLED", "");
    expect(isCashfreePaymentsEnabled()).toBe(false);

    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      createCashfreeOrder({
        projectSlug: "autonomous-obstacle-avoidance-rover",
        customerDetails: {
          customerId: "cust_123",
          customerName: "Rohan Sharma",
          customerEmail: "rohan@example.com",
          customerPhone: "9876543210",
        },
      }),
    ).rejects.toThrow(/Cashfree payments are currently disabled/i);

    await expect(verifyCashfreeOrder("LP_1700000000_abcde")).rejects.toThrow(
      /Cashfree payments are currently disabled/i,
    );

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("calculates authoritative totals on server and prevents price tampering (S2)", () => {
    const calc = calculateAuthoritativeTotal({
      projectSlug: "smart-irrigation-system-using-esp32",
      packageName: "Standard",
    });

    expect(calc.totalRupees).toBe(6499.0);
    expect(calc.totalPaise).toBe(649900);

    expect(() =>
      calculateAuthoritativeTotal({
        items: [],
      }),
    ).toThrow(/no items specified/i);
  });

  it("rejects order creation when client price tampers with server price (S2)", async () => {
    vi.stubEnv("CASHFREE_PAYMENTS_ENABLED", "true");
    vi.stubEnv("CASHFREE_APP_ID", "mock_app_id_test");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "mock_secret_test");

    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      createCashfreeOrder({
        projectSlug: "autonomous-obstacle-avoidance-rover",
        orderAmount: 1.0, // Tampered client price (actual is 2499.00)
        customerDetails: {
          customerId: "cust_123",
          customerName: "Rohan Sharma",
          customerEmail: "rohan@example.com",
          customerPhone: "9876543210",
        },
      }),
    ).rejects.toThrow(/Order amount mismatch/i);

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fails securely when enabled but server credentials are missing", async () => {
    vi.stubEnv("CASHFREE_PAYMENTS_ENABLED", "true");
    vi.stubEnv("CASHFREE_APP_ID", "");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "");
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      createCashfreeOrder({
        projectSlug: "autonomous-obstacle-avoidance-rover",
        customerDetails: {
          customerId: "cust_123",
          customerName: "Rohan Sharma",
          customerEmail: "rohan@example.com",
          customerPhone: "9876543210",
        },
      }),
    ).rejects.toThrow(/Cashfree server credentials are not configured/i);

    await expect(verifyCashfreeOrder("LP_1700000000_abcde")).rejects.toThrow(
      /Cashfree server credentials are not configured/i,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fails securely when placeholder credentials are configured", async () => {
    vi.stubEnv("CASHFREE_PAYMENTS_ENABLED", "true");
    vi.stubEnv("CASHFREE_APP_ID", "your-cashfree-app-id");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "your-cashfree-client-secret");
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    await expect(verifyCashfreeOrder("LP_1700000000_abcde")).rejects.toThrow(
      /Cashfree server credentials are not configured/i,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects invalid order_id format during verification (S3)", async () => {
    vi.stubEnv("CASHFREE_PAYMENTS_ENABLED", "true");
    vi.stubEnv("CASHFREE_APP_ID", "mock_app_id_test");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "mock_secret_test");

    await expect(verifyCashfreeOrder("../malicious/path")).rejects.toThrow(
      /Invalid order_id format/i,
    );
    await expect(verifyCashfreeOrder("")).rejects.toThrow(/Invalid order_id format/i);
  });

  it("creates order and returns allowlisted response with synthetic credentials (S1, S3)", async () => {
    vi.stubEnv("CASHFREE_PAYMENTS_ENABLED", "true");
    vi.stubEnv("CASHFREE_APP_ID", "mock_app_id_for_unit_test");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "mock_client_secret_for_unit_test");
    vi.stubEnv("CASHFREE_ENV", "sandbox");

    const mockOrderResponse = {
      order_id: "LP_1700000000_abcde",
      payment_session_id: "session_mock_12345",
      order_status: "ACTIVE",
      order_amount: 2499.0,
      order_currency: "INR",
      customer_details: {
        customer_phone: "9876543210", // Raw provider field to be stripped
      },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockOrderResponse,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await createCashfreeOrder({
      projectSlug: "autonomous-obstacle-avoidance-rover",
      customerDetails: {
        customerId: "cust_123",
        customerName: "Rohan Sharma",
        customerEmail: "rohan@example.com",
        customerPhone: "9876543210",
      },
    });

    expect(result.order_id).toBe("LP_1700000000_abcde");
    expect(result.payment_session_id).toBe("session_mock_12345");
    expect(result.order_status).toBe("ACTIVE");
    expect((result as Record<string, unknown>).customer_details).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("handles verification fetch successfully with allowlisted response (S3)", async () => {
    vi.stubEnv("CASHFREE_PAYMENTS_ENABLED", "true");
    vi.stubEnv("CASHFREE_APP_ID", "mock_app_id_for_unit_test");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "mock_client_secret_for_unit_test");
    vi.stubEnv("CASHFREE_ENV", "sandbox");

    const mockVerifyResponse = {
      order_id: "LP_1700000000_abcde",
      order_status: "PAID",
      order_amount: 2499.0,
      order_currency: "INR",
      payments: [
        {
          payment_id: "pay_123",
          payment_status: "SUCCESS",
          payment_amount: 2499.0,
          payment_time: "2026-11-18T12:00:00Z",
          payment_method: "upi",
          bank_account_number: "sensitive_12345", // should not leak
        },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockVerifyResponse,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await verifyCashfreeOrder("LP_1700000000_abcde");
    expect(result.order_status).toBe("PAID");
    expect(result.order_amount).toBe(2499.0);
    expect(result.payments?.[0].payment_id).toBe("pay_123");
    expect((result.payments?.[0] as Record<string, unknown>).bank_account_number).toBeUndefined();
  });

  it("reuses existing session on idempotency key match (S4)", async () => {
    vi.stubEnv("CASHFREE_PAYMENTS_ENABLED", "true");
    vi.stubEnv("CASHFREE_APP_ID", "mock_app_id_for_unit_test");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "mock_client_secret_for_unit_test");

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        order_id: "LP_1700000000_abcde",
        payment_session_id: "session_mock_12345",
        order_status: "ACTIVE",
        order_amount: 2499.0,
        order_currency: "INR",
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const params = {
      idempotencyKey: "idem_cart_session_999",
      projectSlug: "autonomous-obstacle-avoidance-rover",
      customerDetails: {
        customerId: "cust_123",
        customerName: "Rohan Sharma",
        customerEmail: "rohan@example.com",
        customerPhone: "9876543210",
      },
    };

    const res1 = await createCashfreeOrder(params);
    const res2 = await createCashfreeOrder(params);

    expect(res1.payment_session_id).toBe("session_mock_12345");
    expect(res2.payment_session_id).toBe("session_mock_12345");
    expect(mockFetch).toHaveBeenCalledOnce(); // Only 1 provider call made!
  });
});
