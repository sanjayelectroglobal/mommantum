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
import { generateSchemaGraph } from "@lib/schema/generate-graph"
import { serializeJsonLd } from "@lib/schema/serialize"

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
      slug: "privacy-policy" | "terms-and-conditions" | "blog-ai"
      title: string
      description: string
      seoSetting?: SeoSetting | null
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
          props.seoSetting
        )
        break
      default:
        return null
    }
  }

  const graph = await generateSchemaGraph(resolved)
  const jsonLdString = serializeJsonLd(graph)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString }}
    />
  )
}
