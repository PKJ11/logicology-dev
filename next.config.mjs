/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.logicology.in" },
    ],
  },

  // 301/308 redirects for URLs from the old WordPress site that are still in Google's index.
  // Add any further "Not found (404)" URLs from Search Console → Pages here.
  async redirects() {
    return [
      { source: "/category/kids", destination: "/games", permanent: true },
      { source: "/category/:slug*", destination: "/products", permanent: true },
      { source: "/tag/:slug*", destination: "/blog", permanent: true },
      { source: "/summer2024", destination: "/summer2026", permanent: true },
      { source: "/summer2024/:path*", destination: "/summer2026", permanent: true },
      { source: "/portfolios", destination: "/about", permanent: true },
      { source: "/portfolios/:path*", destination: "/about", permanent: true },
      { source: "/portfolio/:path*", destination: "/about", permanent: true },
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },

      // Duplicate Logicoland URLs → the single Logicoland product page.
      { source: "/books/logicoland", destination: "/books/logicoland-series", permanent: true },
      { source: "/books/logicoland-volume-1", destination: "/books/logicoland-series", permanent: true },
      { source: "/logicoland-volume-1", destination: "/books/logicoland-series", permanent: true },
    ];
  },
};

export default nextConfig;
