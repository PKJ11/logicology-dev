"use client";
declare global {
  interface Window {
    Razorpay?: any;
  }
}

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
    image:
      "https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?updatedAt=1757748175426",
    rating: 5,
  },
];

const ProductShowcase = () => {
  const { addToCart } = useCart();

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <section className="bg-[#6A294D] py-16 text-center text-white">
        <h2 className="mb-4 text-4xl font-bold">Our Products</h2>
        <p className="mx-auto mb-12 max-w-xl text-lg">
          At Logicology we endeavour to make learning fun so that children learn while the play.
        </p>

        {/* Product Cards */}
        <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="mx-auto flex w-full max-w-md flex-row rounded-2xl bg-white p-3 shadow-md"
            >
              {/* Left: Image */}
              <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center">
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
                <div className="mb-2 text-base font-semibold text-brand-teal">{product.price}</div>
                <button
                  className="w-full max-w-[140px] rounded-full bg-[#EB6A42] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#d85b36]"
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
