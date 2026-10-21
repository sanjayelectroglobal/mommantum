import { getEntityId } from "../config"
import { OrganizationProfile } from "../site"

export interface OrganizationTemplateOptions {
  baseUrl: string
  profile: OrganizationProfile
  full?: boolean
  includeFounder?: boolean
  keywords?: string[]
}

/**
 * Creates Organization schema.
 * Full version ONLY on Homepage (@id #organization).
 * Fully self-contained: nested logo (ImageObject), nested founder (Person),
 * contactPoint, address, sameAs, knowsAbout. (Service agency: no store / return-policy data.)
 * Non-home pages link to #organization via reference only and do not emit full node.
 */
export function createOrganizationSchema(options: OrganizationTemplateOptions): Record<string, any> {
  const { baseUrl, profile } = options
  const orgId = getEntityId(baseUrl, "#organization")

  const fullOrg: Record<string, any> = {
    "@type": "Organization",
    "@id": orgId,
    name: profile.name,
    legalName: profile.legalName || profile.name,
    alternateName: profile.alternateName || profile.name,
    url: profile.url || baseUrl,
    logo: {
      "@type": "ImageObject",
      url: profile.logo.url,
      width: profile.logo.width,
      height: profile.logo.height,
    },
    image: profile.logo.url,
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
    knowsAbout: [
      "Performance Marketing",
      "Digital Marketing",
      "SEO",
      "D2C Brand Growth",
      "E-commerce Growth",
      "Video Editing",
    ],
    areaServed: profile.areaServed?.length ? profile.areaServed : undefined,
    sameAs: profile.sameAs?.length ? profile.sameAs : undefined,
  }

  if (options.keywords && options.keywords.length > 0) {
    const cleanKeywords = Array.from(new Set(options.keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)
    if (cleanKeywords.length > 0) {
      fullOrg.keywords = cleanKeywords.join(", ")
    }
  }

  if (profile.founder?.name) {
    fullOrg.founder = {
      "@type": "Person",
      name: profile.founder.name,
      jobTitle: profile.founder.jobTitle || "Founder",
      image: profile.founder.image || undefined,
    }
  }

  return fullOrg
}
