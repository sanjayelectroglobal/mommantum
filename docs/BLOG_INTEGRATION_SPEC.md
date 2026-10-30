# Mommantum Blog & Publishing API Integration Guide

This document contains everything needed to integrate automated blog publishing, image uploads, content styling, brand guidelines, and internal linking for **mommantum.com**.

---

## 1. Publishing API (`POST /api/blog/publish`)

* **Endpoint:** `https://www.mommantum.com/api/blog/publish`
* **Method:** `POST`
* **Headers:**
  * `Authorization: Bearer <N8N_API_KEY>` *(or `ADMIN_SECRET`)*
  * `Content-Type: application/json`

### Exact Request JSON Body

```json
{
  "title": "Scaling D2C Brands with AI Performance Marketing in 2026",
  "slug": "scaling-d2c-brands-ai-performance-marketing",
  "status": "draft",
  "content": "<h2>Introduction</h2><p>Here is the full article content in HTML with at least 50 characters...</p>",
  "category_id": "D2C Marketing",
  "excerpt": "A deep dive into how algorithmic creative testing and AI automation scale modern D2C ecommerce brands.",
  "meta_title": "AI Performance Marketing for D2C Brands | Mommantum",
  "meta_description": "Learn how AI automation and creative testing drive sustainable ROAS for modern D2C ecommerce brands.",
  "featured_image": "https://<supabase-url>/storage/v1/object/public/blog-images/featured-cover.webp",
  "image_urls": [
    "https://<supabase-url>/storage/v1/object/public/blog-images/chart-1.webp",
    "https://<supabase-url>/storage/v1/object/public/blog-images/chart-2.webp"
  ],
  "author_name": "Mommantum Team",
  "faqs": [
    {
      "question": "What is the optimal ad budget for AI performance marketing?",
      "answer": "We recommend starting with an initial testing spend that allows at least 50 conversion events per ad set per week."
    },
    {
      "question": "How quickly can we see improvements in ROAS?",
      "answer": "Typically within the first 14 to 21 days as machine learning models calibrate with high-intent audience signals."
    }
  ]
}
```

### Field Specification Matrix

| Field | Type | Required? | Default / Notes |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Yes** | Min 3 characters. |
| `content` | `string` | **Yes** | Min 50 characters. Accepts full HTML. |
| `slug` | `string` | No | Custom URL slug. If omitted, automatically derived from `title`. |
| `status` | `"draft" \| "published"` | No | Publication status. Defaults to `"published"`. If `"draft"`, `published_at` remains null, Google indexing notification is skipped, and cache is not revalidated. |
| `category_id` | `string` | No | Defaults to `"Digital Marketing"` if omitted. |
| `meta_title` | `string` | No | Defaults to `title`. |
| `meta_description` | `string` | No | Defaults to `excerpt` or `""`. |
| `excerpt` | `string` | No | Short summary. Defaults to `""`. |
| `featured_image` | `string` | No | Public URL for the article cover image. Defaults to `null`. |
| `image_urls` | `string[]` | No | Array of supplementary image URLs. Defaults to `[]`. |
| `author_name` | `string` | No | Defaults to `"Mommantum Team"`. |
| `faqs` | `array` | No | Array of `{ "question": "string", "answer": "string" }` objects. Defaults to `[]`. |

### Draft Support
* **Optional `status: "draft"` is supported:**
  * When `status: "draft"`: The post is inserted into the Supabase database with `status: "draft"`, `published_at: null`. Google Indexing notification is **skipped**, and Next.js cache revalidation is **skipped**.
  * When `status: "published"` (or omitted): Post is marked live, `published_at` is set to current timestamp, Google Indexing API is alerted in background, and cache tags are refreshed.


### Duplicate Slug Behavior
* The URL slug is derived from the `title`:
  ```ts
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
  ```
* Supabase PostgreSQL enforces a `UNIQUE` constraint on the `post.slug` column.
* If a post with the exact same slug already exists, the database rejects the insert, aborts the request, and returns **HTTP `400 Bad Request`** with:
  ```json
  { "error": "duplicate key value violates unique constraint \"post_slug_key\"" }
  ```
* Existing posts are **never overwritten or mutated** by this endpoint.

### Response Codes & Bodies
* **`200 OK` (Success):**
  ```json
  {
    "success": true,
    "post": {
      "id": "post_9f2a8740...",
      "title": "Scaling D2C Brands with AI Performance Marketing in 2026",
      "slug": "scaling-d2c-brands-with-ai-performance-marketing-in-2026",
      "status": "published",
      "published_at": "2026-10-30T09:30:00.000Z"
    }
  }
  ```
* **`401 Unauthorized`:** Missing or invalid Bearer token:
  ```json
  { "error": "Unauthorized" }
  ```
* **`400 Bad Request`:** Zod validation failure or database error:
  ```json
  { "error": "String must contain at least 50 character(s)" }
  ```

---

## 2. Image Upload API (`POST /api/blog/upload`)

* **Endpoint:** `https://www.mommantum.com/api/blog/upload`
* **Method:** `POST`
* **Headers:**
  * `Authorization: Bearer <N8N_API_KEY>` *(or `ADMIN_SECRET`)*
  * `Content-Type: multipart/form-data`
