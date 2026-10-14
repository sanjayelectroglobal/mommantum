# Software Design Specification: SEO & Input Validation Architecture

This Software Design Specification (SDS) outlines the architecture and implementation details of SEO configurations (robots.txt, dynamic sitemaps) and client-side data validation schemas within the ElectroGlobal website project. 

Use this document as a blueprint to copy and apply this setup to any other Next.js (App Router) project.

---

## 1. Directory Structure

In Next.js, SEO files are placed in the `app` route folder to enable server-side metadata generation. Form validation schemas reside in a shared library utility folder (`lib`).

```text
Website/
├── src/
│   ├── app/
│   │   ├── robots.ts            <-- Dynamic robots.txt generation
│   │   └── sitemap/
│   │       ├── route.ts         <-- Sitemap Index XML entrypoint
│   │       ├── pages/
│   │       ├── products/
│   │       ├── categories/
│   │       └── blogs/
│   └── lib/
│       └── validation.ts        <-- Centralized Zod Validation Schemas
```

---

## 2. Robots.txt Configuration (SEO Crawl Rules)

### Purpose
To tell search engines (Google, Bing, Yahoo) which pages they are allowed to index, block bad bots (scrapers, SEO spy tools), and point crawlers to the sitemap file.

### Implementation
Next.js supports generating `robots.txt` dynamically by exporting a default function from a `robots.ts` file in the root `app` folder.

* **File Location:** [src/app/robots.ts](file:///c:/Users/tmalh/OneDrive/Desktop/resolve/Website/src/app/robots.ts)
* **Code Implementation:**
```typescript
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://electroglobal.in"

  return {
    rules: [
      // 1. Allow all standard search engine bots (Google, Bing, Claude, Gemini, etc.)
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account/",       // Block checkout pages
          "/wishlist/",      // Block wishlist
          "/cart/",          // Block shopping cart
          "/order/",         // Block private order pages
          "/order-success/", // Block success screens
          "/verify-email/",
          "/reset-password/",
          "/api/",           // Block server API routes
          "/test-auth/",
        ],
      },
      // 2. Explicitly block aggressive crawlers/SEO scrapers
      {
        userAgent: [
          "AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "BLEXBot",
          "PetalBot", "Bytespider", "Amazonbot", "DataForSeoBot", "ZoominfoBot"
        ],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

---

## 3. Dynamic Sitemap Index Architecture

### Purpose
Rather than maintaining a heavy, static XML file, sitemaps are broken down into sub-sitemaps (Products, Categories, Blogs, Pages) and generated dynamically. This guarantees that new pages are indexed immediately.

### Implementation
A route handler (`route.ts`) compiles an XML sitemap index pointing to dynamic nested routes.

* **File Location:** [src/app/sitemap/route.ts](file:///c:/Users/tmalh/OneDrive/Desktop/resolve/Website/src/app/sitemap/route.ts)
* **Code Implementation:**
```typescript
import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://electroglobal.in"

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap/pages.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/products.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/categories.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap/blogs.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  })
}
```

---

## 4. Input & Data Schemas (Zod Validation)

### Purpose
To enforce input formats (emails, passwords, phone numbers, pincodes) on all forms before submitting them to the backend API.

### Implementation
This utilizes **Zod**, a TypeScript-first schema declaration and validation library.

* **File Location:** [src/lib/validation.ts](file:///c:/Users/tmalh/OneDrive/Desktop/resolve/Website/src/lib/validation.ts)
* **Code Implementation (Simplified Blueprint):**
```typescript
import { z } from "zod"

// 1. Reusable Validation Rules (Helpers)
const indianPhone = z
  .string()
  .min(1, "Phone is required")
  .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number")
  .transform((v) => v.replace(/\D/g, "").slice(-10))

const indianPincode = z
  .string()
  .min(1, "Pincode is required")
  .regex(/^\d{6}$/, "Must be 6 digits")

const sanitizedString = (label: string, min = 1, max = 100) =>
  z
    .string()
    .min(min, `${label} is required`)
    .max(max, `${label} is too long`)
    .transform((v) => v.trim())

// 2. Form Schemas
export const loginSchema = z.object({
  email:    z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const addressSchema = z.object({
  first_name:   sanitizedString("First name", 1, 50),
  last_name:    sanitizedString("Last name", 1, 50),
  address_1:    sanitizedString("Address", 5, 200),
  city:         sanitizedString("City", 2, 100),
  province:     sanitizedString("State", 2, 100),
  postal_code:  indianPincode,
  phone:        indianPhone,
})

// 3. Exported TypeScript Types inferred from the Schemas
export type LoginFormValues    = z.infer<typeof loginSchema>
export type AddressFormValues  = z.infer<typeof addressSchema>
```

---

## 5. Portability Checklist: How to Replicate

To copy this configuration to any new website project:

1. **Install Zod (for validation schemas):**
   ```bash
   npm install zod
   ```
2. **Setup Robots.txt:**
   * Copy the code in `robots.ts` into your new project's `/src/app/robots.ts`.
   * Update the `baseUrl` variable to point to your new site domain.
3. **Setup Sitemaps:**
   * Copy the `/sitemap` directory into your new project's `/src/app/`.
   * Update the domain URL inside `route.ts`.
   * Configure queries inside the nested routes (`products.xml`, `categories.xml`) to retrieve products/categories from your new database or headless store CMS.
4. **Setup Validation:**
   * Create `lib/validation.ts` in your new project and copy the Zod schemas.
   * Import the validation schemas in your form components (e.g. using `react-hook-form` with the `@hookform/resolvers/zod` library).
