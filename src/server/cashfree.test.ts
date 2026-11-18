import { afterEach, describe, expect, it, vi } from "vitest";
import { createCashfreeOrder, getCashfreeBaseUrl, verifyCashfreeOrder } from "./cashfree";

describe("Cashfree PG Server Service", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("determines correct base URL for environments", () => {
    expect(getCashfreeBaseUrl("sandbox")).toBe("https://sandbox.cashfree.com/pg");
    expect(getCashfreeBaseUrl("production")).toBe("https://api.cashfree.com/pg");
  });

  it("fails securely when server credentials are missing", async () => {
    vi.stubEnv("CASHFREE_APP_ID", "");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "");
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    await expect(
      createCashfreeOrder({
        orderAmount: 2499.0,
        customerDetails: {
          customerId: "cust_123",
          customerName: "Rohan Sharma",
          customerEmail: "rohan@example.com",
          customerPhone: "9876543210",
        },
        projectTitle: "Autonomous Obstacle Avoidance Robot",
      }),
    ).rejects.toThrow(/Cashfree server credentials are not configured/i);

    await expect(verifyCashfreeOrder("LP_1700000000_abcde")).rejects.toThrow(
      /Cashfree server credentials are not configured/i,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fails securely when placeholder credentials are configured", async () => {
    vi.stubEnv("CASHFREE_APP_ID", "your-cashfree-app-id");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "your-cashfree-client-secret");
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    await expect(verifyCashfreeOrder("LP_1700000000_abcde")).rejects.toThrow(
      /Cashfree server credentials are not configured/i,
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("creates order successfully with mocked fetch and synthetic credentials", async () => {
    vi.stubEnv("CASHFREE_APP_ID", "mock_app_id_for_unit_test");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "mock_client_secret_for_unit_test");
    vi.stubEnv("CASHFREE_ENV", "sandbox");

    const mockOrderResponse = {
      order_id: "LP_1700000000_abcde",
      payment_session_id: "session_mock_12345",
      order_status: "ACTIVE",
      order_amount: 2499.0,
      order_currency: "INR",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockOrderResponse,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await createCashfreeOrder({
      orderAmount: 2499.0,
      customerDetails: {
        customerId: "cust_123",
        customerName: "Rohan Sharma",
        customerEmail: "rohan@example.com",
        customerPhone: "9876543210",
      },
      projectTitle: "Autonomous Obstacle Avoidance Robot",
    });

    expect(result.order_id).toBe("LP_1700000000_abcde");
    expect(result.payment_session_id).toBe("session_mock_12345");
    expect(result.order_status).toBe("ACTIVE");
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it("handles verification fetch successfully with synthetic credentials", async () => {
    vi.stubEnv("CASHFREE_APP_ID", "mock_app_id_for_unit_test");
    vi.stubEnv("CASHFREE_CLIENT_SECRET", "mock_client_secret_for_unit_test");
    vi.stubEnv("CASHFREE_ENV", "sandbox");

    const mockVerifyResponse = {
      order_id: "LP_1700000000_abcde",
      order_status: "PAID",
      order_amount: 2499.0,
      order_currency: "INR",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockVerifyResponse,
    });
    vi.stubGlobal("fetch", mockFetch);

    const result = await verifyCashfreeOrder("LP_1700000000_abcde");
    expect(result.order_status).toBe("PAID");
    expect(result.order_amount).toBe(2499.0);
  });
});
