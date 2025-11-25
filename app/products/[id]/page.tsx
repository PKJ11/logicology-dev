"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import { useCart } from "@/components/CartContext";
import toast from "react-hot-toast";
import { FiInstagram, FiFacebook, FiLinkedin, FiYoutube } from "react-icons/fi";
import Link from "next/link";
import ContactUs from "@/components/ContactUs";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { INDIAN_STATES_AND_UTS } from "@/app/utils/indianStates";
import { trackViewItem, trackAddToCart, trackPurchase, trackButtonClick } from "@/lib/gtag-events";
import {
  trackMetaPixelViewContent,
  trackMetaPixelAddToCart,
  trackMetaPixelPurchase,
  trackMetaPixelInitiateCheckout,
} from "@/lib/meta-pixel-events";

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

// ======================================================
// MAIN PAGE WRAPPER
// ======================================================
export default function PrimeTimeProductPage() {
  const params = useParams();
  const productId = params?.id as string | undefined;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      setLoading(true);
      try {
        const res = await fetch(`/products/api/${productId}`);
        const data = await res.json();
        if (data.success && data.product) {
          const p = data.product;
          const productPrice = p.price || 0;
          const productName = p.title || p.name || "Unknown Product";
          const prodId = p.razorpayItemId || productId;

          setProduct({
            name: productName,
            subtitle: p.subtitle || "",
            description: p.description || "",
            price: p.price ? `₹${p.price}` : "",
            initialprice: p.initialPrice ? `₹${p.initialPrice}` : undefined,
            discount: p.discount || undefined,
            razorpayItemId: p.razorpayItemId || "",
            images: p.images || (p.bannerImage ? [p.bannerImage] : []),
            benefits: p.benefits || "",
            videos: p.videos || [],
            reviews: p.reviews || [],
            bannerImage: p.bannerImage || "",
          });

          // Track view_item event
          trackViewItem(prodId, productName, productPrice, "INR");

          // Track view_item event for Meta Pixel
          trackMetaPixelViewContent("INR", productPrice, [
            {
              id: prodId,
              title: productName,
              category: "Product",
              price: productPrice,
            },
          ]);
        } else {
          toast.error("Product not found");
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
        toast.error("Error loading product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  return (
    <div className="min-h-screen bg-brand-maroon font-sans text-white">
      <NavBar />
      <main className="space-y-0 overflow-x-hidden pb-20 pt-10">
        <ProductSection product={product} loading={loading} />
        <VideoShowcase videos={product?.videos} loading={loading} />
        <ReviewSection reviews={product?.reviews} loading={loading} />
        <BigAddToCartBanner benefits={product?.benefits} />
        <CustomerReviews reviews={product?.reviews} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}

// ======================================================
// CHECKOUT MODAL COMPONENT (Reusable)
// ======================================================
const CheckoutModal = ({
  isOpen,
  onClose,
  product,
  itemDetails,
  mainImage,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  itemDetails: any;
  mainImage: string;
}) => {
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
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const router = useRouter();

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");

  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk";
  // const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_RM7EaWFSnW9Fod";

  // Load saved addresses on component mount
  useEffect(() => {
    const saved = localStorage.getItem("savedAddresses");
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }

    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }

    const savedPromo = localStorage.getItem("appliedPromo");
    if (savedPromo) {
      setAppliedPromo(JSON.parse(savedPromo));
    }
  }, []);

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
        phone: shipping.phone || "",
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

  const validatePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    setIsValidatingPromo(true);
    setPromoError("");

    try {
      const basePrice = itemDetails?.price || parseFloat(product.price.replace(/[^\d.]/g, ""));
      const res = await fetch("/api/validate-promo-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promoCode: promoCode.trim(),
          cartTotal: basePrice,
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

  const sendInteraktWhatsAppMessage = async (
    paymentId: string,
    orderDescription: string,
    razorpayContact?: string
  ) => {
    const phoneNumber = razorpayContact || shipping.phone;

    if (!phoneNumber) {
      console.warn("No phone number available for WhatsApp message");
      return {
        userTracked: false,
        messageSent: false,
        messageId: null,
        error: "No phone number provided",
      };
    }

    let cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    if (cleanedPhoneNumber.startsWith("91") && cleanedPhoneNumber.length === 12) {
      cleanedPhoneNumber = cleanedPhoneNumber.substring(2);
    } else if (cleanedPhoneNumber.startsWith("+91")) {
      cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
    }

    if (cleanedPhoneNumber.length !== 10) {
      console.warn("Invalid phone number format:", phoneNumber);
      return {
        userTracked: false,
        messageSent: false,
        messageId: null,
        error: "Invalid phone number format",
      };
    }

    const countryCode = "+91";
    const shippingAddress = `${shipping.city}, ${shipping.state}`;

    try {
      // Track/Update user in Interakt
      await fetch("https://api.interakt.ai/v1/public/track/users/", {
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
          },
        }),
      });

      // Send WhatsApp message
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
            name: "checkout",
            languageCode: "en",
            bodyValues: [
              userInfo.name,
              product.name,
              finalAmount.toFixed(0),
              shippingAddress,
              paymentId,
              "Logicology",
            ],
          },
        }),
      });

      const messageResult = await messageResponse.json();

      if (!messageResult.id) {
        throw new Error(`Failed to send WhatsApp message: ${JSON.stringify(messageResult)}`);
      }

      return {
        userTracked: true,
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

  const generateGSTReceipt = (discountAmount: number = 0) => {
    const price = itemDetails?.price || parseFloat(product.price.replace(/[^\d.]/g, ""));
    const gstRate = itemDetails?.tax_rate || 0;
    const hsnCode = itemDetails?.hsn_code || "-";

    const gstAmount = gstRate > 0 ? (price * gstRate) / (100 + gstRate) : 0;
    const cgstAmount = gstAmount / 2;
    const sgstAmount = gstAmount / 2;
    const basePrice = price - gstAmount;
    const totalAmount = price;
    const grandTotal = totalAmount - discountAmount;

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
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 10px; text-align: center;">1</td>
            <td style="padding: 10px;">${product.name}</td>
            <td style="padding: 10px; text-align: center;">${hsnCode}</td>
            <td style="padding: 10px; text-align: center;">1</td>
            <td style="padding: 10px; text-align: right;">₹${basePrice.toFixed(2)}</td>
            <td style="padding: 10px; text-align: center;">${gstRate}%</td>
            <td style="padding: 10px; text-align: right;">₹${gstAmount.toFixed(2)}</td>
            <td style="padding: 10px; text-align: right;">₹${totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <!-- GST Breakdown -->
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #0A8A80; margin-top: 0;">GST Breakdown</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          ${cgstAmount > 0 ? `<div>CGST:</div><div style="text-align: right;">₹${cgstAmount.toFixed(2)}</div>` : ""}
          ${sgstAmount > 0 ? `<div>SGST:</div><div style="text-align: right;">₹${sgstAmount.toFixed(2)}</div>` : ""}
          ${discountAmount > 0 ? `<div style="color: #e53e3e;">Discount:</div><div style="color: #e53e3e; text-align: right;">-₹${discountAmount.toFixed(2)}</div>` : ""}
          <div style="font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">Total GST:</div>
          <div style="font-weight: bold; text-align: right; border-top: 1px solid #ddd; padding-top: 5px;">₹${gstAmount.toFixed(2)}</div>
        </div>
      </div>

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
  };

  const sendGSTInvoice = async (
    paymentId: string,
    orderDescription: string,
    razorpayContact?: string
  ) => {
    try {
      const gstReceiptHtml = generateGSTReceipt(appliedPromo?.discountAmount || 0);

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
                <strong style="color: #333;">Customer Name:</strong><br>
                <span style="color: #666;">${userInfo.name}</span>
              </div>
              <div>
                <strong style="color: #333;">Contact Email:</strong><br>
                <span style="color: #666;">${userInfo.email}</span>
              </div>
              ${
                appliedPromo
                  ? `
              <div>
                <strong style="color: #333;">Promo Code Applied:</strong><br>
                <span style="color: #666;">${appliedPromo.promoCode} (Saved ₹${appliedPromo.discountAmount})</span>
              </div>
              `
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

      const HOSTINGER_EMAIL = process.env.HOSTINGER_EMAIL || "orders@logicology.in";
      const emailRes = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: [userInfo.email, HOSTINGER_EMAIL],
          subject: `Logicology GST Invoice - Payment Confirmed (${paymentId})`,
          html: emailHtml,
        }),
      });

      await emailRes.json();

      try {
        await sendInteraktWhatsAppMessage(paymentId, orderDescription, razorpayContact);
      } catch (whatsappError) {
        console.error("WhatsApp message failed:", whatsappError);
      }

      return { success: true, emailSent: true };
    } catch (error: any) {
      console.error("Error sending GST invoice:", error);
      return { success: false, error: error.message };
    }
  };

  const handleCheckout = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // Validate required fields
      if (!userInfo.name || !userInfo.email) {
        alert("Please fill in all contact information");
        setStep(1);
        setIsProcessing(false);
        return;
      }

      if (
        !shipping.name ||
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

      // Save address if this is a new one
      if (!selectedAddress) {
        saveAddressToLocalStorage();
      }

      // Calculate final amount
      const basePrice = itemDetails?.price || parseFloat(product.price.replace(/[^\d.]/g, ""));
      const finalAmount = appliedPromo?.finalAmount || basePrice;

      // Amount in paise
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

      const orderDescription = `Order for ${product.name}${appliedPromo ? ` | Promo: ${appliedPromo.promoCode}` : ""}`;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Logicology",
        description: orderDescription,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            setIsPaymentProcessing(true);

            // Create cart item for order saving
            const cartItem = {
              name: itemDetails?.name || product.name,
              price: product.price,
              initialprice: product.initialprice,
              razorpayItemId: product.razorpayItemId,
              description: itemDetails?.description || product.description,
              image: mainImage,
              rating: 5,
              quantity: 1,
            };

            // Track purchase event for Meta Pixel
            trackMetaPixelPurchase(
              "INR",
              finalAmount,
              [
                {
                  item_id: product.razorpayItemId,
                  title: itemDetails?.name || product.name,
                  price: itemDetails?.price || parseFloat(product.price.replace(/[^\d.]/g, "")),
                  quantity: 1,
                },
              ],
              response.razorpay_payment_id
            );

            // Save order info
            await fetch("/api/save-order-info", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userInfo,
                shipping,
                cart: [cartItem],
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                razorpayDesc: orderDescription,
                razorpayContact: response.razorpay_contact,
                totalAmount: finalAmount,
                discountAmount: appliedPromo?.discountAmount || 0,
                appliedPromo: appliedPromo,
              }),
            });

            // Send GST invoice
            await sendGSTInvoice(
              response.razorpay_payment_id,
              orderDescription,
              response.razorpay_contact
            );

            // Reset states
            onClose();
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
        },
        notes: {
          address: `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pin}`,
          shipping_phone: shipping.phone,
          promo_code: appliedPromo?.promoCode || "",
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
  };

  const closeCheckoutModal = () => {
    if (!isProcessing) {
      onClose();
      setStep(1);
      setSelectedAddress("");
    }
  };

  // Calculate price for display
  const displayPrice = itemDetails?.price
    ? `₹${itemDetails.price.toLocaleString("en-IN")}`
    : product.price;

  const finalAmount =
    appliedPromo?.finalAmount ||
    itemDetails?.price ||
    parseFloat(product.price.replace(/[^\d.]/g, ""));

  if (!isOpen) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* Payment Processing Overlay */}
      {isPaymentProcessing && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md" />
          <div className="relative z-10 flex flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Processing Payment</h3>
            <p className="mb-4 text-center text-gray-600">
              Please wait while we process your payment and generate your invoice...
            </p>
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

      {/* Checkout Modal */}
      <div className="fixed inset-0 z-50 flex text-black">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeCheckoutModal}
        />

        <div
          className={`fixed inset-y-0 right-0 z-[100] w-full max-w-md transform bg-white shadow-xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="mt-20 flex items-center justify-between border-b border-gray-200 px-6 py-4">
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Step 1: Contact Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <input
                        required
                        type="text"
                        placeholder="Full Name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo((u) => ({ ...u, name: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="mt-4">
                        <input
                          required
                          type="email"
                          placeholder="Email Address"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo((u) => ({ ...u, email: e.target.value }))}
                          onBlur={(e) => {
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
                            You will receive the receipts on this e-mail id
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={
                        !userInfo.name || !userInfo.email || !/\S+@\S+\.\S+/.test(userInfo.email)
                      }
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

                      <input
                        type="tel"
                        placeholder="Shipping Phone Number"
                        value={shipping.phone}
                        onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* Promo Code Section */}
                    <div className="rounded-xl border border-gray-200 p-4">
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
                              <p className="text-sm text-green-600">
                                You saved ₹{appliedPromo.discountAmount}!
                              </p>
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
                          !shipping.name ||
                          !shipping.address ||
                          !shipping.pin ||
                          !shipping.city ||
                          !shipping.state
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img
                              src={mainImage}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{displayPrice} × 1</p>
                              <p className="text-xs text-gray-500">
                                GST: {itemDetails?.tax_rate || 0}% | HSN:{" "}
                                {itemDetails?.hsn_code || "-"}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">{displayPrice}</p>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="mt-4 border-t pt-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Item Total:</span>
                            <span>{displayPrice}</span>
                          </div>
                          {appliedPromo && (
                            <>
                              <div className="flex justify-between text-green-600">
                                <span>Discount ({appliedPromo.promoCode}):</span>
                                <span>-₹{appliedPromo.discountAmount}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Final Amount:</span>
                                <span>₹{finalAmount}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between border-t pt-2 text-lg font-bold">
                            <span>Total Amount:</span>
                            <span>₹{finalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Preview */}
                    <div className="rounded-xl bg-gray-50 p-4">
                      <h3 className="mb-2 font-semibold text-gray-900">Contact Information</h3>
                      <p className="font-medium text-gray-900">{userInfo.name}</p>
                      <p className="mt-1 text-sm text-gray-600">{userInfo.email}</p>
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
                        {isProcessing ? "Processing..." : `Pay ₹${finalAmount}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ======================================================
// 1️⃣ PRODUCT HERO SECTION (MAROON)
// ======================================================
const ProductSection = ({ product, loading }: { product?: any; loading?: boolean }) => {
  const [itemDetails, setItemDetails] = useState<{
    name?: string;
    price?: number;
    description?: string;
    razorpayItemId?: string;
    tax_rate?: number;
    hsn_code?: string;
  } | null>(null);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // fallback product while loading or if API fails
  const fallback = {
    name: "Prime Time™ – Math Strategy Game",
    subtitle: "Strategic Math Game for All Ages",
    description:
      "A lightning-quick numbers game that rewards smart matching and prime-factor insights. Perfect for 2–6 players, ages 8+.",
    price: "₹1,499",
    initialprice: "₹2,499",
    discount: "40%",
    razorpayItemId: "prime-time-logicology-01",
    images: [
      "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png",
      "https://ik.imagekit.io/pratik11/PRIME-TIME-FOLD-2-IMAGE.png",
      "https://ik.imagekit.io/pratik11/g3.jpg",
      "https://ik.imagekit.io/pratik11/g4.jpg",
      "https://ik.imagekit.io/pratik11/g2.jpg",
    ],
  };

  // Use product if available, otherwise fallback
  const current = product || fallback;

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    } else {
      setMainImage(fallback.images[0]);
    }
  }, [product]);

  useEffect(() => {
    async function fetchItemDetails() {
      if (!product?.razorpayItemId) return;
      try {
        const res = await fetch("/api/razorpay-items");
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          const found = data.items.find((item: any) => item.id === product.razorpayItemId);
          if (found) {
            setItemDetails({
              name: found.name,
              tax_rate: found.tax_rate,
              hsn_code: found.hsn_code,
              price: found.amount,
              description: found.description,
              razorpayItemId: found.id,
            });
          }
        }
      } catch (e) {
        console.error("Error fetching item details:", e);
      }
    }
    fetchItemDetails();
  }, [product?.razorpayItemId]);

  const handleAddToCart = () => {
    let priceToUse = current.price;
    if (itemDetails?.price) {
      priceToUse = `₹${itemDetails.price.toLocaleString("en-IN")}`;
    }

    // Track add_to_cart event
    trackAddToCart(
      current.razorpayItemId,
      itemDetails?.name || current.name,
      itemDetails?.price || parseFloat(current.price.replace(/[^\d.]/g, "")),
      1,
      "INR"
    );

    // Track add_to_cart event for Meta Pixel
    trackMetaPixelAddToCart(
      "INR",
      itemDetails?.price || parseFloat(current.price.replace(/[^\d.]/g, "")),
      [
        {
          item_id: current.razorpayItemId,
          title: itemDetails?.name || current.name,
          price: itemDetails?.price || parseFloat(current.price.replace(/[^\d.]/g, "")),
          quantity: 1,
        },
      ]
    );

    addToCart({
      name: itemDetails?.name || current.name,
      price: priceToUse || current.price,
      initialprice: current.initialprice,
      description: itemDetails?.description || current.description,
      image: mainImage,
      razorpayItemId: current.razorpayItemId,
      rating: 5,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    // Track button click
    trackButtonClick("buy_now_btn", "product_page_hero");

    // Track checkout initiation for Meta Pixel
    trackMetaPixelInitiateCheckout(
      "INR",
      itemDetails?.price || parseFloat(current.price.replace(/[^\d.]/g, "")),
      1
    );

    setIsCheckoutModalOpen(true);
  };

  // Calculate display price
  const displayPrice = itemDetails?.price
    ? `₹${itemDetails.price.toLocaleString("en-IN")}`
    : current.price;

  // Show loading state
  if (loading) {
    return (
      <section className="w-full border-b-4 border-gray-300 bg-[#6d2e46] py-16">
        <div className="mx-auto grid max-w-[90vw] grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="flex justify-center">
            <div className="aspect-[4/5] w-[95%] animate-pulse overflow-hidden rounded-[40px] border-[20px] border-white bg-white">
              <div className="flex h-full w-full gap-4 p-4">
                <div className="relative flex-[4] overflow-hidden rounded-[30px] bg-gray-300"></div>
                <div className="flex flex-[1] flex-col gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1 rounded-[25px] bg-gray-300"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="text-white">
            <div className="mb-4 h-10 animate-pulse rounded bg-gray-300"></div>
            <div className="mb-6 h-20 animate-pulse rounded bg-gray-300"></div>
            <div className="h-8 w-1/3 animate-pulse rounded bg-gray-300"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        product={current}
        itemDetails={itemDetails}
        mainImage={mainImage}
      />

      <section className="w-full border-b-4 border-gray-300 bg-[#6d2e46] py-16">
        <div className="mx-auto grid max-w-[90vw] grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* LEFT — WHITE OUTER FRAME WITH REAL IMAGES FROM API */}
          <div className="flex justify-center">
            {/* OUTER WHITE FRAME */}
            <div className="aspect-[4/5] w-[95%] overflow-hidden rounded-[40px] border-[20px] border-white bg-white">
              {/* INNER TWO-COLUMN LAYOUT */}
              <div className="flex h-full w-full gap-4 p-4">
                {/* LEFT: MAIN IMAGE CONTAINER (≈80%) */}
                <div className="relative flex-[4] overflow-hidden rounded-[30px]">
                  <Image
                    src={mainImage}
                    alt="Prime Time Game Image"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* RIGHT: THUMBNAIL COLUMN (≈15%) */}
                <div className="flex flex-[1] flex-col gap-4">
                  {current.images && current.images.length > 0
                    ? current.images.slice(0, 4).map((src: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setMainImage(src)}
                          className={`relative w-full flex-1 overflow-hidden rounded-[25px] border-[3px] transition-all ${
                            mainImage === src
                              ? "scale-105 border-[#b44b73]"
                              : "border-white hover:border-[#b44b73]"
                          } `}
                        >
                          <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-white">
                            <Image src={src} alt={`thumbnail-${i}`} fill className="object-cover" />
                          </div>
                        </button>
                      ))
                    : // Fallback thumbnails if no images from API
                      fallback.images.slice(0, 4).map((src: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setMainImage(src)}
                          className={`relative w-full flex-1 overflow-hidden rounded-[25px] border-[3px] transition-all ${
                            mainImage === src
                              ? "scale-105 border-[#b44b73]"
                              : "border-white hover:border-[#b44b73]"
                          } `}
                        >
                          <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-white">
                            <Image src={src} alt={`thumbnail-${i}`} fill className="object-cover" />
                          </div>
                        </button>
                      ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — TEXT + PRICING */}
          <div className="text-white">
            <h1 className="font-heading text-4xl font-bold leading-tight">{current.name}</h1>
            {current.subtitle && (
              <p className="font-heading text-4xl font-bold leading-tight">{current.subtitle}</p>
            )}

            <p className="mt-4 font-sans text-lg opacity-90">{current.description}</p>

            <div className="mb-6 mt-6 w-full border-t border-white/30"></div>

            {/* PRICE ROW */}
            <div className="flex items-center gap-4">
              <p className="font-heading text-4xl font-bold">{displayPrice}</p>
              {current.initialprice && (
                <p className="font-sans text-xl text-gray-300 line-through">
                  {current.initialprice}
                </p>
              )}
              {current.discount && (
                <span className="rounded-md bg-white px-3 py-1 font-sans text-sm font-bold text-[#6d2e46]">
                  SAVE {current.discount}
                </span>
              )}
            </div>

            {/* GST/HSN Details if available */}
            {itemDetails && (
              <div className="mt-2 font-sans text-xs text-white/80">
                GST: {itemDetails.tax_rate ? `${itemDetails.tax_rate}%` : "0%"} &nbsp; | &nbsp; HSN:{" "}
                {itemDetails.hsn_code || "-"}
              </div>
            )}

            <p className="mt-1 font-sans text-sm text-white/80">(Inclusive of all taxes)</p>

            {/* BUY NOW AND ADD TO CART BUTTONS */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleBuyNow}
                className="flex-1 rounded-full bg-orange-500 px-10 py-3 font-sans text-lg font-semibold text-white shadow-lg transition-all hover:bg-orange-600"
              >
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                className={`flex-1 rounded-full px-10 py-3 font-sans text-lg font-semibold shadow-lg transition-all ${
                  added
                    ? "scale-105 bg-[#b44b73] text-white"
                    : "bg-[#b44b73] text-white hover:bg-white hover:text-[#6d2e46]"
                }`}
              >
                {added ? "✓ Added to cart" : "Add to cart"}
              </button>
            </div>

            <p className="mt-3 font-sans text-sm text-white">
              🚚 Free shipping • Delivers in 3–5 days
            </p>

            <div className="mb-6 mt-6 w-full border-t border-white/30"></div>

            {/* ICON ROW */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-10">
              {["Ages 8+", "2–6 players", "15-30 mins", "Math Skills"].map((label, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b44b73] text-2xl text-white sm:h-[65px] sm:w-[65px] sm:text-3xl">
                    {i === 0 ? "👦" : i === 1 ? "👥" : i === 2 ? "⏱️" : "🧮"}
                  </div>
                  <p className="mt-2 font-sans text-xs sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// ======================================================
// 2️⃣ VIDEO SHOWCASE (GREY)
// ======================================================
const VideoShowcase = ({ videos, loading }: { videos?: any[]; loading?: boolean }) => {
  const defaults = [
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_2.mp4?updatedAt=1756253482407",
      thumbnail: "https://ik.imagekit.io/pratik11/1.1.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_1.mp4?updatedAt=1756253492642",
      thumbnail: "https://ik.imagekit.io/pratik11/1.2.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_3.mp4?updatedAt=1756253493297",
      thumbnail: "https://ik.imagekit.io/pratik11/1.3.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445",
      thumbnail: "https://ik.imagekit.io/pratik11/2.1.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_2.mp4?updatedAt=1756253535887",
      thumbnail: "https://ik.imagekit.io/pratik11/2.2.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_3.mp4?updatedAt=1756253528805",
      thumbnail: "https://ik.imagekit.io/pratik11/2.3.jpg?updatedAt=1758361316632",
    },
  ];

  // Use API videos if available, otherwise defaults
  const list =
    videos && videos.length > 0
      ? videos.map((v: any, idx: number) => ({
          video: typeof v === "string" ? v : v.video || v.url || "",
          thumbnail:
            typeof v === "string"
              ? ""
              : v.thumbnail || v.thumb || (defaults[idx] ? defaults[idx].thumbnail : ""),
        }))
      : defaults;

  if (loading) {
    return (
      <section className="w-full border-b-4 border-gray-300 bg-gray-100 py-16">
        <div className="mx-auto max-w-[85vw]">
          <div className="rounded-3xl bg-white px-2 py-12 shadow-lg md:px-12">
            <div className="mx-auto mb-10 h-8 w-64 animate-pulse rounded bg-gray-300"></div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-card aspect-[9/16] w-64 flex-shrink-0 animate-pulse bg-gray-300 md:w-72"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full border-b-4 border-gray-300 bg-gray-100 py-16" id="video-showcase">
      <div className="mx-auto max-w-[85vw]">
        <div className="rounded-3xl bg-white px-2 py-12 shadow-lg md:px-12">
          <h2 className="headingstyle mb-10 text-center font-heading font-bold text-gray-800">
            Watch Prime Time™ in Action
          </h2>

          {list.length > 0 ? (
            <div className="flex snap-x gap-6 overflow-x-auto pb-4">
              {list.map((v: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-card relative aspect-[9/16] w-64 flex-shrink-0 snap-center overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-xl md:w-72"
                >
                  <video
                    src={v.video}
                    poster={v.thumbnail || (defaults[idx] ? defaults[idx].thumbnail : "")}
                    controls
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No videos available</p>
          )}
        </div>
      </div>
    </section>
  );
};

// ======================================================
// 3️⃣ SHORT REVIEWS SECTION (MAROON)
// =====================================================
const ReviewSection = ({ reviews, loading }: { reviews?: any[]; loading?: boolean }) => {
  const defaultReviews = [
    {
      name: "Riya",
      text: "Prime Time™ makes math fun and interactive. My kids actually compete to find factors!",
      rating: 5,
    },
    {
      name: "Arjun",
      text: "A brilliant blend of learning and laughter. Family game nights got a whole new twist!",
      rating: 5,
    },
    {
      name: "Meera",
      text: "No screens, just logic and fun. It's addictive and educational — perfect combo!",
      rating: 5,
    },
  ];

  const reviewList = reviews && reviews.length > 0 ? reviews.slice(0, 4) : defaultReviews;

  if (loading) {
    return (
      <section className="w-full border-b-4 border-gray-300 bg-[#6d2e46] py-10 md:py-20">
        <div className="mx-auto flex w-[90%] flex-col gap-8 md:w-[60%] md:gap-16">
          <div className="mb-8 block md:hidden">
            <div className="mx-auto h-8 w-48 animate-pulse rounded bg-white/20"></div>
          </div>

          <div className="flex flex-col justify-around gap-6 md:flex-row md:gap-0">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-32 w-full animate-pulse rounded-3xl bg-white/10 md:w-[350px]"
              ></div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-around gap-6 md:flex-row md:gap-0">
            <div className="h-32 w-full animate-pulse rounded-3xl bg-white/10 md:w-[350px]"></div>
            <div className="hidden h-8 w-48 animate-pulse rounded bg-white/20 md:block"></div>
            <div className="h-32 w-full animate-pulse rounded-3xl bg-white/10 md:w-[350px]"></div>
          </div>
          <div className="flex flex-col justify-around gap-6 md:flex-row md:gap-0">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-32 w-full animate-pulse rounded-3xl bg-white/10 md:w-[350px]"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full border-b-4 border-gray-300 bg-[#6d2e46] py-10 md:py-20">
      <div className="mx-auto flex w-[90%] flex-col gap-8 md:w-[60%] md:gap-16">
        <div className="mb-6 block md:hidden">
          <h2 className="text-center font-heading text-4xl font-bold text-white md:text-3xl">
            What Our Customers Say
          </h2>
        </div>

        <div className="flex flex-col justify-around gap-6 md:flex-row md:gap-0">
          <ReviewCard review={reviewList[0]} />
          <ReviewCard review={reviewList[1]} />
        </div>

        <div className="flex flex-col items-center justify-around gap-6 md:flex-row md:gap-0">
          <ReviewCard review={reviewList[2]} />

          <h2 className="mx-6 hidden text-center font-heading text-4xl font-bold text-white md:block">
            What Our <br /> Customers Say
          </h2>

          <ReviewCard review={reviewList[3] || reviewList[0]} />
        </div>

        <div className="flex flex-col justify-around gap-6 md:flex-row md:gap-0">
          <ReviewCard review={reviewList[0]} />
          <ReviewCard review={reviewList[1]} />
        </div>
      </div>
    </section>
  );
};

type ReviewProps = {
  review: {
    name: string;
    text: string;
    rating?: number;
    image?: string;
  };
};

const ReviewCard = ({ review }: ReviewProps) => (
  <div className="flex w-[350px] gap-4 rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-lg">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="white"
        className="h-7 w-7 opacity-90"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"
        />
      </svg>
    </div>

    <div className="flex flex-col">
      <p className="font-sans text-sm font-semibold text-white">{review.name}</p>
      <p className="mt-1 w-[85%] font-sans text-xs leading-snug text-white/80">{review.text}</p>
      <div className="mt-3 flex gap-1 text-base text-yellow-300">
        {review.rating ? "★".repeat(review.rating) + "☆".repeat(5 - review.rating) : "★★★★☆"}
      </div>
    </div>
  </div>
);

// ======================================================
// 4️⃣ BIG ADD-TO-CART CTA (GREY)
// ======================================================
const BigAddToCartBanner = ({ benefits }: { benefits?: string }) => {
  const img = "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png";

  return (
    <section className="w-full border-b-4 border-gray-300 bg-gray-100 py-20">
      <div className="mx-auto max-w-[85vw]">
        <div className="rounded-3xl bg-white px-2 py-12 shadow-lg md:px-12">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div className="text-left">
              <h2 className="headingstyle mb-10 font-heading font-bold text-gray-800">
                How you
                <br />
                Benefit?
              </h2>
              <p className="mt-4 max-w-sm font-sans text-gray-600">
                {benefits ||
                  "At Logicology we endeavour to make learning fun so that children learn while they play."}
              </p>
              <button
                className="mt-6 rounded-full bg-[#6d2e46] px-6 py-2 font-sans text-white transition hover:bg-[#b44b73]"
                onClick={() => {
                  document.getElementById("video-showcase")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Learn more
              </button>
            </div>

            <div className="flex justify-center">
              <div className="aspect-square w-[90%] overflow-hidden rounded-[35px] border-[12px] border-[#6d2e46] p-3">
                <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-white">
                  <Image src={img} alt="Benefit Image" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ======================================================
// 5️⃣ DETAILED REVIEWS SECTION (MAROON)
// ======================================================
const CustomerReviews = ({ reviews, loading }: { reviews?: any[]; loading?: boolean }) => {
  const defaultReviews = [
    {
      name: "Shaheen Taj",
      verified: true,
      rating: 5,
      date: "10/04/2025",
      text: "Prime Time™ is an amazing educational board game — teaches math logic playfully.",
    },
    {
      name: "Karishma",
      verified: true,
      rating: 5,
      date: "10/01/2025",
      text: "Very enjoyable for kids and adults. Smooth gameplay and clever concept!",
    },
  ];

  const reviewList = reviews && reviews.length > 0 ? reviews : defaultReviews;

  const totalReviews = reviewList.length;
  const overallRating =
    totalReviews > 0
      ? (reviewList.reduce((sum, review) => sum + (review.rating || 5), 0) / totalReviews).toFixed(
          1
        )
      : "4.8";

  const ratingBreakdown = [
    { stars: 5, count: reviewList.filter((r) => r.rating === 5).length },
    { stars: 4, count: reviewList.filter((r) => r.rating === 4).length },
    { stars: 3, count: reviewList.filter((r) => r.rating === 3).length },
    { stars: 2, count: reviewList.filter((r) => r.rating === 2).length },
    { stars: 1, count: reviewList.filter((r) => r.rating === 1).length },
  ];

  if (loading) {
    return (
      <section className="w-full bg-[#6d2e46] py-16">
        <div className="mx-auto max-w-[85vw]">
          <div className="mx-auto mb-14 h-8 w-64 animate-pulse rounded bg-white/20"></div>
          <div className="rounded-card mb-16 animate-pulse border border-gray-300 bg-white/10 p-10 shadow-xl">
            <div className="h-24 rounded bg-white/20"></div>
          </div>
          <div className="space-y-10">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border-b border-white/20 pb-8">
                <div className="h-20 animate-pulse rounded bg-white/10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#6d2e46] py-16">
      <div className="mx-auto max-w-[85vw]">
        <h2 className="mb-14 text-center font-heading text-3xl font-bold">Customer Reviews</h2>

        {totalReviews > 0 ? (
          <>
            <div className="rounded-card mb-16 border border-gray-300 bg-white/10 p-10 shadow-xl">
              <div className="flex flex-col items-center gap-10 md:flex-row">
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2 flex justify-center gap-2 text-2xl text-brand-yellow md:justify-start">
                    {"★".repeat(5)}
                  </div>
                  <p className="font-heading text-xl font-semibold">{overallRating} out of 5</p>
                  <p className="mt-1 font-sans text-sm text-white/70">
                    Based on {totalReviews} reviews
                  </p>
                </div>

                <div className="w-full flex-1 space-y-2">
                  {ratingBreakdown.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-12 font-sans text-sm">{item.stars}★</span>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-3 bg-brand-yellow"
                          style={{ width: `${(item.count / totalReviews) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-10 font-sans text-sm">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {reviewList.map((r, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between border-b border-white/20 pb-8 md:flex-row"
                >
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-brand-yellow">
                      {r.rating ? "★".repeat(r.rating) + "☆".repeat(5 - r.rating) : "★★★★★"}
                      <span className="ml-2 font-sans font-semibold text-white">{r.name}</span>
                      <span className="rounded bg-white px-2 py-0.5 font-sans text-xs font-bold text-brand-maroon">
                        Verified
                      </span>
                    </div>
                    <p className="max-w-3xl font-sans text-sm text-white/90">{r.text}</p>
                  </div>
                  <p className="mt-4 font-sans text-sm text-white/70 md:mt-0">
                    {r.date || new Date().toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-white/70">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </section>
  );
};

// ======================================================
// FOOTER COMPONENT
// ======================================================
const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  return (
    <>
      <footer id="footer">
        <div className="bg-brand-maroonDark text-white">
          <div className="mx-auto max-w-[74vw] px-4 py-12 sm:px-6">
            <div className="grid items-start gap-10 md:grid-cols-4">
              <div className="relative h-auto w-[200px]">
                <Image
                  src="https://ik.imagekit.io/pratik2002/LOGICOLOGY%20NEW%20LOGO%20WHITE%20COLOR%20VERSION%20VARIATION%201.png?updatedAt=1757316882239"
                  alt="Logicology Logo"
                  width={250}
                  height={160}
                  className="object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
                <div>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/shipping" className="hover:underline">
                        Shipping Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy-policy" className="hover:underline">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/cancellation-refund-policy" className="hover:underline">
                        Refund Policy
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link href="/about" className="hover:underline">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" className="hover:underline">
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold">Follow us</p>
                  <div className="mt-3 flex items-center gap-3 text-lg">
                    <Link
                      aria-label="Instagram"
                      href="https://www.instagram.com/logicology_/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiInstagram />
                    </Link>
                    <Link
                      aria-label="Facebook"
                      href="https://www.facebook.com/Logicology"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiFacebook />
                    </Link>
                    <Link
                      aria-label="LinkedIn"
                      href="https://www.linkedin.com/company/11215891/admin/dashboard/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiLinkedin />
                    </Link>
                    <Link
                      aria-label="Youtube"
                      href="https://www.youtube.com/c/logicology/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-transparent bg-white/10 p-2 transition hover:border-white/10 hover:bg-white hover:text-[#0B3F44]"
                    >
                      <FiYoutube />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 py-4 text-center text-sm text-slate-600">
          Copyright © by Logicology 2025. All rights reserved.
        </div>
      </footer>

      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative h-[75vh] max-h-[80vh] w-[60vw] max-w-[60vw] overflow-hidden rounded-xl bg-white">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-md hover:text-gray-700"
            >
              &times;
            </button>
            <div className="h-full overflow-y-auto">
              <ContactUs />
            </div>
          </div>
        </div>
      )}

      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative flex h-[40vh] w-[60vw] max-w-[60vw] flex-col items-center justify-center overflow-hidden rounded-xl bg-white px-6 text-center text-black">
            <button
              onClick={() => setIsPhoneModalOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-md hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="mb-2 text-2xl font-bold">Call Us</h2>
            <p className="text-xl font-semibold">
              <a href="tel:+918446980747" className="text-brand-teal hover:underline">
                +91 8446980747
              </a>
            </p>
            <p className="mt-4 text-sm text-gray-600">We're happy to assist you.</p>
          </div>
        </div>
      )}
    </>
  );
};
