import fs from "node:fs";
import path from "node:path";
import { logger } from "../lib/logger";
import { demoProjects } from "../data/demo-projects";
import { getProjectDetail } from "../data/project-details";

export type CashfreeEnvironment = "sandbox" | "production";

export type OrderItemInput = {
  slug: string;
  packageName?: string;
  addOnIds?: string[];
};

export type CreateOrderParams = {
  orderAmount?: number; // Optional from client; authoritative total is calculated on server
  items?: OrderItemInput[];
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta?: {
    returnUrl?: string;
    notifyUrl?: string;
  };
  orderNote?: string;
  projectSlug?: string;
  projectTitle?: string;
  idempotencyKey?: string;
};

export type CashfreeOrderResponse = {
  order_id: string;
  payment_session_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED";
  order_amount: number;
  order_currency: string;
};

export type VerifyOrderResponse = {
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

const PLACEHOLDER_VALUES = new Set([
  "your-cashfree-app-id",
  "your-cashfree-client-secret",
  "changeme",
]);

// In-memory idempotency cache for order creations
const orderIdempotencyCache = new Map<string, CashfreeOrderResponse>();

export function clearOrderCacheForTesting(): void {
  orderIdempotencyCache.clear();
}

/**
 * Server-side payment enablement gate.
 * Defaults to false across all environments until confirmed credential rotation.
 */
export function isCashfreePaymentsEnabled(): boolean {
  const flag = (process.env.CASHFREE_PAYMENTS_ENABLED || "").trim().toLowerCase();
  return flag === "true" || flag === "1";
}

function normalizeEnvValue(raw: string | undefined): string {
  if (!raw) return "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

function getCredentials() {
  if (!isCashfreePaymentsEnabled()) {
    throw new Error(
      "Cashfree payments are currently disabled. Enable with CASHFREE_PAYMENTS_ENABLED=true only after confirming credential rotation.",
    );
  }

  let appId = normalizeEnvValue(process.env.CASHFREE_APP_ID);
  let secretKey = normalizeEnvValue(process.env.CASHFREE_CLIENT_SECRET);
  let env = (normalizeEnvValue(process.env.CASHFREE_ENV) as CashfreeEnvironment) || "sandbox";

  // Local development convenience only: read from .env.local when not running unit tests
  const isTestEnv = process.env.NODE_ENV === "test" || Boolean(process.env.VITEST);
  if ((!appId || !secretKey) && !isTestEnv) {
    const localEnvPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(localEnvPath)) {
      const content = fs.readFileSync(localEnvPath, "utf8");
      const matchedAppId = normalizeEnvValue(content.match(/^CASHFREE_APP_ID=(.*)$/m)?.[1]);
      const matchedSecret = normalizeEnvValue(content.match(/^CASHFREE_CLIENT_SECRET=(.*)$/m)?.[1]);
      const matchedEnv = normalizeEnvValue(content.match(/^CASHFREE_ENV=(.*)$/m)?.[1]);
      if (!appId && matchedAppId) appId = matchedAppId;
      if (!secretKey && matchedSecret) secretKey = matchedSecret;
      if (matchedEnv === "sandbox" || matchedEnv === "production") env = matchedEnv;
    }
  }

  if (
    !appId ||
    !secretKey ||
    PLACEHOLDER_VALUES.has(appId.toLowerCase()) ||
    PLACEHOLDER_VALUES.has(secretKey.toLowerCase())
  ) {
    throw new Error(
      "Cashfree server credentials are not configured. Set CASHFREE_APP_ID and CASHFREE_CLIENT_SECRET in secure server environment variables.",
    );
  }

  return {
    appId,
    secretKey,
    env,
  };
}

export function getCashfreeBaseUrl(env: CashfreeEnvironment = "sandbox"): string {
  return env === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
}

/**
 * Calculates authoritative order total from catalog definitions.
 * Prevents client-side price manipulation (Codex S2).
 */
export function calculateAuthoritativeTotal(params: {
  items?: OrderItemInput[];
  projectSlug?: string;
  packageName?: string;
}): { totalPaise: number; totalRupees: number } {
  let itemsToCalculate = params.items || [];

  if (itemsToCalculate.length === 0 && params.projectSlug) {
    itemsToCalculate = [
      {
        slug: params.projectSlug,
        packageName: params.packageName || "Standard",
      },
    ];
  }

  if (itemsToCalculate.length === 0) {
    throw new Error("Cannot calculate order total: no items specified.");
  }

  let totalPaise = 0;

  for (const item of itemsToCalculate) {
    const details = getProjectDetail(item.slug);
    if (details) {
      const selectedPackage =
        details.packages.find(
          (p) => p.name.toLowerCase() === (item.packageName || "standard").toLowerCase(),
        ) || details.packages[0];
      let itemPrice = selectedPackage?.price ?? 249900;

      if (item.addOnIds && item.addOnIds.length > 0) {
        for (const addOnId of item.addOnIds) {
          const addOn = details.addOns.find((a) => a.id === addOnId);
          if (addOn && addOn.price) {
            itemPrice += addOn.price;
          }
        }
      }
      totalPaise += itemPrice;
      continue;
    }

    const demo = demoProjects.find((p) => p.slug === item.slug);
    if (demo) {
      totalPaise += demo.basePrice;
      continue;
    }

    throw new Error(`Invalid project catalog item: ${item.slug}`);
  }

  const totalRupees = Math.round((totalPaise / 100) * 100) / 100;
  return { totalPaise, totalRupees };
}

/**
 * Validates bounded customer input strings (Codex S2).
 */
function validateCustomerDetails(details: CreateOrderParams["customerDetails"]) {
  if (!details || typeof details !== "object") {
    throw new Error("Customer details are required.");
  }

  const name = (details.customerName || "").trim();
  if (name.length < 2 || name.length > 100) {
    throw new Error("Customer name must be between 2 and 100 characters.");
  }

  const email = (details.customerEmail || "").trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 150) {
    throw new Error("Valid customer email is required.");
  }

  const phone = (details.customerPhone || "").replace(/\D/g, "");
  if (phone.length < 10 || phone.length > 15) {
    throw new Error("Valid customer phone (10 to 15 digits) is required.");
  }

  return {
    customerId: (details.customerId || `cust_${phone.slice(-6)}`).slice(0, 50),
    customerName: name,
    customerEmail: email,
    customerPhone: phone.slice(-10),
  };
}

