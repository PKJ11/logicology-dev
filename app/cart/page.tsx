"use client";

import { useCart } from "@/components/CartContext";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { useCallback } from "react";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  // Razorpay key
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_RM7EaWFSnW9Fod";

  // Handle checkout with Razorpay
  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) return;
    // Amount in paise
    const amount = Math.round(total);
    const res = await fetch("/api/razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `cart_${Date.now()}`,
      }),
    });
    const { order } = await res.json();
    if (!order) {
      alert("Failed to create order. Please try again.");
      return;
    }
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Logicology",
      description: cart.map(i => `${i.name} x${i.quantity}`).join(", "),
      order_id: order.id,
      handler: function (response:any) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // Optionally clear cart here
        // clearCart();
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: { color: "#EB6A42" },
    };
    if (typeof window !== "undefined" && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay SDK not loaded");
    }
  }, [cart, total]);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <NavBar/>
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200 mb-6">
              {cart.map((item) => (
                <li key={item.name} className="flex items-center py-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      {item.price} x
                      <button
                        className="bg-gray-200 px-2 rounded-l text-lg"
                        onClick={() => decreaseQuantity(item.name)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold">{item.quantity}</span>
                      <button
                        className="bg-gray-200 px-2 rounded-r text-lg"
                        onClick={() => increaseQuantity(item.name)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="ml-4 text-red-500 hover:underline text-sm"
                    onClick={() => removeFromCart(item.name)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-lg">Total: ₹{total.toFixed(2)}</div>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-[#EB6A42] text-white font-medium px-6 py-2 rounded-full hover:bg-[#d85b36] transition text-base"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