* **Form Field:** `files` *(binary file data — supports single or multiple files; also accepts `file`)*
* **Storage Destination:** Stored inside the Supabase Storage bucket **`blog-images`** with sanitized timestamps to avoid filename collisions.

### Success Response (`200 OK`)

```json
{
  "files": [
    {
      "url": "https://<supabase-url>/storage/v1/object/public/blog-images/creative-testing-framework-1740900000000-a1b2c.webp"
    }
  ]
}
```

---

## 3. Blog HTML Rendering & Element Preservation

The blog post reader does **not** strip or sanitize your HTML with libraries like DOMPurify. It renders via `dangerouslySetInnerHTML`.

* **`<nav class="blog-toc">`:** **Preserved.** The frontend includes dedicated styling for `.blog-toc`, `.blog-toc-group`, and `.blog-toc-list`. You can provide your own `<nav class="blog-toc">`, or supply a standard `<h2>Table of Contents</h2>` + `<ul>`/`<ol>` and the system will automatically transform it into Mommantum's styled TOC block.
* **`<figure>` and `<figcaption>`:** **Preserved.** Rendered as-is with full responsive styling support.
* **`id` on `<h2>` / `<h3>`:** **Preserved.** Heading IDs and anchor links (`href="#heading-id"`) remain fully functional for in-article jump navigation.

---

## 4. Brand Guidelines

- **Legal Entity:** Mommantum
- **Headquarters:** B-147, Anand Vihar, Jagatpura, Jaipur, Rajasthan 302017, India
- **Core Market:** High-growth Direct-to-Consumer (D2C) brands and e-commerce enterprises across India and globally.
- **Brand Purpose:** Unified growth studio providing end-to-end performance marketing, SEO/GEO/AEO, AI automation, custom web/app development, copywriting, and studio video production (Editz).
- **Tone of Voice:** Confident, data-driven, direct, and authoritative. Avoid generic agency buzzwords; emphasize tangible commercial ROI, conversion rates, and proven metrics.

### Primary Color Palette

| Token | Hex Value | Usage & Application |
|---|---|---|
| **Brand Pink** | `#e61e73` | Primary brand accent, CTA buttons, badges, key metric highlights |
| **Brand Pink Hover** | `#ef3a6b` | Interactive hover and active focus states |
| **Pink Tint** | `#fff0f6` | Soft section background fills, badge surface tints |
| **Brand Navy** | `#0e2547` | Primary dark background, high-contrast headings, main body text |
| **Purple Accent** | `#9333ea` | Secondary accent, AI/automation highlights, gradient accents |
| **Purple Tint** | `#f5eeff` | AI badge surface fills, card hover glows |
| **Mint Green** | `#49d7a4` | Positive statistics, growth metric counters |
| **Orange Alert** | `#ea580c` | Warning banners, urgency badges |

---

## 5. Internal Link Directory

Use these target URLs for contextual in-text internal links inside blog articles:

### Services (`/services/*`)
* **Services Index:** `https://www.mommantum.com/services`
* **Performance Marketing:** `https://www.mommantum.com/services/performance-marketing`
* **Social Media Marketing (SMO & Content):** `https://www.mommantum.com/services/social-media-marketing`
* **Search Engine Optimization (SEO, AEO & GEO):** `https://www.mommantum.com/services/search-engine-optimization`
* **D2C Overall Branding and Scale Growth:** `https://www.mommantum.com/services/d2c-branding-scale-growth`
* **Conversion Rate Optimization (CRO):** `https://www.mommantum.com/services/conversion-rate-optimization`
* **Script & Copywriting:** `https://www.mommantum.com/services/script-copywriting`
* **Strategy & Consulting:** `https://www.mommantum.com/services/strategy-consulting`
* **Web and App Development:** `https://www.mommantum.com/services/web-app-development`
* **AI Automation:** `https://www.mommantum.com/services/ai-automation`
* **AI Agentic Service:** `https://www.mommantum.com/services/ai-agentic-service`
* **AI Video Generation:** `https://www.mommantum.com/services/ai-video-generation`
* **Editz (Video Editing & Production Studio):** `https://www.mommantum.com/editz`

### Case Studies (`/work/*`)
* **Work Index:** `https://www.mommantum.com/work`
* **The Kids Store:** `https://www.mommantum.com/work/the-kids-store`
* **Jalvayu Wellness:** `https://www.mommantum.com/work/jalvayu-wellness`
* **Urban Vada Pav:** `https://www.mommantum.com/work/urban-vada-pav`
* **ElectroGlobal:** `https://www.mommantum.com/work/electroglobal`
* **Web3 DeFi Platform:** `https://www.mommantum.com/work/web3-defi-platform`
* **Real Estate Pro:** `https://www.mommantum.com/work/real-estate-pro`
* **Personal Trainer:** `https://www.mommantum.com/work/personal-trainer`
* **HRiFlow Attendance App:** `https://www.mommantum.com/work/hriflow-attendance-app`
* **Doctors — Medical Directory:** `https://www.mommantum.com/work/doctors-medical-directory`

