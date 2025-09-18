"use client";
import { useEffect, useState } from "react";
import { getProducts, createCart, addToCart } from "@/lib/shopify";
import ProductsGrid from "@/components/ProductsGrid";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    getProducts().then((prods) => {
      setProducts(prods);
      setLoading(false);
    });
  }, []);

  async function handleAddToCart(variantId: string) {
    setAdding(variantId);
    let cartId = typeof window !== "undefined" ? localStorage.getItem("shopify_cart_id") : null;
    let cart;
    if (!cartId) {
      cart = await createCart(variantId, 1);
      if (typeof window !== "undefined") localStorage.setItem("shopify_cart_id", cart.id);
    } else {
      cart = await addToCart(cartId, variantId, 1);
    }
    setAdding(null);
    alert("Added to cart!");
  }

  if (loading) return <div className="centered-section">Loading products...</div>;

  return (
    <div className="">
      <NavBar />
      <ProductsGrid products={products} adding={adding} handleAddToCart={handleAddToCart} />
      <SiteFooter />
    </div>
  );
}
