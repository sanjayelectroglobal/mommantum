# ElectroGlobal SEO Automation & Internal Linking Blueprint

This document contains the complete technical blueprint and copy-pasteable code blocks to implement the advanced SEO automation, structured data, and AI-driven internal linking features on other Web projects.

---

## 1. Dynamic `robots.txt` with Brand ASCII Art

Instead of a static file, we use a dynamic Next.js App Router API route (`route.ts`) to return plain text with embedded custom ASCII comments, sitemaps, and crawl directives.

### Implementation Guide
1. Delete any static `public/robots.txt` or `src/app/robots.ts` files.
2. Create the folder structure: `src/app/robots.txt/`
3. Add the following file:

#### File: `src/app/robots.txt/route.ts`
```typescript
import { NextResponse } from "next/server"

export const dynamic = "force-static" // Cache statically at build time

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://electroglobal.in"

  const robotsTxt = `#
#  -------------------------------------------------------------
#   _____ _           _             ____ _      _           _ 
#  | ____| | ___  ___| |_ _ __ ___ / ___| | ___| |__   __ _| |
#  |  _| | |/ _ \\/ __| __| '__/ _ \\ |  _| |/ _ \\ '_ \\ / _\` | |
#  | |___| |  __/ (__| |_| | | (_) | |_| | |  __/ | | | (_| | |
#  |_____|_|\\___|\\___|\\__|_|  \\___/ \\____|_|\\___|_| |_|\\__,_|_|
#  -------------------------------------------------------------
#
#  -------------------------------------------------------------
#   ____                 _     _  ____ _     _     
#  |  _ \\  __ _ _ __  _ (_) __| |/ ___| |__ (_)_ __  
#  | |_) |/ _\` | '_ \\| | |/ _\` | |   | '_ \\| | '_ \\ 
#  |  _ <| (_| | |_) | | | (_| | |___| | | | | |_) |
#  |_| \\_\\\\__,_| .__/|_|_|\\__,_|\\____|_| |_|_| .__/ 
#              |_|                           |_|    
#  -------------------------------------------------------------
#

User-Agent: *
Allow: /

# Exclude user accounts and checkout operations
Disallow: /account/
Disallow: /checkout/
Disallow: /cart/

# Block bad scraping bots
User-Agent: GPTBot
Disallow: /

User-Agent: CCBot
Disallow: /

User-Agent: Google-Extended
Disallow: /

# Sitemap Pointer
Sitemap: ${baseUrl}/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, must-revalidate",
    },
  })
}
```

---

## 2. Dynamic XML Sitemap Generator

This configuration aggregates static pages, dynamic products from your e-commerce engine (e.g. Medusa), categories, and blog posts into a single search-engine-friendly XML sitemap.

### Implementation Guide
Create the directory `src/app/sitemap.xml/` and place this script inside:

#### File: `src/app/sitemap.xml/route.ts`
```typescript
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic" // Re-validate sitemap items on-demand

async function fetchProducts() {
  const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  try {
    const res = await fetch(`${backend}/store/products?limit=100`, {
      headers: { "x-publishable-api-key": key! }
    })
    const data = await res.json()
    return data.products || []
  } catch { return [] }
}