/**
 * Server-side order creation client.
 * Calls Cashfree PG API v2023-08-01 using merchant credentials.
 */
export async function createCashfreeOrder(
  params: CreateOrderParams,
): Promise<CashfreeOrderResponse> {
  // 1. Enforce Server-Side Enablement Gate (S1)
  if (!isCashfreePaymentsEnabled()) {
    throw new Error(
      "Cashfree payments are currently disabled. Set CASHFREE_PAYMENTS_ENABLED=true in server configuration.",
    );
  }

  // 2. Check Idempotency Key (S4)
  if (params.idempotencyKey && orderIdempotencyCache.has(params.idempotencyKey)) {
    const existing = orderIdempotencyCache.get(params.idempotencyKey)!;
    logger.info(
      "payments",
      "order.idempotent_hit",
      "Reusing existing order session for idempotency key",
      {
        metadata: { orderId: existing.order_id, idempotencyKey: params.idempotencyKey },
      },
    );
    return existing;
  }

  // 3. Authoritative Pricing & Input Validation (S2)
  const validatedCustomer = validateCustomerDetails(params.customerDetails);
  const { totalRupees } = calculateAuthoritativeTotal({
    items: params.items,
    projectSlug: params.projectSlug,
  });

  // Verify that if client supplied an amount, it does not diverge from authoritative total
  if (params.orderAmount && Math.abs(params.orderAmount - totalRupees) > 0.05) {
    logger.warn(
      "payments",
      "order.price_tamper_attempt",
      "Client supplied order amount diverges from server authoritative price",
      { metadata: { clientAmount: params.orderAmount, serverAmount: totalRupees } },
    );
    throw new Error("Order amount mismatch: Client price does not match server catalog price.");
  }

  const { appId, secretKey, env } = getCredentials();
  const baseUrl = getCashfreeBaseUrl(env);

  const orderId = `LP_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const returnUrl =
    params.orderMeta?.returnUrl || `http://localhost:8443/checkout/return?order_id={order_id}`;

  const payload = {
    order_id: orderId,
    order_amount: totalRupees,
    order_currency: "INR",
    customer_details: {
      customer_id: validatedCustomer.customerId,
      customer_name: validatedCustomer.customerName,
      customer_email: validatedCustomer.customerEmail,
      customer_phone: validatedCustomer.customerPhone,
    },
    order_meta: {
      return_url: returnUrl,
      ...(params.orderMeta?.notifyUrl ? { notify_url: params.orderMeta.notifyUrl } : {}),
    },
    order_note:
      params.orderNote || `LevUp Projects - ${params.projectTitle || "Academic Project Package"}`,
  };

  const response = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": "2023-08-01",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // S5: Redact raw provider diagnostic text
    logger.error(
      "payments",
      "order.gateway_error",
      "Cashfree order creation returned error status",
      {
        metadata: { httpStatus: response.status },
      },
    );
    throw new Error(`Cashfree order creation failed with status ${response.status}`);
  }

  const data = (await response.json()) as CashfreeOrderResponse;

  // Filter allowlisted response properties (S3)
  const safeResponse: CashfreeOrderResponse = {
    order_id: data.order_id,
    payment_session_id: data.payment_session_id,
    order_status: data.order_status,
    order_amount: data.order_amount,
    order_currency: data.order_currency,
  };

  if (params.idempotencyKey) {
    orderIdempotencyCache.set(params.idempotencyKey, safeResponse);
  }

  return safeResponse;
}

