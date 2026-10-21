# Software Design Specification (SDS): Mommantum Studio & Storefront

> **Document Version:** 2.1.0  
> **Classification:** Technical Architecture & System Design Specification  
> **Status:** Active / Production Baseline  
> **Author:** Architecture Engineering Team  

---

## 1. System Scope & Engineering Objectives

The **Mommantum System** is designed to satisfy three high-performance engineering requirements:
1. **Ultra-Low Latency Public Experience:** Sub-200ms TTFB for all marketing and portfolio pages through edge bypass, static generation (SSG/ISR), and memory-cached database queries.
2. **Unified Semantic Graph (SEO & GEO):** 100% Schema.org compliant, single-script connected graph structure for search engines (Google Rich Results) and Generative AI engines (AEO/GEO).
3. **Serverless Full-Stack Resilience:** Fully decoupled front-end and back-end pipelines leveraging Next.js 15 App Router on Vercel and PostgreSQL with Row Level Security on Supabase.

---

## 2. High-Level Architecture (C4 Level 2: Container Diagram)

```mermaid
graph TB
    subgraph Clients["Client Tier"]
        Browser[Web Browser / Mobile User]
        Bot[Search Engine Crawler / AI Agent]
        AdminUser[Mommantum Administrator]
    end

    subgraph CDN["Edge & Delivery Tier (Vercel)"]
        EdgeRouter[Vercel Global Edge Network]
        Middleware[Next.js Middleware: Routing & Bypass]
    end

    subgraph AppServer["Application Tier (Next.js 15 Serverless)"]
        SSR[Server Components & Pages]
        SchemaEngine[Unified Schema & Resolver Engine]
        StoreProxy[Simulated Medusa Store Proxy /api/store]
        AdminAPI[Protected Admin REST APIs /api/admin]
        CronEngine[Background Cron & Auto-Fill /api/cron]
    end

    subgraph DataTier["Data & Persistence Tier (Supabase)"]
        Postgres[(Supabase PostgreSQL 15)]
        AuthService[Supabase GoTrue Auth]
        StorageBucket[Supabase Storage Buckets]
    end

    subgraph External["External Integrations"]
        N8N[n8n Workflow Automation]
        GoogleAPI[Google Indexing API v3]
        OpenAI[OpenAI / Gemini LLM API]
        AnswerPublic[AnswerThePublic API]
    end

    Browser --> EdgeRouter
    Bot --> EdgeRouter
    AdminUser --> EdgeRouter
    EdgeRouter --> Middleware
    Middleware --> SSR
    Middleware --> AdminAPI
    Middleware --> StoreProxy
    SSR --> SchemaEngine
    SSR --> Postgres
    AdminAPI --> Postgres
    StoreProxy --> Postgres
    AdminAPI --> AuthService
    CronEngine --> OpenAI
    CronEngine --> AnswerPublic
    CronEngine --> Postgres
    N8N --> Postgres
    AdminAPI --> GoogleAPI
    SSR --> StorageBucket
```

---

## 3. Component Architecture & Design Patterns

### 3.1. The Resolver-Registry-Graph Pattern

To eliminate schema duplication and drift between visible HTML and metadata, the system implements a strict functional pipeline:

```
[Database Content Rows] + [seo_setting Record]
                  │
                  ▼
         [Entity Resolver]  (e.g., resolveServiceData)
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
[generateMetadata]     [buildGraph]
(OG/Twitter/Meta)             │
                              ▼
                     [Single Graph Tree]
                              │
                              ▼
                     [serializeJsonLd] (XSS-Safe HTML)
                              │
                              ▼
               <script type="application/ld+json">
```

#### Core Components in `src/lib/schema/`:
* `resolvers/`: Pure functional transformers that accept domain models (e.g. `Service`, `BlogPost`) and database `SeoSetting` records, producing a normalized `ResolvedData` object.
* `templates/`: Schema.org builder functions (`createWebSiteSchema`, `createOrganizationSchema`, `createWebPageSchema`, `createBreadcrumbSchema`, `createFAQSchema`).
* `generate-graph.ts`: Assembles disparate entity nodes into an integrated `@graph` array connected via deterministic `@id` URIs.
* `serialize.ts`: Ensures safe JSON serialization by escaping script termination characters (`<`, `>`, `&`).
* `src/modules/common/components/json-ld/index.tsx`: Server Component rendering the single `<script type="application/ld+json">`.

---

## 4. Database Entity-Relationship (ER) Schema

