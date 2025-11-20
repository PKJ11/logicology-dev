"use client";
import NavBar from "@/components/NavBar";
import BulkOrderForm from "../../components/BulkOrderForm";
import Script from "next/script";
import SiteFooter from "@/components/Footer";

export default function BulkOrderPage() {
  return (
    <>
      <NavBar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F7] py-10">
        <BulkOrderForm />
      </div>
      <SiteFooter />
    </>
  );
}
