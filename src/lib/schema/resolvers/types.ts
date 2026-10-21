import { Metadata } from "next"

export interface BreadcrumbEntry {
  name: string
  url: string
}

export interface FAQEntry {
  question: string
  answer: string
}

export interface ResolvedData {
  contentType:
    | "homepage"
    | "about"
    | "contact"
    | "service"
    | "blog"
    | "case-study"
    | "collection"
    | "page"
    | "editz"
    | "store"
    | "product"
  title: string
  description: string
  canonicalUrl: string
  image?: string
  keywords?: string[]
  datePublished?: string
  dateModified?: string
  breadcrumbs: BreadcrumbEntry[]
  faqs?: FAQEntry[]
  // Service extras
  serviceType?: string
  deliverables?: string[]
  offers?: {
    price: number | string
    priceCurrency: string
    url?: string
  }
  // Blog extras
  headline?: string
  authorName?: string
  articleSection?: string
  wordCount?: number
  isPartOf?: Record<string, any>
  tags?: string[]
  // Case study extras
  clientName?: string
  relatedServiceId?: string
  // Collection extras
  collectionType?: "CollectionPage" | "Blog"
  collectionItems?: Array<{ name: string; url: string }>
}

/**
 * Builds standard Next.js Metadata from neutral ResolvedData.
 * Ensures <title>, meta description, canonical, OG, and Twitter match JSON-LD 1-to-1.
 */
export function buildMetadataFromResolved(resolved: ResolvedData): Metadata {
  const isArticle = resolved.contentType === "blog" || resolved.contentType === "case-study"
  const ogImageUrl = resolved.image || "https://www.mommantum.com/opengraph-image.jpg"
  const twitterImageUrl = resolved.image || "https://www.mommantum.com/twitter-image.jpg"

  return {
    metadataBase: new URL("https://www.mommantum.com"),
    title: resolved.title,
    description: resolved.description,
    applicationName: "Mommantum",
    keywords: resolved.keywords && resolved.keywords.length ? resolved.keywords : undefined,
    alternates: resolved.canonicalUrl ? { canonical: resolved.canonicalUrl } : undefined,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: resolved.title,
      description: resolved.description,
      url: resolved.canonicalUrl,
      siteName: "Mommantum",
      locale: "en_IN",
      type: isArticle ? "article" : "website",
      ...(resolved.contentType === "blog"
        ? {
            publishedTime: resolved.datePublished,
            modifiedTime: resolved.dateModified,
            authors: resolved.authorName ? [resolved.authorName] : undefined,
            section: resolved.articleSection,
            tags: resolved.keywords && resolved.keywords.length ? resolved.keywords : undefined,
          }
        : {}),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: resolved.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolved.title,
      description: resolved.description,
      images: [twitterImageUrl],
    },
  }
}