/**
 * Server-side order verification client.
 * Fetches the order status from Cashfree by order ID.
 */
export async function verifyCashfreeOrder(orderId: string): Promise<VerifyOrderResponse> {
  // 1. Enforce Server-Side Enablement Gate (S1)
  if (!isCashfreePaymentsEnabled()) {
    throw new Error(
      "Cashfree payments are currently disabled. Set CASHFREE_PAYMENTS_ENABLED=true in server configuration.",
    );
  }

  // 2. Validate Order ID format (S3)
  if (!orderId || !/^[A-Za-z0-9_-]{3,64}$/.test(orderId)) {
    throw new Error("Invalid order_id format");
  }

  const { appId, secretKey, env } = getCredentials();
  const baseUrl = getCashfreeBaseUrl(env);

  const response = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": "2023-08-01",
    },
  });

  if (!response.ok) {
    // S5: Redact raw provider diagnostic text
    logger.error("payments", "order.verify_error", "Cashfree order fetch returned error status", {
      metadata: { httpStatus: response.status, orderId },
    });
    throw new Error(`Cashfree order verification failed with status ${response.status}`);
  }

  const data = (await response.json()) as VerifyOrderResponse;

  // S3: Return explicitly allowlisted fields only
  const sanitized: VerifyOrderResponse = {
    order_id: data.order_id,
    order_status: data.order_status,
    order_amount: data.order_amount,
    order_currency: data.order_currency,
    created_at: data.created_at,
    payments: (data.payments || []).map((p) => ({
      payment_id: p.payment_id,
      payment_status: p.payment_status,
      payment_amount: p.payment_amount,
      payment_time: p.payment_time,
      payment_method: p.payment_method,
    })),
  };

  return sanitized;
}
