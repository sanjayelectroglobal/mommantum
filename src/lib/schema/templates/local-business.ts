import { getEntityId } from "../config"
import { OrganizationProfile } from "../site"

export interface LocalBusinessTemplateOptions {
  baseUrl: string
  profile: OrganizationProfile
}

/**
 * Creates ProfessionalService schema for Mommantum's physical Jaipur studio.
 * Uses exact confirmed address, opening hours, phone, and hasMap link.
 * Geo is omitted if coordinates cannot be reliably verified.
 */
export function createLocalBusinessSchema(options: LocalBusinessTemplateOptions): Record<string, any> {
  const { baseUrl, profile } = options
  const localId = getEntityId(baseUrl, "#localbusiness")
  const orgId = getEntityId(baseUrl, "#organization")
  const logoId = getEntityId(baseUrl, "#logo")

  const openingHoursSpec = (profile.openingHours || []).map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
    opens: h.opens,
    closes: h.closes,
  }))

  const localNode: Record<string, any> = {
    "@type": "ProfessionalService",
    "@id": localId,
    name: profile.name,
    url: profile.url || baseUrl,
    parentOrganization: {
      "@id": orgId,
    },
    logo: {
      "@id": logoId,
    },
    telephone: profile.telephone || undefined,
    email: profile.email || undefined,
    address: profile.address?.streetAddress
      ? {
          "@type": "PostalAddress",
          streetAddress: profile.address.streetAddress,
          addressLocality: profile.address.addressLocality,
          addressRegion: profile.address.addressRegion,
          postalCode: profile.address.postalCode,
          addressCountry: profile.address.addressCountry,
        }
      : undefined,
    openingHoursSpecification: openingHoursSpec.length ? openingHoursSpec : undefined,
    hasMap: profile.hasMap || undefined,
    areaServed: profile.areaServed?.length ? profile.areaServed : undefined,
  }

  if (profile.geo?.latitude && profile.geo?.longitude) {
    localNode.geo = {
      "@type": "GeoCoordinates",
      latitude: profile.geo.latitude,
      longitude: profile.geo.longitude,
    }
  }

  return localNode
}
