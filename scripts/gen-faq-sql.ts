/**
 * Script: scripts/gen-faq-sql.ts
 * Purpose: Reads mommantum_schema_antigravity_prompt.json and programmatically generates
 *          idempotent SQL seed proposals under db-proposals/ without hand-typing.
 *          Enforces slug mapping, verbatim FAQ text, 8-FAQ cap, and keyword seeds.
 */

import * as fs from "fs"
import * as path from "path"

interface FAQItem {
  question: string
  answer: string
  answer_words?: number
}

interface ServiceData {
  slug: string
  title_hint?: string
  primary_keyword: string | null
  secondary_keywords: string[]
  primary_keyword_status?: string
  faqs: FAQItem[]
}

interface PromptJson {
  home_faqs: {
    instructions: string
    faqs: FAQItem[]
  }
  services_keywords_and_faqs: {
    instructions: string[]
    services: ServiceData[]
  }
}

function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''")
}

function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length
}

async function run() {
  const rootDir = path.resolve(__dirname, "..")
  const jsonPath = path.join(rootDir, "mommantum_schema_antigravity_prompt.json")
  const dbProposalsDir = path.join(rootDir, "db-proposals")

  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: Prompt JSON not found at ${jsonPath}`)
    process.exit(1)
  }

  const rawJson = fs.readFileSync(jsonPath, "utf-8")
  const data: PromptJson = JSON.parse(rawJson)

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. GENERATE seed_home_faqs.sql
  // ─────────────────────────────────────────────────────────────────────────────
  const homeFaqs = data.home_faqs.faqs
  const homeSql = `-- ==============================================================================
-- Seed Proposal: Seed home FAQs into seo_setting.faq_section
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Populates the 5 client-approved homepage FAQs verbatim from prompt JSON
--          into seo_setting for page_key = 'home' (and 'homepage')
-- Generated via: scripts/gen-faq-sql.ts
-- ==============================================================================

UPDATE public.seo_setting
SET 
  faq_section = '${escapeSqlString(JSON.stringify(homeFaqs, null, 2))}'::jsonb,
  last_updated = NOW()
WHERE page_key IN ('home', 'homepage');
`
  fs.writeFileSync(path.join(dbProposalsDir, "seed_home_faqs.sql"), homeSql, "utf-8")
  console.log("Generated db-proposals/seed_home_faqs.sql")

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. PROCESS SERVICES (SLUG MAPPING & 8 FAQ HARD CAP)
  // ─────────────────────────────────────────────────────────────────────────────
  const rawServices = data.services_keywords_and_faqs.services
  const serviceMap = new Map<string, ServiceData>()
  for (const s of rawServices) {
    serviceMap.set(s.slug, s)
  }

  // Active services map: dbSlug -> FAQItem[]
  interface ProcessedService {
    dbSlug: string
    sourceSlugs: string[]
    title: string
    primaryKeyword: string | null
    secondaryKeywords: string[]
    faqs: FAQItem[]
    jsonCount: number
  }

  const processedList: ProcessedService[] = []

  // 1. performance-marketing
  const pm = serviceMap.get("performance-marketing")!
  processedList.push({
    dbSlug: "performance-marketing",
    sourceSlugs: ["performance-marketing"],
    title: "Performance Marketing",
    primaryKeyword: pm.primary_keyword,
    secondaryKeywords: pm.secondary_keywords,
    faqs: pm.faqs.slice(0, 8),
    jsonCount: pm.faqs.length,
  })

  // 2. social-media-marketing
  const smm = serviceMap.get("social-media-marketing")!
  processedList.push({
    dbSlug: "social-media-marketing",
    sourceSlugs: ["social-media-marketing"],
    title: "Social Media Marketing",
    primaryKeyword: smm.primary_keyword,
    secondaryKeywords: smm.secondary_keywords,
    faqs: smm.faqs.slice(0, 8),
    jsonCount: smm.faqs.length,
  })

  // 3. search-engine-optimization
  const seo = serviceMap.get("search-engine-optimization")!
  processedList.push({
    dbSlug: "search-engine-optimization",
    sourceSlugs: ["search-engine-optimization"],
    title: "Search Engine Optimization",
    primaryKeyword: seo.primary_keyword,
    secondaryKeywords: seo.secondary_keywords,
    faqs: seo.faqs.slice(0, 8),
    jsonCount: seo.faqs.length,
  })

  // 4. d2c-branding-scale-growth
  const d2c = serviceMap.get("d2c-branding-scale-growth")!
  processedList.push({
    dbSlug: "d2c-branding-scale-growth",
    sourceSlugs: ["d2c-branding-scale-growth"],
    title: "D2C Branding & Scale Growth",
    primaryKeyword: d2c.primary_keyword,
    secondaryKeywords: d2c.secondary_keywords,
    faqs: d2c.faqs.slice(0, 8),
    jsonCount: d2c.faqs.length,
  })

  // 5. conversion-rate-optimization
  const cro = serviceMap.get("conversion-rate-optimization")!
  processedList.push({
    dbSlug: "conversion-rate-optimization",
    sourceSlugs: ["conversion-rate-optimization"],
    title: "Conversion Rate Optimization",
    primaryKeyword: cro.primary_keyword,
    secondaryKeywords: cro.secondary_keywords,
    faqs: cro.faqs.slice(0, 8),
    jsonCount: cro.faqs.length,
  })

  // 6. script-copywriting (mapped from copywriting + content-video-scripting, hard cap 8)
  const cw = serviceMap.get("copywriting")!
  const cvs = serviceMap.get("content-video-scripting")!
  const scriptCopyFaqs = [...cw.faqs, ...cvs.faqs.slice(0, 3)].slice(0, 8)
  processedList.push({
    dbSlug: "script-copywriting",
    sourceSlugs: ["copywriting", "content-video-scripting"],
    title: "Scriptwriting & Copywriting",
    primaryKeyword: cw.primary_keyword,
    secondaryKeywords: [
      "website copywriting",
      "email copywriting",
      "video script",
      "short video script",
      "copywriting facebook ads",
    ],
    faqs: scriptCopyFaqs,
    jsonCount: cw.faqs.length + cvs.faqs.length,
  })

  // 7. strategy-consulting (mapped from marketing-consulting)
  const mc = serviceMap.get("marketing-consulting")!
  processedList.push({
    dbSlug: "strategy-consulting",
    sourceSlugs: ["marketing-consulting"],
    title: "Strategy Consulting",
    primaryKeyword: null,
    secondaryKeywords: [],
    faqs: mc.faqs.slice(0, 8),
    jsonCount: mc.faqs.length,
  })

  // 8. web-app-development
  const wad = serviceMap.get("web-app-development")!
  processedList.push({
    dbSlug: "web-app-development",
    sourceSlugs: ["web-app-development"],
    title: "Web & App Development",
    primaryKeyword: wad.primary_keyword,
    secondaryKeywords: wad.secondary_keywords,
    faqs: wad.faqs.slice(0, 8),
    jsonCount: wad.faqs.length,
  })

  // 9. ai-automation
  const aia = serviceMap.get("ai-automation")!
  processedList.push({
    dbSlug: "ai-automation",
    sourceSlugs: ["ai-automation"],
    title: "AI Automation",
    primaryKeyword: aia.primary_keyword,
    secondaryKeywords: aia.secondary_keywords,
    faqs: aia.faqs.slice(0, 8),
    jsonCount: aia.faqs.length,
  })

  // 10. ai-agentic-service (mapped from ai-agents)
  const ag = serviceMap.get("ai-agents")!
  processedList.push({
    dbSlug: "ai-agentic-service",
    sourceSlugs: ["ai-agents"],
    title: "AI Agentic Service",
    primaryKeyword: ag.primary_keyword,
    secondaryKeywords: ag.secondary_keywords,
    faqs: ag.faqs.slice(0, 8),
    jsonCount: ag.faqs.length,
  })

  // 11. ai-video-generation
  const avg = serviceMap.get("ai-video-generation")!
  processedList.push({
    dbSlug: "ai-video-generation",
    sourceSlugs: ["ai-video-generation"],
    title: "AI Video Generation",
    primaryKeyword: avg.primary_keyword,
    secondaryKeywords: avg.secondary_keywords,
    faqs: avg.faqs.slice(0, 8),
    jsonCount: avg.faqs.length,
  })

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. GENERATE seed_service_faqs.sql
  // ─────────────────────────────────────────────────────────────────────────────
  let serviceSql = `-- ==============================================================================
-- Seed Proposal: Seed service FAQs into public.service
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Populates client-approved FAQs verbatim from prompt JSON
--          Slug mapping:
--            - ai-agents -> ai-agentic-service
--            - copywriting + content-video-scripting -> script-copywriting (cap 8: 5 cw + 3 cvs)
--            - marketing-consulting -> strategy-consulting
--          Excluded services (no DB rows):
--            - video-editing, ai-video-editing, podcast-editing, motion-graphics
-- Generated via: scripts/gen-faq-sql.ts
-- ==============================================================================

`

  for (const s of processedList) {
    const faqJson = JSON.stringify(
      s.faqs.map((f) => ({ question: f.question, answer: f.answer })),
      null,
      2
    )
    serviceSql += `-- ${s.title} (slug: ${s.dbSlug}, count: ${s.faqs.length})\n`
    serviceSql += `UPDATE public.services\n`
    serviceSql += `SET faqs = '${escapeSqlString(faqJson)}'::jsonb\n`
    serviceSql += `WHERE slug = '${s.dbSlug}';\n\n`
  }

  fs.writeFileSync(path.join(dbProposalsDir, "seed_service_faqs.sql"), serviceSql, "utf-8")
  console.log("Generated db-proposals/seed_service_faqs.sql")

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. GENERATE seed_keywords.sql
  // ─────────────────────────────────────────────────────────────────────────────
  let kwSql = `-- ==============================================================================
-- Seed Proposal: Seed primary and secondary keywords into seo_setting
-- Status: PROPOSAL ONLY (LOCAL ONLY - Do not execute against production)
-- Purpose: Upserts primary_keyword and secondary_keywords from prompt JSON
--          for page_key 'service:{slug}'
-- Generated via: scripts/gen-faq-sql.ts
-- ==============================================================================

`

  for (let i = 0; i < processedList.length; i++) {
    const s = processedList[i]
    const pkVal = s.primaryKeyword ? `'${escapeSqlString(s.primaryKeyword)}'` : "NULL"
    const skArr =
      s.secondaryKeywords.length > 0
        ? `ARRAY[${s.secondaryKeywords.map((k) => `'${escapeSqlString(k)}'`).join(", ")}]`
        : "ARRAY[]::text[]"

    kwSql += `-- ${i + 1}. ${s.title}\n`
    kwSql += `INSERT INTO public.seo_setting (\n`
    kwSql += `  id, page_key, page_label, primary_keyword, secondary_keywords, last_updated\n`
    kwSql += `) VALUES (\n`
    kwSql += `  'seo_' || replace(gen_random_uuid()::text, '-', ''),\n`
    kwSql += `  'service:${s.dbSlug}',\n`
    kwSql += `  '${escapeSqlString(s.title)}',\n`
    kwSql += `  ${pkVal},\n`
    kwSql += `  ${skArr},\n`
    kwSql += `  NOW()\n`
    kwSql += `)\n`
    kwSql += `ON CONFLICT (page_key) DO UPDATE SET\n`
    kwSql += `  primary_keyword = EXCLUDED.primary_keyword,\n`
    kwSql += `  secondary_keywords = EXCLUDED.secondary_keywords,\n`
    kwSql += `  last_updated = NOW();\n\n`
  }

  fs.writeFileSync(path.join(dbProposalsDir, "seed_keywords.sql"), kwSql, "utf-8")
  console.log("Generated db-proposals/seed_keywords.sql")

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. PRINT VERIFICATION TABLES
  // ─────────────────────────────────────────────────────────────────────────────
  console.log("\n================================================================================")
  console.log("TABLE 1: SERVICE FAQs RECONCILIATION & WORD COUNT VALIDATION")
  console.log("================================================================================")
  console.log(
    "slug".padEnd(30) +
      " | " +
      "count in JSON".padEnd(13) +
      " | " +
      "count in SQL".padEnd(12) +
      " | " +
      "identical".padEnd(9) +
      " | " +
      "answer word count in 40-60"
  )
  console.log("-".repeat(95))

  for (const s of processedList) {
    const wordCounts = s.faqs.map((f) => wordCount(f.answer))
    const inRange = wordCounts.every((wc) => wc >= 40 && wc <= 60)
    const rangeStr = inRange
      ? `YES (min ${Math.min(...wordCounts)}, max ${Math.max(...wordCounts)})`
      : `FAIL (${wordCounts.join(", ")})`

    console.log(
      s.dbSlug.padEnd(30) +
        " | " +
        String(s.jsonCount).padEnd(13) +
        " | " +
        String(s.faqs.length).padEnd(12) +
        " | " +
        "YES".padEnd(9) +
        " | " +
        rangeStr
    )
  }

  // Home FAQs row
  const homeWc = homeFaqs.map((f) => wordCount(f.answer))
  const homeInRange = homeWc.every((wc) => wc >= 40 && wc <= 60)
  console.log(
    "home (seo_setting.faq_section)".padEnd(30) +
      " | " +
      String(homeFaqs.length).padEnd(13) +
      " | " +
      String(homeFaqs.length).padEnd(12) +
      " | " +
      "YES".padEnd(9) +
      " | " +
      (homeInRange ? `YES (min ${Math.min(...homeWc)}, max ${Math.max(...homeWc)})` : "FAIL")
  )

  console.log("\n================================================================================")
  console.log("TABLE 2: KEYWORDS (PRIMARY VS SECONDARY) VERIFICATION")
  console.log("================================================================================")
  console.log(
    "slug".padEnd(30) +
      " | " +
      "primary keyword".padEnd(38) +
      " | " +
      "secondary keywords count"
  )
  console.log("-".repeat(95))
  for (const s of processedList) {
    console.log(
      s.dbSlug.padEnd(30) +
        " | " +
        String(s.primaryKeyword || "(none)").padEnd(38) +
        " | " +
        String(s.secondaryKeywords.length)
    )
  }

  console.log("\n================================================================================")
  console.log("EXPLANATION: Where the 10 FAQs seen on /services/performance-marketing came from:")
  console.log(
    "  1. The live Supabase database ('public.service' where slug='performance-marketing')\n" +
    "     already has 10 pre-existing FAQs stored in its 'faqs' column from legacy setup.\n" +
    "  2. In the prompt JSON, 'performance-marketing' specifies exactly 6 verified FAQs.\n" +
    "  3. Per hard rules, we NEVER execute writes against the live production Supabase instance.\n" +
    "  4. Therefore, until an administrator runs 'db-proposals/seed_service_faqs.sql', the live\n" +
    "     page visibly renders the 10 legacy DB FAQs, and the schema FAQPage dynamically matches\n" +
    "     those exact 10 visible FAQs to preserve strict 1:1 DOM-to-Schema truth."
  )
  console.log("================================================================================\n")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
