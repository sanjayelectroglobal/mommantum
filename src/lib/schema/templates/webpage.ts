import { DEFAULT_IN_LANGUAGE, getEntityId, normalizeUrl } from "../config"

export interface WebPageTemplateOptions {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "ItemPage"
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
  hasPart?: Record<string, any> | null
  /** Full BreadcrumbList node; nested inside the WebPage (WebPage.breadcrumb) so both live in one place. */
  breadcrumb?: Record<string, any> | null
}

/**
 * Creates WebPage (or subtype AboutPage, ContactPage, CollectionPage, ItemPage) schema.
 * Properties name/description/url/image match <title>, meta description, canonical, og:image.
 * @id format: {pageUrl}#webpage
 * Nested FAQPage via hasPart (never standalone).
 * Cross-page references: isPartOf -> #website, about -> #organization.
 * About/Contact pages reference #organization via mainEntity.
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
    includeWebSite = true,
    hasPart,
    breadcrumb,
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
    // BreadcrumbList is nested here (not a separate graph node) so the reference and the list stay together.
    breadcrumb: breadcrumb || {
      "@id": breadcrumbId,
    },
    inLanguage: DEFAULT_IN_LANGUAGE,
  }

  // Cross-page reference to WebSite: all pages point to #website
  if (includeWebSite !== false) {
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
    const cleanKeywords = Array.from(new Set(keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)
    if (cleanKeywords.length > 0) {
      pageNode.keywords = cleanKeywords.join(", ")
    }
  }

  // Main entity rule:
  // - Explicit mainEntityId if provided (e.g. pointing to #product, #itemlist, or #article)
  // - About and Contact pages point to #organization
  if (mainEntityId) {
    pageNode.mainEntity = {
      "@id": mainEntityId,
    }
  } else if (type === "AboutPage" || type === "ContactPage") {
    pageNode.mainEntity = {
      "@id": orgId,
    }
  }

  // Nested FAQPage via hasPart (never standalone in graph)
  if (hasPart) {
    pageNode.hasPart = hasPart
  }

  return pageNode
}
