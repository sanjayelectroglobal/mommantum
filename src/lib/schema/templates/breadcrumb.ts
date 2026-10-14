import { getEntityId, normalizeUrl } from "../config"

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface BreadcrumbTemplateOptions {
  pageUrl: string
  items: BreadcrumbItem[]
}

/**
 * Creates BreadcrumbList schema.
 * @id format: {pageUrl}#breadcrumb
 */
export function createBreadcrumbSchema(options: BreadcrumbTemplateOptions): Record<string, any> {
  const { pageUrl, items } = options
  const breadcrumbId = getEntityId(pageUrl, "#breadcrumb")

  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: normalizeUrl(item.url),
  }))

  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement,
  }
}
