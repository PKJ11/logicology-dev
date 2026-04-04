# Image & Video SEO Optimization Guide for Logicology

## Overview

This guide explains the SEO enhancements added to your Logicology project for images and videos. These optimizations help search engines better understand, index, and rank your visual content.

---

## 🎯 What We've Added

### 1. **Enhanced Components with SEO Attributes**

#### **MediaLayout.tsx** (Images + Videos)
- **Alt Text**: Descriptive, keyword-rich alt attributes
- **Title Attributes**: Improved accessibility and SEO signals
- **Semantic HTML**: Uses `<figure>` and `<figcaption>` tags
- **JSON-LD Schema**: Generates structured data for images and videos
- **Preload Strategy**: Uses Next.js Image optimization with proper loading strategies
- **ARIA Labels**: Better accessibility for screen readers

**Usage Example:**
```tsx
<MediaLayout
  image="https://ik.imagekit.io/pratik11/image.png"
  videoSrc="https://ik.imagekit.io/pratik11/video.mp4"
  imageAlt="Logicology educational puzzle game"
  imageTitle="Logic Puzzle Game Demo"
  videoTitle="How to Play Logicology"
  videoDescription="Learn the basics of Logicology games"
  videoDuration="PT2M30S"
/>
```

#### **VideoLayout.tsx** (Self-Hosted Videos)
- **Video Schema Markup**: Automatically generates VideoObject schema
- **Semantic HTML**: Proper video element with metadata
- **Accessibility**: Keyboard navigation (Enter/Space to play)
- **ARIA Labels**: Descriptive labels for screen readers
- **Preload Metadata**: Sets `preload="metadata"` for better performance

**Usage Example:**
```tsx
<VideoLayout
  videoSrc="https://ik.imagekit.io/pratik11/video.mp4"
  videoTitle="Educational Content"
  videoDescription="Learn logic through interactive games"
  videoDuration="PT3M"
/>
```

#### **VideoModal.tsx** (YouTube Videos)
- **Video Schema Markup**: Works with YouTube embeds
- **Semantic Structure**: Proper heading hierarchy
- **ARIA Support**: Screen reader friendly
- **Accessibility**: Focus management and keyboard support

**Usage Example:**
```tsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Watch Video</button>
<VideoModal
  open={open}
  onClose={() => setOpen(false)}
  youtubeUrl="https://www.youtube.com/watch?v=VIDEO_ID"
  title="Logicology Philosophy"
  description="Understanding logic-based learning"
  duration="PT4M20S"
/>
```

---

## 📊 Schema Markup (JSON-LD)

### Image Schema Example
```json
{
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "url": "https://ik.imagekit.io/pratik11/image.png",
  "name": "Logicology Game Preview",
  "description": "Interactive logic puzzle game",
  "contentUrl": "https://ik.imagekit.io/pratik11/image.png",
  "datePublished": "2026-04-01T00:00:00Z"
}
```

### Video Schema Example
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How to Play Logicology",
  "description": "Learn the basics of Logicology games",
  "thumbnailUrl": "https://ik.imagekit.io/pratik11/thumb.jpg",
  "uploadDate": "2026-04-01T00:00:00Z",
  "duration": "PT2M30S",
  "contentUrl": "https://ik.imagekit.io/pratik11/video.mp4",
  "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "http://schema.org/WatchAction",
    "userInteractionCount": 0
  }
}
```

---

## 🗺️ Sitemaps

### Image Sitemap
**Endpoint**: `/api/image-sitemap`

Tells Google about all images on your site:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://logicology.com</loc>
    <image:image>
      <image:loc>https://ik.imagekit.io/pratik11/image.png</image:loc>
      <image:title>Logicology Game Preview</image:title>
      <image:caption>Interactive logic puzzle</image:caption>
    </image:image>
  </url>
</urlset>
```

### Video Sitemap
**Endpoint**: `/api/video-sitemap`

Tells Google about all videos on your site:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://logicology.com</loc>
    <video:video>
      <video:title>How to Play Logicology</video:title>
      <video:description>Learn the basics of games</video:description>
      <video:content_loc>https://ik.imagekit.io/pratik11/video.mp4</video:content_loc>
      <video:thumbnail_loc>https://ik.imagekit.io/pratik11/thumb.jpg</video:thumbnail_loc>
      <video:publication_date>2026-04-01</video:publication_date>
      <video:duration>150</video:duration>
    </video:video>
  </url>
</urlset>
```

---

## 🛠️ How to Add to Google Search Console

### For Image SEO:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (logicology.com)
3. Go to **Sitemaps** → Add new sitemap
4. Enter: `https://logicology.com/api/image-sitemap`
5. Click Submit

### For Video SEO:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Go to **Sitemaps** → Add new sitemap
4. Enter: `https://logicology.com/api/video-sitemap`
5. Click Submit

