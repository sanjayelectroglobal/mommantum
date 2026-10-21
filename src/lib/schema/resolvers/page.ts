import { SeoSetting } from "@lib/data/seo"
import { getPageFaqs } from "@lib/data/page-faqs"
import { DEFAULT_BASE_URL, EDITZ_SERVICE_LINKS, SITE_NAV_LINKS } from "../config"
import { getPageMetaDefault } from "../page-defaults"
import { devWarn } from "../validate"
import { ResolvedData } from "./types"

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

export function resolveHomepageData(seoSetting?: SeoSetting | null): ResolvedData {
  const fallback = getPageMetaDefault("homepage")!
  const title = seoSetting?.meta_title || fallback.title
  const description = seoSetting?.meta_description || fallback.description
  const canonicalUrl = DEFAULT_BASE_URL
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[Homepage] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  const faqs = (seoSetting as any)?.faq_section?.length ? (seoSetting as any).faq_section : getPageFaqs("homepage")

  return {
    contentType: "homepage",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    // Home + every main navigation link (Editz, Services, Blog AI, About, Case Studies, Blog)
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      ...SITE_NAV_LINKS.map((l) => ({ name: l.name, url: `${DEFAULT_BASE_URL}${l.path}` })),
    ],
    faqs,
  }
}

export function resolveAboutData(seoSetting?: SeoSetting | null): ResolvedData {
  const fallback = getPageMetaDefault("about")!
  const title = seoSetting?.meta_title || fallback.title
  const description = seoSetting?.meta_description || fallback.description
  const canonicalUrl = `${DEFAULT_BASE_URL}/about`
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[About] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  return {
    contentType: "about",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "About", url: canonicalUrl },
    ],
    faqs: getPageFaqs("about"),
  }
}

export function resolveContactData(seoSetting?: SeoSetting | null): ResolvedData {
  const fallback = getPageMetaDefault("contact")!
  const title = seoSetting?.meta_title || fallback.title
  const description = seoSetting?.meta_description || fallback.description
  const canonicalUrl = `${DEFAULT_BASE_URL}/contact`
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[Contact] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  return {
    contentType: "contact",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "Contact", url: canonicalUrl },
    ],
    faqs: getPageFaqs("contact"),
  }
}

export function resolveLegalPageData(
  slug: "privacy-policy" | "terms-and-conditions" | "blog-ai" | "faq",
  fallbackTitle: string,
  fallbackDescription: string,
  seoSetting?: SeoSetting | null,
  faqs?: Array<{ question: string; answer: string }>
): ResolvedData {
  const fallback = getPageMetaDefault(slug)
  const title = seoSetting?.meta_title || fallback?.title || fallbackTitle
  const description = seoSetting?.meta_description || fallback?.description || fallbackDescription
  const canonicalUrl = `${DEFAULT_BASE_URL}/${slug}`
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[${slug}] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  const resolvedFaqs = faqs && faqs.length ? faqs : getPageFaqs(slug)

  return {
    contentType: "page",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: (fallback?.title || fallbackTitle).split(" | ")[0], url: canonicalUrl },
    ],
    faqs: resolvedFaqs,
  }
}

export function resolveEditzData(seoSetting?: SeoSetting | null): ResolvedData {
  const fallback = getPageMetaDefault("editz")!
  const title = seoSetting?.meta_title || fallback.title
  const description = seoSetting?.meta_description || fallback.description
  const canonicalUrl = `${DEFAULT_BASE_URL}/editz`
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = cleanAndDedupeKeywords([
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ])

  if (!keywords || keywords.length < 5) {
    devWarn(`[Editz] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  return {
    contentType: "editz",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "Editz", url: canonicalUrl },
      ...EDITZ_SERVICE_LINKS.map((l) => ({ name: l.name, url: `${DEFAULT_BASE_URL}${l.path}` })),
    ],
    faqs: getPageFaqs("editz"),
  }
}
