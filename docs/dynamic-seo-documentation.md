# Dynamic SEO Schema, robots.txt, and Sitemap System Documentation

This document describes the technical implementation, architecture, and logic used to build the dynamic SEO schema markup, dynamic `robots.txt`, and automated sitemaps across the Mommantum platform.

---

## 1. Unified JSON-LD Schema Architecture (`ManualSeoSchema`)

Instead of scattering multiple isolated schema blocks across page files, all structured metadata is generated inside a unified server component: [manual-seo-schema/index.tsx](file:///c:/Users/tmalh/Downloads/mommentum%20(4)%20(1)/mommentum%20(2)/mommentum/mommentum/src/modules/common/components/manual-seo-schema/index.tsx).

### 1.1 Shared Base Entities
For every request, the schema component queries `getSiteSetting` from the Supabase caching layer to construct baseline properties:
- **`baseUrl`**: Dynamically fetched from the `site_setting` database table (falling back to `NEXT_PUBLIC_BASE_URL` or `https://mommantum.com`).
- **`brandName`**: Resolved dynamically from the site setting brand/site configuration.
- **`logoUrl`**: Absolute URL of the brand logo resolved against the dynamic base domain.

### 1.2 Multi-Entity Graph Layout
All generated page schemas are bundled inside a single `@graph` array under a root `@context: "https://schema.org"` object. This establishes references between entities and reduces HTML script tag overhead.

Every page receives:
1. **Organization Schema**: A clean brand descriptor mapping logo, name, URL, and social accounts (`sameAs` links).
   - *Local Schema Exclusion*: To avoid triggering localized search-panel overrides (e.g. `LocalBusiness`), all specific local attributes such as `address` (`PostalAddress`), geo-coordinates, or local branch phone numbers are strictly omitted.
2. **WebSite Schema**: General website identity schema referencing the brand's publisher identifier.
3. **BreadcrumbList Schema**: Generated dynamically based on the target canonical page path and node relationships.

---

### 1.3 Page-Specific Entity Mappings

| Page Type / Route | Primary Schema Entity | Fields Hydrated |
| :--- | :--- | :--- |
| **Homepage** (`/`) | `WebPage` + `FAQPage` | Site title, SEO description, meta keywords, and custom homepage accordion FAQs. |
| **Storefront catalog** (`/store`) | `CollectionPage` + `ItemList` | Dynamic inventory catalog pages mapping items, products listing URLs. |
| **Collections** (`/collections/[handle]`) | `CollectionPage` + `ItemList` | Collection title, collection description, and array of catalog products. |
| **Categories** (`/categories/[...category]`) | `CollectionPage` + `ItemList` | Product categories, descriptions, parent category relationships. |
| **Products** (`/products/[handle]`) | `Product` + `AggregateOffer` | Product handle, images lists, variations, SKU details, pricing range, and stock availability statuses. |
| **Services Listing** (`/services`) | `CollectionPage` + `ItemList` | Services title, services metadata, listing items. |
| **Services Detail** (`/services/[slug]`) | `Service` + `FAQPage` + `ItemList` | Dynamic service metadata, title, focus criteria, and dynamic FAQ accordion questions. |
| **Work Listing** (`/work`) | `CollectionPage` + `ItemList` | Portfolio entries, description, case studies references. |
| **Case Studies** (`/work/[slug]`) | `Article` | Headline, tagline, primary categories, publication dates, modification dates, and case-specific secondary keywords. |
| **Blogs Listing** (`/blog`) | `Blog` + `ItemList` + `FAQPage` | Blog posts lists, dates, and excerpt items. |
| **Blogs Detail** (`/blog/[slug]`) | `Article` + `FAQPage` | Article headline, excerpt, featured image, categories, published date, modified date, and FAQ list. |
| **Static Pages** (About, Contact, etc.) | `WebPage` + `FAQPage` | Title, description, path, page FAQs. |

---

## 2. Dynamic Sitemap Index Layout (`sitemap/route.ts`)

Instead of writing static files, Mommantum compiles dynamic XML feeds on the fly to reflect inventory and content updates instantly.

### 2.1 Sitemap Index (`/sitemap.xml`)
The main sitemap index handler (`src/app/sitemap/route.ts`) registers nested sub-sitemap XML generators:
- **`pages.xml`**: Baseline storefront pages (Home, About, Services, Contact, Blog, Work, Policies).
- **`services.xml`**: Dynamically generated list of services fetched from the Supabase database.
- **`work.xml`**: Portfolio case studies list.
- **`blogs.xml`**: Blog posts list.
- **`products.xml`** (*New*): Dynamic catalog of individual Medusa products.
- **`collections.xml`** (*New*): Dynamic list of Medusa collections.

### 2.2 Dynamic Product & Collection Feeds
- **`src/app/sitemap/products.xml/route.ts`**: Queries the Medusa Store API to retrieve the current catalog (up to 100 items), mapping canonical URLs (`/products/[handle]`), and generating priorities (`0.9`) with appropriate update timestamps.
- **`src/app/sitemap/collections.xml/route.ts`**: Lists Medusa store collections dynamically mapping canonical URLs (`/collections/[handle]`) and priorities (`0.8`).

---

## 3. Dynamic Crawler Directives (`robots.ts`)

Crawl directives are managed via the Next.js App Router handler at [src/app/robots.ts](file:///c:/Users/tmalh/Downloads/mommentum%20(4)%20(1)/mommentum%20(2)/mommentum/mommentum/src/app/robots.ts).

### 3.1 Operations & URL Logic
- **Base Domain Fetch**: Queries `site_setting` dynamically, ensuring the `Sitemap:` pointer matches the actual base URL.
- **Crawl Exclusions**: Excludes search crawlers from indexation of checkout processes, carts, user accounts, admin panels, and backend APIs:
  - `/account/`, `/wishlist/`, `/cart/`, `/checkout/`, `/order/`, `/verify-email/`, `/api/`, `/admin/` etc.
- **Aggressive Scrapers Guard**: Blocks aggressive SEO analytics tools and scrapers (like `AhrefsBot`, `SemrushBot`, `MJ12bot`, `DotBot`, `Amazonbot`, etc.) to minimize unnecessary database queries and server loads.
