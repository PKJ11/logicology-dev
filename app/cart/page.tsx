"use client";

import { useCart } from "@/components/CartContext";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { useCallback, useState } from "react";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

  // Step 1: User and shipping info
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    building: "",
    street: "",
    landmark: "",
    pin: "",
    city: "",
    state: "",
    phone: "",
  });
  const [step, setStep] = useState(1);

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
      handler: async function (response:any) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // Save info to backend
        await fetch("/api/save-order-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userInfo,
            shipping,
            cart,
            paymentId: response.razorpay_payment_id,
            razorpayDesc: options.description,
            razorpayContact: response.razorpay_contact || userInfo.phone,
          }),
        });

        // Send invoice email to user
        const invoiceHtml = `
          <h2>Thank you for your purchase!</h2>
          <p>Payment ID: <b>${response.razorpay_payment_id}</b></p>
          <p>Description: ${options.description}</p>
          <h3>Shipping Information</h3>
          <p>Name: ${shipping.name}</p>
          <p>Address: ${shipping.address}, ${shipping.building}, ${shipping.street}, ${shipping.landmark}, ${shipping.pin}, ${shipping.city}, ${shipping.state}</p>
          <p>Phone: ${shipping.phone}</p>
          <h3>Order Details</h3>
          <ul>
            ${cart.map(item => `<li>${item.name} x${item.quantity} - ${item.price}</li>`).join("")}
          </ul>
          <p><b>Total Paid: ₹${total.toFixed(2)}</b></p>
        `;
        await fetch("/api/send-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: userInfo.email,
            subject: "Your Logicology Order Invoice",
            html: invoiceHtml,
          }),
        });
        // Optionally clear cart here
        // clearCart();
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      theme: { color: "#EB6A42" },
    };
    if (typeof window !== "undefined" && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay SDK not loaded");
    }
  }, [cart, total, userInfo, shipping]);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <NavBar/>
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {step === 1 ? (
          <form
            className="mb-8 grid grid-cols-1 gap-4"
            onSubmit={e => {
              e.preventDefault();
              setStep(2);
            }}
          >
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <input required type="text" placeholder="Name" value={userInfo.name} onChange={e => setUserInfo(u => ({ ...u, name: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="email" placeholder="Email" value={userInfo.email} onChange={e => setUserInfo(u => ({ ...u, email: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="tel" placeholder="Phone Number" value={userInfo.phone} onChange={e => setUserInfo(u => ({ ...u, phone: e.target.value }))} className="border rounded px-3 py-2" />
            <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Information</h2>
            <input required type="text" placeholder="Name" value={shipping.name} onChange={e => setShipping(s => ({ ...s, name: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="text" placeholder="Address" value={shipping.address} onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="text" placeholder="Building" value={shipping.building} onChange={e => setShipping(s => ({ ...s, building: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="text" placeholder="Street" value={shipping.street} onChange={e => setShipping(s => ({ ...s, street: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="text" placeholder="Landmark" value={shipping.landmark} onChange={e => setShipping(s => ({ ...s, landmark: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="text" placeholder="Pin" value={shipping.pin} onChange={e => setShipping(s => ({ ...s, pin: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="text" placeholder="City" value={shipping.city} onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="text" placeholder="State" value={shipping.state} onChange={e => setShipping(s => ({ ...s, state: e.target.value }))} className="border rounded px-3 py-2" />
            <input required type="tel" placeholder="Phone Number" value={shipping.phone} onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))} className="border rounded px-3 py-2" />
            <button type="submit" className="bg-[#EB6A42] text-white font-medium px-6 py-2 rounded-full hover:bg-[#d85b36] transition text-base mt-4">Continue to Payment</button>
          </form>
        ) : (
          cart.length === 0 ? (
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
          )
        )}
      </div>
    </>
  );
};

export default CartPage;
