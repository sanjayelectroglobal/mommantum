import { Service } from "@lib/data/services"
import { SeoSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL } from "../config"
import { ResolvedData } from "./types"

export function resolveServiceData(
  service: Service,
  seoSetting?: SeoSetting | null
): ResolvedData {
  const canonicalUrl = `${DEFAULT_BASE_URL}/services/${service.slug}`
  const title = seoSetting?.meta_title || `${service.title} | Mommantum`
  const description =
    seoSetting?.meta_description ||
    service.description ||
    service.intro ||
    `${service.title} services by Mommantum.`

  const rawKeywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
    service.title,
    service.shortLabel,
  ].filter(Boolean) as string[]

  const keywords = Array.from(new Set(rawKeywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)

  const image = seoSetting?.og_image || service.image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const deliverables = [
    ...(service.points || []),
    ...(service.outcomes || []),
  ].filter(Boolean)

  const breadcrumbs = [
    { name: "Home", url: `${DEFAULT_BASE_URL}/` },
    { name: "Services", url: `${DEFAULT_BASE_URL}/services` },
    { name: service.title, url: canonicalUrl },
  ]

  // FAQs strictly from service.faqs (which is visibly rendered via FaqAccordion)
  const faqs = service.faqs?.length
    ? service.faqs.map((f) => ({
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
    // Offers: only if real price field exists (default none per prompt)
    offers: undefined,
  }
}
