"use client";

import { useCart } from "@/components/CartContext";
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INDIAN_STATES_AND_UTS } from "../utils/indianStates";
import {
  trackRemoveFromCart,
  trackBeginCheckout,
  trackPurchase,
  trackFormSubmit,
  trackButtonClick,
} from "@/lib/gtag-events";
import { trackMetaPixelPurchase, trackMetaPixelInitiateCheckout } from "@/lib/meta-pixel-events";

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

// Add PromoCode type
interface PromoCode {
  success: boolean;
  promoCode: string;
  discountAmount: number;
  finalAmount: number;
  promoDetails: {
    type: string;
    value: number;
    minAmount: number;
    maxDiscount?: number;
  };
}

// New interface for shipping info
interface ShippingInfo {
  name: string;
  address: string;
  building: string;
  street: string;
  landmark: string;
  pin: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  isGift: boolean;
  isDifferentFromBiller: boolean;
}

function generateGSTReceipt(
  cart: CartItem[],
  itemDetails: ItemDetails,
  discountAmount: number = 0
) {
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

  // Apply discount
  const grandTotal = totalAmount - discountAmount;

  // Dynamic GST breakdown based on actual rates
  const gstBreakdown = `
    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #0A8A80; margin-top: 0;">GST Breakdown</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${cgstTotal > 0 ? `<div>CGST:</div><div style="text-align: right;">₹${cgstTotal.toFixed(2)}</div>` : ""}
        ${sgstTotal > 0 ? `<div>SGST:</div><div style="text-align: right;">₹${sgstTotal.toFixed(2)}</div>` : ""}
        ${discountAmount > 0 ? `<div style="color: #e53e3e;">Discount:</div><div style="color: #e53e3e; text-align: right;">-₹${discountAmount.toFixed(2)}</div>` : ""}
        <div style="font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">Total GST:</div>
        <div style="font-weight: bold; text-align: right; border-top: 1px solid #ddd; padding-top: 5px;">₹${totalGST.toFixed(2)}</div>
      </div>
    </div>
  `;

  return `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 2px solid #0A8A80; padding: 20px; background: #fff; color: #333;">
    <!-- Header -->
    <div style="text-align: center; border-bottom: 2px solid #0A8A80; padding-bottom: 15px; margin-bottom: 20px;">
      <h1 style="color: #0A8A80; margin: 0; font-size: 28px;">TAX INVOICE</h1>
      <h2 style="color: #0A8A80; margin: 5px 0; font-size: 20px;">Logicology Ventures Private Limited</h2>
      <p style="margin: 5px 0; color: #555;">GSTIN: ${COMPANY_GST_NUMBER}</p>
    </div>

    <!-- Invoice Table -->
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
      <thead>
        <tr style="background: #0A8A80; color: white;">
          <th style="padding: 12px; border: 1px solid #0A8A80;">#</th>
          <th style="padding: 12px; border: 1px solid #0A8A80; text-align: left;">Item Description</th>
          <th style="padding: 12px; border: 1px solid #0A8A80;">HSN Code</th>
          <th style="padding: 12px; border: 1px solid #0A8A80;">Qty</th>
          <th style="padding: 12px; border: 1px solid #0A8A80;">Unit Price</th>
          <th style="padding: 12px; border: 1px solid #0A8A80;">GST Rate</th>
          <th style="padding: 12px; border: 1px solid #0A8A80;">GST Amount</th>
          <th style="padding: 12px; border: 1px solid #0A8A80;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    ${gstBreakdown}

    <!-- Total Amount -->
    <div style="text-align: right; font-size: 16px; font-weight: bold; padding: 15px; background: #0A8A80; color: white; border-radius: 5px;">
      Grand Total: ₹${grandTotal.toFixed(2)}
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #0A8A80; font-size: 11px; color: #555;">
      <p>This is a computer generated invoice. No signature required.</p>
      <p>For queries, contact: <span style="color: #0A8A80;">logicologymeta@gmail.com</span> | WhatsApp: <span style="color: #0A8A80;">8446980747</span></p>
    </div>
  </div>
`;
}

