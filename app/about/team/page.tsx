import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import TeamPage from "@/components/TeamMembers";
import JsonLd from "@/components/JsonLd";
import { TEAM_PATH, breadcrumbSchema, pageMetadata, personSchemas } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Meet Logicology's Founders and Team | Logicology",
  description:
    "Meet the educators and makers behind Logicology: co-founders Gayatri Phadnis and Kartik Girish Vyas, with design lead Jasneet Singh Babra and tech lead Pratik Kumar Jha.",
  path: TEAM_PATH,
  ogTitle: "Meet Logicology's Founders and Team",
  image: "https://ik.imagekit.io/pratik11/team.png?tr=w-1200,h-630,c-at_max",
  imageAlt: "The Logicology team",
});

export default function Page() {
  return (
    <div>
      <JsonLd
        data={[
          ...personSchemas,
          breadcrumbSchema([
            ["About", "/about"],
            ["Team", TEAM_PATH],
          ]),
        ]}
      />
      <NavBar />
      <TeamPage />
    </div>
  );
}
