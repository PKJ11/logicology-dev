import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import CommunityClient from "./CommunityClient";

export const metadata: Metadata = pageMetadata({
  title: "Join the Logicology Community – Free Printables for Kids",
  description:
    "Free printable puzzles, early access to new games and a community of parents raising thinkers. Join the Logicology community.",
  path: "/community",
  ogTitle: "Join the Logicology Community – Free Printables for Kids",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([["Community", "/community"]])} />
      <CommunityClient />
    </>
  );
}
