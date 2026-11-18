import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  FileCode,
  Info,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/lib/format";
import { verifyPaymentStatus, type OrderVerificationResult } from "@/lib/cashfree";
import { to } from "@/lib/routes";

export function CheckoutReturnPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderVerificationResult | null>(null);
  const [error, setError] = useState("");
  const [downloadNotice, setDownloadNotice] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("order_id");

    if (!id) {
      setError("No order ID was found in the return URL.");
      setLoading(false);
      return;
    }

    setOrderId(id);

    async function loadStatus() {
      try {
        const result = await verifyPaymentStatus(id as string);
        setOrderData(result);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
  }, []);

  return (
    <div className="min-h-screen bg-mineral py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-xl">
          {loading ? (
            <div className="rounded-xl border border-line bg-white p-8 text-center shadow-card">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-volt-action border-t-transparent" />
              <h1 className="mt-4 font-display text-lg font-semibold text-alloy">
                Verifying Payment with Cashfree…
              </h1>
              <p className="mt-1 font-sans text-xs text-muted">
                Please wait while we confirm your transaction and unlock your deliverables.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <AlertCircle className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 font-display text-xl font-semibold text-alloy">
                Payment Verification Error
              </h1>
              <p className="mt-2 text-xs text-red-700">{error}</p>
              <div className="mt-6">
                <ButtonLink href={to("/checkout")} variant="primary" size="md">
                  Retry Checkout
                </ButtonLink>
              </div>
            </div>
          ) : orderData?.order_status === "PAID" ? (
            <div className="rounded-xl border border-line bg-white p-8 shadow-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-success">
                <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="mt-4 text-center">
                <span className="inline-block rounded-md bg-emerald-50 px-3 py-1 font-mono text-xs font-medium text-success">
                  Payment Verified · Cashfree Sandbox
                </span>
                <h1 className="mt-3 font-display text-2xl font-semibold text-alloy">
                  Order Confirmed
                </h1>
                <p className="mt-1 font-sans text-xs text-muted">
                  Your payment has been processed and your deliverables are now unlocked.
                </p>
              </div>

              {/* Transaction details card */}
              <div className="mt-6 space-y-2 rounded-lg border border-line bg-mineral/50 p-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Order ID</span>
                  <span className="font-mono font-medium text-alloy">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Amount Paid</span>
                  <span className="font-display font-semibold text-alloy tabular-nums">
                    {formatPrice(Math.round(orderData.order_amount * 100))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payment Status</span>
                  <span className="font-medium text-success">Paid · Confirmed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payment Gateway</span>
                  <span className="font-medium text-alloy">Cashfree PG India</span>
                </div>
              </div>

              {/* Unlocked Deliverables section */}
              <div className="mt-6 border-t border-line pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-alloy">
                    <FileCode className="h-4 w-4 text-volt-text" strokeWidth={1.75} />
                    <span>Unlocked Project Assets</span>
                  </h2>
                  <span className="font-mono text-[0.6875rem] font-medium text-muted">
                    Sandbox Preview
                  </span>
                </div>

                {downloadNotice && (
                  <div
                    className="mt-3 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-800"
                    role="status"
                  >
                    <Info className="h-4 w-4 shrink-0 text-blue-600" />
                    <span>{downloadNotice}</span>
                  </div>
                )}

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-line bg-white p-3 text-xs">
                    <div>
                      <p className="font-medium text-alloy">
                        Full Source Code &amp; Libraries (.zip)
                      </p>
                      <p className="text-[0.6875rem] text-muted">
                        Includes project source files and setup notes
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDownloadNotice(
                          "Sandbox Preview: Source code download simulated. Production fulfillment connects to verified repository releases.",
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-volt-action px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-volt-action-hover"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Download
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-line bg-white p-3 text-xs">
                    <div>
                      <p className="font-medium text-alloy">Technical Documentation (.pdf)</p>
                      <p className="text-[0.6875rem] text-muted">
                        Architecture notes and deliverable specifications
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDownloadNotice(
                          "Sandbox Preview: Technical documentation download simulated. Production fulfillment provides signed PDF delivery.",
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-alloy px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-alloy-soft"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={to("/projects")}
                  variant="primary"
                  size="md"
                  className="flex-1 justify-center"
                >
                  Explore More Projects
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </ButtonLink>
                <ButtonLink
                  href={to("/")}
                  variant="outline"
                  size="md"
                  className="flex-1 justify-center"
                >
                  Return to Home
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-white p-8 text-center shadow-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h1 className="mt-4 font-display text-xl font-semibold text-alloy">
                Payment Status: {orderData?.order_status || "Pending"}
              </h1>
              <p className="mt-1 font-sans text-xs text-muted">
                Order ID: <span className="font-mono font-medium text-alloy">{orderId}</span>
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Your transaction is currently awaiting confirmation from Cashfree. If you completed
                payment, it should update momentarily.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-alloy px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-alloy-soft"
                >
                  Refresh Status
                </button>
                <ButtonLink href={to("/checkout")} variant="primary" size="md">
                  Retry Checkout
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
