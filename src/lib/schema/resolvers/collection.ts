import { SeoSetting } from "@lib/data/seo"
import { DEFAULT_BASE_URL } from "../config"
import { ResolvedData } from "./types"

export interface CollectionItemInput {
  name?: string
  title?: string
  slug?: string
  handle?: string
}

export function resolveCollectionData(options: {
  section: "services" | "work" | "blog" | "store"
  items: CollectionItemInput[]
  seoSetting?: SeoSetting | null
}): ResolvedData {
  const { section, items, seoSetting } = options

  const sectionConfig = {
    services: {
      title: "Services | Mommantum",
      description:
        "Explore Mommantum services across performance marketing, SEO, content, web development, and growth systems.",
      path: "/services",
      name: "Services",
      collectionType: "CollectionPage" as const,
      prefix: "/services/",
    },
    work: {
      title: "Work | Mommantum",
      description:
        "Explore Mommantum case studies, client work, and growth results across marketing, ecommerce, SEO, and creative systems.",
      path: "/work",
      name: "Work",
      collectionType: "CollectionPage" as const,
      prefix: "/work/",
    },
    blog: {
      title: "Blog | Mommantum",
      description:
        "Insights, growth playbooks, and strategies from the Mommantum team on SEO, automation, marketing, and scaling D2C brands.",
      path: "/blog",
      name: "Blog",
      collectionType: "Blog" as const,
      prefix: "/blog/",
    },
    store: {
      title: "Store | Mommantum",
      description: "Explore all of our products.",
      path: "/store",
      name: "Store",
      collectionType: "CollectionPage" as const,
      prefix: "/products/",
    },
  }[section]

  const canonicalUrl = `${DEFAULT_BASE_URL}${sectionConfig.path}`
  const title = seoSetting?.meta_title || sectionConfig.title
  const description = seoSetting?.meta_description || sectionConfig.description
  const image = seoSetting?.og_image || `${DEFAULT_BASE_URL}/opengraph-image.jpg`

  const keywords = [
    seoSetting?.primary_keyword,
    ...(seoSetting?.secondary_keywords || []),
  ].filter(Boolean) as string[]

  const breadcrumbs = [
    { name: "Home", url: `${DEFAULT_BASE_URL}/` },
    { name: sectionConfig.name, url: canonicalUrl },
  ]

  const collectionItems = items.map((it) => {
    const slug = it.slug || it.handle || ""
    const name = it.title || it.name || slug
    return {
      name,
      url: `${DEFAULT_BASE_URL}${sectionConfig.prefix}${slug}`,
    }
  })

  return {
    contentType: "collection",
    title,
    description,
    canonicalUrl,
    image,
    keywords,
    breadcrumbs,
    faqs: undefined,
    collectionType: sectionConfig.collectionType,
    collectionItems,
  }
}
