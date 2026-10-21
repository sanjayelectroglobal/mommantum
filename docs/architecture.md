# 2 · architecture.md — Architecture

This file defines HOW Mommantum is built and WHERE each piece lives: system parts and their jobs, the responsibility split between frontend and backend, the exact folder tree, data tables, every API route, the auth flow, state, errors, performance, rendering, environments and the SEO/schema engine. Update it whenever routes, models or structure change.

*Updated whenever structure, routes or models change · Aligned with production Next.js 15 App Router architecture*


## 1. System map


| Part | Technology | Job |
|---|---|---|
| Frontend | Next.js 15.3.9 App Router, React 19, Tailwind, Radix UI, Headless UI, Motion, lucide-react, Medusa UI | Renders pages (Server Components first), collects input, calls APIs. No business logic. |
| Backend | Next.js route handlers in src/app/api/** and server-only modules in src/lib/** | Validation, permissions, calculations, orchestration. There is no separate Node server. |
| Database / Auth | Supabase PostgreSQL 15, RLS, GoTrue Auth; anon client for public reads, service-role client (supabase-admin.ts) for admin APIs | System of record; sessions; row-level security. |
| Store engine | In-process Medusa V2 proxy at /api/store/[[...path]] using @medusajs/js-sdk | Maps Medusa storefront calls to Supabase tables (product, cart, region…). |
| Payments | Stripe (@stripe/react-stripe-js) | Card payments at checkout. |
| SEO services | Google Indexing API (googleapis), schema engine, sitemap routes | Index notifications, JSON-LD, sitemaps. |
| AI services | OpenAI / Gemini, AnswerThePublic (RapidAPI), embeddings for link suggestions | SEO auto-fill, blog drafting (via n8n), internal linking. |
| Automation | n8n workflow (mommantum_supabase.json), Vercel cron | Blog ingestion; keep-alive; monthly SEO auto-fill. |
| Hosting | Vercel (https://mommantum-main.vercel.app), custom domain www.mommantum.com | Deploy, edge middleware, cron. |


## 2. Responsibility rule (this project)

- **Frontend displays:** components in src/modules and src/app pages render data, loading and error states, and call APIs or server data functions.
- **Backend owns:** price and total calculation, cart ownership checks, role checks, slug and SEO validation, schema generation, revalidation, indexing.
- **Example:** product price and cart totals come from /api/store and src/lib/util/money.ts/get-product-price.ts on the server side of the flow; components only format and show them.
- **Example:** admin roles are decided by roles.ts plus a database lookup in auth-helpers.ts, never by a cookie the browser can edit.

## 3. Folder structure (exact tree)


```
mommantum-main/
├── .agents/ (AGENTS.md + skills: schema, internal-linking, frontend-performance,
│             project-architecture, security-hardening, sds-authoring)
├── .workrules/RULES.md               (PRIVATE, never committed; excluded via .git/info/exclude)
├── db-proposals/                     (reviewable SQL + seeds, executed by a human only)
├── docs/                             (prd, architecture, rules, design, task, memory, BRAND_GUIDELINES.md)
├── public/ images, team, blog, about, og/pages (11), og/services (16)
├── scripts/gen-faq-sql.ts
├── src/
│   ├── middleware.ts                 (at src/ root, as Next.js requires) edge: sitemap/static bypass, public bypass, admin JWT + role
│   ├── app/
│   │   ├── layout.tsx, robots.ts, opengraph-image.jpg, twitter-image.jpg
│   │   ├── sitemap/route.ts, sitemap/[type]/route.ts
│   │   ├── (store)/ about, blog, blog-ai, contact, editz, faq, services, work,
│   │   │            privacy-policy, terms-and-conditions, (main)/ home, store, products,
│   │   │            collections, categories, cart, order, account (@dashboard, @login)
│   │   ├── (checkout)/checkout/
│   │   ├── admin/ (services, blog, case-studies, products, orders, seo, users, ...)
│   │   ├── admin-login/
│   │   └── api/ admin/*, auth/*, blog/publish, cron/seo-auto-fill, keep-alive, store/*
│   ├── lib/
│   │   ├── config/roles.ts           RBAC matrix (admin, manager, seo, content_manager, ...)
│   │   ├── config.ts                 Medusa SDK client pointed at /api
│   │   ├── auth-helpers.ts           session + role verification
│   │   ├── supabase.ts / supabase-server.ts / supabase-admin.ts
│   │   ├── revalidate.ts             revalidateContent({type, slug, oldSlug})
│   │   ├── validation.ts             Zod schemas
│   │   ├── fonts.ts                  Epilogue, Outfit, Mansalva, Cormorant Garamond, DM Sans
│   │   ├── data/                     fetch layer: services, blog-posts, case-studies, seo, page-faqs, home-faqs,
│   │   │                             all-faqs, cart, orders, products, collections, categories, customer, regions,
│   │   │                             payment, fulfillment, onboarding, locales, cookies, variants
│   │   ├── schema/                   generate-graph.ts (orchestrator), build-graph.ts, serialize.ts (XSS-safe),
│   │   │                             validate.ts, config.ts, site.ts, page-defaults.ts, strip-ecommerce.ts,
│   │   │                             resolvers/ (page, service, blog, case-study, collection),
│   │   │                             templates/ (12 node builders), __tests__/
│   │   ├── services/                 ai-seo-service, indexer, linking-service
│   │   ├── util/ env, money, product, sort-products, medusa-error, linker ...
│   │   ├── hooks/ , context/modal-context.tsx
│   │   ├── modules/  (domain UI) account, cart, categories, checkout, collections, common,
│   │             contact, editz, home, layout, order, products, shipping, skeletons, store
│   ├── components/ KeepAlive.tsx, RelatedLinks.tsx
│   ├── styles/globals.css            Tailwind layers + input and autofill utilities
│   └── types/
├── next.config.js, tailwind.config.js, tsconfig.json, vitest.config.mjs, vercel.json
└── package.json (npm@11.7.0)
```


## 4. Data models (Supabase tables found in code)


| Group | Tables | Key notes |
|---|---|---|
| Content | services, case_studies, post (blog), testimonials, site_setting, site_keywords | Slug unique; FAQs and keywords stored as data; schema_json column kept but no longer read. |
| SEO | seo_setting (also referenced as seo_settings, verify), link_suggestion, link_embedding, organization_profile (proposed) | seo_setting keyed by page_key; embeddings power internal links; organization_profile is the single business-facts row. |
| Identity | profiles (role), customer | Role from profiles table, verified server-side. Roles: admin, manager, seo, content_manager and others in roles.ts. |
| Catalog | product, product_variant, product_collection, product_category, price_set, price, product_variant_price_set | Medusa-compatible shape. |
| Cart / Order | cart, cart_line_item, cart_address, cart_shipping_method, order, order_item, order_line_item, order_address | Cart access must be bound to its owner. |
| Region / shipping | region, region_country, shipping_option | Default region "in", currency INR. |

*Action: run a schema export from Supabase and paste the exact column lists here (field, type, relation, validation). Code scanning confirms table names and usage; exact columns must be copied from the live database because no DDL ships in the zip except db-proposals.*


## 5. API route map (contract)


| Route | Method | Auth | Purpose / errors |
|---|---|---|---|
| /api/auth/login, /logout, /callback, /me | POST/GET | Public → session | Supabase session cookies. /api/auth/dev-login must be disabled in production. |
| /api/admin/auth | POST | Admin secret / session | Admin session check. |
| /api/admin/services, /services/[slug] | GET POST PUT DELETE | Role: admin, manager | Service CRUD, revalidate tag "services". |
| /api/admin/blog, /blog/[slug], /blog/images | GET POST PUT DELETE | admin, manager, seo, content_manager | Blog CRUD, image upload, revalidate "blog-posts". |
| /api/admin/case-studies, /[id] | CRUD | admin, manager | Case studies, revalidate "case-studies". |
| /api/admin/seo, /seo/site, /seo/preview, /seo/internal-linking/* | GET PUT POST | admin, manager | seo_setting rows, site SEO, preview, link sync/test. |
| /api/admin/products, collections, categories, orders (+ /[id]) | CRUD | admin, manager | Store management. |
| /api/admin/users (+ /[id]), stats, keywords (+ /[id]), custom/meta-listing, jobs/seo-auto-fill | mixed | admin (users) / role list | User management and operations. |
| /api/blog/publish | POST | Secret header (n8n) | Ingestion; triggers indexer + revalidation. |
| /api/cron/seo-auto-fill | GET | CRON_SECRET (must be enforced) | Monthly AI SEO fill. 401 if secret wrong. |
| /api/keep-alive | GET | Public (cron) | Daily DB ping. |
| /api/store/[[...path]] | All | Cart owner / public | Medusa-compatible: products, carts, shipping-options, payment-collections. |
| /api/store/internal-linking/[type]/[id] | GET | Public | Related link suggestions. |
| /sitemap, /sitemap/[type] | GET | Public | XML sitemaps. |

**Standard error shape (target):** `{ success:false, data:null, error:{ code, message }, meta:null }`. Status codes: 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 429 rate limit, 500 internal.


## 6. Auth flow


```
Browser → POST /api/auth/login → Supabase GoTrue → sb-access-token (httpOnly cookie)
Request to /admin/* → middleware.ts:
   1. 404 for /admin/schema and /api/admin/schema
   2. bypass: /sitemap, /_next, /api/*, files, public routes (0 DB queries)
   3. resolve CUSTOM_ADMIN_PATH (default "admin"); no token → 404/307 to /admin-login
   4. parse JWT exp/sub, look up role in profiles (short-lived cache), isPathAllowed(role, path)
   5. allowed → rewrite to internal /admin page
API handlers re-check role with auth-helpers.ts (defence in depth)
```

Target changes from the audit: never read the sb-role cookie; no automatic admin provisioning on first login; add Origin/CSRF check on mutating admin routes; refresh and revoke per rule 11 as supported by Supabase.


## 7. State plan

- **Server state:** Server Components calling src/lib/data/* wrapped in unstable_cache with tags; client interactions use the Medusa SDK and Server Actions.
- **UI state:** React useState and modal-context only. API data is not duplicated into client stores.
- **Gap:** SOP rule 8 asks for React Query; not installed. Decision needed: adopt for client-side lists or record an exception (see memory.md D-04).


## 8. Error flow

Supabase/Stripe error → data function or route handler → typed error (medusa-error.ts for store calls) → route returns standard error JSON with status → client shows a clear message → page-level error.tsx boundary. No empty catch blocks (the current middleware parseJwt catch returns null by design and is commented).


## 9. Performance plan

- Public routes bypass DB work in middleware; pages use ISR plus unstable_cache and tag revalidation.
- next.config.js headers: no-store for dynamic/admin, public s-maxage=60 stale-while-revalidate=300 for cacheable responses.
- Pagination on all list endpoints; indexes on slug, page_key, status; avoid N+1 in admin lists.
- Images via next/image with 1200×630 OG assets pre-rendered in public/og.
- API-call budget: 1 data call per server-rendered section; no API calls in loops.


## 10. Rendering


| Page | Mode |
|---|---|
| Home, About, Contact, FAQ, Legal, Editz | SSG/ISR |
| Services, Work, Blog (index and detail) | ISR with tag revalidation |
| Store, products, collections, categories | ISR / dynamic with cache tags |
| Cart, checkout, account, order, admin | Dynamic SSR, noindex |
| sitemap, robots | Route handlers / metadata routes |


## 11. Environments


| Env | Purpose | Config |
|---|---|---|
| dev | localhost:8000 (next dev -p 8000) | .env.local, never committed |
| staging | To create: Vercel preview; noindex forced | Separate Supabase project recommended |
| production | www.mommantum.com on Vercel | Vercel env vars; indexable |

**Environment variables** (documented in .env.example, no values): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_MEDUSA_BACKEND_URL, NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY, NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID, NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY, NEXT_PUBLIC_STRIPE_KEY, STRIPE_API_KEY, STRIPE_SECRET_KEY, ADMIN_SECRET, CRON_SECRET, CUSTOM_ADMIN_PATH, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, OPENAI_API_KEY, RAPIDAPI_KEY, ANSWER_THE_PUBLIC_KEY, VERCEL_URL.


## 12. Dynamic SEO and schema architecture

- One resolver per route type (page, service, blog, case-study, collection) feeds **both** generateMetadata() and the JSON-LD @graph, so they cannot drift.
- generate-graph.ts orchestrates and build-graph.ts assembles WebSite, Organization, Person (founder), WebPage, BreadcrumbList, FAQPage, Service, BlogPosting, CaseStudy, Collection/ItemList, Product, ProfessionalService nodes with stable @id URIs such as https://www.mommantum.com/#organization.
- `src/lib/schema/site.ts` (and `config.ts`) is the central code location for confirmed brand facts (`DEFAULT_ORGANIZATION_PROFILE`); `organization_profile` table is the data source after the SQL runs; `inLanguage` is `en-IN`.
- serialize escapes output to prevent XSS; validate/sanitize drop invalid nodes; tests in src/lib/schema/__tests__ (build-graph, revalidate) run with vitest.
- revalidate.ts matrix: service → tag services + /services, /services/{slug} (old+new), /; blog → blog-posts; case study → case-studies + /work; seo_setting → tag + page path; site_setting → revalidatePath("/", "layout").
- Rule: no aggregateRating or review; omit missing optional properties; never fabricate authors, dates, images or FAQs.


## 13. Mapping to the SOP four-layer rule


| SOP layer | Where it lives in Mommantum |
|---|---|
| routes | src/app/api/**/route.ts export handlers (URL → handler only) |
| controller | The handler body: read request, call service, return response |
| service (all logic) | src/lib/services/*, src/lib/schema/*, src/lib/revalidate.ts, src/lib/util/* (to extract from handlers where logic leaks) |
| repository (DB only) | src/lib/data/* and Supabase calls; target: no business logic inside them |


## 14. Local setup and commands


| Command | What it does |
|---|---|
| npm install | Installs dependencies (npm 11.7.0) |
| npm run dev | Dev server on http://localhost:8000 |
| npm run dev:clean | Deletes .next cache then starts dev |
| npm run typecheck | tsc --noEmit type check |
| npm run lint | next lint |
| npm test | vitest run (schema tests) |
| npm run build / start | Production build / serve on port 8000 |
| npm run analyze | Build with bundle analyzer |

Setup: copy .env.example to .env.local, fill values from the secret holder, run npm install and npm run dev. Never commit .env.local.


## 15. Caching and revalidation map


| Content changed | Tag / paths refreshed |
|---|---|
| Service | tag services; /services, /services/{slug} (old and new), / |
| Blog post | tag blog-posts; /blog, /blog/{slug} |
| Case study | tag case-studies; /work, /work/{slug} |
| SEO setting | seo tag; the page path of that page_key |
| Site setting | revalidatePath("/", "layout") |
| Store product / collection | Medusa-style proxy cache tags; store paths |

Every admin save API must call revalidateContent() from src/lib/revalidate.ts, otherwise the public page stays stale.


## 16. Scheduled jobs and automation


| Job | Schedule (vercel.json) | Purpose |
|---|---|---|
| /api/keep-alive | Daily 00:00 UTC | Pings Supabase so the project does not pause |
| /api/cron/seo-auto-fill | 1st of month 00:00 UTC | AI fills missing SEO fields; must verify CRON_SECRET |
| /api/blog/publish | On demand (n8n) | Receives automated blog posts, then indexes and revalidates |


## 17. Admin panel pages

src/app/admin contains: services, blog, case-studies, products, collections, categories, orders, customers, inventory, promotions, price-lists, pages, seo, sitemap and users, with shared _components and _lib. Access per role is defined in src/lib/config/roles.ts; hidden path controlled by CUSTOM_ADMIN_PATH.


## 18. Third-party failure handling

- Stripe down: checkout shows a clear error, cart is kept.
- Google Indexing API fails: log and continue; publishing is never blocked.
- OpenAI/Gemini/RapidAPI fail or time out: skip auto-fill for that item, retry next run.
- Supabase slow: cached pages keep serving; admin shows an error message.
- Use timeouts on every external call; never put secrets in logs.


## 19. Logging, monitoring and backups

- Server errors logged without tokens, passwords or full phone numbers.
- Check Vercel logs and Search Console coverage weekly.
- Backup database (export) before every SQL proposal runs; store in db-proposals/backups, outside git history of secrets.
- Rotate keys when a developer leaves or a key is exposed.
