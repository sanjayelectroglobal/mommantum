# 1 · prd.md — Product Requirements Document

This file defines WHAT Mommantum builds and WHY: who the users are, the goals and how success is measured, every feature as a user story, the exact acceptance criteria used to accept each feature, what is deliberately not built, SEO targets, constraints and open questions. Developers and AI tools read it before planning any task; if a feature has no acceptance criteria here, it is not built.

*Changes when scope changes · v1.1, verified and aligned with codebase*


## 1. Problem and users

**Mommantum** (legal name Mommantum, founded 2025-12-15, Jaipur, Rajasthan; about 15 team members) is a growth agency for high-growth D2C brands. Prospective clients today find agencies through referrals, Google search and social media, then have to piece together services, proof of results and pricing from scattered sources. There is no single place that shows what the agency does, proves it with case studies, answers their questions, and lets them contact the team or buy a packaged offering.


> **Note on E-Commerce:** E-commerce store removed on 2026-10-21; Supabase store tables intentionally left untouched.

| User | Need | How they solve it today |
|---|---|---|
| D2C brand founder / marketing head (India and international) | Evaluate an agency fast: services, proof of ROI, how to start | Referrals, Google, Instagram/LinkedIn, calls |
| Prospect from search (SEO/GEO/AEO traffic) | Direct, trustworthy answers to service questions | Competitor sites, generic blogs |
| Video-content buyer (Editz) | Short-form video, motion graphics, podcast, AI video | Freelancers, marketplaces |
| Mommantum admin (admin, manager, seo, content_manager roles) | Edit services, blogs, case studies, SEO without developers | Direct DB or developer help |
| Search engines and AI answer engines | Clean structured data (JSON-LD), sitemaps, canonical, FAQs | n/a |


## 2. Goals and success metrics


| Goal | Metric | Target (confirm with Product) |
|---|---|---|
| Generate qualified leads | Contact / onboarding form submissions per month | Baseline in first month, then agreed growth % |
| Rank for the 11 active service pages | Primary keyword positions in Search Console; indexed pages | All public pages indexed; service pages top-10 for primary keyword in 6 months |
| Technical SEO completeness | Lighthouse SEO / Best Practices / Accessibility; one valid JSON-LD graph per page | SEO ≥ 95; 0 Schema.org validator errors |
| Performance | LCP, CLS, INP; TTFB on public routes | LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms |
| Content velocity | Blog posts published (manual and n8n automated) | Agreed weekly cadence |
| Admin self-service | Content changes done without a developer | 100% of copy and SEO edits via /admin |
| Security | Open critical/high findings | 0 critical, 0 high (audit V-01 to V-08 closed) |


## 3. Features as user stories

- **Services:** As a visitor, I can browse 16 service offerings (11 active) and open /services/[slug] to see description, FAQs, keywords and related links.
- **Editz:** As a visitor, I can view the Editz video-production landing page (services, process, projects, testimonials, FAQ, CTA).
- **Work:** As a prospect, I can read case studies at /work and /work/[slug] with measurable results.
- **Blog:** As a reader, I can read articles at /blog, /blog/[slug] and AI-focused articles at /blog-ai; as an automation (n8n), I can publish posts through POST /api/blog/publish.
- **Company pages:** About, Contact (lead and onboarding forms), FAQ directory, Privacy Policy, Terms and Conditions.
- **Admin suite:** As an admin I can manage Services, Case Studies, Blogs (with images), SEO settings and site-wide SEO, Keywords, Pages, Sitemap and Users, restricted by role.
- **Dynamic SEO engine:** As the business, every page gets title, description, canonical, OG and a single connected JSON-LD @graph from one resolver, matching visible content exactly.
- **Automation:** Monthly AI SEO auto-fill cron, Google Indexing API notification on publish, internal-link suggestions via embeddings, daily Supabase keep-alive.


## 4. Acceptance criteria (exact and testable)


| Feature | Acceptance criteria |
|---|---|
| Public pages | Every public page returns 200, renders server-side (view-source shows content), has exactly one H1, a self-referencing canonical, one <script type="application/ld+json"> tag. |
| Metadata parity | Title, description, canonical and og:image in <head> equal the WebPage node in JSON-LD for all remaining route types. |
| Schema integrity | FAQPage lists exactly the FAQs visible on the page (service FAQs 40–60 words, max 8; home 5). No aggregateRating or review nodes. Missing optional fields are omitted, never invented. |
| Admin access | Unauthenticated request to the admin path returns 404 (custom path) or 307 to /admin-login; each role reaches only paths listed in roles.ts; role is verified from the database, never from a cookie. |
| Hidden panels | /admin/schema and /api/admin/schema always return 404. |
| Sitemaps | /sitemap and /sitemap/[type] list all published URLs and update when content is created, edited or deleted. |
| Revalidation | Saving a service, blog, case study, SEO row or site setting refreshes the affected tags and paths through revalidateContent(). |
| Cron | /api/cron/seo-auto-fill rejects requests without the correct CRON_SECRET; /api/keep-alive runs daily. |
| Quality gates | tsc --noEmit, lint, vitest and build all pass before release. |


## 5. Out of scope

