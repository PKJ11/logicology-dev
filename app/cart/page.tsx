"use client";

import { useCart } from "@/components/CartContext";
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { useCallback, useState, useEffect } from "react";

// GST Utility Functions
const COMPANY_GST_NUMBER = "27AADCL3493J1Z6";

interface CartItem {
  name: string;
  price: string;
  initialprice?: string;
  razorpayItemId: string;
  description?: string;
  image?: string;
  rating?: number;
  quantity?: number;
}

interface ItemDetails {
  [itemId: string]: {
    tax_rate?: number;
    hsn_code?: string;
  };
}

function generateGSTReceipt(cart: CartItem[], itemDetails: ItemDetails) {
  let totalAmount = 0;
  let totalGST = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let rows = "";
  
  cart.forEach((item, idx) => {
    const details = itemDetails[item.razorpayItemId] || {};
    const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
    const quantity = item.quantity || 1;
    const gstRate = details.tax_rate || 0;
    const hsnCode = details.hsn_code || "-";
    
    // GST calculation: Assuming price is GST inclusive
    const gstAmount = gstRate > 0 ? (price * gstRate) / (100 + gstRate) : 0;
    const cgstAmount = gstAmount / 2;
    const sgstAmount = gstAmount / 2;
    const basePrice = price - gstAmount;
    const totalItemAmount = price * quantity;
    
    totalAmount += totalItemAmount;
    totalGST += gstAmount * quantity;
    cgstTotal += cgstAmount * quantity;
    sgstTotal += sgstAmount * quantity;
    
    rows += `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${hsnCode}</td>
        <td style="padding: 10px; text-align: center;">${quantity}</td>
        <td style="padding: 10px; text-align: right;">₹${basePrice.toFixed(2)}</td>
        <td style="padding: 10px; text-align: center;">${gstRate}%</td>
        <td style="padding: 10px; text-align: right;">₹${(gstAmount * quantity).toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">₹${totalItemAmount.toFixed(2)}</td>
      </tr>
    `;
  });

  // Dynamic GST breakdown based on actual rates
  const gstBreakdown = `
    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #6A294D; margin-top: 0;">GST Breakdown</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${cgstTotal > 0 ? `<div>CGST:</div><div style="text-align: right;">₹${cgstTotal.toFixed(2)}</div>` : ''}
        ${sgstTotal > 0 ? `<div>SGST:</div><div style="text-align: right;">₹${sgstTotal.toFixed(2)}</div>` : ''}
        <div style="font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">Total GST:</div>
        <div style="font-weight: bold; text-align: right; border-top: 1px solid #ddd; padding-top: 5px;">₹${totalGST.toFixed(2)}</div>
      </div>
    </div>
  `;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 2px solid #6A294D; padding: 20px; background: #fff;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #6A294D; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #6A294D; margin: 0; font-size: 28px;">TAX INVOICE</h1>
        <h2 style="color: #EB6A42; margin: 5px 0; font-size: 20px;">Logicology Educational Products</h2>
        <p style="margin: 5px 0; color: #666;">GSTIN: ${COMPANY_GST_NUMBER}</p>
      </div>
      
      <!-- Invoice Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
        <thead>
          <tr style="background: #6A294D; color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">#</th>
            <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Item Description</th>
            <th style="padding: 12px; border: 1px solid #ddd;">HSN Code</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Qty</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Unit Price</th>
            <th style="padding: 12px; border: 1px solid #ddd;">GST Rate</th>
            <th style="padding: 12px; border: 1px solid #ddd;">GST Amount</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      
      ${gstBreakdown}
      
      <!-- Total Amount -->
      <div style="text-align: right; font-size: 16px; font-weight: bold; padding: 15px; background: #6A294D; color: white; border-radius: 5px;">
        Grand Total: ₹${totalAmount.toFixed(2)}
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #666;">
        <p>This is a computer generated invoice. No signature required.</p>
        <p>For queries, contact: logicologymeta@gmail.com | WhatsApp: 8446980747</p>
      </div>
    </div>
  `;
}

const CartPage = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const [itemDetails, setItemDetails] = useState<Record<string, { tax_rate?: number; hsn_code?: string }>>({});

  // Modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
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
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load saved addresses and item details
  useEffect(() => {
    const saved = localStorage.getItem("savedAddresses");
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }

    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }

    // Fetch item details for GST calculation
    fetchItemDetails();
  }, []);

  const fetchItemDetails = async () => {
    try {
      const res = await fetch("/api/razorpay-items");
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const details: Record<string, { tax_rate?: number; hsn_code?: string }> = {};
        for (const item of data.items) {
          details[item.id] = { 
            tax_rate: item.tax_rate, 
            hsn_code: item.hsn_code 
          };
        }
        setItemDetails(details);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
    return sum + price * (item.quantity || 1);
  }, 0);

  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk";

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

  const sendGSTInvoice = async (paymentId: string, orderDescription: string) => {
    try {
      // Generate GST receipt
      const gstReceiptHtml = generateGSTReceipt(cart, itemDetails);

      // Create email content
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #6A294D, #EB6A42); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Payment Successful!</h1>
            <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Thank you for your purchase from Logicology</p>
          </div>

          <!-- Order Summary -->
          <div style="padding: 25px; background: #f8f9fa; margin: 20px; border-radius: 10px;">
            <h3 style="color: #6A294D; margin-bottom: 15px; border-bottom: 2px solid #EB6A42; padding-bottom: 10px;">Order Confirmation</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #333;">Payment ID:</strong><br>
                <span style="color: #666;">${paymentId}</span>
              </div>
              <div>
                <strong style="color: #333;">Order Date:</strong><br>
                <span style="color: #666;">${new Date().toLocaleDateString('en-IN', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div>
                <strong style="color: #333;">Customer Name:</strong><br>
                <span style="color: #666;">${userInfo.name}</span>
              </div>
              <div>
                <strong style="color: #333;">Contact Email:</strong><br>
                <span style="color: #666;">${userInfo.email}</span>
              </div>
            </div>
          </div>

          <!-- GST Invoice -->
          ${gstReceiptHtml}

          <!-- Shipping Information -->
          <div style="padding: 25px; background: #f8f9fa; margin: 20px; border-radius: 10px;">
            <h3 style="color: #6A294D; margin-bottom: 15px; border-bottom: 2px solid #EB6A42; padding-bottom: 10px;">Shipping Details</h3>
            <div style="line-height: 1.8; color: #333;">
              <strong>${shipping.name}</strong><br>
              ${shipping.address}<br>
              ${shipping.building}, ${shipping.street}<br>
              ${shipping.landmark ? `Landmark: ${shipping.landmark}<br>` : ''}
              ${shipping.city}, ${shipping.state} - ${shipping.pin}<br>
              📞 ${shipping.phone}
            </div>
          </div>

          <!-- Support Section -->
          <div style="text-align: center; padding: 25px; background: #6A294D; color: white; margin: 20px; border-radius: 10px;">
            <h3 style="margin: 0 0 15px; color: white;">Need Assistance?</h3>
            <p style="margin: 0; opacity: 0.9; line-height: 1.6;">
              📧 Email: logicologymeta@gmail.com<br>
              📱 WhatsApp: 8446980747<br>
              <small>Please mention your Payment ID: ${paymentId}</small>
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
            <p style="margin: 0;">
              This is a system generated GST invoice. For any queries, please contact our support team.<br>
              <strong>Logicology - Making Learning Fun Through Play!</strong>
            </p>
          </div>
        </div>
      `;

      // Send email with GST invoice
      const emailRes = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userInfo.email,
          subject: `Logicology GST Invoice - Payment Confirmed (${paymentId})`,
          html: emailHtml,
        }),
      });

      const emailResult = await emailRes.json();

      // Send SMS notification
      try {
        await fetch("/api/send-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: userInfo.phone,
            message: `Thank you for your Logicology purchase! Payment ID: ${paymentId}. Amount: ₹${total.toFixed(2)}. GST invoice sent to your email. For queries: 8446980747`,
          }),
        });
      } catch (smsError) {
        console.error("SMS sending failed:", smsError);
      }

      return { success: true, emailSent: emailResult.success };
    } catch (error: any) {
      console.error("Error sending GST invoice:", error);
      return { success: false, error: error.message };
    }
  };

  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) return;
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // Validate required fields
      if (!userInfo.name || !userInfo.email || !userInfo.phone) {
        alert("Please fill in all contact information");
        setStep(1);
        setIsProcessing(false);
        return;
      }

      if (!shipping.name || !shipping.address || !shipping.pin || !shipping.city || !shipping.state || !shipping.phone) {
        alert("Please fill in all shipping information");
        setStep(2);
        setIsProcessing(false);
        return;
      }

      // Save address if this is a new one
      if (!selectedAddress) {
        saveAddressToLocalStorage();
      }

      // Amount in paise
      const amount = Math.round(total * 100);
      const res = await fetch("/api/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const { order } = await res.json();
      if (!order) {
        alert("Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }

      const orderDescription = `Order for ${cart.map((i) => `${i.name} (Qty: ${i.quantity})`).join(", ")}`;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Logicology",
        description: orderDescription,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Save order info
            await fetch("/api/save-order-info", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userInfo,
                shipping,
                cart,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                razorpayDesc: orderDescription,
                razorpayContact: response.razorpay_contact || userInfo.phone,
                totalAmount: total,
              }),
            });

            // Send GST invoice
            const invoiceResult = await sendGSTInvoice(response.razorpay_payment_id, orderDescription);

            // Clear cart and reset
            clearCart();
            setIsCheckoutModalOpen(false);
            setStep(1);
            setSelectedAddress("");
            setIsProcessing(false);

            // Show success message
            setTimeout(() => {
              alert(
                `🎉 Payment Successful!\n\nPayment ID: ${response.razorpay_payment_id}\nAmount: ₹${total.toFixed(2)}\n\nA detailed GST invoice has been sent to:\n${userInfo.email}\n\nThank you for shopping with Logicology!`
              );
            }, 500);

          } catch (error) {
            console.error("Error in payment handler:", error);
            setIsProcessing(false);
            alert("Payment was successful but there was an issue sending your GST invoice. Please contact support with your Payment ID.");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone,
        },
        notes: {
          address: `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pin}`,
          shipping_phone: shipping.phone,
        },
        theme: { color: "#EB6A42" },
      };

      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay SDK not loaded");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
      setIsProcessing(false);
    }
  }, [cart, total, userInfo, shipping, selectedAddress, isProcessing, clearCart, itemDetails]);

  const openCheckoutModal = () => {
    setIsCheckoutModalOpen(true);
    setStep(1);
    setSelectedAddress("");
  };

  const closeCheckoutModal = () => {
    if (!isProcessing) {
      setIsCheckoutModalOpen(false);
      setStep(1);
      setSelectedAddress("");
    }
  };

  // Calculate GST breakdown for display - FIXED to use actual rates from API
  const calculateGSTBreakdown = () => {
    let totalGST = 0;
    let taxableValue = 0;

    cart.forEach(item => {
      const details = itemDetails[item.razorpayItemId] || {};
      const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
      const quantity = item.quantity || 1;
      const gstRate = details.tax_rate || 0; // Use actual rate from API
      
      if (gstRate > 0) {
        const gstAmount = (price * gstRate) / (100 + gstRate);
        totalGST += gstAmount * quantity;
        taxableValue += (price - gstAmount) * quantity;
      } else {
        taxableValue += price * quantity;
      }
    });

    return { totalGST, taxableValue };
  };

  const { totalGST, taxableValue } = calculateGSTBreakdown();

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
                  disabled={isProcessing}
                  className="text-2xl text-gray-400 hover:text-gray-600 disabled:opacity-50"
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
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo((u) => ({ ...u, phone: e.target.value }))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!userInfo.name || !userInfo.email || !userInfo.phone}
                    className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600 disabled:bg-gray-400 disabled:shadow-none"
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
                      type="text"
                      placeholder="Landmark (Optional)"
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
                      disabled={isProcessing}
                      className="flex-1 rounded-xl border border-gray-300 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!shipping.name || !shipping.address || !shipping.pin || !shipping.city || !shipping.state || !shipping.phone}
                      className="flex-1 rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600 disabled:bg-gray-400 disabled:shadow-none"
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
                      {cart.map((item) => {
                        const details = itemDetails[item.razorpayItemId] || {};
                        const gstRate = details.tax_rate || 0;
                        return (
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
                                <p className="text-xs text-gray-500">
                                  GST: {gstRate}% | HSN: {details.hsn_code || "-"}
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
                        );
                      })}
                    </div>
                    
                    {/* GST Breakdown - FIXED to show actual rates */}
                    <div className="mt-4 border-t pt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Taxable Value:</span>
                          <span>₹{taxableValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total GST:</span>
                          <span>₹{totalGST.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total Amount:</span>
                          <span>₹{total.toFixed(2)}</span>
                        </div>
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
                      disabled={isProcessing}
                      className="flex-1 rounded-xl border border-gray-300 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="flex-1 rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600 disabled:bg-gray-400 disabled:shadow-none"
                    >
                      {isProcessing ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
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
                  {cart.map((item) => {
                    const details = itemDetails[item.razorpayItemId] || {};
                    const gstRate = details.tax_rate || 0;
                    return (
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
                          <p className="text-xs text-gray-600">
                            GST: {gstRate}% | HSN: {details.hsn_code || "-"}
                          </p>
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
                            {(parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* GST Summary - FIXED to show actual GST calculation */}
                <div className="mb-6 rounded-xl bg-blue-50 p-4">
                  <h3 className="mb-3 font-semibold text-blue-900">GST Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Taxable Value:</span>
                      <span className="float-right font-medium">₹{taxableValue.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">GST Amount:</span>
                      <span className="float-right font-medium">₹{totalGST.toFixed(2)}</span>
                    </div>
                    <div className="col-span-2 border-t pt-2">
                      <span className="text-blue-900 font-semibold">Grand Total:</span>
                      <span className="float-right font-bold text-blue-900">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Total amount (incl. GST)</p>
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
                  <p className="mt-2 text-center text-sm text-gray-600">
                    You will receive a detailed GST invoice via email after payment
                  </p>
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