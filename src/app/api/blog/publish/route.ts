import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { z } from "zod"
import { notifyGoogleOfUpdate } from "@lib/services/indexer"
import { revalidateContent } from "@lib/revalidate"

const blogPayloadSchema = z.object({
  title: z.string().min(3),
  slug: z.string().nullish(),
  status: z.enum(["draft", "published"]).nullish(),
  content: z.string().min(50),
  category_id: z.string().nullish(),
  meta_title: z.string().nullish(),
  meta_description: z.string().nullish(),
  excerpt: z.string().nullish(),
  featured_image: z.string().nullish(),
  image_urls: z.array(z.string()).nullish(),
  author_name: z.string().nullish(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).nullish()
})

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")
    const expectedToken = process.env.N8N_API_KEY || process.env.ADMIN_SECRET
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = blogPayloadSchema.parse(body)
    
    // Determine slug: custom slug if provided, otherwise generate from title
    const rawSlug = parsed.slug?.trim() || parsed.title
    const slug = rawSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

    // Determine status & publication timestamp
    const status = parsed.status === "draft" ? "draft" : "published"
    const isDraft = status === "draft"
    const publishedAt = isDraft ? null : new Date().toISOString()

    // Generate custom post ID
    const id = `post_${crypto.randomUUID().replace(/-/g, "")}`

    const { data, error } = await supabaseAdmin
      .from("post")
      .insert({
        id,
        title: parsed.title,
        slug,
        content: parsed.content,
        category_id: parsed.category_id || "Digital Marketing",
        meta_title: parsed.meta_title || parsed.title,
        meta_description: parsed.meta_description || parsed.excerpt || "",
        excerpt: parsed.excerpt || "",
        featured_image: parsed.featured_image || null,
        image_urls: parsed.image_urls || [],
        author_name: parsed.author_name || "Mommantum Team",
        faqs: parsed.faqs || [],
        status,
        published_at: publishedAt,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // If draft: skip revalidation, cache warmup, and Google Indexing
    if (!isDraft) {
      // Revalidate Next.js cache for blog index and the new blog slug
      await revalidateContent({ type: "blog", slug }).catch((e) => {
        console.error("Failed to revalidate blog content:", e)
      })

      // Notify Google Indexing API in background
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mommantum.com"
      const postUrl = `${baseUrl}/blog/${slug}`
      notifyGoogleOfUpdate(postUrl, "URL_UPDATED").catch((e) => {
        console.error("Failed to notify indexing for URL:", postUrl, e)
      })

      // Warm up Next.js ISR cache by pre-rendering the page in the background
      fetch(postUrl).catch((e) => {
        console.error("Failed to warm up cache for URL:", postUrl, e)
      })
    }

    return NextResponse.json({ success: true, post: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
