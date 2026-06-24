// components/HeroCheckoutModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { INDIAN_STATES_AND_UTS } from "@/app/utils/indianStates";

const RAZORPAY_KEY_ID = "rzp_live_RNIwt54hh7eqmk";
const COMPANY_GST_NUMBER = "27AADCL3493J1Z6";

// ─── Light Theme Palette ──────────────────────────────────────────────────────
const TEAL = "#0B3F44"; // kept for dark accents
const GOLD = "#D8AE4F";
const CORAL = "#E45C48";
const WHITE = "#FFFFFF";
const BG_LIGHT = "#F8F9FA";
const CARD_BG = "#FFFFFF";
const BORDER_LIGHT = "#E9ECEF";
const TEXT_PRIMARY = "#212529";
const TEXT_SECONDARY = "#6C757D";
const TEXT_MUTED = "#ADB5BD";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PromoCode {
  success: boolean;
  promoCode: string;
  discountAmount: number;
  finalAmount: number;
  promoDetails: { type: string; value: number; minAmount: number; maxDiscount?: number };
}

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
  email: string;
  isGift: boolean;
  isDifferentFromBiller: boolean;
}

export interface HeroProductConfig {
  name: string;
  price: string;
  initialprice?: string;
  razorpayItemId: string;
  discount?: string;
  description: string;
  image: string;
  rating?: number;
  specialOffer?: string;
  category?: string;
}

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

const sanitizePhone = (v: string) => v.replace(/\D/g, "").slice(0, 10);

// ─── Shared UI primitives (Light theme) ──────────────────────────────────────

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
                  backgroundColor: done ? CORAL : active ? CORAL : "#E9ECEF",
                  color: done || active ? "#fff" : "#6C757D",
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
                style={{ color: active ? CORAL : done ? CORAL : TEXT_MUTED }}
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
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-[14px] font-extrabold text-white transition-all duration-200 active:scale-[.98] disabled:opacity-40"
      style={{ backgroundColor: CORAL, ...style }}
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

