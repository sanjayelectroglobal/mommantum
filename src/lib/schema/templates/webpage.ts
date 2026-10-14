import { DEFAULT_IN_LANGUAGE, getEntityId, normalizeUrl } from "../config"

export interface WebPageTemplateOptions {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage"
  pageUrl: string
  baseUrl: string
  name: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  keywords?: string[]
  mainEntityId?: string
  includeWebSite?: boolean
}

/**
 * Creates WebPage (or subtype AboutPage, ContactPage, CollectionPage) schema.
 * Properties name/description/url/image match <title>, meta description, canonical, og:image.
 * @id format: {pageUrl}#webpage
 */
export function createWebPageSchema(options: WebPageTemplateOptions): Record<string, any> {
  const {
    type = "WebPage",
    pageUrl,
    baseUrl,
    name,
    description,
    image,
    datePublished,
    dateModified,
    keywords,
    mainEntityId,
    includeWebSite = false,
  } = options

  const webpageId = getEntityId(pageUrl, "#webpage")
  const websiteId = getEntityId(baseUrl, "#website")
  const orgId = getEntityId(baseUrl, "#organization")
  const breadcrumbId = getEntityId(pageUrl, "#breadcrumb")

  const pageNode: Record<string, any> = {
    "@type": type,
    "@id": webpageId,
    url: pageUrl,
    name,
    about: {
      "@id": orgId,
    },
    breadcrumb: {
      "@id": breadcrumbId,
    },
    inLanguage: DEFAULT_IN_LANGUAGE,
  }

  if (includeWebSite) {
    pageNode.isPartOf = {
      "@id": websiteId,
    }
  }

  if (description && description.trim()) {
    pageNode.description = description.trim()
  }

  if (datePublished && datePublished.trim()) {
    pageNode.datePublished = datePublished.trim()
  }

  if (dateModified && dateModified.trim()) {
    pageNode.dateModified = dateModified.trim()
  }

  if (image && image.trim()) {
    const fullImage = normalizeUrl(image, baseUrl)
    pageNode.image = fullImage
    pageNode.primaryImageOfPage = {
      "@type": "ImageObject",
      url: fullImage,
    }
  }

  if (keywords && keywords.length > 0) {
    // Primary first, max 6, no stuffing
    const cleanKeywords = Array.from(new Set(keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)
    if (cleanKeywords.length > 0) {
      pageNode.keywords = cleanKeywords.join(", ")
    }
  }

  if (mainEntityId) {
    pageNode.mainEntity = {
      "@id": mainEntityId,
    }
  }

  return pageNode
}
