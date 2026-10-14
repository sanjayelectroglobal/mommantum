import { CaseStudy } from "@lib/data/case-studies"
import { SeoSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL, normalizeUrl } from "../config"
import { ResolvedData } from "./types"

export function resolveCaseStudyData(
  study: CaseStudy,
  seoSetting?: SeoSetting | null
): ResolvedData {
  const canonicalUrl = `${DEFAULT_BASE_URL}/work/${study.slug}`
  const title = seoSetting?.meta_title || `${study.title} | Mommantum Work`
  const description =
    seoSetting?.meta_description ||
    study.tagline ||
    study.about ||
    study.challenge ||
    `${study.title} case study by Mommantum.`

  const rawKeywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
    study.category,
    study.title,
  ].filter(Boolean) as string[]

  const keywords = Array.from(new Set(rawKeywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)

  const image = study.image
    ? normalizeUrl(study.image, DEFAULT_BASE_URL)
    : seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const breadcrumbs = [
    { name: "Home", url: `${DEFAULT_BASE_URL}/` },
    { name: "Work", url: `${DEFAULT_BASE_URL}/work` },
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
    faqs: undefined,
    clientName: study.title,
    datePublished,
    dateModified,
    articleSection: "Case Study",
  }
}
