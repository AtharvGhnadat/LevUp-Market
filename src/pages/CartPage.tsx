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
        <div className="border-b border-line pb-6">
          <h1 className="font-display text-2xl font-semibold tracking-[-0.015em] text-alloy sm:text-3xl">
            Your Shopping Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto mt-12 max-w-lg rounded-xl border border-line bg-white p-12 text-center shadow-card">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-mineral text-muted">
              <ShoppingCart className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-alloy">
              Your cart is currently empty
            </h2>
            <p className="mt-1.5 font-sans text-xs text-muted">
              Explore our project catalog to find ready-to-use academic solutions and packages.
            </p>
            <div className="mt-6">
              <ButtonLink href={to("/projects")} variant="primary" size="lg">
                Explore Projects
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-8">
              <div className="divide-y divide-line/60 overflow-hidden rounded-xl border border-line bg-white shadow-card">
                {items.map((item) => {
                  const itemPrice =
                    item.configuration?.configurationTotal ||
                    item.configuration?.packagePrice ||
                    249900;

                  return (
                    <div
                      key={item.slug}
                      className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:p-6"
                    >
                      <div className="flex-1 space-y-1">
                        <span className="inline-block rounded-md bg-mineral px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium text-alloy">
                          {item.configuration?.packageName || "Standard Package"}
                        </span>
                        <h2 className="font-display text-base font-semibold text-alloy">
                          <a
                            href={to(`/projects/${item.slug}`)}
                            className="transition-colors duration-150 hover:text-volt-text"
                          >
                            {item.title}
                          </a>
                        </h2>
                        <p className="font-sans text-xs text-muted">
                          Deliverables, documentation, and support scope follow the selected
                          package.
                        </p>
                      </div>

                      <div className="flex w-full items-center justify-between gap-3 pt-2 sm:w-auto sm:flex-col sm:items-end sm:pt-0">
                        <span className="font-display text-base font-semibold text-alloy tabular-nums">
                          {formatPrice(itemPrice)}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(item.slug)}
                          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors duration-150 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
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
                <h2 className="font-display text-lg font-semibold text-alloy">Cart Summary</h2>

                <div className="mt-4 space-y-2 border-t border-line pt-4 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Selected Items</span>
                    <span className="font-medium text-alloy tabular-nums">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="font-medium text-alloy tabular-nums">
                      {formatPrice(totalPaise)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Delivery</span>
                    <span className="font-medium text-alloy">Per project delivery mode</span>
                  </div>
                  <div className="flex justify-between border-t border-line/60 pt-2 font-display text-base font-semibold text-alloy">
                    <span>Total</span>
                    <span className="text-volt-text tabular-nums">{formatPrice(totalPaise)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <ButtonLink
                    href={to("/checkout")}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
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
