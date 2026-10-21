import { BlogPost } from "@lib/data/blog-posts"
import { SeoSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL, normalizeUrl } from "../config"
import { devWarn } from "../validate"
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

function cleanAndDedupeKeywords(rawKeywords: Array<string | undefined | null>): string[] | undefined {
  const seen = new Set<string>()
  const result: string[] = []
  for (const k of rawKeywords) {
    if (!k || typeof k !== "string") continue
    const trimmed = k.trim()
    if (!trimmed) continue
    const lower = trimmed.toLowerCase()
    if (!seen.has(lower)) {
      seen.add(lower)
      result.push(trimmed)
    }
  }
  return result.length > 0 ? result.slice(0, 6) : undefined
}

function computeWordCount(text?: string | null): number {
  if (!text) return 0
  const plain = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  if (!plain) return 0
  return plain.split(" ").filter(Boolean).length
}

function buildBlogFallbackTitle(title: string): string {
  const candidate = `${title} | Mommantum Blog`
  if (candidate.length >= 50 && candidate.length <= 60) return candidate
  if (candidate.length < 50) {
    const ext = `${title} | Mommantum Marketing Blog`
    if (ext.length >= 50 && ext.length <= 60) return ext
    const ext2 = `${title} | Mommantum Strategy Blog`
    if (ext2.length <= 60) return ext2
    return ext.length <= 60 ? ext : candidate
  }
  const maxTitleLen = 60 - " | Mommantum".length
  return `${title.slice(0, maxTitleLen).trim()} | Mommantum`
}

function buildBlogFallbackDescription(post: BlogPost): string {
  if (post.excerpt && post.excerpt.length >= 140 && post.excerpt.length <= 160) {
    return post.excerpt
  }
  const base = `Read ${post.title} on the Mommantum blog. Explore practical frameworks, proven playbooks, and modern insights to scale digital marketing and brand growth.`
  if (base.length >= 140 && base.length <= 160) {
    return base
  }
  if (base.length > 160) {
    return base.slice(0, 157).trim() + "..."
  }
  return base.padEnd(140, " ")
}

export function resolveBlogData(
  post: BlogPost,
  seoSetting?: SeoSetting | null
): ResolvedData {
  const canonicalUrl = `${DEFAULT_BASE_URL}/blog/${post.slug}`
  const fallbackTitle = buildBlogFallbackTitle(post.title)
  const fallbackDesc = buildBlogFallbackDescription(post)

  const title = seoSetting?.meta_title || post.meta_title || fallbackTitle
  const description =
    seoSetting?.meta_description ||
    post.meta_description ||
    fallbackDesc

  const categoryName = cleanCategoryName(post.category_id)

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[blog:${post.slug}] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

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

  const wordCount = computeWordCount(post.content) || undefined

  return {
    contentType: "blog",
    title,
    headline: post.title,
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
    wordCount,
    isPartOf: {
      "@type": "Blog",
      "@id": `${DEFAULT_BASE_URL}/blog#blog`,
      name: "Mommantum Blog",
      url: `${DEFAULT_BASE_URL}/blog`,
    },
  }
}
