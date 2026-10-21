import { describe, it, expect } from "vitest"
import { generateSchemaGraph } from "../generate-graph"
import { resolveHomepageData, resolveEditzData } from "../resolvers/page"
import { resolveCollectionData } from "../resolvers/collection"
import { resolveServiceData } from "../resolvers/service"
import { resolveCaseStudyData } from "../resolvers/case-study"
import { stripEcommerceArtifacts } from "../strip-ecommerce"
import { EDITZ_SERVICE_LINKS, SITE_NAV_LINKS } from "../config"

const crumbs = (graph: any) =>
  graph["@graph"].find((n: any) => n.breadcrumb).breadcrumb.itemListElement.map((i: any) => ({
    name: i.name,
    item: i.item,
  }))

const REAL_SERVICES = [
  { title: "Performance Marketing — Meta Ads & Google Ads", slug: "performance-marketing", shortLabel: "Performance" },
  { title: "Social Media Marketing — SMO and Content Creation", slug: "social-media-marketing", shortLabel: "SMO & Content" },
  { title: "Search Engine Optimization — SEO, AEO & GEO", slug: "search-engine-optimization", shortLabel: "SEO / AEO / GEO" },
  { title: "D2C Overall Branding and Scale Growth", slug: "d2c-branding-scale-growth", shortLabel: "D2C Branding" },
  { title: "CRO — Conversion Rate Optimization", slug: "conversion-rate-optimization", shortLabel: "CRO" },
  { title: "Script & Copywriting", slug: "script-copywriting", shortLabel: "Copywriting" },
  { title: "Strategy & Consulting", slug: "strategy-consulting", shortLabel: "Strategy" },
  { title: "Web and App Development", slug: "web-app-development", shortLabel: "Web & App Dev" },
  { title: "AI Automation", slug: "ai-automation", shortLabel: "AI Automation" },
  { title: "AI Agentic Service", slug: "ai-agentic-service", shortLabel: "AI Agents" },
  { title: "AI Video Generation", slug: "ai-video-generation", shortLabel: "AI Video" },
]

const REAL_CASE_STUDIES = [
  { title: "The Kids Store", slug: "the-kids-store", category: "Branding & Visual Design · Ecommerce · PPC", challenge: "Brand building" },
  { title: "Jalvayu Wellness", slug: "jalvayu-wellness", category: "Social Media Marketing · Ecommerce · Web Development · Google Ads · Branding", challenge: "Scaling Meta ads" },
  { title: "Urban Vada Pav", slug: "urban-vada-pav", category: "Social Media Marketing · Performance Marketing · Google Ads · Branding", challenge: "Footfall expansion" },
  { title: "ElectroGlobal", slug: "electroglobal", category: "Social Media Marketing · Ecommerce Website · Performance Marketing", challenge: "Ecommerce growth" },
  { title: "Web3 DeFi Platform", slug: "web3-defi-platform", category: "Branding & Visual Design · Social Media · Web Development", challenge: "Trust building" },
  { title: "Real Estate Pro", slug: "real-estate-pro", category: "SEO · Strategy & Consulting · Web Development", challenge: "Lead generation" },
  { title: "Personal Trainer", slug: "personal-trainer", category: "Content & Copywriting · Social Media Marketing & Ads · Web Development", challenge: "Client acquisition" },
  { title: "HRiFlow Attendance App", slug: "hriflow-attendance-app", category: "Content & Copywriting · SaaS · UX/UI Design · Web Development · Google Ads", challenge: "SaaS onboarding" },
  { title: "Doctors — Medical Directory", slug: "doctors-medical-directory", category: "Branding & Visual Design · Email Marketing · Social Media · Web Development", challenge: "Directory scale" },
]

