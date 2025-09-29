// app/cancellation-refund-policy/page.tsx
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy • Logicology",
  description:
    "Cancellation, returns, and refund terms for Logicology products and programs.",
  alternates: { canonical: "/cancellation-refund-policy" },
};

export default function CancellationRefundPolicy() {
  const updated = "2025-01-10";
  const org = {
    name: "Logicology Ventures Pvt. Ltd.",
    url: "https://www.logicology.com",
    email: "support@logicology.in",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ReturnPolicy",
    name: "Logicology Cancellation, Returns & Refund Policy",
    url: `${org.url}/cancellation-refund-policy`,
    dateModified: updated,
    merchantReturnDays: 7,
    applicableCountry: "IN",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
  };

  return (
    <>
      <NavBar />
      <main className="bg-brand-grayBg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16 lg:py-20">
          <header className="mb-8 rounded-4xl bg-white p-6 shadow-soft sm:p-10">
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-teal sm:text-4xl">
              Cancellation, Returns & Refund Policy
            </h1>
            <p className="mt-4 text-gray-700">
              At Logicology, your satisfaction is our topmost priority. We take great care in designing and delivering our products, but if you face any issues, we’re here to help.
            </p>
          </header>

          <article className="space-y-8">
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Cancellations</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>Orders can be cancelled before they are shipped.</li>
                  <li>To cancel your order, please contact us at <a href="mailto:support@logicology.in">support@logicology.in</a> with your order number as soon as possible.</li>
                  <li>If the order has already been shipped, it cannot be cancelled. You may initiate a return once you receive the product (as per the Returns Policy below).</li>
                </ul>
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Returns</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>Products can be returned within 7 days of delivery, provided they are unused, in their original packaging, and in the same condition as received.</li>
                  <li>To initiate a return, please email <a href="mailto:support@logicology.in">support@logicology.in</a> with your order details and reason for return.</li>
                  <li>Returns are accepted only for items purchased directly from the Logicology website.</li>
                </ul>
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Non-Returnable Items</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>Opened or used products</li>
                  <li>Products purchased during clearance sales or special promotional events</li>
                  <li>Digital products</li>
                </ul>
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Refunds</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>Once we receive and inspect your returned product, we will notify you about the approval or rejection of your refund.</li>
                  <li>Approved refunds will be processed within <strong>7–10 working days</strong>, and the amount will be credited to your original method of payment.</li>
                  <li>Shipping charges (if any) are non-refundable, unless the return is due to a defective or incorrect product sent by us.</li>
                </ul>
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Exchanges</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>We currently do not offer direct exchanges. If you would like a replacement, please initiate a return and place a new order for the desired item.</p>
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Damaged or Defective Products</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>If you receive a damaged, defective, or incorrect product, please contact us within 48 hours of delivery with pictures of the product and packaging.</li>
                  <li>We will arrange for a replacement at no additional cost to you.</li>
                </ul>
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Late or Missing Refunds</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>If you haven’t received a refund after the stated timeline, please check with your bank or credit card company first.</li>
                  <li>If you’ve done this and still haven’t received your refund, contact us at <a href="mailto:support@logicology.in">support@logicology.in</a>.</li>
                </ul>
              </div>
            </section>

            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Contact Us</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>
                  For cancellations, returns, or refund queries, reach out to us at:
                </p>
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