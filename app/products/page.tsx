import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import ProductShowcase from "@/components/ProductShowcase";
import type { Metadata } from "next";
import React from "react";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop Educational Games & Puzzle Books for Kids | Logicology",
  description:
    "Shop Logicology's math board games, card games and logic puzzle books for kids. All prices include GST. Free shipping above ₹499.",
  path: "/products",
  ogTitle: "Shop Educational Games & Puzzle Books for Kids",
});

const page = () => {
  return (
    <div>
      <JsonLd data={breadcrumbSchema([["Shop", "/products"]])} />
      <NavBar />
      <ProductShowcase />
      <SiteFooter />
    </div>
  );
};

export default page;
