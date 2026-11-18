import { load } from "@cashfreepayments/cashfree-js";
import { to } from "@/lib/routes";

let cashfreeInstancePromise: Promise<unknown> | null = null;

export async function getCashfreeInstance() {
  if (!cashfreeInstancePromise) {
    cashfreeInstancePromise = load({
      mode: "sandbox",
    });
  }
  return cashfreeInstancePromise;
}

export type CheckoutCustomerDetails = {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export type CreateOrderClientPayload = {
  orderAmount?: number;
  items?: Array<{ slug: string; packageName?: string; addOnIds?: string[] }>;
  customerDetails: CheckoutCustomerDetails;
  projectSlug?: string;
  projectTitle?: string;
  orderMeta?: {
    returnUrl?: string;
  };
  idempotencyKey?: string;
};

export type OrderCreatedResult = {
  order_id: string;
  payment_session_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
};

export type OrderVerificationResult = {
  order_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED" | "FAILED";
  order_amount: number;
  order_currency: string;
  created_at?: string;
  payments?: Array<{
    payment_id: string;
    payment_status: "SUCCESS" | "FAILED" | "PENDING";
    payment_amount: number;
    payment_time: string;
    payment_method: string;
  }>;
};

export async function getPaymentGatewayStatus(): Promise<{
  enabled: boolean;
  environment: string;
  rotationStatus: string;
}> {
  try {
    const res = await fetch("/api/payments/cashfree/status");
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback to disabled
  }
  return {
    enabled: false,
    environment: "sandbox",
    rotationStatus: "PENDING_NOT_CONFIRMED",
  };
}

/**
 * Initiates order creation with the server and triggers Cashfree Checkout.
 */
export async function launchCashfreeCheckout(
  payload: CreateOrderClientPayload,
  redirectTarget: "_modal" | "_self" = "_modal",
): Promise<OrderCreatedResult> {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const returnUrl =
    payload.orderMeta?.returnUrl || `${origin}${to("/checkout/return")}?order_id={order_id}`;

  const res = await fetch("/api/payments/cashfree/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      orderMeta: {
        returnUrl,
      },
    }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    if (res.status === 503) {
      throw new Error(
        errorJson.error || "Payment processing is currently disabled pending credential rotation.",
      );
    }
    throw new Error(errorJson.error || `Payment session creation failed with status ${res.status}`);
  }

  const orderData = (await res.json()) as OrderCreatedResult;

  if (!orderData.payment_session_id) {
    throw new Error("Cashfree did not return a valid payment_session_id");
  }

  // Load and launch Cashfree checkout
  const cashfree = (await getCashfreeInstance()) as {
    checkout: (options: { paymentSessionId: string; redirectTarget: string }) => Promise<void>;
  };

  await cashfree.checkout({
    paymentSessionId: orderData.payment_session_id,
    redirectTarget,
  });

  return orderData;
}

/**
 * Fetches order verification details for a given Cashfree order ID.
 */
export async function verifyPaymentStatus(orderId: string): Promise<OrderVerificationResult> {
  const res = await fetch(
    `/api/payments/cashfree/verify-order?order_id=${encodeURIComponent(orderId)}`,
  );

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    if (res.status === 503) {
      throw new Error("Payment verification is currently disabled.");
    }
    throw new Error(errorJson.error || `Failed to verify order status with code ${res.status}`);
  }

  return (await res.json()) as OrderVerificationResult;
}
