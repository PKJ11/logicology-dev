import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import WhyImportant from "@/components/WhyImportant";
import Benefit from "@/components/Benefit";
import ImportanceBubbles from "@/components/ImportanceBubbles";
import Community from "@/components/Community";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero/Hero";
import ProductShopSection from "@/components/ProductShopSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BrandPromise from "@/components/BrandPromise";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Brain Games & Logic Puzzles for Kids | Logicology",
  description:
    "Screen-free brain games, logic puzzle books and math board games for kids aged 6–16. Designed by educators, loved by kids. Shop Prime Time & Logicoland.",
  path: "/",
  ogTitle: "Logicology – Brain Games & Logic Puzzles for Kids",
  imageAlt: "Children playing Prime Time, a math board game by Logicology",
});

// Organization + WebSite JSON-LD are emitted site-wide from app/layout.tsx.

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────
export default function Page() {
  return (
    <>
      <main>
        <NavBar />
        <Hero />
        <BrandPromise />
        <ProductShopSection />
        <WhyImportant />
        <ImportanceBubbles />
        <TestimonialsSection />
        <Benefit />
        <Community />
        <Footer />
      </main>
    </>
  );
}
