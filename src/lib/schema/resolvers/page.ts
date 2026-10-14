import { SeoSetting } from "@lib/data/seo"
import { HOME_FAQS } from "@lib/data/home-faqs"
import { FAQS as EDITZ_FAQS } from "@modules/editz/lib/data"
import { DEFAULT_BASE_URL } from "../config"
import { ResolvedData } from "./types"

export function resolveHomepageData(seoSetting?: SeoSetting | null): ResolvedData {
  const title = seoSetting?.meta_title || "Mommantum — Growth Studio"
  const description =
    seoSetting?.meta_description ||
    "Mommantum is a Jaipur-based digital marketing agency and growth studio helping D2C and ecommerce brands scale."
  const canonicalUrl = DEFAULT_BASE_URL
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ].filter(Boolean) as string[]

  return {
    contentType: "homepage",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [{ name: "Home", url: canonicalUrl }],
    faqs: (seoSetting as any)?.faq_section?.length ? (seoSetting as any).faq_section : HOME_FAQS,
  }
}

export function resolveAboutData(seoSetting?: SeoSetting | null): ResolvedData {
  const title = seoSetting?.meta_title || "About | Mommantum"
  const description =
    seoSetting?.meta_description ||
    "Learn about Mommantum, a Jaipur-based growth studio helping brands scale with strategy, creative, SEO, and performance marketing."
  const canonicalUrl = `${DEFAULT_BASE_URL}/about`
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ].filter(Boolean) as string[]

  return {
    contentType: "about",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "About", url: canonicalUrl },
    ],
    // Never output FAQs on About page because no FAQs are visibly rendered there
    faqs: undefined,
  }
}

export function resolveContactData(seoSetting?: SeoSetting | null): ResolvedData {
  const title = seoSetting?.meta_title || "Contact | Mommantum"
  const description =
    seoSetting?.meta_description ||
    "Contact Mommantum to discuss growth strategy, performance marketing, SEO, web development, and AI workflow projects."
  const canonicalUrl = `${DEFAULT_BASE_URL}/contact`
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ].filter(Boolean) as string[]

  return {
    contentType: "contact",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "Contact", url: canonicalUrl },
    ],
    // Never output FAQs on Contact page because no FAQs are visibly rendered there
    faqs: undefined,
  }
}

export function resolveLegalPageData(
  slug: "privacy-policy" | "terms-and-conditions" | "blog-ai",
  fallbackTitle: string,
  fallbackDescription: string,
  seoSetting?: SeoSetting | null
): ResolvedData {
  const title = seoSetting?.meta_title || fallbackTitle
  const description = seoSetting?.meta_description || fallbackDescription
  const canonicalUrl = `${DEFAULT_BASE_URL}/${slug}`
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ].filter(Boolean) as string[]

  return {
    contentType: "page",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: fallbackTitle.split(" | ")[0], url: canonicalUrl },
    ],
    faqs: undefined,
  }
}

export function resolveEditzData(seoSetting?: SeoSetting | null): ResolvedData {
  const title = seoSetting?.meta_title || "EDITZ by Mommantum | Video Editing Studio"
  const description =
    seoSetting?.meta_description ||
    "High-impact short-form and long-form video editing for creators and brands. Reels, TikToks, YouTube, and high-converting ad creatives."
  const canonicalUrl = `${DEFAULT_BASE_URL}/editz`
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
    "Video Editing",
    "Short Form Editing",
    "Reels Editing",
    "YouTube Video Editor",
  ].filter(Boolean) as string[]

  return {
    contentType: "editz",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs: [
      { name: "Home", url: `${DEFAULT_BASE_URL}/` },
      { name: "Editz", url: canonicalUrl },
    ],
    // Visible FAQs from editz/lib/data
    faqs: EDITZ_FAQS.map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
  }
}
