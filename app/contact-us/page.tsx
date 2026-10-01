import type { Metadata } from "next";
import ContactUs from "@/components/ContactUs";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Logicology | Schools, Bulk Orders & Support",
  description:
    "Get in touch with Logicology for orders, school partnerships, bulk purchases and workshops.",
  path: "/contact-us",
  ogTitle: "Contact Logicology – Schools, Bulk Orders & Support",
});

const page = () => {
  return (
    <div>
      <JsonLd data={breadcrumbSchema([["Contact", "/contact-us"]])} />
      <ContactUs headingLevel="h1" />
    </div>
  );
};

export default page;
