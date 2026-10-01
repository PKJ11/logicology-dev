import type { Metadata } from "next";

// Single official origin: https + www. Every canonical, OG url and sitemap entry uses this.
export const SITE_URL = "https://www.logicology.in";
export const SITE_NAME = "Logicology";

export const LOGO_URL =
  "https://ik.imagekit.io/pratik2002/logo-logicology-removebg-preview.png?updatedAt=1760432002538";

export const DEFAULT_OG_IMAGE =
  "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png?tr=w-1200,h-630,c-at_max";

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/logicology_/",
  "https://www.facebook.com/Logicology",
  "https://www.youtube.com/c/logicology/",
  "https://www.linkedin.com/company/11215891/",
];

export const absoluteUrl = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

interface PageSeo {
  /** Full <title>, used as-is (no template is applied). */
  title: string;
  description: string;
  /** Lowercase path starting with "/". */
  path: string;
  /** Shorter title for social previews; defaults to `title`. */
  ogTitle?: string;
  image?: string;
  imageAlt?: string;
}

export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  image = DEFAULT_OG_IMAGE,
  imageAlt,
}: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const socialTitle = ogTitle ?? title;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      url,
      title: socialTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt ?? socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}

// ── JSON-LD builders ─────────────────────────────────────────

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Logicology",
  legalName: "Logicology Ventures Private Limited",
  url: SITE_URL,
  logo: LOGO_URL,
  description:
    "Logicology is a Nagpur-based learning company founded by educators, creating screen-free brain games, math board games and logic puzzle books for kids.",
  sameAs: SOCIAL_PROFILES,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nagpur",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8446980747",
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/** items: [name, path] pairs after "Home", e.g. [["Games", "/games"], ["Prime Time", "/games/prime-time"]] */
export function breadcrumbSchema(items: [string, string][]) {
  const all: [string, string][] = [["Home", "/"], ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
