import { DEFAULT_BASE_URL, getEntityId, normalizeUrl } from "../config"

export interface ItemListEntry {
  name: string
  url: string
  image?: string
}

export interface ItemListTemplateOptions {
  pageUrl: string
  baseUrl?: string
  items: ItemListEntry[]
}

/**
 * Creates ItemList schema for category and collection listing pages.
 * Top-level node with position, url, name, image for each item.
 */
export function createItemListSchema(options: ItemListTemplateOptions): Record<string, any> {
  const { pageUrl, baseUrl = DEFAULT_BASE_URL, items } = options
  const listId = getEntityId(pageUrl, "#itemlist")

  return {
    "@type": "ItemList",
    "@id": listId,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: normalizeUrl(item.url, baseUrl),
      ...(item.image ? { image: normalizeUrl(item.image, baseUrl) } : {}),
    })),
  }
}
