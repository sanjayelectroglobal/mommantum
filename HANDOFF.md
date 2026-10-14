# Mommantum Project Handoff Documentation

This document summarizes all schema, SEO, and database proposal updates completed during the autonomous optimization and stabilization run.

---

## 1. Files Added, Changed, and Removed

### Files Added
- `scripts/gen-faq-sql.ts`: TypeScript generation script reading `mommantum_schema_antigravity_prompt.json` and outputting verified SQL proposals for FAQs and keywords.
- `mommantum_schema_antigravity_prompt.json`: Source specification containing confirmed service descriptions, FAQs, keywords, and facts.
- `db-proposals/add_organization_profile.sql`: DDL migration creating the `organization_profile` table and RLS policies.
- `db-proposals/seed_organization_profile.sql`: Seed proposal upserting the single source of truth for Mommantum business facts.
- `db-proposals/clean_meta_titles.sql`: Read audit SELECT and regex UPDATE trimming trailing ` - himanshu` from meta titles.
- `db-proposals/cleanup_schema_json.sql`: Migration script nullifying legacy/fabricated `schema_json` fields.
- `db-proposals/seed_keywords.sql`: Seed script populating primary and secondary keywords across 11 active services.
- `db-proposals/seed_service_faqs.sql`: 71 validated FAQs across 11 active services (word counts 40–60, hard cap 8 applied).
- `db-proposals/seed_home_faqs.sql`: 5 validated FAQs for the homepage (word counts 40–47).
- `src/lib/schema/`: Centralized JSON-LD schema graph engine:
  - `build-graph.ts`: Core schema orchestrator assembling unified `@graph` payloads.
  - `constants.ts`: Confirmed facts single source of truth.
  - `types.ts`: Graph interfaces and type definitions.
  - `fetchers/`: Dynamic data fetchers (`organization.ts`, `service.ts`, `blog.ts`, `case-study.ts`, `site-settings.ts`).
  - `resolvers/`: Route-level resolvers with metadata synchronization (`page.ts`, `service.ts`, `blog.ts`, `case-study.ts`, `collection.ts`).
  - `templates/`: Schema.org templates (`organization.ts`, `person.ts`, `website.ts`, `webpage.ts`, `breadcrumb.ts`, `faq.ts`, `service.ts`, `blog-posting.ts`, `case-study.ts`, `collection.ts`).
  - `validation/`: Runtime entity validation and sanitization (`validate.ts`, `sanitize.ts`).
  - `__tests__/`: Automated test suites (`build-graph.test.ts`, `revalidate.test.ts`).
- `vitest.config.mjs`: Test framework configuration for Vitest.

### Files Changed
- `src/middleware.ts`: Added route interception returning HTTP 404 for `/admin/schema` and `/api/admin/schema`.
- `src/app/(store)/(main)/store/page.tsx`: Synchronized metadata generation with schema resolver for 100% exact parity.
- `src/lib/schema/resolvers/page.ts`: Standardized canonical URL on root page to `https://www.mommantum.com` matching Next.js canonical tag.
- `src/lib/schema/templates/*`: Standardized `inLanguage` to `"en-IN"` across all templates.
- `src/modules/layout/templates/footer/index.tsx`: Reverted UI LinkedIn social link.
- `src/modules/layout/components/header/NavBar.tsx`: Reverted UI LinkedIn link and styling.
- `src/app/(store)/contact/_components/ContactClient.tsx`: Reverted UI LinkedIn button.
- `src/lib/data/case-studies.ts`: Preserved UI founder title `"Founder & Creative Director"`.
- `src/app/(store)/about/_components/AboutClient.tsx`: Preserved UI founder title `"Founder & Creative Director"`.
- `package.json`: Added test script and vitest dependency.

### Files Removed / Cleaned Up
- Build artifacts (`tsconfig.tsbuildinfo`).
- Temporary testing/debugging scripts.

---

## 2. Order of Execution for Database Proposals

A human operator must run the SQL scripts located in `db-proposals/` against the Supabase database in the following strict order:

1. **`db-proposals/add_organization_profile.sql`**
   - Creates the `organization_profile` table with proper column constraints and RLS read permissions.
