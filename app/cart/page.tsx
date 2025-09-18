"use client";
import { useEffect, useMemo, useState } from "react";
import { getCart, updateCartItem, removeFromCart, applyDiscountCode } from "@/lib/shopify";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [discountSuccess, setDiscountSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cartId =
        typeof window !== "undefined"
          ? localStorage.getItem("shopify_cart_id")
          : null;
      if (cartId) {
        const cartData = await getCart(cartId);
        setCart(cartData);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItem(lineId);
    try {
      const cartId = localStorage.getItem("shopify_cart_id");
      if (!cartId) throw new Error("No cart found");

      const updatedCart = await updateCartItem(cartId, lineId, newQuantity);
      setCart(updatedCart);
      // Clear any existing discount messages when quantity changes
      setDiscountError(null);
      setDiscountSuccess(null);
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    setRemovingItem(lineId);
    try {
      const cartId = localStorage.getItem("shopify_cart_id");
      if (!cartId) throw new Error("No cart found");

      const updatedCart = await removeFromCart(cartId, lineId);
      setCart(updatedCart);
      
      // If cart is empty after removal, clear local storage
      if (!updatedCart.lines.edges.length) {
        localStorage.removeItem("shopify_cart_id");
      }
      // Clear any existing discount messages when items are removed
      setDiscountError(null);
      setDiscountSuccess(null);
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Failed to remove item. Please try again.");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setApplyingDiscount(true);
    setDiscountError(null);
    setDiscountSuccess(null);

    try {
      const cartId = localStorage.getItem("shopify_cart_id");
      if (!cartId) throw new Error("No cart found");

      const updatedCart = await applyDiscountCode(cartId, discountCode.trim());
      setCart(updatedCart);
      setDiscountSuccess("Discount code applied successfully!");
      setDiscountCode("");
    } catch (err: any) {
      console.error("Error applying discount:", err);
      setDiscountError(err.message || "Failed to apply discount code. Please check the code and try again.");
    } finally {
      setApplyingDiscount(false);
    }
  };

  // Money helper
  const money = (n?: number | string, currency = "USD") =>
    `${Number(n ?? 0).toFixed(2)} ${currency}`;

  // Calculate order summary with discounts
  const orderSummary = useMemo(() => {
    if (!cart || !cart.lines?.edges?.length) return null;

    const currency =
      cart.lines.edges[0]?.node?.merchandise?.price?.currencyCode || "USD";

    const subtotal = cart.lines.edges.reduce((total: number, edge: any) => {
      const item = edge.node;
      const price = parseFloat(item.merchandise.price.amount);
      return total + price * item.quantity;
    }, 0);

    // Check if there are any discount allocations
    const discountAllocations = cart.discountAllocations || [];
    const totalDiscount = discountAllocations.reduce((total: number, discount: any) => {
      return total + parseFloat(discount.allocatedAmount.amount);
    }, 0);

    const shipping = subtotal > 50 ? 0 : 4.99;
    const tax = (subtotal - totalDiscount) * 0.08; // Tax on discounted amount
    const total = subtotal - totalDiscount + shipping + tax;

    return { 
      subtotal, 
      shipping, 
      tax, 
      total, 
      totalDiscount,
      currency,
      hasDiscount: totalDiscount > 0
    };
  }, [cart]);

  const skeletons = useMemo(() => Array.from({ length: 3 }), []);

  if (loading) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen w-full bg-brand-hero">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Header />
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                {skeletons.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-4xl border border-black/5 bg-white p-6 shadow-soft"
                  >
                    <div className="animate-pulse flex items-center gap-4">
                      <div className="h-24 w-24 rounded-2xl bg-gray-200" />
                      <div className="flex-1">
                        <div className="h-5 w-1/2 bg-gray-200 rounded" />
                        <div className="mt-2 h-4 w-3/4 bg-gray-200 rounded" />
                        <div className="mt-4 h-4 w-24 bg-gray-200 rounded" />
                      </div>
                      <div className="h-6 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-4xl border border-black/5 bg-white p-6 shadow-soft h-fit sticky top-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-5 w-1/3 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-10 w-full bg-gray-200 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen w-full bg-brand-hero">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <Header />
            <p className="mt-6 text-red-600 font-medium">{error}</p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!cart || !cart.lines?.edges?.length) {
    return (
      <>
        <NavBar />
        <main className="min-h-screen w-full bg-brand-hero">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
            <Header />
            <div className="mt-8 rounded-4xl border border-dashed border-brand-teal/30 bg-white p-12 shadow-soft">
              <h3 className="font-heading text-2xl text-brand-tealDark">
                Your cart is empty
              </h3>
              <p className="mt-2 text-gray-600">
                Explore our products and add your favorites to the cart.
              </p>
              <a
                href="/products"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-brand-gold px-6 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(216,174,79,0.35)] transition hover:-translate-y-0.5 hover:bg-brand-gold/90"
              >
                Browse Products
              </a>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full bg-brand-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <Header count={cart.lines.edges.length} />

          <div className="grid gap-8 md:grid-cols-3">
            {/* Cart Items */}
            <section className="md:col-span-2 space-y-6">
              {cart.lines.edges.map((edge: any) => {
                const item = edge.node;
                const merch = item.merchandise;
                const unit = parseFloat(merch.price.amount);
                const line = unit * item.quantity;
                const currency = merch.price.currencyCode;
                const isUpdating = updatingItem === item.id;
                const isRemoving = removingItem === item.id;

                return (
                  <article
                    key={item.id}
                    className="
                    relative overflow-hidden rounded-4xl bg-white border border-black/5
                    shadow-soft transition-shadow hover:shadow-brand
                  "
                  >
                    {/* Accent bar */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-teal via-brand-coral to-brand-gold opacity-90" />
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Image */}
                        <div className="shrink-0">
                          {merch.image ? (
                            <div className="h-24 w-24 rounded-2xl bg-brand-grayBg overflow-hidden grid place-items-center">
                              <img
                                src={merch.image.url}
                                alt={merch.image.altText || merch.product.title}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="h-24 w-24 rounded-2xl bg-brand-grayBg grid place-items-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-lg font-semibold text-gray-900 line-clamp-2">
                            {merch.product.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {merch.title}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-xl">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={isUpdating || item.quantity <= 1}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-xl"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 font-medium min-w-[2rem] text-center">
                                {isUpdating ? "..." : item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={isUpdating}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-xl"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-gray-500">·</span>

                            <span className="text-gray-700">
                              {money(unit, currency)} each
                            </span>
                          </div>
                        </div>

                        {/* Price and Remove Button */}
                        <div className="text-right sm:pl-4 space-y-2">
                          <p className="text-sm text-gray-500">Line total</p>
                          <p className="font-heading text-xl font-bold text-brand-tealDark">
                            {money(line, currency)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isRemoving}
                            className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isRemoving ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {/* Order Summary */}
            <aside className="md:col-span-1">
              <div className="sticky top-8 rounded-4xl border border-black/5 bg-white p-6 shadow-soft">
                <h2 className="font-heading text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <Row
                    label="Subtotal"
                    value={money(
                      orderSummary?.subtotal,
                      orderSummary?.currency
                    )}
                  />
                  
                  {/* Discount Display */}
                  {orderSummary?.hasDiscount && (
                    <Row
                      label="Discount"
                      value={
                        <span className="text-green-600">
                          -{money(orderSummary?.totalDiscount, orderSummary?.currency)}
                        </span>
                      }
                    />
                  )}
                  
                  <Row
                    label="Shipping"
                    value={
                      orderSummary?.shipping === 0
                        ? "Free"
                        : money(orderSummary?.shipping, orderSummary?.currency)
                    }
                  />
                  <Row
                    label="Tax"
                    value={money(orderSummary?.tax, orderSummary?.currency)}
                  />
                  <hr className="my-2" />
                  <Row
                    label={<span className="font-bold">Total</span>}
                    value={
                      <span className="font-bold text-brand-gold">
                        {money(orderSummary?.total, orderSummary?.currency)}
                      </span>
                    }
                  />
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label
                    htmlFor="promo-code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Discount Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo-code"
                      type="text"
                      placeholder="Enter code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      disabled={applyingDiscount || !discountCode.trim()}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applyingDiscount ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  
                  {/* Discount Messages */}
                  {discountError && (
                    <p className="mt-2 text-sm text-red-600">{discountError}</p>
                  )}
                  {discountSuccess && (
                    <p className="mt-2 text-sm text-green-600">{discountSuccess}</p>
                  )}
                </div>

                {/* Actions */}
                <a
                  href={cart.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  block w-full rounded-2xl bg-brand-gold px-6 py-3 text-center font-semibold text-white
                  shadow-[0_10px_24px_rgba(216,174,79,0.35)]
                  transition hover:-translate-y-0.5 hover:bg-brand-gold/90
                "
                >
                  Proceed to Checkout
                </a>
                <a
                  href="/products"
                  className="mt-3 block w-full rounded-2xl border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Continue Shopping
                </a>

                {/* Trust */}
                <div className="mt-6 text-center">
                  <div className="mx-auto mb-1 flex items-center justify-center gap-2 text-green-600">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your payment information is encrypted.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/* ---------- Local UI bits ---------- */

function Header({ count }: { count?: number }) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-wider text-brand-teal/70">
        {count ? `Cart · ${count} item${count > 1 ? "s" : ""}` : "Cart"}
      </p>
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-tealDark">
        Your Shopping Cart
      </h1>
      <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-600">
        Review your items, then proceed to checkout. You can return to shopping
        anytime.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}