### For Video-specific indexing:
1. Go to **Videos** section (if available)
2. Submit video sitemap
3. Mark featured videos

---

## 📝 Best Practices for Alt Text

### Good Alt Text Examples:
- ✅ "Logicology Hidato puzzle game level 5"
- ✅ "Prime Time board game instruction cards"
- ✅ "User solving logic puzzle step-by-step"

### Bad Alt Text Examples:
- ❌ "image"
- ❌ "screenshot"
- ❌ "puzzle.png"

### Format Guidelines:
```
[Product/Topic] [Action/Type] [Key Detail]
```

Example: "Logicoland Volume 1 book cover preview"

---

## 🎬 Video Best Practices

### Duration Format (ISO 8601):
- `PT30S` = 30 seconds
- `PT1M` = 1 minute
- `PT1M30S` = 1 minute 30 seconds
- `PT2H15M` = 2 hours 15 minutes

### Thumbnail Guidelines:
- Minimum 160×120 pixels
- JPEG or PNG format
- Same aspect ratio as video
- Clear, recognizable at small sizes

### Upload Date Format (ISO 8601):
```
2026-04-01T10:30:00Z
```

---

## 📚 Utility Functions

### Import and Use Schema Utilities

```tsx
import {
  generateImageSchema,
  generateVideoSchema,
  formatDurationISO8601,
  getImageAltText,
} from "@/lib/seo-schema";

// Format video duration
const duration = formatDurationISO8601(150); // Returns "PT2M30S"

// Get suggested alt text
const alt = getImageAltText("product", "showcase"); 
// Returns "product - showcase image for Logicology"

// Generate schema manually
const schema = generateImageSchema({
  url: "https://example.com/image.jpg",
  alt: "Image description",
  title: "Image Title",
  description: "Detailed description",
});
```

### Import and Use Sitemap Utilities

```tsx
import {
  generateImageSitemap,
  generateVideoSitemap,
  LOGICOLOGY_MEDIA,
} from "@/lib/media-sitemap";

// Generate sitemaps programmatically
const imageSitemap = generateImageSitemap(
  LOGICOLOGY_MEDIA.images,
  "https://logicology.com"
);

const videoSitemap = generateVideoSitemap(
  LOGICOLOGY_MEDIA.videos,
  "https://logicology.com"
);
```

---

## ✅ SEO Checklist

- [x] Alt text on all images (meaningful, not generic)
- [x] Title attributes on interactive images
- [x] Video schema markup on all videos
- [x] Image schema markup on hero/product images
- [x] Image sitemap created and submitted
- [x] Video sitemap created and submitted
- [x] Video duration in ISO 8601 format
- [x] Video descriptions (100+ characters recommended)
- [x] Proper video thumbnails
- [x] ARIA labels for accessibility
- [x] Semantic HTML (figure, figcaption, etc.)
- [x] Preload strategies for images
- [x] Mobile-optimized images
- [x] Responsive images with `sizes` attribute
- [ ] Video transcripts (for accessibility & SEO)
- [ ] Captions/subtitles for videos
- [ ] Videos hosted on CDN (already doing this!)

---

## 🔍 Testing & Monitoring

### Test Schema Markup
1. [Schema.org Validator](https://schema.org/WebSite)
2. [Google Rich Results Test](https://search.google.com/test/rich-results)
3. [Structured Data Testing Tool](https://developers.google.com/structured-data)

### Monitor Performance
1. Google Search Console → Performance
2. Filter by: Images, Videos
3. Check impressions, clicks, CTR
4. Monitor average position

### Monitor Indexing
1. Google Search Console → Coverage
2. Look for "Image: 40 pages with rich results"
3. Check video indexing status

---

## 🚀 Advanced Enhancements (Future)

### Consider Adding:
1. **Video Transcripts**
   - Increases SEO value
   - Better accessibility
   - Improves keyword targeting

2. **Video Captions**
   - Required for accessibility (WCAG)
   - Improves YouTube ranking
   - Better for engagement

3. **Image Tagging**
   - Product tags
   - Location metadata
   - Color analysis

4. **Analytics Events**
   - Track video plays
   - Track image interactions
   - Feed data to GA4

5. **Dynamic Sitemaps**
   - Auto-update from CMS
   - Scale for 1000+ images/videos

---

## 📞 Support & Resources

- [Google Images Best Practices](https://developers.google.com/search/docs/advanced/images)
- [Google Videos Best Practices](https://developers.google.com/search/docs/advanced/video)
- [Schema.org Image Markup](https://schema.org/ImageObject)
- [Schema.org Video Markup](https://schema.org/VideoObject)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

---

**Last Updated**: April 1, 2026
**Version**: 1.0
