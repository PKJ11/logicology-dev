import { NextResponse } from "next/server";
import { generateImageSitemap, LOGICOLOGY_MEDIA } from "@/lib/media-sitemap";

export async function GET() {
  try {
    // Generate image sitemap
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://logicology.com";
    const sitemap = generateImageSitemap(LOGICOLOGY_MEDIA.images, baseUrl);

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating image sitemap:", error);
    return NextResponse.json(
      { error: "Failed to generate image sitemap" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour
