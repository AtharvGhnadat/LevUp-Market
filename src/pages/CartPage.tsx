import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/lib/format";
import { to } from "@/lib/routes";
import { useCart } from "@/state/cart";

export function CartPage() {
  const { items, remove } = useCart();

  const totalPaise = items.reduce((sum, item) => {
    return (
      sum + (item.configuration?.configurationTotal || item.configuration?.packagePrice || 249900)
    );
  }, 0);

  return (
    <div className="min-h-screen bg-mineral py-10 sm:py-14">
      <Container>
        <div className="flex items-center gap-2.5 pb-6 border-b border-line">
          <span className="h-0.5 w-6 bg-volt-action" aria-hidden="true" />
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-alloy">
            Your Shopping Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 rounded-xl border border-line bg-white p-12 text-center shadow-card max-w-lg mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mineral text-alloy">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-alloy">
              Your cart is currently empty
            </h2>
            <p className="mt-1.5 font-sans text-xs text-muted">
              Explore our project catalog to find ready-to-use academic solutions and packages.
            </p>
            <div className="mt-6">
              <ButtonLink href={to("/projects")} variant="primary" size="lg">
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-8">
              <div className="rounded-xl border border-line bg-white shadow-card divide-y divide-line/60 overflow-hidden">
                {items.map((item) => {
                  const itemPrice =
                    item.configuration?.configurationTotal ||
                    item.configuration?.packagePrice ||
                    249900;

                  return (
                    <div
                      key={item.slug}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row items-start justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <span className="inline-block rounded-full bg-mineral px-2.5 py-0.5 font-mono text-[0.6875rem] font-semibold text-alloy">
                          {item.configuration?.packageName || "Standard Package"}
                        </span>
                        <h2 className="font-display text-base font-bold text-alloy">
                          <a
                            href={to(`/projects/${item.slug}`)}
                            className="hover:text-volt-action transition-colors"
                          >
                            {item.title}
                          </a>
                        </h2>
                        <p className="font-sans text-xs text-muted">
                          Includes source code, circuit files, and direct verification support.
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0">
                        <span className="font-display text-base font-extrabold text-alloy tabular-nums">
                          {formatPrice(itemPrice)}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(item.slug)}
                          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary & Checkout Action */}
            <div className="lg:col-span-4">
              <div className="rounded-xl border border-line bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-alloy">Cart Summary</h2>

                <div className="mt-4 space-y-2 border-t border-line pt-4 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Selected Items</span>
                    <span className="font-medium text-alloy">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-medium text-alloy">{formatPrice(totalPaise)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Delivery</span>
                    <span className="font-medium text-success">Instant Digital Access</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-line/60 font-display text-base font-extrabold text-alloy">
                    <span>Total</span>
                    <span className="text-volt-action tabular-nums">{formatPrice(totalPaise)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <ButtonLink
                    href={to("/checkout")}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center font-bold"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
