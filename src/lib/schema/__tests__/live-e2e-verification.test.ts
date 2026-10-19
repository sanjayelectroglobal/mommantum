import { describe, it, expect } from "vitest"
import { generateSchemaGraph } from "../generate-graph"
import { verifyGraphIdReferences, verifyNoForbiddenEntities } from "../validate"
import {
  resolveHomepageData,
  resolveAboutData,
  resolveContactData,
  resolveServiceData,
  resolveBlogData,
  resolveCaseStudyData,
  resolveCollectionData,
  resolveLegalPageData,
} from "../resolvers"

describe("Step 5 Automated Verification: Exact Schema Node Matrix Per Page Type", () => {
  const samplePages = [
    {
      pageType: "home",
      url: "/",
      expectedTypes: ["WebSite", "Organization", "WebPage", "BreadcrumbList"],
      expectedCount: 4,
      resolver: () => resolveHomepageData(null),
    },
    {
      pageType: "page",
      url: "/about",
      expectedTypes: ["AboutPage", "BreadcrumbList"],
      expectedCount: 2,
      resolver: () => resolveAboutData(null),
    },
    {
      pageType: "page",
      url: "/contact",
      expectedTypes: ["ContactPage", "BreadcrumbList"],
      expectedCount: 2,
      resolver: () => resolveContactData(null),
    },
    {
      pageType: "page",
      url: "/services/performance-marketing",
      expectedTypes: ["WebPage", "BreadcrumbList"],
      expectedCount: 2,
      resolver: () =>
        resolveServiceData({
          slug: "performance-marketing",
          title: "Performance Marketing",
          shortLabel: "Performance",
          description: "Scale your revenue through Meta and Google ads.",
          intro: "Intro text",
          image: "/images/performance.jpg",
          points: ["Full ad audit"],
          outcomes: ["Lower CAC"],
          whyItMatters: [],
          faqs: [
            {
              question: "What platforms do you run ads on?",
              answer: "We run ads primarily on Meta Ads and Google Ads with data-backed tracking systems.",
            },
          ],
        }),
    },
    {
      pageType: "blog_index",
      url: "/blog",
      expectedTypes: ["WebPage", "BreadcrumbList"],
      expectedCount: 2,
      resolver: () => resolveCollectionData({ section: "blog", items: [] }),
    },
    {
      pageType: "blog_post",
      url: "/blog/scale-d2c",
      expectedTypes: ["BlogPosting", "WebPage", "BreadcrumbList"],
      expectedCount: 3,
      resolver: () =>
        resolveBlogData({
          id: "p1",
          slug: "scale-d2c",
          title: "Scaling D2C Brands in India",
          category_id: "E-commerce Growth",
          featured_image: "/blog/d2c.webp",
          image_urls: [],
          excerpt: "Guide to scaling D2C brands profitably.",
          content: "Full content...",
          author_name: "Kuldeep Ahir",
          status: "published",
          published_at: "2026-06-01T00:00:00Z",
          updated_at: "2026-06-02T00:00:00Z",
          meta_title: null,
          meta_description: null,
          faqs: [],
        }),
    },
    {
      pageType: "product",
      url: "/products/sample-product",
      expectedTypes: ["Product", "WebPage", "BreadcrumbList"],
      expectedCount: 3,
      resolver: () => ({
        contentType: "product" as const,
        title: "Sample Product | Mommantum",
        description: "Official sample product description.",
        canonicalUrl: "https://www.mommantum.com/products/sample-product",
        image: "/images/sample.jpg",
        keywords: ["sample", "ecommerce"],
        breadcrumbs: [
          { name: "Home", url: "https://www.mommantum.com/" },
          { name: "Store", url: "https://www.mommantum.com/store" },
          { name: "Sample Product", url: "https://www.mommantum.com/products/sample-product" },
        ],
        offers: {
          price: 1499,
          priceCurrency: "INR",
        },
      }),
    },
    {
      pageType: "category",
      url: "/store",
      expectedTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
      expectedCount: 3,
      resolver: () =>
        resolveCollectionData({
          section: "store",
          items: [{ name: "Apparel", handle: "apparel" }],
        }),
    },
  ]

  for (const page of samplePages) {
    it(`validates ${page.pageType} (${page.url}) adheres to exactly ${page.expectedCount} allowed schema nodes`, async () => {
      const resolved = await page.resolver()
      const graph = await generateSchemaGraph(resolved)

      // 1. JSON-LD structure must have @context and @graph array
      expect(graph["@context"]).toBe("https://schema.org")
      expect(Array.isArray(graph["@graph"])).toBe(true)

      // 2. Exact node count
      expect(
        graph["@graph"].length,
        `Page ${page.url} expected exactly ${page.expectedCount} nodes, got ${graph["@graph"].length}`
      ).toBe(page.expectedCount)

      // 3. Extract top-level @types (flattening any array types like ["Organization", "OnlineStore"])
      const topLevelTypes = graph["@graph"].flatMap((n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]))

      // 4. Assert all expected types are present
      for (const expectedType of page.expectedTypes) {
        expect(
          topLevelTypes,
          `Page ${page.url} (${page.pageType}) is missing expected schema type '${expectedType}'`
        ).toContain(expectedType)
      }

      // 5. Assert NO unlisted types are present
      const allowedSet = new Set(page.expectedTypes)
      if (page.pageType === "home") {
        allowedSet.add("OnlineStore") // Allowed alias/co-type on Organization
      }
      for (const actualType of topLevelTypes) {
        expect(
          allowedSet.has(actualType),
          `Page ${page.url} contains unexpected / unallowed schema type '${actualType}'`
        ).toBe(true)
      }

      // 6. Assert no duplicate @id values on the page
      const ids = graph["@graph"].map((n) => n["@id"]).filter(Boolean)
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)

      // 7. No standalone FAQPage anywhere in @graph
      expect(topLevelTypes).not.toContain("FAQPage")

      // 8. If FAQs exist, FAQPage must ONLY be nested inside WebPage.hasPart
      const webPageNode = graph["@graph"].find((n) =>
        ["WebPage", "AboutPage", "ContactPage", "CollectionPage"].some((t) =>
          Array.isArray(n["@type"]) ? n["@type"].includes(t) : n["@type"] === t
        )
      )
      if (webPageNode?.hasPart) {
        expect(webPageNode.hasPart["@type"]).toBe("FAQPage")
      }

      // 9. WebSite and Organization appear ONLY on home page
      if (page.pageType !== "home") {
        expect(topLevelTypes).not.toContain("WebSite")
        expect(topLevelTypes).not.toContain("Organization")
        expect(topLevelTypes).not.toContain("OnlineStore")
      }

      // 10. No LocalBusiness or ElectronicsStore anywhere
      expect(topLevelTypes).not.toContain("LocalBusiness")
      expect(topLevelTypes).not.toContain("ElectronicsStore")

      // 11. Forbidden entity checker passes
      const forbiddenCheck = verifyNoForbiddenEntities(graph["@graph"])
      expect(forbiddenCheck.valid).toBe(true)

      // 12. Cross-page and in-page reference validation passes
      const refCheck = verifyGraphIdReferences(graph["@graph"])
      expect(refCheck.issues.filter((i) => i.severity === "error").length).toBe(0)

      // 13. JSON serialize & parse check
      const serialized = JSON.stringify(graph)
      const reparsed = JSON.parse(serialized)
      expect(reparsed["@graph"].length).toBe(page.expectedCount)
    })
  }

  describe("JsonLd Server Component Direct Verification", () => {
    const componentTestCases: Array<{
      name: string
      props: any
      expectedCount: number
      expectedTypes: string[]
    }> = [
      {
        name: "Home Page",
        props: { type: "homepage" },
        expectedCount: 4,
        expectedTypes: ["WebSite", "Organization", "WebPage", "BreadcrumbList"],
      },
      {
        name: "About Page",
        props: { type: "about" },
        expectedCount: 2,
        expectedTypes: ["AboutPage", "BreadcrumbList"],
      },
      {
        name: "Contact Page",
        props: { type: "contact" },
        expectedCount: 2,
        expectedTypes: ["ContactPage", "BreadcrumbList"],
      },
      {
        name: "Services Listing (treated as page)",
        props: { type: "collection", section: "services", items: [] },
        expectedCount: 2,
        expectedTypes: ["WebPage", "BreadcrumbList"],
      },
      {
        name: "Blog Listing (blog_index)",
        props: { type: "collection", section: "blog", items: [] },
        expectedCount: 2,
        expectedTypes: ["WebPage", "BreadcrumbList"],
      },
      {
        name: "Store Listing (category)",
        props: { type: "collection", section: "store", items: [{ name: "Apparel", handle: "apparel" }] },
        expectedCount: 3,
        expectedTypes: ["CollectionPage", "ItemList", "BreadcrumbList"],
      },
      {
        name: "Legal Page (privacy-policy)",
        props: { type: "page", slug: "privacy-policy", title: "Privacy Policy", description: "Privacy info" },
        expectedCount: 2,
        expectedTypes: ["WebPage", "BreadcrumbList"],
      },
      {
        name: "Editz Landing Page (treated as page)",
        props: { type: "editz" },
        expectedCount: 2,
        expectedTypes: ["WebPage", "BreadcrumbList"],
      },
    ]

    for (const tc of componentTestCases) {
      it(`renders JsonLd component for ${tc.name} with exactly 1 script tag and exact ${tc.expectedCount} allowed nodes`, async () => {
        const { default: JsonLd } = await import("@modules/common/components/json-ld")
        const jsx = await JsonLd(tc.props)

        expect(jsx).not.toBeNull()
        expect(jsx?.type).toBe("script")
        expect(jsx?.props?.type).toBe("application/ld+json")

        const html = jsx?.props?.dangerouslySetInnerHTML?.__html
        expect(typeof html).toBe("string")

        const parsed = JSON.parse(html as string)
        expect(parsed["@context"]).toBe("https://schema.org")
        expect(parsed["@graph"].length).toBe(tc.expectedCount)

        const topLevelTypes = parsed["@graph"].flatMap((n: any) =>
          Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]
        )

        for (const exp of tc.expectedTypes) {
          expect(topLevelTypes).toContain(exp)
        }

        expect(topLevelTypes).not.toContain("LocalBusiness")
        expect(topLevelTypes).not.toContain("ElectronicsStore")
        expect(topLevelTypes).not.toContain("ProfessionalService")
        expect(topLevelTypes).not.toContain("FAQPage")
      })
    }
  })
})
