import { describe, it, expect } from "vitest"
import { generateSchemaGraph } from "../generate-graph"
import {
  resolveHomepageData,
  resolveAboutData,
  resolveContactData,
  resolveLegalPageData,
  resolveEditzData,
} from "../resolvers/page"
import { resolveCollectionData } from "../resolvers/collection"
import { resolveServiceData } from "../resolvers/service"
import { resolveCaseStudyData } from "../resolvers/case-study"
import { resolveBlogData } from "../resolvers/blog"
import { PAGE_META_DEFAULTS } from "../page-defaults"
import { PAGE_FAQS_MAP, getPageFaqs } from "../../data/page-faqs"

describe("AntiGravity Prompt Audit Suite", () => {
  describe("1. Nested Breadcrumbs & Graph Shapes", () => {
    it("ensures BreadcrumbList is ALWAYS nested in WebPage and never standalone in @graph", async () => {
      const pages = [
        resolveHomepageData(null),
        resolveAboutData(null),
        resolveContactData(null),
        resolveLegalPageData("privacy-policy", "Privacy Policy | Mommantum", "Description", null),
        resolveLegalPageData("terms-and-conditions", "Terms and Conditions | Mommantum", "Description", null),
        resolveLegalPageData("blog-ai", "Blog AI | Mommantum", "Description", null),
        resolveEditzData(null),
        resolveCollectionData({ section: "services", items: [] }),
        resolveCollectionData({ section: "work", items: [] }),
        resolveCollectionData({ section: "blog", items: [] }),
      ]

      for (const resolved of pages) {
        const graph = await generateSchemaGraph(resolved)
        const types = graph["@graph"].map((n) => n["@type"])
        // Must never have standalone BreadcrumbList in @graph
        expect(types).not.toContain("BreadcrumbList")

        // Must have WebPage (or subtype) with nested breadcrumb
        const webPageNode = graph["@graph"].find((n) =>
          ["WebPage", "AboutPage", "ContactPage"].includes(n["@type"])
        )
        expect(webPageNode).toBeDefined()
        expect(webPageNode?.breadcrumb).toBeDefined()
        expect(webPageNode?.breadcrumb["@type"]).toBe("BreadcrumbList")
        expect(webPageNode?.breadcrumb.itemListElement.length).toBeGreaterThan(0)
      }
    })

    it("verifies breadcrumb URLs have valid absolute schemes and no mixed trailing slashes", async () => {
      const graph = await generateSchemaGraph(resolveHomepageData(null))
      const webPage = graph["@graph"].find((n) => n["@type"] === "WebPage")
      const items = webPage?.breadcrumb.itemListElement || []

      for (const item of items) {
        expect(item.item).toMatch(/^https:\/\/www\.mommantum\.com(\/.*)?$/)
        if (item.item !== "https://www.mommantum.com/") {
          expect(item.item.endsWith("/")).toBe(false)
        }
      }
    })
  })

  describe("2. No Ecommerce / LocalBusiness Schema on Agency Pages", () => {
    it("ensures agency pages never output MerchantReturnPolicy, OnlineStore, LocalBusiness, or Reviews", async () => {
      const pages = [
        resolveHomepageData(null),
        resolveAboutData(null),
        resolveContactData(null),
        resolveServiceData({
          slug: "seo",
          title: "Search Engine Optimization",
          shortLabel: "SEO",
          description: "Full service SEO agency in Jaipur with technical and content optimization for brands.",
          intro: "Scale organic rankings.",
          image: "https://www.mommantum.com/seo.jpg",
          points: [],
          outcomes: [],
          whyItMatters: [],
          faqs: [],
        }),
      ]

      for (const resolved of pages) {
        const graph = await generateSchemaGraph(resolved)
        const jsonString = JSON.stringify(graph)

        expect(jsonString).not.toContain("MerchantReturnPolicy")
        expect(jsonString).not.toContain("OnlineStore")
        expect(jsonString).not.toContain("LocalBusiness")
        expect(jsonString).not.toContain("ProfessionalService")
        expect(jsonString).not.toContain("AggregateRating")
        expect(jsonString).not.toContain("Review")
      }
    })
  })

  describe("3. Verified FAQs (8-10 count and 40-60 words per answer)", () => {
    it("checks every static page has 8 to 10 FAQs and each answer is strictly 40 to 60 words", () => {
      const verifiedKeys = [
        "homepage",
        "about",
        "contact",
        "services",
        "work",
        "blog",
        "editz",
        "faq",
        "blog-ai",
        "privacy-policy",
        "terms-and-conditions",
      ]

      for (const key of verifiedKeys) {
        const faqs = getPageFaqs(key)
        expect(faqs).toBeDefined()
        expect(faqs.length).toBeGreaterThanOrEqual(8)
        expect(faqs.length).toBeLessThanOrEqual(10)

        faqs.forEach((f, idx) => {
          expect(f.question.length).toBeGreaterThan(5)
          const words = f.answer.trim().split(/\s+/).length
          expect(
            words,
            `Page ${key} FAQ #${idx + 1} ("${f.question.slice(0, 30)}...") has ${words} words`
          ).toBeGreaterThanOrEqual(40)
          expect(
            words,
            `Page ${key} FAQ #${idx + 1} ("${f.question.slice(0, 30)}...") has ${words} words`
          ).toBeLessThanOrEqual(60)
        })
      }
    })
  })

  describe("4. Meta Title and Description Lengths", () => {
    it("ensures every page default title is 50-60 chars and description is 140-160 chars", () => {
      expect(Object.keys(PAGE_META_DEFAULTS).length).toBe(11)
      for (const [pageKey, meta] of Object.entries(PAGE_META_DEFAULTS)) {
        const tLen = meta.title.length
        const dLen = meta.description.length

        expect(
          tLen,
          `Page ${pageKey} title "${meta.title}" is ${tLen} chars (expected 50-60)`
        ).toBeGreaterThanOrEqual(50)
        expect(
          tLen,
          `Page ${pageKey} title "${meta.title}" is ${tLen} chars (expected 50-60)`
        ).toBeLessThanOrEqual(60)

        expect(
          dLen,
          `Page ${pageKey} description is ${dLen} chars (expected 140-160)`
        ).toBeGreaterThanOrEqual(140)
        expect(
          dLen,
          `Page ${pageKey} description is ${dLen} chars (expected 140-160)`
        ).toBeLessThanOrEqual(160)
      }
    })

    it("verifies PAGE_META_DEFAULTS exactly matches seed_page_meta_and_keywords.sql for all 11 pages", async () => {
      const fs = await import("fs")
      const path = await import("path")
      const sqlPath = path.resolve(__dirname, "../../../../db-proposals/seed_page_meta_and_keywords.sql")
      const sqlContent = fs.readFileSync(sqlPath, "utf-8")

      const matches = Array.from(
        sqlContent.matchAll(/VALUES\s*\(.+?,\s*'([^']+)'\s*,\s*'([^']*)'\s*,\s*'([^']+)'\s*,\s*'((?:''|[^'])*)'/g)
      )

      expect(matches.length).toBe(11)

      for (const match of matches) {
        const pageKey = match[1]
        const expectedTitle = match[3]
        const expectedDesc = match[4].replace(/''/g, "'")

        const actual = (PAGE_META_DEFAULTS as any)[pageKey]
        expect(actual, `Missing default meta for page_key: ${pageKey}`).toBeDefined()
        expect(actual.title, `Title mismatch on ${pageKey}`).toBe(expectedTitle)
        expect(actual.description, `Description mismatch on ${pageKey}`).toBe(expectedDesc)
      }
    })

    it("ensures all 16 active services have fallback titles between 50 and 60 chars, no repeated words, and no 'MM' abbreviation", () => {
      const activeServices = [
        { slug: "social-media-marketing", title: "Social Media Marketing — SMO and Content Creation" },
        { slug: "strategy-consulting", title: "Strategy & Consulting" },
        { slug: "search-engine-optimization", title: "Search Engine Optimization — SEO, AEO & GEO" },
        { slug: "ai-agentic-service", title: "AI Agentic Service" },
        { slug: "script-copywriting", title: "Script & Copywriting" },
        { slug: "web-app-development", title: "Web and App Development" },
        { slug: "d2c-branding-scale-growth", title: "D2C Overall Branding and Scale Growth" },
        { slug: "ai-video-generation", title: "AI Video Generation" },
        { slug: "conversion-rate-optimization", title: "CRO — Conversion Rate Optimization" },
        { slug: "performance-marketing", title: "Performance Marketing — Meta Ads & Google Ads" },
        { slug: "ai-automation", title: "AI Automation" },
        { slug: "content-video-scripting", title: "Content and Video Scripting" },
        { slug: "video-editing", title: "Video Editing" },
        { slug: "ai-video-editing", title: "AI Video Editing" },
        { slug: "podcast-editing", title: "Podcast Editing" },
        { slug: "motion-graphics", title: "Motion Graphics" },
      ]

      for (const s of activeServices) {
        const resolved = resolveServiceData({
          slug: s.slug,
          title: s.title,
          shortLabel: s.title,
          description: "description",
          intro: "intro",
          image: "/image.jpg",
          points: [],
          outcomes: [],
          whyItMatters: [],
          faqs: [],
        })

        const title = resolved.title
        const len = title.length
        expect(len, `Service ${s.slug} title "${title}" length ${len} must be 50-60`).toBeGreaterThanOrEqual(50)
        expect(len, `Service ${s.slug} title "${title}" length ${len} must be 50-60`).toBeLessThanOrEqual(60)

        // No MM abbreviation
        expect(title).not.toMatch(/\bMM\b/)

        // No repeated word
        const words = title.toLowerCase().match(/\b[a-z0-9]+\b/g) || []
        const seen = new Set<string>()
        for (const w of words) {
          expect(seen.has(w), `Service ${s.slug} title "${title}" repeats word "${w}"`).toBe(false)
          seen.add(w)
        }
      }
    })
  })

  describe("5. Keywords Verification (Strict DB-only, no hardcoded fallbacks)", () => {
    it("ensures no keywords property is emitted when seoSetting is null or empty", async () => {
      const resolved = resolveHomepageData(null)
      expect(resolved.keywords).toBeUndefined()
      const graph = await generateSchemaGraph(resolved)
      const webpage = graph["@graph"].find((n) => n["@type"] === "WebPage")
      expect(webpage?.keywords).toBeUndefined()
    })

    it("ensures keywords are read from seoSetting when provided", async () => {
      const mockSeo: any = {
        primary_keyword: "digital marketing agency in jaipur",
        secondary_keywords: [
          "performance marketing agency in india",
          "d2c marketing agency",
          "seo company in jaipur",
          "ai automation agency",
        ],
      }
      const resolved = resolveHomepageData(mockSeo)
      expect(resolved.keywords).toBeDefined()
      expect(resolved.keywords?.length).toBe(5)
      expect(resolved.keywords?.[0]).toBe("digital marketing agency in jaipur")
      const graph = await generateSchemaGraph(resolved)
      const webpage = graph["@graph"].find((n) => n["@type"] === "WebPage")
      expect(webpage?.keywords).toContain("digital marketing agency in jaipur")
    })
  })
})