const REAL_BLOG_POSTS = [
  { title: "What Benefits Can We Derive from Automation to Boost Business ROI", slug: "benefits-derive-automation-business", published_at: "2026-07-02T11:01:40Z" },
  { title: "What Is the Advantage of Automation in Driving Business Growth", slug: "advantage-automation-business-growth", published_at: "2026-07-02T11:01:28Z" },
  { title: "Which Process Requires Automated Builds and Testing for D2C Software Success", slug: "which-process-automated-builds-testing", published_at: "2026-05-26T10:25:38Z" },
  { title: "What Is AI Automation Testing and How It Reduces Flaky Tests", slug: "what-is-ai-automation-testing", published_at: "2026-05-26T10:03:48Z" },
  { title: "Free AI Test Automation Tools Transforming Software QA Efficiency", slug: "free-ai-test-automation-tools", published_at: "2026-05-26T09:56:12Z" },
  { title: "Understanding What Is the Simplest Form of Automation in Workflow", slug: "simplest-form-automation-workflow", published_at: "2026-05-26T09:40:12Z" },
  { title: "Optimizing Workflows with AI Business Process Automation", slug: "ai-business-process-automation-comparison", published_at: "2026-05-26T06:22:59Z" },
  { title: "Unlock Career Opportunities with AI Automation Jobs in D2C Business", slug: "ai-automation-jobs-d2c-career", published_at: "2026-05-14T05:25:59Z" },
]

describe("BreadcrumbList realistic data verification (Item 7)", () => {
  it("Home: exactly 7 items (Home + 6 main nav links)", async () => {
    const graph = await generateSchemaGraph(resolveHomepageData(null))
    const list = crumbs(graph)
    expect(list.length).toBe(7)
    expect(list.map((c: any) => c.name)).toEqual([
      "Home",
      "Editz",
      "Services",
      "Blog AI",
      "About",
      "Case Studies",
      "Blog",
    ])
    expect(list[0].item).toBe("https://www.mommantum.com/")
  })

  it("/services with all active services: Home, Services, plus all 11 services (13 total)", async () => {
    const graph = await generateSchemaGraph(
      resolveCollectionData({ section: "services", items: REAL_SERVICES })
    )
    const list = crumbs(graph)
    expect(list.length).toBe(2 + REAL_SERVICES.length) // 13
    expect(list[0]).toEqual({ name: "Home", item: "https://www.mommantum.com/" })
    expect(list[1]).toEqual({ name: "Services", item: "https://www.mommantum.com/services" })
    expect(list[2]).toEqual({ name: "Performance Marketing — Meta Ads & Google Ads", item: "https://www.mommantum.com/services/performance-marketing" })
    expect(list[list.length - 1]).toEqual({ name: "AI Video Generation", item: "https://www.mommantum.com/services/ai-video-generation" })
  })

  it("/work with all 9 real case studies from database: Home, Case Studies, 9 cards, then main Services page (12 total)", async () => {
    const graph = await generateSchemaGraph(
      resolveCollectionData({ section: "work", items: REAL_CASE_STUDIES })
    )
    const list = crumbs(graph)
    expect(list.length).toBe(2 + REAL_CASE_STUDIES.length + 1) // 12 items
    expect(list[0]).toEqual({ name: "Home", item: "https://www.mommantum.com/" })
    expect(list[1]).toEqual({ name: "Case Studies", item: "https://www.mommantum.com/work" })
    expect(list[2]).toEqual({ name: "The Kids Store", item: "https://www.mommantum.com/work/the-kids-store" })
    expect(list[10]).toEqual({ name: "Doctors — Medical Directory", item: "https://www.mommantum.com/work/doctors-medical-directory" })
    expect(list[list.length - 1]).toEqual({ name: "Services", item: "https://www.mommantum.com/services" })
  })

  it("/blog with real posts: Home, Blog, and latest 6 posts newest first (8 total)", async () => {
    const graph = await generateSchemaGraph(
      resolveCollectionData({ section: "blog", items: REAL_BLOG_POSTS })
    )
    const list = crumbs(graph)
    expect(list.length).toBe(2 + 6) // 8 items
    expect(list[0]).toEqual({ name: "Home", item: "https://www.mommantum.com/" })
    expect(list[1]).toEqual({ name: "Blog", item: "https://www.mommantum.com/blog" })
    // Newest post
    expect(list[2]).toEqual({
      name: "What Benefits Can We Derive from Automation to Boost Business ROI",
      item: "https://www.mommantum.com/blog/benefits-derive-automation-business",
    })
    // 6th newest post
    expect(list[7]).toEqual({
      name: "Understanding What Is the Simplest Form of Automation in Workflow",
      item: "https://www.mommantum.com/blog/simplest-form-automation-workflow",
    })
  })

  it("/editz: exactly 8 items (Home, Editz, and 6 configured video services)", async () => {
    const graph = await generateSchemaGraph(resolveEditzData(null))
    const list = crumbs(graph)
    expect(list.length).toBe(8)
    expect(list.map((c: any) => c.name)).toEqual([
      "Home",
      "Editz",
      ...EDITZ_SERVICE_LINKS.map((s) => s.name),
    ])
    expect(list[0].item).toBe("https://www.mommantum.com/")
    expect(list[1].item).toBe("https://www.mommantum.com/editz")
  })

  it("/services/[slug]: exactly 4 items (Home, Services, {service.title}, Contact) - never contains Editz", async () => {
    const serviceInput: any = {
      title: "Performance Marketing — Meta Ads & Google Ads",
      slug: "performance-marketing",
      shortLabel: "Performance",
      description: "Data-driven paid campaigns on Meta and Google that generate real revenue, not just clicks.",
      intro: "Scale ROI.",
      image: "/images/service.jpg",
      points: [],
      outcomes: [],
      whyItMatters: [],
      faqs: [],
    }
    const resolved = resolveServiceData(serviceInput, null)
    const graph = await generateSchemaGraph(resolved)
    const list = crumbs(graph)
    expect(list.length).toBe(4)
    expect(list.map((c: any) => c.name)).toEqual([
      "Home",
      "Services",
      "Performance Marketing — Meta Ads & Google Ads",
      "Contact",
    ])
    expect(list[0].item).toBe("https://www.mommantum.com/")
    expect(list[1].item).toBe("https://www.mommantum.com/services")
    expect(list[2].item).toBe("https://www.mommantum.com/services/performance-marketing")
    expect(list[3].item).toBe("https://www.mommantum.com/contact")
    // Explicitly verify Editz is NOT in the breadcrumb
    expect(list.map((c: any) => c.name)).not.toContain("Editz")
  })
})

