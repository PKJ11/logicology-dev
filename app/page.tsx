import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import WhyImportant from "@/components/WhyImportant";
import Benefit from "@/components/Benefit";
import ImportanceBubbles from "@/components/ImportanceBubbles";
import Community from "@/components/Community";
import Footer from "@/components/Footer";
import ProductShowcase from "@/components/ProductShowcase";

export default function Page() {
  return (
    <main>
      <NavBar />
      <Hero />
      <WhyImportant />
      <Benefit />
      <ImportanceBubbles />
      <ProductShowcase />
      <Community />
      <Footer />
    </main>
  );
}
