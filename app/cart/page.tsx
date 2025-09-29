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
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_RM7EaWFSnW9Fod";

  // Save address to localStorage
  const saveAddressToLocalStorage = () => {
    const newAddress = {
      id: Date.now().toString(),
      ...shipping,
      ...userInfo
    };
    
    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  // Load selected address
  const loadSelectedAddress = (addressId: string) => {
    const address = savedAddresses.find(addr => addr.id === addressId);
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
        
        // Close modal and reset
        setIsCheckoutModalOpen(false);
        setStep(1);
        setSelectedAddress("");
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {step === 1 ? "Contact Information" : step === 2 ? "Shipping Address" : "Review Order"}
        </h2>
        <button
          onClick={closeCheckoutModal}
          className="text-gray-400 hover:text-gray-600 text-2xl"
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
              onChange={e => setUserInfo(u => ({ ...u, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              required
              type="email"
              placeholder="Email Address"
              value={userInfo.email}
              onChange={e => setUserInfo(u => ({ ...u, email: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              required
              type="tel"
              placeholder="Phone Number"
              value={userInfo.phone}
              onChange={e => setUserInfo(u => ({ ...u, phone: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-orange-500 text-white font-semibold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
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
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
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
                      <p className="text-sm text-gray-600 mt-1">
                        {address.address}, {address.building}, {address.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} - {address.pin}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                    </div>
                    {selectedAddress === address.id && (
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="text-center">
                <button
                  onClick={() => setSelectedAddress("")}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  + Add New Address
                </button>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Or Enter New Address</h3>
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
              onChange={e => setShipping(s => ({ ...s, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              required
              type="text"
              placeholder="Address"
              value={shipping.address}
              onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                placeholder="Building"
                value={shipping.building}
                onChange={e => setShipping(s => ({ ...s, building: e.target.value }))}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                required
                type="text"
                placeholder="Street"
                value={shipping.street}
                onChange={e => setShipping(s => ({ ...s, street: e.target.value }))}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <input
              required
              type="text"
              placeholder="Landmark"
              value={shipping.landmark}
              onChange={e => setShipping(s => ({ ...s, landmark: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                placeholder="PIN Code"
                value={shipping.pin}
                onChange={e => setShipping(s => ({ ...s, pin: e.target.value }))}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                required
                type="text"
                placeholder="City"
                value={shipping.city}
                onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <input
              required
              type="text"
              placeholder="State"
              value={shipping.state}
              onChange={e => setShipping(s => ({ ...s, state: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <input
              required
              type="tel"
              placeholder="Phone Number"
              value={shipping.phone}
              onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-orange-500 text-white font-semibold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
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
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ₹{(parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Contact Info Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
            <p className="text-gray-900 font-medium">{userInfo.name}</p>
            <p className="text-gray-600 text-sm mt-1">{userInfo.email}</p>
            <p className="text-gray-600 text-sm">{userInfo.phone}</p>
          </div>

          {/* Shipping Info Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Shipping to</h3>
            <p className="text-gray-900 font-medium">{shipping.name}</p>
            <p className="text-gray-600 text-sm mt-1">
              {shipping.address}, {shipping.building}, {shipping.street}
            </p>
            <p className="text-gray-600 text-sm">
              {shipping.landmark && `${shipping.landmark}, `}
              {shipping.city}, {shipping.state} - {shipping.pin}
            </p>
            <p className="text-gray-600 text-sm mt-1">{shipping.phone}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-orange-500 text-white font-semibold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
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
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              {cart.length > 0 && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600">Add some items to get started!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-orange-600 font-medium mt-1">{item.price}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors"
                              onClick={() => decreaseQuantity(item.name)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors"
                              onClick={() => increaseQuantity(item.name)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.name)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">
                          ₹{(parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</p>
                      <p className="text-gray-600 text-sm">Total amount</p>
                    </div>
                    <button
                      onClick={clearCart}
                      className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <button
                    onClick={openCheckoutModal}
                    className="w-full bg-orange-500 text-white font-semibold py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 text-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <SiteFooter/>
    </>
  );
};

export default CartPage;