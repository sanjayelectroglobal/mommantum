import { Service } from "@lib/data/services"
import { SeoSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL } from "../config"
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

function hasDuplicateWords(s: string): boolean {
  const words = s.toLowerCase().match(/\b[a-z0-9]+\b/g) || []
  const seen = new Set<string>()
  for (const w of words) {
    if (seen.has(w)) return true
    seen.add(w)
  }
  return false
}

function buildServiceFallbackTitle(title: string): string {
  let trimmed = title.trim()

  // Clean repetitive phrases in raw service titles so fallback stays clean and within 60 chars
  if (trimmed.includes("Meta Ads & Google Ads")) {
    trimmed = trimmed.replace("Meta Ads & Google Ads", "Meta & Google Ads")
  }
  if (trimmed.includes("SMO and Content Creation")) {
    trimmed = trimmed.replace("SMO and Content Creation", "SMO & Content")
  }

  const hasServiceWord = /\bservices?\b/i.test(trimmed)

  // Brand suffixes that do NOT contain the word Service/Services
  const brandSuffixes = [
    " | Mommantum Growth Studio Jaipur Agency",
    " | Mommantum Digital Marketing Agency",
    " | Mommantum Growth Studio Jaipur",
    " | Mommantum Growth Agency Jaipur",
    " | Mommantum Jaipur Growth Agency",
    " | Mommantum Studio Jaipur Agency",
    " | Mommantum Creative Growth Agency",
    " | Mommantum Marketing Agency",
    " | Mommantum Studio Jaipur",
    " | Mommantum Agency Jaipur",
    " | Mommantum Growth Studio",
    " | Mommantum Growth Agency",
    " | Mommantum Jaipur Agency",
    " | Mommantum Studio",
    " | Mommantum Agency",
    " | Mommantum Jaipur",
    " | Mommantum",
  ]

  // Service suffixes that contain the word Services (only used if title does not already have Service/Services)
  const serviceSuffixes = [
    " Services | Mommantum Growth Studio Jaipur",
    " Services | Mommantum Growth Agency Jaipur",
    " Services | Mommantum Jaipur Growth Agency",
    " Services | Mommantum Growth Studio",
    " Services | Mommantum Growth Agency",
    " Services | Mommantum Jaipur Agency",
    " Services | Mommantum Studio Jaipur",
    " Services | Mommantum Agency Jaipur",
    " Services | Mommantum Jaipur",
    " Services | Mommantum Studio",
    " Services | Mommantum Agency",
    " Services | Mommantum",
  ]

  if (hasServiceWord) {
    for (const suf of brandSuffixes) {
      const cand = `${trimmed}${suf}`
      if (cand.length >= 50 && cand.length <= 60 && !hasDuplicateWords(cand)) {
        return cand
      }
    }
  } else {
    for (const suf of serviceSuffixes) {
      const cand = `${trimmed}${suf}`
      if (cand.length >= 50 && cand.length <= 60 && !hasDuplicateWords(cand)) {
        return cand
      }
    }
    for (const suf of brandSuffixes) {
      const cand = `${trimmed}${suf}`
      if (cand.length >= 50 && cand.length <= 60 && !hasDuplicateWords(cand)) {
        return cand
      }
    }
  }

  const base = `${trimmed} | Mommantum`
  if (base.length >= 50 && base.length <= 60) return base
  if (base.length > 60) {
    const cut = trimmed.slice(0, 60 - " | Mommantum".length).trimEnd()
    return `${cut} | Mommantum`
  }
  return base
}

function buildServiceFallbackDescription(rawDesc: string): string {
  const trimmed = rawDesc.trim().replace(/\s+/g, " ")
  if (!trimmed) return ""
  if (trimmed.length <= 160 && !trimmed.endsWith("...")) {
    return trimmed
  }

  const clean = trimmed.replace(/(\.\.\.|…)$/, "").trim()
  if (clean.length <= 160 && /[.!?]$/.test(clean)) {
    return clean
  }

  const sentenceMatches = Array.from(clean.matchAll(/[^.!?]+[.!?]/g))
  let bestSentence = ""
  for (const m of sentenceMatches) {
    const cand = (bestSentence + (bestSentence ? " " : "") + m[0].trim()).trim()
    if (cand.length <= 160) {
      bestSentence = cand
    } else {
      break
    }
  }
  if (bestSentence && bestSentence.length >= 60) {
    return bestSentence
  }

  const sliced = clean.slice(0, 160)
  const lastPunct = Math.max(sliced.lastIndexOf(","), sliced.lastIndexOf(";"), sliced.lastIndexOf("—"))
  if (lastPunct > 100) {
    return sliced.slice(0, lastPunct).trim()
  }

  const lastSpace = sliced.lastIndexOf(" ")
  if (lastSpace > 100) {
    return sliced.slice(0, lastSpace).trim()
  }

  return sliced.trim()
}

export function resolveServiceData(
  service: Service,
  seoSetting?: SeoSetting | null
): ResolvedData {
  const canonicalUrl = `${DEFAULT_BASE_URL}/services/${service.slug}`
  const fallbackTitle = buildServiceFallbackTitle(service.title)
  const title = seoSetting?.meta_title || fallbackTitle

  // Build description directly from the service's own DB content (no invented details, no padding)
  const rawDescription = seoSetting?.meta_description || service.description || service.intro || ""
  const description = seoSetting?.meta_description
    ? seoSetting.meta_description
    : buildServiceFallbackDescription(rawDescription)

  if (description.length < 140 || description.length > 160) {
    devWarn(`[Service: ${service.slug}] Fallback description is ${description.length} chars (recommendation: 140-160 chars).`)
  }

  // Deduplicate keywords case-insensitively, strictly reading DB primary and secondary
  const rawKeywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ]

  const keywords = cleanAndDedupeKeywords(rawKeywords)

  if (!keywords || keywords.length < 5) {
    devWarn(`[Service: ${service.slug}] Keyword count is ${keywords?.length || 0} (recommendation: >= 5). Needs keywords from owner.`)
  }

  const image = seoSetting?.og_image || service.image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const deliverables = [
    ...(service.points || []),
    ...(service.outcomes || []),
  ].filter(Boolean)

  const breadcrumbs = [
    { name: "Home", url: `${DEFAULT_BASE_URL}/` },
    { name: "Services", url: `${DEFAULT_BASE_URL}/services` },
    { name: service.title, url: canonicalUrl },
    { name: "Contact", url: `${DEFAULT_BASE_URL}/contact` },
  ]

  // FAQs come strictly from service.faqs (services table in DB)
  const rawFaqs = service.faqs || []
  if (rawFaqs.length < 8) {
    devWarn(`[Service: ${service.slug}] FAQ count is ${rawFaqs.length} (recommendation: 8-10 FAQs).`)
  }

  const faqs = rawFaqs.length
    ? rawFaqs.slice(0, 10).map((f) => ({
        question: f.question,
        answer: f.answer,
      }))
    : undefined

  return {
    contentType: "service",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs,
    faqs,
    serviceType: service.title,
    deliverables: deliverables.length ? deliverables : undefined,
    offers: undefined,
  }
}
