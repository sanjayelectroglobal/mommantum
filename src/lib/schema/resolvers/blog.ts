import { BlogPost } from "@lib/data/blog-posts"
import { SeoSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL, normalizeUrl } from "../config"
import { ResolvedData } from "./types"

function cleanCategoryName(rawCategory?: string | null): string {
  if (!rawCategory || !rawCategory.trim()) return "Digital Marketing"
  const val = rawCategory.trim()
  // Check if raw category is a UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidRegex.test(val)) {
    return "Digital Marketing"
  }
  return val
}

export function resolveBlogData(
  post: BlogPost,
  seoSetting?: SeoSetting | null
): ResolvedData {
  const canonicalUrl = `${DEFAULT_BASE_URL}/blog/${post.slug}`
  const title = seoSetting?.meta_title || post.meta_title || post.title
  const description =
    seoSetting?.meta_description ||
    post.meta_description ||
    post.excerpt ||
    post.title

  const categoryName = cleanCategoryName(post.category_id)

  const rawKeywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
    categoryName,
  ].filter(Boolean) as string[]

  const keywords = Array.from(new Set(rawKeywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)

  const image = post.featured_image
    ? normalizeUrl(post.featured_image, DEFAULT_BASE_URL)
    : seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const breadcrumbs = [
    { name: "Home", url: `${DEFAULT_BASE_URL}/` },
    { name: "Blog", url: `${DEFAULT_BASE_URL}/blog` },
    { name: post.title, url: canonicalUrl },
  ]

  // FAQs visibly rendered via BlogFaqAccordion on /blog/[slug]
  const faqs = post.faqs?.length
    ? post.faqs.map((f) => ({
        question: f.question,
        answer: f.answer,
      }))
    : undefined

  return {
    contentType: "blog",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs,
    faqs,
    authorName: post.author_name || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || undefined,
    articleSection: categoryName,
  }
}
