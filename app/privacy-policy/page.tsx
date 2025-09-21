// app/privacy-policy/page.tsx
import SiteFooter from "@/components/Footer";
import NavBar from "@/components/NavBar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy • Logicology",
  description:
    "Logicology’s Privacy Policy explains what we collect, why we collect it, and how you can manage your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const updated = "2025-01-10"; // <-- keep this current
  const org = {
    name: "Logicology Ventures Pvt. Ltd.",
    url: "https://www.logicology.com", // <-- your real domain
    email: "privacy@logicology.com",
    address: "Bangalore, KA, India", // <-- update
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Logicology Privacy Policy",
    url: `${org.url}/privacy-policy`,
    dateModified: updated,
    publisher: {
      "@type": "Organization",
      name: org.name,
      url: org.url,
    },
  };

  return (
    <>
      <NavBar />
      <main className="bg-brand-grayBg">
        {/* JSON-LD for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16 lg:py-20">
          {/* Header */}
          <header className="mb-8 rounded-4xl bg-white p-6 shadow-soft sm:p-10">
            <h1 className="mt-2 font-heading text-3xl font-extrabold text-brand-teal sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-gray-700">
              We value the trust you place in us. That’s why we insist upon the highest standards
              for secure transactions and customer information privacy. Please read the following
              statement to learn about our information gathering and dissemination practices. Note:
              Our privacy policy is subject to change at any time without notice. To make sure you
              are aware of any changes, please review this policy periodically. By visiting this
              Website you agree to be bound by the terms and conditions of this Privacy Policy. If
              you do not agree please do not use or access our Website. By mere use of the Website,
              you expressly consent to our use and disclosure of your personal information in
              accordance with this Privacy Policy. This Privacy Policy is incorporated into and
              subject to the Terms of Use.
            </p>
          </header>

          {/* In-page nav */}
          <nav aria-label="Contents" className="mb-6 rounded-4xl bg-white p-4 shadow-soft sm:p-6">
            <ol className="list-decimal pl-5 text-sm leading-6 text-gray-700 sm:text-base">
              <li>
                <a className="hover:text-brand-coral" href="#collection">
                  Collection of information
                </a>
              </li>
              <li>
                <a className="hover:text-brand-coral" href="#use">
                  Use of demographic / profile data
                </a>
              </li>
              <li>
                <a className="hover:text-brand-coral" href="#sharing">
                  Sharing of personal information
                </a>
              </li>
              <li>
                <a className="hover:text-brand-coral" href="#links">
                  Links to other sites
                </a>
              </li>
              <li>
                <a className="hover:text-brand-coral" href="#security">
                  Security precautions
                </a>
              </li>
              <li>
                <a className="hover:text-brand-coral" href="#choice">
                  Choice / Opt-Out
                </a>
              </li>
              <li>
                <a className="hover:text-brand-coral" href="#consent">
                  Your consent
                </a>
              </li>
              <li>
                <a className="hover:text-brand-coral" href="#questions">
                  Questions
                </a>
              </li>
            </ol>
          </nav>

          {/* Body */}
          <article className="space-y-8">
            <section id="collection" className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                1. Collection of Personally Identifiable Information and other information
              </h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>
                  When you use our Website, we collect and store your personal information which is
                  provided by you from time to time. Our primary goal in doing so is to provide you
                  a safe, efficient, smooth and customized experience. This allows us to provide
                  services and features that most likely meet your needs, and to customize our
                  Website to make your experience safer and easier. More importantly, while doing so
                  we collect personal information from you that we consider necessary for achieving
                  this purpose. In general, you can browse the Website without telling us who you
                  are or revealing any personal information about yourself. Once you give us your
                  personal information, you are not anonymous to us. Where possible, we indicate
                  which fields are required and which fields are optional. You always have the
                  option to not provide information by choosing not to use a particular service or
                  feature on the Website. We may automatically track certain information about you
                  based upon your behaviour on our Website. We use this information to do internal
                  research on our users’ demographics, interests, and behaviour to better
                  understand, protect and serve our users. This information is compiled and analysed
                  on an aggregated basis. This information may include the URL that you just came
                  from (whether this URL is on our Website or not), which URL you go to (whether
                  this URL is on our Website or not), your computer browser information, and your IP
                  address. We use data collection devices such as “cookies” on certain pages of the
                  Website to help analyse our web page flow, measure promotional effectiveness, and
                  promote trust and safety. “Cookies” are small files placed on your hard drive that
                  assist us in providing our services. We offer certain features that are only
                  available through the use of a “cookie”. We also use cookies to allow you to enter
                  your password less frequently during a session. Cookies can also help us provide
                  information that is targeted to your interests. Most cookies are “session
                  cookies,” meaning that they are automatically deleted from your hard drive at the
                  end of a session. You are always free to decline our cookies if your browser
                  permits, although in that case you may not be able to use certain features on the
                  Website and you may be required to re-enter your password more frequently during a
                  session. Additionally, you may encounter “cookies” or other similar devices on
                  certain pages of the Website that are placed by third parties. We do not control
                  the use of cookies by third parties. If you choose to buy on the Website, we
                  collect information about your buying behaviour. If you transact with us, we
                  collect some additional information, such as a billing address, a credit / debit
                  card number and a credit / debit card expiration date and/ or other payment
                  instrument details and tracking information from cheques or money orders. If you
                  choose to post messages on our message boards, chat rooms or other message areas
                  or leave feedback, we will collect that information you provide to us. We retain
                  this information as necessary to resolve disputes, provide customer support and
                  troubleshoot problems as permitted by law. If you send us personal correspondence,
                  such as emails or letters, or if other users or third parties send us
                  correspondence about your activities or postings on the Website, we may collect
                  such information into a file specific to you.
                </p>
              </div>
            </section>

            <section id="use" className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                2. Use of Demographic / Profile Data / Your Information
              </h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>We use information to:</p>
                <p>
                  We use personal information to provide the services you request. To the extent we
                  use your personal information to market to you, we will provide you the ability to
                  opt-out of such uses. We use your personal information to resolve disputes;
                  troubleshoot problems; help promote a safe service; collect money; measure
                  consumer interest in our products and services, inform you about online and
                  offline offers, products, services, and updates; customize your experience; detect
                  and protect us against error, fraud and other criminal activity; enforce our terms
                  and conditions; and as otherwise described to you at the time of collection. In
                  our efforts to continually improve our product and service offerings, we collect
                  and analyse demographic and profile data about our users’ activity on our Website.
                  We identify and use your IP address to help diagnose problems with our server, and
                  to administer our Website. Your IP address is also used to help identify you and
                  to gather broad demographic information.
                </p>
                <p className="textstyles">Cookies</p>
                <p>
                  A “cookie” is a small piece of information stored by a web server on a web browser
                  so it can be later read back from that browser. Cookies are useful for enabling
                  the browser to remember information specific to a given user. We place both
                  permanent and temporary cookies in your computer’s hard drive. The cookies do not
                  contain any of your personally identifiable information.
                </p>
              </div>
            </section>

            <section id="sharing" className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                3. Sharing of personal information
              </h2>
              <div className="prose prose-gray mt-3 max-w-none">
                <p>
                  We may share not personal information with any other corporate entities and
                  affiliates. We may not disclose personal information to third parties.
                </p>
              </div>
            </section>

            <section id="links" className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                4. Links to Other Sites
              </h2>
              <p className="prose prose-gray mt-3">
                Our Website links to other websites that may collect personally identifiable
                information about you. Logicology Ventures Pvt. Ltd. is not responsible for the
                privacy practices or the content of those linked websites
              </p>{" "}
            </section>

            <section id="security" className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                5. Security Precautions
              </h2>
              <p className="prose prose-gray mt-3">
                Our Website has stringent security measures in place to protect the loss, misuse,
                and alteration of the information under our control. Whenever you change or access
                your account information, we offer the use of a secure server. Once your information
                is in our possession we adhere to strict security guidelines, protecting it against
                unauthorized access.
              </p>
            </section>

            <section id="choice" className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">6. Choice / Opt-Out</h2>
              <p className="prose prose-gray mt-3">
                We provide all users with the opportunity to opt-out of receiving non-essential
                (promotional, marketing-related) communications from us on behalf of our partners,
                and from us in general, after setting up an account.
              </p>
              <p className="prose prose-gray mt-3">
                If you want to remove your contact information from all Logicology’s lists and
                newsletters, please visit unsubscribe on your mailer{" "}
              </p>
            </section>

            <section id="consent" className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                7. Your Consent & Changes
              </h2>
              <p className="prose prose-gray mt-3">
                By using the Website and/ or by providing your information, you consent to the
                collection and use of the information you disclose on the Website in accordance with
                this Privacy Policy.
              </p>
              <p>
                If we decide to change our privacy policy, we will post those changes on this page
                so that you are always aware of what information we collect, how we use it, and
                under what circumstances we disclose it.
              </p>
            </section>

            <section id="questions" className="rounded-4xl bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">8. Questions</h2>
              <p className="prose prose-gray mt-3">
                Please contact us regarding any questions regarding this statement.
              </p>
            </section>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
