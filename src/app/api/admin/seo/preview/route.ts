import { NextRequest, NextResponse } from "next/server"
import { verifyUserRole } from "@lib/auth-helpers"
import { SeoSetting, getSeoSetting } from "@lib/data/seo"
import { getServices } from "@lib/data/services"
import {
  ResolvedData,
  resolveHomepageData,
  resolveAboutData,
  resolveContactData,
  resolveServiceData,
  resolveBlogData,
  resolveEditzData,
  resolveLegalPageData,
  resolveCollectionData,
} from "@lib/schema/resolvers"
import { getBlogPost } from "@lib/data/blog-posts"
import { generateSchemaGraph, detectPageType, filterAndDeduplicateNodes } from "@lib/schema/generate-graph"

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyUserRole(req, ["admin", "manager"]))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const pageKey = (body.page_key || "").trim().toLowerCase()

    if (!pageKey) {
      return NextResponse.json({ error: "page_key is required" }, { status: 400 })
    }

    // Merge incoming overrides with existing setting
    const existing = await getSeoSetting(pageKey).catch(() => null)
    const mergedSetting: SeoSetting = {
      page_key: pageKey,
      ...existing,
      ...body,
      primary_keyword: body.primary_keyword ?? existing?.primary_keyword,
      secondary_keywords: body.secondary_keywords ?? existing?.secondary_keywords,
      meta_title: body.meta_title ?? existing?.meta_title,
      meta_description: body.meta_description ?? existing?.meta_description,
      og_image: body.og_image ?? existing?.og_image,
      schema_json: body.schema_json ?? existing?.schema_json,
      faq_section: body.faq_section ?? (existing as any)?.faq_section,
    }

    let resolved: ResolvedData

    if (pageKey === "homepage" || pageKey === "home") {
      resolved = resolveHomepageData(mergedSetting)
    } else if (pageKey === "about") {
      resolved = resolveAboutData(mergedSetting)
    } else if (pageKey === "contact") {
      resolved = resolveContactData(mergedSetting)
    } else if (pageKey === "editz") {
      resolved = resolveEditzData(mergedSetting)
    } else if (pageKey === "services") {
      const services = await getServices().catch(() => [])
      resolved = resolveCollectionData({
        section: "services",
        items: services.map((s) => ({ name: s.title, url: `https://www.mommantum.com/services/${s.slug}` })),
        seoSetting: mergedSetting,
      })
    } else if (pageKey === "work" || pageKey === "case-studies") {
      resolved = resolveCollectionData({
        section: "work",
        items: [],
        seoSetting: mergedSetting,
      })
    } else if (pageKey === "blog") {
      resolved = resolveCollectionData({
        section: "blog",
        items: [],
        seoSetting: mergedSetting,
      })
    } else if (pageKey.startsWith("service:")) {
      const slug = pageKey.replace("service:", "").trim()
      const services = await getServices().catch(() => [])
      const matched = services.find((s) => s.slug === slug)
      if (matched) {
        resolved = resolveServiceData(matched, mergedSetting)
      } else {
        resolved = resolveLegalPageData(slug as any, mergedSetting.meta_title || slug, mergedSetting.meta_description || "", mergedSetting)
      }
    } else if (pageKey.startsWith("blog:")) {
      const slug = pageKey.replace("blog:", "").trim()
      const blogPost = await getBlogPost(slug).catch(() => null)
      if (blogPost) {
        resolved = resolveBlogData(blogPost, mergedSetting)
      } else {
        const title = mergedSetting.meta_title || mergedSetting.page_label || pageKey
        const desc = mergedSetting.meta_description || ""
        resolved = resolveLegalPageData(pageKey as any, title, desc, mergedSetting)
      }
    } else {
      const title = mergedSetting.meta_title || mergedSetting.page_label || pageKey
      const desc = mergedSetting.meta_description || ""
      resolved = resolveLegalPageData(pageKey as any, title, desc, mergedSetting)
    }

    // Overwrite faqs if provided in payload
    if (Array.isArray(body.faq_section) && body.faq_section.length > 0) {
      resolved.faqs = body.faq_section
    }

    const graph = await generateSchemaGraph(resolved)

    // Merge custom schema_json if provided
    if (mergedSetting.schema_json) {
      try {
        const custom = typeof mergedSetting.schema_json === "string"
          ? JSON.parse(mergedSetting.schema_json)
          : mergedSetting.schema_json

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
      } catch (e: any) {
        // Continue with standard graph if parse fails
      }
    }

    const pageType = detectPageType(resolved)
    graph["@graph"] = filterAndDeduplicateNodes(graph["@graph"], pageType)

    const entities = graph["@graph"].map((node: any) => ({
      type: Array.isArray(node["@type"]) ? node["@type"].join(", ") : node["@type"],
      id: node["@id"] || null,
      name: node.name || node.headline || node.legalName || null,
      description: node.description || null,
    }))

    return NextResponse.json({
      success: true,
      graph,
      nodeCount: graph["@graph"].length,
      nodeTypes: entities.map((e) => e.type),
      entities,
      resolvedSummary: {
        contentType: resolved.contentType,
        canonicalUrl: resolved.canonicalUrl,
        title: resolved.title,
        description: resolved.description,
        faqsCount: resolved.faqs?.length || 0,
      },
    })
  } catch (err: any) {
    console.error("[POST /api/admin/seo/preview error]:", err)
    return NextResponse.json({ error: err.message || "Failed to generate schema preview" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pageKey = searchParams.get("page_key")
  if (!pageKey) {
    return NextResponse.json({ error: "page_key is required" }, { status: 400 })
  }
  return POST(new NextRequest(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify({ page_key: pageKey }),
  }))
}
