// Phase 4/5: Removed store sub-sitemaps (products, collections, categories) and /store URL from sitemap generator.
import { getSiteSetting } from "@lib/data/seo"
import { getServices } from "@lib/data/services"
import { getBlogPosts } from "@lib/data/blog-posts"
import { getCaseStudies } from "@lib/data/case-studies"

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

function xmlSafe(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type: rawType } = await params
  const type = rawType.toLowerCase().replace(/\.xml[a-z]*$/i, "").trim()
  const siteSetting = await getSiteSetting().catch(() => null)
  const baseUrl = getSitemapBaseUrl(siteSetting?.site_url)
  const lastmod = new Date().toISOString()

  let xml = ""

  if (type === "pages") {
    const pages = [
      { url: `${baseUrl}`,                      changeFrequency: "daily",   priority: "1.0" },
      { url: `${baseUrl}/services`,             changeFrequency: "daily",   priority: "0.9" },
      { url: `${baseUrl}/work`,                 changeFrequency: "daily",   priority: "0.9" },
      { url: `${baseUrl}/blog`,                 changeFrequency: "daily",   priority: "0.9" },
      { url: `${baseUrl}/blog-ai`,              changeFrequency: "daily",   priority: "0.8" },
      { url: `${baseUrl}/about`,                changeFrequency: "weekly",  priority: "0.8" },
      { url: `${baseUrl}/contact`,              changeFrequency: "weekly",  priority: "0.8" },
      { url: `${baseUrl}/privacy-policy`,       changeFrequency: "monthly", priority: "0.5" },
      { url: `${baseUrl}/terms-and-conditions`,  changeFrequency: "monthly", priority: "0.5" },
    ]

    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <changefreq>${p.changeFrequency}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`
  } else if (type === "services") {
    let services: any[] = []
    try { services = await getServices() } catch (_) {}
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${services
  .filter((s) => !!s.slug)
  .map(
    (s) => `  <url>
    <loc>${xmlSafe(`${baseUrl}/services/${s.slug}`)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`
  } else if (type === "blogs" || type === "blog") {
    let blogs: any[] = []
    try { blogs = await getBlogPosts() } catch (_) {}
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogs
  .filter((b) => !!b.slug)
  .map(
    (b) => `  <url>
    <loc>${xmlSafe(`${baseUrl}/blog/${b.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date(b.updated_at || b.created_at || new Date()).toISOString()}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`
  } else if (type === "work") {
    let caseStudies: any[] = []
    try { caseStudies = await getCaseStudies() } catch (_) {}
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${caseStudies
  .filter((c) => !!c.slug)
  .map(
    (c) => `  <url>
    <loc>${xmlSafe(`${baseUrl}/work/${c.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`
  } else {
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`
  }

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
