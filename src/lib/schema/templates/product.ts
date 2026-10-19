import { DEFAULT_BASE_URL, getEntityId, normalizeUrl } from "../config"

export interface ProductTemplateOptions {
  pageUrl: string
  baseUrl?: string
  name: string
  description?: string
  image?: string | string[]
  sku?: string
  mpn?: string
  gtin?: string
  brandName?: string
  price?: number | string
  currency?: string
  inStock?: boolean
  offers?: Record<string, any>
  ratingValue?: number
  reviewCount?: number
}

/**
 * Creates Product schema adhering to:
 * - Product (@id #product; sku, mpn, gtin, brand, manufacturer, offers with seller reference)
 * - offers.seller is reference to #organization only
 * - aggregateRating and review only if visible on page
 */
export function createProductSchema(options: ProductTemplateOptions): Record<string, any> {
  const {
    pageUrl,
    baseUrl = DEFAULT_BASE_URL,
    name,
    description,
    image,
    sku,
    mpn,
    gtin,
    brandName = "Mommantum",
    price,
    currency = "INR",
    inStock = true,
    offers,
    ratingValue,
    reviewCount,
  } = options

  const productId = getEntityId(pageUrl, "#product")
  const orgId = getEntityId(baseUrl, "#organization")

  const productNode: Record<string, any> = {
    "@type": "Product",
    "@id": productId,
    name,
    url: pageUrl,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    manufacturer: {
      "@id": orgId,
    },
  }

  if (description && description.trim()) {
    productNode.description = description.trim()
  }

  if (image) {
    if (Array.isArray(image)) {
      productNode.image = image.map((img) => normalizeUrl(img, baseUrl))
    } else if (typeof image === "string" && image.trim()) {
      productNode.image = [normalizeUrl(image, baseUrl)]
    }
  }

  if (sku && sku.trim()) {
    productNode.sku = sku.trim()
  }

  if (mpn && mpn.trim()) {
    productNode.mpn = mpn.trim()
  }

  if (gtin && gtin.trim()) {
    productNode.gtin = gtin.trim()
  }

  if (offers) {
    productNode.offers = {
      ...offers,
      seller: {
        "@id": orgId,
      },
    }
  } else if (price !== undefined) {
    const formattedPrice = typeof price === "number" ? price.toFixed(2) : String(price)
    productNode.offers = {
      "@type": "Offer",
      price: formattedPrice,
      priceCurrency: currency,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@id": orgId,
      },
    }
  }

  if (ratingValue && reviewCount) {
    productNode.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(ratingValue),
      reviewCount: String(reviewCount),
    }
  }

  return productNode
}
