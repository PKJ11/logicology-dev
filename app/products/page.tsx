import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import ProductShowcase from "@/components/ProductShowcase";
import React from "react";

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
