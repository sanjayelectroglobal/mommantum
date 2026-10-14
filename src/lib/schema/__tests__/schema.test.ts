import { describe, it, expect } from "vitest"
import { serializeJsonLd } from "../serialize"
import { isValidAbsoluteUrl, isValidIsoDate, verifyGraphIdReferences, verifyNoForbiddenEntities } from "../validate"
import { getEntityId, normalizeUrl, normalizeBaseUrl, DEFAULT_BASE_URL } from "../config"
import { cleanEmptyProperties, buildSchemaGraph } from "../build-graph"
import { DEFAULT_ORGANIZATION_PROFILE } from "../site"
import { resolveHomepageData, resolveServiceData, resolveBlogData, resolveCaseStudyData } from "../resolvers"
import { generateSchemaGraph } from "../generate-graph"

describe("Safe JSON-LD Serializer", () => {
  it("escapes </script> and <!-- to prevent script breakouts", () => {
    const malicious = {
      title: "</script><script>alert('xss')</script>",
      comment: "<!-- html comment -->",
    }
    const serialized = serializeJsonLd(malicious)
    expect(serialized).not.toContain("</script>")
    expect(serialized).not.toContain("<!--")
    expect(serialized).toContain("\\u003c/script\\u003e")
    expect(serialized).toContain("\\u003c!--")
  })

  it("escapes & and unicode line/paragraph separators U+2028 and U+2029", () => {
    const data = {
      text: "Ampersand & separators \u2028 and \u2029",
    }
    const serialized = serializeJsonLd(data)
    expect(serialized).toContain("\\u0026")
    expect(serialized).toContain("\\u2028")
    expect(serialized).toContain("\\u2029")
  })

  it("handles null and undefined gracefully", () => {
    expect(serializeJsonLd(null)).toBe("")
    expect(serializeJsonLd(undefined)).toBe("")
  })
})

describe("Validators", () => {
  it("validates absolute URLs correctly and disallows localhost", () => {
    expect(isValidAbsoluteUrl("https://www.mommantum.com/services")).toBe(true)
    expect(isValidAbsoluteUrl("https://www.mommantum.com/")).toBe(true)
    expect(isValidAbsoluteUrl("http://localhost:8000/services")).toBe(false)
    expect(isValidAbsoluteUrl("http://127.0.0.1:3000")).toBe(false)
    expect(isValidAbsoluteUrl("/services/seo")).toBe(false)
    expect(isValidAbsoluteUrl("")).toBe(false)
  })

  it("validates ISO-8601 date strings", () => {
    expect(isValidIsoDate("2025-12-15")).toBe(true)
    expect(isValidIsoDate("2026-05-26T10:25:38.396Z")).toBe(true)
    expect(isValidIsoDate("2026-05-26T10:25:38+05:30")).toBe(true)
    expect(isValidIsoDate("invalid-date")).toBe(false)
    expect(isValidIsoDate("2025/12/15")).toBe(false)
    expect(isValidIsoDate("")).toBe(false)
  })
})

describe("Entity ID and URL builders", () => {
  it("constructs correct entity IDs adhering to spec", () => {
    const base = "https://www.mommantum.com/"
    expect(getEntityId(base, "#organization")).toBe("https://www.mommantum.com/#organization")
    expect(getEntityId(base, "#website")).toBe("https://www.mommantum.com/#website")
    expect(getEntityId(base, "#localbusiness")).toBe("https://www.mommantum.com/#localbusiness")
    expect(getEntityId(base, "#founder")).toBe("https://www.mommantum.com/#founder")

    const pageUrl = "https://www.mommantum.com/services/seo"
    expect(getEntityId(pageUrl, "#webpage")).toBe("https://www.mommantum.com/services/seo#webpage")
    expect(getEntityId(pageUrl, "#service")).toBe("https://www.mommantum.com/services/seo#service")
    expect(getEntityId(pageUrl, "#breadcrumb")).toBe("https://www.mommantum.com/services/seo#breadcrumb")
  })

  it("normalizes localhost URLs to DEFAULT_BASE_URL", () => {
    expect(normalizeBaseUrl("http://localhost:8000")).toBe(`${DEFAULT_BASE_URL}/`)
    expect(normalizeUrl("/services", "http://localhost:8000")).toBe("https://www.mommantum.com/services")
    expect(normalizeUrl("http://localhost:8000/logo.png")).toBe("https://www.mommantum.com/logo.png")
  })
})

