import { DEFAULT_IN_LANGUAGE, getEntityId, normalizeUrl } from "../config"

export interface CollectionItem {
  name: string
  url: string
}

export interface CollectionTemplateOptions {
  type?: "CollectionPage" | "Blog"
  pageUrl: string
  baseUrl: string
  name: string
  description?: string
  image?: string
  keywords?: string[]
  items: CollectionItem[]
}

/**
 * Creates Collection schema (CollectionPage or Blog) with an ItemList inside.
 * Emits ONE single CollectionPage (or Blog) acting as the main page entity.
 * Fixes any /in/ URL bugs.
 */
export function createCollectionSchema(options: CollectionTemplateOptions): Record<string, any> {
  const {
    type = "CollectionPage",
    pageUrl,
    baseUrl,
    name,
    description,
    image,
    keywords,
    items,
  } = options

  const collectionId = getEntityId(pageUrl, "#webpage")
  const orgId = getEntityId(baseUrl, "#organization")
  const breadcrumbId = getEntityId(pageUrl, "#breadcrumb")
  const listId = getEntityId(pageUrl, "#list")

  const collectionNode: Record<string, any> = {
    "@type": type,
    "@id": collectionId,
    url: pageUrl,
    name,
    about: {
      "@id": orgId,
    },
    breadcrumb: {
      "@id": breadcrumbId,
    },
    inLanguage: DEFAULT_IN_LANGUAGE,
  }

  if (description && description.trim()) {
    collectionNode.description = description.trim()
  }

  if (image) {
    collectionNode.image = image
  }

  if (keywords && keywords.length > 0) {
    collectionNode.keywords = Array.from(new Set(keywords.map((k) => k.trim()).filter(Boolean))).slice(0, 6)
  }

  if (items && items.length > 0) {
    collectionNode.mainEntity = {
      "@type": "ItemList",
      "@id": listId,
      name: `${name} Items`,
      itemListElement: items.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        url: normalizeUrl(item.url, baseUrl),
      })),
    }
  }

  return collectionNode
}
