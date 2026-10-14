import { getSiteSetting, SiteSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL, normalizeBaseUrl } from "./config"

export interface OrganizationProfile {
  legalName: string
  name: string
  alternateName: string
  url: string
  logo: {
    url: string
    width: number
    height: number
  }
  foundingDate: string
  founder: {
    name: string
    image: string
    jobTitle: string
  }
  numberOfEmployees: {
    value: number
  }
  taxID: string
  email: string
  telephone: string
  whatsapp: {
    telephone: string
    contactType: string
    availableLanguage: string[]
  }
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  clientsCanVisitOffice: boolean
  openingHours: Array<{
    days: string[]
    opens: string
    closes: string
  }>
  areaServed: string[]
  hasMap: string
  geo?: {
    latitude: number
    longitude: number
  }
  sameAs: string[]
}

export const DEFAULT_ORGANIZATION_PROFILE: OrganizationProfile = {
  legalName: "Mommantum",
  name: "Mommantum",
  alternateName: "Mommantum",
  url: "https://www.mommantum.com/",
  logo: {
    url: "https://www.mommantum.com/logo.png",
    width: 500,
    height: 500,
  },
  foundingDate: "2025-12-15",
  founder: {
    name: "Kuldeep Ahir",
    image: "https://www.mommantum.com/team/kuldeep.webp",
    jobTitle: "Founder",
  },
  numberOfEmployees: {
    value: 15,
  },
  taxID: "08CTJPA2104B1ZI",
  email: "kuldeep@mommantum.in",
  telephone: "+917742276031",
  whatsapp: {
    telephone: "+917742276031",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
  address: {
    streetAddress: "B40A, Krishi Nagar, Taroo Ki Koot, near B2 Bypass",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    postalCode: "302029",
    addressCountry: "IN",
  },
  clientsCanVisitOffice: true,
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  areaServed: ["India", "Worldwide (domestic and international)"],
  hasMap: "https://maps.app.goo.gl/m5GfvAHsZJ5chD4z7?g_st=aw",
  // Geo intentionally omitted: shortlink redirect coordinates in Cochin do not match physical Jaipur address
  geo: undefined,
  sameAs: [
    "https://www.instagram.com/mommantummedia/",
    "https://www.facebook.com/profile.php?id=61585107904273",
  ],
}

export interface SchemaSiteInfo {
  baseUrl: string
  profile: OrganizationProfile
  siteSetting: SiteSetting | null
}

/**
 * Returns canonical site information for schema generation.
 * Always returns production https://www.mommantum.com base URL.
 * Cached via getSiteSetting (tag 'site_setting').
 */
export async function getSchemaSite(): Promise<SchemaSiteInfo> {
  const siteSetting = await getSiteSetting().catch(() => null)
  const baseUrl = normalizeBaseUrl(DEFAULT_BASE_URL)

  // Merge organization_profile if stored in DB site_setting column
  const dbProfile = (siteSetting as any)?.organization_profile
  const profile: OrganizationProfile = {
    ...DEFAULT_ORGANIZATION_PROFILE,
    ...(dbProfile && typeof dbProfile === "object" ? dbProfile : {}),
    logo: {
      ...DEFAULT_ORGANIZATION_PROFILE.logo,
      ...(dbProfile?.logo || {}),
    },
    founder: {
      ...DEFAULT_ORGANIZATION_PROFILE.founder,
      ...(dbProfile?.founder || {}),
    },
    address: {
      ...DEFAULT_ORGANIZATION_PROFILE.address,
      ...(dbProfile?.address || {}),
    },
    whatsapp: {
      ...DEFAULT_ORGANIZATION_PROFILE.whatsapp,
      ...(dbProfile?.whatsapp || {}),
    },
  }

  return {
    baseUrl,
    profile,
    siteSetting,
  }
}
