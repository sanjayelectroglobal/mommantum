import { buildSchemaGraph } from "./build-graph"
import { getEntityId } from "./config"
import { getSchemaSite, SchemaSiteInfo } from "./site"
import { ResolvedData } from "./resolvers/types"
import { createOrganizationSchema } from "./templates/organization"
import { createWebSiteSchema } from "./templates/website"
import { createBreadcrumbSchema } from "./templates/breadcrumb"
import { createWebPageSchema } from "./templates/webpage"
import { createBlogPostingSchema } from "./templates/blog-posting"
import { createFAQSchema } from "./templates/faq"
// Phase 4: Removed store createProductSchema template import.
import { createItemListSchema } from "./templates/item-list"

export type SchemaPageType = "home" | "page" | "blog_index" | "blog_post" | "product" | "category"

export const ALLOWED_SCHEMA_MATRIX: Record<SchemaPageType, string[]> = {
  home: ["WebSite", "Organization", "WebPage", "BreadcrumbList"],
  page: ["WebPage", "AboutPage", "ContactPage", "BreadcrumbList"],
  blog_index: ["WebPage", "BreadcrumbList"],
  blog_post: ["BlogPosting", "WebPage", "BreadcrumbList"],
  product: ["Product", "WebPage", "ItemPage", "BreadcrumbList"],
  category: ["CollectionPage", "ItemList", "BreadcrumbList"],
}

/**
 * Centrally detects page type adhering strictly to the 6 allowed schema page types:
 * - home: Home page (/)
 * - page: About, Contact, Policy pages, Landing pages, Services, Case study pages, Editz
 * - blog_index: Blog listing page (/blog)
 * - blog_post: Individual blog article
 * - product: Individual product page
 * - category: Category / sub-category listing page (/store, /collections/*, /categories/*)
 *
 * Note: Services and Case studies are treated as type 'page' per prompt specification.
 */
export function detectPageType(resolved: ResolvedData): SchemaPageType {
  if (resolved.contentType === "homepage") {
    return "home"
  }

  if (resolved.contentType === "product") {
    return "product"
  }

  if (resolved.contentType === "blog") {
    return "blog_post"
  }

  if (resolved.contentType === "collection" || resolved.contentType === "store") {
    const canonical = (resolved.canonicalUrl || "").toLowerCase().replace(/\/+$/, "")
    // Blog index (/blog) gets page schema only (WebPage + BreadcrumbList)
    if (canonical.endsWith("/blog")) {
      return "blog_index"
    }
    // Services listing (/services) and Case study listing (/work) are treated as type 'page'
    if (canonical.endsWith("/services") || canonical.endsWith("/work") || canonical.endsWith("/case-studies")) {
      return "page"
    }
    // E-commerce store / collections / categories
    return "category"
  }

  // Service details, case study details, and legal pages are type 'page'
  return "page"
}

/**
 * Safety filter: drops any node whose @type is not in the allow-list for the current page type,
 * and de-duplicates by @id and @type.
 */
export function filterAndDeduplicateNodes(
  nodes: Array<Record<string, any> | null | undefined>,
  pageType: SchemaPageType
): Array<Record<string, any>> {
  const allowedTypes = new Set(ALLOWED_SCHEMA_MATRIX[pageType] || [])
  const seenIds = new Set<string>()
  const seenTypes = new Set<string>()
  const filtered: Array<Record<string, any>> = []

  for (const node of nodes) {
    if (!node || typeof node !== "object") continue

    const rawType = node["@type"]
    // Handle array types e.g. ["Organization", "Thing"]
    const types = Array.isArray(rawType) ? rawType : [rawType]
    const isAllowed = types.some((t) => allowedTypes.has(t))

    if (!isAllowed) {
      continue
    }

    const id = node["@id"]
    if (id && seenIds.has(id)) {
      continue
    }

    const primaryType = types[0]
    if (seenTypes.has(primaryType)) {
      continue
    }

    if (id) seenIds.add(id)
    seenTypes.add(primaryType)
    filtered.push(node)
  }

  return filtered
}

/**
 * Builds the schema graph for any page type.
 * Enforces:
 * - One page type = one fixed set of schema nodes.
 * - Exactly allowed node count per page type.
 * - FAQPage is only nested inside WebPage.hasPart (never standalone in @graph).
 * - WebSite and Organization full nodes exist ONLY on Home page.
 * - Non-home pages use absolute @id references to #website and #organization.
 * - No LocalBusiness, ElectronicsStore, Review, or unlisted nodes.
 */
