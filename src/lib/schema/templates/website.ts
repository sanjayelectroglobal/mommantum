import { DEFAULT_IN_LANGUAGE, getEntityId } from "../config"
import { OrganizationProfile } from "../site"

export interface WebSiteTemplateOptions {
  baseUrl: string
  profile: OrganizationProfile
}

/**
 * Creates WebSite schema.
 * Strictly NO SearchAction since there is no active internal search page.
 */
export function createWebSiteSchema(options: WebSiteTemplateOptions): Record<string, any> {
  const { baseUrl, profile } = options
  const websiteId = getEntityId(baseUrl, "#website")
  const orgId = getEntityId(baseUrl, "#organization")

  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: profile.name,
    alternateName: profile.alternateName || profile.name,
    url: baseUrl,
    publisher: {
      "@id": orgId,
    },
    inLanguage: DEFAULT_IN_LANGUAGE,
  }
}
