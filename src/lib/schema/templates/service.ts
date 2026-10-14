import { getEntityId, normalizeUrl } from "../config"

export interface ServiceTemplateOptions {
  pageUrl: string
  baseUrl: string
  name: string
  description?: string
  image?: string
  serviceType?: string
  areaServed?: string[]
  deliverables?: string[]
  keywords?: string[]
  offers?: {
    price: number | string
    priceCurrency: string
    url?: string
  }
}

/**
 * Creates Service schema.
 * @id format: {pageUrl}#service
 * Provider points to {baseUrl}/#organization
 * offers included ONLY if real price data exists.
 */
export function createServiceSchema(options: ServiceTemplateOptions): Record<string, any> {
  const {
    pageUrl,
    baseUrl,
    name,
    description,
    image,
    serviceType,
    areaServed,
    deliverables,
    keywords,
    offers,
  } = options

  const serviceId = getEntityId(pageUrl, "#service")
  const orgId = getEntityId(baseUrl, "#organization")

  const serviceNode: Record<string, any> = {
    "@type": "Service",
    "@id": serviceId,
    name,
    url: pageUrl,
    provider: {
      "@id": orgId,
    },
    serviceType: serviceType || name,
  }

  if (description && description.trim()) {
    serviceNode.description = description.trim()
  }

  if (image && image.trim()) {
    serviceNode.image = normalizeUrl(image, baseUrl)
  }

  if (areaServed && areaServed.length > 0) {
    serviceNode.areaServed = areaServed
  }

  if (deliverables && deliverables.length > 0) {
    serviceNode.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: `${name} Deliverables`,
      itemListElement: deliverables.map((item, idx) => ({
        "@type": "OfferCatalog",
        name: item,
        position: idx + 1,
      })),
    }
  }

  if (keywords && keywords.length > 0) {
    const cleanKeywords = Array.from(new Set(keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)
    if (cleanKeywords.length > 0) {
      serviceNode.keywords = cleanKeywords.join(", ")
    }
  }

  // Offers ONLY if real price data is provided
  if (offers && offers.price !== undefined && offers.price !== null && offers.price !== "") {
    serviceNode.offers = {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency || "INR",
      url: offers.url || pageUrl,
    }
  }

  return serviceNode
}
