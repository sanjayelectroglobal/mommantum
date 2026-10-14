import { buildSchemaGraph } from "./build-graph"
import { getEntityId } from "./config"
import { getSchemaSite, SchemaSiteInfo } from "./site"
import { ResolvedData } from "./resolvers/types"
import { createOrganizationSchema } from "./templates/organization"
import { createWebSiteSchema } from "./templates/website"
import { createLocalBusinessSchema } from "./templates/local-business"
import { createFounderPersonSchema } from "./templates/person"
import { createBreadcrumbSchema } from "./templates/breadcrumb"
import { createWebPageSchema } from "./templates/webpage"
import { createServiceSchema } from "./templates/service"
import { createBlogPostingSchema } from "./templates/blog-posting"
import { createCaseStudySchema } from "./templates/case-study"
import { createCollectionSchema } from "./templates/collection"
import { createFAQSchema } from "./templates/faq"

/**
 * Builds the complete schema graph for any content type based on neutral ResolvedData.
 * Follows exact template rules:
 * - Homepage: WebPage + BreadcrumbList + WebSite + full Organization + ProfessionalService + Founder + FAQPage
 * - About: AboutPage + BreadcrumbList + full Organization + ProfessionalService + Founder
 * - Contact: ContactPage + BreadcrumbList + compact Organization + ProfessionalService
 * - Service: WebPage + BreadcrumbList + compact Organization + Service + FAQPage
 * - Blog: WebPage + BreadcrumbList + compact Organization + BlogPosting + FAQPage
 * - Case Study: WebPage + BreadcrumbList + compact Organization + Article(Case Study)
 * - Collection: CollectionPage/Blog + BreadcrumbList + compact Organization + ItemList
 * - Editz: WebPage + BreadcrumbList + compact Organization + Service + FAQPage
 * - Page (legal/static): WebPage + BreadcrumbList + compact Organization
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

  const nodes: Array<Record<string, any> | null | undefined> = []

  // WebSite: ONLY on Homepage
  if (resolved.contentType === "homepage") {
    const websiteNode = createWebSiteSchema({ baseUrl, profile })
    nodes.push(websiteNode)
  }

  // Determine Organization node depth:
  // ONLY /, /about, /contact carry ProfessionalService and the full Organization
  const isFullOrg =
    resolved.contentType === "homepage" ||
    resolved.contentType === "about" ||
    resolved.contentType === "contact"

  const hasFounder =
    resolved.contentType === "homepage" ||
    resolved.contentType === "about"

  // Top-level logo ImageObject node ({base}/#logo) for pages carrying full organization
  if (isFullOrg) {
    const logoId = getEntityId(baseUrl, "#logo")
    nodes.push({
      "@type": "ImageObject",
      "@id": logoId,
      url: profile.logo.url,
      contentUrl: profile.logo.url,
      width: profile.logo.width,
      height: profile.logo.height,
      caption: `${profile.name} Logo`,
    })
  }

  const orgNode = createOrganizationSchema({
    baseUrl,
    profile,
    full: isFullOrg,
    includeFounder: hasFounder,
  })
  nodes.push(orgNode)

  // Local business node (ProfessionalService): ONLY on Homepage, About, Contact
  if (isFullOrg) {
    const localNode = createLocalBusinessSchema({ baseUrl, profile })
    nodes.push(localNode)
  }

  // Founder Person node: ONLY on Homepage and About
  if (hasFounder) {
    const founderNode = createFounderPersonSchema({ baseUrl, profile })
    if (founderNode) nodes.push(founderNode)
  }

  // Breadcrumbs (present on every page)
  if (resolved.breadcrumbs && resolved.breadcrumbs.length > 0) {
    const breadcrumbNode = createBreadcrumbSchema({
      pageUrl: resolved.canonicalUrl,
      items: resolved.breadcrumbs,
    })
    nodes.push(breadcrumbNode)
  }

  // Main entity ID determining WebPage's mainEntity pointer
  let mainEntityId: string | undefined = undefined
  if (resolved.contentType === "service" || resolved.contentType === "editz") {
    mainEntityId = getEntityId(resolved.canonicalUrl, "#service")
  } else if (resolved.contentType === "blog" || resolved.contentType === "case-study") {
    mainEntityId = getEntityId(resolved.canonicalUrl, "#article")
  } else if (resolved.contentType === "collection") {
    mainEntityId = getEntityId(resolved.canonicalUrl, "#collection")
  }

  // WebPage node: only emitted for non-collection routes.
  // Collection routes (/services, /work, /store, /blog, /blog-ai) emit ONE CollectionPage/Blog.
  if (resolved.contentType !== "collection") {
    let pageSubtype: "WebPage" | "AboutPage" | "ContactPage" = "WebPage"
    if (resolved.contentType === "about") pageSubtype = "AboutPage"
    else if (resolved.contentType === "contact") pageSubtype = "ContactPage"

    const webPageNode = createWebPageSchema({
      type: pageSubtype,
      pageUrl: resolved.canonicalUrl,
      baseUrl,
      name: resolved.title,
      description: resolved.description,
      image: resolved.image,
      datePublished: resolved.datePublished,
      dateModified: resolved.dateModified,
      keywords: resolved.keywords,
      mainEntityId,
      includeWebSite: resolved.contentType === "homepage",
    })
    nodes.push(webPageNode)
  }

  // Content-type specific entities
  switch (resolved.contentType) {
    case "service":
    case "editz": {
      const serviceNode = createServiceSchema({
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        serviceType: resolved.serviceType || resolved.title,
        areaServed: profile.areaServed,
        deliverables: resolved.deliverables,
        keywords: resolved.keywords,
        offers: resolved.offers,
      })
      nodes.push(serviceNode)
      break
    }

    case "blog": {
      const blogPostingNode = createBlogPostingSchema({
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        headline: resolved.title,
        description: resolved.description,
        image: resolved.image,
        authorName: resolved.authorName,
        datePublished: resolved.datePublished,
        dateModified: resolved.dateModified,
        articleSection: resolved.articleSection,
        keywords: resolved.keywords,
      })
      nodes.push(blogPostingNode)
      break
    }

    case "case-study": {
      const caseStudyNode = createCaseStudySchema({
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        headline: resolved.title,
        clientName: resolved.clientName,
        description: resolved.description,
        image: resolved.image,
        datePublished: resolved.datePublished,
        dateModified: resolved.dateModified,
        relatedServiceId: resolved.relatedServiceId,
        keywords: resolved.keywords,
      })
      nodes.push(caseStudyNode)
      break
    }

    case "collection": {
      const collectionNode = createCollectionSchema({
        type: resolved.collectionType || "CollectionPage",
        pageUrl: resolved.canonicalUrl,
        baseUrl,
        name: resolved.title,
        description: resolved.description,
        image: resolved.image,
        keywords: resolved.keywords,
        items: resolved.collectionItems || [],
      })
      nodes.push(collectionNode)
      break
    }
  }

  // FAQPage node (only if faqs are present and non-empty)
  if (resolved.faqs && resolved.faqs.length > 0) {
    const faqNode = createFAQSchema({
      pageUrl: resolved.canonicalUrl,
      faqs: resolved.faqs,
    })
    if (faqNode) nodes.push(faqNode)
  }

  return buildSchemaGraph(nodes)
}
