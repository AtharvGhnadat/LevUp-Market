import fs from "node:fs";
import path from "node:path";

export type CashfreeEnvironment = "sandbox" | "production";

export type CreateOrderParams = {
  orderAmount: number; // In Rupees (e.g. 2499.00)
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
};

export type CashfreeOrderResponse = {
  order_id: string;
  payment_session_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED";
  order_amount: number;
  order_currency: string;
  customer_details?: {
    customer_id: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  };
};

export type VerifyOrderResponse = {
  order_id: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED" | "FAILED";
  order_amount: number;
  order_currency: string;
  created_at?: string;
  order_meta?: {
    return_url?: string;
  };
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

function normalizeEnvValue(raw: string | undefined): string {
  if (!raw) return "";
  return raw.trim().replace(/^["']|["']$/g, "");
}

function getCredentials() {
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
 * Server-side order creation client.
 * Calls Cashfree PG API v2023-08-01 using merchant credentials.
 */
export async function createCashfreeOrder(
  params: CreateOrderParams,
): Promise<CashfreeOrderResponse> {
  const { appId, secretKey, env } = getCredentials();
  const baseUrl = getCashfreeBaseUrl(env);

  const orderId = `LP_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const returnUrl =
    params.orderMeta?.returnUrl || `http://localhost:8443/checkout/return?order_id={order_id}`;

  const payload = {
    order_id: orderId,
    order_amount: Math.round(params.orderAmount * 100) / 100,
    order_currency: "INR",
    customer_details: {
      customer_id: params.customerDetails.customerId,
      customer_name: params.customerDetails.customerName,
      customer_email: params.customerDetails.customerEmail,
      customer_phone: params.customerDetails.customerPhone,
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
    const errorBody = await response.text();
    let errorJson;
    try {
      errorJson = JSON.parse(errorBody);
    } catch {
      // ignore
    }
    throw new Error(
      `Cashfree order creation failed [${response.status}]: ${errorJson?.message || errorBody}`,
    );
  }

  const data = (await response.json()) as CashfreeOrderResponse;
  return data;
}

/**
 * Server-side order verification client.
 * Fetches the order status from Cashfree by order ID.
 */
export async function verifyCashfreeOrder(orderId: string): Promise<VerifyOrderResponse> {
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
    const errorBody = await response.text();
    throw new Error(`Cashfree order fetch failed [${response.status}]: ${errorBody}`);
  }

  const data = (await response.json()) as VerifyOrderResponse;
  return data;
}
