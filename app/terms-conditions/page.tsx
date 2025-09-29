// app/terms-and-conditions/page.tsx
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions • Logicology",
  description: "Terms and conditions for using Logicology's website and purchasing products.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsAndConditionsPage() {
  const updated = "2025-01-10";

  return (
    <>
      <NavBar />
      <main className="bg-brand-grayBg">
        <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16 lg:py-20">
          <header className="mb-8 rounded-4xl bg-white p-6 shadow-soft sm:p-10">
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-teal sm:text-4xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 text-gray-700">
              Welcome to Logicology! By accessing or using our website www.logicology.in and
              purchasing our products, you agree to the following Terms & Conditions. Please read
              them carefully.
            </p>
          </header>

          <article className="space-y-8">
            {/* General */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">General</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>Logicology is owned and operated by Logicology Ventures Private Limited.</li>
                  <li>
                    By visiting our website or making a purchase, you agree to be bound by these
                    Terms & Conditions along with our Privacy Policy, Shipping Policy, and Returns,
                    Refund & Cancellation Policy.
                  </li>
                  <li>
                    Logicology reserves the right to update or modify these Terms at any time
                    without prior notice.
                  </li>
                </ul>
              </div>
            </section>

            {/* Products & Orders */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Products & Orders</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>
                    We strive to display our products as accurately as possible. However, colors and
                    designs may vary slightly due to screen settings and printing variations.
                  </li>
                  <li>All orders are subject to acceptance and availability.</li>
                  <li>
                    We reserve the right to refuse or cancel any order due to stock limitations,
                    errors in product information, or suspicious activity.
                  </li>
                </ul>
              </div>
            </section>

            {/* Pricing & Payments */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Pricing & Payments</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>
                    All prices listed on the website are in Indian Rupees (INR) and are inclusive of
                    applicable taxes, unless stated otherwise.
                  </li>
                  <li>
                    We accept payments through secure third-party payment gateways. By providing
                    payment information, you confirm that you are authorized to use the chosen
                    payment method.
                  </li>
                  <li>
                    In case of pricing errors, we reserve the right to cancel or adjust orders with
                    prior notification.
                  </li>
                </ul>
              </div>
            </section>

            {/* Shipping & Delivery */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Shipping & Delivery</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>We currently ship only within India.</p>
                <p>
                  Delivery timelines, shipping charges, and conditions are governed by our Shipping
                  Policy.
                </p>
              </div>
            </section>

            {/* Returns, Refunds & Cancellations */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Returns, Refunds & Cancellations
              </h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>
                  Returns, refunds, and cancellations are handled as per our Returns, Refund &
                  Cancellation Policy.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Intellectual Property
              </h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>
                    All content on the website, including logos, designs, images, product
                    descriptions, graphics, and text, is the property of Logicology and is protected
                    by copyright and trademark laws.
                  </li>
                  <li>
                    You may not reproduce, duplicate, copy, sell, or exploit any portion of the
                    website or its content without our written consent.
                  </li>
                </ul>
              </div>
            </section>

            {/* Use of Website */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Use of Website</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>
                    You agree not to misuse the website, attempt unauthorized access, or engage in
                    activities that may harm the site or its users.
                  </li>
                  <li>You may not use our products for any unlawful or unauthorized purpose.</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Limitation of Liability
              </h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>
                    Logicology shall not be liable for any indirect, incidental, or consequential
                    damages arising from the use of our products or website.
                  </li>
                  <li>
                    Our total liability for any claim shall not exceed the amount paid for the
                    product purchased.
                  </li>
                </ul>
              </div>
            </section>

            {/* Governing Law */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Governing Law</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <ul>
                  <li>
                    These Terms & Conditions are governed by and construed in accordance with the
                    laws of India.
                  </li>
                  <li>
                    Any disputes shall be subject to the exclusive jurisdiction of the courts of
                    Nagpur/ Maharashtra.
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Us */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Contact Us</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>
                  If you have any questions regarding these Terms & Conditions, please contact us
                  at:
                </p>
                <ul>
                  <li>
                    📲 <a href="tel:+918446980747">8446980747</a>
                  </li>
                  <li>
                    📩 <a href="mailto:support@logicology.in">support@logicology.in</a>
                  </li>
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