2. **`db-proposals/seed_organization_profile.sql`**
   - Populates the single confirmed organization profile row (founding date, address, contact, taxID, social profiles).
3. **`db-proposals/clean_meta_titles.sql`**
   - Audits and cleans legacy strings (` - himanshu`) from `seo_setting`, `services`, and `post` tables.
4. **`db-proposals/cleanup_schema_json.sql`**
   - Clears legacy hardcoded/fabricated JSON-LD columns from existing tables.
5. **`db-proposals/seed_keywords.sql`**
   - Updates `keywords` columns for all 11 active services with primary and secondary target keywords.
6. **`db-proposals/seed_service_faqs.sql`**
   - Seeds approved, validated FAQs for the 11 active service pages (with word counts strictly between 40 and 60).
7. **`db-proposals/seed_home_faqs.sql`**
   - Seeds the 5 approved FAQs for the homepage.

> [!NOTE]
> Until these SQL files are executed by a human in Supabase, the live website will continue to display the existing database FAQs, and the dynamic schema engine will faithfully match those visible database FAQs.

---

## 3. Manual Post-Run Verification Steps

Once the database proposals have been executed:

1. **View Source Check (One Page per Route Type):**
   - Inspect raw HTML on:
     - Homepage (`/`)
     - About (`/about`)
     - Contact (`/contact`)
     - Services Listing (`/services`)
     - Service Detail (`/services/performance-marketing`)
     - Work Listing (`/work`)
     - Case Study (`/work/the-kids-store`)
     - Blog Listing (`/blog`)
     - Blog Post (`/blog/advantage-automation-business-growth`)
     - Store (`/store`)
   - Confirm exactly one `<script type="application/ld+json">` tag exists per page.
   - Verify that `<title>`, `<meta name="description">`, `<link rel="canonical">`, and `<meta property="og:image">` match the JSON-LD `WebPage` fields identically.

2. **Schema.org Validator:**
   - Copy the rendered HTML or URL into [validator.schema.org](https://validator.schema.org/).
   - Check for 0 syntax errors, 0 missing required properties, and clean node resolution across the `@graph`.

3. **Google Rich Results Test:**
   - Submit URLs to [Google Rich Results Test](https://search.google.com/test/rich-results).
   - Confirm valid structures for `Organization`, `BreadcrumbList`, `Service`, `BlogPosting`, and `WebSite`.

---

## 4. Open Items & Known Constraints

1. **4 Services Missing in Database:**
   - The following 4 services specified in requirements do not have corresponding rows in the `services` table:
     - `video-editing`
     - `ai-video-editing`
     - `podcast-editing`
     - `motion-graphics`
   - In accordance with project instructions, no database rows were created for these. When their content pages are created and inserted into the database by the content team, their FAQs can be added.
2. **Geo Coordinates Omitted:**
   - `geo` (`latitude`/`longitude`) has been omitted from `PostalAddress` / `ProfessionalService` schema because an unverified Jaipur map pin would introduce fabricated data. The verified Google Maps URL (`https://maps.app.goo.gl/m5GfvAHsZJ5chD4z7?g_st=aw`) is supplied under `hasMap`.
3. **FAQ Rich Results Eligibility:**
   - Per Google's official Search documentation guidelines, `FAQPage` rich results in SERPs are restricted to authoritative government and healthcare websites. While the schema is syntactically valid and accurately represents on-page FAQs, Google SERP rich snippets are not expected for commercial agency domains.
4. **GSTIN Contains PAN:**
   - The Indian GSTIN `08CTJPA2104B1ZI` contains the corporate/individual PAN (`CTJPA2104B`). This is standard statutory structure for Indian tax identifiers and is correctly placed in `taxID`.
5. **End-to-End Live Update Test Marked NOT RUN:**
   - Direct writes to the production Supabase database are strictly forbidden. The mock test in `src/lib/schema/__tests__/revalidate.test.ts` verified that `revalidateContent` invokes the exact cache tags and paths. An end-to-end write-and-revalidate verification on a staging environment should be performed manually after applying the SQL migrations.
