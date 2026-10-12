// app/track-order/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | Logicology",
  description: "Track your Logicology order shipped via India Post using your Payment ID.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-brand-grayBg">
        <section className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
          <header className="mb-6 rounded-4xl bg-white p-6 shadow-soft sm:p-8">
            <h1 className="font-heading text-3xl font-extrabold text-brand-teal sm:text-4xl">
              📦 Track Your Order
            </h1>
            <p className="mt-2 text-gray-600">
              Enter the Payment ID from your invoice email and the email or phone number you used at
              checkout.
            </p>
          </header>
          <Suspense fallback={null}>
            <TrackOrderClient />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
