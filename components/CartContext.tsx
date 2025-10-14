"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  function addToCart(product: Omit<CartProduct, "quantity">) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.name === product.name);
      if (idx > -1) {
        const newCart = [...prev];
        newCart[idx].quantity += 1;
        return newCart;
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  }

  function increaseQuantity(name: string) {
    setCart((prev) => prev.map((p) => (p.name === name ? { ...p, quantity: p.quantity + 1 } : p)));
  }

  function decreaseQuantity(name: string) {
    setCart((prev) =>
      prev.map((p) => (p.name === name ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))
    );
  }

  function removeFromCart(name: string) {
    setCart((prev) => prev.filter((p) => p.name !== name));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
