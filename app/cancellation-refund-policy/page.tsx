// app/cancellation-refund-policy/page.tsx
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy • Logicology",
  description:
    "Cancellation and refund terms for Logicology programs, including timelines and eligibility.",
  alternates: { canonical: "/cancellation-refund-policy" },
};

export default function CancellationRefundPolicy() {
  const updated = "2025-01-10"; // ← keep current
  const org = {
    name: "Logicology Ventures Pvt. Ltd.",
    url: "https://www.logicology.com", // ← replace with real domain
    email: "learn@logicology.in", // ← per your policy copy
  };

  // Helpful structured data (Google rich results)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ReturnPolicy",
    name: "Logicology Cancellation & Refund Policy",
    url: `${org.url}/cancellation-refund-policy`,
    dateModified: updated,
    merchantReturnDays: 7, // one week for long-term programs
    applicableCountry: "IN",
    returnPolicyCategory: "https://schema.org/NonRefundable", // short-term not refundable
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
          {/* Header */}
          <header className="mb-8 rounded-4xl bg-white p-6 shadow-soft sm:p-10">
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-teal sm:text-4xl">
              Cancellation & Refund Policy
            </h1>
          </header>

          {/* Body */}
          <article className="space-y-8">
            {/* Cancellation */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Cancellation Policy</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>
                  For the long term programs (3 months or longer) offered by Logicology, you can
                  request cancellation of your order within one week of commencement of the program.
                  You need to send an email to learn@logicology.in with the participant’s name,
                  program you enrolled for and your phone number used while placing the order. For
                  the short term programs (shorter than 3 months) or competitions, cancellation is
                  not allowed. Orders once received will not be cancelled.
                </p>
              </div>
            </section>

            {/* Refunds */}
            <section className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">Refund Policy</h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>
                  All programs offered by Logicology come with sample content, which customers can
                  try out completely free of cost, before enrolling for the program.
                </p>
                <p>
                  In case of long term programs (3 months or longer), you can avail refund for the
                  program if you raise a cancellation request within one week of commencement of
                  program. The program fees, minus the registration fees, will be refunded to you.
                  Refunds shall be processed within two weeks from the receipt of the cancellation
                  request, through the same mode of payment as used while placing the order.
                </p>
                <p>
                  No refund will be provided if the cancellation request is raised beyond one week
                  of the commencement of the program.
                </p>
              </div>
            </section>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
