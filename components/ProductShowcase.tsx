// TypeScript declaration for Razorpay on window
declare global {
  interface Window {
    Razorpay?: any;
  }
}
"use client";

import Image from "next/image";
import React from "react";
import Script from "next/script";
import { useCart } from "@/components/CartContext";
import toast from "react-hot-toast";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_337J5wlmmPKxAl";

// Sample product data
const products = [
  {
    name: "Prime Time",
    price: "₹1,424",
    image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
    rating: 5,
  },
  {
    name: "Logicoland",
    price: "₹249",
    image: "https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?updatedAt=1757748175426",
    rating: 5,
  },
];

const ProductShowcase = () => {

  const { addToCart } = useCart();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <section className="bg-[#6A294D] py-16 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Our Products</h2>
        <p className="mb-12 text-lg max-w-xl mx-auto">
          At Logicology we endeavour to make learning fun so that children learn while the play.
        </p>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white flex flex-row rounded-2xl shadow-md p-3 w-full max-w-md mx-auto"
            >
              {/* Left: Image */}
              <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={112}
                  height={112}
                  className="rounded-xl object-cover w-28 h-28"
                />
              </div>

              {/* Right: Details */}
              <div className="flex flex-col justify-center pl-4 flex-1 text-left">
                <h3 className="text-lg font-bold text-brand-teal mb-1">{product.name}</h3>
                <div className="text-yellow-400 mb-0.5">{"★".repeat(product.rating)}</div>
                <div className="text-brand-teal text-base font-semibold mb-2">{product.price}</div>
                <button
                  className="bg-[#EB6A42] text-white font-medium px-3 py-1.5 rounded-full w-full max-w-[140px] hover:bg-[#d85b36] transition text-sm"
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.name} added to cart!`);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 text-lg">
          At Logicology we endeavour to make learning fun so that children learn while the play.
        </p>
      </section>
    </>
  );
};

export default ProductShowcase;
