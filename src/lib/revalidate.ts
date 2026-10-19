import { revalidatePath, revalidateTag } from "next/cache"

export type RevalidateOptions = {
  type: "service" | "blog" | "case-study" | "seo" | "site_setting"
  slug?: string
  oldSlug?: string
  pageKey?: string
}

/**
 * Derives a storefront path from an seo_setting page_key.
 */
export function derivePathFromPageKey(pageKey: string): string | null {
  if (!pageKey) return null
  const key = pageKey.trim().toLowerCase()

  if (key === "home" || key === "homepage") return "/"
  if (key === "about") return "/about"
  if (key === "contact") return "/contact"
  if (key === "services") return "/services"
  if (key === "work" || key === "case-studies") return "/work"
  if (key === "blog") return "/blog"
  if (key === "terms-and-conditions") return "/terms-and-conditions"
  if (key === "privacy-policy") return "/privacy-policy"
  if (key === "editz") return "/editz"
  if (key === "blog-ai") return "/blog-ai"

  if (key.startsWith("service:")) {
    return `/services/${key.replace("service:", "")}`
  }
  if (key.startsWith("services:")) {
    return `/services/${key.replace("services:", "")}`
  }
  if (key.startsWith("work:")) {
    return `/work/${key.replace("work:", "")}`
  }
  if (key.startsWith("case-study:")) {
    return `/work/${key.replace("case-study:", "")}`
  }
  if (key.startsWith("case-studies:")) {
    return `/work/${key.replace("case-studies:", "")}`
  }
  if (key.startsWith("blog:")) {
    return `/blog/${key.replace("blog:", "")}`
  }

  return null
}

/**
 * Central helper for content and schema revalidation.
 * Revalidates relevant cache tags and paths to ensure the very next request
 * delivers fresh content, metadata, and JSON-LD structured data.
 */
export async function revalidateContent(options: RevalidateOptions): Promise<void> {
  const { type, slug, oldSlug, pageKey } = options

  try {
    switch (type) {
      case "service": {
        revalidateTag("services")
        revalidatePath("/services")
        revalidatePath("/")
        if (slug) {
          revalidatePath(`/services/${slug}`)
        }
        if (oldSlug && oldSlug !== slug) {
          revalidatePath(`/services/${oldSlug}`)
        }
        break
      }

      case "blog": {
        revalidateTag("blog-posts")
        revalidatePath("/blog")
        if (slug) {
          revalidatePath(`/blog/${slug}`)
        }
        if (oldSlug && oldSlug !== slug) {
          revalidatePath(`/blog/${oldSlug}`)
        }
        break
      }

      case "case-study": {
        revalidateTag("case-studies")
        revalidatePath("/work")
        revalidatePath("/")
        if (slug) {
          revalidatePath(`/work/${slug}`)
        }
        if (oldSlug && oldSlug !== slug) {
          revalidatePath(`/work/${oldSlug}`)
        }
        break
      }

      case "seo": {
        try {
          const { invalidateSeoMemoryCache } = await import("./data/seo")
          invalidateSeoMemoryCache(pageKey ? `seo_${pageKey}` : undefined)
        } catch {}
        revalidateTag("seo_setting")
        if (pageKey) {
          const derived = derivePathFromPageKey(pageKey)
          if (derived) {
            revalidatePath(derived)
          }
        }
        break
      }

      case "site_setting": {
        try {
          const { invalidateSeoMemoryCache } = await import("./data/seo")
          invalidateSeoMemoryCache("site_setting")
        } catch {}
        revalidateTag("site_setting")
        revalidatePath("/", "layout")
        break
      }
    }
  } catch (error) {
    // In dev / unit tests, revalidateTag/revalidatePath may be called outside Next server context
    console.warn(`[revalidateContent] Revalidation warning for type ${type}:`, error)
  }
}
