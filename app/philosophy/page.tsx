import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import PhilosophyClient from "./PhilosophyClient";

export const metadata: Metadata = pageMetadata({
  title: "Our Philosophy – Learning Disguised as Fun | Logicology",
  description:
    "Why Logicology is a learning company that made it fun, not a toy company that added learning, and how every product is tested with children.",
  path: "/philosophy",
  ogTitle: "Our Philosophy – Learning Disguised as Fun",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([["Our Philosophy", "/philosophy"]])} />
      <PhilosophyClient />
    </>
  );
}
