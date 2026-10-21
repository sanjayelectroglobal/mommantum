import React from "react"
import { SeoSetting } from "@lib/data/seo"
import { Service } from "@lib/data/services"
import { BlogPost } from "@lib/data/blog-posts"
import { CaseStudy } from "@lib/data/case-studies"
import {
  ResolvedData,
  resolveHomepageData,
  resolveAboutData,
  resolveContactData,
  resolveServiceData,
  resolveBlogData,
  resolveCaseStudyData,
  resolveCollectionData,
  resolveEditzData,
  resolveLegalPageData,
  CollectionItemInput,
} from "@lib/schema/resolvers"
import { generateSchemaGraph, detectPageType, filterAndDeduplicateNodes } from "@lib/schema/generate-graph"
import { serializeJsonLd } from "@lib/schema/serialize"
import { stripEcommerceArtifacts } from "@lib/schema/strip-ecommerce"

export type JsonLdProps =
  | { type: "homepage"; seoSetting?: SeoSetting | null }
  | { type: "about"; seoSetting?: SeoSetting | null }
  | { type: "contact"; seoSetting?: SeoSetting | null }
  | { type: "service"; data: Service; seoSetting?: SeoSetting | null }
  | { type: "blog"; data: BlogPost; seoSetting?: SeoSetting | null }
  | { type: "case-study"; data: CaseStudy; seoSetting?: SeoSetting | null }
  | {
      type: "collection"
      section: "services" | "work" | "blog" | "store"
      items: CollectionItemInput[]
      seoSetting?: SeoSetting | null
    }
  | { type: "editz"; seoSetting?: SeoSetting | null }
  | {
      type: "page"
      slug: "privacy-policy" | "terms-and-conditions" | "blog-ai" | "faq"
      title: string
      description: string
      seoSetting?: SeoSetting | null
      faqs?: Array<{ question: string; answer: string }>
    }
  | { type?: never; resolved: ResolvedData }

/**
 * Server component that renders exactly ONE safe <script type="application/ld+json"> tag.
 * Pure server-rendered, safe from script breakouts via safe serializer.
 */
export default async function JsonLd(props: JsonLdProps) {
  let resolved: ResolvedData

  if ("resolved" in props && props.resolved) {
    resolved = props.resolved
  } else {
    switch (props.type) {
      case "homepage":
        resolved = resolveHomepageData(props.seoSetting)
        break
      case "about":
        resolved = resolveAboutData(props.seoSetting)
        break
      case "contact":
        resolved = resolveContactData(props.seoSetting)
        break
      case "service":
        resolved = resolveServiceData(props.data, props.seoSetting)
        break
      case "blog":
        resolved = resolveBlogData(props.data, props.seoSetting)
        break
      case "case-study":
        resolved = resolveCaseStudyData(props.data, props.seoSetting)
        break
      case "collection":
        resolved = resolveCollectionData({
          section: props.section,
          items: props.items,
          seoSetting: props.seoSetting,
        })
        break
      case "editz":
        resolved = resolveEditzData(props.seoSetting)
        break
      case "page":
        resolved = resolveLegalPageData(
          props.slug,
          props.title,
          props.description,
          props.seoSetting,
          props.faqs
        )
        break
      default:
        return null
    }
  }

  const graph = await generateSchemaGraph(resolved)

  const seoSetting = "seoSetting" in props ? props.seoSetting : undefined
  if (seoSetting?.schema_json) {
    try {
      const custom =
        typeof seoSetting.schema_json === "string"
          ? JSON.parse(seoSetting.schema_json)
          : seoSetting.schema_json

      let customNodes: any[] = []
      if (Array.isArray(custom)) {
        customNodes = custom
      } else if (custom && typeof custom === "object") {
        if (Array.isArray(custom["@graph"])) {
          customNodes = custom["@graph"]
        } else {
          customNodes = [custom]
        }
      }

      const existingIds = new Set(graph["@graph"].map((n: any) => n["@id"]).filter(Boolean))
      for (const node of customNodes) {
        if (node["@id"] && existingIds.has(node["@id"])) {
          const idx = graph["@graph"].findIndex((n: any) => n["@id"] === node["@id"])
          if (idx !== -1) {
            graph["@graph"][idx] = { ...graph["@graph"][idx], ...node }
          }
        } else {
          graph["@graph"].push(node)
        }
      }
    } catch (e) {
      console.error("Invalid custom schema_json:", e)
    }
  }

  // Final safety filter before output: drop any node whose @type is not allowed for this page type,
  // and de-duplicate by @id and @type.
  const pageType = detectPageType(resolved)
  graph["@graph"] = filterAndDeduplicateNodes(graph["@graph"], pageType).map((n) => stripEcommerceArtifacts(n))

  const jsonLdString = serializeJsonLd(graph)

  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: jsonLdString },
  })
}
