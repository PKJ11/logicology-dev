import type { MetadataRoute } from "next";
import { SITE_URL, TEAM_PATH } from "@/lib/seo";

// Only live, canonical, lowercase www URLs that return 200 belong here:
// no redirected paths, cart/checkout/account pages or duplicates.
//
// lastModified is the date the page's content or metadata really changed (from git history),
// not the build time. Update the date whenever you edit that page.
type Freq = "weekly" | "monthly";
const ROUTES: [path: string, lastModified: string, changeFrequency: Freq, priority: number][] = [
  ["", "2026-10-01", "weekly", 1.0],
  ["/games", "2026-11-03", "weekly", 0.9],
  ["/books", "2026-10-01", "weekly", 0.9],
  ["/products", "2026-10-01", "weekly", 0.9],
  ["/games/prime-time", "2026-10-10", "weekly", 0.8],
  ["/games/turn-the-tables", "2026-10-10", "weekly", 0.8],
  ["/speed-maths", "2026-11-03", "weekly", 0.8],
  ["/sudoku", "2026-11-03", "monthly", 0.6],
  ["/books/logicoland-series", "2026-10-01", "weekly", 0.8],
  ["/logicoland/volume-5", "2026-10-01", "monthly", 0.7],
  ["/logicoland/volume-5/section/1", "2026-11-11", "monthly", 0.5],
  ["/logicoland/volume-5/section/2", "2026-11-11", "monthly", 0.5],
  ["/logicoland/volume-5/section/3", "2026-11-11", "monthly", 0.5],
  ["/logicoland/volume-5/section/4", "2026-11-11", "monthly", 0.5],
  ["/about", "2026-10-26", "monthly", 0.6],
  [TEAM_PATH, "2026-11-11", "monthly", 0.5],
  ["/philosophy", "2026-10-01", "monthly", 0.6],
  ["/community", "2026-10-01", "monthly", 0.6],
  ["/blog", "2026-10-01", "weekly", 0.6],
  ["/blog/top-10-logic-based-learning-activities", "2026-11-11", "monthly", 0.5],
  ["/blog/board-games-vs-video-games", "2026-11-11", "monthly", 0.5],
  ["/contact-us", "2026-10-01", "monthly", 0.5],
  ["/bulk-order", "2026-11-11", "monthly", 0.4],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(([path, lastModified, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
