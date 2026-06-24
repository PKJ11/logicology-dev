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

// ─────────────────────────────────────────────
// SEO Metadata  (App Router — no <Head> needed)
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  // ── Core ──────────────────────────────────
  title: {
    default: "Logicology – Children Think They're Playing. Parents Know They're Learning.",
    template: "%s | Logicology",
  },

  // ~155 chars ✅ — leads playful, closes with proof
  description:
    "The best learning doesn't feel like learning. Logicology builds thinking skills through fun experiences — research-driven, child-tested. Skills that outlast the screen.",

  keywords: [
    // ── Brand & Products ──
    "Logicology",
    "Logicoland",
    "Prime Time board game",
    "Turn the Tables game",

    // ── Phrase bank as long-tail keywords ──
    "learning disguised as fun",
    "fun in disguise",
    "researched not rebranded",
    "skills that outlast the screen",
    "designed by educators loved by kids",
    "research-driven child-tested",
    "small wins stacked",
    "selling thinking skills through fun",
    "what if learning is exciting for kids",
    "the best learning doesn't feel like learning",

    // ── Intent keywords ──
    "educational games India",
    "thinking skills for kids",
    "logical reasoning for kids",
    "math games for kids",
    "STEM learning India",
    "family learning games India",
    "fun learning for children",
    "research-backed learning games",
  ],

  authors: [{ name: "Logicology", url: "https://logicology.in" }],
  creator: "Logicology",
  publisher: "Logicology",

  // ── Canonical & Indexing ──────────────────
  alternates: {
    canonical: "https://logicology.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph (~200 chars) ───────────────
  // Uses: "researched not rebranded" + "outsmart/level up" verbs + movement line
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://logicology.in",
    siteName: "Logicology",
    title: "Logicology – What If Learning Was the Most Exciting Part of a Child's Day?",
    description:
      "Researched, not rebranded. At Logicology, kids play, think, and outsmart — while building skills that outlast the screen. Join the fun-learning revolution.",
    images: [
      {
        url: "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png",
        width: 1200,
        height: 630,
        alt: "Logicology – Designed by educators, loved by kids. Learning disguised as fun.",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X (~200 chars) ──────────────
  // Uses: "small wins stacked" + "not selling games" positioning + "designed by educators"
  twitter: {
    card: "summary_large_image",
    title: "Logicology – Children Think They're Playing. Parents Know They're Learning.",
    description:
      "We're not selling games. We're stacking small wins into lifelong thinking skills. Designed by educators, loved by kids. Fun in disguise — research-driven. Child-tested.",
    images: ["https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png"],
  },

  // ── Icons ─────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// ─────────────────────────────────────────────
// JSON-LD Structured Data
// ─────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Logicoland",
  url: "https://logicoland.in",
  logo: "https://logicoland.in/logo.png", // ← update path if needed
  sameAs: [
    // "https://www.instagram.com/logicoland",   // ← add social URLs
    // "https://www.facebook.com/logicoland",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Logicoland",
  url: "https://logicoland.in",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://logicoland.in/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://logicoland.in",
    },
  ],
};

// ─────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────
export default function Page() {
  return (
    <>
      {/* ── JSON-LD injected server-side ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
