import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import WhyImportant from "@/components/WhyImportant";
import Benefit from "@/components/Benefit";
import ImportanceBubbles from "@/components/ImportanceBubbles";
import Community from "@/components/Community";
import Footer from "@/components/Footer";
import ProductShowcase from "@/components/ProductShowcase";

// ─────────────────────────────────────────────
// SEO Metadata  (App Router — no <Head> needed)
// ─────────────────────────────────────────────
export const metadata: Metadata = {
  // ── Core ──────────────────────────────────
  title: {
    default: "Logicoland – Educational Board Games That Make Learning Fun",
    template: "%s | Logicoland",
  },
  description:
    "Logicoland creates fun, research-backed board games that build logical thinking, number sense, and problem-solving skills in kids aged 6–16. Explore Prime Time™ and more.",
  keywords: [
    "educational board games",
    "math games for kids",
    "logical reasoning games",
    "prime numbers game",
    "board games for learning",
    "kids board games India",
    "STEM toys",
    "family board games",
    "Logicoland",
    "Prime Time board game",
  ],
  authors: [{ name: "Logicoland", url: "https://logicoland.in" }],
  creator: "Logicoland",
  publisher: "Logicoland",

  // ── Canonical & Indexing ──────────────────
  alternates: {
    canonical: "https://logicoland.in",
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

  // ── Open Graph ────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://logicoland.in",
    siteName: "Logicoland",
    title: "Logicoland – Educational Board Games That Make Learning Fun",
    description:
      "Research-backed board games that build logical thinking, number sense, and problem-solving in kids. Discover Prime Time™ — the addictive numbers game for ages 8+.",
    images: [
      {
        url: "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png",
        width: 1200,
        height: 630,
        alt: "Logicoland – Prime Time educational board game for kids",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Logicoland – Educational Board Games That Make Learning Fun",
    description:
      "Research-backed board games that build logical thinking and number sense in kids. Discover Prime Time™ – the addictive math game for ages 8+.",
    images: [
      "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png",
    ],
    // creator: "@logicoland",   // ← add your Twitter handle when ready
  },

  // ── Icons ─────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // ── Verification (add tokens when ready) ──
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  // },
};

// ─────────────────────────────────────────────
// JSON-LD Structured Data
// ─────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Logicoland",
  url: "https://logicoland.in",
  logo: "https://logicoland.in/logo.png",       // ← update path if needed
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
        <WhyImportant />
        <Benefit />
        <ImportanceBubbles />
        {/* <ProductShowcase /> */}
        <Community />
        <Footer />
      </main>
    </>
  );
}