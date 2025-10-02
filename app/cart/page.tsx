"use client";

import { useCart } from "@/components/CartContext";
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { useCallback, useState, useEffect } from "react";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();

  // Modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Step 1: User and shipping info with localStorage
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
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  // Load saved addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedAddresses");
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }

    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  // Razorpay key
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk";

  // Save address to localStorage
  const saveAddressToLocalStorage = () => {
    const newAddress = {
      id: Date.now().toString(),
      ...shipping,
      ...userInfo,
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  // Load selected address
  const loadSelectedAddress = (addressId: string) => {
    const address = savedAddresses.find((addr) => addr.id === addressId);
    if (address) {
      setUserInfo({
        name: address.name || "",
        email: address.email || "",
        phone: address.phone || "",
      });
      setShipping({
        name: address.name || "",
        address: address.address || "",
        building: address.building || "",
        street: address.street || "",
        landmark: address.landmark || "",
        pin: address.pin || "",
        city: address.city || "",
        state: address.state || "",
        phone: address.phone || "",
      });
    }
  };

  // Handle checkout with Razorpay
  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) return;

    // Save address if this is a new one
    if (!selectedAddress) {
      saveAddressToLocalStorage();
    }

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
      description: cart.map((i) => `${i.name} x${i.quantity}`).join(", "),
      order_id: order.id,
      handler: async function (response: any) {
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

        // Prepare invoice line items for Razorpay
        const line_items = cart.map((item) => ({
          name: item.name,
          amount: Math.round(parseFloat(item.price.replace(/[^\d.]/g, "")) * 100),
          currency: "INR",
          quantity: item.quantity,
        }));

        // Create Razorpay invoice
        const invoiceRes = await fetch("/api/razorpay-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: options.description,
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            billing_address: shipping.address,
            shipping_address: shipping.address,
            line_items,
            currency: "INR",
            amount: Math.round(total * 100),
            receipt: `cart_${Date.now()}`,
            sms_notify: 1,
            email_notify: 1,
            notes: {},
          }),
        });
        const invoiceData = await invoiceRes.json();
        let invoiceUrl = "";
        let invoiceId = "";
        if (invoiceData.invoice) {
          invoiceId = invoiceData.invoice.id;
          // Issue the invoice
          const issueRes = await fetch("/api/razorpay-invoice", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoice_id: invoiceId }),
          });
          const issueData = await issueRes.json();
          invoiceUrl = invoiceData.invoice.short_url || "";
        }

        // Send invoice email to user (with Razorpay invoice link)
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
            ${cart.map((item) => `<li>${item.name} x${item.quantity} - ${item.price}</li>`).join("")}
          </ul>
          <p><b>Total Paid: ₹${total.toFixed(2)}</b></p>
          ${invoiceUrl ? `<p><a href='${invoiceUrl}' target='_blank'>View Official Razorpay Invoice</a></p>` : ""}
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

        // Clear cart and show success message
        clearCart();
        setIsCheckoutModalOpen(false);
        setStep(1);
        setSelectedAddress("");
        setTimeout(() => {
          alert(
            `Payment successful!\n\nYour Payment ID: ${response.razorpay_payment_id}\n\nIf you have any questions, send us a WhatsApp on 8446980747 mentioning your payment ID and date of purchase.${invoiceUrl ? `\n\nView your official invoice: ${invoiceUrl}` : ""}`
          );
        }, 300);
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
  }, [cart, total, userInfo, shipping, selectedAddress]);

  const openCheckoutModal = () => {
    setIsCheckoutModalOpen(true);
    setStep(1);
    setSelectedAddress("");
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setStep(1);
    setSelectedAddress("");
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {step === 1
                    ? "Contact Information"
                    : step === 2
                      ? "Shipping Address"
                      : "Review Order"}
                </h2>
                <button
                  onClick={closeCheckoutModal}
                  className="text-2xl text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Step 1: Contact Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Contact Information</h3>
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo((u) => ({ ...u, name: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo((u) => ({ ...u, email: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {/* <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo((u) => ({ ...u, phone: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    /> */}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600"
                  >
                    Continue to Address
                  </button>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Saved Addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Select Saved Address</h3>
                      {savedAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`cursor-pointer rounded-lg border p-4 transition-all ${
                            selectedAddress === address.id
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedAddress(address.id);
                            loadSelectedAddress(address.id);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{address.name}</p>
                              <p className="mt-1 text-sm text-gray-600">
                                {address.address}, {address.building}, {address.street}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} - {address.pin}
                              </p>
                              <p className="mt-1 text-sm text-gray-600">{address.phone}</p>
                            </div>
                            {selectedAddress === address.id && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="text-center">
                        <button
                          onClick={() => setSelectedAddress("")}
                          className="text-sm font-medium text-orange-500 hover:text-orange-600"
                        >
                          + Add New Address
                        </button>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="mb-3 font-semibold text-gray-900">Or Enter New Address</h3>
                      </div>
                    </div>
                  )}

                  {/* Shipping Information Form */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      {savedAddresses.length > 0 ? "New Shipping Address" : "Shipping Address"}
                    </h3>
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      value={shipping.name}
                      onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      required
                      type="text"
                      placeholder="Address"
                      value={shipping.address}
                      onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        placeholder="Building"
                        value={shipping.building}
                        onChange={(e) => setShipping((s) => ({ ...s, building: e.target.value }))}
                        className="rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        required
                        type="text"
                        placeholder="Street"
                        value={shipping.street}
                        onChange={(e) => setShipping((s) => ({ ...s, street: e.target.value }))}
                        className="rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="Landmark"
                      value={shipping.landmark}
                      onChange={(e) => setShipping((s) => ({ ...s, landmark: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        placeholder="PIN Code"
                        value={shipping.pin}
                        onChange={(e) => setShipping((s) => ({ ...s, pin: e.target.value }))}
                        className="rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <input
                        required
                        type="text"
                        placeholder="City"
                        value={shipping.city}
                        onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                        className="rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="State"
                      value={shipping.state}
                      onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Shipping Phone Number"
                      value={shipping.phone}
                      onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-xl border border-gray-300 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">Order Summary</h3>
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.price} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ₹
                            {(
                              parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Preview */}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="mb-2 font-semibold text-gray-900">Contact Information</h3>
                    <p className="font-medium text-gray-900">{userInfo.name}</p>
                    <p className="mt-1 text-sm text-gray-600">{userInfo.email}</p>
                    <p className="text-sm text-gray-600">{userInfo.phone}</p>
                  </div>

                  {/* Shipping Info Preview */}
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="mb-2 font-semibold text-gray-900">Shipping to</h3>
                    <p className="font-medium text-gray-900">{shipping.name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {shipping.address}, {shipping.building}, {shipping.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {shipping.landmark && `${shipping.landmark}, `}
                      {shipping.city}, {shipping.state} - {shipping.pin}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">{shipping.phone}</p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-xl border border-gray-300 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600"
                    >
                      Pay ₹{total.toFixed(2)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Cart Page */}
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              {cart.length > 0 && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl text-gray-400">🛒</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">Your cart is empty</h3>
                <p className="text-gray-600">Add some items to get started!</p>
              </div>
            ) : (
              <>
                <div className="mb-8 space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center space-x-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-900">{item.name}</h3>
                        <p className="mt-1 font-medium text-orange-600">{item.price}</p>
                        <div className="mt-2 flex items-center space-x-3">
                          <div className="flex items-center rounded-lg border border-gray-300">
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-l-lg text-gray-600 transition-colors hover:bg-gray-200"
                              onClick={() => decreaseQuantity(item.name)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              className="flex h-8 w-8 items-center justify-center rounded-r-lg text-gray-600 transition-colors hover:bg-gray-200"
                              onClick={() => increaseQuantity(item.name)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹
                          {(parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Total amount</p>
                    </div>
                    <button
                      onClick={clearCart}
                      className="font-medium text-gray-600 transition-colors hover:text-gray-800"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <button
                    onClick={openCheckoutModal}
                    className="w-full rounded-xl bg-orange-500 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
};

export default CartPage;
