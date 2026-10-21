// Phase 5: Removed Medusa S3 remotePatterns, checkEnvVariables, and diagnostic logs.
// Added 301 redirects to "/" for all legacy store URLs.

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/store",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/collections/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/categories/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "/",
        permanent: true,
      },
      {
        source: "/checkout",
        destination: "/",
        permanent: true,
      },
      {
        source: "/account/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/order/:path*",
        destination: "/",
        permanent: true,
      },
    ]
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production"

    const adminHeaders = [
      {
        // Admin routes must never be cached by any browser or proxy
        source: "/(admin|admin-login|api)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ]

    // In development mode, apply ONLY the admin/API no-cache rule.
    // Do not set any Cache-Control header for static chunks, images, videos, or HTML pages.
    if (!isProd) {
      return adminHeaders
    }

    return [
      ...adminHeaders,
      {
        // Long-lived cache for all static assets (_next/static) in production only
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public marketing pages caching - strictly excluded for admin and api routes
        source: "/((?!_next/static|_next/image|admin|admin-login|api|favicon.ico|logo.png|images|assets).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        // Cache all local static images and media in /public directory for 1 year in production
        source: "/:path*.(png|jpg|jpeg|gif|webp|svg|ico|mp4|webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap",
      },
    ]
  },
}

module.exports = nextConfig