describe("Missing-field omission and cleanEmptyProperties", () => {
  it("drops null, undefined, empty strings, and empty arrays", () => {
    const dirty = {
      keep: "valid",
      emptyStr: "",
      emptyArr: [],
      nullVal: null,
      undefVal: undefined,
      nested: {
        validNested: "hello",
        emptyNestedStr: "",
      },
      emptyNestedObj: {
        onlyEmpty: "",
      },
    }
    const cleaned = cleanEmptyProperties(dirty)
    expect(cleaned).toEqual({
      keep: "valid",
      nested: {
        validNested: "hello",
      },
    })
    expect(cleaned).not.toHaveProperty("emptyStr")
    expect(cleaned).not.toHaveProperty("emptyArr")
    expect(cleaned).not.toHaveProperty("nullVal")
    expect(cleaned).not.toHaveProperty("undefVal")
    expect(cleaned).not.toHaveProperty("emptyNestedObj")
  })
})

describe("Graph Reference Checker and Forbidden Entities", () => {
  it("flags missing @id references in graph", () => {
    const brokenGraph = [
      {
        "@type": "WebPage",
        "@id": "https://www.mommantum.com/#webpage",
        about: { "@id": "https://www.mommantum.com/#nonexistent-org" },
      },
    ]
    const res = verifyGraphIdReferences(brokenGraph)
    expect(res.valid).toBe(false)
    expect(res.issues.length).toBeGreaterThan(0)
    expect(res.issues[0].message).toContain("nonexistent-org")
  })

  it("catches forbidden entities like Brand, aggregateRating, Review", () => {
    const invalidGraph = [
      {
        "@type": "Brand",
        "@id": "https://www.mommantum.com/#brand",
        name: "Mommantum",
      },
      {
        "@type": "Service",
        "@id": "https://www.mommantum.com/#service",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
        },
      },
    ]
    const res = verifyNoForbiddenEntities(invalidGraph)
    expect(res.valid).toBe(false)
    expect(res.issues.some((i) => i.message.includes("Brand"))).toBe(true)
    expect(res.issues.some((i) => i.message.includes("aggregateRating"))).toBe(true)
  })
})

