import { getEntityId } from "../config"
import { OrganizationProfile } from "../site"

export interface OrganizationTemplateOptions {
  baseUrl: string
  profile: OrganizationProfile
  full?: boolean
  includeFounder?: boolean
}

/**
 * Creates Organization schema.
 * Full version on Homepage/About; compact version on other pages sharing the same @id.
 * STRICTLY NO duplicate Brand node.
 */
export function createOrganizationSchema(options: OrganizationTemplateOptions): Record<string, any> {
  const { baseUrl, profile, full = false, includeFounder } = options
  const orgId = getEntityId(baseUrl, "#organization")
  const logoId = getEntityId(baseUrl, "#logo")
  const founderId = getEntityId(baseUrl, "#founder")

  if (!full) {
    // Compact Organization node for inner pages
    return {
      "@type": "Organization",
      "@id": orgId,
      name: profile.name,
      url: profile.url || baseUrl,
      logo: {
        "@type": "ImageObject",
        "@id": logoId,
        url: profile.logo.url,
        width: profile.logo.width,
        height: profile.logo.height,
      },
      sameAs: profile.sameAs?.length ? profile.sameAs : undefined,
    }
  }

  // Full Organization node for Homepage / About
  const fullOrg: Record<string, any> = {
    "@type": "Organization",
    "@id": orgId,
    name: profile.name,
    legalName: profile.legalName || profile.name,
    alternateName: profile.alternateName || profile.name,
    url: profile.url || baseUrl,
    logo: {
      "@type": "ImageObject",
      "@id": logoId,
      url: profile.logo.url,
      width: profile.logo.width,
      height: profile.logo.height,
    },
    image: {
      "@id": logoId,
    },
    foundingDate: profile.foundingDate || undefined,
    numberOfEmployees: profile.numberOfEmployees?.value
      ? {
          "@type": "QuantitativeValue",
          value: profile.numberOfEmployees.value,
        }
      : undefined,
    taxID: profile.taxID || undefined,
    email: profile.email || undefined,
    telephone: profile.telephone || undefined,
    contactPoint: profile.whatsapp?.telephone
      ? {
          "@type": "ContactPoint",
          telephone: profile.whatsapp.telephone,
          contactType: profile.whatsapp.contactType || "customer support",
          availableLanguage: profile.whatsapp.availableLanguage?.length
            ? profile.whatsapp.availableLanguage
            : ["English", "Hindi"],
        }
      : undefined,
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
    areaServed: profile.areaServed?.length ? profile.areaServed : undefined,
    sameAs: profile.sameAs?.length ? profile.sameAs : undefined,
  }

  const shouldAttachFounder = includeFounder !== undefined ? includeFounder : full
  if (profile.founder?.name && shouldAttachFounder) {
    fullOrg.founder = {
      "@id": founderId,
    }
  }

  return fullOrg
}