const CartPage = () => {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
  const [itemDetails, setItemDetails] = useState<
    Record<string, { tax_rate?: number; hsn_code?: string }>
  >({});

  // Modal state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "",
    address: "",
    building: "",
    street: "",
    landmark: "",
    pin: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    isGift: false,
    isDifferentFromBiller: false,
  });
  const [step, setStep] = useState(1);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const router = useRouter();

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    if (appliedPromo) {
      removePromoCode();
    }
  }, [cart]);

  useEffect(() => {
    if (appliedPromo) {
      removePromoCode();
    }
  }, [cart.length]);

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

    // Load applied promo from localStorage
    const savedPromo = localStorage.getItem("appliedPromo");
    if (savedPromo) {
      setAppliedPromo(JSON.parse(savedPromo));
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
            hsn_code: item.hsn_code,
          };
        }
        setItemDetails(details);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => {
      let price: number;

      // Handle both string ("₹1,499") and number (1499) formats
      if (typeof item.price === "string") {
        price = parseFloat(item.price.replace(/[^\d.]/g, ""));
      } else {
        price = item.price; // Already a number
      }

      return sum + price * (item.quantity || 1);
    }, 0);
  };

  const total = calculateCartTotal();
  const discountAmount = appliedPromo?.discountAmount || 0;
  const finalAmount = appliedPromo?.finalAmount || total;

  // const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk";
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_RM7EaWFSnW9Fod";

  // Promo code functions
  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsValidatingPromo(true);
    setPromoError("");

    try {
      const res = await fetch("/api/validate-promo-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: promoCode.trim(),
          cartTotal: total,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to validate promo code");
      }

      const data = await res.json();

      if (data.success) {
        setAppliedPromo(data);
        localStorage.setItem("appliedPromo", JSON.stringify(data));
        setPromoCode("");
        setPromoError("");
      } else {
        setPromoError(data.message);
        setAppliedPromo(null);
        localStorage.removeItem("appliedPromo");
      }
    } catch (error: any) {
      setPromoError(error.message || "Failed to validate promo code. Please try again.");
      console.error("Promo code validation error:", error);
      setAppliedPromo(null);
      localStorage.removeItem("appliedPromo");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
    localStorage.removeItem("appliedPromo");
  };

  const saveAddressToLocalStorage = () => {
    // Save both biller and recipient info if shipping to someone else
    const newAddress = {
      id: Date.now().toString(),
      ...shipping,
      billerName: userInfo.name,
      billerEmail: userInfo.email,
      billerPhone: userInfo.phone,
      recipientName: shipping.isDifferentFromBiller ? shipping.name : undefined,
      recipientPhone: shipping.isDifferentFromBiller ? shipping.phone : undefined,
      recipientEmail: shipping.isDifferentFromBiller ? shipping.email : undefined,
    };

    const updatedAddresses = [...savedAddresses, newAddress];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  const loadSelectedAddress = (addressId: string) => {
    const address = savedAddresses.find((addr) => addr.id === addressId);
    if (address) {
      // Restore biller info
      setUserInfo({
        name: address.billerName || address.name || "",
        email: address.billerEmail || address.email || "",
        phone: address.billerPhone || address.phone || "",
      });
      // Restore shipping/recipient info
      setShipping({
        name: address.isDifferentFromBiller ? address.recipientName || "" : address.name || "",
        address: address.address || "",
        building: address.building || "",
        street: address.street || "",
        landmark: address.landmark || "",
        pin: address.pin || "",
        city: address.city || "",
        state: address.state || "",
        phone: address.isDifferentFromBiller ? address.recipientPhone || "" : address.phone || "",
        email: address.isDifferentFromBiller ? address.recipientEmail || "" : address.email || "",
        isGift: address.isGift || false,
        isDifferentFromBiller: address.isDifferentFromBiller || false,
      });
    }
  };

  const sendInteraktWhatsAppMessage = async (
    paymentId: string,
    orderDescription: string
  ) => {
    // Always send to userInfo.phone only
    const targetPhone = userInfo.phone;
    console.log("Phone number for WhatsApp:", targetPhone);

    if (!targetPhone) {
      console.warn("No phone number available for WhatsApp message");
      return {
        userTracked: false,
        messageSent: false,
        messageId: null,
        error: "No phone number provided",
      };
    }

    // Clean the phone number - remove any non-digit characters and country code if present
    let cleanedPhoneNumber = targetPhone.replace(/\D/g, "");

    // Remove country code if present (assuming Indian numbers)
    if (cleanedPhoneNumber.startsWith("91") && cleanedPhoneNumber.length === 12) {
      cleanedPhoneNumber = cleanedPhoneNumber.substring(2);
    } else if (cleanedPhoneNumber.startsWith("+91")) {
      cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
    }

    // Ensure the number is 10 digits
    if (cleanedPhoneNumber.length !== 10) {
      console.warn("Invalid phone number format:", targetPhone);
      return {
        userTracked: false,
        messageSent: false,
        messageId: null,
        error: "Invalid phone number format",
      };
    }
    console.log("cleaned phone number:", cleanedPhoneNumber);
    const countryCode = "+91";

    // Prepare shipping address string
    const shippingAddress = `${shipping.city}, ${shipping.state}`;

    // Prepare order items string
    const orderItems =
      cart.length > 0
        ? cart[0].name + (cart.length > 1 ? ` and ${cart.length - 1} more item(s)` : "")
        : "Your order";

    try {
      // Step 1: Track/Update user in Interakt
      const trackUserResponse = await fetch("https://api.interakt.ai/v1/public/track/users/", {
        method: "POST",
        headers: {
          Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: cleanedPhoneNumber,
          countryCode: countryCode,
          traits: {
            name: userInfo.name,
            email: userInfo.email,
            lastOrderDate: new Date().toISOString(),
            totalOrders: 1,
            lastPaymentId: paymentId,
            shippingAddress: shippingAddress,
            isGift: shipping.isGift,
            isDifferentFromBiller: shipping.isDifferentFromBiller,
          },
        }),
      });

      const trackUserResult = await trackUserResponse.json();

      if (!trackUserResult.result) {
        console.warn("Failed to track user:", trackUserResult.message);
        // Continue with message sending even if tracking fails
      }

      // Step 2: Send WhatsApp message
      const messageResponse = await fetch("https://api.interakt.ai/v1/public/message/", {
        method: "POST",
        headers: {
          Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode: countryCode,
          phoneNumber: cleanedPhoneNumber,
          type: "Template",
          template: {
            name: "purchase",
            languageCode: "en",
            bodyValues: [
              userInfo.name, // {{1}} Customer name
              orderItems, // {{2}} Order items
              finalAmount.toFixed(0), // {{3}} Amount
              shippingAddress, // {{4}} Shipping address
              paymentId, // {{5}} Payment ID
            ],
          },
        }),
      });

      const messageResult = await messageResponse.json();

      if (!messageResult.id) {
        throw new Error(`Failed to send WhatsApp message: ${JSON.stringify(messageResult)}`);
      }

      return {
        userTracked: trackUserResult.result || false,
        messageSent: true,
        messageId: messageResult.id,
      };
    } catch (error) {
      console.error("Error in WhatsApp messaging:", error);
      return {
        userTracked: false,
        messageSent: false,
        messageId: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const sendGSTInvoice = async (
    paymentId: string,
    orderDescription: string,
    razorpayContact?: string
  ) => {
    try {
      // Generate GST receipt with discount
      const gstReceiptHtml = generateGSTReceipt(cart, itemDetails, discountAmount);

      // Determine recipient details for email
      const recipientName = shipping.isDifferentFromBiller ? shipping.name : userInfo.name;
      const recipientEmail = shipping.isDifferentFromBiller && shipping.email ? shipping.email : userInfo.email;
      const recipientPhone = shipping.isDifferentFromBiller ? shipping.phone : userInfo.phone;

      // Create email content
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: #0A8A80; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 32px;">Payment Successful!</h1>
            <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">Thank you for your purchase from Logicology</p>
          </div>

          <!-- Order Summary -->
          <div style="padding: 25px; background: #F5F6F7; margin: 20px; border-radius: 10px;">
            <h3 style="color: #0B3F44; margin-bottom: 15px; border-bottom: 2px solid #0A8A80; padding-bottom: 10px;">Order Confirmation</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong style="color: #333;">Payment ID:</strong><br>
                <span style="color: #666;">${paymentId}</span>
              </div>
              <div>
                <strong style="color: #333;">Order Date:</strong><br>
                <span style="color: #666;">${new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</span>
              </div>
              <div>
                <strong style="color: #333;">Biller Name:</strong><br>
                <span style="color: #666;">${userInfo.name}</span>
              </div>
              <div>
                <strong style="color: #333;">Biller Email:</strong><br>
                <span style="color: #666;">${userInfo.email}</span>
              </div>
              <div>
                <strong style="color: #333;">Recipient Name:</strong><br>
                <span style="color: #666;">${recipientName}</span>
              </div>
              <div>
                <strong style="color: #333;">Recipient Contact:</strong><br>
                <span style="color: #666;">${recipientPhone}</span>
              </div>
              ${
                shipping.isGift
                  ? `<div style="grid-column: span 2; padding: 10px; background: #FFF3CD; border-radius: 5px; text-align: center;">
                      <strong style="color: #856404;">🎁 This order is marked as a gift</strong>
                    </div>`
                  : ""
              }
              ${
                appliedPromo
                  ? `<div>
                      <strong style="color: #333;">Promo Code Applied:</strong><br>
                      <span style="color: #666;">${appliedPromo.promoCode} (Saved ₹${discountAmount})</span>
                    </div>`
                  : ""
              }
            </div>
          </div>

          <!-- GST Invoice -->
          ${gstReceiptHtml}

          <!-- Shipping Information -->
          <div style="padding: 25px; background: #F5F6F7; margin: 20px; border-radius: 10px;">
            <h3 style="color: #0B3F44; margin-bottom: 15px; border-bottom: 2px solid #0A8A80; padding-bottom: 10px;">Shipping Details</h3>
            <div style="line-height: 1.8; color: #333;">
              <strong>${shipping.name}</strong><br>
              ${shipping.address}<br>
              ${shipping.building}, ${shipping.street}<br>
              ${shipping.landmark ? `Landmark: ${shipping.landmark}<br>` : ""}
              ${shipping.city}, ${shipping.state} - ${shipping.pin}<br>
              📞 ${shipping.phone}
              ${shipping.email ? `<br>📧 ${shipping.email}` : ""}
            </div>
          </div>

          <!-- Support Section -->
          <div style="text-align: center; padding: 25px; background: #0B3F44; color: white; margin: 20px; border-radius: 10px;">
            <h3 style="margin: 0 0 15px; color: white;">Need Assistance?</h3>
            <p style="margin: 0; opacity: 0.9; line-height: 1.6;"> 📧 Email: <span style="color: #0A8A80;">support@logicology.in</span> <br> 📱 WhatsApp: <span style="color: #0A8A80;">8446980747</span><br> <small>Please mention your Payment ID: ${paymentId}</small> </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
            <p style="margin: 0;">
              This is a system generated GST invoice. For any queries, please contact our support team.<br>
              <strong>Logicology - Learn To Play. Play To Learn </strong>
            </p>
          </div>
        </div>
      `;

      // Send email to both biller and recipient (if different)
      const emailRecipients = [userInfo.email, "orders@logicology.in"];
      if (shipping.isDifferentFromBiller && shipping.email) {
        emailRecipients.push(shipping.email);
      }

      const HOSTINGER_EMAIL = process.env.HOSTINGER_EMAIL || "orders@logicology.in";
      const emailRes = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailRecipients,
          cc: ["orders@logicology.in"],
          subject: `Logicology GST Invoice - Payment Confirmed (${paymentId})`,
          html: emailHtml,
        }),
      });

      const emailResult = await emailRes.json();

      // Send WhatsApp message only to userInfo.phone
      try {
        await sendInteraktWhatsAppMessage(paymentId, orderDescription);
      } catch (whatsappError) {
        console.error("WhatsApp message failed:", whatsappError);
        // Don't throw error here as email is primary, WhatsApp is secondary
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
        alert("Please fill in all contact information including phone number");
        setStep(1);
        setIsProcessing(false);
        return;
      }

      if (
        (shipping.isDifferentFromBiller && !shipping.name)||
        !shipping.address ||
        !shipping.pin ||
        !shipping.city ||
        !shipping.state
      ) {
        alert("Please fill in all shipping information");
        setStep(2);
        setIsProcessing(false);
        return;
      }

      // Validate shipping phone if shipping to someone else
      if (shipping.isDifferentFromBiller && !shipping.phone) {
        alert("Shipping phone number is required when shipping to someone else");
        setStep(2);
        setIsProcessing(false);
        return;
      }

      // Save address if this is a new one
      if (!selectedAddress) {
        saveAddressToLocalStorage();
      }

      // Amount in paise (use final amount after discount)
      const amount = Math.round(finalAmount);
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

      const orderDescription = `Order for ${cart.map((i) => `${i.name} (Qty: ${i.quantity})`).join(", ")}${appliedPromo ? ` | Promo: ${appliedPromo.promoCode}` : ""}${shipping.isGift ? " |  Gift" : ""}`;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Logicology",
        description: orderDescription,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Show payment processing overlay
            console.log("hi");
            setIsPaymentProcessing(true);
            console.log("Full Razorpay Response:", response);

            // Track purchase event for Google Analytics
            const purchaseItems = cart.map((item) => ({
              item_id: item.razorpayItemId,
              item_name: item.name,
              price: parseFloat(item.price.replace(/[^\d.]/g, "")),
              quantity: item.quantity || 1,
            }));
            trackPurchase(
              response.razorpay_payment_id,
              purchaseItems,
              finalAmount,
              "INR",
              totalGST,
              0
            );

            // Track purchase event for Meta Pixel
            trackMetaPixelPurchase(
              "INR",
              finalAmount,
              cart.map((item) => ({
                item_id: item.razorpayItemId,
                title: item.name,
                price: parseFloat(item.price.replace(/[^\d.]/g, "")),
                quantity: item.quantity || 1,
              })),
              response.razorpay_payment_id
            );

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
                razorpayContact: response.razorpay_contact,
                totalAmount: finalAmount,
                discountAmount: discountAmount,
                appliedPromo: appliedPromo,
                isGift: shipping.isGift,
                isDifferentFromBiller: shipping.isDifferentFromBiller,
              }),
            });

            // Send GST invoice
            const invoiceResult = await sendGSTInvoice(
              response.razorpay_payment_id,
              orderDescription,
              response.razorpay_contact
            );

            // Clear cart and reset
            clearCart();
            setIsCheckoutModalOpen(false);
            setStep(1);
            setSelectedAddress("");
            setIsProcessing(false);
            setAppliedPromo(null);
            localStorage.removeItem("appliedPromo");

            // Hide payment processing overlay and redirect
            setTimeout(() => {
              setIsPaymentProcessing(false);
              router.push(`/my-orders?paymentId=${response.razorpay_payment_id}`);
            }, 500);
          } catch (error) {
            console.error("Error in payment handler:", error);
            setIsProcessing(false);
            setIsPaymentProcessing(false);
            alert(
              "Payment was successful but there was an issue sending your GST invoice. Please contact support with your Payment ID."
            );
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
          shipping_email: shipping.email || "",
          promo_code: appliedPromo?.promoCode || "",
          is_gift: shipping.isGift.toString(),
          is_different_from_biller: shipping.isDifferentFromBiller.toString(),
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
  }, [
    cart,
    finalAmount,
    userInfo,
    shipping,
    selectedAddress,
    isProcessing,
    clearCart,
    itemDetails,
    appliedPromo,
    discountAmount,
  ]);

  const openCheckoutModal = () => {
    // Track begin_checkout event
    const cartItems = cart.map((item) => ({
      item_id: item.razorpayItemId,
      item_name: item.name,
      price: parseFloat(item.price.replace(/[^\d.]/g, "")),
      quantity: item.quantity || 1,
    }));
    trackBeginCheckout(cartItems, finalAmount, "INR");

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

    cart.forEach((item) => {
      const details = itemDetails[item.razorpayItemId] || {};
      const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
      const quantity = item.quantity || 1;
      const gstRate = details.tax_rate || 0;

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

      {/* Payment Processing Overlay */}
      {isPaymentProcessing && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Blurred Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md" />

          {/* Loading Content */}
          <div className="relative z-10 flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-2xl">
            {/* Spinner */}
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>

            {/* Message */}
            <h3 className="mb-2 text-xl font-bold text-gray-900">Processing Payment</h3>
            <p className="mb-4 text-center text-gray-600">
              Please wait while we process your payment and generate your invoice...
            </p>

            {/* Warning */}
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    Do not refresh or close this page
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal - Updated for sidebar style on large screens */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop with blur effect for entire screen */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeCheckoutModal}
          />

          {/* Modal Content - Sidebar style from right side for large screens */}
          <div
            className={`fixed inset-y-0 right-0 z-[100] w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-out ${
              isCheckoutModalOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col bg-white">
              {/* Header */}
              <div className="mt-20 flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {step === 1
                    ? "Biller Information"
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

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Step 1: Biller Information */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Biller Details</h3>
                        <p className="text-sm text-gray-600">
                          This information will be used for billing and receipts
                        </p>
                        <input
                          required
                          type="text"
                          placeholder="Full Name"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo((u) => ({ ...u, name: e.target.value }))}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <div>
                          <input
                            required
                            type="email"
                            placeholder="Email Address"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo((u) => ({ ...u, email: e.target.value }))}
                            onBlur={(e) => {
                              // Validate email on blur
                              const email = e.target.value;
                              if (email && !/\S+@\S+\.\S+/.test(email)) {
                                setUserInfo((u) => ({
                                  ...u,
                                  emailError: "Please enter a valid email address",
                                }));
                              } else {
                                setUserInfo((u) => ({ ...u, emailError: "" }));
                              }
                            }}
                            className={`w-full rounded-xl border px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              (userInfo as any).emailError ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {(userInfo as any).emailError ? (
                            <p className="mt-2 text-sm text-red-600">
                              {(userInfo as any).emailError}
                            </p>
                          ) : (
                            <p className="mt-2 text-sm text-gray-600">
                              You will receive the GST invoice on this email
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            required
                            type="tel"
                            placeholder="Phone Number"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo((u) => ({ ...u, phone: e.target.value }))}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <p className="mt-2 text-sm text-gray-600">
                            WhatsApp notifications will be sent to this number
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setStep(2)}
                        disabled={
                          !userInfo.name ||
                          !userInfo.email ||
                          !/\S+@\S+\.\S+/.test(userInfo.email) ||
                          !userInfo.phone
                        }
                        className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600 disabled:bg-gray-400 disabled:shadow-none"
                      >
                        Continue to Shipping
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
                                // Reset shipping info when selecting saved address
                                setShipping(s => ({
                                  ...s,
                                  isDifferentFromBiller: address.isDifferentFromBiller || false,
                                  isGift: address.isGift || false
                                }));
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
                                  {address.isDifferentFromBiller && (
                                    <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                      Shipping to someone else
                                    </span>
                                  )}
                                  {address.isGift && (
                                    <span className="mt-1 ml-2 inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                                      🎁 Gift
                                    </span>
                                  )}
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
                              onClick={() => {
                                setSelectedAddress("");
                                // Reset shipping info when adding new address
                                setShipping({
                                  name: userInfo.name,
                                  address: "",
                                  building: "",
                                  street: "",
                                  landmark: "",
                                  pin: "",
                                  city: "",
                                  state: "",
                                  phone: userInfo.phone,
                                  email: "",
                                  isGift: false,
                                  isDifferentFromBiller: false,
                                });
                              }}
                              className="text-sm font-medium text-orange-500 hover:text-orange-600"
                            >
                              + Add New Address
                            </button>
                          </div>

                          <div className="border-t pt-4">
                            <h3 className="mb-3 font-semibold text-gray-900">
                              Or Enter New Address
                            </h3>
                          </div>
                        </div>
                      )}

                      {/* Shipping Information Form */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">
                          {savedAddresses.length > 0 ? "New Shipping Address" : "Shipping Address"}
                        </h3>
                        
                        {/* Different Recipient Toggle */}
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="differentRecipient"
                            checked={shipping.isDifferentFromBiller}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setShipping((s) => ({ 
                                ...s, 
                                isDifferentFromBiller: isChecked,
                                name: isChecked ? "" : userInfo.name,
                                phone: isChecked ? "" : userInfo.phone,
                                email: isChecked ? "" : userInfo.email
                              }));
                            }}
                            className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="differentRecipient" className="font-medium text-gray-900">
                            Shipping to someone else?
                          </label>
                        </div>

                        {shipping.isDifferentFromBiller && (
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <p className="mb-3 text-sm text-blue-800">
                              Please provide the recipient's details
                            </p>
                            <input
                              required={shipping.isDifferentFromBiller}
                              type="text"
                              placeholder="Recipient's Full Name"
                              value={shipping.name}
                              onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                              className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                              required={shipping.isDifferentFromBiller}
                              type="tel"
                              placeholder="Recipient's Phone Number *"
                              value={shipping.phone}
                              onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                              className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <p className="mb-2 text-xs text-gray-600">
                              * Phone number is required for delivery updates
                            </p>
                            <input
                              type="email"
                              placeholder="Recipient's Email (Optional)"
                              value={shipping.email || ""}
                              onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))}
                              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            required
                            type="text"
                            placeholder="Building"
                            value={shipping.building}
                            onChange={(e) =>
                              setShipping((s) => ({ ...s, building: e.target.value }))
                            }
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
                          placeholder="Address"
                          value={shipping.address}
                          onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />

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
                        <select
                          required
                          value={shipping.state}
                          onChange={(e) => setShipping((s) => ({ ...s, state: e.target.value }))}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select State / Union Territory</option>
                          {INDIAN_STATES_AND_UTS.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>

                        {/* Gift Checkbox */}
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="isGift"
                            checked={shipping.isGift}
                            onChange={(e) => setShipping((s) => ({ ...s, isGift: e.target.checked }))}
                            className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <label htmlFor="isGift" className="font-medium text-gray-900">
                            Is this a gift? 🎁
                          </label>
                        </div>
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
                          disabled={
                            (shipping.isDifferentFromBiller && !shipping.name)||
                            !shipping.address ||
                            !shipping.pin ||
                            !shipping.city ||
                            !shipping.state ||
                            (shipping.isDifferentFromBiller && !shipping.phone)
                          }
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
                            {appliedPromo && (
                              <>
                                <div className="flex justify-between text-green-600">
                                  <span>Discount ({appliedPromo.promoCode}):</span>
                                  <span>-₹{discountAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 font-semibold">
                                  <span>Final Amount:</span>
                                  <span>₹{finalAmount.toFixed(2)}</span>
                                </div>
                              </>
                            )}
                            <div className="flex justify-between border-t pt-2 text-lg font-bold">
                              <span>Total Amount:</span>
                              <span>₹{finalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Biller Info Preview */}
                      <div className="rounded-xl bg-gray-50 p-4">
                        <h3 className="mb-2 font-semibold text-gray-900">Biller Information</h3>
                        <p className="font-medium text-gray-900">{userInfo.name}</p>
                        <p className="mt-1 text-sm text-gray-600">{userInfo.email}</p>
                        <p className="text-sm text-gray-600">{userInfo.phone}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          GST invoice and receipts will be sent here
                        </p>
                      </div>

                      {/* Shipping Info Preview */}
                      <div className="rounded-xl bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Shipping to</h3>
                          {shipping.isDifferentFromBiller && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              Different Recipient
                            </span>
                          )}
                          {shipping.isGift && (
                            <span className="ml-2 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                              🎁 Gift
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900">{shipping.name}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {shipping.address}, {shipping.building}, {shipping.street}
                        </p>
                        <p className="text-sm text-gray-600">
                          {shipping.landmark && `${shipping.landmark}, `}
                          {shipping.city}, {shipping.state} - {shipping.pin}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">{shipping.phone}</p>
                        {shipping.email && (
                          <p className="text-sm text-gray-600">{shipping.email}</p>
                        )}
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
                          {isProcessing ? "Processing..." : `Pay ₹${finalAmount.toFixed(2)}`}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                    const gstRate = details.tax_rate || 5;
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
                              onClick={() => {
                                // Track remove_from_cart event
                                const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
                                trackRemoveFromCart(
                                  item.razorpayItemId,
                                  item.name,
                                  price,
                                  item.quantity || 1,
                                  "INR"
                                );
                                removeFromCart(item.name);
                              }}
                              className="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₹
                            {(
                              parseFloat(item.price.replace(/[^\d.]/g, "")) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Section */}
                <div className="mb-6 rounded-xl border border-gray-200 p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">Apply Promo Code</h3>
                  {!appliedPromo ? (
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError("");
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            validatePromoCode();
                          }
                        }}
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={validatePromoCode}
                        disabled={isValidatingPromo || !promoCode.trim()}
                        className="rounded-xl bg-gray-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-900 disabled:bg-gray-400"
                      >
                        {isValidatingPromo ? "Applying..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-green-800">
                            Promo Code Applied: {appliedPromo.promoCode}
                          </p>
                          <p className="text-sm text-green-600">You saved ₹{discountAmount}!</p>
                        </div>
                        <button
                          onClick={removePromoCode}
                          className="text-sm font-medium text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  {promoError && <p className="mt-2 text-sm text-red-600">{promoError}</p>}
                </div>

                {/* GST Summary - FIXED to show actual GST calculation */}
                <div className="mb-6 rounded-xl bg-blue-50 p-4">
                  <h3 className="mb-3 font-semibold text-blue-900">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Taxable Value:</span>
                      <span>₹{taxableValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Amount:</span>
                      <span>₹{totalGST.toFixed(2)}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount Applied:</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 text-lg font-bold text-blue-900">
                      <span>Grand Total:</span>
                      <span>₹{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{finalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        Total amount {appliedPromo && "(After discount) "}(incl. GST)
                      </p>
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