describe("End-to-End Schema Graph Generation", () => {
  it("generates valid Homepage graph with full Organization, LocalBusiness, Founder, WebSite, FAQ", async () => {
    const resolved = resolveHomepageData(null)
    const graph = await generateSchemaGraph(resolved)

    expect(graph["@context"]).toBe("https://schema.org")
    const types = graph["@graph"].map((n) => n["@type"])

    expect(types).toContain("WebSite")
    expect(types).toContain("Organization")
    expect(types).toContain("ProfessionalService")
    expect(types).toContain("Person")
    expect(types).toContain("WebPage")
    expect(types).toContain("BreadcrumbList")
    expect(types).toContain("FAQPage")

    // Assert no forbidden entities
    const checkForbidden = verifyNoForbiddenEntities(graph["@graph"])
    expect(checkForbidden.valid).toBe(true)

    // Assert all references resolve
    const checkRefs = verifyGraphIdReferences(graph["@graph"])
    expect(checkRefs.valid).toBe(true)

    // Assert business facts accuracy
    const orgNode = graph["@graph"].find((n) => n["@type"] === "Organization")
    expect(orgNode?.name).toBe("Mommantum")
    expect(orgNode?.taxID).toBe("08CTJPA2104B1ZI")
    expect(orgNode?.foundingDate).toBe("2025-12-15")
    expect(orgNode?.email).toBe("kuldeep@mommantum.in")
    expect(orgNode?.telephone).toBe("+917742276031")
  })

  it("generates valid Service graph without aggregateRating or fabricated prices", async () => {
    const resolved = resolveServiceData({
      slug: "performance-marketing",
      title: "Performance Marketing",
      shortLabel: "Performance",
      description: "Scale your revenue through Meta and Google ads.",
      intro: "Intro text",
      image: "/images/performance.jpg",
      points: ["Full ad audit", "Creative iteration"],
      outcomes: ["Lower CAC", "Higher ROAS"],
      whyItMatters: [],
      faqs: [
        {
          question: "What platforms do you run ads on?",
          answer: "We run ads primarily on Meta Ads and Google Ads with data-backed tracking.",
        },
      ],
    })

    const graph = await generateSchemaGraph(resolved)
    const types = graph["@graph"].map((n) => n["@type"])

    expect(types).toContain("Service")
    expect(types).toContain("FAQPage")
    expect(types).toContain("WebPage")
    expect(types).toContain("BreadcrumbList")

    const serviceNode = graph["@graph"].find((n) => n["@type"] === "Service")
    expect(serviceNode?.name).toBe("Performance Marketing | Mommantum")
    expect(serviceNode?.offers).toBeUndefined() // No fabricated prices
    expect(serviceNode?.aggregateRating).toBeUndefined()
  })

  it("generates valid BlogPosting graph with Person author and resolved category name", async () => {
    const resolved = resolveBlogData({
      id: "post-1",
      slug: "automation-tips",
      title: "10 Automation Tips for D2C Brands",
      category_id: "Business Automation",
      featured_image: "/blog/post1.webp",
      image_urls: [],
      excerpt: "Practical guide to business automation.",
      content: "Full content...",
      author_name: "Kuldeep Ahir",
      status: "published",
      published_at: "2026-05-20T08:00:00Z",
      updated_at: "2026-05-21T09:00:00Z",
      meta_title: null,
      meta_description: null,
      faqs: [],
    })

    const graph = await generateSchemaGraph(resolved)
    const articleNode = graph["@graph"].find((n) => n["@type"] === "BlogPosting")

    expect(articleNode).toBeDefined()
    expect(articleNode?.headline).toBe("10 Automation Tips for D2C Brands")
    expect(articleNode?.author).toEqual({
      "@type": "Person",
      name: "Kuldeep Ahir",
    })
    expect(articleNode?.articleSection).toBe("Business Automation")
    expect(articleNode?.datePublished).toBe("2026-05-20T08:00:00Z")
    expect(articleNode?.dateModified).toBe("2026-05-21T09:00:00Z")
  })

  it("generates valid Case Study Article graph without type=blog", async () => {
    const resolved = resolveCaseStudyData({
      slug: "the-kids-store",
      category: "Ecommerce · PPC",
      title: "The Kids Store",
      challenge: "High CAC",
      image: "/images/kids.webp",
      whatWeDid: ["Redesign", "Ads"],
      results: ["Conversion grew to 2.8%"],
      metrics: [],
    })

    const graph = await generateSchemaGraph(resolved)
    const articleNode = graph["@graph"].find((n) => n["@type"] === "Article")

    expect(articleNode).toBeDefined()
    expect(articleNode?.articleSection).toBe("Case Study")
    expect(articleNode?.about).toEqual({
      "@type": "Organization",
      name: "The Kids Store",
    })

    // Breadcrumb must be Home > Work > The Kids Store (NOT Home > Blog)
    const breadcrumbNode = graph["@graph"].find((n) => n["@type"] === "BreadcrumbList")
    const names = breadcrumbNode?.itemListElement.map((item: any) => item.name)
    expect(names).toEqual(["Home", "Work", "The Kids Store"])
  })

  it("generates CollectionPage graph for store collection", async () => {
    const { resolveCollectionData } = await import("../resolvers/collection")
    const resolved = resolveCollectionData({
      section: "store",
      items: [{ name: "Apparel", handle: "apparel" }],
    })

    const graph = await generateSchemaGraph(resolved)
    const collectionNode = graph["@graph"].find((n) => n["@type"] === "CollectionPage")
    expect(collectionNode).toBeDefined()
    expect(collectionNode?.name).toBe("Store | Mommantum")
  })

  it("generates AboutPage graph for /about", async () => {
    const { resolveAboutData } = await import("../resolvers/page")
    const resolved = resolveAboutData(null)

    const graph = await generateSchemaGraph(resolved)
    const pageNode = graph["@graph"].find((n) => n["@type"] === "AboutPage")
    expect(pageNode).toBeDefined()
    expect(pageNode?.name).toBe("About | Mommantum")
  })

  it("detects forbidden entities when aggregateRating or review is present", () => {
    const forbiddenGraph = [
      {
        "@type": "Product",
        name: "Test Product",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 5,
        },
      },
    ]

    const result = verifyNoForbiddenEntities(forbiddenGraph)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.message.includes("aggregateRating"))).toBe(true)
  })

  it("derives correct storefront paths from seo_setting page_keys", async () => {
    const { derivePathFromPageKey } = await import("@lib/revalidate")
    expect(derivePathFromPageKey("home")).toBe("/")
    expect(derivePathFromPageKey("about")).toBe("/about")
    expect(derivePathFromPageKey("service:performance-marketing")).toBe("/services/performance-marketing")
    expect(derivePathFromPageKey("blog:how-to-scale")).toBe("/blog/how-to-scale")
    expect(derivePathFromPageKey("work:the-kids-store")).toBe("/work/the-kids-store")
    expect(derivePathFromPageKey("unknown-custom-key")).toBeNull()
  })

  it("enforces strict graph shape rules across all 17 public routes", async () => {
    const {
      resolveContactData,
      resolveCollectionData,
      resolveEditzData,
      resolveLegalPageData,
    } = await import("../resolvers")

    const dummyService = {
      slug: "performance-marketing",
      title: "Performance Marketing",
      shortLabel: "Performance",
      description: "Scale your revenue through Meta and Google ads.",
      intro: "Intro text",
      image: "/images/performance.jpg",
      points: ["Point 1"],
      outcomes: ["Outcome 1"],
      whyItMatters: [],
      faqs: [{ question: "Q1?", answer: "A1 answering in forty to sixty words for test." }]
    }

    const dummyBlog = {
      id: "b1",
      slug: "advantage-automation-business-growth",
      title: "Advantage of Automation in Business Growth",
      category_id: "Automation",
      featured_image: "/blog/post.webp",
      image_urls: [],
      excerpt: "Excerpt",
      content: "Content",
      author_name: "Kuldeep Ahir",
      status: "published",
      published_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-02T00:00:00Z",
      meta_title: null,
      meta_description: null,
      faqs: []
    }

    const dummyCaseStudy = {
      slug: "the-kids-store",
      category: "Ecommerce · PPC",
      title: "The Kids Store",
      challenge: "High CAC",
      image: "/images/kids.webp",
      whatWeDid: ["Redesign", "Ads"],
      results: ["Conversion grew to 2.8%"],
      metrics: [],
    }

    const routes = [
      { path: "/", resolved: resolveHomepageData() },
      { path: "/about", resolved: (await import("../resolvers/page")).resolveAboutData() },
      { path: "/contact", resolved: resolveContactData() },
      { path: "/services", resolved: resolveCollectionData({ section: "services", items: [] }) },
      { path: "/services/performance-marketing", resolved: resolveServiceData(dummyService) },
      { path: "/services/social-media-marketing", resolved: resolveServiceData({ ...dummyService, slug: "social-media-marketing" }) },
      { path: "/services/search-engine-optimization", resolved: resolveServiceData({ ...dummyService, slug: "search-engine-optimization" }) },
      { path: "/services/ai-agentic-service", resolved: resolveServiceData({ ...dummyService, slug: "ai-agentic-service" }) },
      { path: "/work", resolved: resolveCollectionData({ section: "work", items: [] }) },
      { path: "/work/the-kids-store", resolved: resolveCaseStudyData(dummyCaseStudy) },
      { path: "/blog", resolved: resolveCollectionData({ section: "blog", items: [] }) },
      { path: "/blog/advantage-automation-business-growth", resolved: resolveBlogData(dummyBlog) },
      { path: "/blog-ai", resolved: resolveCollectionData({ section: "blog", items: [] }) },
      { path: "/editz", resolved: resolveEditzData() },
      { path: "/store", resolved: resolveCollectionData({ section: "store", items: [] }) },
      { path: "/terms-and-conditions", resolved: resolveLegalPageData("terms-and-conditions", "Terms", "Terms desc") },
      { path: "/privacy-policy", resolved: resolveLegalPageData("privacy-policy", "Privacy", "Privacy desc") },
    ]

    console.log("\n================ 17-ROUTE REAL @type LIST ================")
    for (const r of routes) {
      const graph = await generateSchemaGraph(r.resolved)
      const types = graph["@graph"].map((n) => n["@type"])
      const refCheck = verifyGraphIdReferences(graph["@graph"])

      console.log(`${r.path.padEnd(42)} -> [${types.join(", ")}]`)

      // Zero unresolved refs
      expect(refCheck.issues.filter((i) => i.severity === "error").length).toBe(0)

      // No forbidden entities
      const forbiddenCheck = verifyNoForbiddenEntities(graph["@graph"])
      expect(forbiddenCheck.valid).toBe(true)

      // Assert no @type appears more than once on any route
      const typeCounts: Record<string, number> = {}
      for (const t of types) {
        typeCounts[t] = (typeCounts[t] || 0) + 1
      }
      for (const [t, count] of Object.entries(typeCounts)) {
        expect(count, `Type "${t}" appeared ${count} times on route ${r.path}`).toBe(1)
      }

      if (r.path === "/") {
        expect(types).toContain("WebSite")
        expect(types).toContain("Organization")
        expect(types).toContain("ProfessionalService")
        expect(types).toContain("Person")
        expect(types).toContain("WebPage")
        expect(types).toContain("BreadcrumbList")
        expect(types).toContain("FAQPage")
      } else if (r.path === "/about") {
        expect(types).not.toContain("WebSite")
        expect(types).toContain("Organization")
        expect(types).toContain("ProfessionalService")
        expect(types).toContain("Person")
        expect(types).toContain("AboutPage")
        expect(types).toContain("BreadcrumbList")
      } else if (r.path === "/contact") {
        expect(types).not.toContain("WebSite")
        expect(types).not.toContain("Person")
        expect(types).toContain("Organization")
        expect(types).toContain("ProfessionalService")
        expect(types).toContain("ContactPage")
        expect(types).toContain("BreadcrumbList")
      } else if (r.path === "/services" || r.path === "/work" || r.path === "/store") {
        // Collection pages: EXACTLY ONE CollectionPage, NO separate WebPage
        expect(types).toContain("CollectionPage")
        expect(types).not.toContain("WebPage")
        expect(types).not.toContain("WebSite")
        expect(types).not.toContain("ProfessionalService")
        expect(types).not.toContain("Person")
        expect(types).toContain("Organization")
        expect(types).toContain("BreadcrumbList")
      } else {
        // Inner pages: NO WebSite, NO ProfessionalService, NO Person
        expect(types).not.toContain("WebSite")
        expect(types).not.toContain("ProfessionalService")
        expect(types).not.toContain("Person")
        expect(types).toContain("Organization")
        expect(types).toContain("BreadcrumbList")
      }
    }
  })
})



