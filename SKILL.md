---
name: frontend-performance
description: Guidelines and best practices for Next.js frontend performance optimizations, image delivery, caching, and layout stability.
---

# Next.js Frontend Performance Optimization Guidelines

Use this skill to optimize page load speeds, Lighthouse scores, and core web vitals (LCP, FCP, CLS, TTFB) in Next.js storefronts.

---

## 1. Zero-Blocking Middleware (TTFB Optimization)
Next.js middleware runs on **every single request** before any page begins rendering. Any database check inside the middleware blocks the page from displaying (Time to First Byte delay).

### 💡 The Rule:
* **Never query databases or APIs in the middleware for public pages.**
* Implement a **Public Route Bypass** check at the very beginning of the middleware. If the route is a public storefront path (e.g. `/`, `/blog`, `/products`, etc.), bypass the database settings check immediately:

```typescript
// Skip database queries in middleware for all known public routes
const isPublicRoute = 
  pathname === "/" ||
  pathname.startsWith("/blog") ||
  pathname.startsWith("/work") ||
  pathname.startsWith("/products");

if (isPublicRoute) {
  return NextResponse.next();
}
```

---

## 2. Eliminate Duplicate Layouts & Image Downloads (Mobile Performance)
Mobile performance suffers when desktop layouts are hidden with Tailwind (`hidden lg:block`) but are still present in the HTML DOM. Browsers will download **both** the desktop and mobile image tags, wasting bandwidth and delaying rendering.

### 💡 The Rule:
* **Unify layouts instead of duplicating them.** Use responsive Tailwind Grid/Flex configurations and the CSS `order` property to shift layout positions on mobile rather than duplicating component blocks:

```tsx
{/* One single unified DOM container */}
<div className="grid lg:grid-cols-2">
  {/* Shuffled on mobile using order classes */}
  <div className="order-2 lg:order-1">
    <Image src="/hero-girl.png" priority sizes="(max-width: 1024px) 280px, 620px" />
  </div>
  <div className="order-1 lg:order-2">
    <h1>We make it scalable</h1>
  </div>
</div>
```

---

## 3. Supply Responsive Image `sizes` (Lighthouse Image Delivery)
If you don't declare the `sizes` attribute on `<Image />`, Next.js defaults to generation lists up to 100vw (e.g. 1920px+). On high-DPI/Retina screens, browsers will fetch huge desktop-sized images for small layout containers.

### 💡 The Rule:
* **Always match the layout width using the `sizes` attribute.** Tell the browser the maximum width the image container will take:

```tsx
// If the image maxes out at 420px on desktop and is 320px on tablet:
sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 420px"
```

---

## 4. Cache-Control Tuning (Asset Cache Lifetimes)
Next.js naturally caches optimized images (`_next/image`) for 1 year. However, global Cache-Control headers can override and reset this cache life, forcing browsers to re-request optimized images continuously.

### 💡 The Rule:
* Ensure your `next.config.js` Cache-Control header rules explicitly ignore system optimization paths (`_next/image`, `_next/static`):

```javascript
// Exclude static asset and image optimization paths from short stale headers
source: "/((?!_next/static|_next/image|favicon.ico|images|assets).*)"
```

---

## 5. Prevent Static De-optimization (Suspense Wrapping)
Using Next.js hooks like `useSearchParams()` inside a client component de-optimizes the entire route and forces Next.js to render the page dynamically at request time (disabling SSG/ISR).

### 💡 The Rule:
* **Always wrap query-parameter components in `<Suspense>` boundaries.** This isolates the dynamic search parameters lookup, allowing the rest of the parent page to build statically:

```tsx
export default function RefinementListWrapper(props: Props) {
  return (
    <Suspense fallback={<Skeleton />}>
      <RefinementListInner {...props} />
    </Suspense>
  )
}
```

---

## 6. Pre-render Warm-up (Endpoint Preloading)
Newly published items (e.g., blogs published via n8n) aren't built at compilation time. The very first user to open the URL will experience a "cold start" wait while Next.js generates the page.

### 💡 The Rule:
* **Warm up the cache automatically.** In your publishing API endpoint, trigger a background `fetch` to the newly created URL immediately after inserting the post. Next.js will build and cache the page in the background, making it load instantly when clicked by a user:

```typescript
// Pre-render the newly published page in the background
fetch(postUrl).catch((e) => console.error("Cache warm-up failed", e));
```
