"use client";

declare global {
  interface Window {
    Razorpay?: any;
    fbq?: (...args: any[]) => void;
  }
}

import Image from "next/image";
import React from "react";
import Script from "next/script";
import { useCart } from "@/components/CartContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Sample product data
const products = [
  {
    name: "Prime Time",
    price: "₹1,499",
    initialprice: undefined,
    razorpayItemId: "item_RNn1BJlJAJ9sM8",
    description: "Prime Time Board Game",
    image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
    rating: 5,
    specialOffer: "", // Empty string for others
  },
  {
    name: "Logicoland - Volume 1",
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_RNn0h9rGIq8zOL",
    description: "Logicoland Volume 1",
    image: "https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913",
    rating: 5,
    specialOffer: "", // Empty string for others
  },
  {
    name: "Logicoland Volume 1 Bundle - 20 Books",
    price: "₹4000",
    initialprice: undefined,
    razorpayItemId: "item_RVa7Osutc07pfB",
    description:
      "Perfect return gift, buy a set of 20 Logicoland books together for just 4000, which is 200 per copy.",
    image: "https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913",
    rating: 5,
    specialOffer: "", // Empty string for others
  },
  {
    name: "Turn the Tables",
    price: "₹399",
    initialprice: "", // Fixed to show ₹399 only
    razorpayItemId: "item_RsD9AhoF8idQ21",
    description:
      "An exciting multiplication-based card game where players match numbers on cards to outplay their opponents. Special strategy cards like Wild, Up, Down, Turn, and Streak add twists that keep the game fresh and unpredictable.",
    image:
      "https://ik.imagekit.io/pratik11/TURN%20THE%20TABLE%20%20BOX%20MOCKUP.png?updatedAt=1757747148360",
    rating: 5,
    specialOffer: "Pay for 1 set and we will ship 2 sets for you!", // Special offer text
  },
  {
    name: "Logicoland - Volume 2",
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_S4UBymXQ91Vmk4",
    description: "Logicoland Volume 2",
    image: "https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913",
    rating: 5,
    specialOffer: "",
  },
  {
    name: "Logicoland Volume 2 Bundle - 20 Books",
    price: "₹4000",
    initialprice: "₹4000",
    razorpayItemId: "item_S4UDQe8qCtOp21",
    description: "Perfect return gift, buy a set of 20 Logicoland Volume 2 books together for just 4000, which is 200 per copy.",
    image: "https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913",
    rating: 5,
    specialOffer: "",
  },
];

const ProductShowcase = () => {
  const { addToCart } = useCart();
  const [itemDetails, setItemDetails] = useState<
    Record<string, { tax_rate?: number; hsn_code?: string }>
  >({});
  const router = useRouter();

  useEffect(() => {
    async function fetchAllItems() {
      try {
        const res = await fetch("/api/razorpay-items");
        const data = await res.json();
        console.log("[Razorpay API Response]", data);
        if (data.success && Array.isArray(data.items)) {
          // Map item details by item ID
          const details: Record<string, { tax_rate?: number; hsn_code?: string }> = {};
          for (const item of data.items) {
            console.log(
              `[Item] id: ${item.id}, name: ${item.name}, description: ${item.description}, amount: ${item.amount}, currency: ${item.currency}, hsn_code: ${item.hsn_code}, tax_rate: ${item.tax_rate}`
            );
            details[item.id] = { tax_rate: item.tax_rate, hsn_code: item.hsn_code };
          }
          setItemDetails(details);
        }
      } catch (e) {
        console.error("[Razorpay API Error]", e);
      }
    }
    fetchAllItems();
  }, []);

  // Calculate price with GST breakdown
  const calculatePriceWithGST = (price: string, taxRate: number = 0) => {
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ""));
    const gstAmount = (numericPrice * taxRate) / (100 + taxRate);
    const basePrice = numericPrice - gstAmount;
    return {
      basePrice: basePrice.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      total: numericPrice.toFixed(2),
    };
  };

  // Handle image click for Prime Time product
  const handleImageClick = (productName: string) => {
    if (productName === "Prime Time") {
      router.push("products/691ae2894bd7d41a1fd0c785");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <section className="bg-[#6A294D] py-16 text-center text-white">
        <h2 className="mb-4 text-4xl font-bold">Our Products</h2>
        <p className="mx-auto mb-12 max-w-xl text-lg">
          At Logicology we endeavour to make learning fun so that children learn while they play.
        </p>

        {/* Product Cards */}
        <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-8">
          {products.map((product, index) => {
            const details = itemDetails[product.razorpayItemId] || {};
            const gstRate = details.tax_rate;
            const priceBreakdown = calculatePriceWithGST(product.price, gstRate);
            console.log("details", details);
            console.log("gst rate", gstRate);
            console.log(`[Product Render]`, {
              product,
              razorpayDetails: details,
              priceBreakdown,
            });

            return (
              <div
                key={index}
                className="mx-auto flex w-full max-w-md flex-row rounded-2xl bg-white p-3 shadow-md"
              >
                {/* Left: Image */}
                <div
                  className="flex h-28 w-28 flex-shrink-0 cursor-pointer items-center justify-center"
                  onClick={() => handleImageClick(product.name)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={112}
                    height={112}
                    className="h-28 w-28 rounded-xl object-cover"
                  />
                </div>

                {/* Right: Details */}
                <div className="flex flex-1 flex-col justify-center pl-4 text-left">
                  <h3 className="mb-1 text-lg font-bold text-brand-teal">{product.name}</h3>
                  <div className="mb-0.5 text-yellow-400">{"★".repeat(product.rating)}</div>

                  {/* Price Display */}
                  <div className="flex items-center">
                    <div className="mb-2 text-base font-semibold text-brand-teal">
                      {product.price}
                    </div>
                    {product.initialprice && (
                      <div className="mb-2 pl-2 text-base text-gray-500 line-through">
                        {product.initialprice}
                      </div>
                    )}
                  </div>

                  {/* Special Offer Text - Only show if not empty */}
                  {product.specialOffer && (
                    <div className="mb-2">
                      <div className="inline-flex items-center rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 text-xs font-bold text-white">
                        🎁 SPECIAL OFFER
                      </div>
                      <p className="mt-1 text-xs font-medium text-green-700">
                        {product.specialOffer}
                      </p>
                    </div>
                  )}

                  {/* GST Details (Optional - you can uncomment if needed) */}
                  {/* <div className="mb-1 text-xs text-gray-700">
                    <div className="flex justify-between">
                      <span>Base Price: ₹{priceBreakdown.basePrice}</span>
                      <span>GST: {gstRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Amt: ₹{priceBreakdown.gstAmount}</span>
                      <span>HSN: {details.hsn_code || "..."}</span>
                    </div>
                  </div> */}

                  <button
                    className="w-full max-w-[140px] rounded-full bg-[#EB6A42] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#d85b36]"
                    onClick={() => {
                      addToCart(product);
                      toast.success(`${product.name} added to cart!`);
                      if (typeof window !== "undefined" && window.fbq) {
                        window.fbq("track", "AddToCart", {
                          content_name: product.name,
                          value: parseFloat(product.price.replace(/[^\d.]/g, "")),
                          currency: "INR",
                        });
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-16 text-lg">
          All prices include GST. You will receive a detailed GST invoice after purchase.
        </p>
      </section>
    </>
  );
};

export default ProductShowcase;