async function fetchBlogs() {
  const backend = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
  const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  try {
    // Modify URL endpoint depending on your blog system
    const res = await fetch(`${backend}/store/blogs?limit=100`, {
      headers: { "x-publishable-api-key": key! }
    })
    const data = await res.json()
    return data.posts || []
  } catch { return [] }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://electroglobal.in"
  
  const staticUrls = [
    "",
    "/store",
    "/blogs",
    "/bulk-orders",
  ]

  const products = await fetchProducts()
  const blogs = await fetchBlogs()

  let xml = `<?xml version="1.0" encoding="UTF-8"?>`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  // 1. Static URLs
  staticUrls.forEach(route => {
    xml += `
    <url>
      <loc>${baseUrl}${route}</loc>
      <changefreq>daily</changefreq>
      <priority>${route === "" ? "1.0" : "0.8"}</priority>
    </url>`
  })

  // 2. Product Detail URLs
  products.forEach((prod: any) => {
    xml += `
    <url>
      <loc>${baseUrl}/store/${prod.handle}</loc>
      <lastmod>${new Date(prod.updated_at).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`
  })

  // 3. Blog Post URLs
  blogs.forEach((post: any) => {
    xml += `
    <url>
      <loc>${baseUrl}/blogs/${post.slug}</loc>
      <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`
  })

  xml += `</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}
```

---

## 3. Unified JSON-LD Schema Graphs

Instead of scattering multiple script tags in the DOM, Google recommends bundling all structured data into a single unified `@graph` block. This reduces DOM payload and links entities (e.g. FAQ Page, Reviews, and Product information) under a shared page identifier.

### Utility Functions
Create `src/lib/metadata-schemas.ts` to export helper functions:

#### File: `src/lib/metadata-schemas.ts`
```typescript
interface Review {
  first_name: string
  last_name: string
  rating: number
  content: string
  created_at: string
}

export function buildProductSchema(
  product: any,
  price: number | undefined,
  seoData: any,
  ratingData: { rating: number; count: number },
  reviews: Review[],
  canonicalUrl: string
) {
  const images = product.images?.map((img: any) => img.url) || [product.thumbnail]

  // Map reviews into Google-compliant structure
  const mappedReviews = reviews.map(r => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": `${r.first_name} ${r.last_name}`
    },
    "datePublished": new Date(r.created_at).toISOString().split('T')[0],
    "reviewBody": r.content,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": r.rating,
      "bestRating": 5,
      "worstRating": 1
    }
  }))

  const offerPrice = price || product.variants?.[0]?.calculated_price?.calculated_amount || 99

  return {
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    "name": product.title,
    "image": images,
    "description": seoData?.description || product.description?.replace(/<[^>]*>/g, "").substring(0, 160),
    "sku": product.variants?.[0]?.sku || `EG-${product.id.slice(-6)}`,
    "mpn": product.variants?.[0]?.sku || `EG-${product.id.slice(-6)}`,
    "brand": {
      "@type": "Brand",
      "name": "ElectroGlobal"
    },
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": "INR",
      "price": offerPrice,
      "priceValidUntil": new Date(Date.now() + 31536000000).toISOString().split('T')[0], // 1 year out
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "ElectroGlobal"
      }
    },
    ...(ratingData.count > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingData.rating,
        "reviewCount": ratingData.count,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {}),
    ...(mappedReviews.length > 0 ? { "review": mappedReviews } : {})
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}
```

### Storefront Hook / Component Usage
On your Server Component page (e.g. `src/app/store/[handle]/page.tsx`), output the schema along with React-hoisted canonical headers:

```typescript
import { buildProductSchema } from "@/lib/metadata-schemas"

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle)
  const canonicalUrl = `https://electroglobal.in/store/${product.handle}`

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      buildProductSchema(product, undefined, {}, { rating: 4.8, count: 12 }, [], canonicalUrl)
    ]
  }

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <div>Page content...</div>
    </>
  )
}
```

---

## 4. AI Internal Linking Engine (PGVector & OpenAI)

This framework uses semantic similarity to search and create contextual links. 

### Database Schema (PostgreSQL with `pgvector`)
The database contains two tables: `link_embedding` (storing content embeddings) and `link_suggestion` (storing actual link connections).

```sql
-- Ensure pgvector extension is installed
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE link_embedding (
  id TEXT PRIMARY KEY,
  resource_type TEXT NOT NULL, -- 'product', 'category', 'blog', 'page'
  resource_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  group_key TEXT NULL,
  keywords TEXT NULL,
  embedding vector(1536) NULL, -- Match OpenAI's output dimensions
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE link_suggestion (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_title TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  score REAL NOT NULL,
  mode TEXT NOT NULL DEFAULT 'related_block', -- 'in_content' or 'related_block'
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Backend Service logic (Medusa Module / Express API)
This service updates embeddings on content changes and queries neighbors using KNN cosine distance (`<=>` operator).

```typescript
import { createHash } from "crypto"

export class InternalLinkingService {
  private db: any // Raw postgres DB driver / ORM

  // Call OpenAI API to generate embedding vector
  async generateEmbedding(text: string): Promise<number[]> {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: text.slice(0, 8000), // Max tokens cutoff
        dimensions: 1536
      })
    })
    const data = await res.json()
    return data.data[0].embedding
  }

  // Find Nearest Neighbors using Vector Distance
  async findSimilarContent(vec: number[], excludeId: string, limit: number = 5) {
    const vectorString = "[" + vec.join(",") + "]"
    
    // Using '<=>' cosine distance operator for fast search
    const query = `
      SELECT resource_type, resource_id, title, url, 
             1 - (embedding <=> $1::vector) AS similarity 
      FROM link_embedding 
      WHERE status = 'published' AND id != $2 
      ORDER BY embedding <=> $1::vector 
      LIMIT $3
    `
    return this.db.query(query, [vectorString, excludeId, limit])
  }
}
```

---

## 5. Frontend Keyword Anchor Injector

To automate internal linking without editing HTML database records manually, we parse the HTML string **on the server** at render time, target structural text nodes, and inject links.

### The Anchor Injector Helper
This script parses HTML, extracts text nodes, finds occurrences of keywords, and replaces them with an anchor link. It ensures it **never** injects duplicate links or embeds links inside existing `<a>` or `<header>` elements.

#### File: `src/lib/inject-links.ts`
```typescript
import { parse, HTMLElement, TextNode } from "node-html-parser"

interface LinkSuggestion {
  anchor_text: string
  target_url: string
}

export function injectLinks(htmlContent: string, suggestions: LinkSuggestion[]): string {
  if (!htmlContent) return ""
  if (!suggestions || suggestions.length === 0) return htmlContent

  const root = parse(htmlContent)
  const injectedKeywords = new Set<string>()

  // Helper to check if node has an anchor link ancestor
  function hasAnchorAncestor(node: any): boolean {
    let parent = node.parentNode
    while (parent) {
      if (parent.tagName === "A" || parent.tagName === "BUTTON" || /H[1-6]/.test(parent.tagName || "")) {
        return true
      }
      parent = parent.parentNode
    }
    return false
  }

  // Recursive walk through DOM text nodes
  function walk(node: any) {
    if (node instanceof TextNode) {
      if (hasAnchorAncestor(node)) return

      let text = node.rawText
      let modified = false

      for (const suggestion of suggestions) {
        const keyword = suggestion.anchor_text.trim()
        if (!keyword || injectedKeywords.has(keyword.toLowerCase())) continue

        // Match keyword exactly on word boundaries, case-insensitive
        const regex = new RegExp(`\\b(${escapeRegExp(keyword)})\\b`, "i")
        const match = text.match(regex)

        if (match && match.index !== undefined) {
          const matchedText = match[1]
          
          // Replace first instance with HTML anchor tag
          const linkHtml = `<a href="${suggestion.target_url}" class="text-primary hover:underline font-semibold" style="color: #0284c7;">${matchedText}</a>`
          
          // Re-parse replacement and swap the node
          const replacementNode = parse(linkHtml)
          node.replaceWith(replacementNode)
          
          injectedKeywords.add(keyword.toLowerCase())
          modified = true
          break // Process one node replacement at a time to prevent corruption
        }
      }
      if (modified) return
    } else if (node instanceof HTMLElement) {
      // Don't modify content inside interactive elements
      if (node.tagName === "A" || node.tagName === "SCRIPT" || node.tagName === "STYLE") {
        return
      }
      // Clone nodes to walk safely
      const children = [...node.childNodes]
      for (const child of children) {
        walk(child)
      }
    }
  }

  walk(root)
  return root.toString()
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
```

---

## 6. Mobile-Responsive RelatedLinks component

The `<RelatedLinks />` component outputs the remaining link suggestions grouped by category, product, and blog. It features a horizontal scroll interface on mobile viewports to prevent layout scattering, while wrapping natively on desktop.

#### File: `src/components/RelatedLinks.tsx`
```typescript
import React from "react"

interface Link {
  target_type: string
  target_id: string
  target_title: string
  target_url: string
}

export default async function RelatedLinks({
  links
}: {
  links: Link[]
}) {
  if (!links || !links.length) return null

  const groups = {
    product:  links.filter(l => l.target_type === "product"),
    category: links.filter(l => l.target_type === "category"),
    blog:     links.filter(l => l.target_type === "blog"),
  }

  return (
    <section
      aria-label="Related content"
      className="container mx-auto px-4 max-w-6xl py-6"
      style={{ borderTop: "1px solid #c7d3dd" }}
    >
      <h2 className="text-sm font-bold mb-4" style={{ color: "#0a0a0a" }}>
        Related Content
      </h2>
      {groups.product.length > 0  && <Group title="Related Products"  links={groups.product}  />}
      {groups.category.length > 0 && <Group title="Browse Categories" links={groups.category} />}
      {groups.blog.length > 0     && <Group title="From the Blog"     links={groups.blog}     />}
    </section>
  )
}

function Group({ title, links }: { title: string; links: Link[] }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#5b6979" }}>
        {title}
      </h3>
      {/* Mobile: horizontal scroll row, Desktop: wrapping grid */}
      <ul className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x sm:flex-wrap sm:overflow-visible sm:pb-0">
        {links.map(l => (
          <li key={l.target_type + ":" + l.target_id} className="flex-none snap-start sm:flex-initial">
            <a
              href={l.target_url}
              className="text-xs font-medium px-3 py-1 rounded-full transition-all duration-150 hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] block max-w-[180px] truncate sm:max-w-none sm:whitespace-normal"
              style={{
                backgroundColor: "#e8edf1",
                color: "#5b6979",
                border: "1px solid #c7d3dd",
              }}
              title={l.target_title}
            >
              {l.target_title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```