// ─── Tab toggle (For me / For someone else) ───────────────────────────────────
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function HeroCheckoutModal({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: HeroProductConfig;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const [itemDetails, setItemDetails] = useState<{
    price: number;
    tax_rate?: number;
    hsn_code?: string;
  } | null>(null);

  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState<ShippingInfo>(BLANK_SHIPPING);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [shippingPhoneError, setShippingPhoneError] = useState("");

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch("/api/razorpay-items");
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          const found = data.items.find((i: any) => i.id === product.razorpayItemId);
          if (found)
            setItemDetails({
              price: found.amount,
              tax_rate: found.tax_rate,
              hsn_code: found.hsn_code,
            });
        }
      } catch (e) {
        console.error("Failed to fetch item", e);
      }
    }
    fetchItem();
  }, [product.razorpayItemId]);

  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem("savedAddresses");
    if (saved) setSavedAddresses(JSON.parse(saved));
    const userData = localStorage.getItem("userInfo");
    if (userData) setUserInfo(JSON.parse(userData));
    const savedPromo = localStorage.getItem("appliedPromo");
    if (savedPromo) setAppliedPromo(JSON.parse(savedPromo));
  }, [isOpen]);

  const basePrice = itemDetails?.price ?? parseFloat(product.price.replace(/[^\d.]/g, ""));
  const finalAmount = appliedPromo?.finalAmount ?? basePrice;
  const displayPrice = `₹${basePrice.toLocaleString("en-IN")}`;
  const savings = appliedPromo?.discountAmount ?? 0;

  const isBillerPhoneValid = userInfo.phone.replace(/\D/g, "").length === 10;
  const isShippingPhoneValid = shipping.phone.replace(/\D/g, "").length === 10;

  const gstRate = itemDetails?.tax_rate ?? 0;
  const gstAmt = gstRate > 0 ? (basePrice * gstRate) / (100 + gstRate) : 0;
  const taxableValue = basePrice - gstAmt;

  const saveAddress = () => {
    const newAddr = {
      id: Date.now().toString(),
      ...shipping,
      billerName: userInfo.name,
      billerEmail: userInfo.email,
      billerPhone: userInfo.phone,
    };
    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };

  const loadAddress = (id: string) => {
    const addr = savedAddresses.find((a) => a.id === id);
    if (!addr) return;
    setUserInfo({
      name: addr.billerName || addr.name || "",
      email: addr.billerEmail || addr.email || "",
      phone: addr.billerPhone || addr.phone || "",
    });
    setShipping({
      name: addr.isDifferentFromBiller ? addr.recipientName || "" : addr.name || "",
      address: addr.address || "",
      building: addr.building || "",
      street: addr.street || "",
      landmark: addr.landmark || "",
      pin: addr.pin || "",
      city: addr.city || "",
      state: addr.state || "",
      phone: addr.isDifferentFromBiller ? addr.recipientPhone || "" : addr.phone || "",
      email: addr.isDifferentFromBiller ? addr.recipientEmail || "" : addr.email || "",
      isGift: addr.isGift || false,
      isDifferentFromBiller: addr.isDifferentFromBiller || false,
    });
  };

  const validatePromo = async () => {
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
        body: JSON.stringify({ promoCode: promoCode.trim(), cartTotal: basePrice }),
      });
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
    } catch {
      setPromoError("Failed to validate. Please try again.");
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
    localStorage.removeItem("appliedPromo");
  };

  const generateGSTReceipt = (discount: number) => {
    const hsnCode = itemDetails?.hsn_code ?? "-";
    const grandTotal = basePrice - discount;
    const cgst = gstAmt / 2;
    const sgst = gstAmt / 2;
    return `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;border:2px solid #0A8A80;padding:20px;background:#fff;color:#333;">
        <div style="text-align:center;border-bottom:2px solid #0A8A80;padding-bottom:15px;margin-bottom:20px;">
          <h1 style="color:#0A8A80;margin:0;font-size:28px;">TAX INVOICE</h1>
          <h2 style="color:#0A8A80;margin:5px 0;font-size:20px;">Logicology Ventures Private Limited</h2>
          <p style="margin:5px 0;color:#555;">GSTIN: ${COMPANY_GST_NUMBER}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:20px;">
          <thead><tr style="background:#0A8A80;color:white;">
            <th style="padding:12px;border:1px solid #0A8A80;">#</th>
            <th style="padding:12px;border:1px solid #0A8A80;text-align:left;">Item</th>
            <th style="padding:12px;border:1px solid #0A8A80;">HSN</th>
            <th style="padding:12px;border:1px solid #0A8A80;">Qty</th>
            <th style="padding:12px;border:1px solid #0A8A80;">Unit Price</th>
            <th style="padding:12px;border:1px solid #0A8A80;">GST%</th>
            <th style="padding:12px;border:1px solid #0A8A80;">GST Amt</th>
            <th style="padding:12px;border:1px solid #0A8A80;">Total</th>
           </tr></thead>
          <tbody><tr style="border-bottom:1px solid #ddd;">
            <td style="padding:10px;text-align:center;">1</td>
            <td style="padding:10px;">${product.name}</td>
            <td style="padding:10px;text-align:center;">${hsnCode}</td>
            <td style="padding:10px;text-align:center;">1</td>
            <td style="padding:10px;text-align:right;">₹${taxableValue.toFixed(2)}</td>
            <td style="padding:10px;text-align:center;">${gstRate}%</td>
            <td style="padding:10px;text-align:right;">₹${gstAmt.toFixed(2)}</td>
            <td style="padding:10px;text-align:right;">₹${basePrice.toFixed(2)}</td>
           </tr></tbody>
        </table>
        <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin-bottom:20px;">
          <h3 style="color:#0A8A80;margin-top:0;">GST Breakdown</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            ${cgst > 0 ? `<div>CGST:</div><div style="text-align:right;">₹${cgst.toFixed(2)}</div>` : ""}
            ${sgst > 0 ? `<div>SGST:</div><div style="text-align:right;">₹${sgst.toFixed(2)}</div>` : ""}
            ${discount > 0 ? `<div style="color:#e53e3e;">Discount:</div><div style="color:#e53e3e;text-align:right;">-₹${discount.toFixed(2)}</div>` : ""}
            <div style="font-weight:bold;border-top:1px solid #ddd;padding-top:5px;">Total GST:</div>
            <div style="font-weight:bold;text-align:right;border-top:1px solid #ddd;padding-top:5px;">₹${gstAmt.toFixed(2)}</div>
          </div>
        </div>
        <div style="text-align:right;font-size:16px;font-weight:bold;padding:15px;background:#0A8A80;color:white;border-radius:5px;">
          Grand Total: ₹${grandTotal.toFixed(2)}
        </div>
        <div style="text-align:center;margin-top:20px;padding-top:15px;border-top:1px solid #0A8A80;font-size:11px;color:#555;">
          <p>Computer generated invoice. No signature required.</p>
          <p>Queries: logicologymeta@gmail.com | WhatsApp: 8446980747</p>
        </div>
      </div>`;
  };

  const sendWhatsApp = async (paymentId: string) => {
    let clean = userInfo.phone.replace(/\D/g, "");
    if (clean.startsWith("91") && clean.length === 12) clean = clean.substring(2);
    if (clean.length !== 10) return;
    try {
      await fetch("https://api.interakt.ai/v1/public/track/users/", {
        method: "POST",
        headers: {
          Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: clean,
          countryCode: "+91",
          traits: { name: userInfo.name, email: userInfo.email, lastPaymentId: paymentId },
        }),
      });
      await fetch("https://api.interakt.ai/v1/public/message/", {
        method: "POST",
        headers: {
          Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode: "+91",
          phoneNumber: clean,
          type: "Template",
          template: {
            name: "purchase",
            languageCode: "en",
            bodyValues: [
              userInfo.name,
              product.name,
              finalAmount.toFixed(0),
              `${shipping.city}, ${shipping.state}`,
              paymentId,
            ],
          },
        }),
      });
    } catch (e) {
      console.error("WhatsApp error", e);
    }
  };

  const sendInvoice = async (paymentId: string) => {
    const discount = appliedPromo?.discountAmount ?? 0;
    const recipientName = shipping.isDifferentFromBiller ? shipping.name : userInfo.name;
    const recipientEmail =
      shipping.isDifferentFromBiller && shipping.email ? shipping.email : userInfo.email;
    const emailHtml = `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">
        <div style="background:#0A8A80;padding:30px;text-align:center;color:white;">
          <h1 style="margin:0;">Payment Successful!</h1>
          <p style="margin:10px 0 0;opacity:0.9;">Thank you for purchasing from Logicology</p>
        </div>
        <div style="padding:25px;background:#F5F6F7;margin:20px;border-radius:10px;">
          <h3 style="color:#0B3F44;border-bottom:2px solid #0A8A80;padding-bottom:10px;">Order Confirmation</h3>
          <p><strong>Payment ID:</strong> ${paymentId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
          <p><strong>Biller:</strong> ${userInfo.name} | ${userInfo.email} | ${userInfo.phone}</p>
          <p><strong>Recipient:</strong> ${recipientName}${shipping.isGift ? " 🎁 Gift" : ""}</p>
          ${appliedPromo ? `<p><strong>Promo:</strong> ${appliedPromo.promoCode} (Saved ₹${discount})</p>` : ""}
        </div>
        ${generateGSTReceipt(discount)}
        <div style="padding:25px;background:#F5F6F7;margin:20px;border-radius:10px;">
          <h3 style="color:#0B3F44;border-bottom:2px solid #0A8A80;padding-bottom:10px;">Shipping Details</h3>
          <p>${shipping.name}<br>${shipping.address}, ${shipping.building}, ${shipping.street}<br>
          ${shipping.landmark ? `${shipping.landmark}<br>` : ""}
          ${shipping.city}, ${shipping.state} - ${shipping.pin}<br>
          📞 ${shipping.phone}${shipping.email ? `<br>📧 ${shipping.email}` : ""}</p>
        </div>
        <div style="text-align:center;padding:25px;background:#0B3F44;color:white;margin:20px;border-radius:10px;">
          <p>📧 support@logicology.in | 📱 8446980747<br><small>Payment ID: ${paymentId}</small></p>
        </div>
      </div>`;
    const emails = [userInfo.email, "orders@logicology.in"];
    if (shipping.isDifferentFromBiller && shipping.email) emails.push(shipping.email);
    try {
      await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emails,
          subject: `Logicology GST Invoice - Payment Confirmed (${paymentId})`,
          html: emailHtml,
        }),
      });
      await sendWhatsApp(paymentId);
    } catch (e) {
      console.error("Invoice error", e);
    }
  };

  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      if (!selectedAddress) saveAddress();
      const res = await fetch("/api/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(finalAmount),
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });
      const { order } = await res.json();
      if (!order) {
        alert("Failed to create order.");
        setIsProcessing(false);
        return;
      }
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Logicology",
        description: `Order for ${product.name}${appliedPromo ? ` | Promo: ${appliedPromo.promoCode}` : ""}${shipping.isGift ? " | 🎁 Gift" : ""}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            setIsPaymentProcessing(true);
            await fetch("/api/save-order-info", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userInfo,
                shipping,
                cart: [
                  {
                    name: product.name,
                    price: product.price,
                    razorpayItemId: product.razorpayItemId,
                    description: product.description,
                    image: product.image,
                    rating: product.rating ?? 5,
                    quantity: 1,
                  },
                ],
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                totalAmount: finalAmount,
                discountAmount: appliedPromo?.discountAmount ?? 0,
                appliedPromo,
                isGift: shipping.isGift,
                isDifferentFromBiller: shipping.isDifferentFromBiller,
              }),
            });
            await sendInvoice(response.razorpay_payment_id);
            onClose();
            setStep(1);
            setSelectedAddress("");
            setAppliedPromo(null);
            localStorage.removeItem("appliedPromo");
            setTimeout(() => {
              setIsPaymentProcessing(false);
              router.push(`/my-orders?paymentId=${response.razorpay_payment_id}`);
            }, 500);
          } catch (e) {
            console.error(e);
            setIsProcessing(false);
            setIsPaymentProcessing(false);
            alert("Payment successful but invoice failed. Contact support with your Payment ID.");
          }
        },
        prefill: { name: userInfo.name, email: userInfo.email, contact: userInfo.phone },
        notes: {
          address: `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pin}`,
          shipping_phone: shipping.phone,
          promo_code: appliedPromo?.promoCode ?? "",
          is_gift: String(shipping.isGift),
          is_different_from_biller: String(shipping.isDifferentFromBiller),
        },
        theme: { color: CORAL },
      };
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        new (window as any).Razorpay(options).open();
      } else {
        alert("Razorpay SDK not loaded");
        setIsProcessing(false);
      }
    } catch (e) {
      console.error(e);
      alert("Checkout error. Please try again.");
      setIsProcessing(false);
    }
  };

  const close = () => {
    if (!isProcessing) {
      onClose();
      setStep(1);
      setSelectedAddress("");
    }
  };

  if (!isOpen) return null;

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
              className="relative z-10 flex flex-col items-center rounded-2xl bg-white p-8 text-center"
              style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
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

      {/* ── Backdrop ── */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />

      {/* ── Drawer panel (Wider, white background) ── */}
      <motion.div
        className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-lg flex-col overflow-hidden bg-white shadow-2xl"
        style={{ boxShadow: "-8px 0 40px rgba(0,0,0,0.08)" }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
      >
        {/* ── Product strip (light version) ── */}
        <div
          className="relative flex flex-shrink-0 items-center gap-4 px-6 py-5"
          style={{ borderBottom: "1px solid #E9ECEF", backgroundColor: "white" }}
        >
          {/* Thumbnail */}
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {/* Info */}
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ color: CORAL }}
            >
              Checkout
            </p>
            <h3 className="truncate text-[15px] font-extrabold" style={{ color: TEXT_PRIMARY }}>
              {product.name}
            </h3>
            <p className="truncate text-[12px]" style={{ color: TEXT_MUTED }}>
              {product.description}
            </p>
          </div>
          {/* Price */}
          <div className="flex-shrink-0 text-right">
            <div className="text-[20px] font-extrabold" style={{ color: TEXT_PRIMARY }}>
              {product.price}
            </div>
            {product.initialprice && (
              <div className="text-xs line-through" style={{ color: TEXT_MUTED }}>
                {product.initialprice}
              </div>
            )}
          </div>
          {/* Close */}
          <button
            onClick={close}
            className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-gray-100"
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

        {/* ── Step bar (light) ── */}
        <div
          className="flex-shrink-0"
          style={{ borderBottom: "1px solid #E9ECEF", backgroundColor: "white" }}
        >
          <StepBar current={step} />
        </div>

        {/* ── Scrollable content (light gray background) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6" style={{ backgroundColor: BG_LIGHT }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {/* ──────────────────── STEP 1: BILLER ──────────────────── */}
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
                          setPhoneError(c.length > 0 && c.length < 10 ? "Must be 10 digits" : "");
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
                    Continue to Shipping
                  </PrimaryBtn>
                </>
              )}

              {/* ──────────────────── STEP 2: SHIPPING ──────────────────── */}
              {step === 2 && (
                <>
                  {/* For me / For someone else */}
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

                  {/* ── FOR ME ── */}
                  {!shipping.isDifferentFromBiller && (
                    <Card>
                      <div className="flex flex-col gap-3.5">
                        {/* Saved addresses */}
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
                                      loadAddress(addr.id);
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
                                    <p className="mt-0.5 text-xs" style={{ color: TEXT_SECONDARY }}>
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
                                        style={{ backgroundColor: `${CORAL}10`, color: CORAL }}
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

                        {(savedAddresses.filter((a) => !a.isDifferentFromBiller).length === 0 ||
                          selectedAddress === "__new__") && (
                          <div className="flex flex-col gap-3">
                            {selectedAddress === "__new__" &&
                              savedAddresses.filter((a) => !a.isDifferentFromBiller).length > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedAddress(
                                      savedAddresses.find((a) => !a.isDifferentFromBiller)?.id || ""
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

                  {/* ── FOR SOMEONE ELSE ── */}
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
                          hint={!shippingPhoneError ? "Required for delivery updates" : undefined}
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
                            onKeyDown={(e) => e.key === "Enter" && validatePromo()}
                            className="flex-1 rounded-lg px-4 py-3 text-sm font-medium outline-none transition-all"
                            style={{ backgroundColor: BG_LIGHT, border: "1.5px solid #E9ECEF" }}
                          />
                          <button
                            onClick={validatePromo}
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
                        style={{ backgroundColor: `${CORAL}08`, border: `1.5px solid ${CORAL}20` }}
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
                          onClick={removePromo}
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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
                          savedAddresses.filter((a) => !a.isDifferentFromBiller).length === 0 &&
                          (!shipping.building || !shipping.street))
                      }
                    >
                      Review Order
                    </PrimaryBtn>
                  </div>
                </>
              )}

              {/* ──────────────────── STEP 3: REVIEW ──────────────────── */}
              {step === 3 && (
                <>
                  {/* Product row */}
                  <Card>
                    <SectionLabel>Order Summary</SectionLabel>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold" style={{ color: TEXT_PRIMARY }}>
                          {product.name}
                        </p>
                        <p className="text-xs" style={{ color: TEXT_MUTED }}>
                          Qty: 1 &nbsp;·&nbsp; {displayPrice}
                        </p>
                        {gstRate > 0 && (
                          <p className="text-[11px]" style={{ color: TEXT_MUTED }}>
                            GST {gstRate}% · HSN {itemDetails?.hsn_code ?? "–"}
                          </p>
                        )}
                      </div>
                      <span
                        className="flex-shrink-0 text-[16px] font-extrabold"
                        style={{ color: TEXT_PRIMARY }}
                      >
                        {displayPrice}
                      </span>
                    </div>
                    {/* Price breakdown */}
                    <div
                      className="mt-4 flex flex-col gap-2 border-t pt-4"
                      style={{ borderColor: "#E9ECEF" }}
                    >
                      {[
                        { label: "Taxable Value", value: `₹${taxableValue.toFixed(2)}` },
                        { label: `GST (${gstRate}%)`, value: `₹${gstAmt.toFixed(2)}` },
                      ].map((r) => (
                        <div
                          key={r.label}
                          className="flex justify-between text-[13px]"
                          style={{ color: TEXT_SECONDARY }}
                        >
                          <span>{r.label}</span>
                          <span>{r.value}</span>
                        </div>
                      ))}
                      {appliedPromo && (
                        <div
                          className="flex justify-between text-[13px] font-semibold"
                          style={{ color: CORAL }}
                        >
                          <span>Promo ({appliedPromo.promoCode})</span>
                          <span>−₹{appliedPromo.discountAmount.toFixed(2)}</span>
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

                  {/* Biller */}
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

                  {/* Shipping */}
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

                  {/* Pay button */}
                  <div className="flex gap-3">
                    <GhostBtn onClick={() => setStep(2)} disabled={isProcessing}>
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </GhostBtn>
                    <PrimaryBtn onClick={handleCheckout} disabled={isProcessing}>
                      {isProcessing ? (
                        <>Processing…</>
                      ) : (
                        <>Pay ₹{finalAmount.toLocaleString("en-IN")}</>
                      )}
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
  );
}
