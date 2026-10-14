import { describe, it, expect, vi, beforeEach } from "vitest"
import { revalidateContent } from "@lib/revalidate"
import * as nextCache from "next/cache"

vi.mock("next/cache", () => {
  return {
    revalidateTag: vi.fn(),
    revalidatePath: vi.fn(),
  }
})

describe("revalidateContent - Exact Tags and Paths Mock Test", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("revalidates exact tags and paths for type: service", async () => {
    await revalidateContent({
      type: "service",
      slug: "performance-marketing",
      oldSlug: "old-pm",
    })

    expect(nextCache.revalidateTag).toHaveBeenCalledTimes(1)
    expect(nextCache.revalidateTag).toHaveBeenCalledWith("services")

    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/services")
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/")
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/services/performance-marketing")
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/services/old-pm")
  })

  it("revalidates exact tags and paths for type: blog", async () => {
    await revalidateContent({
      type: "blog",
      slug: "advantage-automation-business-growth",
      oldSlug: "old-slug",
    })

    expect(nextCache.revalidateTag).toHaveBeenCalledTimes(1)
    expect(nextCache.revalidateTag).toHaveBeenCalledWith("blog-posts")

    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/blog")
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/blog/advantage-automation-business-growth")
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/blog/old-slug")
  })

  it("revalidates exact tags and paths for type: case-study", async () => {
    await revalidateContent({
      type: "case-study",
      slug: "the-kids-store",
    })

    expect(nextCache.revalidateTag).toHaveBeenCalledTimes(1)
    expect(nextCache.revalidateTag).toHaveBeenCalledWith("case-studies")

    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/work")
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/")
    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/work/the-kids-store")
  })

  it("revalidates exact tags and paths for type: seo (service page_key)", async () => {
    await revalidateContent({
      type: "seo",
      pageKey: "service:performance-marketing",
    })

    expect(nextCache.revalidateTag).toHaveBeenCalledTimes(1)
    expect(nextCache.revalidateTag).toHaveBeenCalledWith("seo_setting")

    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/services/performance-marketing")
  })

  it("revalidates exact tags and paths for type: seo (homepage)", async () => {
    await revalidateContent({
      type: "seo",
      pageKey: "homepage",
    })

    expect(nextCache.revalidateTag).toHaveBeenCalledTimes(1)
    expect(nextCache.revalidateTag).toHaveBeenCalledWith("seo_setting")

    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/")
  })

  it("revalidates exact tags and paths for type: site_setting", async () => {
    await revalidateContent({
      type: "site_setting",
    })

    expect(nextCache.revalidateTag).toHaveBeenCalledTimes(1)
    expect(nextCache.revalidateTag).toHaveBeenCalledWith("site_setting")

    expect(nextCache.revalidatePath).toHaveBeenCalledWith("/", "layout")
  })
})
