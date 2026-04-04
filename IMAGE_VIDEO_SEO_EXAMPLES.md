# Image & Video SEO - Implementation Examples

## Quick Reference for Updating Existing Components

---

## 1. **MediaLayout - Complete Example**

```tsx
// components/MediaLayout.tsx
import MediaLayout from "@/components/MediaLayout";

export default function HomePage() {
  return (
    <MediaLayout
      image="https://ik.imagekit.io/pratik11/WHY-LOGICOLOGY.png"
      videoSrc="https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4"
      // NEW SEO PROPS:
      imageAlt="Logicology philosophy - why logic-based learning matters"
      imageTitle="Why Choose Logicology"
      imageDescription="Visual explanation of Logicology's educational approach"
      videoTitle="Logicology Philosophy Explained"
      videoDescription="In-depth exploration of how Logicology teaches logic through games and puzzles"
      videoDuration="PT5M30S"
    />
  );
}
```

---

## 2. **VideoLayout - Complete Example**

```tsx
// components/WhyImportant.tsx
import VideoLayout from "@/components/VideoLayout";

<VideoLayout
  videoSrc="https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4"
  // NEW SEO PROPS:
  videoTitle="Philosophy Behind Logicology"
  videoDescription="Discover how Logicology combines game theory with educational psychology to make learning engaging and effective"
  videoDuration="PT5M30S"
/>
```

---

## 3. **VideoModal - Complete Example (YouTube)**

```tsx
// pages/about/page.tsx
"use client";
import { useState } from "react";
import VideoModal from "@/components/VideoModal";
import CTAButton from "@/components/CTAButton";

export default function AboutPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="py-12">
      <button
        onClick={() => setIsVideoOpen(true)}
        className="btn">
        Watch Our Story
      </button>

      <VideoModal
        open={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        youtubeUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        // NEW SEO PROPS:
        title="Logicology: Learn Through Logic"
        description="Our mission to transform education through interactive games and logic puzzles"
        duration="PT3M45S"
      />
    </section>
  );
}
```

---

## 4. **Using Image Component with SEO**

```tsx
// components/ProductCard.tsx
import Image from "next/image";

interface ProductCardProps {
  name: string;
  image: string;
  description: string;
}

export default function ProductCard({ name, image, description }: ProductCardProps) {
  return (
    <article className="product-card">
      <figure className="relative h-64 w-full overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={`${name} - Logic puzzle board game`}
          title={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
          loading="lazy"
        />
        {description && (
          <figcaption className="sr-only">{description}</figcaption>
        )}
      </figure>
      <h3 className="mt-4 text-xl font-semibold">{name}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </article>
  );
}
```

---

## 5. **Hero Component with SEO**

```tsx
// components/Hero.tsx - Update to include metadata

const slides = [
  {
    id: 1,
    pretitle: "Welcome to Logicology",
    title: "Learn to Play.",
    subtitle: "Play to Learn.",
    description:
      "At Logicology, we endeavour to make learning fun so that children learn while they play.",
    image: {
      desktop: "https://ik.imagekit.io/pratik11/LOGICOLOGIC-WEB-PAGE-SLIDER-1-FOR-DESKTOP.png",
      mobile: "https://ik.imagekit.io/pratik11/LOGICOLOGIC-WEB-PAGE-SLIDER-1-FOR-MOBILE.png",
    },
    // NEW SEO PROPS:
    altText: "Logicology main banner - Learn through logic-based games and puzzles",
    imageTitle: "Logicology Homepage Hero",
    cta: "Learn more",
    ctaLink: "/philosophy",
  },
  // ... other slides
];

export default function Hero() {
  return (
    <div>
      {slides.map((slide) => (
        <div
          key={slide.id}
          style={{
            backgroundImage: `url('${isMobile ? slide.image.mobile : slide.image.desktop}')`,
          }}
          role="img"
          aria-label={slide.altText}
          title={slide.imageTitle}
        >
          {/* Rest of Hero Content */}
        </div>
      ))}
    </div>
  );
}
```

---

## 6. **Adding Schema to a Page**

```tsx
// app/products/page.tsx
import { metadata } from "next";

export const metadata = {
  title: "Logicology Products - Logic Puzzles & Educational Games",
  description: "Discover our collection of logic puzzles and educational games for children",
  openGraph: {
    title: "Logicology Products",
    description: "Educational games that make learning fun",
    images: [
      {
        url: "https://ik.imagekit.io/pratik11/products-hero.png",
        width: 1200,
        height: 630,
        alt: "Logicology product collection",
      },
    ],
  },
};

export default function ProductsPage() {
  return (
    <>
      {/* Add Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Logicology Products",
            "description": "Our educational product collection",
            "image": "https://ik.imagekit.io/pratik11/products-hero.png",
          }),
        }}
      />

      {/* Page Content */}
      <section>
        <h1>Our Products</h1>
        {/* Product grid here */}
      </section>
    </>
  );
}
```

