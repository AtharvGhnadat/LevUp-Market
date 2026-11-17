import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

/**
 * Client-side cart foundation. Stores configuration snapshots in this browser only.
 * The PRD's server-validated cart, pricing and checkout replace this when the
 * commerce backend is connected — nothing here creates an order or takes payment.
 */
export type CartConfiguration = {
  packageId?: string;
  packageName?: string;
  selectedAddOnIds?: string[];
  quotedAddOnIds?: string[];
  packagePrice?: number;
  paidAddOnsTotal?: number;
  configurationTotal?: number;
};

export type CartItem = {
  slug: string;
  title: string;
  configuration?: CartConfiguration;
  addedAt: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  has: (slug: string) => boolean;
  add: (slug: string, title: string, configuration?: CartConfiguration) => void;
  remove: (slug: string) => void;
};

const STORAGE_KEY = "levup-cart-preview";
const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((value): CartItem[] => {
      // Migrate the original slug-only preview cart without dropping selections.
      if (typeof value === "string") {
        return [{ slug: value, title: value, addedAt: new Date(0).toISOString() }];
      }
      if (value && typeof value === "object" && "slug" in value && typeof value.slug === "string") {
        return [value as CartItem];
      }
      return [];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStored);
  const [notice, setNotice] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable: cart stays in memory */
    }
  }, [items]);

  const announce = useCallback((message: string) => {
    setNotice(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(""), 4500);
  }, []);

  const add = useCallback(
    (slug: string, title: string, configuration?: CartConfiguration) => {
      const snapshot: CartItem = {
        slug,
        title,
        configuration,
        addedAt: new Date().toISOString(),
      };
      setItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.slug === slug);
        const next =
          existingIndex === -1
            ? [...prev, snapshot]
            : prev.map((item, index) => (index === existingIndex ? snapshot : item));
        try {
          // Purchase links may navigate immediately; persist before the next document loads.
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* storage unavailable: cart remains in memory */
        }
        return next;
      });
      announce(
        configuration
          ? `${title} (${configuration.packageName}) configuration saved to your cart. Checkout is not available yet.`
          : `${title} added to your cart. Checkout is not available yet.`,
      );
    },
    [announce],
  );

  const remove = useCallback(
    (slug: string) => setItems((prev) => prev.filter((item) => item.slug !== slug)),
    [],
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      has: (slug: string) => items.some((item) => item.slug === slug),
      add,
      remove,
    }),
    [items, add, remove],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={
          notice
            ? "fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-md bg-ink px-4 py-3 text-sm text-white shadow-panel sm:inset-x-auto sm:right-6 sm:bottom-6"
            : "sr-only"
        }
      >
        {notice}
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
