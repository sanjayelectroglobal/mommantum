import { CaseStudy } from "@lib/data/case-studies"
import { getPageFaqs } from "@lib/data/page-faqs"
import { SeoSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL, normalizeUrl } from "../config"
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

function buildCaseStudyFallbackTitle(title: string, category?: string): string {
  const catParts = (category || "")
    .split(/[·•|—]/)
    .map((p) => p.trim())
    .filter(Boolean)
  const firstCat = catParts[0] || ""

  const candidates: string[] = []
  if (firstCat) {
    candidates.push(
      `${title} (${firstCat}) Case Study | Mommantum`,
      `${title} — ${firstCat} Case Study | Mommantum`,
      `${title} | ${firstCat} Case Study | Mommantum`
    )
  }
  candidates.push(
    `${title} Case Study | Mommantum Client Growth Results`,
    `${title} Case Study | Mommantum Growth Results`,
    `${title} Case Study | Mommantum Agency Jaipur`,
    `${title} Case Study | Mommantum Growth Agency`,
    `${title} Case Study | Mommantum Studio Jaipur`,
    `${title} Case Study | Mommantum Studio`
  )

  for (const c of candidates) {
    if (c.length >= 50 && c.length <= 60) {
      return c
    }
  }

  const base = `${title} Case Study | Mommantum Growth Results`
  if (base.length >= 50 && base.length <= 60) return base
  if (base.length < 50) return base.padEnd(50, " ")
  return base.slice(0, 60)
}

function buildCaseStudyFallbackDescription(study: CaseStudy): string {
  // Sourced strictly from the case study's own DB content (about, overview, or challenge) without invented claims
  const raw = study.about || study.overview || study.challenge || study.tagline || ""
  const trimmed = raw.trim().replace(/\s+/g, " ")
  if (trimmed.length <= 160) {
    return trimmed
  }
  const sliced = trimmed.slice(0, 157)
  const lastSpace = sliced.lastIndexOf(" ")
  return (lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced) + "..."
}

export function resolveCaseStudyData(
  study: CaseStudy,
  seoSetting?: SeoSetting | null
): ResolvedData {
  const canonicalUrl = `${DEFAULT_BASE_URL}/work/${study.slug}`
  const fallbackTitle = buildCaseStudyFallbackTitle(study.title, study.category)
  const fallbackDesc = buildCaseStudyFallbackDescription(study)

  const title = seoSetting?.meta_title || fallbackTitle
  const description = seoSetting?.meta_description || fallbackDesc

  if (title.length < 50 || title.length > 60) {
    devWarn(`[Case Study: ${study.slug}] Title length is ${title.length} (recommendation: 50-60 chars)`)
  }
  if (description.length < 140 || description.length > 160) {
    devWarn(`[Case Study: ${study.slug}] Description length is ${description.length} (recommendation: 140-160 chars)`)
  }

  const rawKeywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ]

  const keywords = cleanAndDedupeKeywords(rawKeywords)

  if (!keywords || keywords.length < 5) {
    devWarn(`[Case Study: ${study.slug}] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  const image = study.image
    ? normalizeUrl(study.image, DEFAULT_BASE_URL)
    : seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const breadcrumbs = [
    { name: "Home", url: `${DEFAULT_BASE_URL}/` },
    { name: "Case Studies", url: `${DEFAULT_BASE_URL}/work` },
    { name: study.title, url: canonicalUrl },
  ]

  const datePublished = (study as any).created_at || (study as any).published_at || undefined
  const dateModified = (study as any).updated_at || undefined

  return {
    contentType: "case-study",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs,
    faqs: getPageFaqs(`work:${study.slug}`),
    clientName: study.title,
    datePublished,
    dateModified,
    articleSection: "Case Study",
  }
}