1. **E-Commerce / Store System:** E-commerce store (cart, checkout, product catalog, customer accounts, Medusa proxy) removed on 2026-10-21; Supabase store tables intentionally left untouched.
2. **Standalone Medusa Backend Server:** No Medusa server exists or is needed.
3. **Multi-Currency & International Region Handling (Phase 1):** Country prefix `/in` has been removed. The default region is `in`, default currency is INR, and primary target geography is India (`en-IN`).
4. **Native Mobile Applications:** iOS and Android native applications are out of scope. Responsive Next.js 15 App Router web application serves all mobile users down to 320px.
5. **Public Review System & Rating Aggregate:** No unverified user reviews or Schema.org `aggregateRating`/`review` nodes will be added to avoid Google search manual actions without verified proof.
6. **Per-Page Custom Schema Ingestion in Admin:** `/admin/schema` and `/api/admin/schema` are permanently removed; all structured data is deterministically derived from data resolvers.
7. **Direct Client-Side Database Access:** Supabase credentials with elevated privileges are never exposed to the browser; all mutations flow through authenticated server-side API handlers.
8. **Production Direct Database Writes from Local Dev:** Dev environments cannot write directly to the production Supabase database; all schema changes must follow the `db-proposals/` review process.


## 6. SEO goals and target keywords

Target keywords live in the database (site_keywords, services.keywords) and are seeded by db-proposals/seed_keywords.sql for 11 active services: performance marketing, SEO/GEO/AEO, AI automation, web and app development, branding, copywriting and video production. Pages that must rank: Home, Services index, each active Service detail, Editz, Work index and case studies, Blog and Blog-AI, About, Contact. Language en-IN; areaServed India and worldwide. Local SEO: ProfessionalService schema, address B-147, Anand Vihar, Jagatpura, Jaipur 302017, hours Mon–Sat 09:00–21:00.


## 7. Constraints

- **Hosting:** Vercel serverless; crons limited to those in vercel.json (daily keep-alive, monthly SEO auto-fill).
- **Database:** Supabase production project; no direct writes to production from dev. SQL goes through db-proposals and a human operator.
- **Compliance:** DPDP Act 2023 (consent, minimum data, deletion on request); GSTIN shown publicly only as client approved.
- **Integrations:** Google Indexing API, Google Search Console, OpenAI / Gemini, AnswerThePublic via RapidAPI, n8n.
- **Currency / locale:** INR, en-IN.
- **Dependencies:** no new package without a one-line reason and approval.


## 8. Open questions (resolve before further architecture work)

1. **React Query Adoption vs Server Component Fetching (D-04 / T-06):** SOP rule 8 requires React Query, but the project currently uses Server Components with `unstable_cache`. Decide whether to adopt React Query for client-side admin lists or formally approve the exception.
2. **Rate Limiting Architecture (T-10):** Decide whether to implement Upstash Redis or Supabase PostgreSQL table/stored procedures for rate limiting login, contact forms, and AI auto-fill endpoints.
3. **Staging Environment Setup (T-11):** Decide whether to provision a separate staging Supabase project with automated schema migrations, or use Vercel preview environments with simulated database credentials.
4. **Lighthouse CI & Core Web Vitals Budget (T-12):** Confirm exact numeric thresholds for LCP, CLS, INP, and Lighthouse CI score gating.
5. **Database Table Name Discrepancy (K-16):** Reconcile references between `seo_setting` and `seo_settings` across codebase and database schema.


## 9. Non-functional requirements


| Area | Requirement |
|---|---|
| Performance | LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on mobile; public pages served from ISR/cache, no DB work in middleware for visitors. |
| Availability | Daily keep-alive cron prevents the Supabase project pausing; pages stay served from cache if the DB is slow. |
| Security | Server-side role checks, validated input, secrets only in env, RLS on all tables (see rules.md Part C). |
| Accessibility | Semantic headings, alt text on all meaningful images, keyboard-usable forms and menus, sufficient colour contrast (WCAG 2.1 AA target). |
| SEO | One H1, canonical, JSON-LD parity, sitemaps, noindex on non-public areas. |
| Browsers / devices | Latest Chrome, Safari, Edge, Firefox; mobile first from 320 px. |
| Privacy | Consent on forms, minimum data, deletion on request (DPDP Act 2023). |
| Maintainability | Files under 400 lines, functions under 50, tests for schema and services. |


## 10. Assumptions and risks


| Item | Detail | Mitigation |
|---|---|---|
| Assumption | Content (services, blogs, case studies) is edited only through /admin | Block direct DB edits except via db-proposals |
| Assumption | Production Supabase is the single source of truth | Keep backups before any SQL |
| Risk | Security findings V-01 to V-08 are exploitable today | Fix first (task NTF-301) |
| Risk | Type/lint errors hidden by disabled build checks | Turn checks on (NTF-302) |
| Risk | Third-party limits or outages (OpenAI, Google Indexing, RapidAPI, Stripe) | Timeouts, graceful fallbacks, never block page rendering |
| Risk | AI-generated SEO text could be inaccurate | Admin reviews; schema only from verified data |


## 11. Release scope

- **Live now:** public site (home, services, Editz, work, blog, about, contact, FAQ, legal), admin suite, dynamic SEO engine, sitemaps, store, cron jobs.
- **Next:** security hardening, build gates, run database scripts, standard API, docs alignment (see task.md).
- **Later:** staging environment, Lighthouse budgets, React Query decision, cleanup of Medusa starter leftovers.


## 12. Glossary


| Term | Meaning |
|---|---|
| GEO / AEO | Generative / Answer Engine Optimisation: being cited by AI answer engines |
| JSON-LD | Structured data in a script tag that tells search engines what the page is |
| ISR | Incremental Static Regeneration: static pages refreshed on a schedule or on demand |
| RLS | Row Level Security in Supabase/PostgreSQL |
| RBAC | Role Based Access Control (roles.ts) |
| IDOR | Accessing another user's data by guessing an id |
| Editz | Mommantum's video-production service line |
| SDS | System Design Specification document in the repo |
