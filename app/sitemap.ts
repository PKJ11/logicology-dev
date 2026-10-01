import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Only live, canonical, lowercase www URLs that return 200 belong here:
// no redirected paths, cart/checkout/account pages or duplicates.
const ROUTES: [path: string, changeFrequency: "weekly" | "monthly", priority: number][] = [
  ["", "weekly", 1.0],
  ["/games", "weekly", 0.9],
  ["/books", "weekly", 0.9],
  ["/products", "weekly", 0.9],
  ["/games/prime-time", "weekly", 0.8],
  ["/games/turn-the-tables", "weekly", 0.8],
  ["/books/logicoland-series", "weekly", 0.8],
  ["/logicoland/volume-5", "monthly", 0.7],
  ["/about", "monthly", 0.6],
  ["/philosophy", "monthly", 0.6],
  ["/community", "monthly", 0.6],
  ["/blog", "weekly", 0.6],
  ["/blog/top-10-logic-based-learning-activities", "monthly", 0.5],
  ["/blog/board-games-vs-video-games", "monthly", 0.5],
  ["/contact-us", "monthly", 0.5],
  ["/bulk-order", "monthly", 0.4],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(([path, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
