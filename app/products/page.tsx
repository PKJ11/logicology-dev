import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import ProductShowcase from "@/components/ProductShowcase";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Shop Educational Games & Books for Kids | Logicology",
  description:
    "Browse Logicology's full range of screen-free learning games, math card games and Logicoland puzzle books for children. Playful thinking, delivered in India.",
};

const page = () => {
  return (
    <div>
      <NavBar />
      <ProductShowcase />
      <SiteFooter />
    </div>
  );
};

export default page;
