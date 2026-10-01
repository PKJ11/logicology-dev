import { NextRequest, NextResponse } from "next/server";

// Old WordPress paths with no equivalent page: tell crawlers they are gone for good.
const GONE_PREFIXES = ["/wp-admin", "/wp-content", "/wp-includes", "/wp-json", "/type/", "/feed"];
const GONE_EXACT = new Set(["/wp-login.php", "/xmlrpc.php", "/type"]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  // Single official host: https://www.logicology.in (Vercel normally does this before us; this is a safety net).
  if (host === "logicology.in") {
    const target = new URL(url.pathname + url.search, "https://www.logicology.in");
    return NextResponse.redirect(target, 308);
  }

  const { pathname } = url;

  // Lowercase URL for the community page (/Community, /Community/...). Exact-case check avoids loops.
  if (pathname === "/Community" || pathname.startsWith("/Community/")) {
    const target = url.clone();
    target.pathname = "/community" + pathname.slice("/Community".length);
    return NextResponse.redirect(target, 308);
  }

  if (GONE_EXACT.has(pathname) || GONE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return new NextResponse("410 Gone", {
      status: 410,
      headers: { "X-Robots-Tag": "noindex", "Content-Type": "text/plain" },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, API routes and static files.
  matcher: ["/((?!_next/|api/|.*\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml|pdf|js|css|map)$).*)"],
};
