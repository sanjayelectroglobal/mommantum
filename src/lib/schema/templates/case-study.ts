import { DEFAULT_IN_LANGUAGE, getEntityId, normalizeUrl } from "../config"

export interface CaseStudyTemplateOptions {
  pageUrl: string
  baseUrl: string
  headline: string
  clientName?: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  relatedServiceId?: string
  keywords?: string[]
}

/**
 * Creates Article schema with articleSection "Case Study" for case studies (/work/[slug]).
 * @id format: {pageUrl}#article
 * about -> client Organization
 * mentions -> related service @id if linkable
 * Dates from DB timestamps (omitted if none). Never invents result properties.
 */
export function createCaseStudySchema(options: CaseStudyTemplateOptions): Record<string, any> {
  const {
    pageUrl,
    baseUrl,
    headline,
    clientName,
    description,
    image,
    datePublished,
    dateModified,
    relatedServiceId,
    keywords,
  } = options

  const articleId = getEntityId(pageUrl, "#article")
  const webpageId = getEntityId(pageUrl, "#webpage")
  const orgId = getEntityId(baseUrl, "#organization")

  const articleNode: Record<string, any> = {
    "@type": "Article",
    "@id": articleId,
    headline,
    url: pageUrl,
    articleSection: "Case Study",
    mainEntityOfPage: {
      "@id": webpageId,
    },
    author: {
      "@id": orgId,
    },
    publisher: {
      "@id": orgId,
    },
    inLanguage: DEFAULT_IN_LANGUAGE,
  }

  if (clientName && clientName.trim()) {
    articleNode.about = {
      "@type": "Organization",
      name: clientName.trim(),
    }
  }

  if (description && description.trim()) {
    articleNode.description = description.trim()
  }

  if (image && image.trim()) {
    articleNode.image = normalizeUrl(image, baseUrl)
  }

  if (datePublished && datePublished.trim()) {
    articleNode.datePublished = datePublished.trim()
  }

  if (dateModified && dateModified.trim()) {
    articleNode.dateModified = dateModified.trim()
  }

  if (relatedServiceId && relatedServiceId.trim()) {
    articleNode.mentions = {
      "@id": relatedServiceId.trim(),
    }
  }

  if (keywords && keywords.length > 0) {
    const cleanKeywords = Array.from(new Set(keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)
    if (cleanKeywords.length > 0) {
      articleNode.keywords = cleanKeywords.join(", ")
    }
  }

  return articleNode
}
