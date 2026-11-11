import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so its metadata lives here.
export const metadata: Metadata = pageMetadata({
  title: "Bulk Orders and Return Gifts: Prime Time & Logicoland | Logicology",
  description:
    "Order Prime Time maths games and Logicoland puzzle books in bulk as return gifts. Pick the quantity, age group and budget per gift, then pay securely online.",
  path: "/bulk-order",
  ogTitle: "Bulk Orders and Return Gifts | Logicology",
});

export default function BulkOrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([["Bulk Orders", "/bulk-order"]])} />
      {children}
    </>
  );
}
