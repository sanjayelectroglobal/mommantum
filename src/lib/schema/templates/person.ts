import { getEntityId } from "../config"
import { OrganizationProfile } from "../site"

export interface PersonTemplateOptions {
  baseUrl: string
  profile: OrganizationProfile
}

/**
 * Creates Person schema for real team data (founder Kuldeep Ahir).
 * Never fabricate unconfirmed team members.
 */
export function createFounderPersonSchema(options: PersonTemplateOptions): Record<string, any> | null {
  const { baseUrl, profile } = options
  if (!profile.founder?.name) return null

  const founderId = getEntityId(baseUrl, "#founder")
  const orgId = getEntityId(baseUrl, "#organization")

  return {
    "@type": "Person",
    "@id": founderId,
    name: profile.founder.name,
    jobTitle: profile.founder.jobTitle || "Founder",
    image: profile.founder.image ? profile.founder.image : undefined,
    worksFor: {
      "@id": orgId,
    },
  }
}
