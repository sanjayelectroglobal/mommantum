import { getSiteSetting } from "@lib/data/seo"

export const dynamic = "force-dynamic"
export const revalidate = 0

function getSitemapBaseUrl(dbUrl?: string | null): string {
  let url = dbUrl || process.env.NEXT_PUBLIC_BASE_URL || "https://www.mommantum.com"
  if (!url || url.includes("localhost") || url.includes("127.0.0.1")) {
    url = "https://www.mommantum.com"
  }
  if (!url.startsWith("http")) {
    url = `https://${url}`
  }
  return url.replace(/\/+$/, "")
}

export async function GET() {
  const siteSetting = await getSiteSetting().catch(() => null)
  const baseUrl = getSitemapBaseUrl(siteSetting?.site_url)
  const lastmod = new Date().toISOString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap/pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/services.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/blogs.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/work.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/products.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/collections.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/categories.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
