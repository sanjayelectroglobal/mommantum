import { supabase } from "@lib/supabase"
import { unstable_cache } from "next/cache"

export type FAQ = {
  question: string
  answer: string
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  category_id: string | null
  featured_image: string | null
  image_urls: string[]
  excerpt: string | null
  content: string | null
  author_name: string | null
  status: string
  published_at: string | null
  updated_at: string | null
  meta_title: string | null
  meta_description: string | null
  faqs: FAQ[]
}

function normalizeImagePath(path: string): string {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path
  }
  return `/${path}`
}

function mapPost(p: any): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    category_id: p.category_id || null,
    featured_image: p.featured_image ? normalizeImagePath(p.featured_image) : null,
    image_urls: (p.image_urls || []).map(normalizeImagePath).filter(Boolean),
    excerpt: p.excerpt || null,
    content: p.content || null,
    author_name: p.author_name || null,
    status: p.status || "draft",
    published_at: p.published_at || null,
    updated_at: p.updated_at || null,
    meta_title: p.meta_title || null,
    meta_description: p.meta_description || null,
    faqs: p.faqs || [],
  }
}

export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const { data: posts, error } = await supabase
        .from("post")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("getBlogPosts error from database:", error.message)
        return []
      }
      return (posts || []).map(mapPost)
    } catch (err) {
      console.error("getBlogPosts error:", err)
      return []
    }
  },
  ["blog-posts-list"],
  { revalidate: 60, tags: ["blog-posts"] }
)

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!slug) return null
  try {
    const { data: post, error } = await supabase
      .from("post")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single()

    if (error || !post) {
      console.error("getBlogPost failed or not found in database:", error?.message, slug)
      return null
    }
    return mapPost(post)
  } catch (err) {
    console.error("getBlogPost error:", err)
    return null
  }
}