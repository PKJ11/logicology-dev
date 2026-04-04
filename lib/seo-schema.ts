/**
 * SEO Schema Generation Utilities
 * Generates JSON-LD structured data for images and videos
 */

export interface ImageSchemaProps {
  url: string;
  alt: string;
  title?: string;
  description?: string;
  uploadDate?: string;
  contentUrl?: string;
}

export interface VideoSchemaProps {
  url: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string; // ISO 8601 format: PT1M30S
  contentUrl?: string;
  embedUrl?: string;
  interactionCount?: number;
}

/**
 * Generate Image schema markup (Schema.org)
 */
export const generateImageSchema = (props: ImageSchemaProps) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    url: props.url,
    name: props.title || props.alt,
    description: props.description || props.alt,
    contentUrl: props.contentUrl || props.url,
    datePublished: props.uploadDate || new Date().toISOString(),
  };
};

/**
 * Generate Video schema markup (Schema.org)
 */
export const generateVideoSchema = (props: VideoSchemaProps) => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: props.title,
    description: props.description,
    thumbnailUrl: props.thumbnailUrl,
    uploadDate: props.uploadDate || new Date().toISOString(),
    duration: props.duration || "PT1M", // Default 1 minute if not specified
    contentUrl: props.contentUrl || props.url,
    embedUrl: props.embedUrl || props.url,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "http://schema.org/WatchAction",
      userInteractionCount: props.interactionCount || 0,
    },
  };
};

/**
 * Generate combined schema for media gallery
 */
export const generateMediaGallerySchema = (
  title: string,
  description: string,
  mediaItems: Array<{ type: "image" | "video"; url: string; alt?: string; title?: string }>
) => {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: description,
    hasPart: mediaItems.map((item) => ({
      "@type": item.type === "image" ? "ImageObject" : "VideoObject",
      url: item.url,
      name: item.title || item.alt || `${title} - ${item.type}`,
    })),
  };
};

/**
 * Format duration to ISO 8601
 * @param seconds - Duration in seconds
 * @returns ISO 8601 format (e.g., PT1M30S)
 */
export const formatDurationISO8601 = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let result = "PT";
  if (hours > 0) result += `${hours}H`;
  if (minutes > 0) result += `${minutes}M`;
  if (secs > 0) result += `${secs}S`;

  return result || "PT0S";
};

/**
 * Get SEO-optimized image alt text suggestions based on context
 */
export const getImageAltText = (context: string, imageType: string): string => {
  const altTexts: Record<string, Record<string, string>> = {
    hero: {
      slider: "Logicology - Learn through logic-based games and puzzles",
      banner: "Logicology educational content banner",
    },
    product: {
      showcase: "Product display and features",
      cover: "Product cover image",
    },
    community: {
      engagement: "Community engagement and user interaction",
      testimonial: "User testimonial and feedback",
    },
    educational: {
      puzzle: "Logic puzzle and educational game",
      learning: "Interactive learning content",
    },
  };

  return (
    altTexts[context]?.[imageType] ||
    `${context} - ${imageType} image for Logicology`
  );
};
