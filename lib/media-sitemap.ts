/**
 * Image and Video Sitemap Generator
 * Generates XML sitemaps for images and videos for better SEO indexing
 */

export interface ImageItem {
  url: string;
  title: string;
  caption: string;
}

export interface VideoItem {
  url: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  uploadDate?: string;
  category?: string;
}

/**
 * Generate Image Sitemap XML
 * Use this in app/sitemap.xml or a dedicated image-sitemap.xml route
 */
export const generateImageSitemap = (
  images: ImageItem[],
  baseUrl: string
): string => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${images
    .map(
      (image) => `
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      <image:caption>${escapeXml(image.caption)}</image:caption>
    </image:image>
  </url>
  `
    )
    .join("")}
</urlset>`;

  return xmlContent;
};

/**
 * Generate Video Sitemap XML
 * Use this in app/video-sitemap.xml route
 */
export const generateVideoSitemap = (
  videos: VideoItem[],
  baseUrl: string
): string => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${videos
    .map(
      (video) => `
  <url>
    <loc>${baseUrl}</loc>
    <video:video>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${video.url}</video:content_loc>
      ${video.thumbnailUrl ? `<video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>` : ""}
      ${
        video.uploadDate
          ? `<video:publication_date>${video.uploadDate}</video:publication_date>`
          : ""
      }
      ${
        video.duration
          ? `<video:duration>${video.duration}</video:duration>`
          : ""
      }
      ${video.category ? `<video:category>${escapeXml(video.category)}</video:category>` : ""}
    </video:video>
  </url>
  `
    )
    .join("")}
</urlset>`;

  return xmlContent;
};

/**
 * Generate Combined Media Sitemap
 * Includes both images and videos
 */
export const generateMediaSitemap = (
  images: ImageItem[],
  videos: VideoItem[],
  baseUrl: string
): string => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${images
    .map(
      (image) => `
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
      <image:caption>${escapeXml(image.caption)}</image:caption>
    </image:image>
  </url>
  `
    )
    .join("")}
  ${videos
    .map(
      (video) => `
  <url>
    <loc>${baseUrl}</loc>
    <video:video>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${video.url}</video:content_loc>
      ${video.thumbnailUrl ? `<video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>` : ""}
      ${
        video.uploadDate
          ? `<video:publication_date>${video.uploadDate}</video:publication_date>`
          : ""
      }
      ${
        video.duration
          ? `<video:duration>${video.duration}</video:duration>`
          : ""
      }
    </video:video>
  </url>
  `
    )
    .join("")}
</urlset>`;

  return xmlContent;
};

/**
 * Escape XML special characters
 */
const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    });
};

/**
 * Sample Logicology images and videos for reference
 */
export const LOGICOLOGY_MEDIA = {
  images: [
    {
      url: "https://ik.imagekit.io/pratik11/LOGICOLOGIC-WEB-PAGE-SLIDER-1-FOR-DESKTOP.png?updatedAt=1758349826819",
      title: "Logicology Welcome Slider Desktop",
      caption: "Learn to Play. Play to Learn. - Logicology educational platform",
    },
    {
      url: "https://ik.imagekit.io/pratik11/HOW-WE-HELP.png?updatedAt=1758439842222",
      title: "How Logicology Helps",
      caption: "Learn how Logicology supports educational development",
    },
    {
      url: "https://ik.imagekit.io/pratik11/WHY-LOGICOLOGY.png?updatedAt=1758439747708",
      title: "Why Choose Logicology",
      caption: "Discover the benefits of logic-based learning",
    },
  ] as ImageItem[],
  videos: [
    {
      url: "https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4?updatedAt=1758433043493",
      title: "Logicology Philosophy",
      description: "Understanding the philosophy behind Logicology educational games",
      duration: 120,
      uploadDate: new Date().toISOString().split("T")[0],
      category: "Educational",
    },
  ] as VideoItem[],
};