```mermaid
erDiagram
    SITE_SETTING ||--o{ SEO_SETTING : configures
    SEO_SETTING ||--o| SERVICES : enhances
    SEO_SETTING ||--o| POST : enhances
    SERVICES ||--o{ SERVICE_FAQS : renders
    POST ||--o{ POST_FAQS : renders
    PROFILES ||--o{ USER_AUDIT : tracks
    CART ||--|{ CART_LINE_ITEM : contains
    CART ||--o| CART_ADDRESS : ships_to
    PRODUCT ||--|{ PRODUCT_VARIANT : has

    SITE_SETTING {
        bigint id PK
        text site_name
        text site_url
        text logo_url
        text favicon_url
        text brand_name
        jsonb organization_profile
        timestamptz created_at
    }

    SEO_SETTING {
        text id PK
        text page_key UK
        text page_label
        text meta_title
        text meta_description
        text slug
        text canonical_url
        boolean robots_index
        boolean robots_follow
        text primary_keyword
        text[] secondary_keywords
        text meta_keywords
        text og_title
        text og_description
        text og_image
        text twitter_card
        text twitter_image
        jsonb schema_json
        timestamptz last_updated
    }

    SERVICES {
        uuid id PK
        text slug UK
        text title
        text short_label
        text description
        text intro
        text image
        text[] points
        text[] outcomes
        jsonb faqs
        timestamptz created_at
    }

    POST {
        text id PK
        text slug UK
        text title
        text content
        text category_id
        text featured_image
        text[] image_urls
        text author_name
        text status
        jsonb faqs
        timestamptz published_at
        timestamptz created_at
    }

    PROFILES {
        uuid id PK
        text email UK
        text role
        text status
        timestamptz created_at
    }
```

---

## 5. End-to-End Sequence Flows

### 5.1. Public Service Page Request with Dynamic Schema Resolution

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Search Bot
    participant Edge as Vercel Edge Middleware
    participant Route as /services/[slug]/page.tsx
    participant Cache as Next.js unstable_cache
    participant DB as Supabase PostgreSQL
    participant Resolver as resolveServiceData()
    participant Comp as <JsonLd /> Component

    User->>Edge: GET /services/performance-marketing
    Edge->>Edge: Evaluate isPublicRoute (Match!)
    Edge->>Route: Fast Pass-through (0 DB queries)
    
    par Data Fetching
        Route->>Cache: getService("performance-marketing")
        Cache->>DB: SELECT * FROM services WHERE slug = '...'
        DB-->>Cache: Service Row
        Cache-->>Route: Service Data
    and SEO Fetching
        Route->>Cache: getSeoSetting("service:performance-marketing")
        Cache->>DB: SELECT * FROM seo_setting WHERE page_key = '...'
        DB-->>Cache: SeoSetting Row
        Cache-->>Route: SeoSetting Data
    end

    Route->>Resolver: resolveServiceData(service, seoSetting)
    Resolver->>Resolver: Compute Canonical, Merge Keywords, Fallback OG Image
    Resolver-->>Route: ResolvedData

    Route->>Route: generateMetadata() -> OpenGraph & Title Tags
    Route->>Comp: <JsonLd type="service" data={service} seoSetting={seoSetting} />
    Comp->>Comp: buildGraph() -> Connected @graph array
    Comp-->>Route: Single <script type="application/ld+json">
    Route-->>User: Server-Rendered HTML + Unified JSON-LD Graph
```

---

## 6. Multi-Tier Caching Architecture

| Level | Storage Mechanism | TTL | Cache Tags | Invalidation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **L1: Edge Role Cache** | `Map<string, RoleSession>` in `globalThis` | 15 mins | — | Token expiration or cookie removal |
| **L2: Process Memory Cache** | `inMemorySeoCache` in `src/lib/data/seo.ts` | 5 mins | — | Explicit route invalidation call |
| **L3: Next.js Data Cache** | Vercel Serverless Cache (`unstable_cache`) | 1 hour | `site_setting`, `seo_setting` | `revalidateTag("seo_setting")` |
| **L4: Static Page Revalidation** | Next.js Incremental Static Regeneration | 60–300s | Page routes | Triggered on admin edit or n8n publish |

---

## 7. Performance & Optimization Metrics

1. **Zero Layout Shift (CLS < 0.05):** Strict dimension reservation on all responsive images with explicit aspect ratios and Tailwind container widths.
2. **First Contentful Paint (FCP < 0.9s):** Google Fonts (`Epilogue`, `Outfit`, `Inter`) preloaded and optimized using Next.js Font Subsetting.
3. **Standard Share Image Dimensions:** All social previews standardized at **1200 x 630 pixels**, matching Facebook, LinkedIn, Twitter/X, and WhatsApp OpenGraph standards.
