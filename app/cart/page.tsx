"use client";

import { useCart } from "@/components/CartContext";
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Script from "next/script";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INDIAN_STATES_AND_UTS } from "../utils/indianStates";
import { motion, AnimatePresence } from "framer-motion";
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

const CORAL = "#E45C48";
const BG_LIGHT = "#F8F9FA";
const CARD_BG = "#FFFFFF";
const BORDER_LIGHT = "#E9ECEF";
const TEXT_PRIMARY = "#212529";
const TEXT_SECONDARY = "#6C757D";
const TEXT_MUTED = "#ADB5BD";

function StepBar({ current }: { current: number }) {
  const steps = ["Biller", "Shipping", "Review"];
  return (
    <div className="flex items-center justify-center gap-0 px-6 py-5">
      {steps.map((label, i) => {
        const done = i < current - 1;
        const active = i === current - 1;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300"
                style={{
                  backgroundColor: done || active ? CORAL : "#E9ECEF",
                  color: done || active ? "#fff" : TEXT_SECONDARY,
                  boxShadow: active ? `0 0 0 4px ${CORAL}20` : "none",
                }}
              >
                {done ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: active || done ? CORAL : TEXT_MUTED }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="mx-3 mb-5 h-[2px] w-12 rounded-full transition-all duration-500"
                style={{ backgroundColor: done ? CORAL : "#E9ECEF" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  required,
  maxLength,
  as,
  children,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  as?: "select";
  children?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const baseStyle: React.CSSProperties = {
    backgroundColor: BG_LIGHT,
    border: `1.5px solid ${error ? CORAL : focused ? CORAL : BORDER_LIGHT}`,
    boxShadow: focused ? `0 0 0 3px ${CORAL}10` : "none",
    color: TEXT_PRIMARY,
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 500,
    width: "100%",
    outline: "none",
    transition: "all 0.2s",
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-bold uppercase tracking-widest"
        style={{ color: TEXT_SECONDARY }}
      >
        {label}
        {required && <span style={{ color: CORAL }}> *</span>}
      </label>
      {as === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...baseStyle, appearance: "none" }}
          className="cursor-pointer"
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
          className="placeholder:text-[#ADB5BD]"
        />
      )}
      {error ? (
        <p className="text-[11px] font-medium" style={{ color: CORAL }}>
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-[14px] font-extrabold text-white transition-all duration-200 active:scale-[.98] disabled:opacity-40"
      style={{ backgroundColor: CORAL }}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover/btn:translate-x-[200%]" />
      <span className="relative">{children}</span>
    </button>
  );
}

function GhostBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-1.5 rounded-xl py-3.5 text-[13px] font-bold transition-all duration-200 active:scale-[.98] disabled:opacity-40"
      style={{ border: "1.5px solid #E9ECEF", color: TEXT_SECONDARY, backgroundColor: "white" }}
    >
      {children}
    </button>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl p-5 ${className ?? ""}`}
      style={{
        backgroundColor: CARD_BG,
        border: "1px solid #E9ECEF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em]"
      style={{ color: TEXT_SECONDARY }}
    >
      {children}
    </p>
  );
}

function Toggle({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="flex rounded-xl p-1"
      style={{ backgroundColor: BG_LIGHT, border: "1px solid #E9ECEF" }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="flex-1 rounded-lg py-2.5 text-[13px] font-bold transition-all duration-200"
          style={
            value === opt
              ? {
                  backgroundColor: CORAL,
                  color: "#fff",
                  boxShadow: "0 2px 6px rgba(228,92,72,0.2)",
                }
              : { color: TEXT_SECONDARY }
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    enrichCartSession, // ← NEW
    getRzpDeviceId, // ← NEW
  } = useCart();
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

  useEffect(() => {
    document.body.style.overflow = isCheckoutModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCheckoutModalOpen]);

  const fetchItemDetails = async () => {
    try {
      const res = await fetch("/api/razorpay-items");
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        const details: Record<string, { tax_rate?: number; hsn_code?: string }> = {};
        for (const item of data.items) {
          console.log("Fetched item from API:", item);
          details[item.id] = {
            tax_rate: item.tax_rate ?? 0,
            hsn_code: item.hsn_code,
          };
        }
        console.log("Final item details with converted tax_rate:", details);
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

  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk";
  // const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_RM7EaWFSnW9Fod";

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

  const BLANK_SHIPPING: ShippingInfo = {
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
  };

  const sanitizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const [phoneError, setPhoneError] = useState("");
  const [shippingPhoneError, setShippingPhoneError] = useState("");

  const isBillerPhoneValid = userInfo.phone.replace(/\D/g, "").length === 10;
  const isShippingPhoneValid = shipping.phone.replace(/\D/g, "").length === 10;

  const sendInteraktWhatsAppMessage = async (paymentId: string, orderDescription: string) => {
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
      const recipientEmail =
        shipping.isDifferentFromBiller && shipping.email ? shipping.email : userInfo.email;
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
        (shipping.isDifferentFromBiller && !shipping.name) ||
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
                rzpDeviceId: getRzpDeviceId(), // ← NEW: links order → cart_events
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

      {/* ── Payment processing overlay ── */}
      <AnimatePresence>
        {isPaymentProcessing && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 backdrop-blur-md"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            />
            <motion.div
              className="relative z-10 flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <div
                className="mb-5 h-12 w-12 animate-spin rounded-full"
                style={{ border: `3px solid ${CORAL}30`, borderTopColor: CORAL }}
              />
              <h3 className="mb-1.5 text-xl font-extrabold" style={{ color: TEXT_PRIMARY }}>
                Processing Payment
              </h3>
              <p className="mb-5 text-sm" style={{ color: TEXT_SECONDARY }}>
                Generating your GST invoice…
              </p>
              <div
                className="rounded-lg px-4 py-2 text-xs font-bold"
                style={{ backgroundColor: `${CORAL}10`, color: CORAL }}
              >
                Do not refresh or close this page
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Checkout Modal ── */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCheckoutModal}
            />

            {/* Drawer */}
            <motion.div
              className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl"
              style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.08)" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
            >
              {/* Cart strip header */}
              <div
                className="flex flex-shrink-0 flex-col"
                style={{ borderBottom: "1px solid #E9ECEF", backgroundColor: "white" }}
              >
                {/* Close button — own row, right-aligned, no overlap possible */}
                <div className="flex justify-end px-4 pt-3">
                  <button
                    onClick={closeCheckoutModal}
                    disabled={isProcessing}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-gray-100 disabled:opacity-40"
                    style={{ color: TEXT_SECONDARY }}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Product info row — full width, no absolute positioning */}
                <div className="flex items-center gap-4 px-6 pb-5 pt-1">
                  <div className="flex -space-x-2">
                    {cart.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50 ring-2 ring-white"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: CORAL }}
                    >
                      Checkout
                    </p>
                    <h3
                      className="truncate text-[15px] font-extrabold"
                      style={{ color: TEXT_PRIMARY }}
                    >
                      {cart.length === 1 ? cart[0].name : `${cart.length} items`}
                    </h3>
                    <p className="text-[12px]" style={{ color: TEXT_MUTED }}>
                      {cart.length} {cart.length === 1 ? "item" : "items"} in cart
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[20px] font-extrabold" style={{ color: TEXT_PRIMARY }}>
                      ₹{finalAmount.toLocaleString("en-IN")}
                    </div>
                    {appliedPromo && (
                      <div className="text-xs font-semibold" style={{ color: CORAL }}>
                        −₹{discountAmount} saved
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step bar */}
              <div
                className="flex-shrink-0"
                style={{ borderBottom: "1px solid #E9ECEF", backgroundColor: "white" }}
              >
                <StepBar current={step} />
              </div>

              {/* Scrollable content */}
              <div
                className="flex-1 overflow-y-auto px-6 py-6"
                style={{ backgroundColor: BG_LIGHT }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    {/* ── STEP 1: BILLER ── */}
                    {step === 1 && (
                      <>
                        <Card>
                          <div className="mb-4 flex flex-col gap-0.5">
                            <SectionLabel>Biller Details</SectionLabel>
                            <p className="text-xs" style={{ color: TEXT_MUTED }}>
                              Used for billing & GST receipts
                            </p>
                          </div>
                          <div className="flex flex-col gap-3.5">
                            <Field
                              label="Full Name"
                              placeholder="Riya Sharma"
                              value={userInfo.name}
                              onChange={(v) => setUserInfo((u) => ({ ...u, name: v }))}
                              required
                            />
                            <Field
                              label="Email Address"
                              type="email"
                              placeholder="riya@example.com"
                              value={userInfo.email}
                              onChange={(v) => setUserInfo((u) => ({ ...u, email: v }))}
                              required
                              hint="GST invoice will be sent here"
                            />
                            <Field
                              label="Phone Number"
                              type="tel"
                              placeholder="98765 43210"
                              value={userInfo.phone}
                              maxLength={10}
                              onChange={(v) => {
                                const c = sanitizePhone(v);
                                setUserInfo((u) => ({ ...u, phone: c }));
                                setPhoneError(
                                  c.length > 0 && c.length < 10 ? "Must be 10 digits" : ""
                                );
                              }}
                              error={phoneError}
                              hint={!phoneError ? "WhatsApp order updates sent here" : undefined}
                              required
                            />
                          </div>
                        </Card>
                        <PrimaryBtn
                          onClick={() => setStep(2)}
                          disabled={
                            !userInfo.name ||
                            !userInfo.email ||
                            !/\S+@\S+\.\S+/.test(userInfo.email) ||
                            !isBillerPhoneValid
                          }
                        >
                          Continue to Shipping →
                        </PrimaryBtn>
                      </>
                    )}

                    {/* ── STEP 2: SHIPPING ── */}
                    {step === 2 && (
                      <>
                        <Toggle
                          options={["For me", "For someone else"]}
                          value={shipping.isDifferentFromBiller ? "For someone else" : "For me"}
                          onChange={(v) => {
                            const diff = v === "For someone else";
                            if (!diff)
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
                            else {
                              setShipping({ ...BLANK_SHIPPING, isDifferentFromBiller: true });
                              setSelectedAddress("");
                            }
                            setShippingPhoneError("");
                          }}
                        />

                        {/* FOR ME */}
                        {!shipping.isDifferentFromBiller && (
                          <Card>
                            <div className="flex flex-col gap-3.5">
                              {savedAddresses.filter((a) => !a.isDifferentFromBiller).length > 0 &&
                                selectedAddress !== "__new__" && (
                                  <div className="flex flex-col gap-2">
                                    <SectionLabel>Saved Address</SectionLabel>
                                    {savedAddresses
                                      .filter((a) => !a.isDifferentFromBiller)
                                      .map((addr) => (
                                        <button
                                          key={addr.id}
                                          type="button"
                                          onClick={() => {
                                            setSelectedAddress(addr.id);
                                            loadSelectedAddress(addr.id);
                                            setShipping((s) => ({
                                              ...s,
                                              isDifferentFromBiller: false,
                                              isGift: addr.isGift || false,
                                            }));
                                          }}
                                          className="w-full rounded-lg p-3.5 text-left transition-all duration-200"
                                          style={{
                                            border: `1.5px solid ${selectedAddress === addr.id ? CORAL : "#E9ECEF"}`,
                                            backgroundColor:
                                              selectedAddress === addr.id ? `${CORAL}08` : "white",
                                          }}
                                        >
                                          <p
                                            className="text-sm font-bold"
                                            style={{ color: TEXT_PRIMARY }}
                                          >
                                            {addr.name}
                                          </p>
                                          <p
                                            className="mt-0.5 text-xs"
                                            style={{ color: TEXT_SECONDARY }}
                                          >
                                            {addr.address}
                                            {addr.building ? `, ${addr.building}` : ""}
                                          </p>
                                          <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                                            {addr.city}, {addr.state} – {addr.pin}
                                          </p>
                                          <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                                            {addr.phone}
                                          </p>
                                          {addr.isGift && (
                                            <span
                                              className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                                              style={{
                                                backgroundColor: `${CORAL}10`,
                                                color: CORAL,
                                              }}
                                            >
                                              🎁 Gift
                                            </span>
                                          )}
                                        </button>
                                      ))}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedAddress("__new__");
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
                                      className="w-full rounded-lg py-3 text-[13px] font-bold transition-all"
                                      style={{ border: `1.5px dashed ${CORAL}`, color: CORAL }}
                                    >
                                      + Add new address
                                    </button>
                                  </div>
                                )}

                              {(savedAddresses.filter((a) => !a.isDifferentFromBiller).length ===
                                0 ||
                                selectedAddress === "__new__") && (
                                <div className="flex flex-col gap-3">
                                  {selectedAddress === "__new__" &&
                                    savedAddresses.filter((a) => !a.isDifferentFromBiller).length >
                                      0 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setSelectedAddress(
                                            savedAddresses.find((a) => !a.isDifferentFromBiller)
                                              ?.id || ""
                                          )
                                        }
                                        className="flex items-center gap-1.5 text-[12px] font-bold"
                                        style={{ color: TEXT_SECONDARY }}
                                      >
                                        <svg
                                          className="h-3.5 w-3.5"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth={2.5}
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 19l-7-7 7-7"
                                          />
                                        </svg>
                                        Back to saved
                                      </button>
                                    )}
                                  <SectionLabel>Delivery Address</SectionLabel>
                                  <div className="grid grid-cols-2 gap-3">
                                    <Field
                                      label="Building"
                                      placeholder="Apt / Block"
                                      value={shipping.building}
                                      onChange={(v) => setShipping((s) => ({ ...s, building: v }))}
                                    />
                                    <Field
                                      label="Street"
                                      placeholder="Road / Colony"
                                      value={shipping.street}
                                      onChange={(v) => setShipping((s) => ({ ...s, street: v }))}
                                    />
                                  </div>
                                  <Field
                                    label="Address"
                                    placeholder="Full address"
                                    value={shipping.address}
                                    onChange={(v) => setShipping((s) => ({ ...s, address: v }))}
                                    required
                                  />
                                  <Field
                                    label="Landmark"
                                    placeholder="Near… (optional)"
                                    value={shipping.landmark}
                                    onChange={(v) => setShipping((s) => ({ ...s, landmark: v }))}
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <Field
                                      label="PIN Code"
                                      type="tel"
                                      placeholder="400001"
                                      value={shipping.pin}
                                      onChange={(v) => setShipping((s) => ({ ...s, pin: v }))}
                                      required
                                    />
                                    <Field
                                      label="City"
                                      placeholder="Mumbai"
                                      value={shipping.city}
                                      onChange={(v) => setShipping((s) => ({ ...s, city: v }))}
                                      required
                                    />
                                  </div>
                                  <Field
                                    label="State / UT"
                                    as="select"
                                    value={shipping.state}
                                    onChange={(v) => setShipping((s) => ({ ...s, state: v }))}
                                    required
                                  >
                                    <option value="">Select State / Union Territory</option>
                                    {INDIAN_STATES_AND_UTS.map((st) => (
                                      <option key={st} value={st}>
                                        {st}
                                      </option>
                                    ))}
                                  </Field>
                                </div>
                              )}

                              {/* Gift toggle */}
                              <button
                                type="button"
                                onClick={() => setShipping((s) => ({ ...s, isGift: !s.isGift }))}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-bold transition-all"
                                style={{
                                  border: `1.5px solid ${shipping.isGift ? CORAL : "#E9ECEF"}`,
                                  backgroundColor: shipping.isGift ? `${CORAL}08` : "white",
                                  color: shipping.isGift ? TEXT_PRIMARY : TEXT_SECONDARY,
                                }}
                              >
                                <span>🎁</span>
                                <span>This is a gift</span>
                                {shipping.isGift && (
                                  <svg
                                    className="ml-auto h-4 w-4"
                                    fill="none"
                                    stroke={CORAL}
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </Card>
                        )}

                        {/* FOR SOMEONE ELSE */}
                        {shipping.isDifferentFromBiller && (
                          <Card>
                            <div className="flex flex-col gap-3.5">
                              <SectionLabel>Recipient Details</SectionLabel>
                              <Field
                                label="Recipient's Name"
                                placeholder="Full name"
                                value={shipping.name}
                                onChange={(v) => setShipping((s) => ({ ...s, name: v }))}
                                required
                              />
                              <Field
                                label="Recipient's Email"
                                type="email"
                                placeholder="Optional"
                                value={shipping.email || ""}
                                onChange={(v) => setShipping((s) => ({ ...s, email: v }))}
                              />
                              <Field
                                label="Recipient's Phone"
                                type="tel"
                                placeholder="10-digit number"
                                value={shipping.phone}
                                maxLength={10}
                                onChange={(v) => {
                                  const c = sanitizePhone(v);
                                  setShipping((s) => ({ ...s, phone: c }));
                                  setShippingPhoneError(
                                    c.length > 0 && c.length < 10 ? "Must be 10 digits" : ""
                                  );
                                }}
                                error={shippingPhoneError}
                                hint={
                                  !shippingPhoneError ? "Required for delivery updates" : undefined
                                }
                                required
                              />
                              <div className="my-0.5 border-t" style={{ borderColor: "#E9ECEF" }} />
                              <SectionLabel>Delivery Address</SectionLabel>
                              <div className="grid grid-cols-2 gap-3">
                                <Field
                                  label="Building"
                                  placeholder="Apt / Block"
                                  value={shipping.building}
                                  onChange={(v) => setShipping((s) => ({ ...s, building: v }))}
                                />
                                <Field
                                  label="Street"
                                  placeholder="Road / Colony"
                                  value={shipping.street}
                                  onChange={(v) => setShipping((s) => ({ ...s, street: v }))}
                                />
                              </div>
                              <Field
                                label="Address"
                                placeholder="Full address"
                                value={shipping.address}
                                onChange={(v) => setShipping((s) => ({ ...s, address: v }))}
                                required
                              />
                              <Field
                                label="Landmark"
                                placeholder="Near… (optional)"
                                value={shipping.landmark}
                                onChange={(v) => setShipping((s) => ({ ...s, landmark: v }))}
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <Field
                                  label="PIN Code"
                                  type="tel"
                                  placeholder="400001"
                                  value={shipping.pin}
                                  onChange={(v) => setShipping((s) => ({ ...s, pin: v }))}
                                  required
                                />
                                <Field
                                  label="City"
                                  placeholder="Mumbai"
                                  value={shipping.city}
                                  onChange={(v) => setShipping((s) => ({ ...s, city: v }))}
                                  required
                                />
                              </div>
                              <Field
                                label="State / UT"
                                as="select"
                                value={shipping.state}
                                onChange={(v) => setShipping((s) => ({ ...s, state: v }))}
                                required
                              >
                                <option value="">Select State / Union Territory</option>
                                {INDIAN_STATES_AND_UTS.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </Field>
                              <button
                                type="button"
                                onClick={() => setShipping((s) => ({ ...s, isGift: !s.isGift }))}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-bold transition-all"
                                style={{
                                  border: `1.5px solid ${shipping.isGift ? CORAL : "#E9ECEF"}`,
                                  backgroundColor: shipping.isGift ? `${CORAL}08` : "white",
                                  color: shipping.isGift ? TEXT_PRIMARY : TEXT_SECONDARY,
                                }}
                              >
                                <span>🎁</span>
                                <span>This is a gift</span>
                                {shipping.isGift && (
                                  <svg
                                    className="ml-auto h-4 w-4"
                                    fill="none"
                                    stroke={CORAL}
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </Card>
                        )}

                        {/* Promo code */}
                        <Card>
                          <SectionLabel>Promo Code</SectionLabel>
                          {!appliedPromo ? (
                            <div className="mt-3 flex flex-col gap-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter code…"
                                  value={promoCode}
                                  onChange={(e) => {
                                    setPromoCode(e.target.value);
                                    setPromoError("");
                                  }}
                                  onKeyDown={(e) => e.key === "Enter" && validatePromoCode()}
                                  className="flex-1 rounded-lg px-4 py-3 text-sm font-medium outline-none transition-all"
                                  style={{
                                    backgroundColor: BG_LIGHT,
                                    border: "1.5px solid #E9ECEF",
                                  }}
                                />
                                <button
                                  onClick={validatePromoCode}
                                  disabled={isValidatingPromo || !promoCode.trim()}
                                  className="rounded-lg px-5 py-3 text-[13px] font-bold transition-all disabled:opacity-40"
                                  style={{ backgroundColor: CORAL, color: "white" }}
                                >
                                  {isValidatingPromo ? "…" : "Apply"}
                                </button>
                              </div>
                              {promoError && (
                                <p className="text-[11px] font-medium" style={{ color: CORAL }}>
                                  {promoError}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div
                              className="mt-3 flex items-center justify-between rounded-lg px-4 py-3"
                              style={{
                                backgroundColor: `${CORAL}08`,
                                border: `1.5px solid ${CORAL}20`,
                              }}
                            >
                              <div>
                                <p className="text-[13px] font-bold" style={{ color: CORAL }}>
                                  {appliedPromo.promoCode}
                                </p>
                                <p className="text-[12px]" style={{ color: TEXT_SECONDARY }}>
                                  You saved ₹{appliedPromo.discountAmount}!
                                </p>
                              </div>
                              <button
                                onClick={removePromoCode}
                                className="text-[12px] font-bold"
                                style={{ color: CORAL }}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </Card>

                        <div className="flex gap-3">
                          <GhostBtn onClick={() => setStep(1)}>
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Back
                          </GhostBtn>
                          <PrimaryBtn
                            onClick={() => setStep(3)}
                            disabled={
                              (shipping.isDifferentFromBiller &&
                                (!shipping.name || !shipping.phone || !isShippingPhoneValid)) ||
                              !shipping.address ||
                              !shipping.pin ||
                              !shipping.city ||
                              !shipping.state ||
                              (!shipping.isDifferentFromBiller &&
                                savedAddresses.filter((a) => !a.isDifferentFromBiller).length ===
                                  0 &&
                                (!shipping.building || !shipping.street))
                            }
                          >
                            Review Order →
                          </PrimaryBtn>
                        </div>
                      </>
                    )}

                    {/* ── STEP 3: REVIEW ── */}
                    {step === 3 && (
                      <>
                        <Card>
                          <SectionLabel>Order Summary</SectionLabel>
                          <div className="mt-3 flex flex-col gap-3">
                            {cart.map((item) => {
                              const details = itemDetails[item.razorpayItemId] || {};
                              const gstRate = details.tax_rate || 0;
                              const itemPrice = parseFloat(item.price.replace(/[^\d.]/g, ""));
                              return (
                                <div key={item.name} className="flex items-center gap-3">
                                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p
                                      className="truncate text-sm font-bold"
                                      style={{ color: TEXT_PRIMARY }}
                                    >
                                      {item.name}
                                    </p>
                                    <p className="text-xs" style={{ color: TEXT_MUTED }}>
                                      Qty: {item.quantity} · ₹{itemPrice.toLocaleString("en-IN")}
                                    </p>
                                    {gstRate > 0 && (
                                      <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
                                        GST {gstRate}% · HSN {details.hsn_code || "–"}
                                      </p>
                                    )}
                                  </div>
                                  <span
                                    className="flex-shrink-0 text-[15px] font-extrabold"
                                    style={{ color: TEXT_PRIMARY }}
                                  >
                                    ₹{(itemPrice * (item.quantity || 1)).toLocaleString("en-IN")}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <div
                            className="mt-4 flex flex-col gap-2 border-t pt-4"
                            style={{ borderColor: "#E9ECEF" }}
                          >
                            <div
                              className="flex justify-between text-[13px]"
                              style={{ color: TEXT_SECONDARY }}
                            >
                              <span>Taxable Value</span>
                              <span>₹{taxableValue.toFixed(2)}</span>
                            </div>
                            <div
                              className="flex justify-between text-[13px]"
                              style={{ color: TEXT_SECONDARY }}
                            >
                              <span>GST Amount</span>
                              <span>₹{totalGST.toFixed(2)}</span>
                            </div>
                            {appliedPromo && (
                              <div
                                className="flex justify-between text-[13px] font-semibold"
                                style={{ color: CORAL }}
                              >
                                <span>Promo ({appliedPromo.promoCode})</span>
                                <span>−₹{discountAmount.toFixed(2)}</span>
                              </div>
                            )}
                            <div
                              className="flex justify-between border-t pt-2.5 text-[16px] font-extrabold"
                              style={{ borderColor: "#E9ECEF", color: TEXT_PRIMARY }}
                            >
                              <span>Total</span>
                              <span>₹{finalAmount.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </Card>

                        <Card>
                          <SectionLabel>Biller</SectionLabel>
                          <div className="mt-2 flex flex-col gap-0.5">
                            <p className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>
                              {userInfo.name}
                            </p>
                            <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                              {userInfo.email}
                            </p>
                            <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                              {userInfo.phone}
                            </p>
                            <p className="mt-1 text-[11px]" style={{ color: TEXT_MUTED }}>
                              GST invoice sent here
                            </p>
                          </div>
                        </Card>

                        <Card>
                          <div className="mb-2 flex items-center gap-2">
                            <SectionLabel>Ship To</SectionLabel>
                            {shipping.isDifferentFromBiller && (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                style={{ backgroundColor: `${CORAL}10`, color: CORAL }}
                              >
                                Different recipient
                              </span>
                            )}
                            {shipping.isGift && (
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                                style={{ backgroundColor: `${CORAL}10`, color: CORAL }}
                              >
                                🎁 Gift
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-bold" style={{ color: TEXT_PRIMARY }}>
                              {shipping.name}
                            </p>
                            <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                              {shipping.address}
                              {shipping.building ? `, ${shipping.building}` : ""}
                              {shipping.street ? `, ${shipping.street}` : ""}
                            </p>
                            {shipping.landmark && (
                              <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                                {shipping.landmark}
                              </p>
                            )}
                            <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                              {shipping.city}, {shipping.state} – {shipping.pin}
                            </p>
                            <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                              {shipping.phone}
                            </p>
                            {shipping.email && (
                              <p className="text-xs" style={{ color: TEXT_SECONDARY }}>
                                {shipping.email}
                              </p>
                            )}
                          </div>
                        </Card>

                        <div className="flex gap-3">
                          <GhostBtn onClick={() => setStep(2)} disabled={isProcessing}>
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                            Back
                          </GhostBtn>
                          <PrimaryBtn onClick={handleCheckout} disabled={isProcessing}>
                            {isProcessing
                              ? "Processing…"
                              : `Pay ₹${finalAmount.toLocaleString("en-IN")}`}
                          </PrimaryBtn>
                        </div>

                        <p className="text-center text-[11px]" style={{ color: TEXT_MUTED }}>
                          Secured by Razorpay &nbsp;·&nbsp; 256-bit SSL encryption
                        </p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
