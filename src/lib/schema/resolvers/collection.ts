import { SeoSetting } from "@lib/data/seo"
import { getPageFaqs } from "@lib/data/page-faqs"
import { BLOG_BREADCRUMB_LATEST_COUNT, DEFAULT_BASE_URL } from "../config"
import { getPageMetaDefault } from "../page-defaults"
import { devWarn } from "../validate"
import { ResolvedData } from "./types"

export interface CollectionItemInput {
  name?: string
  title?: string
  slug?: string
  handle?: string
  published_at?: string | null
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

// Phase 4: Removed store collection option from schema resolver; retained services, work, blog.
export function resolveCollectionData(options: {
  section: "services" | "work" | "blog"
  items: CollectionItemInput[]
  seoSetting?: SeoSetting | null
}): ResolvedData {
  const { section, items, seoSetting } = options

  const defaultMeta = getPageMetaDefault(section)

  const sectionConfig = {
    services: {
      title: defaultMeta?.title || "Marketing, SEO, Web and AI Services | Mommantum Jaipur",
      description:
        defaultMeta?.description ||
        "Explore Mommantum services: performance marketing, SEO, social media, branding, web and app development, AI automation, AI agents and video production.",
      path: "/services",
      name: "Services",
      collectionType: "CollectionPage" as const,
      prefix: "/services/",
    },
    work: {
      title: defaultMeta?.title || "Case Studies | Mommantum Client Work and Growth Results",
      description:
        defaultMeta?.description ||
        "See how Mommantum helps brands grow. Browse case studies across ecommerce, SEO, web development and creative systems, with real strategy and results.",
      path: "/work",
      name: "Case Studies",
      collectionType: "CollectionPage" as const,
      prefix: "/work/",
    },
    blog: {
      title: defaultMeta?.title || "Mommantum Blog | SEO, Marketing and AI Growth Playbooks",
      description:
        defaultMeta?.description ||
        "Read practical guides from the Mommantum team on SEO, performance marketing, AI automation and scaling D2C brands, written for founders and marketers.",
      path: "/blog",
      name: "Blog",
      collectionType: "Blog" as const,
      prefix: "/blog/",
    },
  }[section]

  const canonicalUrl = `${DEFAULT_BASE_URL}${sectionConfig.path}`
  const title = seoSetting?.meta_title || sectionConfig.title
  const description = seoSetting?.meta_description || sectionConfig.description
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[${section}] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  const collectionItems = items.map((it) => {
    const slug = it.slug || it.handle || ""
    const name = it.title || it.name || slug
    return {
      name,
      url: `${DEFAULT_BASE_URL}${sectionConfig.prefix}${slug}`,
    }
  })

  const breadcrumbs = [
    { name: "Home", url: `${DEFAULT_BASE_URL}/` },
    { name: sectionConfig.name, url: canonicalUrl },
  ]

  if (section === "services") {
    breadcrumbs.push(...collectionItems)
  } else if (section === "work") {
    breadcrumbs.push(...collectionItems)
    breadcrumbs.push({ name: "Services", url: `${DEFAULT_BASE_URL}/services` })
  } else if (section === "blog") {
    const latest = items
      .filter((it) => (it.slug || it.handle) && (it.title || it.name))
      .sort((a, b) => {
        const ta = a.published_at ? Date.parse(a.published_at) : 0
        const tb = b.published_at ? Date.parse(b.published_at) : 0
        return tb - ta
      })
      .slice(0, BLOG_BREADCRUMB_LATEST_COUNT)
    breadcrumbs.push(
      ...latest.map((it) => ({
        name: (it.title || it.name || it.slug) as string,
        url: `${DEFAULT_BASE_URL}${sectionConfig.prefix}${it.slug || it.handle}`,
      }))
    )
  }

  // Sourced FAQs: agency collection pages get 8-10 FAQs from page-faqs
  const faqs = getPageFaqs(section)

  return {
    contentType: "collection",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs,
    faqs,
    collectionType: sectionConfig.collectionType,
    collectionItems,
  }
}