---

## 7. **Update Product Component with Better Metadata**

```tsx
// components/ProductShowcase.tsx - Add SEO
const products = [
  {
    name: "Prime Time",
    price: "₹1,499",
    description: "Prime Time Board Game",
    image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png",
    // NEW SEO PROPS:
    alt: "Prime Time - Strategy board game for logical thinking",
    category: "games",
    sku: "PRIMETIME-001",
  },
  // ... more products
];

products.map((product) => (
  <article key={product.name} className="product-card">
    <figure className="relative h-64 w-full">
      <Image
        src={product.image}
        alt={product.alt}
        title={product.name}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 25vw"
      />
      <figcaption className="sr-only">{product.description}</figcaption>
    </figure>
    {/* Product details */}
  </article>
));
```

---

## 8. **Custom Hook for Video Players**

```tsx
// hooks/useSEOVideo.ts
import { generateVideoSchema, formatDurationISO8601 } from "@/lib/seo-schema";
import { useEffect } from "react";

interface UseSEOVideoProps {
  title: string;
  description: string;
  durationSeconds?: number;
  videoUrl: string;
}

export function useSEOVideo({
  title,
  description,
  durationSeconds = 120,
  videoUrl,
}: UseSEOVideoProps) {
  useEffect(() => {
    // Generate schema
    const schema = generateVideoSchema({
      url: videoUrl,
      title,
      description,
      duration: formatDurationISO8601(durationSeconds),
      contentUrl: videoUrl,
    });

    // Inject into head
    const scriptElement = document.createElement("script");
    scriptElement.type = "application/ld+json";
    scriptElement.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptElement);

    return () => {
      document.head.removeChild(scriptElement);
    };
  }, [title, description, durationSeconds, videoUrl]);

  return {
    schema: generateVideoSchema({
      url: videoUrl,
      title,
      description,
      duration: formatDurationISO8601(durationSeconds),
    }),
  };
}

// USAGE:
export default function VideoPage() {
  const { schema } = useSEOVideo({
    title: "Learn Logicology",
    description: "Tutorial video for beginners",
    durationSeconds: 150,
    videoUrl: "https://example.com/video.mp4",
  });

  return <video src="..." title="Learn Logicology" />;
}
```

---

## 9. **Image Gallery Component**

```tsx
// components/ImageGallery.tsx
import Image from "next/image";
import { generateMediaGallerySchema } from "@/lib/seo-schema";

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
}

interface ImageGalleryProps {
  title: string;
  description: string;
  images: GalleryImage[];
}

export default function ImageGallery({
  title,
  description,
  images,
}: ImageGalleryProps) {
  const schema = generateMediaGallerySchema(
    title,
    description,
    images.map((img) => ({
      type: "image",
      url: img.src,
      alt: img.alt,
      title: img.title,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <section>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="grid gap-4">
          {images.map((image) => (
            <figure key={image.src} className="relative h-48">
              <Image
                src={image.src}
                alt={image.alt}
                title={image.title}
                fill
                className="object-cover rounded"
              />
              <figcaption className="sr-only">{image.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
```

---

## 10. **Submit Sitemaps to Search Console**

```bash
# Add these to your next.config.mjs or create a robots.txt

// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
  
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
        {
          source: '/image-sitemap.xml',
          destination: '/api/image-sitemap',
        },
        {
          source: '/video-sitemap.xml',
          destination: '/api/video-sitemap',
        },
      ],
    };
  },
};

export default nextConfig;
```

---

## 11. **Create robots.txt with Sitemap References**

```text
# public/robots.txt

User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

# Sitemaps
Sitemap: https://logicology.com/sitemap.xml
Sitemap: https://logicology.com/image-sitemap.xml
Sitemap: https://logicology.com/video-sitemap.xml
```

---

## ✅ Checklist for Your Project

After implementing these:

- [ ] Update `MediaLayout` in all usage locations
- [ ] Update `VideoLayout` in all usage locations
- [ ] Update `VideoModal` in all usage locations
- [ ] Add SEO props to all Image components
- [ ] Test schema markup with Google Rich Results Test
- [ ] Submit sitemaps to Google Search Console
- [ ] Monitor indexing in Search Console
- [ ] Check performance for images/videos
- [ ] Set up analytics for video interactions
- [ ] Create video transcripts (for future)

---

## Need Help?

1. Check `IMAGE_VIDEO_SEO_GUIDE.md` for detailed documentation
2. Use the utility functions from `/lib/seo-schema.ts`
3. Generate sitemaps with `/lib/media-sitemap.ts`
4. Test with [Google Rich Results Test](https://search.google.com/test/rich-results)

