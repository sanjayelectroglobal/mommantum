import { MetadataRoute } from "next"
import { getSiteSetting } from "@lib/data/seo"

function getRobotsBaseUrl(dbUrl?: string | null): string {
  let url = dbUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://www.mommantum.com"
  if (!url || url.includes("localhost") || url.includes("127.0.0.1")) {
    url = "https://www.mommantum.com"
  }
  if (!url.startsWith("http")) {
    url = `https://${url}`
  }
  return url.replace(/\/+$/, "")
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteSetting = await getSiteSetting().catch(() => null)
  const baseUrl = getRobotsBaseUrl(siteSetting?.site_url)

  const aiUserAgents = [
    "GPTBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "cohere-ai",
    "Omgilibot",
    "Diffbot",
    "CCBot",
    "Meta-ExternalAgent",
    "YouBot",
    "Bytespider",
  ]

  const commonDisallows = [
    "/account/",
    "/wishlist/",
    "/cart/",
    "/checkout/",
    "/order/",
    "/order-success/",
    "/verify-email/",
    "/reset-password/",
    "/api/",
    "/admin/",
    "/admin-login",
    "/test-auth/",
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: commonDisallows,
      },
      {
        userAgent: aiUserAgents,
        allow: "/",
        disallow: [
          "/account/",
          "/cart/",
          "/checkout/",
          "/admin/",
          "/admin-login",
          "/api/",
        ],
      },
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
          "BLEXBot",
          "PetalBot",
          "DataForSeoBot",
          "ZoominfoBot",
          "magpie-crawler",
          "SiteAuditBot",
          "serpstatbot",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}