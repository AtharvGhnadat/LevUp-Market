import { useState } from "react";
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/lib/format";
import { launchCashfreeCheckout } from "@/lib/cashfree";
import { to } from "@/lib/routes";
import { useCart } from "@/state/cart";

export function CheckoutPage() {
  const { items } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Determine total amount from cart or default sample project if cart is empty
  const cartTotalPaise = items.reduce((sum, item) => {
    return (
      sum + (item.configuration?.configurationTotal || item.configuration?.packagePrice || 249900)
    );
  }, 0);

  // If cart is empty, provide a default academic item for checkout testing
  const checkoutItems =
    items.length > 0
      ? items
      : [
          {
            slug: "autonomous-obstacle-avoidance-rover",
            title: "Autonomous Obstacle Avoidance Robot",
            configuration: {
              packageName: "Standard",
              packagePrice: 249900,
              configurationTotal: 249900,
            },
            addedAt: new Date().toISOString(),
          },
        ];

  const totalPaise = items.length > 0 ? cartTotalPaise : 249900;
  const totalRupees = totalPaise / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMessage("Please fill in your name, email address, and phone number.");
      return;
    }

    // Basic Indian phone validation
    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number for payment confirmation.");
      return;
    }

    setIsSubmitting(true);

    try {
      const primaryProject = checkoutItems[0];
      await launchCashfreeCheckout({
        orderAmount: totalRupees,
        customerDetails: {
          customerId: `cust_${cleanPhone.slice(-6)}_${Date.now().toString().slice(-4)}`,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: cleanPhone.slice(-10),
        },
        projectSlug: primaryProject.slug,
        projectTitle: primaryProject.title,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mineral py-8 sm:py-12">
      <Container>
        {/* Navigation Breadcrumb & Security Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
          <a
            href={to("/cart")}
            className="inline-flex items-center gap-2 text-xs font-semibold text-alloy hover:text-volt-action transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Cart</span>
          </a>
          <div className="flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-semibold text-alloy shadow-xs">
            <Lock className="h-3.5 w-3.5 text-volt-action" />
            <span>Cashfree 256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Customer Form & Payment Trigger */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
              <h1 className="font-display text-2xl font-extrabold text-alloy">
                Academic Project Checkout
              </h1>
              <p className="mt-1 font-sans text-xs text-muted">
                Complete your details below to proceed with secure Cashfree payment.
              </p>

              {errorMessage && (
                <div
                  role="alert"
                  className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-xs font-bold text-alloy">
                    Full Name <span className="text-volt-action">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Atharv Ghanadat"
                    className="mt-1.5 w-full rounded-md border border-line bg-mineral/30 px-3.5 py-2.5 font-sans text-sm text-alloy transition-colors focus:border-volt-action focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="customerEmail" className="block text-xs font-bold text-alloy">
                      Email Address <span className="text-volt-action">*</span>
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="mt-1.5 w-full rounded-md border border-line bg-mineral/30 px-3.5 py-2.5 font-sans text-sm text-alloy transition-colors focus:border-volt-action focus:bg-white focus:outline-none"
                    />
                    <p className="mt-1 text-[0.6875rem] text-muted">
                      Source code and access credentials delivered here.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="customerPhone" className="block text-xs font-bold text-alloy">
                      Phone Number <span className="text-volt-action">*</span>
                    </label>
                    <input
                      type="tel"
                      id="customerPhone"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="9876543210"
                      className="mt-1.5 w-full rounded-md border border-line bg-mineral/30 px-3.5 py-2.5 font-sans text-sm text-alloy transition-colors focus:border-volt-action focus:bg-white focus:outline-none"
                    />
                    <p className="mt-1 text-[0.6875rem] text-muted">
                      Required for Cashfree UPI and OTP validation.
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="collegeName" className="block text-xs font-bold text-alloy">
                    College / University (Optional)
                  </label>
                  <input
                    type="text"
                    id="collegeName"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Pune Institute of Computer Technology"
                    className="mt-1.5 w-full rounded-md border border-line bg-mineral/30 px-3.5 py-2.5 font-sans text-sm text-alloy transition-colors focus:border-volt-action focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Cashfree Payment Gateway Box */}
                <div className="mt-6 rounded-lg border border-line/80 bg-mineral/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-alloy">Payment Gateway:</span>
                    <span className="inline-flex items-center gap-1 rounded bg-[#F9ECE5] px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-volt-action">
                      Cashfree Sandbox Testing
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded border border-line bg-white px-2 py-1 font-medium text-alloy">
                      UPI (GPay / PhonePe / Paytm)
                    </span>
                    <span className="rounded border border-line bg-white px-2 py-1 font-medium text-alloy">
                      Debit / Credit Cards
                    </span>
                    <span className="rounded border border-line bg-white px-2 py-1 font-medium text-alloy">
                      Net Banking
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full justify-center font-bold text-sm shadow-md"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Connecting to Cashfree Gateway...
                      </span>
                    ) : (
                      `Pay ${formatPrice(totalPaise)} via Cashfree`
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary & Inclusions */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-lg font-bold text-alloy">Order Summary</h2>

              <ul className="mt-4 divide-y divide-line/60">
                {checkoutItems.map((item) => (
                  <li key={item.slug} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-sm font-bold text-alloy">{item.title}</h3>
                        <span className="mt-0.5 inline-block rounded bg-mineral px-2 py-0.5 font-mono text-[0.6875rem] text-muted">
                          {item.configuration?.packageName || "Standard Package"}
                        </span>
                      </div>
                      <span className="font-display text-sm font-extrabold text-alloy tabular-nums">
                        {formatPrice(
                          item.configuration?.configurationTotal ||
                            item.configuration?.packagePrice ||
                            249900,
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 border-t border-line pt-4 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-alloy">{formatPrice(totalPaise)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Digital Delivery &amp; Setup</span>
                  <span className="font-medium text-success">Free (Included)</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Platform Gateway Fee</span>
                  <span className="font-medium text-success">₹0.00</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-line/60 font-display text-base font-extrabold text-alloy">
                  <span>Total Amount</span>
                  <span className="text-volt-action tabular-nums">{formatPrice(totalPaise)}</span>
                </div>
              </div>

              {/* Verified Deliverables checklist */}
              <div className="mt-6 rounded-lg bg-mineral/40 p-4 border border-line">
                <h4 className="flex items-center gap-1.5 text-xs font-bold text-alloy">
                  <Sparkles className="h-3.5 w-3.5 text-volt-action" />
                  <span>Package Inclusions:</span>
                </h4>
                <ul className="mt-2.5 space-y-2 text-xs text-muted">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Complete Uncompiled Source Files</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Circuit Diagrams &amp; BoM List</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Step-by-Step Execution Guide</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Direct Technical Support &amp; Revisions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
