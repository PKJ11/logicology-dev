"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";

export type CartProduct = {
  name: string;
  price: string;
  image: string;
  rating: number;
  quantity: number;
  razorpayItemId: string;
  description: string;
  initialprice?: string;
};

export type CartContextType = {
  cart: CartProduct[];
  addToCart: (product: Omit<CartProduct, "quantity">) => void;
  removeFromCart: (name: string) => void;
  clearCart: () => void;
  increaseQuantity: (name: string) => void;
  decreaseQuantity: (name: string) => void;
  // ── NEW ──
  enrichCartSession: (userInfo: { name: string; email: string; phone: string }) => void;
  getRzpDeviceId: () => string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// ─── rzp_device_id helpers ────────────────────────────────────────────────────

function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

function getFallbackId(): string {
  const key = "rzp_device_id_fallback";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `rzpfb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

function resolveDeviceId(): string {
  // Prefer the real Razorpay cookie (set when checkout.js loads)
  return getCookie("rzp_device_id") || getFallbackId();
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const deviceIdRef = useRef<string>("");

  useEffect(() => {
    // Resolve on mount (client only)
    deviceIdRef.current = resolveDeviceId();

    // Re-check after 3 s in case Razorpay SDK sets the real cookie after hydration
    const t = setTimeout(() => {
      const real = getCookie("rzp_device_id");
      if (real) deviceIdRef.current = real;
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  // ── Fire-and-forget tracker ───────────────────────────────────────────────
  const trackCart = useCallback(
    (
      action: "add" | "remove" | "increase" | "decrease" | "clear" | "enrich",
      nextCart: CartProduct[],
      changedItem?: Partial<CartProduct>,
      userInfo?: { name: string; email: string; phone: string }
    ) => {
      const rzpDeviceId = deviceIdRef.current;
      if (!rzpDeviceId) return;
      fetch("/api/track-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rzpDeviceId,
          cart: nextCart,
          action,
          changedItem: changedItem ?? null,
          userInfo: userInfo ?? null,
        }),
      }).catch((e) => console.error("track-cart:", e));
    },
    []
  );

  // ── Mutations (identical logic to original + tracking) ────────────────────

  function addToCart(product: Omit<CartProduct, "quantity">) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.name === product.name);
      let next: CartProduct[];
      if (idx > -1) {
        next = prev.map((p, i) => (i === idx ? { ...p, quantity: p.quantity + 1 } : p));
      } else {
        next = [...prev, { ...product, quantity: 1 }];
      }
      trackCart("add", next, { ...product, quantity: 1 });
      return next;
    });
  }

  function increaseQuantity(name: string) {
    setCart((prev) => {
      const next = prev.map((p) => (p.name === name ? { ...p, quantity: p.quantity + 1 } : p));
      trackCart("increase", next, next.find((p) => p.name === name));
      return next;
    });
  }

  function decreaseQuantity(name: string) {
    setCart((prev) => {
      const next = prev.map((p) =>
        p.name === name ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
      );
      trackCart("decrease", next, next.find((p) => p.name === name));
      return next;
    });
  }

  function removeFromCart(name: string) {
    setCart((prev) => {
      const removed = prev.find((p) => p.name === name);
      const next = prev.filter((p) => p.name !== name);
      trackCart("remove", next, removed);
      return next;
    });
  }

  function clearCart() {
    setCart([]);
    trackCart("clear", []);
  }

  /**
   * Call when user fills Step 1 of checkout (name / email / phone).
   * Links their identity to the rzpDeviceId record in MongoDB.
   */
  const enrichCartSession = useCallback(
    (userInfo: { name: string; email: string; phone: string }) => {
      setCart((current) => {
        trackCart("enrich", current, undefined, userInfo);
        return current; // no state mutation — just reading latest cart
      });
    },
    [trackCart]
  );

  const getRzpDeviceId = useCallback(() => deviceIdRef.current, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        enrichCartSession,
        getRzpDeviceId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}