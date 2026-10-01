import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import AboutClient from "./AboutClient";

export const metadata: Metadata = pageMetadata({
  title: "About Logicology – Educators Building Thinking Skills | Logicology",
  description:
    "Logicology is a Nagpur-based learning company founded by educators. We design research-driven games and books that build real thinking skills.",
  path: "/about",
  ogTitle: "About Logicology – Educators Building Thinking Skills",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([["About", "/about"]])} />
      <AboutClient />
    </>
  );
}