export async function generateSchemaGraph(
  resolved: ResolvedData,
  siteInfoOverride?: SchemaSiteInfo
): Promise<{
  "@context": string
  "@graph": Array<Record<string, any>>
}> {
  const siteInfo = siteInfoOverride || (await getSchemaSite())
  const { baseUrl, profile } = siteInfo
  const pageType = detectPageType(resolved)

  const rawNodes: Array<Record<string, any> | null | undefined> = []

  // Build nested FAQPage node if valid FAQs exist on page
  const faqNode =
    resolved.faqs && resolved.faqs.length > 0
      ? createFAQSchema({
          pageUrl: resolved.canonicalUrl,
          faqs: resolved.faqs,
        })
      : null

  // Breadcrumbs (Home on home, Home > ... on other pages)
  const breadcrumbItems =
    resolved.breadcrumbs && resolved.breadcrumbs.length > 0
      ? resolved.breadcrumbs
      : [{ name: "Home", url: `${baseUrl}/` }]

  const breadcrumbNode = createBreadcrumbSchema({
    pageUrl: resolved.canonicalUrl,
    items: breadcrumbItems,
  })

  switch (pageType) {
    case "home": {
      // EXACTLY 3 NODES: WebSite, Organization, WebPage (with nested FAQPage + nested BreadcrumbList)
      const websiteNode = createWebSiteSchema({
        baseUrl,
        profile,
        description: resolved.description,
        keywords: resolved.keywords,
      })
      rawNodes.push(websiteNode)

      const orgNode = createOrganizationSchema({
        baseUrl,
        profile,
        full: true,
        keywords: resolved.keywords,
      })
      rawNodes.push(orgNode)

      const webPageNode = createWebPageSchema({
        type: "WebPage",
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        keywords: resolved.keywords,
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(webPageNode)

      break
    }

    case "page": {
      // EXACTLY 2 NODES: WebPage subtype (with nested FAQPage), BreadcrumbList
      let subtype: "WebPage" | "AboutPage" | "ContactPage" = "WebPage"
      if (resolved.contentType === "about") subtype = "AboutPage"
      else if (resolved.contentType === "contact") subtype = "ContactPage"

      const webPageNode = createWebPageSchema({
        type: subtype,
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        datePublished: resolved.datePublished,
        dateModified: resolved.dateModified,
        keywords: resolved.keywords,
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(webPageNode)
      break
    }

    case "blog_index": {
      // EXACTLY 2 NODES: WebPage (with nested FAQPage), BreadcrumbList
      const webPageNode = createWebPageSchema({
        type: "WebPage",
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        keywords: resolved.keywords,
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(webPageNode)
      break
    }

    case "blog_post": {
      // EXACTLY 3 NODES: BlogPosting, WebPage (with nested FAQPage), BreadcrumbList
      const blogPostingNode = createBlogPostingSchema({
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        headline: resolved.headline || resolved.title,
        description: resolved.description,
        image: resolved.image,
        authorName: resolved.authorName,
        datePublished: resolved.datePublished,
        dateModified: resolved.dateModified,
        articleSection: resolved.articleSection,
        keywords: resolved.keywords,
        wordCount: resolved.wordCount,
        isPartOf: resolved.isPartOf,
      })
      rawNodes.push(blogPostingNode)

      const webPageNode = createWebPageSchema({
        type: "WebPage",
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        keywords: resolved.keywords,
        mainEntityId: getEntityId(resolved.canonicalUrl, "#article"),
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(webPageNode)

      break
    }

    // Phase 4: Removed case "product" (store product schemas removed).
    case "category": {
      // EXACTLY 3 NODES: CollectionPage (with nested FAQPage), ItemList, BreadcrumbList
      const collectionPageNode = createWebPageSchema({
        type: "CollectionPage",
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        keywords: resolved.keywords,
        mainEntityId: getEntityId(resolved.canonicalUrl, "#itemlist"),
        hasPart: faqNode,
        includeWebSite: true,
        breadcrumb: breadcrumbNode,
      })
      rawNodes.push(collectionPageNode)

      const itemListNode = createItemListSchema({
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        items: (resolved.collectionItems || []).map((it) => ({
          name: it.name,
          url: it.url,
        })),
      })
      rawNodes.push(itemListNode)

      break
    }
  }

  // Safety filter and deduplication enforcing matrix
  const cleanNodes = filterAndDeduplicateNodes(rawNodes, pageType)
  return buildSchemaGraph(cleanNodes)
}
