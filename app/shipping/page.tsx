// app/shipping/page.tsx
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy • Logicology",
  description: "Shipping terms and delivery timelines for Logicology orders across India.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPolicy() {
  const updated = "2025-01-10";

  return (
    <>
      <NavBar />
      <main className="bg-brand-grayBg">
        <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16 lg:py-20">
          <header className="mb-8 rounded-4xl bg-white p-6 shadow-soft sm:p-10">
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-teal sm:text-4xl">
              🚚 Shipping Policy
            </h1>
          </header>

          <article className="space-y-8">
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <div className="prose prose-gray mt-3 max-w-none">
                <p>
                  At Logicology, we strive to deliver your orders quickly, safely, and affordably. Please read through our shipping policy to understand how we handle deliveries.
                </p>
              </div>
            </section>

            {/* Domestic Shipping Only */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Domestic Shipping Only</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>Currently, Logicology ships orders within India only. We do not offer international shipping at this time.</p>
              </div>
            </section>

            {/* Delivery Timelines */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Delivery Timelines</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>Orders are usually processed and dispatched within 2 working days of placing the order.</li>
                  <li>The expected delivery time is up to 7 working days (depending on your location and courier service availability).</li>
                  <li>Saturday, Sunday and public holidays are not considered as working days.</li>
                  <li>You will receive a tracking link once your order has been shipped.</li>
                </ul>
              </div>
            </section>

            {/* Shipping Charges */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Shipping Charges</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>FREE Shipping on all orders worth ₹999 or above.</li>
                  <li>For orders below ₹999, a flat shipping charge of ₹99 will be applied at checkout.</li>
                </ul>
              </div>
            </section>

            {/* Order Tracking */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Order Tracking</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>Once dispatched, you will receive an email and/or WhatsApp message with your tracking details.</li>
                  <li>You can use this link to follow your order until it reaches your doorstep.</li>
                </ul>
              </div>
            </section>

            {/* Delays */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Delays</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>While we aim to deliver within the promised timeframe, unforeseen factors such as courier delays, public holidays, or regional restrictions may cause delays. We appreciate your patience and understanding in such cases.</p>
              </div>
            </section>

            {/* Address & Contact Information */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Address & Contact Information</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>Please ensure that your shipping address and contact number are entered correctly at checkout.</li>
                  <li>Logicology will not be responsible for orders misplaced due to incorrect or incomplete information provided by the customer.</li>
                </ul>
              </div>
            </section>

            {/* Damaged or Lost Shipments */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Damaged or Lost Shipments</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>If your package arrives damaged, please contact us within 48 hours of delivery with pictures of the package and product.</li>
                  <li>If your shipment is lost in transit, we will either resend the product or issue a refund, depending on your preference.</li>
                </ul>
              </div>
            </section>

            {/* Need Help? */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Need Help?</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>If you have any questions about your order or shipping, feel free to reach out to us at:</p>
                <ul>
                  <li>📲 <a href="tel:+918446980747">8446980747</a></li>
                  <li>📩 <a href="mailto:support@logicology.in">support@logicology.in</a></li>
                </ul>
              </div>
            </section>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