describe("Title Bug Verification (Item 4)", () => {
  it("ensures no service title repeats 'Service Services' and fits 50-60 characters", () => {
    for (const service of REAL_SERVICES) {
      const dummyService: any = {
        title: service.title,
        slug: service.slug,
        shortLabel: service.shortLabel,
        description: "Test description for service",
        intro: "Test intro",
        image: "/img.jpg",
        points: [],
        outcomes: [],
        faqs: [],
      }
      const resolved = resolveServiceData(dummyService, null)
      expect(resolved.title.length, `Title length for ${service.title} (${resolved.title.length})`).toBeGreaterThanOrEqual(50)
      expect(resolved.title.length, `Title length for ${service.title} (${resolved.title.length})`).toBeLessThanOrEqual(60)
      expect(resolved.title).not.toMatch(/service\s+services/i)
      expect(resolved.title).not.toMatch(/services\s+services/i)
    }
  })
})

describe("e-commerce artifacts", () => {
  it("strips return policy and OnlineStore from custom schema", () => {
    const out: any = stripEcommerceArtifacts({
      "@type": ["Organization", "OnlineStore"],
      hasMerchantReturnPolicy: { "@type": "MerchantReturnPolicy", merchantReturnDays: 7 },
      name: "X",
    })
    expect(out["@type"]).toBe("Organization")
    expect(out.hasMerchantReturnPolicy).toBeUndefined()
    expect(out.name).toBe("X")
  })
})
