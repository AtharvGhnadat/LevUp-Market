/// <reference types="vite/client" />

declare module "@cashfreepayments/cashfree-js" {
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_modal" | "_self" | "_blank";
  }

  export interface CashfreeInstance {
    checkout(options: CashfreeCheckoutOptions): Promise<void>;
  }

  export interface CashfreeLoadOptions {
    mode: "sandbox" | "production";
  }

  export function load(options: CashfreeLoadOptions): Promise<CashfreeInstance>;
}
